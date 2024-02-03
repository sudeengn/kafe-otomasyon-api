const express = require('express');
const router = express();

const Order = require('../models/order');
const OrderItem = require('../models/order-item');
const Product = require('../models/product');

/*
    Burada siparişlerin hepsinin getirilmesi için api/v1/orders/ url'sine gidilmesi gerek
    Mevcut Siparişleri getiren fonksiyon ya da parametre 
*/

router.get('/', async (req, res) => {
    const orderList = await Order.find()
    .populate('user' ,'name').sort({'dateOrdered':-1})
    .populate({ 
        path: 'orderItems', populate: { 
            path: 'product', populate: 'category'}
    });

    if (!orderList) {
        res.status(500).json({ success: false })
    }
    
    res.status(200).send(orderList)
});


/*
  findById metodu, MongoDB'deki belirli bir belgeyi ID'ye göre bulmak için kullanılır.  
   bunula birlikte bu fonksiyonda siparişi bulmaya çalışır bulamaz ise err500 hatası verir sipariş bulunursa istemciye göderilir
   HTTP GET isteği için '/:id' URL yolunu dinleyen bir route tanımlanıyor.
*/


router.get('/:id', async (req, res) => {
    const order = await Order.findById(req.params.id).populate('name', 'user');

    if (!order) {
        res.status(500).json({ success: false })
    }
    res.send(order)
});

/*
  Gelen POST isteğinin içindeki orderItems dizisi üzerinde bir map fonksiyonu kullanılır. Bu dizi, yeni sipariş öğelerini temsil eder.
  Her bir orderItem için yeni bir OrderItem belgesi oluşturulur ve bu belge veritabanına kaydedilir.
  decreaseProductStock fonksiyonu çağrılarak, sipariş öğesine bağlı ürünün stoğu azaltılır.
  Her oluşturulan OrderItem belgesinin _id (MongoDB objectID'si) değeri, bir dizi içine eklenir.
  Promise.all kullanılarak tüm asenkron işlemlerin tamamlanması beklenir ve sonuç olarak oluşturulan tüm OrderItem belgelerinin ID'lerini içeren bir dizi elde edilir

*/

router.post('/', async (req, res) => {

    const orderItemsIds = Promise.all(req.body.orderItems.map( async (orderItem) => {
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        newOrderItem = await newOrderItem.save();

        return newOrderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
        const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price')
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice
    }))

    const totalPrice = totalPrices.reduce((a, b) => a+ b , 0 );

    let order = new Order({
        orderItems: orderItemsIdsResolved,
        status: req.body.status,
        totalPrice: totalPrice,
    })

    order = await order.save();
    res.status(200).send({
        "Order": "Order created successfully"
    })

});



/*
Bu satırda, Order modeli kullanılarak veritabanındaki belirli bir siparişi güncellemek için findByIdAndUpdate metodunu kullanıyoruz.
req.params.id ifadesi, URL'de belirtilen dinamik ID parametresine karşılık gelir. Bu metot, belirtilen ID'ye sahip siparişi bulur, verilen güncelleme verilerini uygular ve güncellenmiş siparişi döndürür.
Eğer sipariş bulunamazsa, 404 Not Found diye hata mesajı yollar 
var ise güncellenmiş sipariş istemciye gönderir
*/


router.put('/:id', async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status,
    }, {
        new: "Standing"
    })

    if (!order)
        return res.status(404).send({
         success: false,
         message : 'Order cannot be created'
        })

    res.send(order);
})

// ceyhun işiyor

/*
 belirli bir siparişi ve bu siparihe bağlı olan sipariş öğelerini silen bir route temsil eder 
 Order modeli kullanılarak belirli bir siparişi ID'ye göre bulup kaldırmak için findByIdAndRemove fonksiyonu kullanılır.
 then(async order => {: Bu blok, findByIdAndRemove işleminin sonucunu ele alır. Eğer sipariş bulunursa, işleme devam eder.
    await order.orderItems.map(async orderItem => { await OrderItem.findByIdAndRemove(orderItem); });: Bu satırda, siparihe bağlı olan her bir sipariş öğesini bulup kaldırmak için map fonksiyonu kullanılır. Her bir sipariş öğesi ID'si kullanılarak OrderItem.findByIdAndRemove fonksiyonu ile kaldırılır.
*/

router.delete('/:id', (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
            await order.orderItems.map(async orderItem =>{
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({ success: true, message: 'Order deleted successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Order cannot find' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})

/*
Bu kod, try-catch blokları kullanarak hata yönetimi ekler.
 Eğer belirli bir aşamada bir hata oluşursa, hata durumunu ve uygun bir hata mesajını içeren bir JSON yanıtı döner. 
 Ayrıca, Order.aggregate sonucu boş bir dizi dönerse veya herhangi bir hata oluşursa bu durumlar da kontrol edilmekte ve uygun hata mesajlarıyla birlikte uygun HTTP durumları dönmektedir.
*/


router.get('/get/count', async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count);
    if (!orderCount) {
        res.status(500), json({ success: false })
    }
    res.status(200).send({
        orderCount: orderCount
    });
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: {_id: null, totalsales:{ $sum :'$totalPrice'}}}
    ])

    if (!totalSales){
        return res.status(400).send('the order sales cannot be generated')
    }
    res.send({ totalsales: totalSales.pop().totalsales})
})

/*
Kullanıcının siparişlerini bul komutu içerir ilişkisel veritabanı modeli ile çöz komutu vardır
Bu kod, kullanıcının siparişlerini getirmek için işlev görür

*/


router.get('/get/usersorders/:userid', async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid})
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'
            }
        }).sort({ 'dateOrdered': -1 });

    if (!userOrderList) {
        res.status(500).json({ success: false })
    }
    res.send(userOrderList)
})

module.exports = router;
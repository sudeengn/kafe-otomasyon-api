const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const Product = require('../models/product');
const Category = require('../models/category');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

/*
diskStorage fonksiyonu, dosya depolama seçeneklerini yapılandırmak için kullandım
destination: Yüklenen dosyaların nereye kaydedileceğini belirler
 public/uploads klasörüne kaydedilmesi sağlanmıştır. 
 cb (callback) fonksiyonu, işlem tamamlandığında çağrılır ve uploadError kullanılarak geçerlilik kontrolü yapılır.
 filename Yüklenen dosyanın nasıl adlandırılacağını belirler
 */


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type');
        if(isValid){
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
})
//upload: multer fonksiyonu, yükleme yapılandırmasını içeren bir nesne oluşturur
// Bu nesne, storage özelliği aracılığıyla yukarıda tanımlanan disk depolama yapılandırmasını kullanır ve yükleme işleminde ana nesnedir

const upload  = multer({ storage: storage })

/*
Bu kısım, gelen isteğin sorgu parametrelerini kontrol eder. Eğer istekte "categories" adında bir parametre varsa, bu parametre alınır ve virgülle ayrılmış bir dizi haline getirilir
Bu dizi, MongoDB sorgusunda bir filtre oluşturmak için kullanılır. Eğer "categories" parametresi yoksa, filter boş bir nesne olarak kalır.
*/
router.get('/', async (req, res)=> {

    let filter = {};
    if(req.query.categories)
    {
        filter = {category: req.query.categories.split(',')}
    }
/*
Bu kısım, MongoDB veritabanında Product modelindeki ürünleri filter parametresine göre çeker
populate fonksiyonu, ilgili category alanındaki referansı çözerek gerçek kategori bilgilerini ekler. Bu sayede ürünlerin kategorilerine erişebilirsiniz.
*/
    const productList = await Product.find(filter).populate('category');
    // const productList = await Product.find(filter).select('name image');
    if (!productList) {
        res.status(500), json({success:false})
    }
    res.status(200).send(productList);
})
/*
 Express.js uygulamasındaki router'a iki farklı endpoint ekler
 . İlk endpoint, belirli bir ürün ID'sine sahip bir ürünü getirmek için kullanılır.
  İkinci endpoint ise yeni bir ürün eklemek için kullanılır
  biri ürün getirirken diğeri ürün ekliyor
*/
router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
        res.status(500).json({ success: false, message: 'The product with the given ID not exists' })
    }
    res.status(200).send(product)
})

router.post('/', async (req, res) => {

    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product ID')
    }

    // const category = await Category.findById(req.body.category);
    // if (!category)
    //     return res.status(400).send('Invalid Category')

    // const file = req.file;
    // if (!file)
    //     return res.status(400).send('No image in the request')

    // const fileName = file.filename;
    // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;


    // Express.js uygulamasında bir ürün eklemek ve yeni bir ürün nesnesi oluşturur 

    var product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('Product cannot be created')

    res.send(product);
})
/*
ürün güncellemek için kullandım bu kodu
*/
router.put('/:id', async (req, res) => {

    const category = await Category.findById(req.body.category);
    if (!category)
        return res.status(400).send('Invalid Category')

    const product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    }, {
        new: true
    })

    if (!product)
        return res.status(500).send('Product cannot be updated')
    res.send(product);
})
/*
Bu route, "/:id" ile belirtilen bir parametreyi kullanarak bir ürünü veritabanından silmeyi amaçlar. 
*/
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'Product deleted successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Product cannot find' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})
/*
Product.countDocuments fonksiyonu kullanılarak tüm ürünlerin sayısı alınır
*/
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count)=>count);
    if (!productCount) {
        res.status(500), json({ success: false })
    }
    res.status(200).send({
        productCount: productCount
    });
})
/*
req.params.count kullanılarak isteğin URL parametresinden "count" değeri alınır veya varsayılan olarak 0 atanır.
 Product.find fonksiyonu kullanılarak belirtilen sayıda öne çıkan ürünler alınır.
  Eğer bu ürünler falsy bir değerse (yoksa veya sıfırsa), HTTP durum kodu 500 ile birlikte başarısız bir JSON yanıtı gönderilir.
   Aksi takdirde, öne çıkan ürünleri içeren başarılı bir JSON yanıtı gönderilir.
*/
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count: 0
    const products = await Product.find({ isFeatured: true}).limit(+count);
    if (!products) {
        res.status(500), json({ success: false })
    }
    res.status(200).send(products);
})

/*
Bu kod  bir Express.js uygulamasında, ürün galerisine ait görselleri güncellemek için kullanılan bir HTTP PUT endpoint'i tanımlar.
 Bu adres, sunucunun protokolünü (http veya https), host adresini ve dosyanın yükleneceği yol bilgisini içerir.

if(files) { ... }: Eğer dosyalar mevcutsa, her bir dosyanın adı ile basePath birleştirilerek imagesPaths dizisine eklenir.
 Bu, güncellenen ürünün galerisindeki görsel dosyalarının tam yollarını oluşturur.
 const product = await Product.findByIdAndUpdate(req.params.id, { ... }, { ... });: MongoDB'deki Product modelini kullanarak belirtilen id'ye sahip ürünün galeri görsellerini günceller. 
 Yeni dosya yollarını içeren bir nesne ({ images: imagesPaths }) kullanılır.
*/
router.put('/gallery-images/:id', upload.array('images', 10), async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        res.status(400).send('Invalid Product ID')
    }

    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if(files){
        files.map(file => {
            imagesPaths.push(`${basePath}${file.fileName}`);
        })
    }

    const product = await Product.findByIdAndUpdate(req.params.id, {

        image: imagesPaths,
    },
    {
        new: true
    })

    if (!product)
        return res.status(500).send('Product cannot be updated')
    res.send(product);
})

module.exports = router;
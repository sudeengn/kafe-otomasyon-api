const Product = require('../models/product');

// Stocktan düşme 
async function decreaseProductStock(productId, quantity) {
    // Ürünü Bulma işlemi
    const product = await Product.findById(productId);

    // Ürün yoksa
    if (!product) {
        throw new Error('Ürün bulunamadı');
    }


    // Stoktan düşürme işlemi
    product.countInStock -= quantity;

    // Güncellenmiş ürünü veritabanına kaydetme
    await product.save();
}






module.exports = { decreaseProductStock } 
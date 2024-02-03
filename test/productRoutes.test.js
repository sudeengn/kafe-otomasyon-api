const request = require('supertest')
const app = require('../app')
const chai = require('chai')
const { expect } = chai;

chai.use(require('chai-http'))


describe('Product Test :( ', () => {
    it('Ürün ekleniyor mu?', async () => {
        const response = await request(app)
        .post('/api/v1/products')
        .send({
            name: "Product 1",
            description: "Description",
            richDescription: "Rich Description",
            image: "image",
            brand: "Brand 1",
            price: 50,
            countInStock: 100,
            rating: 4.5,
            numReviews: 40,
            isFeatured: true
        });

        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.have.property('name', 'Product 1');
        chai.expect(response.body).to.have.property('price', 50);
        
    })
    it('Bakalım ürünler geliyor mu?', async () => {
        const response = await request(app)
        .post('/api/v1/products');
        chai.expect(response.status).to.equal(200);
    })
});
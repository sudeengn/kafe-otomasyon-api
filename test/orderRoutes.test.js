const request = require('supertest')
const app = require('../app')
const chai = require('chai');
const { expect } = chai;

chai.use(require('chai-http'))


describe('Order Test :( ', () => {
    it('Bakalım sipariş veriliyor mu?', async (done) => {
        const response = await request(app)
        .post('/api/v1/orders')
        .send({
            "orderItems":[
                {
                    "quantity": 2,
                    "product" : "65a58ea85daaa06a8cf61cd3"
                }
            ]
        });

        chai.expect(response.status).to.equal(200);
        done();
    })
    it('Bakalım siparişler geliyor muy!', async () => {
        const response = await request(app)
        .get('/api/v1/orders');
        chai.expect(response.status).to.equal(200);
    })
    it('Bakalım bütün siparişleri getirebiliyor mu?', async () => {
        const response = await request(app)
        .get('/api/v1/orders/get/count');
        chai.expect(response.status).to.equal(200);
    })
});
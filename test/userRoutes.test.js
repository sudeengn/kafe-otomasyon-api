const request = require('supertest');
const app = require('../app'); 
const chai = require('chai');
const { expect } = chai;

describe('User Routes', () => {
    it('Should create an admin user', async () => {
        const response = await request(app)
            .post('/api/v1/users/register')
            .send({
                name: 'Admin',
                email: 'admin@admin.com',
                password: 'password',
                phone: '+947187520',
                isAdmin: true
            });

        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.have.property('name', 'Admin');
        chai.expect(response.body).to.have.property('email', 'admin@admin.com');

    });

    it('Admin Hesabı Olarak Giriş', async () => {
        const response = await request(app)
            .post('/api/v1/users/login')
            .send({
                email: 'admin@admin.com',
                password: 'password'
            });

        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.have.property('token');

    });

    it('Kullanıcı Listesini almak', async () => {
        const response = await request(app)
            .get('/api/v1/users');

        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.be.an('array');

    });

    it('Orderların Listesini alma', async () => {
        const response = await request(app)
            .get('/api/v1/orders');

        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.be.an('array');

    });

});

const request = require('supertest');
const app = require('../app'); 
const chai = require('chai');
const { expect } = chai;

chai.use(require('chai-http'));

describe('Category Testt!!', () => {
    it('Bakalım bir Kategori yaratabilecek mi?!', async () => {
        const response = await request(app)
            .post('/api/v1/categories')
            .send({
                name: 'Tatlılar',
                icon: "icon-health",
                color: '#313131'
            });

        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.have.property('name', 'Tatlılar');
        chai.expect(response.body).to.have.property('icon', 'icon-health');

    });
    // GET CATEGORY
    it('Hmm bakalım kategorileri getirebiliyor mu?', async () => {
        const response = await request(app)
        .get('/api/v1/categories')
        chai.expect(response.status).to.equal(200);
        chai.expect(response.body).to.be.an('array');
    });
    
    // it('API kategorileri güncelleyebiliyor mu?', async (done) => {
    //     // Güncellenecek kategori ID'sini gerçek bir ID ile değiştirin
    //     const categorID = '65a4d163dc88833814decc95'; // Örneğin, güncellenecek kategori ID'si
    //     const updateData = {
    //         name: 'Niyazinin Tatlısı',
    //         icon: 'icon-niyazi',
    //         color: '#00000'
    //     };
    //     const response = await request(app).put(`/api/v1/categories/${categorID}`).send(updateData);
    //     done();
    //     chai.expect(response.status).to.equal(200);
    //     chai.expect(response.body).to.be.an('object');
    //     chai.expect(response.body.name).to.equal(updateData.name);
    //     chai.expect(response.body.icon).to.equal(updateData.icon);
    //     chai.expect(response.body.color).to.equal(updateData.color);

    // });
    // it('API CATEGORY SİLEBİLİYOR MU ?!', async () => {
    //     const categoriID = '65a4d163dc88833814decc95';
    //     const response = await request(app)
    //     .delete(`/api/v1/categories/${categoriID}`)

    //     chai.expect(response.status).to.equal(200);
    // });
    

});

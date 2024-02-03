const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000 || procces.env.PORT

require('dotenv/config');

const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*',cors());

// Middlewares
app.use(bodyParser.json({ limit: '600mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '600mb' }))
app.use(morgan('tiny'));
// app.use(authJwt());
app.use('/public/uploads', express.static( __dirname + '/public/uploads'));
// app.use(errorHandler);

const api = process.env.API_URL;
const categoriesRoute = require('./routes/categories');
const productRoute = require('./routes/products');
const userRoute = require('./routes/users');
const orderRoute = require('./routes/orders');


// Routes

app.use(`${api}/products`, productRoute);
app.use(`${api}/categories`, categoriesRoute);
app.use(`${api}/users`, userRoute);
app.use(`${api}/orders`, orderRoute);


const dbConfig = require('./config/database.config.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false

}).then(() => {
    app.listen(3000, () => {
        console.log("Server is listening on port 3000"); // eslint-disable-line
    });
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

module.exports = app; 


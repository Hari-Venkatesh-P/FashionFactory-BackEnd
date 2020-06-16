const express = require('express')
const app = express()
const router = require('express').Router()
const cors = require('cors')
const bodyparser = require('body-parser')
const mongoose = require('mongoose')

app.use(cors());

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }));

const PORT =  4000;

const URL = 'mongodb://127.0.0.1:27017/shopping';

mongoose.connect(URL, {useNewUrlParser : true},(err) => {
    if (err) {
    	console.log(err)
        console.log('Error while Connecting!')
    } else {
        console.log('Connected to Mongo DB')
    }
})

const ProductRoute = require('./Routers/ProductRoute');
app.use('/product', ProductRoute);


const CategoryRoute = require('./Routers/CategoryRouter');
app.use('/category', CategoryRoute);

const SubCategoryRoute = require('./Routers/SubCategoryRouter');
app.use('/subcategory', SubCategoryRoute);

const UserRoute = require('./Routers/UserRoute');
app.use('/user', UserRoute);

app.listen(PORT, () => {
    console.log('Server Started on PORT ' + PORT)
})
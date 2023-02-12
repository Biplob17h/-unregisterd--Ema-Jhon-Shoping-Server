const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Midlewire
app.use(cors());
app.use(express.json());

// app
app.get('/', (req, res)=>{
    res.send('ema jhon server is running!!!')
})

// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ro3yhcf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
        const emaJhonProducts = client.db('EmaJhon').collection('products')
        const emaJhonOrders = client.db('EmaJhon').collection('orders')
        app.get('/products', async(req, res)=>{
            const query = {};
            const cursor = emaJhonProducts.find(query);
            const products = await cursor.toArray()
            res.send(products)
        })
        app.post('/orders', async(req, res)=>{
            const order = req.body;
            const result =await emaJhonOrders.insertOne(order)
            res.send(result)
        })
        app.get('/orders', async(req, res)=>{
            const query = {};
            const cursor = emaJhonOrders.find(query);
            const orders = await cursor.toArray()
            res.send(orders)
        })
        app.delete('/orders/:id', async(req, res)=>{
            const id = req.params.id;
            let query = {_id : new ObjectId(id)};
            const result = await emaJhonOrders.deleteOne(query);
            res.send(result)
        })
        app.delete('/orders', async(req, res)=>{
            let query = {};
            const result = await emaJhonOrders.deleteMany(query);
            res.send(result)
        })
    }
    finally{

    }
}
run().catch((error)=>{console.log(error)})


app.listen(port, ()=>{
    console.log('server is running in port', port)
})
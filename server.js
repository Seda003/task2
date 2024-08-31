const Express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = Express();
const client = new MongoClient('mongodb://localhost:27017');


app.use(bodyParser.json());


app.get('/products', async function(req, res) {
    const products = await readFromMongo();
    res.json(products);
});


app.post('/products', async function(req, res) {
    const products = req.body;

    
    if (!Array.isArray(products) || products.some(p => !p.name || typeof p.price !== 'number')) {
        return res.status(400).json({ error: 'Invalid input: each product must have a name and price (price must be a number)' });
    }

   
    await writeToMongo(products);
    res.status(201).json({ message: 'Products added successfully' });
});


app.listen(3028, () => {
    console.log('Server is running on port 2003');
});


async function readFromMongo() {
    await client.connect();
    const db = client.db('sedaDb1');
    const product = db.collection('product');
    const cursor = product.find();
    const products = await cursor.toArray();
    return products;
}


async function writeToMongo(products) {
    await client.connect();
    const db = client.db('sedaDb1');
    const product = db.collection('product');
    await product.insertMany(products); 
}


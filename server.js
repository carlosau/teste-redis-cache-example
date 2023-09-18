const express = require('express')
const app = express()

const { createClient } = require('redis')
const client = createClient()

const getAllProducts = async() => {
    const time = Math.random() * 5000
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve([
                { id: 1, name: 'product 1' },
                { id: 2, name: 'product 2' },
                { id: 3, name: 'product 3' },
            ])
        }, time)
    })
}

app.get('/', async (req, res) => {
    
    const productsFromCache = await client.get('products')
    if (productsFromCache) {
        console.log('from cache')
        return res.send(JSON.parse(productsFromCache))
    }

    const products = await getAllProducts()
    await client.set('products', JSON.stringify(products))
    res.send(products)
})

const startup = async() => {
    await client.connect()
    app.listen(3000, () => {
        console.log('Server is running on port 3000')
    })
}

startup()
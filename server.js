const express = require('express');
const port = 5000;

const app = express();

const { nearestNeighbors} = require('./recommendation.js');

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.get('/api/recommended_items', (req, res) => {
    res.json(nearestNeighbors);
})

app.listen(port, () => console.log(`Server listening on port ${port}`));
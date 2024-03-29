const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { nearestNeighbors} = require('./recommendation.js');

app.post('/api/formdata', (req, res) => { 

    console.log(req.body);

    res.send('Recieved data');
})

// app.get('/', (req, res) => {
//     res.send("Hello World");
// })

// app.get('/api/recommended_items', (req, res) => {
//     res.json(nearestNeighbors);
// })

app.listen(port, () => console.log(`Server listening on port ${port}`));
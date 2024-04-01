const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const recommendationLogic = require('./recommendation.js');

app.post('/api/recommendationdata', (req, res) => { 
    try {
        const requestData = req.body;

        const recommendation = recommendationLogic.getKNearestNeighbors(requestData, 5);
        // Send response
        res.status(200).json(recommendation);

    } catch (error) {
        res.status(500).send('Internal server error');
    }
})

app.listen(port, () => console.log(`Server listening on port ${port}`));


module.exports = {app};
// Dont use file, just use temp variable cuz realistically different users might want recommendation and then so many json files will be created
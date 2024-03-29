const fs = require('fs');

const data_clothes = JSON.parse(fs.readFileSync('data_items.json'));

const knnGraph = buildKNNGraph();

function calculateEuclideanDistance(clothes1, clothes2) {
    //TODO
    const attributesToCompare = ['clothes_name', 'gender','category', 'retailer', 'brand'];
    let sigma = 0;
    for(const attribute of attributesToCompare) {
        if(attribute === 'clothes_name') {
            // const clothes1arr = data_clothes[clothes1].clothes_name.toLowerCase().split(" ");
            const clothes1set = new Set(clothes1.clothes_name.toLowerCase().split(" "));
            const clothes2set = new Set(clothes2.clothes_name.toLowerCase().split(" "));
            let nameSigma = 0;
            for(const substr of clothes1set) {
                nameSigma += clothes2set.has(substr) ? 0 : 1;
            }
            sigma += Math.pow(nameSigma, 2);
        }
        else {
            // If attributes are the same 0, else +1 (The smaller the value, the similar the items)
            sigma += Math.pow(clothes1[attribute].toLowerCase() === clothes2[attribute].toLowerCase() ? 0 : 1, 2);
        }     
    }
    const euclideanDistance = Math.sqrt(sigma);
    return euclideanDistance;
}

function buildKNNGraph() {
    //TODO
    const knnGraph = {};

    for(const clothesIndex1 in data_clothes) {
        const clothes1 = data_clothes[clothesIndex1];

        // Array of similarities between all clothes 
        const similarities = [];
        // console.log(clothes1);

        for (const clothesIndex2 in data_clothes) {
            // Prevent same clothes
            if(clothesIndex1 != clothesIndex2) {
                const clothes2 = data_clothes[clothesIndex2];
                // Similarity between 2 items
                const similarity = calculateEuclideanDistance(clothes1, clothes2);
                similarities.push({ clothes_index: clothesIndex2, similarity})
            }
        }
        // Sort similarties by closest
        similarities.sort((clothes1, clothes2) => clothes1.similarity - clothes2.similarity);
        knnGraph[clothesIndex1] = similarities;
    }
    return knnGraph;
}

// Returns KNearestNeighbors of selected clothing   
function getKNearestNeighbors(selectedClothesIndex, k) {
    //TODO
    const nearestNeighbors = [];
    knnGraph[selectedClothesIndex].slice(0, k).forEach(item => {
        nearestNeighbors.push(data_clothes[item.clothes_index]);
        // console.log(nearestNeighbors);
    });
    return nearestNeighbors;

}

// Testing scenario
const k = 5;
const selectedClothesIndex = 5;

const nearestNeighbors = getKNearestNeighbors(selectedClothesIndex, k)
// console.log(nearestNeighbors);

module.exports = {nearestNeighbors};
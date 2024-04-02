const fs = require('fs');

const dataset_clothes = JSON.parse(fs.readFileSync('data_items.json'));


function calculateEuclideanDistance(clothes1, clothes2) {
    //TODO
    const attributesToCompare = ['clothes_name', 'gender','category', 'retailerName', 'brand'];
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
            sigma += Math.pow(clothes1[attribute] === clothes2[attribute] ? 0 : 1, 2);
        }     
    }
    const euclideanDistance = Math.sqrt(sigma);
    return euclideanDistance;
}

function buildKNNGraph(data_clothes) {
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

function findIndexesByClothesID(requestData) {
    const indexes = [];
    for (let i = 0; i < dataset_clothes.length; i++) {
        for(let j = 0; j < requestData.length; j++)
        if (dataset_clothes[i].clothes_ID === requestData[j].clothes_ID) {
            indexes.push(i); // Add index to array if found
        }
    }
    return indexes; // Return array of indexes
}

// Returns KNearestNeighbors of selected clothing   
function getKNearestNeighbors(requestData) {
    const knnGraph = buildKNNGraph(dataset_clothes);

    const indexes = findIndexesByClothesID(requestData);
    
    const nearestNeighbors = [];

    // If shopping cart is empty
    if(indexes.length === 0) {
        return dataset_clothes;
    }
    // If 1 item in shopping cart
    else if(indexes.length === 1) {
        knnGraph[indexes[0]].forEach(item => {
            nearestNeighbors.push(dataset_clothes[item.clothes_index].clothes_ID);
        });
        return nearestNeighbors;
    }
    // If > 1 item in shopping cart
    else {
        for(let i = 0; i < indexes.length; i++) {
            knnGraph[indexes[i]].forEach(item => {
                nearestNeighbors.push(dataset_clothes[item.clothes_index].clothes_ID);
            });
        }
        return nearestNeighbors;
    }

}

module.exports = {getKNearestNeighbors};

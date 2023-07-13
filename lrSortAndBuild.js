const fs = require('fs').promises;
const path = require('path');

let inputFile = process.argv[2] || './mergedChests.json';
let outputFileName = process.argv[3] || 'lootrun.json';
const interpolateKeyword = process.argv[4] || null;
const interpolationDistance = interpolateKeyword === '--interpolate' || interpolateKeyword === '-i' ? parseInt(process.argv[5], 10) : null;
const overrideYKeyword = process.argv[6] || null;
const overrideYHeight = overrideYKeyword === '--override' || overrideYKeyword === '-o' ? parseInt(process.argv[7], 10) : null;

if (!inputFile) {
    console.error('Please provide an input file path as an argument');
    process.exit(1);
}

if (inputFile.toLowerCase() === 'default' || inputFile.toLowerCase() === 'd' || inputFile.toLowerCase() === 'def') {
    inputFile = './mergedChests.json';
}

if (!outputFileName.endsWith('.json')) {
    outputFileName += '.json';
}

const outputFile = path.resolve(__dirname, outputFileName);

function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.z - b.z, 2));
}

async function processFile() {
    try {
        const data = await fs.readFile(inputFile, 'utf8');
        let jsonData = JSON.parse(data);
        let newChests = jsonData.chests || [];

        let outputData = {
            points: [],
            chests: [],
            notes: [],
            date: ""
        };

        let lastPoint = newChests.shift();
        outputData.points.push({...lastPoint});
        outputData.chests.push(lastPoint);

        while (newChests.length > 0) {
            newChests.sort((a, b) => distance(lastPoint, a) - distance(lastPoint, b));
            let nextChest = newChests.shift();

            if (interpolationDistance !== null) {
                while (distance(lastPoint, nextChest) > interpolationDistance) {
                    let direction = {
                        x: nextChest.x - lastPoint.x,
                        y: nextChest.y - lastPoint.y,
                        z: nextChest.z - lastPoint.z,
                    };

                    let magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
                    direction.x /= magnitude;
                    direction.y /= magnitude;
                    direction.z /= magnitude;

                    lastPoint = {
                        x: lastPoint.x + direction.x * interpolationDistance,
                        y: lastPoint.y + direction.y * interpolationDistance,
                        z: lastPoint.z + direction.z * interpolationDistance,
                    };

                    outputData.points.push({...lastPoint});
                }
            }

            outputData.points.push({...nextChest});
            outputData.chests.push(nextChest);
            lastPoint = nextChest;
        }
        
        if (overrideYHeight !== null) {
            outputData.points = outputData.points.map(point => {
                let randomOffset = Math.random() * 2 - 1;
                point.y = overrideYHeight + randomOffset;
                return point;
            });
        }               

        outputData.date = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        await fs.writeFile(outputFile, JSON.stringify(outputData, null, 2));
        console.log(`File ${outputFile} has been updated.`);
    } catch (err) {
        console.error(`Error processing file ${inputFile}: ${err}`);
    }
}

processFile();

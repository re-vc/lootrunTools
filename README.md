# Chest Merge and Lootrun Building Tool

This repository contains two Node.js scripts:

1. A merge script (`lrMergeChests.js`) that processes a directory or a file with JSON files containing "chest" points, and merges them into a single output file.
2. A lootrun building script (`lrSortAndBuild.js`) that processes the merged file. It sorts the chests by distance, generates intermediate points if required, and optionally adjusts the y-coordinate (height) of all points to a specified value with a random variance of ±1.

## Prerequisites

Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).

## Installation

1. Clone this repository or download the source code.
2. Navigate to the directory containing the scripts.
3. Run `npm install` to install the required packages.

## Usage

### Merge Script

To run the merge script, use the following command:

`node lrMergeChests.js [inputPath]`

#### Parameters

* `inputPath`: The path to your input JSON file or directory containing JSON files.

#### Example

To merge chest points from multiple JSON files in a directory:

`node lrMergeChests.js ./inputDirectory`

### Interpolation Script

To run the building script, use the following command:

`node lrSortAndBuild.js [inputFile] [outputFile] [--interpolate distance] [--override height]`

#### Parameters

* `inputFile`: The path to your input JSON file. The default value is `./mergedChests.json`.
* `outputFile`: The name of the output JSON file. The default value is `lootrun.json`. If the file name does not end in `.json`, the extension will be appended automatically.
* `--interpolate distance` or `-i distance`: Optional. If provided, the script generates intermediate points between chests that are more than `distance` units apart. Replace `distance` with the maximum allowable gap between points. Note that smaller distances can significantly increase the number of points and thus the size of the output file.
* `--override height` or `-o height`: Optional. If provided, the script will set the y-coordinate (height) of all points to `height`, with a random variance of ±1. Replace `height` with the desired point height.

#### Examples

To generate a lootrun with a maximum gap of 16 units between points, and set all point heights to 128:

`node lrSortAndBuild.js ./input.json ./output.json --interpolate 16 --override 128`

To generate a lootrun with interpolated points but without overriding the height:

`node lrSortAndBuild.js ./input.json ./output.json --interpolate 16`

To generate a lootrun with just sorted points:

`node lrSortAndBuild.js ./input.json ./output.json`

## Maintenance and Contributions

While the code provided here is fully functional and has been used successfully, I do not necessarily intend to maintain or update it regularly. I will, however, try to address any major issues if they come to my attention.

This being said, I'm open to contributions from the community. If you've made improvements or fixes to the code, feel free to submit a pull request.

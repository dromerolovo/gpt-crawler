//Run this script with 
//node --no-warnings=ExperimentalWarning --loader ts-node/esm ./scripts/data_cleaning.ts --path=<your-path> --output=<output-path>

import { Argument } from 'commander'
import fs from 'fs'

var filePath = process.argv.slice(1)
var pathArgument = filePath[1]
var outputArgument = filePath[2]
var argument : string
var outputPath : string
if(pathArgument.startsWith("--path")) {
    argument = pathArgument.substring(pathArgument.indexOf('=') + 1)
} else {
    throw new Error("Argument provided should be of the following form: --path=<your-path>")
}
if(!fs.existsSync(argument)) {
    throw new Error("File doesn't exist, try changing the path")
}

if(outputArgument.startsWith("--output")) {
    outputPath = outputArgument.substring(pathArgument.indexOf('=') + 1)
} else {
    outputPath = 'output_cleaned.json'
}

const documentContent = fs.readFileSync(argument, 'utf-8');
var json : any[] = JSON.parse(documentContent);
var jsonCleaned = json.map((x) => {
    x['html'] = removeExcessBreaksOfLine(x['html'])
    return x
})

var jsonString = JSON.stringify(jsonCleaned, null, 2)

fs.writeFile(outputPath, jsonString, (err) => {
    if(err) {
        throw new Error("Couldn't write the output file with json")
    }
})

function removeExcessBreaksOfLine(json : string) : string {
    var exampleCleaned = json.replace(/(\n){2,}/g, '\n\n');
    return exampleCleaned;
}

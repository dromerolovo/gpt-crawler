//Run this script with
//node --no-warnings=ExperimentalWarning --loader ts-node/esm ./scripts/data_cleaning.ts --path=<your-path> --output=<output-path>

import { Argument } from "commander";
import fs from "fs";
import emojiRegex from "emoji-regex";

var filePath = process.argv.slice(1);
var pathArgument = filePath[1];
var outputArgument = filePath[2];
var fileTypeOutputArgument = filePath[3]
var argument: string;
var outputPath: string;
if (pathArgument.startsWith("--path")) {
  argument = pathArgument.substring(pathArgument.indexOf("=") + 1);
} else {
  throw new Error(
    "Argument provided should be of the following form: --path=<your-path>",
  );
}
if (!fs.existsSync(argument)) {
  throw new Error("File doesn't exist, try changing the path");
}

if (!outputArgument == undefined) {
  outputPath = outputArgument.substring(pathArgument.indexOf("=") + 1);
} else {
  outputPath = "output_cleaned.json";
}

const documentContent = fs.readFileSync(argument, "utf-8");
var json: any[] = JSON.parse(documentContent);
var jsonCleaned = json.map((x) => {
  x["html"] = dataCleaningPipeline(x["html"]);
  return x;
});

var jsonString = JSON.stringify(jsonCleaned, null, 2);

fs.writeFile(outputPath, jsonString, (err) => {
  if (err) {
    throw new Error("Couldn't write the output file with json");
  }
});

function dataCleaningPipeline(json: string) : string {
  var output = json
  .replace(/(Source:[\S\s]+?\.)/gm, '')
  .replace(emojiRegex(), '')
  .replace(/About\n{3}[\S\s]+?reserved./gm, '')
  .replace(/\u00A0/g, "")
  .replace(/\u0020{2,}/g, " ")
  .replace(/(\n{1,4}\u0020)/g, "\n")
  // .replace(/\n{1,4}/g, "\n")

  return output
}

function removeExcessBreaksOfLine(json: string): string {
  var exampleCleaned = json.replace(/(\n){2,}/g, "\n\n");
  return exampleCleaned;
}

function removeIcons(json: string) : string {
  const regex = emojiRegex();
  var jsonWithoutIcons = json.replace(regex, "");
  return jsonWithoutIcons;
}

function removeNoBreakSpace(json: string) : string {
  var output = json.replace(/\u00A0/g, "")
  return output;
}

function removeSpacesAndBlankCharacters(json: string) : string {
  var output = json.replace(/\u0020{2,}/g, " ")
  return output;
}

function removeIrrelevantHeaders(json: string) : void {
  var matches = json.matchAll(/(.{1,20}\\n)/gm);
  for(var val of matches) {
    console.log(val)
  }
}

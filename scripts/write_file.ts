//Run this script with
//node --no-warnings=ExperimentalWarning --loader ts-node/esm ./scripts/write_file.ts --path=<your-path> --output=<output-path>

import { Argument } from "commander";
import fs from "fs";
import emojiRegex from "emoji-regex";

var filePath = process.argv.slice(1);
var pathArgument = filePath[1];
var outputArgument = filePath[2];
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

if (outputArgument != undefined) {
  outputPath = outputArgument.substring(pathArgument.indexOf("=") + 1);
} else {
  outputPath = "output_cleaned.txt";
}

const documentContent = fs.readFileSync(argument, "utf-8");
var json: any[] = JSON.parse(documentContent);
fs.writeFileSync(outputPath, '');
json.forEach((crawledPage) => {
    let title = crawledPage["title"] as string
    let content = crawledPage["html"]
    if(title.startsWith("404") || title.startsWith("Privacy") || title.startsWith("Terms")) {
    } else {
      fs.appendFileSync(outputPath, title);
      fs.appendFileSync(outputPath, " "+(content as string).trim() + "\n\n\n\n")
    }
})

import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import path from "path";
import shuffle from "lodash.shuffle";
import { v4 } from "uuid";

const fileNames = ["bronze", "silver", "gold"];
const files = fileNames.map((fn) =>
  parse(
    fs.readFileSync(path.join(__dirname, "files", `${fn}.csv`)).toString(),
    { columns: true }
  )
);

const amendedFiles = files.map((file, index) => {
  const shuffledFile = shuffle(file);
  const updatedShuffledFile = shuffledFile.map((line, i) => ({
    id: v4(),
    tier: fileNames[index],
    token_id: i + 1,
    ...line,
  }));

  return updatedShuffledFile;
});

const joinedFile = amendedFiles.flat();

const outputCsvString = stringify(joinedFile, { header: true });

fs.writeFileSync(path.join(__dirname, "files", "output.csv"), outputCsvString);

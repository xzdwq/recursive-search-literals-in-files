import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import chalk from 'chalk';
import config from '../config.js';
import { delay } from './utils.js';

const { log } = console;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dirPath = path.resolve(__dirname, '..', config.readDir);

export const getAllFilesByExtInDir = (dir = dirPath, arrayOfFiles) => {
  let files = fs.readdirSync(dir);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const getFileExt = /[^.]+$/i;
    const fileExt = getFileExt.exec(file)[0];

    if (fs.statSync(dir + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFilesByExtInDir(dir + '/' + file, arrayOfFiles);
    } else {
      if (config.includeFileExt === '*' || config.includeFileExt.includes(fileExt)) {
        const filePath = path.join(dir, '/', file);
        if (filePath && (!config.excludeDir || !config.excludeDir.some((el) => filePath.includes(el)))) {
          arrayOfFiles.push(filePath);
        }
      }
    }
  });

  return arrayOfFiles;
};

export const readFileByPath = async (arrayFilesPath) => {
  if (config.delayReadingLinesInFile)
    log(chalk.yellow(`A loop with a ${config.delayReadingLinesInFile} millisecond delay in reading lines`));

  const data = [];
  try {
    for await (const filePath of arrayFilesPath) {
      if (!config.excludeDir || !config.excludeDir.some((el) => filePath.includes(el))) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');

        let lineNumber = 1;
        for await (const content of lines) {
          if (content !== '\r') {
            const matchContent = config.regexpTrigger.exec(content);
            if (matchContent) {
              const contentLine = matchContent.input.trim();

              if (config.delayReadingLinesInFile) await delay(config.delayReadingLinesInFile);

              data.push({
                FilePath: filePath,
                TextLine: lineNumber,
                Content: contentLine,
              });
            }
          }
          lineNumber++;
        }
      }
    }
  } catch (e) {
    log(chalk.red('Read file error: '), e);
  }
  return data;
};

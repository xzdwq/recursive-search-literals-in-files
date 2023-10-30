import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import writeXlsxFile from 'write-excel-file/node';
import chalk from 'chalk';
import config from '../config.js';

const { log } = console;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const outputResult = async (data, outputExt = 'json') => {
  if (data.length) {
    log(chalk.cyan(`${data.length} lines formed. Writing an output-file...`));
    try {
      const fileName = config.outputFileName;
      const outputDir = path.resolve(__dirname, '..', 'output');
      const filePath = `${outputDir}\\${fileName}.${outputExt}`;

      if (outputExt === 'xlsx') {
        const schema = Object.keys(data[0]).map((item) => {
          let width = 10;
          if (item === 'FilePath' || item === 'Content' || item === 'Translate') width = 100;
          const columnFormat = {
            column: item,
            value: (i) => i[item],
            width: width,
            wrap: true,
            borderColor: '#000000',
            borderStyle: 'thin',
          };
          return columnFormat;
        });

        await writeXlsxFile(data, {
          schema,
          filePath,
          headerStyle: {
            backgroundColor: '#d9f5fc',
            fontWeight: 'bold',
            align: 'center',
            borderColor: '#000000',
            borderStyle: 'thin',
          },
          dateFormat: 'dd.mm.yyyy HH:m:ss',
          lickyRowsCount: 1,
          stickyRowsCount: 1,
          sheet: fileName.slice(0, 31),
        });
      } else if (outputExt === 'json') {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
      }
      log(chalk.cyan(`${outputExt.toUpperCase()} file was created on the path: `), filePath);
    } catch (e) {
      log(chalk.red('Error creating output file: '), e);
    }
  } else {
    log(chalk.yellow('Data for creating output was not found!'));
  }
};

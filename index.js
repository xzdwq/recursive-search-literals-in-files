import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import writeXlsxFile from 'write-excel-file/node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Расширения файлов, которые необъходимо проверить
const filesExt = ['txt', 'vue', 'js', 'ts', 'yaml', 'json'];
const excludeDir = ['node_modules', 'dist'];
// Регулярное выражение поиска кирилицы в строках файла
const getRuLiteral = /[аА-яЯёЁ]/i;
// Директория из которой необходимо прочитать файлы
const dirPath = path.resolve(__dirname, '..', 'ui-kit');

(async () => {
  console.log('Starting...');
  const allFilesByExt = getAllFilesByExtInDir(dirPath);
  console.log(`Found ${allFilesByExt.length} files with the specified extensions`);

  const data = readFileByPath(allFilesByExt);
  await writeExcel(data);
  console.log('Finished!');
})();

/* Fn */
function getAllFilesByExtInDir(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    const getFileExt = /[^.]+$/i;
    const fileExt = getFileExt.exec(file)[0];

    if (fs.statSync(dirPath + '/' + file).isDirectory()) {
      arrayOfFiles = getAllFilesByExtInDir(dirPath + '/' + file, arrayOfFiles);
    } else {
      if (filesExt.includes(fileExt)) {
        const filePath = path.join(dirPath, '/', file);
        if (filePath && !excludeDir.some((el) => filePath.includes(el))) {
          arrayOfFiles.push(filePath);
        }
      }
    }
  });

  return arrayOfFiles;
}

function readFileByPath(arrayFilesPath) {
  const data = [];
  try {
    arrayFilesPath.forEach((filePath) => {
      if (!excludeDir.some((el) => filePath.includes(el))) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const lines = fileContent.split('\n');

        let lineNumber = 1;
        for (const content of lines) {
          if (content !== '\r') {
            const ruLiteral = getRuLiteral.exec(content);
            if (ruLiteral) {
              const ruContent = ruLiteral.input.trim();
              // console.log(`File: ${filePath}. Line: ${lineNumber} - ${ruContent}`);
              data.push({
                FilePath: filePath,
                TextLine: lineNumber,
                Content: ruContent,
              });
            }
          }
          lineNumber++;
        }
      }
    });
  } catch (e) {
    console.error('Read file error: ', e);
  }
  return data;
}

async function writeExcel(data) {
  if (data.length) {
    console.log('Writing an excel-file...');
    try {
      const getFolderName = /[^\\.*]+$/i;
      const fileName = getFolderName.exec(dirPath)[0];
      const filePath = `${__dirname}\\${fileName}_${new Date().getTime()}.xlsx`;

      const schema = Object.keys(data[0]).map((item) => {
        let width = 10;
        if (item === 'FilePath' || item === 'Content') width = 100;
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
        filePath: filePath,
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
        sheet: fileName,
      });
      console.log(`Excel file was created on the path: ${filePath}`);
    } catch (e) {
      console.error('Error creating Excel file: ', e);
    }
  } else {
    console.log('RU words not found in files!');
  }
}

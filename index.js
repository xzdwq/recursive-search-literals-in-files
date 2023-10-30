import chalk from 'chalk';
import { outputResult } from './src/output.js';
import { getAllFilesByExtInDir, readFileByPath } from './src/read-dir.js';
import config from './config.js';

const { log } = console;

(async () => {
  const start = new Date().getTime();
  log(chalk.green('Starting...'));

  const allFilesByExt = getAllFilesByExtInDir();
  log(chalk.cyan(`Found ${allFilesByExt.length} files with the specified extensions`));
  log(chalk.cyan('Reading files line by line. Wait...'));
  const data = await readFileByPath(allFilesByExt);
  await outputResult(data, config.outputExt);

  const end = new Date().getTime();
  log(chalk.green(`Finished in ${((end - start) / 1000).toFixed(1)}s!`));
})();

export default {
  /**
   * Путь директории, которую необходимо прочитать, относительно корня данного приложения
   * '../smcrm/Front/sm.vui'
   */
  readDir: '',
  /**
   * Расширения файлов, которые необходимо парсить в директории readDir
   * ['txt', 'vue', ...] или '*'
   */
  includeFileExt: ['txt', 'vue', 'js', 'ts', 'yaml', 'yml', 'json', 'md', 'config', 'html', 'css', 'scss'],
  /**
   * Директории, которые необходимо игнорировать
   * ['output', 'node_modules', 'dist', ...] или false
   */
  excludeDir: ['output', 'node_modules', 'dist'],
  /**
   * Регулярное выражение поиска литералов
   */
  regexpTrigger: /[аА-яЯёЁ]/i,
  /**
   * Тип выгрузки результата
   * 'xlsx' или 'json'
   */
  outputExt: 'json',
  /**
   * Имя файла с выгрузкой результатов
   */
  outputFileName: `data_${new Date().getTime()}`,
  /**
   * Задержка между чтением строк в каждом файле
   * ms
   */
  delayReadingLinesInFile: 0,
};

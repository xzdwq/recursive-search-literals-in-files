`npm i`  

В `index.js` указать расширения файлов в которых необходимо искать буквы:
```javascript
const filesExt = ['txt', 'vue', 'js', 'ts', 'yaml', 'json'];
```

Указать директории-исключения где поиск не нужен:
```javascript
const excludeDir = ['node_modules', 'dist'];
```

Указать директорию в которой необходимо искать совпадения относительно этого проекта:
```javascript
const dirPath = path.resolve(__dirname, '..', 'ui-kit');
```

`npm run start`  
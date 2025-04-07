# @indiefellas/nekoweb-api
A simple typescript wrapper for [Nekoweb's API](https://nekoweb.org/api),
This package also serves as a dependency for our build scripts.

## Installing
```bash
$ npm i @indiefellas/nekoweb-api
$ bun i @indiefellas/nekoweb-api
$ pnpm add @indiefellas/nekoweb-api
$ yarn add @indiefellas/nekoweb-api
```

## Examples
To get a website info, you can use this:
```js
import NekoAPI from '@indiefellas/nekoweb-api';
// const { default: NekowebAPI } = require("@indiefellas/nekoweb-api");
// ^^ CommonJS support

let neko = new NekoAPI({
    apiKey: 'YOUR_API_KEY_HERE',
});

let response = await neko.getSiteInfo('jbcarreon123');
console.log(response)
```

Uploading a file:
```js
import NekoAPI from '@indiefellas/nekoweb-api';
import fs from 'node:fs'

let neko = new NekoAPI({
    apiKey: 'YOUR_API_KEY_HERE',
});

let file = fs.readFileSync('./README.md')
let response = await neko.upload('/README.md', file);
console.log(response)
```

## Nekoweb API
You can interface with the Nekoweb API using this library.

### Initializing
First, we need to initialize the API:
```js
import NekoAPI from '@indiefellas/nekoweb-api';

let neko = new NekoAPI({
    apiKey: 'YOUR_API_KEY_HERE',
    appName: 'Nekoweb API', // (recommended) optional, defaults to NekowebAPI
    request: {} // optional, additional request config to pass for all requests
});
```

### `getSiteInfo(username?: string)`
- Accepts a `username`, but without it, it will request the site info of the owner of the API key specified
- Returns a `SiteInfo` class
```js
await neko.getSiteInfo(); // returns info of the API key owner

await neko.getSiteInfo('jbcarreon123'); // returns info for user jbcarreon123
```

### `getFileLimits()`
- Returns a `Limits` class
```js
await neko.getFileLimits();
```

### `listDir(path: string = '/')`
- Accepts a directory path, defaults to / if nothing provided
- Returns a `Folder[]` array
```js
await neko.listDir(); // returns contents of /

await neko.listDir('/dist'); // returns contents of /dist
```

### `create(path: string, isFolder: boolean = false)`
- Accepts a `path` of the file/folder, and if `isFolder` (defaults to false).
```js
await neko.create('/nekoweb.html'); // Creates a file named nekoweb.html

await neko.create('/hello', true); // Creates a folder named hello

await neko.create('/hello/hi.txt'); // Creates a file named hi.txt inside of the hello folder
```

### `upload(path: string, file: Buffer)`
- Accepts a `path` for the file's path, and a `file` buffer for the actual file itself.
- If the file is 100MB or over, it will use BigFile for uploads automatically.
```js
let file = fs.readFileSync('./hi.txt');
await neko.upload('/hello/hi.txt', file);
```

### `rename(oldPath: string, newPath: string)`
- Accepts the `oldPath` of the file/folder you wanna rename/move, and `newPath` of the new path you wanna rename/move.
```js
await neko.rename('/hello/hi.txt', '/hello/hai.txt'); // Renames hi.txt to hai.txt

await neko.rename('/hello/hai.txt', '/hai.txt'); // Moves hai.txt to /
```

### `edit(path: string, content: string)`
- Accepts a `path` for the file you wanna edit and `content` for the content of that file.
```js
await neko.edit('/hai.txt', 'Haaaiiiiiiiii!!!!!')
```

### `delete(path: string)`
- Accepts the `path` you want to delete.
```js
await neko.delete('/hai.txt');
```

### `createBigFile()`
- Returns a BigFile object you can use to upload files more than 100MB.
```js
let bigfile = await neko.createBigFile();
```

## BigFile
### `append(file: Buffer)`
- Accepts a `file` to append. This will automatically split it to 100MB chunks if needed.
```js
let file = fs.readFileSync('./reallybigfile.zip');
await bigfile.append(file)
```

### `appendChunk(chunk: Buffer)`
- Basically `append` but instead of the wrapper automatically splits it, you do the job of splitting it.
```js
let file = fs.readFileSync('./reallybigfile.zip');
await bigfile.appendChunk(file)
```

### `move(filepath: string)`
- Accepts a `filepath` for the path of the file you just appended.
```js
await bigfile.move('/reallybigfile.zip')
```

### `import()`
- Imports the file you just appended. Only works on ZIP files.
```js
await bigfile.import()
```

## Credits
This library uses [Nekoweb's API](https://nekoweb.org/api).

## License
[MIT](https://github.com/indiefellas/nekoweb-api/blob/main/LICENSE)

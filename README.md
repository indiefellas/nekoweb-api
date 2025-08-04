# @indiefellas/nekoweb-api
A simple typescript wrapper for [Nekoweb's API](https://nekoweb.org/api),
This package also serves as a dependency for our build scripts.


## Getting started
To install this library, use one of these commands (depending on your package manager of choice)
```bash
$ npm i @indiefellas/nekoweb-api
$ bun i @indiefellas/nekoweb-api
$ pnpm add @indiefellas/nekoweb-api
$ yarn add @indiefellas/nekoweb-api
```

Then, get an API key on https://nekoweb.org/api, and put it on `YOUR_API_KEY_HERE`, like this below:

```js
import NekowebAPI from '@indiefellas/nekoweb-api';
// const { default: NekowebAPI } = require("@indiefellas/nekoweb-api");
// ^^ CommonJS support

let nekoweb = new NekowebAPI({
    apiKey: 'YOUR_API_KEY_HERE',
});
```

## Examples
To get your main website info, you can use this:
```js
import NekowebAPI from '@indiefellas/nekoweb-api';
// const { default: NekowebAPI } = require("@indiefellas/nekoweb-api");
// ^^ CommonJS support

let nekoweb = new NekowebAPI({
    apiKey: 'YOUR_API_KEY_HERE',
});

let response = await nekoweb.getSiteInfo();
console.log(response)

// Returns a Site object. Example:
// > {
// >     main: true,
// >     domain: "jbcarreon123.nekoweb.org",
// >     title: "jb&#39;s site",
// >     folder: "/jbcarreon123.nekoweb.org",
// >     updates: 848,
// >     followers: 120,
// >     views: 78336,
// >     created_at: 1739759280871,
// >     updated_at: 1754100370383
// > }
```

Uploading a file:
```js
import NekowebAPI from '@indiefellas/nekoweb-api';
import fs from 'node:fs'

let nekoweb = new NekowebAPI({
    apiKey: 'YOUR_API_KEY_HERE',
});

let file = fs.readFileSync('./README.md')
let response = await nekoweb.upload('/README.md', file);
console.log(response)

// Returns the response of the server. Example:
// > File uploaded
```

## Nekoweb API
You can interface with the Nekoweb API using this library.

### Initializing
First, we need to initialize the API:
```js
import NekowebAPI from '@indiefellas/nekoweb-api';

let nekoweb = new NekowebAPI({
    apiKey: 'YOUR_API_KEY_HERE',
    appName: 'Nekoweb API', // (recommended) optional, defaults to NekowebAPI
    request: {} // optional, additional request config to pass for all requests
});
```

### `getSiteInfo(domain?: string)`
- Accepts a `domain`, but without it, it will request the site info of the main site of the API key specified
- Note that if you specify a domain and you don't own it, you will not get the extra information like if it's your main domain, or the folder.
- Returns a `SiteInfo` class
```js
await nekoweb.getSiteInfo(); // returns info of the API key owner
// > {
// >     main: true,
// >     domain: "jbcarreon123.nekoweb.org",
// >     title: "jb&#39;s site",
// >     folder: "/jbcarreon123.nekoweb.org",
// >     updates: 848,
// >     followers: 120,
// >     views: 78336,
// >     created_at: 1739759280871,
// >     updated_at: 1754100370383
// > }

await nekoweb.getSiteInfo('thinliquid.dev'); // returns info for domain thinliquid.dev
// > {
// >     domain: "thinliquid.dev",
// >     title: "thinliquid&#39;s [studio]",
// >     updates: 1080,
// >     followers: 175,
// >     views: 148426,
// >     created_at: 1720120891411,
// >     updated_at: 1720120891411
// > }
```

### `getAllSiteInfo()`
- Returns a array of `SiteInfo`
```js
await nekoweb.getAllSiteInfo(); // returns info of all sites on the specified API key
// > [
// >     {
// >         main: true,
// >         domain: "jbcarreon123.nekoweb.org",
// >         title: "jb&#39;s site",
// >         id: 0,
// >         folder: "/jbcarreon123.nekoweb.org",
// >         updates: 848,
// >         followers: 120,
// >         views: 78336,
// >         created_at: 1739759280871,
// >         updated_at: 1754100370383
// >     },
// >     {
// >         "main": false,
// >         "domain": "nekobox.nekoweb.org",
// >         "folder": "/nekobox.nekoweb.org",
// >         "title": "Redirecting to: https://jbc.lol/utils/nekobox/",
// >         "updates": 90,
// >         "followers": 8,
// >         "views": 1550,
// >         "created_at": 1742393898675,
// >         "updated_at": 1753927835577
// >     }
// > ]

```

### `getFileLimits()`
- Returns a `Limits` class
```js
await nekoweb.getFileLimits();
// > {
// >     "general": {
// >         "limit": 225,
// >         "remaining": 225,
// >         "reset": -1
// >     },
// >     "big_uploads": {
// >         "limit": 10,
// >         "remaining": 10,
// >         "reset": -1
// >     },
// >     "zip": {
// >         "limit": 3,
// >         "remaining": 3,
// >         "reset": -1
// >     }
// > }
```

### `listDir(path: string = '/')`
- Accepts a directory path, defaults to / if nothing provided
- Returns a `Folder[]` array
```js
await nekoweb.listDir(); // returns contents of /
// > [
// >     {
// >         "name": "%2Ftest.md",
// >         "dir": false
// >     },
// >     {
// >         "name": ".svelte-adapter-nekoweb.html",
// >         "dir": false
// >     },
// >     {
// >         "name": "TestingFolder",
// >         "dir": true
// >     }
// > }

await nekoweb.listDir('/build'); // returns contents of /build
```

### `create(path: string, isFolder: boolean = false)`
- Accepts a `path` of the file/folder, and if `isFolder` (defaults to false).
```js
await nekoweb.create('/nekoweb.html'); // Creates a file named nekoweb.html

await nekoweb.create('/hello', true); // Creates a folder named hello

await nekoweb.create('/hello/hi.txt'); // Creates a file named hi.txt inside of the hello folder
```

### `upload(path: string, file: Buffer)`
- Accepts a `path` for the file's path, and a `file` buffer for the actual file itself.
- If the file is 100MB or over, it will use BigFile for uploads automatically.
```js
let file = fs.readFileSync('./hi.txt');
await nekoweb.upload('/hello/hi.txt', file);
```

### `rename(oldPath: string, newPath: string)`
- Accepts the `oldPath` of the file/folder you wanna rename/move, and `newPath` of the new path you wanna rename/move.
```js
await nekoweb.rename('/hello/hi.txt', '/hello/hai.txt'); // Renames hi.txt to hai.txt

await nekoweb.rename('/hello/hai.txt', '/hai.txt'); // Moves hai.txt to /
```

### `edit(path: string, content: string)`
- Accepts a `path` for the file you wanna edit and `content` for the content of that file.
```js
await nekoweb.edit('/hai.txt', 'Haaaiiiiiiiii!!!!!')
```

### `delete(path: string)`
- Accepts the `path` you want to delete.
```js
await nekoweb.delete('/hai.txt');
```

### `createBigFile()`
- Returns a BigFile object you can use to upload files more than 100MB.
```js
let bigfile = await nekoweb.createBigFile();
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

### `import(path: string = "/")`
- Imports the file you just appended. Only works on ZIP files.
- Accepts a `path` but defaults to `/`
```js
await bigfile.import()
```

## Error handling
In errors, the library throws an `AxiosError` class if it's a network/API issue, and a generic Error class if it's something else (e.g. missing API keys)

## License
[MIT](https://github.com/indiefellas/nekoweb-api/blob/main/LICENSE)

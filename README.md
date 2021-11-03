# Optipng.js
Optipng.js is the port of [optipng](http://optipng.sourceforge.net/) in javascript using [emscripten](https://github.com/kripken/emscripten). You can optimize png image file without losing any information in the morden browser using Optipng.js.

Tip: Optipng version is 0.7.7.

## This fork

Updated build script to work with more recent versions of emscripten, gaining a bit of performance. Newer version of emscripten emits WASM by default and we'll also take advantage of that, however the optipng() function signature had to be updated to take a callback (see pre.js) since the WASM version is asynchronous and promises are not available in Web Workers. An example Web Worker using the new signature is provided in src/optipng.worker.js.

Note: Emscripten documentation explicitly warn against using pre-js to encapsulate the output in a function and encourage the use of `MODULARIZE`. If someone wants to publish a proper version of this library, they should probably take a look this way, but the current version works and it's enough for my purpose :^)

## API

### `optipng(file, callback, options, printFunction)`

#### `file`
Please use binary file like readFile on node or Uint8Array (converted from base64) on javascript.
```javascript
// Node.js
var input = fs.readFileSync("input.png");
optipng(input, (output) => {
    // do something with output
}, ["-o2"]);
```
```javascript
// Browser
function dataURLtoUint8(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return u8arr;
}
function readFile (file, callback) {
    var fileReader = new FileReader();
    fileReader.onload = function() {
        var ary = dataURLtoUint8(this.target.result);
        callback(ary);
    };
    fileReader.readAsDataURL(file);
}

var input;
readFile(your_file_on_here, function(ary) {
    input = ary;
    optipng(input, (output) => {
        // do something with output
        output.data; // Image data
        console.log(output.stdout);
        console.error(output.stderr);
    }, ["-o2"]);
});
```


#### `callback`
Function called when processing is done, the result will be passed as the first argument:
```javascript
{
    data: [output file],
    stdout: [output string],
    stderr: [error string]
};
```

#### `options`
Options can be array or object.
```javascript
var options = ["-o2", "-i0", "-strip", "all"];
var options = {o2: true, i0: true, strip: "all"};
// Both options is same options. If use boolean in value, value will be ignored and only key will be inserted as options.
```

#### `printFunction`
This callback function is optional. It will be called if optipng will print something on stdout or stderr.
```javascript
optipng(input, callback, ["-o2"], function(str) {
    console.log(str);
});
```

## Full Example

### Node.js
```
$ npm i -S optipng-js
```

```javascript
var optipng = require("optipng-js");
var fs = require("fs");

var input = fs.readFileSync("input.png");
optipng(input, (output) => {
    /*
        output = {
            data: output file,
            stdout: output string,
            stderr: error string
        }
    */);
    fs.writeFileSync("output.png", output.data);
    console.log(output.stdout);
    console.log(output.stderr
}, {"o2": true});

```

### Browser
Please check Demo with Web worker. [https://li-na.github.io/optipng.js/](https://li-na.github.io/optipng.js/)

## Build
Actually, I don't know what it is but I made build shell script and it seems working. Please let me know if you have ANY better way to build this project.

You have to setup emscripten sdk on [here](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html) first.

Then, download or clone this git on your linux computer. (Windows does not supported at this moment)
```
$ git clone https://github.com/LI-NA/optipng.js
```

Finally, just run `./build.sh`. It will configure optipng and compile with emcc.

## License
[MIT License](LICENSE)

Optipng source code is under [zlib license](deps/optipng/LICENSE.txt)

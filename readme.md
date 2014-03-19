copyfiles
===

copy files easily

### Install

```bash
npm install copyfiles -g
```
### Command Line

copy some files, give it a bunch of arguments, (which can include globs), the last one 
is the out directory (which it will create if necessary).

```bash
copyfiles foo foobar foo/bar/*.js out
```

you now have a directory called out, with the files foo and foobar in it, it also has a directory named foo with a directory named
bar in it that has all the files from foo/bar that match the glob.

If all the files are in a folder that you don't want in the path out path, ex:

```bash
copyfiles something/*.js out
```

which would put all the js files in `out/something`, you can use the `--up` (or `-u`) option

```bash
copyfiles -u 1 something/*.js out
```

which would put all the js files in `out`

### Programic API

```js
var copyfiles = require('copyfiles');

copyfiles([paths], up, callback);
```
takes an array of paths, last one is the destination path, also takes an optional up argument which is the same as the
command line option.
copyfiles [![Build Status](https://travis-ci.org/calvinmetcalf/copyfiles.svg)](https://travis-ci.org/calvinmetcalf/copyfiles)
===

copy files easily

### Install

```bash
npm install copyfiles -g
```
### Command Line

```bash
  Usage: copyfiles [options] inFile [more files ...] outDirectory

  Options:
    -u, --up       slice a path off the bottom of the paths               [number]
    -a, --all      include files & directories begining with a dot (.)   [boolean]
    -f, --flat     flatten the output                                    [boolean]
    -e, --exclude  pattern or glob to exclude (may be passed multiple times)
    -E, --error    throw error if nothing is copied                      [boolean]
    -V, --verbose  print more information to console                     [boolean]
    -s, --soft     do not overwrite destination files if they exist      [boolean]
    -F, --follow   follow symbolink links                                [boolean]
    -v, --version  Show version number                                   [boolean]
    -h, --help     Show help                                             [boolean]
```

copy some files, give it a bunch of arguments, (which can include globs), the last one
is the out directory (which it will create if necessary).  Note: on windows globs must be **double quoted**, everybody else can quote however they please.

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

you can also just do -f which will flatten all the output into one directory, so with files ./foo/a.txt and ./foo/bar/b.txt

```bash
copyfiles -f ./foo/*.txt ./foo/bar/*.txt out
```

will put a.txt and b.txt into out

if your terminal doesn't support globstars then you can quote them

```bash
copyfiles -f ./foo/**/*.txt out
```

does not work by default on a mac

but

```bash
copyfiles -f "./foo/**/*.txt" out
```

does.

You could quote globstars as a part of input:
```bash
copyfiles some.json "./some_folder/*.json" ./dist/ && echo 'JSON files copied.'
```

You can use the -e option to exclude some files from the pattern, so to exclude all files ending in .test.js you could do

```bash
copyfiles -e "**/*.test.js" -f ./foo/**/*.js out
```

Other options include

- `-a` or `--all` which includes files that start with a dot.
- `-s` or `--soft` to soft copy, which will not overwrite existing files.
- `-F` or `--follow` which follows symbolinks

## copyup

also creates a `copyup` command which is identical to `copyfiles` but `-up` defaults to 1

### Programic API

```js
var copyfiles = require('copyfiles');

copyfiles([paths], opt, callback);
```
takes an array of paths whose last element is assumed the destination path.
also takes an options argument which could be either of the following values:

- `function`: it is used as `callback` (supercedes `callback` argument)
- `number`: it is assumed as a value for -u option.
- `bool`: if it is `true` it's the flat option
- `object`: an options object with the following structure:

```javascript
{
	verbose: bool,  // enable debug messages
	up: number, // -u value
	soft: bool,	// soft copy (skip existing dirs & files)
	exclude: string,  // exclude pattern
	all: bool,		// include dot files
	follow: bool	// Follow symlinked directories when expanding ** patterns
	error: bool // raise errors if no files copied
}
```


### Tilde support for home directory
when the src/dest path start with tilde for home directory under windows, please make sure -u or -f is added in options or use copyup command. if not you will get `Error: Illegal characters in path.`

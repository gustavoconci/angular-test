## Install

### Dependencies

Make sure these are installed first.

- [Node.js](http://nodejs.org)

### Quick Start

1. In bash/terminal/command line, `cd` into your project directory.
2. Run `npm install` to install required files and dependencies.
3. When it's done installing, run one of the task runners to get going:
	- `gulp` manually compiles files.
	- `gulp watch` automatically compiles files and applies changes using [BrowserSync](https://browsersync.io/) when you make changes to your source files.
    - Check the `proxy` param in **gulpfile.js** to use [BrowserSync](https://browsersync.io/), line: 25

**Try it out.** After installing, run `gulp` to compile some test files. Or, run `gulp watch` and make some changes to see them recompile automatically.
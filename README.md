# react-json-parser

Transforms a JSX string to a JSON tree

## Installation

```sh
npm install react-json-parser
```

## CLI Usage

```sh
react-json-parser [options]
```

### Options

```
-h, --help             output usage information
-V, --version          output the version number
-f, --file <file>      JSX file to read, defaults to stdin if not set
-o, --output <output>  JSON destination file, defaults to stdout if not set
-p, --pretty           pretty-print JSON
```

When the `file` option is not provided, the JSX string is read from stdin, example:

```sh
echo '<MyComponent test />' | react-json-parser --pretty
```

### API usage

```js
const tree = require('react-json-parser').parse('<MyComponent test />')
```

## License

MIT

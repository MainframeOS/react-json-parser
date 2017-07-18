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
-h, --help                     output usage information
-V, --version                  output the version number
-f, --file <file>              JSX file to read, defaults to stdin if not set
-o, --output <output>          JSON destination file, defaults to stdout if not set
-p, --pretty                   pretty-print JSON
-a, --accept [component type]  only accepts the specified component type, can be used multiple times
--no-plain-text                do not allow plain-text children    
```

When the `file` option is not provided, the JSX string is read from stdin, example:

```sh
echo '<MyComponent test />' | react-json-parser --pretty
```

## API usage

### parse(code, options)

Parses the provided `code` string using the supported `options`:

- `only: Array<string>`: only accepts the provided components types, by default accepts any
- `plainText: boolean`: allow plain-text children, defaults to `true`

```js
const { parse } = require('react-json-parser')
const tree = parse(
  '<MyComponent test>Hello <ChildComponent /><OtherChild></MyComponent>',
  {
    only: ['MyComponent', 'ChildComponent'],
    plainText: false,
  }
)
// tree = {type: 'MyComponent', props: {children: [{type: 'ChildComponent'}], test: true}}
```

## License

MIT

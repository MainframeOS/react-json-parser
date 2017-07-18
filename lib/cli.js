const program = require('commander')
const fs = require('fs-extra')
const getStdin = require('get-stdin')
const path = require('path')

const pckg = require('../package.json')
const { parse } = require('./index')

const collectAccept = (value, acc) => {
  acc.push(value)
  return acc
}

program
  .version(pckg.version)
  .usage('[options]')
  .option('-f, --file <file>', 'JSX file to read, defaults to stdin if not set')
  .option(
    '-o, --output <output>',
    'JSON destination file, defaults to stdout if not set',
  )
  .option('-p, --pretty', 'pretty-print JSON')
  .option(
    '-a, --accept [component type]',
    'only accepts the specified component type, can be used multiple times',
    collectAccept,
    [],
  )
  .option('--no-plain-text', 'do not allow plain-text children')
  .parse(process.argv)

const stringifySpace = program.pretty ? 2 : 0

const run = code => {
  const json = parse(code, {
    only: program.accept,
    plainText: program.plainText,
  })
  if (json) {
    if (program.output) {
      fs.outputJSONSync(program.output, json, { spaces: stringifySpace })
      console.log('JSON written to ' + path.resolve(program.output))
    } else {
      console.log(JSON.stringify(json, null, stringifySpace))
    }
  }
}

if (program.file) {
  fs.readFile(program.file, 'utf8').then(run)
} else {
  getStdin().then(run)
}

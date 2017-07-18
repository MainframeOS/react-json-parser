const program = require('commander')
const fs = require('fs-extra')
const getStdin = require('get-stdin')

const pckg = require('../package.json')
const { parse } = require('./index')

program
  .version(pckg.version)
  .usage('[options]')
  .option('-f, --file <file>', 'JSX file to read, defaults to stdin if not set')
  .option(
    '-o, --output <output>',
    'JSON destination file, defaults to stdout if not set',
  )
  .option('-p, --pretty', 'pretty-print JSON')
  .parse(process.argv)

const stringifySpace = program.pretty ? 2 : 0

const run = code => {
  const json = parse(code)
  if (program.output) {
    fs.outputJSONSync(program.output, json, { spaces: stringifySpace })
  } else {
    console.log(JSON.stringify(json, null, stringifySpace))
  }
}

if (program.file) {
  fs.readFile(program.file, 'utf8').then(run)
} else {
  getStdin().then(run)
}

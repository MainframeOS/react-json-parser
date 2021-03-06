const babylon = require('babylon')
const traverse = require('babel-traverse').default
const types = require('babel-types')

const addChild = (parent, child) => {
  const parentNode = parent.__node
  if (!parentNode.props) {
    parentNode.props = {}
  }
  if (!parentNode.props.children) {
    parentNode.props.children = []
  }
  parentNode.props.children.push(child)
}

const getParentType = node => {
  if (types.isJSXIdentifier(node)) {
    return node.name
  }
  if (types.isJSXMemberExpression(node)) {
    return getParentType(node.object) + '.' + node.property.name
  }
}

const parse = (code, options = {}) => {
  const allowPlainText = options.plainText !== false
  const isAllowed =
    options.only && options.only.length
      ? name => options.only.includes(name)
      : () => true

  const ast = babylon.parse(code, { plugins: ['jsx', 'flow'] })
  let tree
  let level = 0

  traverse(ast, {
    JSXElement: {
      enter() {
        level++
      },
      exit() {
        level--
      },
    },

    JSXOpeningElement: {
      enter(path) {
        const { name } = path.node

        let node
        if (types.isJSXIdentifier(name)) {
          node = { type: name.name }
        } else if (types.isJSXMemberExpression(name)) {
          node = {
            type: name.property.name,
            parentType: getParentType(name.object),
          }
        }

        if (node && isAllowed(node.type)) {
          path.parent.__node = node
          if (level === 1) {
            tree = node
          } else {
            addChild(path.parentPath.parentPath.node, node)
          }
        }
      },
    },

    JSXAttribute(path) {
      const { node } = path
      const parent = path.findParent(p => types.isJSXElement(p.node))
      const parentNode = parent.node.__node
      if (!parentNode.props) {
        parentNode.props = {}
      }
      parentNode.props[node.name.name] = node.value
        ? node.value.value
        : types.booleanLiteral(true).value
    },

    JSXText(path) {
      const text = path.node.value.replace(/[\n]/g, '').trim()
      if (text && allowPlainText) {
        addChild(path.parent, text)
      }
    },
  })

  return tree
}

module.exports = { parse }

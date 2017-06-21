var beautify = require('js-beautify')
var beautifyJSON = require('./json-beautify')
var path = require('path')

function matchType (con) {
  // try json firstly
  try {
    con = JSON.parse(con)
    return 'json'
  } catch (e) {}
  let match = {
    html: {count: 0, words: [/<html/, /<body/, /<title/, /<head/, /<div/]},
    js: {count: 0, words: [/var/, /function/, /return/, /if/, /let/]},
    css: {count: 0, words: [/color/, /font-size/, /display/, /width/, /height/]}
  }
  let currentCount = 0
  let type = null
  for (let i in match) {
    let words = match[i].words
    for (let j = 0; j < words.length; j++) {
      if (words[j].test(con)) {
        match[i].count ++
      }
    }
    if (match[i].count > currentCount) {
      currentCount = match[i].count
      type = i
    }
  }
  return type
}

function beautifyContent (con, ext, option) {
  let result = null
  if (['js', 'css', 'html'].includes(ext)) {
    result = beautify[ext](con, option)
  } else if (ext === 'json') {
    result = beautifyJSON(con, option.indent_size)
  } else if (ext === '') {
    ext = matchType(con)
    if (ext) {
      // do it again
      result = beautifyContent(con, ext, option)
    }
  }
  return result
}
export default ({editor, store, view, packageInfo, baseClass}) => {
  // add item to toolbar
  store.dispatch('toolbar/addItem', {
    name: 'format',
    desc: 'format tool',
    key: 'videPluginFormatItem',
    icon: 'data:image/png;base64,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',
    func: 'videPluginFormat:click'
  })
  // return execute class
  return class videPluginFormat extends baseClass {
    click () {
      let filename = path.basename(store.state.editor.currentFile)
      let ext = path.extname(filename).slice(1)
      let option = {
        indent_size: store.state.config.editor.tabsize
      }
      let con = null
      try {
        con = beautifyContent(editor.getValue(), ext, option)
      } catch (e) {
        con = null
      }
      if (con) {
        editor.selection.selectAll()
        let r = editor.selection.getRange()
        editor.session.replace(r, con)
      }
    }
    $clean () {
      store.dispatch('toolbar/deleteItem', 'videPluginFormatItem')
    }
  }
}

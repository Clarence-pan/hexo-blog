
const htmlparser = require('htmlparser')
const fs = require('fs')
const cb2p = require('cb2p')
const co = require('co')

const readFile = cb2p(fs.readFile)
const writeFile = cb2p(fs.writeFile)

function cdnify(file){
    return co(function*(){
        let fileContent = yield readFile(file, 'utf8')

        let handler = new htmlparser.DefaultHandler((error, dom) => {
            // todo...
        })
    })
}


cdnify('public/index.html')


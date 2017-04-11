
const fs = require('fs')
const cb2p = require('cb2p')
const co = require('co')
const cheerio = require('cheerio')
const glob = require('glob')
const async = require('async')

const readFile = cb2p(fs.readFile)
const writeFile = cb2p(fs.writeFile)

function cdnify(file){
    return co(function*(){
        let fileContent = yield readFile(file, 'utf8')
        let $ = cheerio.load(fileContent, {decodeEntities: false, normalizeWhitespace: false})

        $('img[src], script[src]').each(function(){
            let $this = $(this)
            let src   = $this.attr('src')
            let cdnifiedUrl = cdnifyUrl(src)
            if (cdnifiedUrl && cdnifiedUrl !== src){
                $this.attr('src', cdnifiedUrl)
            }
        })

        $('link[href]').each(function(){
            let $this = $(this)
            let href   = $this.attr('href')
            if (!/\.css/.test(href)){
                return
            }

            let cdnifiedUrl = cdnifyUrl(href)
            if (cdnifiedUrl && cdnifiedUrl !== href){
                $this.attr('href', cdnifiedUrl)
            }
        })

        let finalHtml = $.html()

        yield writeFile(file, finalHtml, 'utf8')
    })
}

const CDN_HOSTS = ['http://s1.clarencep.com', 'http://s2.clarencep.com']
let nextCdnHostIndex = ((id) => () => id++ % CDN_HOSTS.length)(0)

function getCdnBaseUrl(){
    return CDN_HOSTS[nextCdnHostIndex()]
}

function cdnifyUrl(url){
    if (url && url[0] === '/' && url[1] !== '/'){
        return getCdnBaseUrl() + url
    }

    return url
}

glob('public/**/*.html', function(err, files){
    if (err){
        console.error(err)
        process.exit(1)
    }

    let errors = 0

    async.parallelLimit(
        files.map(f => (done) => {
            console.log("Processing " + f)
            cdnify(f)
                .then(() => {
                    console.log('Processed ' + f)
                    done()
                })
                .catch(e => {
                    console.error("Failed to process " + f + ":\n", e)
                    errors++
                    done()
                })
        }),
        10,
        function (err, results){
            console.log("All done.")
        }
    )
    
})

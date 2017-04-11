var execSync = require('child_process').execSync

var exec = function(cmd){
    return execSync(cmd, {stdio: 'inherit'})
}

console.log("Generate files by hexo...")

exec('./node_modules/.bin/hexo generate'.replace(/[\/]/g, require('path').sep))

console.log("Copying files...")

exec('cp -rf source/test/* public/test/')
exec('cp -rf source/lib/* public/lib/')
exec('cp -rf source/fe-lab/* public/fe-lab/')

console.log("Done.")

// cdnify
// just tried it -- but I'm not able to afford the HTTPS CDN...
//require('./cdnify')


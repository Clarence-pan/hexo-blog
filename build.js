var execSync = require('child_process').execSync

var exec = function(cmd){
    return execSync(cmd, {stdio: 'inherit'})
}

console.log("Generate files by hexo...")

exec('hexo generate')

console.log("Copying files...")

exec('cp -rf source/test/* public/test/')
exec('cp -rf source/lib/* public/lib/')

console.log("Done.")

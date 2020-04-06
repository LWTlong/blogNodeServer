const crypto = require('crypto')

// 密匙
const PWD_KEY = 'key_2375#'

// md5 加密
function md5(content){
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}


// 加密
function genPassword(password) {
    const str = `password=${password}&key=${PWD_KEY}`
    return md5(str)
}

module.exports = {
    genPassword
}
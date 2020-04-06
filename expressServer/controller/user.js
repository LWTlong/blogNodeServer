const {exec, escape} = require('../db/mysql')
const { genPassword } = require('../util/cryp')

const loginCheck = (username, password) =>{
    username = escape(username)
    password = genPassword(password)
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password} `
    return exec(sql).then(rows => {
        return rows[0] || {}
    }).catch(err => {
        return {}
    })
}

module.exports = {loginCheck}

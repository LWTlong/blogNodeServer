const {exec, escape} = require('../db/mysql')
const { genPassword } = require('../util/cryp')

const loginCheck = async (username, password) =>{
    username = escape(username)
    password = genPassword(password)
    password = escape(password)
    const sql = `select username, realname from users where username=${username} and password=${password} `
    const rows = await exec(sql).catch(err => {
        return {}
    })
    return rows[0] || {}
}


module.exports = {loginCheck}

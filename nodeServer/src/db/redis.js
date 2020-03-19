const redis = require('redis')
const {REDIS_CONF} =require('../conf/db')

const redisCli = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisCli.on('error', err => {
    console.error(err)
})

function setRedis(key, val) {
    if (typeof val === "object") {
        val = JSON.stringify(val)
    }
    redisCli.set(key, val)
}

function getRedis(key) {
    return  new Promise((resolve, reject) => {
        redisCli.get(key, (err, val) => {
            if (err) {
                reject(err)
                return
            }
            if (val === null) {
                resolve(null)
                return;
            }
            try {
                resolve(
                    JSON.parse(val)
                )
            }catch (e) {
                resolve(val)
            }
        })
    })
}

module.exports = {
    setRedis,
    getRedis
}

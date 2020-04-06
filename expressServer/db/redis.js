const redis = require('redis')
const {REDIS_CONF} =require('../conf/db')

const redisCli = redis.createClient(REDIS_CONF.port, REDIS_CONF.host)
redisCli.on('error', err => {
    console.error(err)
})

module.exports = redisCli


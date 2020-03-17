const querystring = require('querystring')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 设置 cookie 过期时间
const setCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toUTCString()
}


// session
let SESSION_DATA = {}

const getPostData = (req) => {
    return new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        if (req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', chunk => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if (!postData) {
                resolve({})
                return
            }
            resolve(JSON.parse(postData))
        })
    })
}

const serverHandle = async (req, res) => {
    // 设置返回格式
    res.setHeader('Content-Type', 'application/json')

    // 处理 path
    const url = req.url
    const path = url.split('?')[0]
    req.path = path

    // 解析 query
    req.query = querystring.parse(url.split('?')[1])
    // 解析 postData
    req.body = await getPostData(req)
    // 解析 cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0].trim()
        const val = arr[1]
        req.cookie[key] = val
    })

    // 解析 session
    let needSetCookie = false
    let userId = req.cookie.userid
    if (userId) {
        if (!SESSION_DATA[userId]) {
            SESSION_DATA[userId] = {}
        }
    } else {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        SESSION_DATA[userId] = {}
    }
    req.session = SESSION_DATA[userId]


    // 处理 blog 路由
    const blogData = await handleBlogRouter(req, res)
    if (blogData) {
        if (needSetCookie) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
        }
        res.end(
            JSON.stringify(blogData)
        )
        return
    }

    // 处理 user 路由
    const userData = await handleUserRouter(req, res)
    if (userData) {
        if (needSetCookie) {
            res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${setCookieExpires()}`)
        }
        res.end(
            JSON.stringify(userData)
        )
        return
    }

    // 未定义路由 返回 404
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.write('404 NOT FOUND')
    res.end()
}


module.exports = serverHandle

// process.env.NODE_ENV

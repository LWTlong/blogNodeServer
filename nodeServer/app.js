const querystring = require('querystring')

const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

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


    // 处理 blog 路由
    const blogData = await handleBlogRouter(req, res)
    if (blogData) {
        res.end(
            JSON.stringify(blogData)
        )
        return
    }

    // 处理 user 路由
    const userData = await handleUserRouter(req, res)
    if (userData) {
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
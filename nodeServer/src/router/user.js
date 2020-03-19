const {loginCheck} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')
const { setRedis} = require('../db/redis')

const handleUserRouter = (req, res) => {
    const method = req.method

    if(method === 'POST' && req.path === '/api/user/login'){
        const {username, password} = req.body
        // const {username, password} = req.query
        return loginCheck(username,password).then(result => {
            if(result.username){
                // 设置 session
                req.session.username = result.username
                req.session.realname = result.realname

                setRedis(req.sessionId, req.session)

                return new SuccessModel(result, '登录成功')
            }else {
                return new ErrorModel(result, '登录失败')
            }
        }).catch(err => {
            return new ErrorModel(err)
        })
    }

    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(
                new SuccessModel({
                    username: req.session
                }, '已登录')
            )
        }
        return Promise.resolve(
            new ErrorModel('未登录')
        )
    }
}

module.exports = handleUserRouter

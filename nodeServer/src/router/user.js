const {loginCheck} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method

    if(method === 'POST' && req.path === '/api/user/login'){
        const {username, password} = req.body
        return loginCheck(username,password).then(res => {
            if(res.username){
                return new SuccessModel(res, '登录成功')
            }else {
                return new ErrorModel(res, '登录失败')
            }
        }).catch(err => {
            return new ErrorModel(err)
        })
    }
}

module.exports = handleUserRouter
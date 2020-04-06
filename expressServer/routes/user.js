const express = require('express')
const router = express.Router()
const {loginCheck} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')


router.post('/login', (req, res, next) => {
    const {username, password} = req.body
    loginCheck(username,password).then(result => {
        if(result.username){
            // 设置 session
            req.session.username = result.username
            req.session.realname = result.realname

            res.json(new SuccessModel(result, '登录成功'))
        }else {
            res.json(new ErrorModel(result, '登录失败'))
        }
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.get('/login-test', (req, res, next) => {
    if (req.session.username) {
        res.json(new SuccessModel(req.session, '已登录'))
        return
    }
    res.json( new ErrorModel('未登录'))
})

module.exports = router
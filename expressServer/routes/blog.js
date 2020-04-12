const express = require('express')
const router = express.Router()
const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

// 登录验证函数  暂时
const LoginCheck = (req, res, next) => {
    if (!req.session.username) {
        res.json(
            new ErrorModel('未登录')
        )
        return
    }
    next()
}

router.get('/list', (req, res, next) => {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    getList(author, keyword).then(data => {
        res.json(new SuccessModel(data))
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.get('/detail', (req, res, next) => {
    getDetail(req.query.id).then(data => {
        res.json(new SuccessModel(data))
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.post('/new', LoginCheck, (req, res, next) => {
    const author = req.session.realname
    req.body.author = author
    newBlog(req.body).then(result => {
        console.log(result)
        res.json(new SuccessModel(result))
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.post('/update', LoginCheck, (req, res, next) => {
    updateBlog(req.query.id, req.body).then(result => {
        if (result) {
            res.json(new SuccessModel(result, '更新成功'))
        } else {
            res.json(new ErrorModel('更新失败'))
        }
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.post('/del', LoginCheck, (req, res, next) => {
    const author = req.session.realname
    return delBlog(req.query.id, author).then(result => {
        if (result) {
            res.json(new SuccessModel(result, '删除成功'))
        } else {
            res.json(new ErrorModel('删除失败'))
        }
    }).catch(err => {
        res.json(new ErrorModel(err))
    })
})

router.get('/session-test', (req, res, next) => {
    const session = req.session
    console.log(session)
    if (session.viewNum == null) {
        session.viewNum = 0
        console.log(11)
    }
    session.viewNum++
    res.json({
        viewNum: session.viewNum
    })
})

module.exports = router
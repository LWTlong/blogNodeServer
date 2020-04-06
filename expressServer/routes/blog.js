const express = require('express')
const router = express.Router()
const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')


router.get('/list', (req, res, next) => {
    const author = req.query.author || ''
    const keyword = req.query.keyword || ''
    getList(author, keyword).then(data => {
        res.json(new SuccessModel(data))
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
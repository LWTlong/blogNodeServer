const router = require('koa-router')()
const {loginCheck} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async (ctx, netx) => {
    const {username, password} = ctx.request.body
    const result = await loginCheck(username,password).catch(err => {
        ctx.body = new ErrorModel(err)
        return
    })
    if(result.username){
        // 设置 session
        ctx.session.username = result.username
        ctx.session.realname = result.realname

        ctx.body = new SuccessModel(result, '登录成功')
    }else {
        ctx.body = new ErrorModel(result, '登录失败')
    }
})

router.get('/login-test', (ctx, next) => {
    if (ctx.session.username) {
        ctx.body = new SuccessModel(ctx.session, '已登录')
        return
    }
    ctx.body = new ErrorModel('未登录')
})

router.get('/session', async (ctx, next) => {
    if (ctx.session.viewCount == null) {
        ctx.session.viewCount = 0
    }
    ctx.session.viewCount++
    ctx.body = {
        code: 0,
        viewCount: ctx.session.viewCount
    }
})

module.exports = router
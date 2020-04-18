const router = require('koa-router')()
const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

router.prefix('/api/blog')

const LoginCheck = async (ctx, next) => {
    if (!ctx.session.username) {
        ctx.body = new ErrorModel('未登录')
        return
    }
    await next()
}

router.get('/list', async (ctx, next) => {
    const author = ctx.query.author || ''
    const keyword = ctx.query.keyword || ''
    console.log(ctx.query)
    const result = await getList(author, keyword).catch(err => {
        ctx.body = new ErrorModel(err)
        console.log(ctx.body)
        return
    })
    ctx.body = new SuccessModel(result)
    console.log(ctx.body)
})

router.get('/detail', async (ctx, next) => {
    console.log(ctx.query)
    const result = await getDetail(ctx.query.id).catch(err => {
        ctx.body = new ErrorModel(err)
        console.log(ctx.body)
        return
    })
    ctx.body = new SuccessModel(result)
    console.log(ctx.body)
})

router.post('/new', LoginCheck, async (ctx, next) => {
    const author = ctx.session.realname
    ctx.request.body.author = author
    const result = await newBlog(ctx.request.body).catch(err => {
        ctx.body = new ErrorModel(err)
        return
    })
    ctx.body = new SuccessModel(result)
})

router.post('/update', LoginCheck, async (ctx, next) => {
    const result = await updateBlog(ctx.query.id, ctx.request.body).catch(err => {
        ctx.body = new ErrorModel(err)
        return
    })
    if (result) {
        ctx.body = new SuccessModel(result, '更新成功')
    } else {
        ctx.body = new ErrorModel('更新失败')
    }
})

router.post('/del', LoginCheck, async (ctx, next) => {
    const author = ctx.session.realname
    const result = await delBlog(ctx.query.id, author).catch(err => {
        ctx.body = new ErrorModel(err)
    })
    if (result) {
        ctx.body = new SuccessModel(result, '删除成功')
    } else {
        ctx.body = new ErrorModel('删除失败')
    }
})

module.exports = router
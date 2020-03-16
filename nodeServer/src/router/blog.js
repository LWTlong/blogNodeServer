const {getList, getDetail, newBlog, updateBlog, delBlog} = require('../controller/blog')
const {SuccessModel, ErrorModel} = require('../model/resModel')

const handleBlogRouter = async (req, res) => {
    const method = req.method
    const id = req.query.id
    // 获取博客列表
    if (method === 'GET' && req.path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        return getList(author, keyword).then(res => {
            return new SuccessModel(res)
        }).catch(err => {
            return new ErrorModel(err)
        })

    }

    // 获取博客详情
    if (method === 'GET' && req.path === '/api/blog/detail') {
        return getDetail(id).then(data => {
            return new SuccessModel(data)
        }).catch(err => {
            return new ErrorModel(err)
        })

    }
    // 新建博客
    if (method === 'POST' && req.path === '/api/blog/new') {
        const author = 'lwt'
        req.body.author = author
        return newBlog(req.body).then(res => {
            return new SuccessModel(res)
        }).catch(err => {
            return new ErrorModel(err)
        })

    }

    // 更新博客
    if (method === 'POST' && req.path === '/api/blog/update') {
        return updateBlog(id, req.body).then(res => {
            if (res) {
                return new SuccessModel(res, '更新成功')
            } else {
                return new ErrorModel('更新失败')
            }
        }).catch(err => {
            return new ErrorModel(err)
        })

    }

    // 删除博客
    if (method === 'POST' && req.path === '/api/blog/del') {
        const author = 'lwt'
        return delBlog(id, author).then(res => {
            if (res) {
                return new SuccessModel(res, '删除成功')
            } else {
                return new ErrorModel('删除失败')
            }
        }).catch(err => {
            return new ErrorModel(err)
        })

    }
}

module.exports = handleBlogRouter
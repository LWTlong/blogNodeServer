const {exec, escape} = require('../db/mysql')
const xss = require('xss')

const getList = async (author, keyword) => {
    // 1=1 为了 衔接 where
    let sql = 'select * from blogs where 1=1 '
    if (author) {
        author = escape(author)
        sql += `and author=${author} `
    }
    if (keyword) {
        keyword = escape('%' + keyword + '%')
        sql += `and title like ${keyword} `
    }
    sql += `order by createTime desc;`
    return await exec(sql)
}

const getDetail = async (id) => {
    const sql = `select * from blogs where id='${id}'`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    // blogData { title, content, author}
    let {title, content, author} = blogData
    // title = xss(title) // 前端需要转移标签的 </> 这里先注释掉
    title = escape(title)
    content = escape(content)
    author = escape(author)
    const createTime = Date.now()
    const sql = `insert into blogs (title, content, author, createTime) values (${title}, ${content}, ${author}, ${createTime})`
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
        // console.log(insertData)
        // insertData{
        //   fieldCount: 0,
        //   affectedRows: 1,
        //   insertId: 3,
        //   serverStatus: 2,
        //   warningCount: 0,
        //   message: '',
        //   protocol41: true,
        //   changedRows: 0
        // }
}

const updateBlog = async (id, blogData = {}) => {
    // id 更新博客的id  blogData = {title, content}
    let {title, content} = blogData
    title = escape(title)
    content = escape(content)
    const sql = `update blogs set title=${title}, content=${content} where id='${id}'`
    const updateData = await exec(sql)
    console.log(updateData)
    if (updateData.affectedRows > 0) {
        return true
    }
    return false
        // console.log(updateData)
        // updateData{
        //     fieldCount: 0,
        //     affectedRows: 1,
        //     insertId: 0,
        //     serverStatus: 2,
        //     warningCount: 0,
        //     message: '(Rows matched: 1  Changed: 1  Warnings: 0',
        //     protocol41: true,
        //     changedRows: 1
        // }
}

const delBlog = async (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`
    const delData = await exec(sql)
    console.log(delData)
    if (delData.affectedRows > 0) {
        return true
    }
    return false
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
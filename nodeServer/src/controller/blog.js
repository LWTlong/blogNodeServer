const {exec} = require('../db/mysql')

const getList = (author, keyword) => {
    // 1=1 为了 衔接 where
    let sql = 'select * from blogs where 1=1 '
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createTime desc;`
    return exec(sql)
}

const getDetail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    // blogData { title, content, author}
    const {title, content, author} = blogData
    const createTime = Date.now()
    const sql = `insert into blogs (title, content, author, createTime) values ('${title}', '${content}', '${author}', ${createTime})`
    return exec(sql).then(insertData => {
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
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    // id 更新博客的id  blogData = {title, content}
    const {title, content} = blogData
    const sql = `update blogs set title='${title}', content='${content}' where id='${id}'`
    return exec(sql).then(updateData => {
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

        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    const sql = `delete from blogs where id='${id}' and author='${author}'`

    return exec(sql).then(delData => {
        // delData 和 update 的一样
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
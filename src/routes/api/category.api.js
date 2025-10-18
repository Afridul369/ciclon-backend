const exprees = require('express')
const _ = exprees.Router()
const categoryController = require('../../controller/category.controller')
const upload = require('../../middleware/multer.middleware')


_.route('/create_category').post(upload.fields([{name:"image",maxCount:1}]),categoryController.createCategory)

module.exports = _
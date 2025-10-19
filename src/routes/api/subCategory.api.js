const exprees = require('express')
const _ = exprees.Router()
const subCategoryController = require('../../controller/subCategory.controller')

_.route('/create-subcategory').post(subCategoryController.CreateSubCategory)
_.route('/allsubcategory').get(subCategoryController.getAllCategory)
_.route('/singlesubcategory/:slug').get(subCategoryController.getsSingleSubCategory)
_.route('/updatesubcategory/:slug').get(subCategoryController.UpdateSubCategory)
_.route('/deletesubcategory/:slug').delete(subCategoryController.DeleteSubCategory)

module.exports = _
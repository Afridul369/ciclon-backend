const exprees = require('express')
const _ = exprees.Router()
const variantController = require('../../controller/variant.controller')
const upload = require('../../middleware/multer.middleware')

_.route('/create-variant').post(upload.fields([{name:'image',maxCount:5}]),variantController.CreateVariant)
_.route('/get-single-variant/:slug').get(variantController.GetSingleVariant)
_.route('/all-variant').get(variantController.GetAllVariant)
_.route('/delete-variant/:slug').delete(variantController.DeleteVariant)
_.route('/update-variantinfo/:slug').put(upload.fields([{name:'image',maxCount:5}]),variantController.UpdateVariantInfo)
_.route('/delete-variant-image/:slug').delete(variantController.DeleteImageVariant)

module.exports = _
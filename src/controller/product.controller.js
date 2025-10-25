const { asyncHandler } = require("../utils/asynchandeler");
const { apiResponse } = require("../utils/apiResponse");
const { customError } = require("../utils/customError");
const { validateProduct } = require("../validation/product.validation");
const {
  uploadCloudinaryImage,
  deleteCloudinaryImage,
  getImageCoudinaryPublicId,
} = require("../helper/cloudinary");
const { generateQR, generateBarCode } = require("../helper/QrAndBarCode");
const productModel = require("../models/product.model");


// Create Product
exports.CreateProduct = asyncHandler(async (req, res) => {
  const data = await validateProduct(req);
  if (!data.category || data.category === "") data.category = null;
  if (!data.subCategory || data.subCategory === "") data.subCategory = null;
  if (!data.brand    || data.brand === "") data.brand = null;
  if (!data.variant  || data.variant === "") data.variant = null;
  if (!data.discount || data.discount === "") data.discount = null;
  const { image } = data;
  // upload into cloudinary
  let imageData = [];
  for (const img of image) {
    const imgInfo = await uploadCloudinaryImage(img.path);
    imageData.push(imgInfo);
  }
  // upload into database
  const product = await productModel.create({ ...data, image: imageData });
  if (!product) {
    throw new customError(500, "Product Created Failed");
  }
// QrCode
    const QrCodeLink = `https://www.daraz.com.bd/products/chuwi-n4020-156-8g-256g-i332299991-s1619295140.html?c=&channelLpJumpArgs=&clickTrackInfo=query%253Alaptop%253Bnid%253A332299991%253Bsrc%253ALazadaMainSrp%253Brn%253A5978d76f554e0b9dd5f41b3ff9909cde%253Bregion%253Abd%253Bsku%253A332299991_BD%253Bprice%253A27500%253Bclient%253Adesktop%253Bsupplier_id%253A700509489030%253Bbiz_source%253Ahttps%253A%252F%252Fwww.daraz.com.bd%252F%253Bslot%253A3%253Butlog_bucket_id%253A470687%253Basc_category_id%253A57%253Bitem_id%253A332299991%253Bsku_id%253A1619295140%253Bshop_id%253A214209%253BtemplateInfo%253A-1_A3_C%25231103_L%2523&freeshipping=1&fs_ab=1&fuse_fs=&lang=en&location=Dhaka&price=2.75E%204&priceCompare=skuId%3A1619295140%3Bsource%3Alazada-search-voucher%3Bsn%3A5978d76f554e0b9dd5f41b3ff9909cde%3BoriginPrice%3A2750000%3BdisplayPrice%3A2750000%3BsinglePromotionId%3A-1%3BsingleToolCode%3AmockedSalePrice%3BvoucherPricePlugin%3A0%3Btimestamp%3A1761311102276&ratingscore=5.0&request_id=5978d76f554e0b9dd5f41b3ff9909cde&review=4&sale=12&search=1&source=search&spm=a2a0e.searchlist.list.3&stock=1`;
    const QrCode = await generateQR(QrCodeLink)
// BarCode
    const BarCode = await generateBarCode(product.Sku)
    // now update database
    product.QrCode = QrCode
    product.barCode = BarCode
    await product.save()
    apiResponse.sendSucces(res,200,"Product Created Successfully",product)
});

// Get All Product
exports.GetAllProducts = asyncHandler(async(req,res)=>{
    const allproduct = await productModel.find().populate('category subCategory brand').sort({createdAt : -1})
    if (!allproduct.length) {
        throw new customError(401,' No Product Exist')
    }
    apiResponse.sendSucces(res,200,'All Products Shown', allproduct)
})

// get single product
exports.GetSingleProduct = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
        throw new customError(401,"Please Insert Your Product Name")
    }
    const product = await productModel.findOne({slug})
    if (!product) {
        throw new customError(401,'Product Not Found')
    }
    apiResponse.sendSucces(res,200,'Your Product Found Successfully', product)
})

//update product Info
exports.UpdateProductInfo = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
      throw new customError(401,'Please Insert Product Name')
    }
    const product = await productModel.findOneAndUpdate({slug},{...req.body},{new:true})
    if (!product) {
      throw new customError(401,'Product Not found...')
    }
    apiResponse.sendSucces(res,200,'ProductInfo Update Successfully',product)
})

// update product image
exports.UploadproductImage = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    if (!slug) {
      throw new customError(401,'Please Insert Product Name')
    }
    const product = await productModel.findOne({slug})
    if (!product) {
      throw new customError(401,'Product Not found...')
    }
    // pick per image by for loop from req.files.image
    for (const imagedata of req.files.image) {
        const imageURL = await uploadCloudinaryImage(imagedata.path) // cloudinary needs image's path
        product.image.push(imageURL) // upload the new updated image into database
    }
    await product.save()
    apiResponse.sendSucces(res,200,'product Image Upload Successfull',product)
})

//delete product image
exports.DeleteProductImage = asyncHandler(async(req,res)=>{
    const {slug} = req.params
    const {imageId} = req.body  // take the image full link from user
    if (!slug && !imageId) {
      throw new customError(401,'Product Slug Or ImageId Missing !!')
    }
    const product = await productModel.findOne({slug})  // fetch the full product
    if (!product) {
      throw new customError(401,'Product Not found...')
    }
    const updatedImage = product.image.filter((perImage)=> perImage !== imageId) // user given imageId remove from the array of image in database & stored in updatedImage
    const publicId = getImageCoudinaryPublicId(imageId) // getImageCoudinaryPublicId gives the exact cloudinary image ID exacting the image link
    await deleteCloudinaryImage(publicId) // finally deleting the image from cloudinary using image id which is unique in cloudinary
    product.image = updatedImage  // updatedImage = remaining images are stored in Database
    await product.save()
    apiResponse.sendSucces(res,200,'Image Delete From Database & Cloudinary Successfully',product)

})

// serach product by category,subcategory,brand or others
exports.SearchProducts = asyncHandler(async(req,res)=>{
    const {category,subcategory,brand,tag} = req.params
    let query = {}
    if (category) {
      query.category = category
    }
    if (subcategory) {
      query.subcategory = subcategory
    }
    if (brand) {
        if (Array.isArray(brand)) {
            query.brand = { $in : brand }
        }else{
          query.brand = brand
        }
    }
    if (tag) {
        if (Array.isArray(tag)) {
            query.tag = { $in : tag }
        }else{
          query.tag = tag
        }
    }
    const product = await productModel.find(query).populate('category subCategory brand')
    if (!product) {
        throw new customError(401,'Product Not Found') 
    }
    apiResponse.sendSucces(res,200,'Products Found Successfully',product)
})
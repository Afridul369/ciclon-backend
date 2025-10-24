const QRCode = require('qrcode')
const bwipjs = require('bwip-js') 
const { customError } = require('../utils/customError')

exports.generateQR = async (text) => {
  try {
    return await QRCode.toDataURL(text,{
        errorCorrectionLevel: 'H',
        margin: 1,
    })
  } catch (error) {
    console.error(error)
    throw new customError(500,`Error from QrCode : ${error}` )
  }
}

exports.generateBarCode = async (text) => {
    try {
    return bwipjs.toSVG({
    bcid:        'code128',       // Barcode type
    text:        text,            // Text to encode
    height:      12,              // Bar height, in millimeters
    includetext: true,            // Show human-readable text
    textxalign:  'center',        // Always good to set this
    textcolor:   '000000',        // black text
    });
    } catch (error) {
        throw new customError(500,"Error From BarCode " )
    }
}
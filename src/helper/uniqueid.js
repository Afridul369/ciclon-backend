const crypto = require('crypto')


// Transaction Id
exports.getTransactionId = () => {
    const unique = crypto.randomUUID() 
    const items = unique.split('-')
    const part = items[items.length - 1]
    return part
}

// Product Name
exports.GetProductName = (items) => {
    const arr = items
    let productNames = []
    arr.map((perItem)=>{
        if (perItem.variantType == "single") {
            productNames.push(perItem.name)        
        }else{
            productNames.push(perItem.variantName)
        }
    })
    return productNames.join(',')
}

class apiResponse{
    constructor(statusCode,message,data){
        this.status = statusCode >= 200 && statusCode < 300 ? 'Ok' : 'Client Error',
        this.statusCode = statusCode || 500,
        this.messege = message || 'Succesfull',
        this.data = data || null
    }

    static sendSucces (res,statusCode,message,data){
        return res.status(statusCode).json(new apiResponse(statusCode,message,data))
    }
}


module.exports = {apiResponse}
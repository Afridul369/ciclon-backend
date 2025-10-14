class customError extends Error{
    constructor(statusCode,message){
        super(message)
        this.statusCode = statusCode,
        this.message = message,
        this.status = statusCode >= 400 && statusCode < 500 ? 'Client Error':'Server Error',
        this.data = null,
        this.isOperationalError = true,
        this.stack
    }
}

module.exports = {customError}
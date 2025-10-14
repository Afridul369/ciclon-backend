const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { globalErrorHandler } = require('./utils/globalErrorHandler')
const app = express()

// packages
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// routes
app.use('/api/v1', require('./routes/index.api'))

// global error handling 
app.use(globalErrorHandler)

module.exports = {app}
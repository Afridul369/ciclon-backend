const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const {createServer} = require('http')
const { globalErrorHandler } = require('./utils/globalErrorHandler')
const { initSocket } = require('./socket.io/server')
const app = express()
const httpServer = createServer(app);
// packages
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// routes
app.use('/api/v1', require('./routes/index.api'))

// global error handling 
app.use(globalErrorHandler)
initSocket(httpServer)

module.exports = {httpServer}
require("dotenv").config();
const { connectDatabase } = require("./src/database/DB.config");
const {httpServer} = require('./src/app')

connectDatabase()
  .then(() => {
    httpServer.listen(process.env.PORT || 5000,()=>{
        console.log(`server running on http://localhost:${process.env.PORT}`);
    })
  })
  .catch((error) => {
    console.log("error from database", error);
  });

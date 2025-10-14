require("dotenv").config();
const { connectDatabase } = require("./src/database/DB.config");

const {app} = require('./src/app')

connectDatabase()
  .then(() => {
    app.listen(process.env.PORT || 5000,()=>{
        console.log(`server running on http://localhost:${process.env.PORT}`);
    })
  })
  .catch((error) => {
    console.log("error from database", error);
  });

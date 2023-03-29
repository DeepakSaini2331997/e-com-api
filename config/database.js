const mongoose = require('mongoose');

const connectDatabase = () =>{
    mongoose.connect(process.env.DB_URI,{useNewUrlParser:true,useUnifiedTopology:true}).then((data)=>{
        console.log(`Connect to monogoose server on ${data.connection.host}`)
    })
    // .catch((error)=>{
    //     console.log('Not Connect to monogoose',error)
    // })
}
module.exports = connectDatabase
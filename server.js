const app = require('./app');
const dotenv = require('dotenv');
const connectDatabase = require('./config/database')

//Handling uncaught Exception

process.on('uncaughtException',(err)=>{
    console.log(`Error ${err}`);
    console.log('Shutting down the server due to uncaught Exception error');
    server.close(()=>{
        process.exit(1);
    })
})

//config
dotenv.config({path:"config/.env"});

//connection to db
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log('connect server on this port',process.env.PORT);
})

//console.log(szdxcvbnm);

// Handling promise rejection error
process.on('unhandledRejection',(err)=>{
    console.log(`Error is ${err}`)
    console.log('Shutting down the server due to unhandled promise rejection error')
    server.close(()=>{
        process.exit(1);
    })
})
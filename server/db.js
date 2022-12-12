const mongoose=require('mongoose');

var mongoURL='mongodb+srv://ayushhh:1Mgog0FEcCj4Ad0z@cluster0.tpuz8os.mongodb.net/mern-hotel';

mongoose.connect(mongoURL,{useUnifiedTopology:true, useNewUrlParser:true})

var connection=mongoose.connection;

connection.on('error',()=>{
    // console.log("Connection failed");
})

connection.on('connected',()=>{
    // console.log("Connection successful");
})

module.exports=mongoose
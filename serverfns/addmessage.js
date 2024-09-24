require("dotenv").config()
const mongoose =require("mongoose")
const bcrypt=require("bcryptjs")
const {ObjectId} =require("mongodb");
const { Users } = require("./adduser");

mongoose.set("strictQuery", false);
const dbOptions={
    useNewUrlParser: true,
    useUnifiedTopology: true}

    async function addmessage(i,timee,message,person){
await mongoose.connect(process.env.DATABASEURL,dbOptions);
const update={
    $push:{
        posts:{
            user:person,
time:timee,
content:message
        }
    }
}
try {
    await Users.updateOne({_id:ObjectId(i)} , update)
  } catch (error) {
    console.log(error)
  }
  console.log("A post was added")
    }
module.exports= {addmessage};
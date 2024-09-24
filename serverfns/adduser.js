require("dotenv").config()

const mongoose =require("mongoose")
const bcrypt=require("bcryptjs")
mongoose.set("strictQuery", false);

const dbOptions={
    useNewUrlParser: true,
    useUnifiedTopology: true}

    const postSchema= new mongoose.Schema(
        { user:{type:String},
            time:{type:String},
            content:{type:String}
        }
    )

    const userSchema=mongoose.Schema(
        {
            firstname:{type:String},
            lastname:{type:String},
            password:{type:String},
            email:{type:String},
            member:{type:Boolean,default:false},
            posts:[postSchema]
        }
    )
    const Users= mongoose.model("Users",userSchema)

async function addUser(fn,ln,p,e){
await mongoose.connect(process.env.DATABASEURL,dbOptions,(err)=>{
if(!err){
    console.log("ADD CONNECTION WAS SUCCESSFULL")
}
})
await Users.create({
    firstname:fn,
    lastname:ln,
    password: bcrypt.hashSync(p,10),
    email:e,
    member:false,
    posts:[]
});
console.log("Successfully added a user")
}

module.exports={addUser,Users}
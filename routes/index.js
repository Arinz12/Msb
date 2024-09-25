require("dotenv").config()
var express = require('express');
var router = express.Router();
const fs=require("fs")
const path=require("path")
const{DateTime} =require("luxon");
const bcrypt=require("bcryptjs")
const mongoose=require("mongoose")
const {ObjectId} =require("mongodb");
const { addUser, Users } = require('../serverfns/adduser');
const passport = require("passport");
const { addmessage } = require("../serverfns/addmessage");
const LocalStrategy = require('passport-local').Strategy;
router.use(passport.initialize());
router.use(passport.session());



passport.use(
  new LocalStrategy({usernameField:"email"},
    async (username,password,done)=>{
      await mongoose.connect(process.env.DATABASEURL ,{
        useNewUrlParser: true,
        useUnifiedTopology: true,});
      try {
        const user= await Users.findOne({email:username});
        if (!user){
return done(null,false,{message:"Username is incorrect"})
        }
        const match= bcrypt.compareSync(password,user.password)
        if(!match){
return done(null,false,{message:"password is incorrect"})
        }
        return done(null,user)
      } catch (error) {
       console.log(error) 
      }
    }
  )
)
passport.serializeUser((user,done)=>{
  done(null,user.id)
})
passport.deserializeUser(async(id,done)=>{
try {
  const user= await Users.findById(id)
  done(null,user)
} catch (error) {
  done(error)
}
})

const logcheck=(req,res,next)=>{
  if(!req.isAuthenticated()){
    res.redirect("/login")
  }
  else{
    next()
  }
}




async function getPosts(){
  await mongoose.connect(process.env.DATABASEURL ,{
    useNewUrlParser: true,
    useUnifiedTopology: true,});
  const posts= await Users.find();
  const posts1=posts.map((a)=>a.posts);
  const posts2=posts1.flat();
  const posts3=posts2.sort((a,b)=>new Date(a.time)-new Date(b.time));
return posts3
}
router.get('/', async (req, res, next)=>{
  const messages = await getPosts()
  //console.log(messages)

  if(req.isAuthenticated()){
    if(req.user.member){
    res.render('index', { title: 'MESSAGES',message:messages,loggedin:true,member:true});}
    else{

      res.render('index', { title: 'MESSAGES',message:messages,loggedin:true});}


  }else{
  res.render('index', { title: 'MESSAGES',message:messages });
  }
});

router.get('/new', function(req, res, next) {
  res.send(fs.readFileSync(path.join(__dirname,"..","form.html"),"utf8"));
});


router.post('/new',logcheck, async (req, res, next)=>{
  const id=req.user._id;
  const user=req.user.email;
  const text=req.body.message;
  const added=DateTime.local().toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
  if(!text){res.redirect("/")}
  else{
  //messages.push({text:text,user:user,added:added})
  try {
    await addmessage(id,added,text,user)
  } catch (error) {
    console.log(error)
  }
  console.log("Post Success")
  res.redirect('/');}
});

//Get request for sign up and login
router.get("/signup", async (req,res)=>{
res.send(fs.readFileSync(path.join(__dirname,"..","statpages/signup.html"),"utf8"))
})
router.get("/login",(req,res)=>{
  res.send(fs.readFileSync(path.join(__dirname,"..","statpages/login.html"),"utf8"))

})


//Post request for signup and login
router.post("/signup", async(req,res)=>{
const fname=req.body.fname;
const lname=req.body.lname;
const pass=req.body.password;
const email=req.body.email;

await addUser(fname,lname,pass,email)
res.redirect("/login")
})


router.post("/login",passport.authenticate("local",{
  failureRedirect:"/login",
  successRedirect:"/"
}))
//becoming a member
router.get("/become",async(req,res,next)=>{
  const dbOptions={
    useNewUrlParser: true,
    useUnifiedTopology: true}
    await mongoose.connect(process.env.DATABASEURL,dbOptions);
    try {
      await Users.updateOne(
        { _id:ObjectId(req.user._id) }, // Replace with your filter criteria
        { $set: { member: true } } // Replace fieldName and newValue
      )
      console.log("DONNNNNE")
      res.redirect("/");
    } catch (error) {
      console.log(error)
    re.redirect("/")
    }
   
})
router.get("/logout",(req,res,next)=>{
  req.logout((err) => {
    if (err) {
      return next(err); // Handle any logout error
    }
    res.redirect('/'); // Redirect after successful logout
  });
})



module.exports = router;

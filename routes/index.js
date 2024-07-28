var express = require('express');
var router = express.Router();
const fs=require("fs")
const path=require("path")
const{DateTime} =require("luxon")
const messages = [
  {
    text: "Hi there!",
    user: "Amando",
    added: DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
  },
  {
    text: "Hello World!",
    user: "Charles",
    added: DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)
  }
];
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MESSAGES',message:messages });
});

router.get('/new', function(req, res, next) {
  res.send(fs.readFileSync(path.join(__dirname,"..","form.html"),"utf8"));
});
router.post('/new', function(req, res, next) {
  const user=req.body.user;
  const text=req.body.messa;
  const added=DateTime.fromJSDate(new Date()).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
  if(user==null||text==(null||"")||added==null){res.redirect("/new")}
  else{
  messages.push({text:text,user:user,added:added})
  res.redirect('/');}
});
module.exports = router;

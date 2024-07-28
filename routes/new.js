var express = require('express');
var router = express.Router();
const fs=require("fs")
const path=require("path")
const ppp=path.join(__dirname,"..","form.html")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send(fs.readFileSync(ppp,"utf8"));
});
router.post('/', function(req, res, next) {
  const user=req.body.user;
  const text=req.body.messa;
  const added=new Date();
  messages.push({text:text,user:user,added:added})
  res.send('respond with a resource');
});

module.exports = router; 

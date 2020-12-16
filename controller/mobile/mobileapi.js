var express = require('express');
var bodyParser = require('body-parser');
var dbconnection=require('../../connection/db');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',function(req,res,next){
  return res.send("connected");

})

router.get('/userlogin',function(req,res){
 let pro_name="CALL SP_Mobile_UserLogin('"+req.query.username+"','"+req.query.password+"')";
 dbconnection(pro_name, (err, result) => {
   if (err) return res.send(err);
   return res.send(result[0]);
 })
})

router.get('/getproducts',function(req,res){
  let pro_name="CALL SP_Mobile_Products('"+req.query.username+"','"+req.query.password+"')"

})

router.get('/getproducts',function(req,res){
  let pro_name="CALL SP_Mobile_Customers('"+req.query.username+"','"+req.query.password+"')"

})


router.get('/getvisit',function(req,res){
  let pro_name="CALL SP_Mobile_Visit('"+req.query.username+"','"+req.query.password+"')"

})

module.exports = router;

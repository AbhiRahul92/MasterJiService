var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var Q = require('q');
var _ = require("underscore");
var fs = require('fs');
var path = require('path');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',function(req,res,next){
  return res.send("connected");

})
router.get('/MobileLogin', function (req, res, next) {
   var login_ob = require("../app_module/Login/logindll");
  login_ob.logOn(req.query.ProfileId, req.query.Username, req.query.Password)
   .then(function (_res) {    
       res.send(_res);
   }).catch(function (err) {
       res.status(500).send({ status: 'error', message: err.message });
   });
});

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

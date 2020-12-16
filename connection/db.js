var mysql = require('mysql');

const conn =mysql.createConnection({
  host     : '18.222.239.73',       
  user     : 'root',              
  password : 'root', 
  port     : '3306',                   
  database : 'masterjidb',
  insecureAuth : true
})

 module.exports = (query, callback) => {
     conn.query(query,function(err,result,field){
       if(err) 
     {  
      console.log(err)
     }
       callback(err, result) 
     })
 }
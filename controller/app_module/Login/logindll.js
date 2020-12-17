var _ = require("underscore");
var Q = require('q');
var dB = require("../mysqlHelper");
// var crypto = require('crypto'),
//     algorithm = 'aes-256-ctr',
//     password = 'd6F3Efeq';

var Login = function () {
    var that = this;
    that.logOn = function (ProfileId, username, password) {
        debugger;
        console.log(ProfileId)
        var deferred = Q.defer();        
        if(ProfileId=="1")
        var pro_name="CALL SP_Parents_Get_Att()";
        dB.executeSelectQuery(pro_name).then(function (rds) {
            deferred.resolve(rds);                                                       
            }).catch(function (err) { deferred.reject(err); });           
        return deferred.promise;
    };
};

module.exports = new Login();


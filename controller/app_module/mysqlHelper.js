var mysql = require('mysql');
var Q = require('q');
var _ = require("underscore");
var fs = require('fs');
var path = require('path');

var MySqlHelper = function () {
    var that = this;
    var fffl = fs.readFileSync(path.join(global.appRoot = path.resolve(__dirname), 'config.js'), 'utf8');
    var pf = eval(fffl);
    var profile = _.find(pf, function (d) { return d.id == "1"; });
var getConnection = function (cb) {
    var connection = mysql.createConnection({
        host: profile.server,
        user: profile.user,
        password: profile.password,
        port     : profile.dbport,
        database: profile.database,
        multipleStatements:true,
        insecureAuth : true
    });
    connection.connect(function (err) {
        cb(err, connection);
    });
};
    that.executeSelectQuery = function (qry) {
        var deferred = Q.defer();
        getConnection( function (err, conn) {
            if (err) {
                deferred.reject(err);
            }
            else {
                conn.query(qry, function (err, rows, fields) {
                    if (err) deferred.reject(err);
                    else {
                        debugger;
                        var sch = createSchema(fields);
                        deferred.resolve({ data: rows, schema: sch });
                    }
                    conn.end(function (err) { });
                });
            }
        });
        return deferred.promise;
    };

    that.executeMultipleSelectQuery = function (config, qry, op) {
        var deferred = Q.defer();
        config.multipleStatements = true;
        getConnection(config, function (err, conn) {
            if (err) {
                deferred.reject(err);
            }
            else {
                conn.query(qry, function (err, rows, fields) {//not handled
                    if (err) deferred.reject(err);
                    else {
                        debugger;
                        var sch = createSchema(fields);
                        deferred.resolve({ data: rows, schema: sch });
                    }
                    conn.end(function (err) { });
                });
            }
        });
        return deferred.promise;
    };

    that.executeDmlQuery = function (config, qry, op) {
        var deferred = Q.defer();
        getConnection(config, function (err, conn) {
            if (err) {
                deferred.reject(err);
            }
            else {
                conn.query(qry, function (err, rows, fields) {
                    if (err) deferred.reject(err);
                    else
                        deferred.resolve({ rowsAffected: rows.affectedRows });
                    conn.end(function (err) { });
                });
            }
        });
        return deferred.promise;
    };

    that.executeScalar = function (config, qry, op) {
        var deferred = Q.defer();
        getConnection(config, function (err, conn) {
            if (err) {
                deferred.reject(err);
            }
            else {
                conn.query(qry, function (err, rows, fields) {
                    if (err) deferred.reject(err);
                    else {
                        deferred.resolve(rows[0][0]);
                    }
                    conn.end(function (err) { });
                });
            }
        });
        return deferred.promise;
    };

    that.getTablesSchema = function (config, tables, op) {
        var deferred = Q.defer();
        var Sqlstr = "";
        _.each(tables, function (tab) {
            Sqlstr += " Select * From " + tab + " Where 1=2 ;";
        });
        config.multipleStatements = true;
        getConnection(config, function (err, conn) {
            if (err) {
                deferred.reject(err);
            }
            else {
                conn.query(Sqlstr, function (err, rows, fields) {//not handled
                    if (err) deferred.reject(err);
                    else {

                        var sch = createSchema(fields);
                        deferred.resolve({ data: rows, schema: sch });
                    }
                    conn.end(function (err) { });
                });
            }
        });
        return deferred.promise;
    };


    //Schema Creation*************************/
    function createSchema(cols) {
        var sch = [];
        _.each(cols, function (d,i) {
            sch.push({ index: i, name: d.name, type: getColType(d.type) });
        });
        return sch;
    }

    function getColType(typ) {
        var t = "String";
        switch (typ) {
            case 246:
                t = "Decimal";
                break;
            case 3:
                t = "Int";
                break;
            case 8:
                t = "BigInt";
                break;
            case 2:
                t = "SmallInt";
                break;
            case 12:
                t = "DateTime";
                break;
            case 10:
                t = "Date";
                break;
            case 11:
                t = "Time";
                break;

        }
        return t;
    }
    //****************************************/

    


    var TransClass = function (config) {
        var that = this;
        that._connection = null;
        var rolledBack = false;

        that.begin = function () {
            var deferred = Q.defer();
            getConnection(config, function (err, connection) {
                if (err)
                    deferred.reject(err);
                else {
                    connection.beginTransaction(function (err) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            that._connection = connection;
                            deferred.resolve({});
                        }
                    });
                }
            });
            return deferred.promise;
        };

        that.commit = function () {
            that._connection.commit(function (err) {
                if (err) {
                    that.onerror(err);
                    that._connection.rollback();
                }
                else {

                }
            });
        };
        that.rollback = function () {
            if (!rolledBack) {
                that._connection.rollback(function (err) {
                    if (err) {
                        that.onerror(err);
                    }
                    else {

                    }
                });
            }
        };
        that.onerror = function (err) { };

        that.executeCommand = function (qry) {
            var deferred = Q.defer();
            that._connection.query(qry, function (err, rows, fields) {
                if (err) {
                    that.rollback();
                    deferred.reject(err);
                    that.onerror(err);
                }
                else {
                    deferred.resolve({ rowsAffected: rows.affectedRows });
                }
            });
            return deferred.promise;
        };
    };

    that.getTransaction = function (config) {
        return new TransClass(config);
    };
    
};

module.exports = new MySqlHelper();
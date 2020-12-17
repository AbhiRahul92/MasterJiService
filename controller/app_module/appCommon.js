var _ = require("underscore");
var path = require('path');
var fs = require("fs");

var AppCommon = function () {
    var that = this;
    that.processDataWithPaging = function (rds, op) {
        var pageSize = (op.pageSize ? op.pageSize : 50), pageIndex = (op.pageIndex ? op.pageIndex : 1);
        var d = rds.data;
        var count = d.length;
        if (op.sort) {
            if (op.sortDir == 'desc')
                d = d.sort(function (a, b) { return (a[op.sort] < b[op.sort]) ? 1 : ((b[op.sort] < a[op.sort]) ? -1 : 0); });
            else
                d = _.sortBy(d, op.sort);
        }
        if (pageSize >= 0) {
            var offset = (pageIndex - 1) * pageSize;                        
            d = _.rest(d, offset);
            d = _.first(d, pageSize);
        }
        var rt = { data: d, index: pageIndex, count: count, pageSize: pageSize, schema: rds.schema };
        return rt;
    };

    //Widgets **********************************
    that.getWidget = function (module, id) {
        var pth = path.join(global._topDirName, 'datafiles');
        pth = path.join(pth, 'widget/' + module + '.js');
        var data = eval(fs.readFileSync(pth, 'utf8'));
        var rt = _.find(data, function (d) { return d.Id == id; });
        return rt;
    };

    //Browsers ***********************************
    that.getBrowserObject = function (docid) {
        var pth = path.join(global._topDirName, 'datafiles');
        pth = path.join(pth, 'browser/sales.js');
        var data = eval(fs.readFileSync(pth, 'utf8'));
        var rt = _.find(data, function (d) { return d.DocId == docid; });
        return rt;
    };

    //Reports ***********************************
    var ReportCls = function () {
        var that = this;
        
    };    

    //Utils **************************************
    that.utils = {
        formatString: function () {
            if (arguments.length == 0) {
                return null;
            }
            var str = arguments[0];
            for (var i = 1; i < arguments.length; i++) {
                var placeHolder = '{' + (i - 1) + '}';
                str = str.replace(placeHolder, arguments[i]);
            }
            return str;
        }
    };

    that.report = new ReportCls();
};
module.exports = new AppCommon();
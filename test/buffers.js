var assert = require('assert');
var Buffers = require('buffers');

exports.slice = function () {
    var bufs = Buffers();
    bufs.push(new Buffer([0,1,2,3]));
    bufs.push(new Buffer([4,5]));
    bufs.push(new Buffer([6,7,8]));
    bufs.push(new Buffer([9]));
    var xs = [0,1,2,3,4,5,6,7,8,9];
    for (var i = 0; i < xs.length; i++) {
        for (var j = i; j < xs.length; j++) {
            var a = bufs.slice(i,j);
            var b = new Buffer(xs.slice(i,j));
            
            assert.eql(a, b,
                '[' + [].join.call(a, ',') + ']'
                    + ' != ' + 
                '[' + [].join.call(b, ',') + ']'
            );
        }
    }
};


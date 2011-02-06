var assert = require('assert');
var Buffers = require('buffers');

function create (xs, split) {
    var bufs = Buffers();
    var offset = 0;
    split.forEach(function (i) {
        bufs.push(new Buffer(xs.slice(offset, offset + i)));
        offset += i;
    });
    return bufs;
}

exports.slice = function () {
    var xs = [0,1,2,3,4,5,6,7,8,9];
    var splits = [ [4,2,3,1], [2,2,2,2,2], [1,6,3,1], [9,2], [10], [5,5] ];
    
    splits.forEach(function (split) {
        var bufs = create(xs, split);
        assert.eql(new Buffer(xs), bufs.slice(),
            '[' + xs.join(',') + ']'
                + ' != ' + 
            '[' + [].join.call(bufs.slice(), ',') + ']'
        );
        
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
    });
};

exports.splice = function () {
    var xs = [0,1,2,3,4,5,6,7,8,9];
    var splits = [ [4,2,3,1], [2,2,2,2,2], [1,6,3,1], [9,2], [10], [5,5] ];
    
    splits.forEach(function (split) {
        for (var i = 0; i < xs.length; i++) {
            for (var j = i; j < xs.length; j++) {
                var bufs = create(xs, split);
                var xs_ = xs.slice();
                
                var a = bufs.splice(i,j);
                var a_ = [].slice.call(a.slice());
                var b_ = xs_.splice(i,j);
                assert.eql(a_, b_,
                    '[' + a_.join(',') + ']'
                        + ' != ' + 
                    '[' + b_.join(',') + ']'
                );
                
                assert.eql(bufs.slice(), new Buffer(xs_),
                    '[' + [].join.call(bufs.slice(), ',') + ']'
                        + ' != ' + 
                    '[' + [].join.call(xs_, ',') + ']'
                );
            }
        }
    });
};


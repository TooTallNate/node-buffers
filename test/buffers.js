var assert = require('assert');
var Buffers = require('buffers');

exports.slice = function () {
    var bufs = Buffers();
    bufs.push(new Buffer([0,1,2,3]));
    bufs.push(new Buffer([4,5]));
    bufs.push(new Buffer([6,7,8]));
    bufs.push(new Buffer([9]));
    
    var xs = [0,1,2,3,4,5,6,7,8,9];
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
};

exports.splice = function () {
    var xs = [0,1,2,3,4,5,6,7,8,9];
    var splits = [ [4,2,3,1], [2,2,2,2,2], [1,6,3,1], [9,2], [10], [5,5] ];
    
    splits.forEach(function (split) {
        function create () {
            var bufs = Buffers();
            var offset = 0;
            split.forEach(function (i) {
                bufs.push(new Buffer(xs.slice(offset, offset + i)));
                offset += i;
            });
            return bufs;
        }
        
        for (var i = 0; i < xs.length; i++) {
            for (var j = i; j < xs.length; j++) {
                var bufs = create();
                var xs_ = xs.slice();
console.dir([bufs.slice(), xs_]);
                
                var a = bufs.splice(i,j);
                var b = new Buffers(new Buffer(xs_.splice(i,j)));
console.dir([i,j]);
                
                assert.eql(a.slice(), b.slice(),
                    '[' + [].join.call(a, ',') + ']'
                        + ' != ' + 
                    '[' + [].join.call(b, ',') + ']'
                );
console.dir([bufs.slice(), xs_]);
                
                assert.eql(
                    '[' + [].join.call(bufs.slice(), ',') + ']'
                        + ' != ' + 
                    '[' + [].join.call(xs_, ',') + ']'
                );
            }
        }
    });
};


module.exports = function () {
    var offset = 0;
    var buffers = [];
    
    var self = { ready : 0 };
    
    self.seek = function (n) {
        offset += n;
        while (buffers.length > 0 && offset > buffers[0].length) {
            offset -= buffers[0].length;
            self.ready -= buffers[0].length;
            buffers.shift();
        }
    };
    
    self.push = function (buf) {
        buffers.push(buf);
        self.ready += buf.length;
    };
    
    self.slice = function (i, j) {
        if (j === undefined) j = self.ready - offset;
        if (i === undefined) i = 0;
        i += offset; j += offset;
        
        if (j > self.ready) {
            throw new Error('Index ' + j + ' out of bounds');
        }
        
        var bytes = { start : 0, end : 0 };
        
        for (var si = 0; si < buffers.length && bytes.start < i; si++) {
            bytes.start += buffers[si].length;
        }
        bytes.start -= buffers[si].length;
        
        bytes.end = bytes.start;
        for (var ei = 0; ei < buffers.length && bytes.end < j; ei++) {
            bytes.end += buffers[ei].length;
        }
        bytes.end -= buffers[ei].length;
        
        var target;
        if (si === ei) {
            target = buffers[si].slice(bytes.start - i, bytes.end - j);
        }
        else {
            target = new Buffer(j - i);
            var ti = 0;
            
            buffers[si].copy(
                target, 0,
                buffers[si].length - (bytes.start - i),
                bytes.start - i
            );
            
            for (var ii = si; ii < ei; ii++) {
                
                console.dir([ ei, si ]);
            }
        }
        
        return target;
    };
    
    return self;
};

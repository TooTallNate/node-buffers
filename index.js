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
        
        var startBytes = 0;
        for (
            var si = 0;
            si < buffers.length && startBytes + buffers[si].length <= i;
            si++
        ) { startBytes += buffers[si].length }
        
        var target = new Buffer(j - i);
        
        var ti = 0;
        for (var ii = si; ti < j - i && ii < buffers[ii].length; ii++) {
            var len = buffers[ii].length;
            
            var start = ti === 0 ? i - startBytes : 0;
            var end = ti + len >= j - i
                ? Math.min(start + (j - i) - ti, len)
                : len
            ;
            
            buffers[ii].copy(target, ti, start, end);
            ti += end - start;
        }
        
        return target;
    };
    
    return self;
};

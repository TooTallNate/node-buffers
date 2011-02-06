module.exports = function Buffers (bufs) {
    var buffers = bufs || [];
    
    var self = { length : 0 };
    
    self.push = function (buf) {
        buffers.push(buf);
        self.length += buf.length;
    };
    
    self.splice = function (i, howMany) {
        var index = i >= 0 ? i : self.length - i;
        var xs = [].slice.call(arguments, 2);
        
        if (howMany === undefined) {
            howMany = self.length - index;
        }
        
        var removed = new Buffers();
        
        var startBytes = 0;
        for (
            var si = 0;
            si < buffers.length && startBytes + buffers[ei].length <= index;
            si ++
        ) { startBytes += buffers[si].length }
        
        var rmBytes = 0;
        for (
            var ei = 0;
            ei < buffers.length && rmBytes + buffers[ei].length <= howMany;
            ei ++
        ) {
console.log(ei);
            if (rmBytes === 0) {
                removed.push(buffers[ei].slice(index - startBytes));
            }
            else {
                removed.push(buffers[ei]);
            }
            rmBytes += buffers[ei].length;
        }
        
        if (rmBytes < howMany) {
            removed.push(
                buffers[ei].slice(0, howMany - rmBytes)
            );
        }
        
        buffers.splice(si, ei, xs);
        self.length -= rmBytes - xs.reduce(function (x) { return x.length }, 0);
        
        return removed;
    };
    
    self.slice = function (i, j) {
        if (j === undefined) j = self.length;
        if (i === undefined) i = 0;
        
        if (j > self.length) {
            throw new Error('Index ' + j + ' out of bounds');
        }
        
        var startBytes = 0;
        for (
            var si = 0;
            si < buffers.length && startBytes + buffers[si].length <= i;
            si ++
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

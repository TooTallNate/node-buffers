module.exports = function Buffers (bufs) {
    var buffers = bufs || [];
    
    var self = {
        length : buffers.reduce(function (size, buf) {
            return size + buf.length
        }, 0)
    };
    
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
        else if (howMany > self.length - index) {
            howMany = self.length - index;
        }
        
        var removed = new Buffers();
        var bytes = 0;
        
        var startBytes = 0;
        for (
            var ii = 0;
            ii < buffers.length && startBytes + buffers[ii].length < index;
            ii ++
        ) { startBytes += buffers[ii].length }
        
        if (index - startBytes > 0) {
            var start = index - startBytes;
            
            if (start + howMany < buffers[ii].length) {
                removed.push(buffers[ii].slice(start, start + howMany));
                
                var orig = buffers[ii];
                var buf = new Buffer(orig.length - howMany);
                for (var i = 0; i < start; i++) {
                    buf[i] = orig[i];
                }
                for (var i = start + howMany; i < orig.length; i++) {
                    buf[ i - howMany ] = orig[i]
                }
                buffers[ii] = buf;
                ii++;
            }
            else {
                removed.push(buffers[ii].slice(start));
                buffers[ii] = buffers[ii].slice(0, start);
                ii ++;
            }
        }
        
        while (removed.length < howMany) {
            var buf = buffers[ii];
            var len = buf.length;
            var take = Math.min(len, howMany - removed.length);
            
            if (take === len) {
                removed.push(buf);
                buffers.splice(ii,1);
            }
            else {
                removed.push(buf.slice(0, take));
                buffers[ii] = buffers[ii].slice(take);
            }
        }
        
        buffers.unshift.apply(buffers, xs);
        self.length -= removed.length + xs.reduce(
            function (size, x) { return x.length }, 0
        );
        
        return removed;
    };
    
    self.slice = function (i, j) {
        if (j === undefined) j = self.length;
        if (i === undefined) i = 0;
        
        if (j > self.length) j = self.length;
        
        var startBytes = 0;
        for (
            var si = 0;
            si < buffers.length && startBytes + buffers[si].length <= i;
            si ++
        ) { startBytes += buffers[si].length }
        
        var target = new Buffer(j - i);
        
        var ti = 0;
        for (var ii = si; ti < j - i && ii < buffers.length; ii++) {
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

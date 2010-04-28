/*
---
description: String UTF8 encoding.

license: MIT-style

authors:
- Christopher Pitt

requires:
- core/1.2.4: String

provides: [String.toUTF8]

...
*/

(function() {
    
    function from(c)
    {
        return String.fromCharCode(c);
    }

    String.implement({
        'toUTF8': function()
        {
            var a, b, c = '';
            
            for (a = 0; b = this.charCodeAt(a); a++)
            {
                if (b < 128)
                {
                    c += from(b);
                }
                else if ((b > 127) && (b < 2048))
                {
                    c += from((b >> 6) | 192);
                    c += from((b & 63) | 128);
                }
                else
                {
                    c += from((b >> 12) | 224);
                    c += from(((b >> 6) & 63) | 128);
                    c += from((b & 63) | 128);
                }
            }
            
            return c;
        }
    });

})();
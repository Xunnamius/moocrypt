/*
---
description: String UTF8 encoding.

license: MIT-style

authors:
- Christopher Pitt

requires:
- core/1.2.4: String

provides: [String.tuUTF8]

...
*/

String.implement({
    'toUTF8': function()
    {
        var utftext = '';
        string = this.replace(/\r\n/g,"\n");
        
        for (var n = 0, l = string.length; n < l; n++)
        {
            var c = string.charCodeAt(n);
            
            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        
        return utftext;
    }
});
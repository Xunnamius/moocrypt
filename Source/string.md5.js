/*
---
description: String MD5 hashing.

license: MIT-style

authors:
- Christopher Pitt

requires:
- core/1.2.4: String
- string_toutf8/0.1: String.toUTF8

provides: [String.toMD5]

...
*/

(function() {
    
    var transforms = {
        'f': function(a, b, c)
        {
            return (a & b) | ((~a) & c);
        },
        'g': function(a, b, c)
        {
            return (a & c) | (b & (~c));
        },
        'h': function(a, b, c)
        {
            return (a ^ b ^ c);
        },
        'i': function(a, b, c)
        {
            return (b ^ (a | (~c)));
        },
        'rotateLeft': function(a, b)
        {
            return (a << b) | (a >>> (32 - b));
        },
        'addUnsigned': function(a, b)
        {
            var a8 = (a & 0x80000000),
                b8 = (b & 0x80000000),
                a4 = (a & 0x40000000),
                b4 = (b & 0x40000000),
                c = (a & 0x3FFFFFFF) + (b & 0x3FFFFFFF);
            
            if (a4 & b4)
            {
                return (c ^ 0x80000000 ^ a8 ^ b8);
            }
            
            if (a4 | b4)
            {
                if (c & 0x40000000)
                {
                    return (c ^ 0xC0000000 ^ a8 ^ b8);
                }
                else
                {
                    return (c ^ 0x40000000 ^ a8 ^ b8);
                }
            }
            else
            {
                return (c ^ a8 ^ b8);
            }
        },
        'transform': function(a, b, c, d, e, f, g, h)
        {
            var t = transforms,
                i =  t.addUnsigned(a, t.addUnsigned(t.addUnsigned(t[h](b, c, d), e), g));
            
                return t.addUnsigned(t.rotateLeft(i, f), b);
        }
    };
 
	function convertToArray(string)
    {
		var b = string.length,
            c = b + 8,
            d = (c - (c % 64)) / 64,
            e = (d + 1) * 16,
            f = new Array(e - 1),
            a = g = h = 0;
        
		while (h < b)
        {
			a = (h - (h % 4)) / 4;
			g = (h % 4) * 8;
			f[a] = (f[a] | (string.charCodeAt(h) << g));
			h++;
		}
        
		a = (h - (h % 4)) / 4;
		g = (h % 4) * 8;
		f[a] = f[a] | (0x80<<g);
		f[e - 2] = b << 3;
		f[e - 1] = b >>> 29;
        
		return f;
	}
 
	function convertToHex(a)
    {
		var b, c, d, e = '';
            
		for (d = 0; d <= 3; d++)
        {
			c = (a >>> (d * 8)) & 255;
			b = "0" + c.toString(16);
			e = e + b.substr(b.length - 2, 2);
		}
        
		return e;
	}
     
    function md5(string)
    {
    	var AA, BB, CC, DD,
            t = transforms, tt = t.transform,
            x = convertToArray(string.toUTF8()),
            a = 0x67452301, b = 0xEFCDAB89,
            c = 0x98BADCFE, d = 0x10325476,
        	S11 = 7, S12 = 12, S13 = 17, S14 = 22,
        	S21 = 5, S22 = 9, S23 = 14, S24 = 20,
        	S31 = 4, S32 = 11, S33 = 16, S34 = 23,
        	S41 = 6, S42 = 10, S43 = 15, S44 = 21;
     
    	for (var k = 0; k < x.length; k += 16)
        {
            AA = a; BB = b; CC = c; DD = d;
                
    		a = tt(a, b, c, d, x[k + 0], S11, 0xD76AA478, 'f');
    		d = tt(d, a, b, c, x[k + 1], S12, 0xE8C7B756, 'f');
    		c = tt(c, d, a, b, x[k + 2], S13, 0x242070DB, 'f');
    		b = tt(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE, 'f');
    		a = tt(a, b, c, d, x[k + 4], S11, 0xF57C0FAF, 'f');
    		d = tt(d, a, b, c, x[k + 5], S12, 0x4787C62A, 'f');
    		c = tt(c, d, a, b, x[k + 6], S13, 0xA8304613, 'f');
    		b = tt(b, c, d, a, x[k + 7], S14, 0xFD469501, 'f');
    		a = tt(a, b, c, d, x[k + 8], S11, 0x698098D8, 'f');
    		d = tt(d, a, b, c, x[k + 9], S12, 0x8B44F7AF, 'f');
    		c = tt(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1, 'f');
            b = tt(b, c, d, a, x[k + 11], S14, 0x895CD7BE, 'f');
    		a = tt(a, b, c, d, x[k + 12], S11, 0x6B901122, 'f');
    		d = tt(d, a, b, c, x[k + 13], S12, 0xFD987193, 'f');
    		c = tt(c, d, a, b, x[k + 14], S13, 0xA679438E, 'f');
    		b = tt(b, c, d, a, x[k + 15], S14, 0x49B40821, 'f');
    		a = tt(a, b, c, d, x[k + 1], S21, 0xF61E2562, 'g');
    		d = tt(d, a, b, c, x[k + 6], S22, 0xC040B340, 'g');
    		c = tt(c, d, a, b, x[k + 11], S23, 0x265E5A51, 'g');
    		b = tt(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA, 'g');
    		a = tt(a, b, c, d, x[k + 5], S21, 0xD62F105D, 'g');
    		d = tt(d, a, b, c, x[k + 10], S22, 0x2441453, 'g');
    		c = tt(c, d, a, b, x[k + 15], S23, 0xD8A1E681, 'g');
    		b = tt(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8, 'g');
    		a = tt(a, b, c, d, x[k + 9], S21, 0x21E1CDE6, 'g');
    		d = tt(d, a, b, c, x[k + 14], S22, 0xC33707D6, 'g');
    		c = tt(c, d, a, b, x[k + 3], S23, 0xF4D50D87, 'g');
    		b = tt(b, c, d, a, x[k + 8], S24, 0x455A14ED, 'g');
    		a = tt(a, b, c, d, x[k + 13], S21, 0xA9E3E905, 'g');
    		d = tt(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8, 'g');
    		c = tt(c, d, a, b, x[k + 7], S23, 0x676F02D9, 'g');
    		b = tt(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A, 'g');
    		a = tt(a, b, c, d, x[k + 5], S31, 0xFFFA3942, 'h');
    		d = tt(d, a, b, c, x[k + 8], S32, 0x8771F681, 'h');
    		c = tt(c, d, a, b, x[k + 11], S33, 0x6D9D6122, 'h');
    		b = tt(b, c, d, a, x[k + 14], S34, 0xFDE5380C, 'h');
    		a = tt(a, b, c, d, x[k + 1], S31, 0xA4BEEA44, 'h');
    		d = tt(d, a, b, c, x[k + 4], S32, 0x4BDECFA9, 'h');
    		c = tt(c, d, a, b, x[k + 7], S33, 0xF6BB4B60, 'h');
    		b = tt(b, c, d, a, x[k + 10], S34, 0xBEBFBC70, 'h');
    		a = tt(a, b, c, d, x[k + 13], S31, 0x289B7EC6, 'h');
    		d = tt(d, a, b, c, x[k + 0], S32, 0xEAA127FA, 'h');
    		c = tt(c, d, a, b, x[k + 3], S33, 0xD4EF3085, 'h');
    		b = tt(b, c, d, a, x[k + 6], S34, 0x4881D05, 'h');
    		a = tt(a, b, c, d, x[k + 9], S31, 0xD9D4D039, 'h');
    		d = tt(d, a, b, c, x[k + 12], S32, 0xE6DB99E5, 'h');
    		c = tt(c, d, a, b, x[k + 15], S33, 0x1FA27CF8, 'h');
    		b = tt(b, c, d, a, x[k + 2], S34, 0xC4AC5665, 'h');
    		a = tt(a, b, c, d, x[k + 0], S41, 0xF4292244, 'i');
    		d = tt(d, a, b, c, x[k + 7], S42, 0x432AFF97, 'i');
    		c = tt(c, d, a, b, x[k + 14], S43, 0xAB9423A7, 'i');
    		b = tt(b, c, d, a, x[k + 5], S44, 0xFC93A039, 'i');
    		a = tt(a, b, c, d, x[k + 12], S41, 0x655B59C3, 'i');
    		d = tt(d, a, b, c, x[k + 3], S42, 0x8F0CCC92, 'i');
    		c = tt(c, d, a, b, x[k + 10], S43, 0xFFEFF47D, 'i');
    		b = tt(b, c, d, a, x[k + 1], S44, 0x85845DD1, 'i');
    		a = tt(a, b, c, d, x[k + 8], S41, 0x6FA87E4F, 'i');
    		d = tt(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0, 'i');
    		c = tt(c, d, a, b, x[k + 6], S43, 0xA3014314, 'i');
    		b = tt(b, c, d, a, x[k + 13], S44, 0x4E0811A1, 'i');
    		a = tt(a, b, c, d, x[k + 4], S41, 0xF7537E82, 'i');
    		d = tt(d, a, b, c, x[k + 11], S42, 0xBD3AF235, 'i');
    		c = tt(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB, 'i');
    		b = tt(b, c, d, a, x[k + 9], S44, 0xEB86D391, 'i');
               
    		a = t.addUnsigned(a, AA);
    		b = t.addUnsigned(b, BB);
    		c = t.addUnsigned(c, CC);
    		d = t.addUnsigned(d, DD);
    	}

    	return (convertToHex(a) + convertToHex(b) + convertToHex(c) + convertToHex(d)).toLowerCase();
    }
    
    String.implement({
        'toMD5': function()
        {
            return md5(this);
        }
    });
})();
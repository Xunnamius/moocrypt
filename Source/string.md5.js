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
                result = (a & 0x3FFFFFFF) + (b & 0x3FFFFFFF);
            
            if (a4 & b4)
            {
                return (result ^ 0x80000000 ^ a8 ^ b8);
            }
            
            if (a4 | b4)
            {
                if (result & 0x40000000)
                {
                    return (result ^ 0xC0000000 ^ a8 ^ b8);
                }
                else
                {
                    return (result ^ 0x40000000 ^ a8 ^ b8);
                }
            }
            else
            {
                return (result ^ a8 ^ b8);
            }
        },
        'compound': function(a, b, c, d, e, f, g, h)
        {
            var trans = transforms,
                add = trans.addUnsigned,
                temp = add(a, add(add(trans[h](b, c, d), e), g));
                
            return add(trans.rotateLeft(temp, f), b);
        }
    };
 
	function convertToArray(string)
    {
		var messageLength = string.length,
            numberOfWords = (((messageLength + 8) - ((messageLength + 8) % 64)) / 64 + 1) * 16,
            wordArray = new Array(),
            wordCount = bytePosition = byteCount = 0;
        
		while (byteCount < messageLength)
        {
			wordCount = (byteCount - (byteCount % 4)) / 4;
			bytePosition = (byteCount % 4) * 8;
			wordArray[wordCount] = (wordArray[wordCount] | (string.charCodeAt(byteCount) << bytePosition));
			byteCount++;
		}
        
		wordCount = (byteCount - (byteCount % 4)) / 4;
		bytePosition = (byteCount % 4) * 8;
		wordArray[wordCount] = wordArray[wordCount] | (0x80 << bytePosition);
		wordArray[numberOfWords - 2] = messageLength << 3;
		wordArray[numberOfWords - 1] = messageLength >>> 29;
        
		return wordArray;
	}
 
	function convertToHex(string)
    {
		var result = temp = nibble = i = '';
        
		for (i = 0; i <= 3; i++)
        {
			nibble = (string >>> (i * 8)) & 255;
			temp = "0" + nibble.toString(16);
			result = result + temp.substr(temp.length-2,2);
		}
        
		return result;
	}
     
    function md5(string)
    {
    	var AA, BB, CC, DD,
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
                
            a = transforms.compound(a, b, c, d, x[k + 0], S11, 0xD76AA478, 'f');
            d = transforms.compound(d, a, b, c, x[k + 1], S12, 0xE8C7B756, 'f');
            c = transforms.compound(c, d, a, b, x[k + 2], S13, 0x242070DB, 'f');
            b = transforms.compound(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE, 'f');
            a = transforms.compound(a, b, c, d, x[k + 4], S11, 0xF57C0FAF, 'f');
            d = transforms.compound(d, a, b, c, x[k + 5], S12, 0x4787C62A, 'f');
            c = transforms.compound(c, d, a, b, x[k + 6], S13, 0xA8304613, 'f');
            b = transforms.compound(b, c, d, a, x[k + 7], S14, 0xFD469501, 'f');
            a = transforms.compound(a, b, c, d, x[k + 8], S11, 0x698098D8, 'f');
            d = transforms.compound(d, a, b, c, x[k + 9], S12, 0x8B44F7AF, 'f');
            c = transforms.compound(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1, 'f');
            b = transforms.compound(b, c, d, a, x[k + 11], S14, 0x895CD7BE, 'f');
            a = transforms.compound(a, b, c, d, x[k + 12], S11, 0x6B901122, 'f');
            d = transforms.compound(d, a, b, c, x[k + 13], S12, 0xFD987193, 'f');
            c = transforms.compound(c, d, a, b, x[k + 14], S13, 0xA679438E, 'f');
            b = transforms.compound(b, c, d, a, x[k + 15], S14, 0x49B40821, 'f');
            a = transforms.compound(a, b, c, d, x[k + 1], S21, 0xF61E2562, 'g');
            d = transforms.compound(d, a, b, c, x[k + 6], S22, 0xC040B340, 'g');
            c = transforms.compound(c, d, a, b, x[k + 11], S23, 0x265E5A51, 'g');
            b = transforms.compound(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA, 'g');
            a = transforms.compound(a, b, c, d, x[k + 5], S21, 0xD62F105D, 'g');
            d = transforms.compound(d, a, b, c, x[k + 10], S22, 0x2441453, 'g');
            c = transforms.compound(c, d, a, b, x[k + 15], S23, 0xD8A1E681, 'g');
            b = transforms.compound(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8, 'g');
            a = transforms.compound(a, b, c, d, x[k + 9], S21, 0x21E1CDE6, 'g');
            d = transforms.compound(d, a, b, c, x[k + 14], S22, 0xC33707D6, 'g');
            c = transforms.compound(c, d, a, b, x[k + 3], S23, 0xF4D50D87, 'g');
            b = transforms.compound(b, c, d, a, x[k + 8], S24, 0x455A14ED, 'g');
            a = transforms.compound(a, b, c, d, x[k + 13], S21, 0xA9E3E905, 'g');
            d = transforms.compound(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8, 'g');
            c = transforms.compound(c, d, a, b, x[k + 7], S23, 0x676F02D9, 'g');
            b = transforms.compound(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A, 'g');
            a = transforms.compound(a, b, c, d, x[k + 5], S31, 0xFFFA3942, 'h');
            d = transforms.compound(d, a, b, c, x[k + 8], S32, 0x8771F681, 'h');
            c = transforms.compound(c, d, a, b, x[k + 11], S33, 0x6D9D6122, 'h');
            b = transforms.compound(b, c, d, a, x[k + 14], S34, 0xFDE5380C, 'h');
            a = transforms.compound(a, b, c, d, x[k + 1], S31, 0xA4BEEA44, 'h');
            d = transforms.compound(d, a, b, c, x[k + 4], S32, 0x4BDECFA9, 'h');
            c = transforms.compound(c, d, a, b, x[k + 7], S33, 0xF6BB4B60, 'h');
            b = transforms.compound(b, c, d, a, x[k + 10], S34, 0xBEBFBC70, 'h');
            a = transforms.compound(a, b, c, d, x[k + 13], S31, 0x289B7EC6, 'h');
            d = transforms.compound(d, a, b, c, x[k + 0], S32, 0xEAA127FA, 'h');
            c = transforms.compound(c, d, a, b, x[k + 3], S33, 0xD4EF3085, 'h');
            b = transforms.compound(b, c, d, a, x[k + 6], S34, 0x4881D05, 'h');
            a = transforms.compound(a, b, c, d, x[k + 9], S31, 0xD9D4D039, 'h');
            d = transforms.compound(d, a, b, c, x[k + 12], S32, 0xE6DB99E5, 'h');
            c = transforms.compound(c, d, a, b, x[k + 15], S33, 0x1FA27CF8, 'h');
            b = transforms.compound(b, c, d, a, x[k + 2], S34, 0xC4AC5665, 'h');
            a = transforms.compound(a, b, c, d, x[k + 0], S41, 0xF4292244, 'i');
            d = transforms.compound(d, a, b, c, x[k + 7], S42, 0x432AFF97, 'i');
            c = transforms.compound(c, d, a, b, x[k + 14], S43, 0xAB9423A7, 'i');
            b = transforms.compound(b, c, d, a, x[k + 5], S44, 0xFC93A039, 'i');
            a = transforms.compound(a, b, c, d, x[k + 12], S41, 0x655B59C3, 'i');
            d = transforms.compound(d, a, b, c, x[k + 3], S42, 0x8F0CCC92, 'i');
            c = transforms.compound(c, d, a, b, x[k + 10], S43, 0xFFEFF47D, 'i');
            b = transforms.compound(b, c, d, a, x[k + 1], S44, 0x85845DD1, 'i');
            a = transforms.compound(a, b, c, d, x[k + 8], S41, 0x6FA87E4F, 'i');
            d = transforms.compound(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0, 'i');
            c = transforms.compound(c, d, a, b, x[k + 6], S43, 0xA3014314, 'i');
            b = transforms.compound(b, c, d, a, x[k + 13], S44, 0x4E0811A1, 'i');
            a = transforms.compound(a, b, c, d, x[k + 4], S41, 0xF7537E82, 'i');
            d = transforms.compound(d, a, b, c, x[k + 11], S42, 0xBD3AF235, 'i');
            c = transforms.compound(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB, 'i');
            b = transforms.compound(b, c, d, a, x[k + 9], S44, 0xEB86D391, 'i');
               
    		a = transforms.addUnsigned(a, AA);
    		b = transforms.addUnsigned(b, BB);
    		c = transforms.addUnsigned(c, CC);
    		d = transforms.addUnsigned(d, DD);
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
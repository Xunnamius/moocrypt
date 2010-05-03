/*
---
description: String SHA512 hashing.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSHA512]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8, Array.toSHA512]
...
*/

(function() {

	var transforms = {
		'normal':
		{
			'hex': function(string, hexUpperCase)
			{
				return stringToHex(transforms.normal.raw(string.toUTF8()), hexUpperCase);
			},
			'base64': function(string, base64Pad)
			{
				return stringToBase64(transforms.normal.raw(string.toUTF8()), base64Pad);
			},
			'any': function(string, length)
			{
				return stringToAny(transforms.normal.raw(s.toUTF8()), length);
			},
			'raw': function(string)
			{
				return binToString(stringToBin(string).toSHA512(string.length * 8));
			}
		},
		'hmac':
		{
			'hex': function(key, string, hexUpperCase)
			{
				return stringToHex(transforms.hmac.raw(key.toUTF8(), string.toUTF8()), hexUpperCase);
			},
			'base64': function(key, string, base64Pad)
			{
				return stringToBase64(transforms.hmac.raw(key.toUTF8(), string.toUTF8()), base64Pad);
			},
			'any': function(key, string, length)
			{
				return stringToAny(transforms.hmac.raw(key.toUTF8(), string.toUTF8()), length);
			},
			'raw': function(key, data)
			{
				var ipad = Array(32),
					opad = Array(32),
					bkey = stringToBin(key);

				if(bkey.length > 32)
				{
					bkey = bkey.toSHA512(key.length * 8);
				}

				for(var i = 0; i < 32; i++)
				{
					ipad[i] = bkey[i] ^ 0x36363636;
					opad[i] = bkey[i] ^ 0x5C5C5C5C;
				}

				var hash = ipad.concat(stringToBin(data)).toSHA512(1024 + data.length * 8);
				return binToString(opad.concat(hash).toSHA512(1024 + 512));
			}
		}
	};

	function stringToHex(string, hexUpperCase)
	{
		var a, b, result = '',
			characters = hexUpperCase ? "0123456789ABCDEF" : "0123456789abcdef";

		for (a = 0; b = string.charCodeAt(a); a++)
		{
			result += characters.charAt((b >>> 4) & 0x0F) + characters.charAt(b & 0x0F);
		}

		return result;
	}

	function stringToBase64(string, base64Pad)
	{
		var a, b, c, d, result = '', length = string.length,
			characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

		for (a = 0; b = string.charCodeAt(a); a += 3)
		{
			c = (b << 16) | (a + 1 < length ? string.charCodeAt(a + 1) << 8 : 0) | (a + 2 < length ? string.charCodeAt(a + 2) : 0);
			
			for (d = 0; d < 4; d++)
			{
				if (a * 8 + d * 6 > string.length * 8)
				{
					result += (base64Pad || '');
					continue;
				}
				
				result += characters.charAt((c >>> 6 * (3 - d)) & 0x3F);
			}
		}

		return result;
	}

	function stringToAny(string, encoding)
	{
		var a, b, c, d, quotient, result = '',
		
			dividend = Array(Math.ceil(string.length / 2)),
			divisor = encoding.length,
			
			length = Math.ceil(string.length * 8 / (Math.log(encoding.length) / Math.log(2))),
			remainders = Array(length);

		for (a = 0; a < dividend.length; a++)
		{
			dividend[a] = (string.charCodeAt(a * 2) << 8) | string.charCodeAt(a * 2 + 1);
		}

		for (a = 0; a < length; a++)
		{
			quotient = Array();
			c = 0;

			for(b = 0; b < dividend.length; b++)
			{
				c = (c << 16) + dividend[b];
				d = Math.floor(c / divisor);
				c -= d * divisor;

				if (quotient.length > 0 || d > 0)
				{
					quotient[quotient.length] = d;
				}
			}

			remainders[a] = x;
			dividend = quotient;
		}

		var output = "";
		for(i = remainders.length - 1; i >= 0; i--)
		{
			output += encoding.charAt(remainders[i]);
		}

		return output;
	}

	function stringToBin(string)
	{
		var a, b = string.length,
			result = Array(b >> 2);

		for(a = 0; a < b; a++)
		{
			result[a] = 0;
		}

		for(a = 0; a < b * 8; a += 8)
		{
			result[a >> 5] |= (string.charCodeAt(a / 8) & 0xFF) << (24 - a % 32);
		}

		return result;
	}

	function binToString(bin)
	{
		var a, result = '';

		for(a = 0; a < bin.length * 32; a += 8)
		{
			result += String.fromCharCode((bin[a >> 5] >>> (24 - a % 32)) & 0xFF);
		}

		return result;
	}

	String.implement({
		'toSHA512': function(type, param)
		{
			var type = (type && type.toLowerCase()) || 'hex';

			switch (type.toLowerCase())
			{
				case 'base64':
					return transforms.normal.base64(this, param /* base64Pad */);
					break;

				case 'base64hmac':
					return transforms.hmac.base64(this, param /* base64Pad */);
					break;

				case 'any':
					return transforms.normal.any(this, param /* length */);
					break;

				case 'anyhmac':
					return transforms.hmac.any(this, param /* length */);
					break;

				case 'hex':
					return transforms.normal.hex(this, param /* hexUpperCase */);
					break;

				case 'hexhmac':
					return transforms.hmac.hex(this, param /* hexUpperCase */);
					break;
			}
		}
	});

})();
/*
---
name: String.UTF-8
description: String UTF8 encoding.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne]
requires: 
  - Core/String
provides: [String.toUTF8, String.fromUTF8]
...
*/

(function(){

	function toUTF8(string){
		var a = 0,
			result = '',
			code = String.fromCharCode,
			string = string.replace(/\r\n/g,"\n");

		for (a = 0; b = string.charCodeAt(a); a++){
			if (b < 128){
				result += code(b);
			} else if ((b > 127) && (b < 2048)){
				result += code((b >> 6) | 192);
				result += code((b & 63) | 128);
			} else {
				result += code((b >> 12) | 224);
				result += code(((b >> 6) & 63) | 128);
				result += code((b & 63) | 128);
			}
		}

		return result;
	}

	function fromUTF8(string){
		var a = 0,
			result = '',
			c1 = c2 = c3 = 0;

		while (a < string.length){
			c1 = string.charCodeAt(a);

			if (c1 < 128){
				result += String.fromCharCode(c1);
				a++;
			} else if ((c1 > 191) && (c1 < 224)){
				c2 = string.charCodeAt(a+1);
				result += String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
				a += 2;
			} else {
				c2 = string.charCodeAt(a + 1);
				c3 = string.charCodeAt(a + 2);
				result += String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				a += 3;
			}
		}

		return result;
	}

	String.implement({
		'toUTF8': function(){
			return toUTF8(this);
		},
		'fromUTF8': function(){
			return fromUTF8(this);
		}
	});

})();

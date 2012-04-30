/*
---
name: String.Base64
description: String Hex encode/decode.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
  - String.toUTF8
  - String.fromUTF8
provides: [String.toBase64, String.fromBase64]
...
*/

(function() {

	var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	function encode(string){
		var a = 0,
			result = '',
			string = string.toUTF8(),
			c1, c2, c3, e1, e2, e3, e4;

		while (a < string.length){

			c1 = string.charCodeAt(a++);
			c2 = string.charCodeAt(a++);
			c3 = string.charCodeAt(a++);

			e1 = c1 >> 2;
			e2 = ((c1 & 3) << 4) | (c2 >> 4);
			e3 = ((c2 & 15) << 2) | (c3 >> 6);
			e4 = c3 & 63;

			if (isNaN(c2)){
				e3 = e4 = 64;
			} else if (isNaN(c3)){
				e4 = 64;
			}

			result += characters.charAt(e1) + characters.charAt(e2) + characters.charAt(e3) + characters.charAt(e4);

		}

		return result;
	}

	function decode(string){
		var a = 0,
			result = '',
			string = string.replace(/[^A-Za-z0-9\+\/\=]/g, ''),
			c1, c2, c3, e1, e2, e3, e4;

		while (a < string.length){
			e1 = characters.indexOf(string.charAt(a++));
			e2 = characters.indexOf(string.charAt(a++));
			e3 = characters.indexOf(string.charAt(a++));
			e4 = characters.indexOf(string.charAt(a++));

			c1 = (e1 << 2) | (e2 >> 4);
			c2 = ((e2 & 15) << 4) | (e3 >> 2);
			c3 = ((e3 & 3) << 6) | e4;

			result += String.fromCharCode(c1);

			if (e3 != 64){
				result += String.fromCharCode(c2);
			}

			if (e4 != 64){
				result += String.fromCharCode(c3);
			}
		}

		return result.fromUTF8();
	}

	String.implement({
		'toBase64': function(){
			return encode(this);
		},
		'fromBase64': function(){
			return decode(this);
		}
	});

})();

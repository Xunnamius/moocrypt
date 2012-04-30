/*
---
name: String.SHA-1
description: String SHA1 hashing.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
  - String.toUTF8
provides: [String.toSHA1]
...
*/

(function(){

	var transforms = {
		'rotateLeft': function(a, b){
			return (a << b) | (a >>> (32 - b));
		},
		'hex': function(a){
			var b, c, result = '';

			for (b = 7; b >= 0; b--){
				c = (a >>> (b * 4)) & 0x0f;
				result += c.toString(16);
			}

			return result;
		}
	};

	function sha1(string){
		var a, b, c,
			h1 = 0x67452301,
			h2 = 0xEFCDAB89,
			h3 = 0x98BADCFE,
			h4 = 0x10325476,
			h5 = 0xC3D2E1F0,
			t1, t2, t3, t4, t5,

			string = string.toUTF8(),
			length = string.length,
			words = new Array(),
			buffer = new Array(80),

			code = function(a){
				return string.charCodeAt(a);
			},

			assign = function(c){
				t5 = t4;
				t4 = t3;
				t3 = transforms.rotateLeft(t2, 30);
				t2 = t1;
				t1 = c;
			};

		for (a = 0; a < length - 3; a += 4){
			b = code(a) << 24 | code(a + 1) << 16 | code(a + 2) << 8 | code(a + 3);
			words.push(b);
		}

		switch (length % 4){
			case 0:
				a = 0x080000000;
				break;
			case 1:
				a = code(length - 1) << 24 | 0x0800000;
				break;
			case 2:
				a = code(length - 2) << 24 | code(length - 1) << 16 | 0x08000;
				break;
			case 3:
				a = code(length - 3) << 24 | code(length - 2) << 16 | code(length - 1) << 8 | 0x80;
				break;
		}

		words.push(a);

		while ((words.length % 16) != 14){
			words.push(0);
		}

		words.push(length >>> 29);
		words.push((length << 3) & 0x0ffffffff);

		for (c = 0; c < words.length; c += 16){
			for (a = 0; a < 16; a++){
				buffer[a] = words[c + a];
			}

			for (a = 16; a <= 79; a++){
				buffer[a] = transforms.rotateLeft(buffer[a - 3] ^ buffer[a - 8] ^ buffer[a - 14] ^ buffer[a - 16], 1);
			}

			t1 = h1;
			t2 = h2;
			t3 = h3;
			t4 = h4;
			t5 = h5;

			for (a = 0; a <= 19; a++){
				assign((transforms.rotateLeft(t1, 5) + ((t2 & t3) | (~t2 & t4)) + t5 + buffer[a] + 0x5A827999) & 0x0ffffffff);
			}

			for (a = 20; a <= 39; a++){
				assign((transforms.rotateLeft(t1, 5) + (t2 ^ t3 ^ t4) + t5 + buffer[a] + 0x6ED9EBA1) & 0x0ffffffff);
			}

			for (a = 40; a <= 59; a++){
				assign((transforms.rotateLeft(t1, 5) + ((t2 & t3) | (t2 & t4) | (t3 & t4)) + t5 + buffer[a] + 0x8F1BBCDC) & 0x0ffffffff);
			}

			for (a = 60; a <= 79; a++){
				assign((transforms.rotateLeft(t1, 5) + (t2 ^ t3 ^ t4) + t5 + buffer[a] + 0xCA62C1D6) & 0x0ffffffff);
			}

			h1 = (h1 + t1) & 0x0ffffffff;
			h2 = (h2 + t2) & 0x0ffffffff;
			h3 = (h3 + t3) & 0x0ffffffff;
			h4 = (h4 + t4) & 0x0ffffffff;
			h5 = (h5 + t5) & 0x0ffffffff;
		}

		return (transforms.hex(h1) + transforms.hex(h2) + transforms.hex(h3) + transforms.hex(h4) + transforms.hex(h5)).toLowerCase();
	}

	String.implement({
		'toSHA1': function(){
			return sha1(this);
		}
	});

})();

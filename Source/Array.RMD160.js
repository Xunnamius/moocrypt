/*
---
name: Array.RMD160
description: Array RMD160 processing, for little-endian dword arrays.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/Array
provides: [Array.toRMD160]
...
*/

(function(){

	var tables = {
			'a': [
				0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
				7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
				3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
				1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
				4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13
			],
			'b': [
				 5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
				 6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
				15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
				 8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
				12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11
			],
			'c': [
				11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
				 7,  6,  8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
				11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
				11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
				 9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6
			],
			'd': [
				 8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
				 9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
				 9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
				15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
				 8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11
			]
		},
		
		transforms = {
			'a': function(a, b, c, d){
				if (0 <= a && a <= 15) return (b ^ c ^ d);
				else if (16 <= a && a <= 31) return (b & c) | (~b & d);
				else if (32 <= a && a <= 47) return (b | ~c) ^ d;
				else if (48 <= a && a <= 63) return (b & d) | (c & ~d);
				else if (64 <= a && a <= 79) return b ^ (c | ~d);
				
			},
			'b': function(a){
				if (0 <= a && a <= 15) return 0x00000000;
				else if (16 <= a && a <= 31) return 0x5a827999;
				else if (32 <= a && a <= 47) return 0x6ed9eba1;
				else if (48 <= a && a <= 63) return 0x8f1bbcdc;
				else if (64 <= a && a <= 79) return 0xa953fd4e;
			},
			'c': function(a){
				if (0 <= a && a <= 15) return 0x50a28be6;
				else if (16 <= a && a <= 31) return 0x5c4dd124;
				else if (32 <= a && a <= 47) return 0x6d703ef3;
				else if (48 <= a && a <= 63) return 0x7a6d76e9;
				else if (64 <= a && a <= 79) return 0x00000000;
			},
			'safeAdd': function(a, b){
				var t1 = (a & 0xFFFF) + (b & 0xFFFF),
					t2 = (a >> 16) + (b >> 16) + (t1 >> 16);

				return (t2 << 16) | (t1 & 0xFFFF);
			},
			'rotateLeft': function(a, b){
				return (a << b) | (a >>> (32 - b));
			}
		};

	function rmd160(array, length){
		array[length >> 5] |= 0x80 << (length % 32);
		array[(((length + 64) >>> 9) << 4) + 14] = length;

		var i, j, t,

			hash = [
				0x67452301,
				0xefcdab89,
				0x98badcfe,
				0x10325476,
				0xc3d2e1f0
			],

			a1, a2, b1, b2,
			c1, c2, d1, d2,
			e1, e2;

		for (i = 0; i < array.length; i += 16){
			a1 = a2 = hash[0];
			b1 = b2 = hash[1];
			c1 = c2 = hash[2];
			d1 = d2 = hash[3];
			e1 = e2 = hash[4];

			for (j = 0; j <= 79; ++j){
				t = transforms.safeAdd(a1, transforms.a(j, b1, c1, d1));
				t = transforms.safeAdd(t, array[i + tables.a[j]]);
				t = transforms.safeAdd(t, transforms.b(j));
				t = transforms.safeAdd(transforms.rotateLeft(t, tables.c[j]), e1);

				a1 = e1;
				e1 = d1;
				d1 = transforms.rotateLeft(c1, 10);
				c1 = b1;
				b1 = t;

				t = transforms.safeAdd(a2, transforms.a(79 - j, b2, c2, d2));
				t = transforms.safeAdd(t, array[i + tables.b[j]]);
				t = transforms.safeAdd(t, transforms.c(j));
				t = transforms.safeAdd(transforms.rotateLeft(t, tables.d[j]), e2);

				a2 = e2;
				e2 = d2;
				d2 = transforms.rotateLeft(c2, 10);
				c2 = b2;
				b2 = t;
			}

			t = transforms.safeAdd(hash[1], transforms.safeAdd(c1, d2));
			hash[1] = transforms.safeAdd(hash[2], transforms.safeAdd(d1, e2));
			hash[2] = transforms.safeAdd(hash[3], transforms.safeAdd(e1, a2));
			hash[3] = transforms.safeAdd(hash[4], transforms.safeAdd(a1, b2));
			hash[4] = transforms.safeAdd(hash[0], transforms.safeAdd(b1, c2));
			hash[0] = t;
		}

		return [hash[0], hash[1], hash[2], hash[3], hash[4]];
	}

	Array.implement({
		'toRMD160': function(length){
			return rmd160(this, length);
		}
	});

})();

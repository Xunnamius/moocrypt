/*
---
description: Array RMD160 processing, for little-endian dword arrays.
license: MIT-style
authors: [Christopher Pitt]
provides: [Array.toRMD160]
requires: 
  core/1.2.4: [Array]
...
*/

(function() {

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
			'a': function(a, b, c, d)
			{
				if (0 <= a && a <= 15)
				{
					return (b ^ c ^ d);
				}
				else if (16 <= a && a <= 31)
				{
					return (b & c) | (~b & d);
				}
				else if (32 <= a && a <= 47)
				{
					return (b | ~c) ^ d;
				}
				else if (48 <= a && a <= 63)
				{
					return (b & d) | (c & ~d);
				}
				else if (64 <= a && a <= 79)
				{
					return b ^ (c | ~d);
				}
			},
			'b': function(a)
			{
				if (0 <= a && a <= 15)
				{
					return 0x00000000;
				}
				else if (16 <= a && a <= 31)
				{
					return 0x5a827999;
				}
				else if (32 <= a && a <= 47)
				{
					return 0x6ed9eba1;
				}
				else if (48 <= a && a <= 63)
				{
					return 0x8f1bbcdc;
				}
				else if (64 <= a && a <= 79)
				{
					return 0xa953fd4e;
				}
			},
			'c': function(a)
			{
				if (0 <= a && a <= 15)
				{
					return 0x50a28be6;
				}
				else if (16 <= a && a <= 31)
				{
					return 0x5c4dd124;
				}
				else if (32 <= a && a <= 47)
				{
					return 0x6d703ef3;
				}
				else if (48 <= a && a <= 63)
				{
					return 0x7a6d76e9;
				}
				else if (64 <= a && a <= 79)
				{
					return 0x00000000;
				}
			},
			'safeAdd': function(a, b)
			{
				var t1 = (a & 0xFFFF) + (b & 0xFFFF),
					t2 = (a >> 16) + (b >> 16) + (t1 >> 16);

				return (t2 << 16) | (t1 & 0xFFFF);
			},
			'rotateLeft': function(a, b)
			{
				return (a << b) | (a >>> (32 - b));
			}
		};

	function rmd160(array, length)
	{
		array[length >> 5] |= 0x80 << (length % 32);
		array[(((length + 64) >>> 9) << 4) + 14] = length;

		var h0 = 0x67452301;
		var h1 = 0xefcdab89;
		var h2 = 0x98badcfe;
		var h3 = 0x10325476;
		var h4 = 0xc3d2e1f0;

		for (var i = 0; i < array.length; i += 16) {
			var T;
			var A1 = h0, B1 = h1, C1 = h2, D1 = h3, E1 = h4;
			var A2 = h0, B2 = h1, C2 = h2, D2 = h3, E2 = h4;
			for (var j = 0; j <= 79; ++j) {
				T = transforms.safeAdd(A1, transforms.a(j, B1, C1, D1));
				T = transforms.safeAdd(T, array[i + tables.a[j]]);
				T = transforms.safeAdd(T, transforms.b(j));
				T = transforms.safeAdd(transforms.rotateLeft(T, tables.c[j]), E1);
				A1 = E1; E1 = D1; D1 = transforms.rotateLeft(C1, 10); C1 = B1; B1 = T;
				T = transforms.safeAdd(A2, transforms.a(79-j, B2, C2, D2));
				T = transforms.safeAdd(T, array[i + tables.b[j]]);
				T = transforms.safeAdd(T, transforms.c(j));
				T = transforms.safeAdd(transforms.rotateLeft(T, tables.d[j]), E2);
				A2 = E2; E2 = D2; D2 = transforms.rotateLeft(C2, 10); C2 = B2; B2 = T;
			}
			T = transforms.safeAdd(h1, transforms.safeAdd(C1, D2));
			h1 = transforms.safeAdd(h2, transforms.safeAdd(D1, E2));
			h2 = transforms.safeAdd(h3, transforms.safeAdd(E1, A2));
			h3 = transforms.safeAdd(h4, transforms.safeAdd(A1, B2));
			h4 = transforms.safeAdd(h0, transforms.safeAdd(B1, C2));
			h0 = T;
		}
		return [h0, h1, h2, h3, h4];
	}

	Array.implement({
		'toRMD160': function(length)
		{
			return rmd160(this, length);
		}
	});

})();
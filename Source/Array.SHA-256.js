/*
---
name: Array.SHA-256
description: Array SHA256 processing, for big-endian dword arrays.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/Array
provides: [Array.toSHA256]
...
*/

(function() {

	var table = [
			0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
			0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
			0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
			0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
			0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC,
			0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
			0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
			0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967,
			0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
			0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
			0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
			0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
			0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
			0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
			0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
			0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
		],

		transforms = {
			'safeAdd': function(a, b){
				var t1 = (a & 0xFFFF) + (b & 0xFFFF),
					t2 = (a >> 16) + (b >> 16) + (t1 >> 16);

				return (t2 << 16) | (t1 & 0xFFFF);
			},
			'a': function(a, b){
				return (a >>> b) | (a << (32 - b));
			},
			'b': function(a, b){
				return (a >>> b);
			},
			'c': function(a, b, c){
				return ((a & b) ^ ((~a) & c));
			},
			'd': function(a, b, c){
				return ((a & b) ^ (a & c) ^ (b & c));
			},
			's0': function(a){
				return (transforms.a(a, 2) ^ transforms.a(a, 13) ^ transforms.a(a, 22));
			},
			's1': function(a){
				return (transforms.a(a, 6) ^ transforms.a(a, 11) ^ transforms.a(a, 25));
			},
			'g0': function(a){
				return (transforms.a(a, 7) ^ transforms.a(a, 18) ^ transforms.b(a, 3));
			},
			'g1': function(a){
				return (transforms.a(a, 17) ^ transforms.a(a, 19) ^ transforms.b(a, 10));
			}
		};
	
	function sha256(bin, size){
		var t1, t2, i, j,
		
			hash = [
				0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A,
				0x510E527F, 0x9B05688C,0x1F83D9AB, 0x5BE0CD19
			],
			
			w = new Array(64),
			trans = transforms,
			safe = trans.safeAdd,
			a, b, c, d, e, f, g, h, i, j;

		bin[size >> 5] |= 0x80 << (24 - size % 32);
		bin[((size + 64 >> 9) << 4) + 15] = size;

		for (i = 0; i < bin.length; i += 16){
			a = hash[0];
			b = hash[1];
			c = hash[2];
			d = hash[3];
			e = hash[4];
			f = hash[5];
			g = hash[6];
			h = hash[7];

			for (j = 0; j < 64; j++){
				if (j < 16){
					w[j] = bin[j + i];
				} else {
					w[j] = safe(safe(safe(trans.g1(w[j - 2]), w[j - 7]), trans.g0(w[j - 15])), w[j - 16]);
				}

				t1 = safe(safe(safe(safe(h, trans.s1(e)), trans.c(e, f, g)), table[j]), w[j]);
				t2 = safe(trans.s0(a), trans.d(a, b, c));

				h = g;
				g = f;
				f = e;
				e = safe(d, t1);
				d = c;
				c = b;
				b = a;
				a = safe(t1, t2);
			}

			hash[0] = safe(a, hash[0]);
			hash[1] = safe(b, hash[1]);
			hash[2] = safe(c, hash[2]);
			hash[3] = safe(d, hash[3]);
			hash[4] = safe(e, hash[4]);
			hash[5] = safe(f, hash[5]);
			hash[6] = safe(g, hash[6]);
			hash[7] = safe(h, hash[7]);
		}

		return hash;
	}

	Array.implement({
		'toSHA256': function(length){
			return sha256(this, length);
		}
	});

})();

/*
---
name: Array.SHA-512
description: Array SHA512 processing, for big-endian dword arrays.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/Array
provides: [Array.toSHA512]
...
*/

(function(){

	function Int64(h, l){
		this.h = h;
		this.l = l;
	}
	
	Int64.prototype.copy = function(){
		return new Int64(this.h, this.l);
	}

	Int64.prototype.add = function(){
		var a, b,
			t1 = this.l & 0xffff,
			t2 = this.l >>> 16,
			t3 = this.h & 0xffff,
			t4 = this.h >>> 16;

		for (a = 0; b = arguments[a]; a++){
			t1 += (b.l & 0xffff);
		}

		for (a = 0; b = arguments[a]; a++){
			t2 += (b.l >>> 16);
		}
		
		t2 += (t1 >>> 16);

		for (a = 0; b = arguments[a]; a++){
			t3 += (b.h & 0xffff);
		}

		t3 += (t2 >>> 16);

		for (a = 0; b = arguments[a]; a++){
			t4 += (b.h >>> 16);
		}

		t4 += (t3 >>> 16);

		return new Int64((t3 & 0xffff) | (t4 << 16), (t1 & 0xffff) | (t2 << 16));
	}

	Int64.prototype.rotate = function(by, shift){
		this.l = (by.l >>> shift) | (by.h << (32 - shift));
		this.h = (by.h >>> shift) | (by.l << (32 - shift));
	}

	Int64.prototype.reverseRotate = function(by, shift){
		this.l = (by.h >>> shift) | (by.l << (32 - shift));
		this.h = (by.l >>> shift) | (by.h << (32 - shift));
	}

	Int64.prototype.shift = function(by, shift){
		this.l = (by.l >>> shift) | (by.h << (32 - shift));
		this.h = (by.h >>> shift);
	}

	var table = [
		new Int64(0x428a2f98, -685199838), new Int64(0x71374491, 0x23ef65cd),
		new Int64(-1245643825, -330482897), new Int64(-373957723, -2121671748),
		new Int64(0x3956c25b, -213338824), new Int64(0x59f111f1, -1241133031),
		new Int64(-1841331548, -1357295717), new Int64(-1424204075, -630357736),
		new Int64(-670586216, -1560083902), new Int64(0x12835b01, 0x45706fbe),
		new Int64(0x243185be, 0x4ee4b28c), new Int64(0x550c7dc3, -704662302),
		new Int64(0x72be5d74, -226784913), new Int64(-2132889090, 0x3b1696b1),
		new Int64(-1680079193, 0x25c71235), new Int64(-1046744716, -815192428),
		new Int64(-459576895, -1628353838), new Int64(-272742522, 0x384f25e3),
		new Int64(0xfc19dc6, -1953704523), new Int64(0x240ca1cc, 0x77ac9c65),
		new Int64(0x2de92c6f, 0x592b0275), new Int64(0x4a7484aa, 0x6ea6e483),
		new Int64(0x5cb0a9dc, -1119749164), new Int64(0x76f988da, -2096016459),
		new Int64(-1740746414, -295247957), new Int64(-1473132947, 0x2db43210),
		new Int64(-1341970488, -1728372417), new Int64(-1084653625, -1091629340),
		new Int64(-958395405, 0x3da88fc2), new Int64(-710438585, -1828018395),
		new Int64(0x6ca6351, -536640913), new Int64(0x14292967, 0xa0e6e70),
		new Int64(0x27b70a85, 0x46d22ffc), new Int64(0x2e1b2138, 0x5c26c926),
		new Int64(0x4d2c6dfc, 0x5ac42aed), new Int64(0x53380d13, -1651133473),
		new Int64(0x650a7354, -1951439906), new Int64(0x766a0abb, 0x3c77b2a8),
		new Int64(-2117940946, 0x47edaee6), new Int64(-1838011259, 0x1482353b),
		new Int64(-1564481375, 0x4cf10364), new Int64(-1474664885, -1136513023),
		new Int64(-1035236496, -789014639), new Int64(-949202525, 0x654be30),
		new Int64(-778901479, -688958952), new Int64(-694614492, 0x5565a910),
		new Int64(-200395387, 0x5771202a), new Int64(0x106aa070, 0x32bbd1b8),
		new Int64(0x19a4c116, -1194143544), new Int64(0x1e376c08, 0x5141ab53),
		new Int64(0x2748774c, -544281703), new Int64(0x34b0bcb5, -509917016),
		new Int64(0x391c0cb3, -976659869), new Int64(0x4ed8aa4a, -482243893),
		new Int64(0x5b9cca4f, 0x7763e373), new Int64(0x682e6ff3, -692930397),
		new Int64(0x748f82ee, 0x5defb2fc), new Int64(0x78a5636f, 0x43172f60),
		new Int64(-2067236844, -1578062990), new Int64(-1933114872, 0x1a6439ec),
		new Int64(-1866530822, 0x23631e28), new Int64(-1538233109, -561857047),
		new Int64(-1090935817, -1295615723), new Int64(-965641998, -479046869),
		new Int64(-903397682, -366583396), new Int64(-779700025, 0x21c0c207),
		new Int64(-354779690, -840897762), new Int64(-176337025, -294727304),
		new Int64(0x6f067aa, 0x72176fba), new Int64(0xa637dc5, -1563912026),
		new Int64(0x113f9804, -1090974290), new Int64(0x1b710b35, 0x131c471b),
		new Int64(0x28db77f5, 0x23047d84), new Int64(0x32caab7b, 0x40c72493),
		new Int64(0x3c9ebe0a, 0x15c9bebc), new Int64(0x431d67c4, -1676669620),
		new Int64(0x4cc5d4be, -885112138), new Int64(0x597f299c, -60457430),
		new Int64(0x5fcb6fab, 0x3ad6faec), new Int64(0x6c44198c, 0x4a475817)
	];

	function sha512(bin, length){
		var i, j,
			words = new Array(),
			hash = new Array(),

			base = [
				new Int64(0x6a09e667, -205731576),
				new Int64(-1150833019, -2067093701),
				new Int64(0x3c6ef372, -23791573),
				new Int64(-1521486534, 0x5f1d36f1),
				new Int64(0x510e527f, -1377402159),
				new Int64(-1694144372, 0x2b3e6c1f),
				new Int64(0x1f83d9ab, -79577749),
				new Int64(0x5be0cd19, 0x137e2179)
			],

			t1 = new Int64(0, 0), t2 = new Int64(0, 0),

			a = new Int64(0,0), b = new Int64(0,0),
			c = new Int64(0,0), d = new Int64(0,0),
			e = new Int64(0,0), f = new Int64(0,0),
			g = new Int64(0,0), h = new Int64(0,0),

			s0 = new Int64(0, 0), s1 = new Int64(0, 0),
			ch = new Int64(0, 0), maj = new Int64(0, 0),
			r1 = new Int64(0, 0), r2 = new Int64(0, 0),
			r3 = new Int64(0, 0);

		for (i = 0; i < 80; i++){
			words[i] = new Int64(0, 0);
		}

		bin[length >> 5] |= 0x80 << (24 - (length & 0x1f));
		bin[((length + 128 >> 10)<< 5) + 31] = length;

		for (i = 0; i < bin.length; i += 32){
			a = base[0].copy();
			b = base[1].copy();
			c = base[2].copy();
			d = base[3].copy();
			e = base[4].copy();
			f = base[5].copy();
			g = base[6].copy();
			h = base[7].copy();

			for (j = 0; j < 16; j++){
				words[j].h = bin[i + 2 * j];
				words[j].l = bin[i + 2 * j + 1];
			}

			for (j = 16; j < 80; j++){
				r1.rotate(words[j - 2], 19);
				r2.reverseRotate(words[j - 2], 29);
				r3.shift(words[j - 2], 6);
				s1.l = r1.l ^ r2.l ^ r3.l;
				s1.h = r1.h ^ r2.h ^ r3.h;

				r1.rotate(words[j - 15], 1);
				r2.rotate(words[j - 15], 8);
				r3.shift(words[j - 15], 7);
				s0.l = r1.l ^ r2.l ^ r3.l;
				s0.h = r1.h ^ r2.h ^ r3.h;

				words[j] = s1.add(words[j - 7], s0, words[j - 16]);
			}

			for (j = 0; j < 80; j++){
				ch.l = (e.l & f.l) ^ (~e.l & g.l);
				ch.h = (e.h & f.h) ^ (~e.h & g.h);

				r1.rotate(e, 14);
				r2.rotate(e, 18);
				r3.reverseRotate(e, 9);
				s1.l = r1.l ^ r2.l ^ r3.l;
				s1.h = r1.h ^ r2.h ^ r3.h;

				r1.rotate(a, 28);
				r2.reverseRotate(a, 2);
				r3.reverseRotate(a, 7);
				s0.l = r1.l ^ r2.l ^ r3.l;
				s0.h = r1.h ^ r2.h ^ r3.h;

				maj.l = (a.l & b.l) ^ (a.l & c.l) ^ (b.l & c.l);
				maj.h = (a.h & b.h) ^ (a.h & c.h) ^ (b.h & c.h);

				t1 = h.add(s1, ch, table[j], words[j]);
				t2 = s0.add(maj);

				h = g.copy();
				g = f.copy();
				f = e.copy();
				e = d.add(t1);
				d = c.copy();
				c = b.copy();
				b = a.copy();
				a = t1.add(t2);
			}

			base[0] = base[0].add(a);
			base[1] = base[1].add(b);
			base[2] = base[2].add(c);
			base[3] = base[3].add(d);
			base[4] = base[4].add(e);
			base[5] = base[5].add(f);
			base[6] = base[6].add(g);
			base[7] = base[7].add(h);
		}

		for (i = 0; i < 8; i++){
			hash[2 * i] = base[i].h;
			hash[2 * i + 1] = base[i].l;
		}
		
		return hash;
	}

	Array.implement({
		'toSHA512': function(length){
			return sha512(this, length);
		}
	});

})();

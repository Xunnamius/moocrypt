/*
---
name: String.SHA-512
description: String SHA512 hashing.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires:
  - Core/String
  - String.toUTF8
  - String.toBin
  - Array.toSHA512
  - Array.toHex
provides: [String.toSHA512]
...
*/

(function(){

	function sha512(string, size, hexUpperCase){
		var bin = string.toUTF8().toBin(size),
			proc = bin.toSHA512(string.length * size);

			return proc.toHex(hexUpperCase);
	}

	String.implement({
		'toSHA512': function(){
			return sha512(this, 8, 0);
		}
	});

})();

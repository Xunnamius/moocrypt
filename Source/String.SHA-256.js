/*
---
name: String.SHA-256
description: String SHA256 hashing.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
  - String.toUTF8
  - String.toBin
  - Array.toSHA256
  - Array.toHex
provides: [String.toSHA256]
...
*/

(function(){

	function sha256(string, size, hexUpperCase){
		var bin = string.toUTF8().toBin(size),
			proc = bin.toSHA256(string.length * size);

		return proc.toHex(hexUpperCase);
	}

	String.implement({
		'toSHA256': function(){
			return sha256(this, 8, 0);
		} 
	});

})();

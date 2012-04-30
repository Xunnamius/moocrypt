/*
---
name: String.RMD160
description: String RMD160 hashing.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
  - String.toUTF8
  - String.toHex
  - String.toBin
  - Array.toRMD160
  - Array.toHex
provides: [String.toRMD160]
...
*/

(function(){
	
	function binToString(array){
		var a, result = '';

		for (a = 0; a < array.length * 32; a += 8){
			result += String.fromCharCode((array[a >> 5] >>> (a % 32)) & 0xFF);
		}

		return result;
	}

	function rmd160(string, size, hexUpperCase){
		var bin = string.toUTF8().toBin(size, true),
			proc = bin.toRMD160(string.length * size);

		return binToString(proc).toHex(hexUpperCase);
	}

	String.implement({
		'toRMD160': function(){
			return rmd160(this, 8, 0);
		}
	});

})();

/*
---
description: String RMD160 hashing.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toRMD160]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8, String.toHex, String.toBin, Array.toRMD160, Array.toHex]
...
*/

(function() {
	
	function binToString(string)
	{
		var a, result = '';

		for(a = 0; a < string.length * 32; a += 8)
		{
			result += String.fromCharCode((string[a >> 5] >>> (a % 32)) & 0xFF);
		}

		return result;
	}

	function rmd160(string, size, hexUpperCase)
	{
		var bin = string.toUTF8().toBin(size, true),
			proc = bin.toRMD160(string.length * size);

		return binToString(proc).toHex(hexUpperCase);
	}

	String.implement({
		'toRMD160': function()
		{
			return rmd160(this, 8, 0);
		}
	});

})();
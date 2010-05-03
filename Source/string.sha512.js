/*
---
description: String SHA512 hashing.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSHA512]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8, String.toBin, Array.toSHA512, Array.toHex]
...
*/

(function() {

	function sha512(string, size, hexUpperCase)
	{
		var bin = string.toUTF8().toBin(size),
			proc = bin.toSHA512(string.length * size);

			return proc.toHex(hexUpperCase);
	}

	String.implement({
		'toSHA512': function()
		{
			return sha512(this, 8, 0);
		}
	});

})();
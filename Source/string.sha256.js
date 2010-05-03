/*
---
description: String SHA256 hashing.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSHA256]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8, String.toBin, Array.toSHA256, Array.toHex]
...
*/

(function() {

	function sha256(string, size, hexUpperCase)
	{
		var bin = string.toUTF8().toBin(size),
			proc = bin.toSHA256(string.length * size);

		return proc.toHex(hexUpperCase);
	}

	String.implement({
		'toSHA256': function()
		{
			return sha256(this, 8, 0);
		} 
	});

})();
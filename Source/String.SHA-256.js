/*
---
name: String.SHA-256
description: String SHA256 hashing.
license: MIT-style
authors: [Christopher Pitt]
requires: 
  - Core/String
  - String.UTF-8
  - String.Common
  - Array.SHA-256
  - Array.Common
provides: [String.toSHA256]
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
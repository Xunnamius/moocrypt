/*
---
name: String.SHA-512
description: String SHA512 hashing.
license: MIT-style
authors: [Christopher Pitt]
requires:
  - Core/String
  - String.UTF-8
  - String.Common
  - Array.SHA-512
  - Array.Common
provides: [String.toSHA512]
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
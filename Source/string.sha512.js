/*
---
description: String SHA512 hashing.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSHA512]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8, Array.toSHA512]
...
*/

(function() {
	
	function stringToBin(string)
	{
		var a, b = string.length,
			result = Array(b >> 2);

		for(a = 0; a < b; a++)
		{
			result[a] = 0;
		}

		for(a = 0; a < b * 8; a += 8)
		{
			result[a >> 5] |= (string.charCodeAt(a / 8) & 0xFF) << (24 - a % 32);
		}

		return result;
	}

	function binToHex(bin, hexUpperCase)
	{
		var result = '',
			chars = hexUpperCase ? "0123456789ABCDEF" : "0123456789abcdef";

		for(var i = 0; i < bin.length * 4; i++)
		{
			result += chars.charAt((bin[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + chars.charAt((bin[i >> 2] >> ((3 - i % 4) * 8  )) & 0xF);
		}

		return result;
	}
	
	function sha512(string, size, hexUpperCase)
	{
		var bin = stringToBin(string.toUTF8()),
			proc = bin.toSHA512(string.length * size);

		return binToHex(proc, hexUpperCase);
	}

	String.implement({
		'toSHA512': function()
		{
			return sha512(this, 8, 0);
		}
	});

})();
/*
---
description: String SHA256 hashing.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSHA256]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8, Array.toSHA256]
...
*/

(function() {
	function stringToBin(string, size)
	{
		var bin = Array(),
			mask = (1 << size) - 1;

		for(var i = 0; i < string.length * size; i += size)
		{
			bin[i >> 5] |= (string.charCodeAt(i / size) & mask) << (24 - i % 32);
		}

		return bin;
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

	function sha256(string, size, hexUpperCase)
	{
		var bin = stringToBin(string.toUTF8(), size),
			proc = bin.toSHA256(string.length * size);

		return binToHex(proc, hexUpperCase);
	}
    
    String.implement({
       'toSHA256': function()
       {
           return sha256(this, 8, 0);
       } 
    });

})();
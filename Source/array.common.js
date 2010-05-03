/*
---
description: Common Array hash-related methods.
license: MIT-style
authors: [Christopher Pitt]
provides: [Array.toHex]
requires: 
  core/1.2.4: [Array]
...
*/

(function() {

	Array.implement({
		'toHex': function(hexUpperCase)
		{
			var result = '',
				chars = hexUpperCase ? "0123456789ABCDEF" : "0123456789abcdef";

			for(var i = 0; i < this.length * 4; i++)
			{
				result += chars.charAt((this[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + chars.charAt((this[i >> 2] >> ((3 - i % 4) * 8  )) & 0xF);
			}

			return result;
		} 
	});

})();
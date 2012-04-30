/*
---
name: Array.Hex
description: Array Hex encode
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/Array
provides: [Array.toHex]
...
*/

(function() {

	Array.implement({
		'toHex': function(hexUpperCase){
			var a, result = '',
				chars = hexUpperCase ?
					'0123456789ABCDEF':
					'0123456789abcdef';

			for (a = 0; a < this.length * 4; a++){
				result += chars.charAt((this[a >> 2] >> ((3 - a % 4) * 8 + 4)) & 0xF) + chars.charAt((this[a >> 2] >> ((3 - a % 4) * 8  )) & 0xF);
			}

			return result;
		} 
	});

})();

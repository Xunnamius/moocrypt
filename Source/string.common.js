/*
---
description: Common String hash-related methods.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toBin]
requires: 
  core/1.2.4: [String]
...
*/

(function() {

	String.implement({
		'toBin': function(size)
		{
			var a, bin = Array(),
				mask = (1 << size) - 1;

			for(a = 0; a < this.length * size; a += size)
			{
				bin[a >> 5] |= (this.charCodeAt(a / size) & mask) << (24 - a % 32);
			}

			return bin;
		} 
	});

})();
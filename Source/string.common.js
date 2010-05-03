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
		'toBin': function(size, littleEndian)
		{
			var a, bin = Array(),
				mask = (1 << size) - 1;

			for(a = 0; a < this.length * size; a += size)
			{
				var modifier = littleEndian ?
					(a % 32):
					(24 - a % 32);

				bin[a >> 5] |= (this.charCodeAt(a / size) & mask) << modifier;
			}

			return bin;
		} 
	});

})();
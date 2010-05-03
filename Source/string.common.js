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
			var bin = Array(),
				mask = (1 << size) - 1;

			for(var i = 0; i < this.length * size; i += size)
			{
				bin[i >> 5] |= (this.charCodeAt(i / size) & mask) << (24 - i % 32);
			}

			return bin;
		} 
	});

})();
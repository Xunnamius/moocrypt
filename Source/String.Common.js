/*
---
name: String.Common
description: Common String hash-related methods.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
provides: [String.toBin]
...
*/

(function(){

	String.implement({
		'toBin': function(size, littleEndian){
			var a, bin = new Array(),
				mask = (1 << size) - 1;

			for (a = 0; a < this.length * size; a += size){
				var modifier = littleEndian ?
					(a % 32):
					(24 - a % 32);

				bin[a >> 5] |= (this.charCodeAt(a / size) & mask) << modifier;
			}

			return bin;
		} 
	});

})();

/*
---
name: String.Hex
description: String Hex encode/decode.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
provides: [String.toHex, String.fromHex]
...
*/

(function(){

	String.implement({
		'toHex': function(){
			var r = '', i = 0,
			limit = this.length;

			while (i < limit){
				r += this.charCodeAt(i++).toString(16);
			}

			return r;
		},
		'fromHex': function(){
			var r = '', s = '',
			e = this.length;

			while(e > 0){
				s = e - 2;
				r = String.fromCharCode('0x' + this.substring(s, e)) + r;
				e = s;
			}

			return r;
		}
	});

})();

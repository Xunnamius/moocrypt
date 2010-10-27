/*
---
description: String Hex encode/decode.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSHA256]
requires: 
  core/1.2.4: [String]
  _self_/_current_: [String.toUTF8]
...
*/

(function() {

	String.implement({
		'toHex': function()
		{
			var r = '', i = 0,
			limit = this.length;

			while(i < limit){
				r += this.charCodeAt(i++).toString(16);
			}

			return r;
		},
		'fromHex': function()
		{
			var r = s = '',
			e = this.length;

			while(e >= 0)
			{
				s = e - 2;
				r = String.fromCharCode('0x' + this.substring(s, e)) + r;
				e = s;
			}

			return r;
		}
	});

})();
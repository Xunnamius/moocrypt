/*
---
name: String.Slug
description: String slug conversion.
license: MIT-style
authors: [Christopher Pitt, Enrique Erne, Xunnamius]
requires: 
  - Core/String
provides: [String.toSlug]
...
*/

(function(){

	// A special thanks to the MooTools more team who
	// compiled this extensive list of character replacements.

	var special = {
		'a': '[àáâãäåăą]',
		'A': '[ÀÁÂÃÄÅĂĄ]',
		'c': '[ćčç]',
		'C': '[ĆČÇ]',
		'd': '[ďđ]',
		'D': '[ĎÐ]',
		'e': '[èéêëěę]',
		'E': '[ÈÉÊËĚĘ]',
		'g': '[ğ]',
		'G': '[Ğ]',
		'i': '[ìíîï]',
		'I': '[ÌÍÎÏ]',
		'l': '[ĺľł]',
		'L': '[ĹĽŁ]',
		'n': '[ñňń]',
		'N': '[ÑŇŃ]',
		'o': '[òóôõöøő]',
		'O': '[ÒÓÔÕÖØ]',
		'r': '[řŕ]',
		'R': '[ŘŔ]',
		's': '[ššş]',
		'S': '[ŠŞŚ]',
		't': '[ťţ]',
		'T': '[ŤŢ]',
		'ue': '[ü]',
		'UE': '[Ü]',
		'u': '[ùúûůµ]',
		'U': '[ÙÚÛŮ]',
		'y': '[ÿý]',
		'Y': '[ŸÝ]',
		'z': '[žźż]',
		'Z': '[ŽŹŻ]',
		'th': '[þ]',
		'TH': '[Þ]',
		'dh': '[ð]',
		'DH': '[Ð]',
		'ss': '[ß]',
		'oe': '[œ]',
		'OE': '[Œ]',
		'ae': '[æ]',
		'AE': '[Æ]',
		' ': '[\xa0\u2002\u2003\u2009]',
		'*': '[\xb7]',
		'\'': '[\u2018\u2019]',
		'"': '[\u201c\u201d]',
		'...': '[\u2026]',
		'-': '[\u2013]',
		'--': '[\u2014]',
		'&raquo;': '[\uFFFD]'
	};

	function walk(string, replacements){
		var result = string;
	
		for (var key in replacements){
			if (replacements.hasOwnProperty(key)){
				result = result.replace(new RegExp(replacements[key], 'g'), key);
			}
		}
	
		return result;
	}

	function slug(string){
		return walk(string, special)
			.replace(/\s+/g, '-')
			.toLowerCase()
			.replace(/[^a-z0-9\-]/g, '');
	}

	String.implement({
		'toSlug': function(){
			return slug(this);
		} 
	});

})();

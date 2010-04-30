/*
---
description: String slug conversion.
license: MIT-style
authors: [Christopher Pitt]
provides: [String.toSlug]
requires: 
  core/1.2.4: [String]
...
*/

(function() {

	// A special thanks to the MooTools more team who
	// compiled this extensive list of character replacements.

	var special = {
		'a': ['à', 'á', 'â', 'ã', 'ä', 'å', 'a', 'a'],
		'A': ['À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'A', 'A'],
		'c': ['c', 'c', 'ç'],
		'C': ['C', 'C', 'Ç'],
		'd': ['d', 'd'],
		'D': ['D', 'Ð'],
		'e': ['è', 'é', 'ê', 'ë', 'e', 'e'],
		'E': ['È', 'É', 'Ê', 'Ë', 'E', 'E'],
		'g': ['g'],
		'G': ['G'],
		'i': ['ì', 'í', 'î', 'ï'],
		'I': ['Ì', 'Í', 'Î', 'Ï'],
		'l': ['l', 'l', 'l'],
		'L': ['L', 'L', 'L'],
		'n': ['ñ', 'n', 'n'],
		'N': ['Ñ', 'N', 'N'],
		'o': ['ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'o'],
		'O': ['Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø'],
		'r': ['r', 'r'],
		'R': ['R', 'R'],
		's': ['š', 's', 's'],
		'S': ['Š', 'S', 'S'],
		't': ['t', 't', 't'],
		'T': ['T', 'T', 'T'],
		'u': ['ù', 'ú', 'û', 'ü', 'u', 'µ'],
		'U': ['Ù', 'Ú', 'Û', 'Ü', 'U'],
		'y': ['ÿ', 'ý'],
		'Y': ['Ÿ', 'Ý'],
		'z': ['ž', 'z', 'z'],
		'Z': ['Ž', 'Z', 'Z'],
		'th': ['þ'],
		'TH': ['Þ'],
		'dh': ['ð'],
		'DH': ['Ð'],
		'ss': ['ß'],
		'oe': ['œ'],
		'OE': ['Œ'],
		'ae': ['æ'],
		'AE': ['Æ'],
		' ': ['[\xa0\u2002\u2003\u2009]'],
		'*': ['\xb7'],
		'\'': ['[\u2018\u2019]'],
		'"': ['[\u201c\u201d]'],
		'...': ['\u2026'],
		'-': ['\u2013'],
		'--': ['\u2014'],
		'&raquo;': ['\uFFFD']
	};

	function walk(string, replacements)
	{
		var result = string;

		Hash.each(replacements, function(value, key) {
			Array.each(value, function(check) {
				result = result.replace(new RegExp(check, 'g'), key);
			});
		});

		return result;
	}

	function slug(string)
	{
		return walk(string, special)
			.replace(/\s+/g, '-')
			.toLowerCase()
			.replace(/[^a-z0-9\-]/g, '');
	}

	String.implement({
		'toSlug': function()
		{
			return slug(this);
		} 
	});

})();
String Cryptography
===================

String cryptography methods.

![Screenshot](http://github.com/sixtyseconds/mootools-string-cryptography/raw/master/screen.png)

How to use
----------

	// Working demos are included in the download!
	
	'Chrís thë Dëvëlopër'.toUTF8(); //'ChrÃs thÃ« DÃ«vÃ«lopÃ«r'
	'Chris the Developer'.toUTF8().fromUTF8(); //'Chris the Developer'
	'Chris the Developer'.toHex(); //'43687269732074686520446576656c6f706572'
	'Chris the Developer'.toHex().fromHex(); //'Chris the Developer'
	'Chris the Developer'.toCRC32(); //'1911945355'
	'Chris the Developer'.toMD5(); //'e2a98a8e2769e3e6673100a682050918'
	'Chris the Developer'.toSHA1(); //'84e6af7fadbd9c322ac56902440bb5181ad13bbd'
	'Chris the Developer'.toSHA256(); //'53fc5c4e3267985242c62e44c39b390d804a3d8ea60da712a95cc5a83daeda7e'
	'Chris the Developer'.toSHA512(); //'db6744d8ea09803bb3738a26069785bc81e5e8f41fd2d5f130c84989ce1d1fd8d0fb5038123e641ab98404d981c0072b0362a63616582f0d791d1130b58ceba3'
	'Chrís thë Dëvëlopër'.toSlug(); //'chris-the-developer'
	'Chris the Developer'.toBase64(); //'Q2hyaXMgdGhlIERldmVsb3Blcg=='
	'Chris the Developer'.toBase64().fromBase64(); //'Chris the Developer'
	'Chris the Developer'.toRMD160(); //'6072cb3e869f79a1d43701603c608867019584f7'

Demos
-----

* UTF8: [Demo](http://www.jsfiddle.net/sixtyseconds/yvKuX/)
* CRC32: [Demo](http://www.jsfiddle.net/sixtyseconds/Zk53u/)
* HEX: [Demo](http://www.jsfiddle.net/sixtyseconds/wvrX9/)
* MD5: [Demo](http://www.jsfiddle.net/sixtyseconds/RjwrW/)
* SHA1: [Demo](http://www.jsfiddle.net/sixtyseconds/RpW6z/)
* SHA256: [Demo](http://www.jsfiddle.net/sixtyseconds/MqRmb/)
* SHA512: [Demo](http://www.jsfiddle.net/sixtyseconds/xhxXr/)
* Slug: [Demo](http://www.jsfiddle.net/sixtyseconds/rpbLV/)
* Base64: [Demo](http://www.jsfiddle.net/sixtyseconds/2Pm7k/)
* RMD160: [Demo](http://www.jsfiddle.net/sixtyseconds/7Ff9U/)
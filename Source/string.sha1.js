/*
---
description: String SHA1 hashing.

license: MIT-style

authors:
- Christopher Pitt

requires:
- core/1.2.4: String
- string_toutf8/0.1: String.toUTF8

provides: [String.toSHA1]

...
*/

(function() {
    
    var transforms = {
        'rotateLeft': function(a, b)
        {
    		return (a << b) | (a >>> (32 - b));
        },
        'hex': function(a)
        {
            var b, c, result = '';
     
    		for(b = 7; b >= 0; b--)
            {
    			c = (a >>> (b * 4)) & 0x0f;
    			result += c.toString(16);
    		}
            
    		return result;
        }
    };
    
    function sha1(msg)
    {
    	var blockstart;
    	var i, j;
    	var W = new Array(80);
    	var H0 = 0x67452301;
    	var H1 = 0xEFCDAB89;
    	var H2 = 0x98BADCFE;
    	var H3 = 0x10325476;
    	var H4 = 0xC3D2E1F0;
    	var A, B, C, D, E;
    	var temp;
     
    	msg = msg.toUTF8();
     
    	var msg_len = msg.length;
     
    	var word_array = new Array();
    	for( i=0; i<msg_len-3; i+=4 ) {
    		j = msg.charCodeAt(i)<<24 | msg.charCodeAt(i+1)<<16 |
    		msg.charCodeAt(i+2)<<8 | msg.charCodeAt(i+3);
    		word_array.push( j );
    	}
     
    	switch( msg_len % 4 ) {
    		case 0:
    			i = 0x080000000;
    		break;
    		case 1:
    			i = msg.charCodeAt(msg_len-1)<<24 | 0x0800000;
    		break;
     
    		case 2:
    			i = msg.charCodeAt(msg_len-2)<<24 | msg.charCodeAt(msg_len-1)<<16 | 0x08000;
    		break;
     
    		case 3:
    			i = msg.charCodeAt(msg_len-3)<<24 | msg.charCodeAt(msg_len-2)<<16 | msg.charCodeAt(msg_len-1)<<8	| 0x80;
    		break;
    	}
     
    	word_array.push( i );
     
    	while( (word_array.length % 16) != 14 ) word_array.push( 0 );
     
    	word_array.push( msg_len>>>29 );
    	word_array.push( (msg_len<<3)&0x0ffffffff );
     
     
    	for ( blockstart=0; blockstart<word_array.length; blockstart+=16 ) {
     
    		for( i=0; i<16; i++ ) W[i] = word_array[blockstart+i];
    		for( i=16; i<=79; i++ ) W[i] = transforms.rotateLeft(W[i-3] ^ W[i-8] ^ W[i-14] ^ W[i-16], 1);
     
    		A = H0;
    		B = H1;
    		C = H2;
    		D = H3;
    		E = H4;
     
    		for( i= 0; i<=19; i++ ) {
    			temp = (transforms.rotateLeft(A,5) + ((B&C) | (~B&D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
    			E = D;
    			D = C;
    			C = transforms.rotateLeft(B,30);
    			B = A;
    			A = temp;
    		}
     
    		for( i=20; i<=39; i++ ) {
    			temp = (transforms.rotateLeft(A,5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
    			E = D;
    			D = C;
    			C = transforms.rotateLeft(B,30);
    			B = A;
    			A = temp;
    		}
     
    		for( i=40; i<=59; i++ ) {
    			temp = (transforms.rotateLeft(A,5) + ((B&C) | (B&D) | (C&D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
    			E = D;
    			D = C;
    			C = transforms.rotateLeft(B,30);
    			B = A;
    			A = temp;
    		}
     
    		for( i=60; i<=79; i++ ) {
    			temp = (transforms.rotateLeft(A,5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
    			E = D;
    			D = C;
    			C = transforms.rotateLeft(B,30);
    			B = A;
    			A = temp;
    		}
     
    		H0 = (H0 + A) & 0x0ffffffff;
    		H1 = (H1 + B) & 0x0ffffffff;
    		H2 = (H2 + C) & 0x0ffffffff;
    		H3 = (H3 + D) & 0x0ffffffff;
    		H4 = (H4 + E) & 0x0ffffffff;
     
    	}
     
    	var temp = transforms.hex(H0) + transforms.hex(H1) + transforms.hex(H2) + transforms.hex(H3) + transforms.hex(H4);
     
    	return temp.toLowerCase();
     
    }
    
    String.implement({
       'toSHA1': function()
       {
           return sha1(this);
       } 
    });
})();
﻿## SSL + CDN + Javascript

SSL is a contract to your users that the information they provide you will not be accessible to anyone else.

If you are including active content (javascript libraries, html fragments), simply prepending "https://" to make the security errors go away still breaks that contract - as the CDN is now able to inject any code of its choosing onto your webpage.

If you still want the performance benefits of CDN, this **1.5kb tool** will close the security gap by using CORS to retrieve resources from supporting CDNs (e.g. cdnjs.com) and **validating the contents of any resource against a known sha256 hash** before allowing it to execute on the page.

Thanks to __[Ryan Grove](http://wonko.com/post/javascript-ssl-cdn)__ for the inspiration

## Installation

```
npm install secdn
```

## Examples

```js
/*
 Compute the sha256 hash of any string (after using escape() as tiny-sha256 
 only supports ASCII)
*/
console.log(secdn.hash('var myFavouriteUnicodeChar = "ǂ"'));

/*
 Download a trusted resource (local script or a CORS-enabled CDN) and compute 
 the hash signature that will be used later to verify it
*/
secdn.sign('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js', 
	function(hash) {
		console.log(hash);
	});
	
/*
 Download a resource from any **untrusted** CORS-enabled CDN - will throw an 
 exception if it has been tampered with
*/
secdn.retrieve('http://cdnjs.cloudflare.com/ajax/libs/6px/1.0.3/6px.min.js', 
	'9b2392e14dc260ace86b78b2009939d5d64718f42a6dd1f65e13079b9d20f106', 
	function(content) {
		//do something with this resource
	});

/*
 A wrapper for secdn.retrieve that will include the content as a script in 
 the document head
*/
secdn.include('http://cdnjs.cloudflare.com/ajax/libs/6px/1.0.3/6px.min.js', 
	'9b2392e14dc260ace86b78b2009939d5d64718f42a6dd1f65e13079b9d20f106',
	function() { 
		//code to run when script is loaded
	});
	
/*
 A wrapper for secdn.retrieve that will replace the current page's entire 
 HTML with the supplied content
*/
secdn.page('http://cdnjs.cloudflare.com/ajax/libs/6px/1.0.3/6px.min.js', 
	'9b2392e14dc260ace86b78b2009939d5d64718f42a6dd1f65e13079b9d20f106',
	function() { 
		//code to run when content is loaded
	});
```

## License

MIT
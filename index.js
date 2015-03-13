var sha256 = require('tiny-sha256');

var hash = function(text) { 
	return sha256(escape(text)); 
}

var ajax = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		xhr.readyState^4 || callback(xhr.responseText);				
	};
	xhr.open('get', url);
	xhr.send();
}

var secdn = {};

secdn['hash'] = hash;

secdn['sign'] = function(url, callback) {
	ajax(url, function(responseText) {
		callback(hash(responseText));
	});
};

var retrieve = function(url, hash, callback) {
	ajax(url, function(responseText) {
		if (hash(responseText) == hash)
			callback(responseText);
		else
			throw 'sha256 validation for ' + url + ' failed';
	});
};

secdn['retrieve'] = retrieve;

secdn['include'] = function(url, hash, callback) {
	retrieve(url, hash, function(content) {
		var elem = document.createElement('script');
		elem.innerHTML = content;
		document.head.appendChild(elem);
		callback(elem);
	});
}

secdn['page'] = function(url, hash, callback) {
	retrieve(url, hash, function(content) {
		var doc = document.open('text/html', 'replace');
		doc.write(content);
		doc.close();
	});
}

module.exports = secdn;
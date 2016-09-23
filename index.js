var sha256 = require('tiny-sha256');

var getHash = function(text) { 
	return sha256(escape(text)); 
}

var ajax = function(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
    if (xhr.readyState === 4) {
      if (xhr.status === 200)
        callback(null, xhr.responseText);
      else
        callback(xhr.responseText);
    }
	};
	xhr.open('get', url);
	xhr.send();
}

var secdn = {};

secdn['hash'] = getHash;

secdn['sign'] = function(url, callback) {
	ajax(url, function(err, responseText) {
    if (err)
      callback(err);
    else
		  callback(null, getHash(responseText));
	});
};

var retrieve = function(url, hash, callback) {
	ajax(url, function(err, responseText) {
    if (err)
      callback(err);
		else if (getHash(responseText) === hash)
			callback(null, responseText);
		else
			callback('sha256 validation for ' + url + ' failed');
	});
};

secdn['retrieve'] = retrieve;

secdn['include'] = function(url, hash, callback) {
	retrieve(url, hash, function(err, content) {
		if (err) {
			callback(err);
    } else {
      var elem = document.createElement('script');
      elem.text = content;
      document.getElementsByTagName('head')[0].appendChild(elem);
      callback(null, elem);
    }
	});
}

secdn['page'] = function(url, hash, callback) {
	retrieve(url, hash, function(err, content) {
		if (err) {
			callback(err);
    } else {
      var doc = document.open('text/html', 'replace');
      doc.write(content);
      doc.close();
      callback();
    }
	});
}

module.exports = secdn;
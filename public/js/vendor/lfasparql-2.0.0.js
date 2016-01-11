function LFASparql() {
    this.url = "http://lod4all.net/api/search.cgi";
    this.dataType = "lod4all";
    this.appID = "";
    this.subject = "";
    this.predicate = "";
    this.object = "";

    // We add proxy options for nodejs
    this.proxyHost = "";
    this.proxyPort = -1;
    this.proxyUser = "";
    this.proxyPass = "";
};

LFASparql.prototype.executeSparql = function(options) {
    if (options.appID == null) options.appID = this.appID;
    if (options.sparql == null) options.sparql = "";
    if (options.async == null) options.async = true;
    if (options.timeout == null) options.timeout = 60;
    if (options.dataType == null) options.dataType = "lod4all";

    this.ajax({
        type: "GET",
        async: options.async,
        url: this.url,
        dataType: "json",
        cache: false,
        data: {
            appID: options.appID,
            type: "sparql",
            query: encodeURIComponent(options.sparql),
            format: "json",
            timeout: options.timeout
        },
        success: this.successSparql(options),
        error: this.error(options)
    });
};

LFASparql.prototype.successSparql = function(options) {
    return function(result) {
        if (options.success != null) {
            if(options.dataType == "json"){
            	data = result;
            }else{
            	data = result["results"]["bindings"];
            }
            options.success(data);
        }
    };
};

LFASparql.prototype.executeLiteral = function(options) {
    if (options.appID == null) options.appID = this.appID;
    if (options.graph == null) options.graph = "";
    if (options.qType == null) options.qType = "object";
    if (options.query == null) options.query = "";
    if (options.size == null) options.size = "12";
    if (options.offset == null) options.offset = "0";
    if (options.async == null) options.async = true;
    if (options.dataType == null) options.dataType = "lod4all";

    this.ajax({
        type: "GET",
        async: options.async,
        url: this.url,
        dataType: "json",
        cache: false,
        data: {
            appID: options.appID,
            type: "literal",
            graph: encodeURIComponent(options.graph),
            qType: encodeURIComponent(options.qType),
            query: encodeURIComponent(options.query),
            offset: encodeURIComponent(options.offset),
            size: encodeURIComponent(options.size),
            format: "json"
        },
        success: this.successLiteral(options),
        error: this.error(options)
    });
};

LFASparql.prototype.successLiteral = function(options) {
    return function(result) {
        options.success(result);
    };
}

// For backward compatibility
LFASparql.prototype.execute = function(options) {

    if (options.appID == null) options.appID = this.appID;
    if (options.sparql == null) options.sparql = "";
    if (options.subject == null) {options.subject = "?s";}
    else {this.subject = options.subject; options.subject = "<" + options.subject + ">";}
    if (options.predicate == null) {options.predicate = "?p";}
    else {this.predicate = options.predicate; options.predicate = "<" + options.predicate + ">";}
    if (options.object == null) {options.object = "?o";}
    else {this.object = options.object; options.object = "<" + options.object + ">";}
    if (options.dataType == null) options.dataType = "lod4all";

    if (options.sparql == "") {
        if (options.graph == null)
        {
            options.sparql = "select * where { " + options.subject + " " + options.predicate + " " + options.object  + " . }";
        }
        else
        {
            options.sparql = "select * where { graph <"+options.graph+"> { " + options.subject + " " + options.predicate + " " + options.object  + " . }}";
        }
    }

    this.ajax({
        type: "GET",
        url: this.url,
        dataType: "json",
        cache: false,
        data: {
            appID: options.appID,
            type: "sparql",
            query: encodeURIComponent(options.sparql),
            format: "json"
        },
        success: this.success(options),
        error: this.error(options)
    });
};

// For backward compatibility
LFASparql.prototype.executeMultiple = function(options) {
    if (options.appID == null) options.appID = this.appID;
    if (options.queries == null) options.queries = [];
    if (options.async == null) options.async = true;
    if (options.dataType == null) options.dataType = "lod4all";

    this.ajax({
        type: "POST",
        url: this.url,
        async: options.async,
        dataType: "json",
        cache: false,
        data: {
            appID: options.appID,
            queries: JSON.stringify(options.queries)
        },
        success: this.success(options),
        error: this.error(options)
    });
};

LFASparql.prototype.success = function(options) {
    return function(result) {
        if (options.success != null) {
         	if(options.dataType == "json"){
            	data = result;
            }else{
            	data = result["results"]["bindings"];
            }
            options.success(data);
        }
    };
};

LFASparql.prototype.error = function(options) {
    return function(jqXHR, textStatus, errorThrown) {
         //console.log( 'ERROR', jqXHR, textStatus, errorThrown );
        if (options.error != null) options.error(jqXHR, textStatus, errorThrown);
    };
};

// For backward compatibility
LFASparql.prototype.setSingleURL = function(url) {
    this.url = url;
};

// For backward compatibility
LFASparql.prototype.getSingleURL = function() {
    return this.url;
};

LFASparql.prototype.setMultipleURL = function(url) {
    this.url_multiple = url;
};

LFASparql.prototype.getMultipleURL = function() {
    return this.url_multiple;
};

LFASparql.prototype.setApplicationID = function(appID) {
    this.appID = appID;
};

LFASparql.prototype.getApplicationID = function() {
    return this.appID;
};

LFASparql.prototype.ajax = function (options) {
    // Check that all parameters are correct
    options = (typeof options === 'object') ?
        options : {};
    options.type = (typeof options.type === 'string') ?
        options.type : null;
    options.url = (typeof options.url === 'string') ?
        options.url : null;
    options.async = (typeof options.async === 'boolean') ?
        options.async : true;
    options.dataType = (typeof options.dataType === 'string') ?
        options.dataType : 'json';
    options.success = (typeof options.success === 'function') ?
        options.success : (function () {});
    options.error = (typeof options.error === 'function') ?
        options.error : (function () {});
    options.data = (typeof options.data === 'object') ?
        options.data : null;

    // We do need request type, url and dataType
    if (options.type === null ||
        options.url === null) {
        throw new Error('Invalid ajax request options');
        if (console && console.err) {
            console.err(options);
        }
    }

    // Then we transform our options.data object
    // into a url parameter string p1=v1&p2=v2...
    var optionsDataURL = []
    for (var key in options.data) {
        optionsDataURL.push(
            encodeURIComponent(key) + '=' +
            encodeURIComponent(options.data[key])
        );
    }

    // If it is using GET method, all parameters must
    // be inserted inside the url.
    if (options.type === 'GET') {
        options.url += '?' + optionsDataURL.join('&');
    }

    // With this beautiful function we will parse our response
    var parseResponse = function (status, data) {
        if (status >= 200 && status < 400) {
            if (options.dataType === 'json') {
                options.success(JSON.parse(data));
            } else {
                options.success(data);
            }
        } else {
            options.error({
                status: status,
                data: data
            });
        }
    };

    // At this point we check if we are on nodejs or a browser,
    // then perform our request
    if (typeof module !== 'undefined') {
        // Now we load http module for the request
        // and url module for parsing the url received
        var http = require('http'),
            url = require('url');

        // In this case we must add urlParameters to the path always
        if (options.type !== 'GET') {
            options.url += '?' + optionsDataURL.join('&');
        }
        
        // And here we have to guess if there is a proxy
        options.url = url.parse(options.url);
        var host = options.url.host,
            port = options.url.port || 80,
            path = options.url.path;

        if (this.proxyHost !== '' && this.proxyPort > 0) {
            host = this.proxyHost;
            if (this.proxyUser !== '') {
                host = '@' + host;
                if (this.proxyPass !== '') {
                    host = ':' + this.proxyPass + host;
                }
                host = this.proxyUser + host;
            }
            port = this.proxyPort;
            path = options.url.href;
        }

        // Starting a nice nodejs request
        http.request({
            method: options.type,
            host: host,
            port: port,
            path: path
            //, headers

        }, function (response) {
            var status = response.statusCode,
                data = '';

            response.on('data', function (chunk) { data += chunk; });
            response.on('end', function () {
                parseResponse(status, data);
            });
        
        }).end();

    } else {
        // Now we create our new XMLHttpRequest
        var request = new XMLHttpRequest();

        // Now we can open our request
        request.open(options.type, options.url, options.async);
        if (options.dataType === 'json') {
            request.setRequestHeader('Accept', 'application/json');
        }
        if (options.type === 'POST') {
            request.setRequestHeader('Content-Type',
                'application/x-www-form-urlencoded');
        }

        // When the request has been loaded, we transform the data
        // received into JSON if necesary, otherwise we simply execute
        // the callback.
        request.onload = function () {
            parseResponse(request.status, request.responseText);
        };

        // If it is not a GET request we insert out parameters inside
        // the message, otherwise we just send it.
        if (options.type !== 'GET') {
            request.send(optionsDataURL.join('&'));
        } else {
            request.send();
        }
    }
};

// Optionally exports LFASparql if possible
if (typeof module !== 'undefined') {
    module.exports = LFASparql;
} else {
    this['LFASparql'] = LFASparql;
}

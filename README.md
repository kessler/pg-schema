pg-schema
---------

```	
	var connection = /* anything that exposes a .query('sql', params, function(err, results) {}) interface to a postgresql server */
	var schema = require('pg-schema')(connection, 'table' /*, 'schema', 'database' */)

```
pg-schema
---------

create a schema object by querying the metadata tables of postresql

this module is designed to work with [validate-schema](https://github.com/segmentio/validate-schema) in the same way [auto-schema](https://github.com/segmentio/auto-schema) does

```	
	var connection = /* anything that exposes a .query('sql', params, function(err, results) {}) interface to a postgresql server */
	var validate = require('validate-schema')
	var pgSchema = require('pg-schema')

	pgSchema(connection, 'mytable', function(err, schema) {		
		console.log(validate({ mytable: { a: 1 }}, schema))
	})
```

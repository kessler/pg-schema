pg-schema
---------

create a schema object by querying the metadata tables of postresql

this module is designed to work with [validate-schema](https://github.com/segmentio/validate-schema) in the same way [auto-schema](https://github.com/segmentio/auto-schema) does

```	
	var connection = /* anything that exposes a .query('sql', params, function(err, results) {}) interface to a postgresql server */

	var pgSchema = require('pg-schema')

	pgSchema(connection, 'mytable', function(err, schema) {

	})

	// or

	var sql = pgSchema.createQuery('mytable')

	// execute the query yourself and ...

	var schema = pgSchema.createSchema(rows)

	var validate = require('validate-schema')

	console.log(validate({ mytable: { a: 1 }}))
```
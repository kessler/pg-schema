pg-schema
---------

create a schema object by querying the metadata tables of postresql

this module is designed to work with [validate-schema](https://github.com/segmentio/validate-schema) in the same way [auto-schema](https://github.com/segmentio/auto-schema) does

```	
    var connection = /* anything that exposes a .query('sql', params, function(err, results) {}) interface to a postgresql server */
    var validate = require('validate-schema')
    var pgSchema = require('pg-schema')

    pgSchema(connection, 'mytable' /*,schemaName, databaseName*/, function(err, schema) {		
        console.log(validate({ mytable: { a: 1 }}, schema))
    })
```

#### Doing it yourself
instead of letting pgSchema run the query, you can run it yourself:
```
    var pgSchema = require('pg-schema')
    var validate = require('validate-schema')

    var query = pgSchema.createQuery('mytable' /*,schemaName, databaseName*/)

    // run the query and when you get the result set do:
    var schema = pgSchema.createSchemaObject(resultSet, 'mytable')
    validate({ mytable: { a: 1 }}, schema)
```
Please note that the schema object does not maintain information about database and database schema. Those are only used when query the meta data tables of the database
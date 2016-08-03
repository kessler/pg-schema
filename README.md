# DEPRECATED - Try [pg-metadata](https://github.com/ironsource/node-pg-metadata) instead

pg-schema
---------

create a schema object by querying the metadata tables of postresql


```javascript	
    var connection = /* anything that exposes a .query('sql', params, function(err, results) {}) interface to a postgresql server */
    var validate = require('validate-schema')
    var pgSchema = require('pg-schema')

    pgSchema(connection, /* tableName, schemaName, databaseName */, function(err, schema) {
        
    })
```

#### Doing it yourself
instead of letting pgSchema run the query, you can run it yourself:
```javascript
    var pgSchema = require('pg-schema')
    var validate = require('validate-schema')

    var query = pgSchema.createQuery(/* tableName, ,schemaName, databaseName */)

    // run the query and when you get the result set do:
    var schema = pgSchema.createMetadataObject(resultSet, 'mytable')
    validate({ mytable: { a: 1 }}, schema)
```
Please note that the schema object does not maintain information about database and database schema. Those are only used when query the meta data tables of the database

#### change schema output
sometimes you just want a table: { fields } result:
```javascript
    var connection = /* anything that exposes a .query('sql', params, function(err, results) {}) interface to a postgresql server */
    var validate = require('validate-schema')
    var pgSchema = require('pg-schema')
    
    pgSchema.simpleFields(true)

    pgSchema(connection, 'mytable' /*,schemaName, databaseName*/, function(err, schema) {
        console.log(schema) // { mytable: { a: 'varchar' }}
    })
```

Earlier versions of this module were designed to work with [validate-schema](https://github.com/segmentio/validate-schema) in the same way [auto-schema](https://github.com/segmentio/auto-schema) does, but the newer ones is not

TODO:
- Add an enhanced version with more details (this will not be compatible with pg-validate), maybe in a new module ?

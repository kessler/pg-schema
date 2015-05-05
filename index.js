var pgEscape = require('pg-escape')
var debug = require('debug')('pg-schema')

module.exports = pgSchema
module.exports.createQuery = createQuery
module.exports.createSchemaObject = createSchemaObject

var simpleFields = false
module.exports.simpleFields = function (val) {
	simpleFields = val
}

function pgSchema(connection, tableName, schemaName, databaseName, callback) {

	if (!connection)
		throw new Error('must provide a connection object')

	if (!tableName)
		throw new Error('must provide a table to describe')

	if (typeof(schemaName) === 'function') {
		callback = schemaName
		schemaName = undefined
		databaseName = undefined
	}

	if (typeof(databaseName) === 'function') {
		callback = databaseName
		databaseName = undefined
	}

	if (!callback)
		throw new Error('must provide a callback')

	var query = pgEscape(createQuery(tableName, schemaName, databaseName))

	debug(query)

	connection.query(query, function (err, result) {
		if (err) {
			callback(err)
		} else {			
			var schema = createSchemaObject(result.rows, tableName)
			debug(schema)
			callback(null, schema)	
		} 
	})
}

function createQuery(table, schema, database) {
	var sql = 'SELECT column_name, udt_name, data_type FROM information_schema.columns WHERE table_name=%L'

	if (schema && database) {
		sql += ' AND table_schema=%L AND table_catalog=%L'
		return pgEscape(sql, table, schema, database) 
	} 

	if (schema) {
		sql += ' AND table_schema=%L'
		return pgEscape(sql, table, schema)
	} 

	if (database) {
		sql += ' AND table_catalog=%L'
		return pgEscape(sql, table, database)
	} 

	return pgEscape(sql, table)	
}

function createSchemaObject(resultSet, table) {
	var schema = {}

	for (var i = 0; i < resultSet.length; i++) {
		var row = resultSet[i]
		var key
		
		if (simpleFields) {
			key = row.column_name
		} else {
			key = table + '.' + row.column_name
		}

		schema[key] = row.udt_name
	}

	return schema
}
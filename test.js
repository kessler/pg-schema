var pgSchema = require('./index')
var assert = require('assert')
var validate = require('validate-schema')

describe('pg-schema', function () {

	var tableName = 'atable'
	var schemaName = 'aschema'
	var databaseName = 'adatabase'	
	var resultSet = [
		{ column_name: 'a', udt_name: 'varchar'},
		{ column_name: 'b', udt_name: 'varchar'}
	]

	var expectedSchema = {}
	expectedSchema[tableName + '.a'] = 'varchar'
	expectedSchema[tableName + '.b'] = 'varchar'

	describe('generates an sql query that will be used to obtain column data of a table', function () {

		var expected = 'SELECT udt_name, data_type FROM information_schema.columns WHERE table_name=\'' + tableName + '\''

		it('using the table name', function () {
			var actual = pgSchema.createQuery(tableName)
			
			assert.strictEqual(actual, expected)
		})

		it('using the table name and schema', function () {
			var actual = pgSchema.createQuery(tableName, schemaName)
			
			var schemaExpected = expected + ' AND table_schema=\'' + schemaName + '\''

			assert.strictEqual(actual, schemaExpected)	
		})

		it('using the table name and database', function () {
			var actual = pgSchema.createQuery(tableName, null, databaseName)
			
			var databaseExpected = expected + ' AND table_catalog=\'' + databaseName + '\''

			assert.strictEqual(actual, databaseExpected)	
		})		
	})

	it('creates a schema object from a query result set', function () {

		var actual = pgSchema.createSchemaObject(resultSet, tableName)

		assert.deepEqual(actual, expectedSchema)
	})

	it('queries the database metadata tables and creates a schema object', function (done) {
		pgSchema(new MockConnection(resultSet), tableName, schemaName, databaseName, function(err, schema) {
			assert.deepEqual(schema, expectedSchema)
			done()
		})
	})

	it('plays well with validate-schema', function () {
		var schema = pgSchema.createSchemaObject(resultSet, tableName)
		
		var object = {}
		object[tableName] = {}
		object[tableName].a = 1
		object[tableName].b = 'b'

		var validation = validate(object, schema)
		assert.ok(validation)
		assert.strictEqual(validation['atable.a'], 'string expected')
		assert.ok(!('atable.b' in validation))
	})
})

function MockConnection(resultSet) {
	this.error = false
	this.resultSet = resultSet
}

MockConnection.prototype.query = function(q, cb) {
	var self = this
	setImmediate(function () {
		if (self.error)
			cb(new Error('lalala'))
		else 
			cb(null, { rows: self.resultSet })
	})
}
var pgSchema = require('./index')
var validate = require('validate-schema')
var should = require('should')

describe('pg-schema', function () {

	var sqlBase = 'SELECT ' + pgSchema.informationSchemaFields.join(',') + ' FROM information_schema.columns'

	var resultSet = [
		// two columns for table "atable" in schema "aschema" in db "adb"
		{ character_maximum_length: 244, column_name: 'a', udt_name: 'varchar', table_name: 'atable', table_schema: 'aschema', table_catalog: 'adb' },
		{ character_maximum_length: 244, column_name: 'b', udt_name: 'varchar', table_name: 'atable', table_schema: 'aschema', table_catalog: 'adb' },

		// one column for table "btable" in schema "aschama" in db "adb"
		{ character_maximum_length: 244, column_name: 'a', udt_name: 'varchar', table_name: 'btable', table_schema: 'aschema', table_catalog: 'adb' },

		// one column for table "btable" in schema "bschema" in db "bdb"
		{ character_maximum_length: 244, column_name: 'a', udt_name: 'varchar', table_name: 'btable', table_schema: 'bschema', table_catalog: 'bdb' }
	]

	describe('creates a query', function () {

		it('without restriction', function () {
			var result = pgSchema.createQuery()
			result.should.eql(sqlBase)
		})

		it('for a specific database', function () {
			var opts = { database: 'aDatabase' }
			var result = pgSchema.createQuery(opts)
			result.should.eql(result, sqlBase + ' AND table_catalog=' + opts.database)
		})

		it('for a specific table', function () {
			var opts = { table: 'aTable' }
			var result = pgSchema.createQuery(opts)
			result.should.eql(result, sqlBase + ' AND table_name=' + opts.table)
		})

		it('for a specific schema', function () {
			var opts = { schema: 'aSchema' }
			var result = pgSchema.createQuery(opts)
			result.should.eql(result, sqlBase + ' AND table_schema=' + opts.schema)
		})
	})

	describe('creates a metadata object from a query result set that contains all', function () {
		it('the databases', function () {
			var actual = pgSchema.createMetadataObject(resultSet)
			
			actual.should.have.property('adb')
			actual.should.have.property('bdb')
		})

		it('schemas in a database', function () {
			var actual = pgSchema.createMetadataObject(resultSet)
			
			actual.adb.should.have.property('aschema')
			actual.bdb.should.have.property('bschema')
		})

		it('tables in each schema', function () {
			var actual = pgSchema.createMetadataObject(resultSet)
			
			actual.adb.aschema.should.have.property('atable')
			actual.adb.aschema.should.have.property('btable')

			actual.bdb.bschema.should.have.property('btable')
		})

		it('columns in each table', function () {
			var actual = pgSchema.createMetadataObject(resultSet)
			
			actual.adb.aschema.atable.should.have.property('a')
			actual.adb.aschema.atable.should.have.property('b')
			actual.bdb.bschema.btable.should.have.property('a')
		})

		it('types of data and length for each columns', function () {
			var actual = pgSchema.createMetadataObject(resultSet)
			
			actual.adb.aschema.atable.a.should.have.property('type', 'varchar')
			actual.adb.aschema.atable.a.should.have.property('length', 244)
			
			actual.adb.aschema.atable.b.should.have.property('type', 'varchar')
			actual.adb.aschema.atable.b.should.have.property('length', 244)

			actual.bdb.bschema.btable.a.should.have.property('type', 'varchar')
			actual.bdb.bschema.btable.a.should.have.property('length', 244)
		})
	})

	it('queries the database metadata tables', function (done) {
		pgSchema(new MockConnection(resultSet), function(err, metadata) {
			metadata.should.have.property('adb')
			.which.have.property('aschema')
			.which.have.property('atable')
			.which.have.property('a')
			.which.have.property('type', 'varchar')
			
			done()
		})
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
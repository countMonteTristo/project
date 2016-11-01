var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var Report = require('../models/report').Report;
var should = chai.should();

chai.use(chaiHttp);

/********************** TEST ALL HTTP METHODS FOR REPORTS CRUD **********/

describe('Reports routes endpoints tests', function() {
	/** TEAR DOWN AND REPOPULATE WITH ONE RECORD ON EACH FUNCTION CALL db ******/
	Report.collection.drop();

	beforeEach(function(done){
		var newReport = new Report({
			longitude: '111111',
			latitude: '222222',
			timestamp: '333333333',
			altitude: '10',
			accuracy:	'11'
		});
		newReport.save(function(err) {
			done();
		});
	});

	afterEach(function(done){
		Report.collection.drop();
		done();
	});

	/*********************** GET ALL *********************************************/

	it('should list ALL Reports on /report GET', function(done) {
		chai.request(server)
			.get('/report')
			.end(function(err, res){
				res.should.have.status(200);
				res.should.be.json;
				res.body.should.be.array;
				res.body[0].should.have.property('_id');
				res.body[0].should.have.property('longitude');
				res.body[0].should.have.property('latitude');
				res.body[0].should.have.property('timestamp');
				res.body[0].should.have.property('altitude');
				res.body[0].should.have.property('accuracy');
				res.body[0].longitude.should.equal(111111);
				res.body[0].latitude.should.equal(222222);
				res.body[0].timestamp.should.equal(333333333);
				res.body[0].altitude.should.equal(10);
				res.body[0].accuracy.should.equal(11);
				done();

		});
	});

	/*********************** GET SPECIFIC *********************************************/

	it('should list a SINGLE Report on /report/:id GET', function(done) {
		var newReport = new Report({
			longitude: 	444444,
			latitude: 	555555,
			timestamp: 	666666,
			altitude: 15,
			accuracy: 	77

		});
		newReport.save(function(err, data) {
			chai.request(server)
				.get('/report/'+data.id)
				.end(function(err, res){
					res.should.have.status(200);
					res.should.be.json;
					res.body.should.be.a('object');
					res.body.should.have.property('_id');
					res.body.should.have.property('longitude');
					res.body.should.have.property('latitude');
					res.body.should.have.property('timestamp');
					res.body.should.have.property('altitude');
					res.body.should.have.property('accuracy');
					res.body.longitude.should.equal(444444);
					res.body.latitude.should.equal(555555);
					res.body.timestamp.should.equal(666666);
					res.body.altitude.should.equal(15);
					res.body.accuracy.should.equal(77);
					res.body._id.should.equal(data.id);
					done();
			});
		});
	});


	/*********************** POST SINGlE **********************************************/
	it('should add a SINGLE Report on /report POST', function(done) {
		chai.request(server)
			.post('/report')
			//.set('content-type', 'application/json')
			.send({'longitude': '123456', 'latitude':'654321', 'timestamp':'123456789',
						'altitude': '16', 'accuracy': '12'})
			.end(function(err, res){
				res.should.have.status(201);
				res.should.be.json;
				done();
		});
	});

	/**************************** update PUT SINGLE ***********************************/
	it('should update a SINGLE Report on /report/:id PUT', function(done) {
		chai.request(server)
			.get('/report')
			.end(function(err, res){
				chai.request(server)
					.put('/report/'+res.body[0]._id)
					.send({
						'longitude':'777777',
						'latitude': '888888',
						'timestamp': '999999',
						'altitude': '17',
						'accuracy': '11'
					})
					.end(function(error, response){
						response.should.have.status(200);
						response.should.be.json;
						response.body.should.be.a('object');
						response.body.should.have.property('ok');
						response.body.ok.should.equal(1);
						done();
				});
			});
		});

	it('should delete a SINGLE Report on /report/:id DELETE', function(done) {
		chai.request(server)
			.get('/report')
			.end(function(err, res){
				chai.request(server)
				.delete('/report/'+res.body[0]._id)
				.end(function(error, response){
				response.should.have.status(200);
				response.should.be.json;
				response.body.should.be.a('object');
				done();
			});
		});
	});
});

var server = require('./server');
var restify = require('restify');

var Report = require('./models/report').Report;

var checkMandatoryFields;

/******************************************************************
*
*		Routes conform to this syntax:
*
*		server.get(urlPattern, function(request, response) {
*			response.send(obj);
*		});
*
*******************************************************************/

/* test data
var testReportData = {
	longitude: 123456,
	latitude: 789123,
	timestamp: 9632145678
}
var testReport = new Report(testReportData);
testReport.save();
*/

//GET all reports: *******************************************************
server.get('/report', function(req, res, next) {
	Report.find({}, function (error, reports) {
		res.send(reports);
	});
});

//GET specific report by id: **************************************************
server.get('report/:id', function(req, res, next) {
	Report.findOne({_id: req.params.id }, function(error, report) {
		if(error) {
			return next(new restify.BadRequestError(JSON.stringify(error.errors)));
		}
		if(report) {
			res.send(report);
		} else {
			// NOT FOUND
			res.send(404);
		}
	});
});


//POST new report ***********************************************************************
server.post('/report', function( req, res, next) {
	console.log(req.params);

	checkMandatoryFields(req, res, next);

	var reportData = {
		longitude: req.params.longitude,
		latitude: req.params.latitude,
		timestamp: req.params.timestamp,
	}

	if(req.params.altitude) {
		reportData.altitude = req.params.altitude;
	}

	if(req.params.accuracy) {
		reportData.accuracy = req.params.accuracy;
	}

	var report = new Report(reportData);

	report.save(function(error, data) {
		if (error) {
			return next(new restify.BadRequestError(JSON.stringify(error.errors)));
		}
		else {
			// CREATED
			res.send(201, report);
		}
	})
});

//PUT to update existing user ******************************************************
server.put('/report/:id', function (req, res, next) {

	checkMandatoryFields(req, res, next);

	var reportData = {
		longitude: req.params.longitude,
		latitude: req.params.latitude,
		timestamp: req.params.timestamp
	}

	if(req.params.altitude) {
		reportData.altitude = req.params.altitude;
	}

	if(req.params.accuracy) {
		reportData.accuracy = req.params.accuracy;
	}

	var report = new Report(reportData);

	Report.update( {_id: req.params.id}, reportData, {multi:false},
		function(error, report) {
			if (error) {
				return next(new restify.BadRequestError(JSON.stringify(error.errors)));
			}
			else {
				// OK
				res.send(200, report);
			}
		}
	)
});

//DELETE to delete a specific report
server.del('/report/:id', function (req, res, next) {
	Report.remove({ _id: req.params.id }, function (error, report) {
		if (error) return next(new restify.BadRequestError(JSON.stringify(error.errors)))
		res.send(200, report);
	});
});

checkMandatoryFields = function(req, res, next) {
	//Check mandatory fields provided
	if(req.params.longitude === undefined) {
		return next(new restify.BadRequestError('longitude must be supplied'));
	}
	else if (req.params.latitude === undefined) {
		return next(new restify.BadRequestError('latitude must be supplied'));
	}
	else if (req.params.timestamp === undefined) {
		return next(new restify.BadRequestError('timestamp must be supplied'));
	}
};

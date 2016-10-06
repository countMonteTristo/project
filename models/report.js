var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ReportSchema = new Schema({
	longitude: {
		type: Number,
		required: true
	},
	latitude: {
		type: Number,
		required: true
	},
	timestamp: {
		type: Number,
		required: true
	},
	accuracy: {
		type: Number,
		required: false
	}
});

var Report = mongoose.model('Report', ReportSchema);

module.exports = { Report: Report };
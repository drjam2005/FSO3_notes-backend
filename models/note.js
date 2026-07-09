const mongoose = require('mongoose');

const args = process.argv;

if (args.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = args[2];
const url = process.env.MONGODB_URI

mongoose.set(`strictQuery`, false);

mongoose.connect(url, { family: 4 })
	.then(result => {
		console.log('connected to MongoDB');
	})
	.catch(error => {
		console.log('an error occured connecting to MongoDB:', error.message);
	});

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean
});

noteSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	}
});

module.exports = mongoose.model('Note', noteSchema);

const mongoose = require('mongoose');

const args = process.argv;

if (args.length < 3) {
	console.log('give password as argument');
	process.exit(1);
}

const password = args[2];
const url = `mongodb+srv://drjam:${password}@cluster0.e2wn6lj.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set(`strictQuery`, false);
mongoose.connect(url, { family: 4 });

const noteSchema = new mongoose.Schema({
	content: String,
	important: Boolean
});

const Note = mongoose.model('Note', noteSchema);

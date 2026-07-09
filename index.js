require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Note = require('./models/note.js');
const app = express()

app.use(express.json())
app.use(express.static('dist'));
morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :status :body'))

app.get('/', (request, response) => {
	response.send(' <h1>Hello, World!</h1> ');
})

app.get('/api/notes', (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes);
	})
})

app.put('/api/notes/:id', (request, response) => {
	const id = request.params.id;
	const body = request.body;
	console.log(id, body);
	notes = notes.map(n => n.id === id ? body : n);
	return response.status(200).json(
		body
	)
})

app.get('/api/notes/:id', (request, response) => {
	const id = request.params.id;
	const note = notes.find(note => note.id === id);

	if(note) {
		response.json(note);
	} else {
		response.status(404).end();
	}
})

app.delete('/api/notes/:id', (request, response) => {
	notes = notes.filter(note => note.id !== request.params.id)
	response.status(204).end()
})

const generateID = () => {
	const maxID = notes.length > 0 
		? Math.max(...notes.map(n => Number(n.id))) 
		: 0

	return String(maxID+1);
}

app.post('/api/notes', (request, response) => {
	const body = request.body;

	if(!body.content){
		return response.status(400).json({
			error: 'content missing!'
		})
	}

	const note = {
		content: body.content,
		important: body.important || false,
		id: generateID(),
	};

	notes = notes.concat(note);
	response.json(note);
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
});

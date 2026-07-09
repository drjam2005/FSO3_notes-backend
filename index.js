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

app.put('/api/notes/:id', (request, response, next) => {
	const { content, important } = request.body;
	const id = request.params.id;
	Note.findById(id)
		.then(note => {
			if(!note)
				return response.status(404).end();

			note.content = content;
			note.important = important;

			return note.save().then((updatedNote) => {
				response.json(updatedNote);
			});

		})
		.catch(error => next(error));
})

app.get('/api/notes/:id', (request, response, next) => {
	const id = request.params.id;
	Note.findById(id)
		.then(note => {
			if(note){
				response.json(note).exit();
			}else{
				response.status(404).send({error: `couldn't find note with id ${id}`});
			}
		})
		.catch(error => next(error));
})

app.delete('/api/notes/:id', (request, response, next) => {
	Note.findByIdAndDelete(id)
		.then(() => {
			response.status(204).end()
		})
		.catch(error => next(error));
})

app.post('/api/notes', (request, response) => {
	const body = request.body;

	if(!body.content){
		return response.status(400).send({
			error: 'content missing!'
		})
	}

	const note = new Note({
		content: body.content,
		important: body.important || false,
	});

	note.save().then(res => {
		response.json(note);
	});
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({
		error: 'unknown endpoint'
	});
}

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if(error.name === 'CastError') {
		return response.status(400).send({
			error: 'malformed id'
		});
	}

	next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);


const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
});

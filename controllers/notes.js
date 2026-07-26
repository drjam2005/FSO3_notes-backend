const notesRouter = require('express').Router()
const Note = require('../models/note.js')

notesRouter.get('/', (request, response) => {
	Note.find({}).then(notes => {
		response.json(notes)
	})
})

notesRouter.get('/:id', async (request, response) => {
	const note = await Note.findById(request.params.id);
	if(note)
		response.status(200).json(note)
	else
		response.status(404).end()
})

notesRouter.post('/', async (request, response, next) => {
	const body = request.body;

	const note = new Note({
		content: body.content,
		important: body.important || false,
	})

	const savedNote = await note.save()
	response.status(201).json(savedNote)
})

notesRouter.delete('/:id', async (request, response, next) => {
	await Note.findByIdAndDelete(request.params.id)
	response.status(204).end();
});

notesRouter.put('/:id', (reqeuest, response, next) => {
	const { content, important } = request.body;
	Note.findById(request.params.id)
		.then(note => {
			if(!note) {
				response.status(404).end();
			}

			note.content = content;
			note.important = important;

			return note.save().then((updatedNote) => {
				response.status(200).json(updatedNote);
			});
		}).catch(
			error => next(error)
		);
});

module.exports = notesRouter

const express = require('express')
const path = require('path')
const logger = require('../../config/winston')
const xss = require('xss')
const NotesService = require('./notesService')

const NotesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    title: xss(note.title),
    content: xss(note.content),
    modified: note.modified,
    folder: note.folder
})

NotesRouter
    .route('/')
    .get((req,res,next) => {
        NotesService.getNotes(req.app.get('db'))
            .then(notes => {
                res.json(notes.map(serializeNote))
            })
            .catch(next)
    })
    .post(jsonParser, (req,res,next) => {
        const { title, content = "", folder } = req.body
        const newNote = { title, content, folder }

        if (!title) {
            logger.error('Title not entered')
            return res
                .status(400)
                .json({error:{message:'Title required'}})
        }

        NotesService.createNote(req.app.get('db'), newNote)
            .then(note =>{
                logger.info(`Note named ${note.title} with id ${note.id}`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(serializeNote(note))
            })
            .catch(next)
    })

NotesRouter
    .route('/:id')
    .all((req, res, next) => {
        NotesService.getById(
        req.app.get('db'),
        req.params.id
        )
        .then(note => {
            if (!note) {
            return res.status(404).json({
                error: { message: `Note doesn't exist` }
            })
            }
            res.note = note
            next()
        })
        .catch(next)
    })
    .delete((req,res,next) => {
        NotesService.deleteNote(req.app.get('db'), req.params.id)
            .then(rowsaffected => {
                return res
                    .status(204).end()
            })
            .catch(next)
    })

module.exports = NotesRouter
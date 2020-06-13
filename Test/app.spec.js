const app = require('../src/app');
const knex = require('knex')
const makeFolders = require('./Fixtures/makeFolders');
const supertest = require('supertest');
const makeNotes = require('./Fixtures/makeNotes');
const { expect } = require('chai');

describe('testing endpoint /api/folders', () => {
    let db
    let testFolders = makeFolders()
    let testNotes = makeNotes()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL_TEST
        })
        app.set('db', db)
    })

    
    before('clean the table', () => db.raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE'))

    after(()=>db.destroy())

        context('without folders',()=>{
            it('GET an empty array', () => {
            return supertest(app)
                .get('/api/folders/')
                .expect(200, []) 
            })
            it('POST a new folder with id',() => {
                const newFolder = {"folder_name": "New Folder"}
                return supertest(app)
                    .post('/api/folders/')
                    .send(newFolder)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id')
                        expect(res.body.folder_name).to.eql(newFolder.folder_name)
                    })
            })
            it('doesnt POST a folder and gives a 400', () => {
                const newFolder = {"folder_name": ""}
                return supertest(app)
                    .post('/api/folders/')
                    .send(newFolder)
                    .expect(400, {error:{message:'Folder name required'}})
            })
        })
        context('with folders', () => {
            before(()=>{
                return db
                    .into('folders')
                    .insert(testFolders)
            })
                it('GETs all folders', () => {
                    return supertest(app)
                        .get('/api/folders/')
                        .expect(200, testFolders)
                })
        })
})

describe('testing endpoint /api/notes', () => {
    let db
    let testFolders = makeFolders()
    let testNotes = makeNotes()

    before(() => {
        db = knex({
            client: 'pg',
            connection: process.env.DATABASE_URL_TEST
        })
        app.set('db', db)
    })

    before('clean the table', () => db.raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE folders, notes RESTART IDENTITY CASCADE'))

    after(()=>db.destroy())

        context('without notes',()=>{
            it('GET an empty array', () => {
            return supertest(app)
                .get('/api/notes/')
                .expect(200, []) 
            })
            
        })
        context('with notes', () => {
            beforeEach(()=>{
                return db
                    .into('folders')
                    .insert(testFolders)
                    .then(() => {
                        return db
                        .into('notes')
                        .insert(testNotes)
                    })
            })
                it('GETs all notes', () => {
                    return supertest(app)
                        .get('/api/notes/')
                        .expect(200, testNotes)
                })
                it('POST a new note with id and modified date',() => {
                    const newNote = {
                    "title": "New Note",
                    "folder": "b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1",
                    "content": "New content"
                    }
                    return supertest(app)
                        .post('/api/notes/')
                        .send(newNote)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('id')
                            expect(res.body).to.have.property('modified')
                            expect(res.body.title).to.eql(newNote.title)
                            expect(res.body.content).to.eql(newNote.content)
                            expect(res.body.folder).to.eql(newNote.folder)
                        })
                })
                it('doesnt POST a note and gives a 400', () => {
                    const newNote = {
                        "folder": "b07161a6-ffaf-11e8-8eb2-f2801f1b9fd1",
                        "content": "New content"}
                    return supertest(app)
                        .post('/api/notes/')
                        .send(newNote)
                        .expect(400, {error:{message:'Title required'}})
                })
                it('DELETE a note when given id and sends 204', () => {
                    const noteId = 'cbc787a0-ffaf-11e8-8eb2-f2801f1b9fd1'
                    const expectedNotes = testNotes.filter(note => note.id !== noteId)
                    return supertest(app)
                        .delete(`/api/notes/${noteId}`)
                        .expect(204)
                        .then(() => {
                            return supertest(app)
                                .get('/api/notes/')
                                .expect(200, expectedNotes)
                        })
                })
        })
})
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const FoldersRouter = require('./folders/foldersRouter');
const NotesRouter = require('./notes/notesRouter')

const app = express();

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'dev';

app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.use('/api/folders', FoldersRouter);
app.use('/api/notes', NotesRouter);

app.use((error, req, res, next) => {
    let response
    if(NODE_ENV === "production") {
        response =  {error: {message: 'server error'}};
    } else {
        console.error(error);
        response = {message: error.message, error};
    }
    res.status(500).json(response);
})

module.exports = app;
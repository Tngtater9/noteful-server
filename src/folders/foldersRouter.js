const express = require('express')
const path = require('path')
const logger = require('../../config/winston')
const xss = require('xss')
const FoldersService = require('./foldersService')

const FoldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    folder_name: xss(folder.folder_name)
})

FoldersRouter
    .route('/')
    .get((req, res, next) => {
        FoldersService.getFolders(req.app.get('db'))
            .then(folders => {
                res.json(folders.map(serializeFolder))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { folder_name } = req.body
        const newFolder = { folder_name }

        if (!newFolder || newFolder.folder_name === "") {
            logger.error('Folder name not entered')
            return res
                .status(400)
                .json({error:{message:'Folder name required'}})
        }
        
        FoldersService.createFolder(req.app.get('db'), newFolder)
            .then(folder => {
                logger.info(`Folder named ${folder.folder_name} with id ${folder.id}`)
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeFolder(folder))
            })
            .catch(next)
    })

module.exports = FoldersRouter
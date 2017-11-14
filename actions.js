const path = require('path')
const fs = require('fs')
const find = require('find')
const { prefixOf, similarFileNames } = require('./files-op')

function getDirContent(dir, predicate) {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {

            if (err) {
                reject(err)
            }

            let retFiles = [];

            for (let file of files) {
                let filePath = path.join(dir, file)
                if (predicate(fs.lstatSync(filePath))) {
                    retFiles.push(filePath);
                }
            }

            resolve(retFiles)
        })
    })
}

function getFiles(dir) {
    return new Promise((resolve, reject) => {
        getDirContent(dir, fileStats => fileStats.isFile())
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function getSubfolders(dir) {
    return new Promise((resolve, reject) => {
        getDirContent(dir, fileStats => !fileStats.isFile())
            .then(result => resolve(result))
            .catch(err => reject(err))
    })
}

function filterFiles(files, filter) {
    return new Promise((resolve, reject) => {
        let syntaxError = {
            filname: '',
            errors: 0xfff
        };
        let prefixes = [];
        const MAX_ERRORS = 2;

        for (let f of files) {
            if (prefixOf(filter, f)) {
                prefixes.push(f);
            }

            let errors = similarFileNames(f, filter);
            if (errors <= 1) {
                reject(new Error(`Did you mean '${f}'?`))
            } else {
                if (errors <= syntaxError.errors) {
                    syntaxError.filname = f;
                    syntaxError.errors = errors;
                }
            }
        }

        if (syntaxError.errors <= MAX_ERRORS) {
            reject(new Error(`Did you mean '${syntaxError.filname}'?`))
        } else if (prefixes.length > 0) {
            let message = 'Similar files found:';
            for (let f of prefixes) {
                message += `\n${f}`;
            }

            reject(new Error(message))

        } else {
            reject(new Error('No such file!'))
        }
    })
}

function findFile(file, dir = __dirname) {
    return new Promise((resolve, reject) => {
        getFiles(dir)
            .then(files => {
                filterFiles(files, file)
                    .then(retFiles => resolve(retFiles))
                    .catch(err => reject(err))
            })
            .catch(err => reject(err))
    })
}

function findInSubfolders(file, dir = __dirname) {

    return new Promise((resolve, reject) => {
        find.file(dir, files => {
            filterFiles(files, file)
                .then(retFiles => resolve(retFiles))
                .catch(err => reject(err))
        })
    })
}

module.exports = {
    findFile,
    findInSubfolders
}
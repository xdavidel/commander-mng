#!/usr/bin/env node

const program = require('commander')
const { prompt } = require('inquirer')

const { findFile, findInSubfolders } = require('./actions')


const findSubfoldersQuestions = [
    {
        type: 'confirm',
        name: 'subfolders',
        message: 'The file was not found - Search Subfolders'
    }
]

program
    .version('1.0.0')
    .description('Admin Cli')

program
    .command('find <file>')
    .alias('f')
    .description('Find a file in current directory')
    .action(file => {
        findFile(file)
            .then(fileInfo => console.info(fileInfo))
            .catch(err => {
                console.error(err.message)
                prompt(findSubfoldersQuestions).then(answers => {
                    if (answers.subfolders) {

                        findInSubfolders(file)
                            .then(res => console.info(res))
                            .catch(err => console.error(err.message))
                    }
                })
            })
    })

// program
//     .command('find')
//     .alias('f')
//     .description('Find a file in current directory')
//     .action(() => {
//         prompt(findQuestions).then(answers => {
//             findFile(answers.file)
//         })
//     })


program.parse(process.argv)
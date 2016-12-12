'use strict'

const logger = require('./logger');
const {startBot} = require('./bot');
const {connectToDatabase} = require('./db');

connectToDatabase()
  .then(() => {
    logger.info(`Database connection successfully established`);
    startBot();
  }, (error) => { 
    logger.error(`Unable to connect to the database:  ${error}`);
  })


/*
const handleDocument = (contact, doc) => {
  if (!_.isUndefined(doc.file_id)) {
    log(`New print request from ${contact.first_name} : ${doc.file_name}`)
    bot
      .downloadFile(doc.file_id, __dirname)
      .then((file_name) => {
        log(`[xxxxxxx] Printing... ${file_name} `)
        spawn('lpr', [file_name])
      })
  }
  else {
    log(`Document does not have a file_id`)
  }
}
*/
'use strict'

const path = require('path');
const _ = require('lodash')
const logger = require('./logger');
const Sequelize = require('sequelize');
const { contact } = require('./models/contact');

const db = new Sequelize('db', ''/*username*/, ''/*password*/, {
  logging: false,
  dialect: 'sqlite',
  storage: path.join(__dirname, `db.sqlite`)
})

const Contact = db.define('Contact', contact);

function userIsAuthorized (user_id) {
  return Promise.all([
    Contact.findOne({ where: { user_id } }),
    Contact.count()
  ]).then((values) => {
    return !_.isNull(values[0]) || values[1] == 0;
  })
}

function addContact (contact) {
  return Contact
    .build(contact)
    .save()
    .then((contact) => {
      logger.info(`Successfully added ${contact.first_name}`);
      return { ok: true };
    })
    .catch((error) => {
      logger.error(`Error inserting contact to database! ${error}`);
      return { ok: false };
    })
}

module.exports.connectToDatabase = () => { 
  return db.sync({ force: false }); 
}; 

module.exports.addContact = addContact;
module.exports.userIsAuthorized = userIsAuthorized; 
'use strict'

const Sequelize = require('sequelize');

const contact = {
  user_id: { 
    type: Sequelize.INTEGER.UNSIGNED, 
    primaryKey: true,
    allowNull: false
  },
  phone_number: { 
    type: Sequelize.STRING, 
    allowNull: false
  },  
  first_name: { 
    type: Sequelize.STRING, 
    allowNull: false
  },
  last_name: { 
    type: Sequelize.STRING, 
    allowNull: true
  }
};

module.exports.contact = contact;

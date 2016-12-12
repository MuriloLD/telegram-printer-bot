'use strict'

const _ = require('lodash');
const logger = require('./logger');
const TelegramBot = require('node-telegram-bot-api');
const {addContact, userIsAuthorized} = require('./db');

const token = process.env['TELEGRAM_API_TOKEN'] || '288679368:AAH_8Ux0xFtbo1Vus-ZM24MtuaAA1k1kTQA';
const bot = new TelegramBot(token, {polling: true});

const menus = {
  selection: [
    [ 
      { text: 'Print', callback_data: 'print' } 
    ],
    [ 
      { text: 'Cancel', callback_data: 'cancel' }, 
      { text: 'Options', callback_data: 'options' } 
    ]
  ],
  options: [
    [ 
      { text: 'Pages', callback_data: 'pages' }, 
      { text: 'Copies', callback_data: 'copies' } 
    ],
    [ 
      { text: 'Two-sided', callback_data: 'two-sided' }, 
      { text: 'Orientation', callback_data: 'orientation' } 
    ],
    [
      { text: 'Go Back', callback_data: 'back' }
    ] 
  ],
};

const callbacks = {
  options(msg) {
    editMessageText(msg, 'These are the options...', menus.options)
  }
};

function editMessageText (msg, text, menu) {
  bot.editMessageText(text, {
    chat_id: msg.message.chat.id,
    message_id: msg.message.message_id,
    reply_markup: {
      inline_keyboard: menu
    }
  });
};

function sendInlineKeyboard (msg, text, menu) {
  bot.sendMessage(msg.from.id, text, {
    reply_markup: {
      inline_keyboard: menu
    }
  });
};

function handleContact ({ from: { id }, contact }) {
  addContact(contact).then(({ ok }) => {
    if (ok) {
      bot.sendMessage(id, `Successfully added ${contact.first_name}`);
    }
    else {
      bot.sendMessage(id, `Failed to add ${contact.first_name}`);
    }
  });
}

function handleDocument (msg) {
  sendInlineKeyboard(msg, `What to do with ${msg.document.file_name}`, menus.selection);
}

function startBot () {
  logger.info(`Bot listening...`)
  
  bot.on('callback_query', (msg) => {
    console.log(msg);
    logger.info(`Callback query from ${msg.from.id} with ${msg.data}`);
    
    if (_.has(callbacks, msg.data)) {
      callbacks[msg.data](msg);
    } 
    else {
      editMessageText(msg, 'Not implemented yet, sorry :[', []);
    }
  })

  bot.on('message', (msg) => {
    console.log(msg);
    logger.info(`Message from ${msg.chat.id} with ${msg.text}`);

    userIsAuthorized(msg.chat.id).then((isAuthorized) => {
      if (isAuthorized) {
        if (_.has(msg, 'contact')) handleContact(msg);
        else if (_.has(msg, 'document')) handleDocument(msg);
      }
      else {
        bot.sendMessage(msg.chat.id, 'Go away! I don\'t trust you');
      }
    });
  });
}

module.exports.startBot = startBot;


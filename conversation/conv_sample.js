'use strict';
/*eslint-env es6*/

//This is part of node.js
var readline = require('readline');
//NOTE: You need to: npm install watson-developer-cloud
var watson = require('watson-developer-cloud');
//NOTE: You need to: npm install colors -g
var colors = require('colors/safe');
var c = require('color');

// set theme
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});
// set single property
var error = colors.red;
var debug = colors.debug;
var input = colors.input;
/*
 * Variables to connect to Watson service
 */
//NOTE: FILL THOSE WITH YOUR VALUES
var wid = 'WORKSPACE ID';
var uid = 'USER ID';
var pwid = 'PASSWORD';

/**
 * Instantiate the Watson Conversation Service
 */
var conversation = new watson.ConversationV1({
  username: process.env.CONVERSATION_USERNAME || uid,
  password: process.env.CONVERSATION_PASSWORD || pwid,
  version_date: watson.ConversationV1.VERSION_DATE_2016_09_20
});

//Main
var rl = initializeReadline();
startConv(rl);

//==================
// functions section
//===================

function startConv(rl) {
  var answer = '';

  rl.question(colors.prompt('How can I help you? '), (answer) => {
    console.log(debug('User Input : ' + answer));

    if (answer === 'quit' || answer === 'exit') {
      closeReader(rl);
    }
    else {
      var payload = preparePayLoad(answer);
      sendPayloadToConv(payload, function () {
        startConv(rl);
      });
    }
  });
}

function closeReader(rl) {
  rl.close();
}

function initializeReadline() {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return rl;
}
/**
 * Payload for the Watson Conversation Service
 * <workspace-id> and user input text required.
 */
function preparePayLoad(txt) {
  var payload = {
    workspace_id: process.env.WORKSPACE_ID || wid,
    input: {
      text: txt
    }
  };
  return payload;
}

function sendPayloadToConv(payload, onDone) {
  conversation.message(payload, function (err, data) {
    if (err) {
      // APPLICATION-SPECIFIC CODE TO PROCESS THE ERROR
      // FROM CONVERSATION SERVICE
      console.error(error(JSON.stringify(err, null, 2)));
      if (onDone)
        onDone.call();
    } else {
      // APPLICATION-SPECIFIC CODE TO PROCESS THE DATA
      // FROM CONVERSATION SERVICE
      console.log(debug(JSON.stringify(data, null, 2)));
      if (onDone)
        onDone.call();
    }
  });
}

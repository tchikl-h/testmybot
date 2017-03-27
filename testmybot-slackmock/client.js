'use strict'

const testmybot = require('testmybot');
const io = require('socket.io-client');
const readline = require('readline');

/*
docker network create -d bridge testmybot_network

docker build -t testmybot -f ./node_modules/testmybot/Dockerfile.testmybot .
docker run -it -e NODE_TLS_REJECT_UNAUTHORIZED=0 --name testmybot --network testmybot_network --network-alias testmybot testmybot
docker rm -f testmybot

docker build -t testmybot-slackmock -f ./node_modules/testmybot-slackmock/Dock
docker run -it -p 46199:46199 -e TESTMYBOT_SLACK_PUBLISHPORT=46199 -e TESTMYBOT_SLACK_OAUTHURL=http://testmybot:3000/oauth -e TESTMYBOT_SLACK_EVENTURL= -e TESTMYBOT_SLACK_EVENTPORT=3000 -e TESTMYBOT_SLACK_EVENTPATH=slack/receive -e TESTMYBOT_SLACK_EVENTHOST=testmybot -e TESTMYBOT_SLACK_EVENTPROTOCOL=http -e TESTMYBOT_SLACK_DEMOMODE=false --name testmybot-slackmock --network testmybot_network --network-alias slack.com testmybot-slackmock
docker rm -f testmybot-slackmock
*/

var testendpoint = 'http://127.0.0.1:46199';
	
var socket = io.connect(testendpoint);
socket.on('botsays', function (data) {
  if (data) {
    if (data.messageText) {
      console.log('BOT SAYS: ' + data.messageText);
    } else {
      console.log('BOT SAYS: ');
      console.log(JSON.stringify(data.message, null, 2));
    }
  }
});

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', function(line){
  if (!line) return;
  socket.emit('bothears', 'me', line);
});

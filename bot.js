var Discord = require('discord.io');
var logger = require('winston');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var auth = require('./auth.json');

var joke;

// Used to request the best of puns
var httpRequest = new XMLHttpRequest();

// custom user-agent header
var userAgentHeader = "User-Agent: farenteria (https://github.com/farenteria/Discord-Pun-Bot)";

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

// message will be the command user types in
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            // we will be using icanhazdadjoke for our puns
            case 'pun':
                makeRequest();
                bot.sendMessage({
                    to: channelID,
                    message: joke
                });
            break;
         }
     }
});

function makeRequest(){
    if(!httpRequest){
        logger.warning("httpRequest instance failed");
        return false;
    }

    httpRequest.onreadystatechange = retrieveContents;
    httpRequest.open("GET", "https://icanhazdadjoke.com/slack");
    httpRequest.responseType = "json";
    httpRequest.send();
}

// this will be called once we receive the response
function retrieveContents(){
    // 4 == DONE, but we're not using a browser XMLHttp, so we must use 4 to compare
    if(httpRequest.readyState === 4){
        if(httpRequest.status === 200){
           var parsed = JSON.parse(httpRequest.responseText);
           joke = parsed.attachments[0].text;
        }else{
            logger.warning("There was a problem with the request");
        }
    }
}

function printJoke(){

}
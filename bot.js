var Discord = require('discord.io');
var logger = require('winston');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//var auth = require('./auth.json');

var joke;

// where we will store all of our initial jokes
var jokes = [
    "A man was caught stealing in a supermarket today while balanced on the shoulders of a couple of vampires. He was charged with shoplifting on two counts.",
    "Why can't a bicycle stand on its own? It's two-tired.",
    "A police officer caught two kids playing with a firework and a car battery. He charged one and let the other one off.",
    "Did you hear the one about the guy with the broken hearing aid? Neither did he.",
    "I'm practicing for a bug-eating contest and I've got butterflies in my stomach.",
    "Why did the barber win the race? He took a short cut.",
    "Our wedding was so beautiful, even the cake was in tiers.",
    "Milk is also the fastest liquid on earth – its pasteurized before you even see it",
    "Why did the Clydesdale give the pony a glass of water? Because he was a little horse!",
    "Mountains aren't just funny, they are hill areas",
    "To the guy who invented zero... thanks for nothing.",
    "What is this movie about? It is about 2 hours long.",
    "What do you call a cow with two legs? Lean beef.",
];

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
   //token: auth.token,
   token: process.env.TOKEN,
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
            // get a random joke from our array of BEST JOKES
            case 'pun':
                joke = jokes[Math.floor(Math.random()*jokes.length)];

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
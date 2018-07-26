const SlackBot = require('slackbots');
const axios = require('axios');
const GmapToken = 'AIzaSyCGOaQfCz1BFIojiVFycS9PAzXpxnRw60w';
const bot = new SlackBot({
  token: 'xoxb-402998041105-403406389540-KwkJrdC2UOaOTNhGGPLUd4MW',
  name: 'megabot'
});

// Start Handler
bot.on('start', () => {
  const params = {
    icon_emoji: ':smiley:'
  };
  bot.postMessageToChannel(
    'general',
    'Getting ready to leave??',
    params
  );
  runHelp();
})

//Error Handler
bot.on('error', (err) => console.log(err));

bot.on('message', (data) => {
  if(data.type !== 'message') {
    return;
  }

  console.log(data);
  handleMessage(data.text);
});

//Response to Data
function handleMessage(message) {
  if(message.includes(' direction')) {
    getDirection(message);
  }else if(message.includes(' help')) {
    runHelp();
  }
}

//Tell a Chuck Norris Joke
function getDirection(message) {
  console.log(message)
  var nDirection = message.indexOf("direction");
  var nTo = message.indexOf("to");
  var origin = message.substring(nDirection + 10, nTo - 1)
  var destination = message.substring(nTo + 3)
  console.log(nDirection)
  console.log(nTo)
  console.log(origin)
  console.log(destination)
  origin_short = origin.split(/ /i).join('');
  origin_short = origin_short.split(/,/i).join('');
  destination_short = destination.split(/ /i).join('');
  destination_short = destination_short.split(/,/i).join('');
  console.log(origin)
  console.log(destination)
  api_url = "https://maps.googleapis.com/maps/api/directions/json?origin="+origin_short+"&destination="+destination_short+"&key="+GmapToken
  console.log(api_url)
  axios.get(api_url)
    .then(res => {
      const origin_status = res.data.geocoded_waypoints[0].geocoder_status;
      const des_status = res.data.geocoded_waypoints[1].geocoder_status;
      const distance = res.data.routes[0].legs[0].distance.text;
      const duration = res.data.routes[0].legs[0].duration.text;
      console.log(distance)
      console.log(duration)
      const params = {
        icon_emoji: ':car:'
      };
      if (origin_status != "OK") {
        bot.postMessageToChannel(
          'general',
          `Direction Bot: Please reenter origin!`,
          params
        );
      }else if (des_status != "OK") {
        bot.postMessageToChannel(
          'general',
          `Direction Bot: Please reenter destination!`,
          params
        );
      }else {
        bot.postMessageToChannel(
          'general',
          `Distance Between ${origin} and ${destination} is ${distance}!\nEstimated Time from ${origin} to ${destination} is ${duration}!`,
          params
        );
      }

    })
}

//Show Help Text
function runHelp() {
  const params = {
    icon_emoji: ':question:'
  };

  bot.postMessageToChannel(
    'general',
    `Type '@megabot orign to destination' to get distance and time estimation!`,
    params
  );
}

// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html

// TODO: To trade with real trader enable Trader plugin require('trader')
var moment = require('moment');
var log = require('../core/log');
const util = require(__dirname + '/../core/util');
//this.exchange = new new BinanceExchange({api_key,secret,username});
// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
  this.counter = 0;
}

// What happens on every new candle?
strat.update = function(candle) {
  console.log(JSON.stringify(candle));
  if(candle.close == 0.050068){
    this.advice("long");
  }
  if(candle.close == 0.090286)
    this.advice("short")

//  console.log(JSON.stringify(candle));

}

// For debugging purposes.
strat.log = function() {
  //log.debug('Debug message ' + this.counter++);
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
}

module.exports = strat;

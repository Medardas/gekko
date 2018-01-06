// https://gekko.wizb.it/docs/strategies/creating_a_strategy.html
const key = '8wCVURRxSWcNLOgXji2OR028D9jhF1XzdNpmErHxbnAeKNFCBZAmPumTrnsMSbCl';
const secret = 'YlaKfXd0xRlUysdM5cUuAASZJSieG1ysnXca6dBvTM3fOQHUEdJyA8DeqfO4jHzh';
const username = 'medardas.mongirdas@gmail.com';

var log = require('../core/log');
const BinanceExchange = require('../exchanges/binance');
//this.exchange = new new BinanceExchange({api_key,secret,username});
// Let's create our own strat
var strat = {};

// Prepare everything our method needs
strat.init = function() {
  this.counter = 0;
}

// What happens on every new candle?
strat.update = function(candle) {

}

// For debugging purposes.
strat.log = function() {
  log.debug('Debug message ' + this.counter++);
}

// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function() {
}

module.exports = strat;

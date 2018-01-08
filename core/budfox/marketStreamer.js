//
// The Streamer is responsible for streaming new
// market data at the exchange. It will emit
// the following events:
//
// - `trades batch` - all new trades.
// - `trade` - the most recent trade after every fetch

var _ = require('lodash');
var moment = require('moment');
var utc = moment.utc;
var util = require(__dirname + '/../util');

var config = util.getConfig();
var log = require(util.dirs().core + 'log');
var exchangeChecker = require(util.dirs().core + 'exchangeChecker');

var TradeBatcher = require(util.dirs().budfox + 'tradeBatcher');

var Streamer = function(config) {
  if(!_.isObject(config))
    throw 'TradeStreamer expects a config';

  var provider = config.watch.exchange.toLowerCase();
  var DataProvider = require(util.dirs().gekko + 'exchanges/' + provider);
  _.bindAll(this);

  // Create a public dataProvider object which can retrieve live
  // trade information from an exchange.
  this.watcher = new DataProvider(config.watch);

  this.exchange = exchangeChecker.settings(config.watch);

  var requiredHistory = config.tradingAdvisor.candleSize * config.tradingAdvisor.historySize;

  // If the trading adviser is enabled we might need a very specific fetch since
  // to line up [local db, trading method, and fetching]
  if(config.tradingAdvisor.enabled && config.tradingAdvisor.firstFetchSince) {
    this.firstSince = config.tradingAdvisor.firstFetchSince;

    if(this.exchange.providesHistory === 'date') {
      this.firstSince = moment.unix(this.firstSince).utc();
    }
  }

  this.batcher = new TradeBatcher(this.exchange.tid);

  this.pair = [
    config.watch.asset,
    config.watch.currency
  ].join('/');

  log.info('Starting to watch the market:',
    this.exchange.name,
    this.pair
  );

  // if the exchange returns an error
  // we will keep on retrying until next
  // scheduled fetch.
  this.tries = 0;
  this.limit = 20; // [TODO]

  this.firstFetch = true;

  this.batcher.on('new batch', this.relayTrades);
}

util.makeEventEmitter(Streamer);

Streamer.prototype._stream = function() {
  if(++this.tries >= this.limit) //toDO: backoff logic in budfox.js or marketDataProvider.js ?
    return;

  this.watcher.streamTrades(this.processTrades);
}

//toDO: call once and retry with backoff on failure
Streamer.prototype.stream = function() {
  this.tries = 0;
  log.debug('Requested', this.pair, 'trade data stream from', this.exchange.name, '...');
  this._stream();
}

Streamer.prototype.processTrades = function(trades) {
  console.log(JSON.stringify(trades));
  //toDO: Check for error
  //this.batcher.write(trades);
}

Streamer.prototype.relayTrades = function(batch) {
  this.emit('trades batch', batch);
}

Streamer.prototype.getType = function(){
  return "streamer";
}

module.exports = Streamer;

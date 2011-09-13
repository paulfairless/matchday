var sys = require('sys');
var TwitterNode = require('twitter-node').TwitterNode;
var nano = require('nano')('http://localhost:5984');
var simpledb = require('simpledb');

var twit = new TwitterNode({
  user: 'paulfairless',
  password: '977022',
  track: ["nufc", 'qpr']
});
twit.headers['User-Agent'] = 'node.js-thingy';

twit.addListener('error', function(error) {
  sys.puts(error.message);
});

sys.puts("Lets get some tweets ...");


var app = require('express').createServer()
  , io = require('socket.io').listen(app);

app.listen(80);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var tweets = nano.use("tweets");
io.sockets.on('connection', function (socket) {
    twit.addListener('tweet', function(tweet) {
        socket.emit('nufc', tweet);
        tweets.insert(tweet, tweet.id+'', function(e,r,h){
            if(e) { console.log(e) }
            console.log("you have inserted the rabbit.")
        });
    });
});

twit.stream();
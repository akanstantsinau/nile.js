// limit of initial clients to have socket connections w/
const CLIENT_LIMIT = 1;

// store refs to connected clients' RTC connections
const clientRTCConns = {};

function socketController(server) {
  const io = this.io = require('socket.io')(server);

  io.on('connection', function (socket) {
    console.log('New connection');

    // check # of clients
    function clientHandler (err, clients) {
      if (err) throw err;

      let msg, disconnect;
      if (clients.length <= CLIENT_LIMIT) {
        // msg = 'Have a socket!';
        msg = 'Connected to the server'
        disconnect = false;
      } else {
        msg = 'Go connect using webRTC!';
        disconnect = true;
      }
      socket.emit('full', msg, disconnect);
    }

    io.sockets.clients(clientHandler);

    // receives offer from new client
    socket.on('offer', function (offer) {
      // emit to root of client chain
      socket.to(/* chain root socketid */).emit(offer);
    });
    // socket.on('answer')
    // socket.on('candidate')

    socket.on('disconnect', function (socket) {
      console.log('Disconnected');
    });
  });
}

socketController.prototype.emitNewMagnet = function(magnetURI) {
  console.log('hello')
  this.io.emit('magnetURI', magnetURI);
}

module.exports = socketController;
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const players = {}

const updateClient = (socket) => {
  const id = setInterval(() => {
    console.log(players)
    socket.emit('frame', players)
  }, 20);
  return id
}
io.on('connection', (socket) => {
  console.log('new player', socket.id);

  socket.on('checkin', (data) => {
    players[socket.id] = { x: data.positionX, y: data.positionY };
  });

  const id = updateClient(socket)

  socket.on('disconnect', () => {
    clearInterval(id);
    delete players[socket.id];
    console.log(socket.id, 'disconnected');
  });
});

module.exports = server;


const port = process.env.PORT || 8087;
server.listen(port, () => console.log(`listening on ${port}`));

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var port = 8080;

//initializing framework
var players = {};

// instancing
var app = express(); //default constructor
var server = http.Server(app); //to launch Express
var io = socketIO(server); //passing 'server' so that it runs on IO server
app.set('port', port);

//used 'public' folder to use external CSS and JS
app.use('/Public', express.static(__dirname + "/Public"));
//port listening
server.listen(port, function() 
{
    console.log("listening...");
});

//handling requests and responses by setting the Express framework
app.get("/", function (req, res) 
{
    console.log("Sending landing page.");
    res.sendFile(path.join(__dirname, "landing.html"));
});

io.on('connection', function (socket) 
{ 
    console.log("Someone has connected");
    players[socket.id] = {
        player_id: socket.id,
    };
    //sends info back to that socket and not to all the other sockets
    socket.emit('already_connected_players', players);
    socket.on('disconnect', function () {
        console.log("someone has disconnected");
        delete players[socket.id];
        socket.broadcast.emit('player_disconnect', socket.id);
    });
	
	socket.on('server_load', function (server_load_data)
		{
			socket.broadcast.emit('client_load', {});
		}
	);
	socket.on('server_unload', function (server_load_data)
		{
			socket.broadcast.emit('client_unload', {});
		}
	);
});


var io = require('socket.io')(process.env.PORT || 3000);
console.log('server started');

var playerCount = 0;

io.on('connection', function(socket){
	//Lets player know server registered his own spawn
	socket.emit('register', {data: socket.id});
	console.log('socket registered: ' + socket.id);
	
	//Lets other players (without this one) become aware of this spawn
	socket.broadcast.emit('spawn', {data: socket.id});
	playerCount++;
	
	//Spawns other players for this player
	//TODO: remove current player from creating a spawn of themselves as it will exist within the game
	for (i=0; i<playerCount; i++){
		socket.emit('spawn', {data: socket.id});
		console.log('sending existing player spawn to new player');
	}
	
	
    socket.on('move', function(data){
        console.log('client moved ' + data.x + ', ' + data.y);
    });
	
	
	
	
	
	socket.on('disconnect', function(){
        console.log('socket disconnected: ' + socket.id);
		//socket.broadcast.emit('disconnect', {data: socket.id});
		playerCount--;
    });
});

















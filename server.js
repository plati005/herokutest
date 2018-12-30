var io = require('socket.io')(process.env.PORT || 3000);
var shortid = require('shortid');

console.log('server started');

//Player Id needs to be seperate from Socket Id to allow saving
//Player list
var players = [];

io.on('connection', function(socket){
	
	//Generate player Id
	var thisPlayerId = shortid.generate();
	console.log('player registered, playerID: ' + thisPlayerId);
	
	//Add player to player list
	players.push(thisPlayerId);
	
	//Lets player know server registered his own spawn
	socket.emit('register', {id: thisPlayerId});
	
	//Lets other players (without this one) become aware of this spawn
	socket.broadcast.emit('spawn', {id: thisPlayerId});
	
	//Requests positions of other players
	socket.broadcast.emit('requestPosition', {id: thisPlayerId});
	//Spawns other players for this player
	players.forEach(function(playerId){
		//Removes current player from creating a spawn of themselves as it will exist within the game
		if (playerId == thisPlayerId)
			return;
		
		socket.emit('spawn', {id: playerId});
		console.log('sending existing player spawn to new player for id: ' + playerId);
	});
	//Updates positions given from other players to current player (and others)
	//Other players would send socket information to their own server script, socket.broadcast would send information from their script to the current player's script, as well as everyone else
	socket.on('updatePosition', function(data){
		console.log('updatePosition: ' + data.x + ', ' + data.y);
		data.id = thisPlayerId;
		socket.broadcast.emit('updatingPosition', data);
	});
	
	//Move function sends move from one player to all others
    socket.on('move', function(data){
        //Attaching thisPlayerId to the data to know who moved
		data.id = thisPlayerId;
		console.log('client moved ' + data.x + ', ' + data.y);
		socket.broadcast.emit('moved', data);
    });
	
	//Attack function sends attack from one player to all others
    socket.on('attack', function(data){
        //Attaching thisPlayerId to the data to know who moved
		data.id = thisPlayerId;
		console.log('client attacked ' + data.spell + ', ' + data.x + ', ' + data.y);
		socket.broadcast.emit('attack', data);
    });
	
	//Face function sends facing direction from one player to all others
    socket.on('face', function(data){
        //Attaching thisPlayerId to the data to know who moved
		data.id = thisPlayerId;
		console.log('client faced ' + data.dir);
		socket.broadcast.emit('face', data);
    });
	
	//Removes client from player lists when they leave the game
	socket.on('disconnect', function(){
        console.log('socket disconnected: ' + thisPlayerId);
		socket.broadcast.emit('disconnected', {id: thisPlayerId});
		players.splice(players.indexOf(thisPlayerId), 1);
		
    });
});

















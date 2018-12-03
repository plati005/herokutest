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
	
	
    socket.on('move', function(){
        console.log('client moved');
    });
	
	
	
	
	
	socket.on('disconnect', function(){
        console.log('socket disconnected: ' + socket.id);
		//socket.broadcast.emit('disconnect', {data: socket.id});
		playerCount--;
    });
	
	
	
	
	
	
	
	//TODO: Delete below comments
	//FOR REFERENCE ONLY//
	/*
    socket.on('test-event1', function(){
        console.log('got test-event1');
		//socket.emit('keyword', {e:1});
    });

    socket.on('test-event2', function(data){
        console.log('got test-event2');
        console.log(data);

        socket.emit('test-event', {
            test:12345,
            test2: 'test emit event STEFAN'
        });
		
    });
	
	
	
    socket.on('test-event3', function(data, callback){
        console.log('got test-event3');
        console.log(data);

        callback({
            test: 123456,
            test2: "test3"
        });
    });
	*/

});

















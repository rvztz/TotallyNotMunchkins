const server = require('express')()
const http = require('http').createServer(server)
const io = require('socket.io')(http)

const {Room} = require('./models/room.js')
const {TreasureList, DoorList} = require('./models/cardLists.js')
const room = require('./models/room.js')

let rooms = []

// Socket IO
io.on('connection', (socket) => {
	console.log('a user connected ' + socket.id)
	
	/*======================ROOM  MANAGEMENT=======================*/
    socket.on('createRoom', (roomName) => {
        if (!(/[^\w.]/.test(roomName))) {
            socket.join(roomName, () => {
                console.log(`User ${socket.id} connected to room ${roomName}`)
			});
			let newRoom = new Room(roomName, socket.id)
			newRoom.addPlayer(socket.id)
			rooms.push(newRoom)
        }
	})
	
	socket.on('joinRoom', (roomName) => {
		if (!(/[^\w.]/.test(roomName))) {
			socket.join(roomName, () => {
                console.log(`User ${socket.id} connected to room ${roomName}`)
			});
			let roomIndex = findRoom(roomName)
			rooms[roomIndex].addPlayer(socket.id)
			socket.emit('updateTokenSelections', rooms[roomIndex].availableTokens)
		}
	})

	/*======================LOBBY UPDATES=======================*/
	socket.on('joined', (roomName) => {
		let roomIndex = findRoom(roomName)
		socket.emit('updateTokenSelections', rooms[roomIndex].availableTokens)
	})

	socket.on('selectAttribute', (roomName, type, value) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayer(rooms[roomIndex], socket.id)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}

		if (type === 'token') {
			if(rooms[roomIndex].players[playerIndex].tokenImage != "") {
				rooms[roomIndex].availableTokens.push(rooms[roomIndex].players[playerIndex].tokenImage)
			}

			rooms[roomIndex].players[playerIndex].tokenImage = value
			rooms[roomIndex].availableTokens = rooms[roomIndex].availableTokens.filter(token => {
				return token != value
			})

			io.in(rooms[roomIndex].name).emit('updateTokenSelections', rooms[roomIndex].availableTokens)
		} else if (type === 'gender'){
			rooms[roomIndex].players[playerIndex].gender = value
		} else {
			console.log("Error: unexpected attribute")
		}
	})

	/*======================GAME MANAGEMENT=======================*/
	socket.on('startGame', (roomName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex >= 0) {
			if (socket.id == rooms[roomIndex].hostId) {
				rooms[roomIndex].shuffleDecks(TreasureList, DoorList)
				io.in(roomName).emit('startGame', rooms[roomIndex].getInfo())
			}
		} else {
			console.log("Error: invalid room name")
		}
	})

	socket.on('endPregame', (roomName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayer(rooms[roomIndex], socket.id)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}

		if (rooms[roomIndex].players[playerIndex].inPregame) {
			rooms[roomIndex].players[playerIndex].inPregame = false
			if (checkPregame(rooms[roomIndex].players)) {
				// Someone is still in pregame, do nothing
			} else {
				rooms[roomIndex].shufflePlayers()
				let nextId = rooms[roomIndex].getNextPlayerId()
				io.in(roomName).emit('endPregame')
				io.in(roomName).emit('changeTurn', nextId)
			}
		}
	})

	socket.on('drewCard', (roomName) => {
		io.in(roomName).emit('drewCard')
	})

	socket.on('endTurn', (roomName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let nextId = rooms[roomIndex].getNextPlayerId()
		io.in(roomName).emit('changeTurn', nextId)
	})

	socket.on('winGame', (roomName) => {
		io.in(roomName).emit('endGame', socket.id)
	})

	/*======================TOKEN MOVEMENT=======================*/
	socket.on('moveToken', (roomName, x, y) => {
		socket.to(roomName).emit('moveOpponentToken', socket.id, x, y);
	})

	/*======================CARD HANDLING=======================*/
	socket.on('requestCards', (roomName, cardType, n) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayer(rooms[roomIndex], socket.id)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}

		if (cardType !== 'treasure' && cardType !== 'door') {
			console.log("Error: unexpected card type")			
			return
		}

		let response = []
		for (let i = 0; i < n; i++) {
			rooms[roomIndex].players[playerIndex].cards.push(cardType)
			if (cardType === 'treasure') {
				response.push(rooms[roomIndex].treasureDeck.pop())
			} else {
				response.push(rooms[roomIndex].doorDeck.pop())
			}
		}

		socket.emit('addCardsToPlayer', response, cardType)
		socket.to(roomName).emit('updateOpponentCards', socket.id, rooms[roomIndex].players[playerIndex].cards)
	})

	socket.on('distributeCards', roomName => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayer(rooms[roomIndex], socket.id)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}

		let doors = []
		let treasures = []
		for (let i = 0; i < 4; i++) {
			treasures.push(rooms[roomIndex].treasureDeck.pop())
			rooms[roomIndex].players[playerIndex].cards.push('treasure')
		}
		for (let i = 0; i < 4; i++) {
			doors.push(rooms[roomIndex].doorDeck.pop())
			rooms[roomIndex].players[playerIndex].cards.push('door')
		}
		
		socket.emit('distributeCards', treasures, doors)
		socket.to(roomName).emit('updateOpponentCards', socket.id, rooms[roomIndex].players[playerIndex].cards)
	})

	socket.on('removeCard', (roomName, cardName, cardType, index) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayer(rooms[roomIndex], socket.id)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}
		
		if (cardType === 'treasure') {
			rooms[roomIndex].treasureDeck.push(cardName)
		} else {
			rooms[roomIndex].doorDeck.push(cardName)
		}
		
		rooms[roomIndex].players[playerIndex].removeCardAt(index)
		socket.to(roomName).emit('updateOpponentCards', socket.id, rooms[roomIndex].players[playerIndex].cards)
	})

	/*======================PLAYER UPDATES=======================*/
	socket.on('updateLevel', (roomName, socketId, level) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayer(rooms[roomIndex], socketId)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}

		rooms[roomIndex].players[playerIndex].level = level
		socket.to(roomName).emit('updateLevel', socketId, rooms[roomIndex].players[playerIndex].level)
	})

	/*======================PLAYER DISCONNECT=======================*/
	socket.on('disconnect', () => {
        console.log('a user disconnected ' + socket.id)
    })
})


// Server
server.get("/api/roomExists", (req, res, next) => {
    let name = req.query.name
	res.header('Access-Control-Allow-Origin', '*')
	
    return res.status(200).json({ans: findRoom(name) >=0})
})

server.get("/api/roomIsJoinable", (req, res, next) => {
    let name = req.query.name
	res.header('Access-Control-Allow-Origin', '*')

	let roomIndex = findRoom(name)
	let ans = false
	let message = ""

	if (roomIndex >= 0) {
		if (rooms[roomIndex].players.length < 4) {
			ans = true
		} else {
			message = "Room exists but is full."
		}
	} else {
		message = "Room doesn't exist."
	}
	
    return res.status(200).json({ans: ans, message: message})
})

function findRoom(name) {
    let ans = -1
    rooms.forEach((room, i) => {
		if (room.name === name) {
			ans = i
		}
	})

	return ans
}

function findPlayer(room, socketId) {
	let ans = -1
	room.players.forEach((player, i) => {
		if (player.socketId == socketId) {
			ans = i
		}
	})
  
	return ans 
}

function checkPregame(players) {
	for(let i = 0; i < players.length; i++) {
		if(players[i].inPregame) {
			return true
		}
	}

	return false
}

http.listen(3000, () => {
    console.log('Server started!')
})
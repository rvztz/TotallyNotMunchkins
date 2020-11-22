const server = require('express')()
const http = require('http').createServer(server)
const io = require('socket.io')(http)
const {Room} = require('./models/room.js')
const {TreasureList, DoorList} = require('./models/cardLists.js')

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

	socket.on('kickPlayer', (roomName, userName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		let playerIndex = findPlayerByUsername(rooms[roomIndex], userName)
		if (playerIndex < 0) {
			console.log("Error: player not found")
			return
		}

		let socketId = rooms[roomIndex].players[playerIndex].socketId

		if (rooms[roomIndex].hostId != socket.id && socketId != socket.id) {
			// Can't kick others if you're not the host; do nothing
			return
		}

		rooms[roomIndex].addToBlocklist(rooms[roomIndex].players[playerIndex].userName)
		
		if(rooms[roomIndex].players[playerIndex].tokenImage != "") {
			rooms[roomIndex].availableTokens.push(rooms[roomIndex].players[playerIndex].tokenImage)
		}

		io.in(rooms[roomIndex].name).emit('updateTokenSelections', rooms[roomIndex].availableTokens)
		
		rooms[roomIndex].players.splice(playerIndex, 1)
		
		if (rooms[roomIndex].players.length === 0) {
			rooms.splice(roomIndex, 1)
		} else {
			if (rooms[roomIndex].hostId == socketId) {
				rooms[roomIndex].hostId = rooms[roomIndex].players[0].socketId
			}
	
			io.in(roomName).emit('cleanPlayerList')
			rooms[roomIndex].players.forEach(player => {
				io.in(roomName).emit('addUsername', player.userName)
			})
		}
		io.to(socketId).emit('disconnectPlayer')
	})

	socket.on('closeRoom', (roomName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		// Send room info to database here

		rooms.splice(roomIndex, 1)
		
		io.in(roomName).emit('disconnectPlayer')
	})
	
	socket.on('disconnectPlayer', () => {
		socket.disconnect()
	})

	/*======================LOBBY UPDATES=======================*/
	socket.on('joined', (roomName, userName, userEmail) => {
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

		rooms[roomIndex].players[playerIndex].userName = userName
		rooms[roomIndex].players[playerIndex].userEmail = userEmail

		io.in(roomName).emit('cleanPlayerList')
		rooms[roomIndex].players.forEach(player => {
			io.in(roomName).emit('addUsername', player.userName)
		})

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
				rooms[roomIndex].shuffleDecks([...TreasureList], [...DoorList])
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
				const {id, name} = rooms[roomIndex].getNextPlayerIdAndName()
				io.in(roomName).emit('endPregame')
				io.in(roomName).emit('changeTurn', id, name)
			}
		}
	})

	socket.on('drewCard', (roomName) => {
		io.in(roomName).emit('drewCard')
	})

	socket.on('enabledLoot', (roomName) => {
		io.in(roomName).emit('enabledLoot')
	})

	socket.on('disabledLoot', (roomName) => {
		io.in(roomName).emit('disabledLoot')
	})

	socket.on('endTurn', (roomName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		const {id, name} = rooms[roomIndex].getNextPlayerIdAndName()
		io.in(roomName).emit('changeTurn', id, name)
	})

	socket.on('winGame', (roomName) => {
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

		rooms[roomIndex].winnerName = rooms[roomIndex].players[playerIndex].userName

		io.to(rooms[roomIndex].hostId).emit('displayExitButton')
		io.in(roomName).emit('endGame', socket.id, rooms[roomIndex].players[playerIndex].userName)
		io.to(rooms[roomIndex].hostId).emit('saveGameToFirebase', rooms[roomIndex].getFirebaseObject())
	})

	/*======================COMBAT EVENTS=======================*/
	socket.on('startCombat', (roomName, card) => {
		io.in(roomName).emit('startCombat', card)
	})

	socket.on('askForHelp', (roomName) => {
		socket.to(roomName).emit('askForHelp')
	})

	socket.on('offerHelp', (roomName) => {
		socket.to(roomName).emit('offerHelp', socket.id)
	})

	socket.on('removeMonsterAt', (roomName, position) => {
		io.in(roomName).emit('removeMonsterAt', position)
	})

	socket.on('targetMonsterAt', (roomName, position) => {
		socket.to(roomName).emit('targetMonsterAt', position)
	})

	socket.on('killHelper', (socketId) => {
		io.to(socketId).emit('killHelper')
	})

	socket.on('useCardOnMonster', (roomName, card, position) => {
		socket.to(roomName).emit('useCardOnMonster', card, position)
	})

	socket.on('endCombat', (roomName) => {
		io.in(roomName).emit('endCombat')
	})

	socket.on('sendTreasuresToHelper', (socketId, treasures) => {
		io.to(socketId).emit('sendTreasuresToHelper', treasures)
	})

	/*======================TOKEN MOVEMENT=======================*/
	socket.on('moveToken', (roomName, x, y) => {
		socket.to(roomName).emit('moveOpponentToken', socket.id, x, y);
	})

	/*======================CARD HANDLING=======================*/
	socket.on('requestCards', (roomName, cardType, n, isPublic) => {
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
			if (cardType === 'treasure') {
				response.push(rooms[roomIndex].treasureDeck.pop())
			} else {
				response.push(rooms[roomIndex].doorDeck.pop())
			}
		}

		socket.emit('addCardsToPlayer', response, cardType, isPublic)
	})

	socket.on('updatePlayerHand', (roomName, cardType) => {
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
		
		rooms[roomIndex].players[playerIndex].cards.push(cardType)
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
		}
		for (let i = 0; i < 4; i++) { 
			doors.push(rooms[roomIndex].doorDeck.pop())
		}
		
		socket.emit('distributeCards', treasures, doors)
	})

	socket.on('removeCard', (roomName, index) => {
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
		
		rooms[roomIndex].players[playerIndex].removeCardAt(index)
		socket.to(roomName).emit('updateOpponentCards', socket.id, rooms[roomIndex].players[playerIndex].cards)
	})

	socket.on('returnCard', (roomName, cardName, cardType) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex < 0) {
			console.log("Error: room doesn't exist")
			return
		}

		if (cardType === 'treasure') {
			rooms[roomIndex].treasureDeck.push(cardName)
		} else {
			rooms[roomIndex].doorDeck.push(cardName)
		}
	})

	socket.on('showPublicCard', (roomName, cardImage) => {
		io.in(roomName).emit('showPublicCard', cardImage)
	})

	/*======================PLAYER UPDATES=======================*/
	socket.on('levelUpPlayer', (socketId, n) => {
		io.to(socketId).emit('levelUpPlayer', n)
	})
	
	socket.on('updateLevel', (roomName, level) => {
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

		rooms[roomIndex].players[playerIndex].level = level
		socket.to(roomName).emit('updateLevel', socket.id, rooms[roomIndex].players[playerIndex].level)
	})

	socket.on('buffPlayer', (socketId, amount) => {
		io.to(socketId).emit('buffPlayer', amount)
	})

	socket.on('resetEffects', (socketId) => {
		io.to(socketId).emit('resetEffects')
	})

	socket.on('updateStrength', (roomName, strength) => {
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

		rooms[roomIndex].players[playerIndex].strength = strength
		socket.to(roomName).emit('updateStrength', socket.id, rooms[roomIndex].players[playerIndex].strength)
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
	let roomName = req.query.name
	let userName = req.query.userName
	res.header('Access-Control-Allow-Origin', '*')

	let roomIndex = findRoom(roomName)
	let ans = false
	let message = ""

	if (roomIndex >= 0) {
		if (rooms[roomIndex].players.length < 4) {
			if(!rooms[roomIndex].foundInBlockList(userName)) {
				ans = true
			} else {
				message = "You're blocked from this room."
			} 
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

function findPlayerByUsername(room, userName) {
	let ans = -1
	room.players.forEach((player, i) => {
		if (player.userName == userName) {
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
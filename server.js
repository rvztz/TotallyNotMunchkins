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

	socket.on('joined', (roomName) => {
		let roomIndex = findRoom(roomName)
		socket.emit('updateTokenSelections', rooms[roomIndex].availableTokens)
	})

	socket.on('startGame', (roomName) => {
		let roomIndex = findRoom(roomName)
		if (roomIndex >= 0) {
			if (socket.id == rooms[roomIndex].hostId) {
				io.in(roomName).emit('startGame', rooms[roomIndex].getInfo())
			}
		} else {
			console.log("Error: invalid room name")
		}
			
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
	
	socket.on('moveToken', (roomName, x, y) => {
		socket.to(roomName).emit('moveOpponentToken', socket.id, x, y);
	})

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

http.listen(3000, () => {
    console.log('Server started!')
})
const server = require('express')()
const http = require('http').createServer(server)
const io = require('socket.io')(http)

let rooms = []

// Socket IO
io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id)

    socket.on('createRoom', (name) => {
        if (!(/[^\w.]/.test(name))) {
            socket.join(name, () => {
                console.log(`User ${socket.id} connected to room ${name}`)
			});
			rooms.push({
				name: name,
				players: [],
				connectionCount: 1,
				decks: {
					doorDeck: [],
					treasureDeck: []
				}
			})
        }
	})
	
	socket.on('joinRoom', (name) => {
		if (!(/[^\w.]/.test(name))) {
			socket.join(name, () => {
                console.log(`User ${socket.id} connected to room ${name}`)
			});
			let roomIndex = findRoom(name)
			rooms[roomIndex].connectionCount++
		}
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
		if (rooms[roomIndex].connectionCount < 4) {
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

http.listen(3000, () => {
    console.log('Server started!')
})
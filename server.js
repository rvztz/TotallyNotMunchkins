const server = require('express')()
const http = require('http').createServer(server)
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id)

    socket.on('disconnect', () => {
        console.log('a user disconnected ' + socket.id)
    })
})

http.listen(3000, () => {
    console.log('Server started!')
})
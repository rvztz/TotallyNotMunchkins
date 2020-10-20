class Player {
    constructor(socketId) {
        this.socketId = socketId
        this.cards = []
        this.level = 1
        this.equipment = []
        this.power = 1

        this.getSocketId = () => { return this.socketId }
    }

    
}

module.exports = { Player }
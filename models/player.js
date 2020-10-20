class Player {
    constructor(socketId) {
        this.socketId = socketId
        this.cards = []
        this.level = 1
        this.equipment = []
        this.power = 1
    }
}

module.exports = { Player }
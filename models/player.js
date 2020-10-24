class Player {
    constructor(socketId) {
        this.socketId = socketId
        this.cards = []
        this.level = 1
        this.equipment = []
        this.gender = ""
        this.power = 1
        this.tokenImage = ""

        this.getSocketId = () => { return this.socketId }
        this.getTokenImage = () => { return this.tokenImage }
        this.getGender = () => { return this.gender }
    }   
}

module.exports = { Player }
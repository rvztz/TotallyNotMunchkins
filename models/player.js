class Player {
    constructor(socketId) {
        this.socketId = socketId
        this.cards = []
        this.level = 1
        this.equipment = []
        this.gender = ""
        this.strength = 1
        this.tokenImage = ""
        this.inPregame = true
        this.userName = ""
        this.userEmail = ""

        this.getSocketId = () => { return this.socketId }
        this.getTokenImage = () => { return this.tokenImage }
        this.getGender = () => { return this.gender }
        this.getUserName = () => { return this.userName }

        this.removeCardAt = (index) => {
            this.cards.splice(index, 1)
        }
    }
}

module.exports = { Player }
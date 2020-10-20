const {Player} = require('./player.js')
const {Deck} = require('./deck.js')

class Room {
    constructor(name, hostId, connectionCount) {
        this.name = name
        this.hostId = hostId
        this.players = []
        this.treasureDeck = new Deck()
        this.doorDeck = new Deck()
    
        this.addPlayer = (socketId) => {
            this.players.push(new Player(socketId))
        }
    }
}

module.exports = { Room }

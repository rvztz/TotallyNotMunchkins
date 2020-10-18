const {Player} = require('./player.js')
const {Deck} = require('./deck.js')

class Room {
    constructor(name, connectionCount) {
        this.name = name
        this.players = []
        this.connectionCount = connectionCount
        this.treasureDeck = new Deck()
        this.doorDeck = new Deck()
    }
}

module.exports = { Room }

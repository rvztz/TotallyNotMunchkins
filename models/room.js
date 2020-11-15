const {Player} = require('./player.js')
const {Deck, shuffleArray} = require('./deck.js')

class Room {
    constructor(name, hostId) {
        this.name = name
        this.hostId = hostId
        this.winnerId = null
        this.players = []
        this.availableTokens = ["tokenRed", "tokenBlue", "tokenGreen", "tokenYellow"]
        this.treasureDeck = new Deck()
        this.doorDeck = new Deck()

        this.turnIndex = 0
    
        this.addPlayer = (socketId) => {
            this.players.push(new Player(socketId))
        }
        
        this.getInfo = () => {
            return this.players.map(player => {
                return {
                    socketId: player.getSocketId(),
                    tokenImage: player.getTokenImage(),
                    gender: player.getGender()
                }
            })
        }

        this.shuffleDecks = (treasures, doors) => {
            this.treasureDeck.shuffleDeck(treasures)
            this.doorDeck.shuffleDeck(doors)
        }

        this.shufflePlayers = () => {
            this.players = shuffleArray(this.players)
        }

        this.getNextPlayerIdAndName = () => {
            this.turnIndex += 1
            return {
                id: this.players[this.turnIndex % this.players.length].socketId, 
                name: this.players[this.turnIndex % this.players.length].userName
            }
        }
    }
}

module.exports = { Room }

const {Player} = require('./player.js')
const {Deck, shuffleArray} = require('./deck.js')

class Room {
    constructor(name, hostId) {
        this.name = name
        this.hostId = hostId
        this.winnerName = null
        this.players = []
        this.availableTokens = ["tokenRed", "tokenBlue", "tokenGreen", "tokenYellow"]
        this.treasureDeck = new Deck()
        this.doorDeck = new Deck()
        this.blockList = []

        this.turnIndex = 0
    
        this.addPlayer = (socketId) => {
            this.players.push(new Player(socketId))
        }
        
        this.getInfo = () => {
            return this.players.map(player => {
                return {
                    socketId: player.getSocketId(),
                    tokenImage: player.getTokenImage(),
                    gender: player.getGender(),
                    userName: player.getUserName()
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
            return {id: this.players[this.turnIndex % this.players.length].socketId, name: this.players[this.turnIndex % this.players.length].userName}
        }

        this.addToBlocklist = (userName) => {
            this.blockList.push(userName)
        }
    
        this.foundInBlockList = (userName) => {
            let found = false
            this.blockList.forEach(blockedName => {
                if (blockedName === userName) {
                    found = true
                }
            })

            return found
        }

        this.getFirebaseObject = () => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            let playerList = this.players.filter(player => {
                return player.userName != this.winnerName
            })
            playerList.sort((a, b) => (a.level > b.level) ? -1 : 1)

            let winnerList = this.players.filter(player => {
                return player.userName == this.winnerName
            })

            let fullList = winnerList.concat(playerList)

            let userNames = fullList.map(player => {
                return player.userName
            })

            let emails = fullList.map(player => {
                return player.userEmail
            })

           return {
               date: `${mm}/${dd}/${yyyy}`,
               roomName: this.name,
               winner: this.winnerName,
               usernames: userNames,
               emails: emails
           }
        }
    }
}

module.exports = { Room }

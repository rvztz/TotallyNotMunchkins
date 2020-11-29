import swal from 'sweetalert'

export default class EndTurnButton {
    constructor(scene) {
        this.renderedButton = null

        this.render = (x, y) => {
            let button = scene.add.image(x, y, 'endTurn').setScale(0.4, 0.4).setInteractive({ cursor: 'pointer' })
            button.x -= button.displayWidth*0.75

            button.on('pointerup', () => {
                if (scene.gameState.inPregame) {
                    if (scene.gameState.endGame) {
                        swal("Oops!", "The game has already ended", "error")
                    } else if (scene.player.cards.length > 5) {
                        swal("Oops!", "You need to have 5 cards to end pregame", "error")
                    } else {
                        scene.socket.emit('endPregame', scene.roomName)
                        scene.socket.emit('addToLog', scene.roomName, `${scene.player.userName} is ready.`)
                        scene.currentTurnText.text = "Waiting..."                
                    }
                } else {
                    if (this.turnCanEnd()) {
                        scene.socket.emit('endTurn', scene.roomName)
                    } else {
                        this.alertTurnCantEnd()
                    }
                }
            })

            this.renderedButton = button
            return button
        }

        this.turnCanEnd = () => {
            return scene.gameState.isYourTurn() &&
                   scene.gameState.cardDrawn &&
                   !scene.gameState.inPregame &&
                   !scene.gameState.inCombat &&
                   scene.player.cards.length <= 5
        }

        this.alertTurnCantEnd = () => {
            if (!scene.gameState.isYourTurn()) {
                swal("Oops!", "It's not your turn", "error")
            } else if (!scene.gameState.cardDrawn) {
                swal("Oops!", "You haven't drawn a card yet", "error")
            } else if (scene.gameState.inPregame) {
                swal("Oops!", "It's still the pregame", "error")
            }  else if (scene.gameState.inCombat) {
                swal("Oops!", "You can't end your turn while in combat", "error")
            } else if (scene.player.cards.length > 5) {
                swal("Oops!", "You can't have more than 5 cards in your hand", "error")
            } else {
                console.log("Error: unexpected game state")
            }
        }
    }
}
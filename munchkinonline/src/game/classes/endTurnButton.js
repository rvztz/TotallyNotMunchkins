export default class EndTurnButton {
    constructor(scene) {
        this.renderedButton = null

        this.render = (x, y) => {
            let button = scene.add.image(x, y, 'endTurn').setScale(0.5, 0.5).setInteractive({ cursor: 'pointer' })
            button.x -= button.displayWidth*0.75

            button.on('pointerup', () => {
                if (scene.gameState.inPregame) {
                    if (scene.player.cards.length > 5) {
                        alert("You need to have 5 cards to end pregame")
                    } else {
                        scene.socket.emit('endPregame', scene.roomName)
                        scene.currentTurnText.text = "Waiting..."                
                    }
                } else {
                    // Turn stuff
                }
            })

            this.renderedButton = button
            return button
        }
    }
}
export default class Token {
    constructor(scene) {
        this.renderedToken = null
        this.initialX = 0
        this.initialY = 0

        this.render = (startTile, index, isPlayerToken, sprite) => {
            let token = scene.physics.add.image(startTile.x, startTile.y, sprite).setScale(0.1, 0.1)
            let offsets = this.getOffsets(startTile, token, index) // replace 0 with index
            token.x += offsets.x
            token.y += offsets.y

            this.initialX = token.x
            this.initialY = token.y

            if (isPlayerToken) {
                token.setInteractive({ cursor: 'pointer' })
                scene.input.setDraggable(token);
            }
            
            token.setData({type: 'token', level: 1})
            this.renderedToken = token
            return token
        }

        this.getOffsets = (startTile, token, index) => {
            switch (index) {
                case 0: // Top Left
                    return {
                        x: token.displayWidth,
                        y: token.displayHeight
                    } 
                case 1: // Top Right
                    return {
                        x: startTile.width - token.displayWidth,
                        y: token.displayHeight
                    } 
                case 2: // Bottom Left
                    return {
                        x: token.displayWidth,
                        y: startTile.height - token.displayHeight
                    } 
                case 3: // Bottom Right
                    return {
                        x: startTile.width - token.displayWidth,
                        y: startTile.height - token.displayHeight
                    }
                default:
                    console.log("Error: unexpected token index")
            }
        } 
 
        this.resetPosition = () => {
            this.renderedToken.x = this.initialX
            this.renderedToken.y = this.initialY
            scene.socket.emit('moveToken', scene.roomName, this.initialX, this.initialY)
        }
    }
}
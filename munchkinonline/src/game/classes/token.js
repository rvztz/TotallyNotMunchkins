export default class Token {
    constructor(scene) {

        this.render = (startTile, index, isPlayerToken, sprite) => {
            let token = scene.add.image(startTile.x, startTile.y, sprite).setScale(0.1, 0.1)
            let offsets = this.getOffsets(startTile, token, index) // replace 0 with index
            token.x += offsets.x
            token.y += offsets.y

            if (isPlayerToken) {
                token.setInteractive({ cursor: 'pointer' })
                scene.input.setDraggable(token);
            }
            
            token.setData({type: 'token', level: 1})
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
    }
}
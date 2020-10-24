export default class SelectionButton {
    constructor(scene, type, value) {
        this.type = type
        this.value = value
        this.selected = false
        this.renderedButton = null

        this.render = (x, y, sprite) => {
            let button = scene.add.image(x, y, sprite).setScale(0.1, 0.1).setInteractive({ cursor: 'pointer' })

            button.on('pointerup', () => {
                scene.selection.loadCircle(button.x, button.y, button.displayWidth, this.type)
                scene.selection.deselectTokens()
                this.selected = true
                scene.socket.emit('selectAttribute', scene.roomName , this.type, this.value)
            });

            this.renderedButton = button
            return button
        }
    }
}
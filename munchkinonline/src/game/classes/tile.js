export default class Tile {
    constructor(scene, level) {
        this.level = level

        this.render = (x, y, sprite, cW, cH) => {
            let tile = scene.add.image(x+cW/2, y+cH/2, sprite).setScale(0.6, 0.6).setInteractive()
            tile.displayHeight = 0.9*cH
            tile.displayWidth = 0.9*cW
            tile.input.dropZone = true
            tile.setData({type: "tile", level: this.level})
            
            let outline = scene.add.graphics()
            outline.lineStyle(4, 0x000000)
            outline.strokeRect(x, y, cW, cH)
            return tile
        }
    }
}
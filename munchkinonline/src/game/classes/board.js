import Tile from '../classes/tile'

export default class Board {
    constructor(scene, x, y, cellWidth, cellHeight) {
        this.dimensions = {x: x, y: y, cellWidth: cellWidth, cellHeight: cellHeight}
        
        this.tiles = [
            {
                level: 1,
                image: "pogmin",
                row: 2,
                col: 4
            },
            {
                level: 2,
                image: "pogmin",
                row: 1,
                col: 4
            },
            {
                level: 3,
                image: "pogmin",
                row: 0,
                col: 4
            },
            {
                level: 4,
                image: "pogmin",
                row: 0,
                col: 3
            },
            {
                level: 5,
                image: "pogmin",
                row: 0,
                col: 2
            },
            {
                level: 6,
                image: "pogmin",
                row: 1,
                col: 2
            },
            {
                level: 7,
                image: "pogmin",
                row: 2,
                col: 2
            },
            {
                level: 8,
                image: "pogmin",
                row: 2,
                col: 1
            },
            {
                level: 9,
                image: "pogmin",
                row: 2,
                col: 0
            },
            {
                level: 10,
                image: "pogmin",
                row: 1,
                col: 0
            },
        ]

        this.renderTiles = () => {
            this.tiles.forEach((tile) => {
                console.log(tile)
                let newTile = new Tile(scene, tile.level)
                newTile.render(this.dimensions.x + tile.col * this.dimensions.cellWidth, this.dimensions.y + tile.row * this.dimensions.cellHeight, tile.image, this.dimensions.cellWidth, this.dimensions.cellHeight)
            })
        }
    }
}
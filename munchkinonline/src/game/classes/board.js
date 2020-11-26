import Tile from '../classes/tile'
import Deck from '../classes/deck'
import Discard from '../classes/discard'

export default class Board {
    constructor(scene, x, y, cellWidth, cellHeight) {
        this.dimensions = {x: x, y: y, cellWidth: cellWidth, cellHeight: cellHeight}
        
        this.tiles = [
            {
                level: 1,
                image: "tile1",
                row: 2,
                col: 4
            },
            {
                level: 2,
                image: "tile2",
                row: 1,
                col: 4
            },
            {
                level: 3,
                image: "tile3",
                row: 0,
                col: 4
            },
            {
                level: 4,
                image: "tile4",
                row: 0,
                col: 3
            },
            {
                level: 5,
                image: "tile5",
                row: 0,
                col: 2
            },
            {
                level: 6,
                image: "tile6",
                row: 1,
                col: 2
            },
            {
                level: 7,
                image: "tile7",
                row: 2,
                col: 2
            },
            {
                level: 8,
                image: "tile8",
                row: 2,
                col: 1
            },
            {
                level: 9,
                image: "tile9",
                row: 2,
                col: 0
            },
            {
                level: 10,
                image: "tile10",
                row: 1,
                col: 0
            },
        ]

        this.decks = [
            {
                cardType: 'door',
                row: 0,
                col: 1,
                image: 'doorDeck'
            },
            {
                cardType: 'treasure',
                row: 1,
                col: 3,
                image: 'treasureDeck'
            }
        ]

        this.discards = [
            {
                cardType: 'door',
                row: 1,
                col: 1,
                image: 'doorDiscard'
            },
            {
                cardType: 'treasure',
                row: 2,
                col: 3,
                image: 'treasureDiscard'
            }
        ]

        this.renderTiles = () => {
            this.tiles.forEach((tile) => {
                let newTile = new Tile(scene, tile.level)
                newTile.render(this.dimensions.x + tile.col * this.dimensions.cellWidth, this.dimensions.y + tile.row * this.dimensions.cellHeight, tile.image, this.dimensions.cellWidth, this.dimensions.cellHeight)
            })
        }

        this.renderDecks = () => {
            this.decks.forEach((deck) => {
                let newDeck = new Deck(scene, deck.cardType)
                newDeck.render(this.dimensions.x + deck.col * this.dimensions.cellWidth, this.dimensions.y + deck.row * this.dimensions.cellHeight, deck.image, this.dimensions.cellWidth, this.dimensions.cellHeight)
            })
        }
        
        this.renderDiscards = () => {
            this.discards.forEach((discard) => {
                let newDiscard = new Discard(scene, discard.cardType)
                newDiscard.render(this.dimensions.x + discard.col * this.dimensions.cellWidth, this.dimensions.y + discard.row * this.dimensions.cellHeight, discard.image, this.dimensions.cellWidth, this.dimensions.cellHeight)
            })
        }
    }
}
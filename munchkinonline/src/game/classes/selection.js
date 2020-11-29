import SelectionButton from './selectionButton'

export default class Selection {
    constructor(scene, dimensions) {
        this.dimensions = {x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.width*0.6}
        
        this.tokenYellow = new SelectionButton(scene, 'token', 'tokenYellow')
        this.tokenRed = new SelectionButton(scene, 'token', 'tokenRed')
        this.tokenBlue = new SelectionButton(scene, 'token', 'tokenBlue')
        this.tokenGreen = new SelectionButton(scene, 'token', 'tokenGreen')

        this.genderMale = new SelectionButton(scene, 'gender', 'male')
        this.genderFemale = new SelectionButton(scene, 'gender', 'female')

        this.tokenCircle = null
        this.genderCircle = null

        this.render = () => {
            this.renderButtons()
        }

        this.renderButtons = () => {
            this.tokenYellow.render(this.dimensions.x - this.dimensions.width/2, this.dimensions.y, 'tokenYellow')
            let tokenBlue = this.tokenBlue.render(this.dimensions.x - this.dimensions.width/6, this.dimensions.y, 'tokenBlue')
            let tokenRed = this.tokenRed.render(this.dimensions.x + this.dimensions.width/6, this.dimensions.y, 'tokenRed')
            this.tokenGreen.render(this.dimensions.x + this.dimensions.width/2, this.dimensions.y, 'tokenGreen')

            this.genderMale.render(tokenBlue.x, tokenBlue.y + 1.5*tokenBlue.displayHeight, 'male')
            this.genderFemale.render(tokenRed.x, tokenRed.y + 1.5*tokenRed.displayHeight, 'female')
        }

        this.loadCircle = (x, y, width, type) => {
            let graphics = scene.add.graphics()
            graphics.lineStyle(4, 0x000000)

            let radius = width / 2 + width * 0.02
            let circle = graphics.strokeCircle(x, y, radius)

            if (type === 'token') {
                if (this.tokenCircle != null) {
                    this.tokenCircle.destroy()
                }
                this.tokenCircle = circle
            } else if (type === 'gender') {
                if (this.genderCircle != null) {
                    this.genderCircle.destroy()
                }
                this.genderCircle = circle
            } else {
                console.log("Error: unexpected button type")
            }
        }

        this.updateTokens = (availableTokens) => {
            if (!availableTokens.find(token => token === 'tokenYellow')) {
                if (!this.tokenYellow.selected) {
                    this.tokenYellow.renderedButton.alpha = 0.5
                }
                this.tokenYellow.renderedButton.disableInteractive()
            } else {
                this.tokenYellow.renderedButton.alpha = 1
                this.tokenYellow.renderedButton.setInteractive({ cursor: 'pointer' })
            }
            
            if (!availableTokens.find(token => token ==='tokenRed')) {
                if(!this.tokenRed.selected) {
                    this.tokenRed.renderedButton.alpha = 0.5    
                }
                this.tokenRed.renderedButton.disableInteractive()
            } else {
                this.tokenRed.renderedButton.alpha = 1
                this.tokenRed.renderedButton.setInteractive({ cursor: 'pointer' })
            }
            
            if (!availableTokens.find(token => token ==='tokenBlue')) {
                if (!this.tokenBlue.selected) {
                    this.tokenBlue.renderedButton.alpha = 0.5
                }
                this.tokenBlue.renderedButton.disableInteractive()
            } else {
                this.tokenBlue.renderedButton.alpha = 1
                this.tokenBlue.renderedButton.setInteractive({ cursor: 'pointer' })
            }

            if (!availableTokens.find(token => token ==='tokenGreen')) {
                if (!this.tokenGreen.selected) {
                    this.tokenGreen.renderedButton.alpha = 0.5
                }
                this.tokenGreen.renderedButton.disableInteractive()
            } else {
                this.tokenGreen.renderedButton.alpha = 1
                this.tokenGreen.renderedButton.setInteractive({ cursor: 'pointer' })
            }
        }

        this.deselectTokens = () => {
            this.tokenYellow.selected = false
            this.tokenRed.selected = false
            this.tokenBlue.selected = false
            this.tokenGreen.selected = false
        }
    }
}
import SelectionButton from './selectionButton'

export default class Selection {
    constructor(scene, dimensions) {
        this.dimensions = {x: dimensions.x, y: dimensions.y, width: dimensions.width, height: dimensions.width*0.5}
        
        this.tokenYellow = new SelectionButton(scene, 'token', 'yellow')
        this.tokenRed = new SelectionButton(scene, 'token', 'red')
        this.tokenBlue = new SelectionButton(scene, 'token', 'blue')
        this.tokenGreen = new SelectionButton(scene, 'token', 'green')

        this.genderMale = new SelectionButton(scene, 'gender', 'male')
        this.genderFemale = new SelectionButton(scene, 'gender', 'female')

        this.tokenCircle = null
        this.genderCircle = null

        this.render = () => {
            let token = this.renderButtons()

            // Renderear outline
            let graphics = scene.add.graphics()
            graphics.lineStyle(4, 0x000000)
            graphics.strokeRect(this.dimensions.x - this.dimensions.width/2 - token.displayWidth, this.dimensions.y - token.displayHeight, this.dimensions.width + 2*token.displayWidth, this.dimensions.height)
        }

        this.renderButtons = () => {
            let token = this.tokenYellow.render(this.dimensions.x - this.dimensions.width/2, this.dimensions.y, 'tokenYellow')
            let tokenBlue = this.tokenBlue.render(this.dimensions.x - this.dimensions.width/6, this.dimensions.y, 'tokenBlue')
            let tokenRed = this.tokenRed.render(this.dimensions.x + this.dimensions.width/6, this.dimensions.y, 'tokenRed')
            this.tokenGreen.render(this.dimensions.x + this.dimensions.width/2, this.dimensions.y, 'tokenGreen')

            this.genderMale.render(tokenBlue.x, tokenBlue.y + 1.5*tokenBlue.displayHeight, 'male')
            this.genderFemale.render(tokenRed.x, tokenRed.y + 1.5*tokenRed.displayHeight, 'female')
            return token
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
    }
}
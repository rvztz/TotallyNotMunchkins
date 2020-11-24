import Phaser from 'phaser'

export default class Log {
    constructor(scene) {
        this.lengthLimit = 30
        this.content = [
            "Pogmin used Stand Arrow on Pogmin",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX CEMEX",
            "Unpogmin killed Pogmin",
            "Pogmin died",
        ]
        this.isVisible = false
        this.renderedGraphics = null
        this.renderedText = null 
        this.mask = null
        this.logBackground = null
        this.upKey = null
        this.downKey = null
        this.currentY = 0


        this.logButton = scene.add.image(1280, 620, 'logBtn').setScale(0.5, 0.5).setInteractive({ cursor: 'pointer' })
        this.logButton.x -= this.logButton.displayWidth*0.75

        this.logButton.on('pointerup', () => {
            this.toggle()
        })
        
        this.render = () => {
            this.currentY = 115
            this.logBackground = scene.add.rectangle(212, 109, 855, 482, 0x999999).setAlpha(0.6).setOrigin(0, 0)
            
            this.renderedGraphics = scene.add.graphics()

            this.renderedGraphics.fillStyle(0xffffff, 1)
            this.renderedGraphics.lineStyle(4, 0x000000)
            this.renderedGraphics.fillRect(440, 110, 400, 480)
            this.renderedGraphics.strokeRect(440, 110, 400, 480)

            this.mask = new Phaser.Display.Masks.GeometryMask(scene, this.renderedGraphics)

            this.updateText()

            this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
            this.downKey.on('down', function() {
                scene.log.renderedText.y -= 40;
                scene.log.renderedText.y = Phaser.Math.Clamp(scene.log.renderedText.y, -1280, 113);
                this.currentY = scene.log.renderedText.y
            })

            this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
            this.upKey.on('down', function() {
                scene.log.renderedText.y += 40;
                scene.log.renderedText.y = Phaser.Math.Clamp(scene.log.renderedText.y, -1280, 113);
                this.currentY = scene.log.renderedText.y
            })
        }

        this.push = (newText) => {
            this.content.unshift(newText)
            if (this.content.length > this.lengthLimit) {
                this.content.pop()
            }
            if(this.isVisible) {
                this.updateText()
            }
        }

        this.toggle = () => {
            this.isVisible = !this.isVisible
            if (this.isVisible) {
                this.render()
            } else {
                this.destroy()
            }
        }

        this.destroy = () => {
            this.renderedGraphics.destroy()
            this.renderedGraphics = null

            this.renderedText.destroy()
            this.renderedText = null

            this.logBackground.destroy()
            this.logBackground = null

            this.upKey = null
            this.downKey = null
        }

        this.updateText = () => {
            if (this.renderedText) {
                this.renderedText.destroy()
            }
            this.renderedText = scene.add.text(445, this.currentY, this.content, { fontFamily: 'Avenir, Helvetica, Arial, sans-serif', color: '#000000', lineSpacing: 10, wordWrap: { width: 395 } }).setFontSize(18)
            this.renderedText.setMask(this.mask);
        }
    }
}
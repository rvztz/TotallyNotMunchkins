import io from 'socket.io-client'
import Phaser from 'phaser'

import PlayerList from '../classes/playerList'
import Selection from '../classes/selection'

export default class Lobby extends Phaser.Scene {
    constructor() {
        super({
            key: 'Lobby'
        })
    }

    init(data) {
        if (data.socket == null) {
            this.socket = io('http://localhost:3000')
            
            this.socket.emit(localStorage.getItem('roomEvent'), localStorage.getItem('roomName'))
        } else {
            this.socket = data.socket   
        }
    }
    
    preload() {
        this.load.image('playButton', 'assets/playButton.png')

        this.load.image('male', 'assets/male.png')
        this.load.image('female', 'assets/female.png')

        this.load.image('tokenYellow', 'assets/tokenYellow.png')
        this.load.image('tokenBlue', 'assets/tokenBlue.png')
        this.load.image('tokenGreen', 'assets/tokenGreen.png')
        this.load.image('tokenRed', 'assets/tokenRed.png')
    }

    create() {
        /*======================INITIAL SOCKET SETUP=======================*/
        this.roomName = localStorage.getItem('roomName')
        this.socket.emit('joined', this.roomName)

        /*======================SCENE COMPONENTS CREATION=======================*/
        const screenWidth = this.scale.width
        const screenHeight = this.scale.height

        // Add lobby title
        let title = this.add.text(screenWidth/20,0, `Lobby: ${this.roomName}`, {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(60).setColor('#000')
        
        // Add player texts
        this.playerList = new PlayerList(this, {x: screenWidth/2, y: title.y + title.displayHeight, width: screenWidth/4})
        this.playerList.addUsername("MVP")
        this.playerList.addUsername("unpogmin")
        this.playerList.addUsername("steve from maincra")
        this.playerList.addUsername("pogmin")

        // Adds token and gender selection buttons
        this.selection = new Selection(this, {x: screenWidth/2, y: this.playerList.dimensions.y + this.playerList.dimensions.height + 100, width: screenWidth/5})        
        this.selection.render()

        // Add play button
        let playButton = this.add.image(screenWidth/2, 4*screenHeight/5, 'playButton').setInteractive({ cursor: 'pointer' })

        /*======================PHASER EVENTS=======================*/
        playButton.on('pointerup', () => {
            this.socket.emit('startGame', this.roomName)
        })

        /*======================SOCKET.IO EVENTS=======================*/
        this.socket.on('startGame', (playerList) => {
            this.scene.start('GameScene', {socket: this.socket, roomName: this.roomName, playerList: playerList})
        })

        this.socket.on('updateTokenSelections', (availableTokens) => {
            this.selection.updateTokens(availableTokens)
        })
    }

    update() {

    }
}
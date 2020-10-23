import io from 'socket.io-client'
import Phaser from 'phaser'

import PlayerList from '../classes/playerList'

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
        this.load.image('pogmin', 'assets/Pogmin.jpg')
        this.load.image('playButton', 'assets/playButton.png')
    }

    create() {
        const screenWidth = this.scale.width
        const screenHeight = this.scale.height

        this.roomName = localStorage.getItem('roomName')

        // Add lobby title
        let title = this.add.text(screenWidth/20,0, 'Game Lobby', {fontFamily: 'Avenir, Helvetica, Arial, sans-serif'}).setFontSize(60).setColor('#000')
        
        //Add player texts
        this.playerList = new PlayerList(this, {x: screenWidth/2, y: title.y + title.displayHeight, width: screenWidth/4})
        this.playerList.addUsername("MVP")
        this.playerList.addUsername("unpogmin")
        this.playerList.addUsername("steve from maincra")
        this.playerList.addUsername("pogmin")

        // Add play button
        let playButton = this.add.image(screenWidth/2, 4*screenHeight/5, 'playButton').setInteractive({ cursor: 'pointer' })

        /*======================PHASER EVENTS=======================*/
        playButton.on('pointerup', () => {
            this.socket.emit('startGame', this.roomName)
        })

        /*======================SOCKET.IO EVENTS=======================*/
        this.socket.on('startGame', (socketList) => {
            this.scene.start('GameScene', {socket: this.socket, roomName: this.roomName, socketList: socketList})
        })
    }

    update() {

    }
}
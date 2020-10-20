import Phaser from 'phaser'
import GameScene from './scenes/gamescene.js'
import Lobby from './scenes/lobby.js'

function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        backgroundColor: 0xffffff,
        scene: [
            Lobby,
            GameScene
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            width: '100%',
            height: '90%'
        }
    })
}

export default launch
export { launch }
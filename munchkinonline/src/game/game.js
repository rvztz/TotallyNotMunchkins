import Phaser from 'phaser'
import GameScene from './scenes/gamescene.js'
// import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js'

function launch(containerId) {
    return new Phaser.Game({
        type: Phaser.AUTO,
        parent: containerId,
        backgroundColor: 0xffffff,
        scene: [
            GameScene
        ],
        scale: {
            mode: Phaser.Scale.FIT,
            width: '100%',
            height: '90%'
        },
        plugins: {
            scene: [{
                key: 'rexBoard',
                plugin: rexboardplugin,
                mapping: 'rexBoard'
            }
            ]
        }
    })
}

export default launch
export { launch }
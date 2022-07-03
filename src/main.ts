import Phaser, { Game } from 'phaser'

import GameScene from './scenes/GameScene'
//create game sene to import variables for config.
const gameScene = new GameScene()

let { maxImageWidth, gameHeight, offsetX, cardNum } = gameScene.getParams()
let w = maxImageWidth * cardNum;
w += (offsetX * 2);
const config: Phaser.Types.Core.GameConfig = {
	width: w,
	height: gameHeight,
	backgroundColor: 0xd0d0d0,
	parent: 'gameDiv',
	scene: [GameScene],
}

export default new Phaser.Game(config)

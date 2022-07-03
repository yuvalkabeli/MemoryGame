import Phaser from 'phaser'
import { CardType } from '~/types/SceneTypes';
import { correctGuessAlert, endGameAlert, startGameAlert, wrongGuessAlert } from '~/alerts/alerts';
export default class GameScene extends Phaser.Scene {
    turns = 6;
    numOfMatched = 0;
    canMove = true;
    chosenCards: CardType[] = [];
    cardNum = 6;
    maxImageWidth = 256 / 2;
    maxImageHeight = 233 / 2;
    offsetX = 10;
    gameHeight = this.maxImageHeight * 4;

    boardArray!: CardType[][];
    turnsText!: Phaser.GameObjects.Text;

    constructor() {
        super('GameScene')
    }
    public getParams(): any {
        return {
            maxImageWidth: this.maxImageWidth,
            cardNum: this.cardNum,
            gameHeight: this.gameHeight,
            offsetX: this.offsetX
        }
    }
    preload() {
        const imagesArray = ['bg', 'header', 'cardBack', 'broom', 'ghost', 'hat', 'pot', 'potion', 'candy']
        for (let imageName of imagesArray) {
            this.load.image(imageName, `images/${imageName}.png`)
        }

    }

    create() {
        this.turnsText = this.add.text(16, 16, 'turns left:' + this.turns, { fontSize: '15px', color: 'blue' });
        this.add.image(400, 300, 'bg')
        startGameAlert();


        //setup for header
        let x = Number(this.game.config.width) / 2;
        let y = 32;
        this.add.image(x, y, 'header');

        let cardArray = ['candy', 'pot', 'potion', 'ghost', 'broom', 'hat'];

        let shuffleArray: string[][] = [];
        for (let row = 0; row < 2; row++) {
            shuffleArray[row] = [];

            for (let col = 0; col < this.cardNum; col++) {
                // the value we will use to compare later
                let cardValue: string = cardArray[col];

                shuffleArray[row][col] = cardValue;
            }
        }
        // now do a simple shuffle
        for (let n = 0; n < 100; n++) {
            let rowA = Phaser.Math.Between(0, 1);
            let colA = Phaser.Math.Between(0, this.cardNum - 1);

            let rowB = Phaser.Math.Between(0, 1);
            let colB = Phaser.Math.Between(0, this.cardNum - 1);

            let temp: string = shuffleArray[rowA][colA];
            shuffleArray[rowA][colA] = shuffleArray[rowB][colB];
            shuffleArray[rowB][colB] = temp;
        }

        // create an array that will hold our board values
        this.boardArray = [];

        // the first one will be at coordinate x:266, y:160
        x = Number(this.game.config.width) / 2;
        y = (Number(this.game.config.height) / 2) - (this.maxImageHeight / 2);

        for (let row = 0; row < 2; row++) {
            this.boardArray[row] = [];

            for (let col = 0; col < this.cardNum; col++) {
                let theCardValue: string = shuffleArray[row][col];

                // calculate the x offset for each image
                x = this.offsetX + (this.maxImageWidth * col) + (this.maxImageWidth / 2);

                let cardBack: Phaser.GameObjects.Image = this.add.image(x, y, 'cardBack');
                cardBack.setScale(0.5);
                cardBack.alpha = 1;
                cardBack.depth = 20;

                let card: Phaser.GameObjects.Image = this.add.image(x, y, theCardValue);
                card.setScale(0.5);
                card.depth = 10;

                this.boardArray[row][col] = {
                    cardSelected: false,
                    cardValue: shuffleArray[row][col],
                    cardBackSprite: cardBack,
                }
            }

            y += this.maxImageHeight;
        }
        this.input.on('pointerdown', this.handleMouseDown, this);


    }
    handleMouseDown(mousePointer: { y: number; x: number; }) {
        if (!this.canMove) {
            return;
        }

        let w = this.maxImageWidth;

        // determine where the user clicked on our game canvas
        // 		the x coord will start at 0 and continue for the width of 
        // 			the game canvas
        // 		but y coord will start at the middle of the game canvas
        let row = Math.floor(mousePointer.y / (this.gameHeight / 2));
        let col = Math.floor((mousePointer.x - this.offsetX) / w);

        row = row < 0 ? row = 0 : row;
        row = row > 1 ? row = 1 : row;

        col = col < 0 ? col = 0 : col;
        col = col > 5 ? col = 5 : col;

        let obj = this.boardArray[row][col];

        // if this card is already displayed 
        if (obj.cardSelected == true) {
            return;
        }
        // make the cardBackSprite of the selectd object  transparent
        obj.cardBackSprite.alpha = 0;
        obj.cardSelected = true;

        // save the selected object
        this.chosenCards.push(obj);

        if (this.chosenCards.length > 1) {
            this.canMove = false;

            // compare the card values
            let g1 = this.chosenCards[0].cardValue;
            let g2 = this.chosenCards[1].cardValue;

            if (g1 == g2) {
                // match
                this.chosenCards.length = 0;
                this.numOfMatched++;
                this.canMove = true;
                correctGuessAlert()
            } else {
                // no match

                this.time.addEvent({
                    delay: 2000,
                    callbackScope: this,
                    callback: () => {
                        for (let n = 0; n < this.chosenCards.length; n++) {
                            this.chosenCards[n].cardBackSprite.alpha = 1;

                            this.chosenCards[n].cardSelected = false;
                        }

                        this.chosenCards.length = 0;
                        this.canMove = true;
                    },
                });
                this.turns--;
                this.turnsText.setText(`turns left:${this.turns}`);
                wrongGuessAlert()
            }
        }
        if (this.numOfMatched == this.cardNum || this.turns === 0) {
            const restartGame = () => this.scene.start('GameScene');
            if (this.numOfMatched == this.cardNum) {
                endGameAlert(restartGame, true)
            }
            if (this.turns === 0) {
                endGameAlert(restartGame, false)
            }
            this.numOfMatched = 0;
            this.turns = 6;
            this.canMove = true;
            this.chosenCards.length = 0;
        }


    }

}

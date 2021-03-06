import './index.html';
import PIXI from 'pixi.js';
import BoardContainer from './boardcontainer.js';

const GAME_WIDTH = 800, GAME_HEIGHT = 7/8 * GAME_WIDTH;
const RATIO = GAME_WIDTH/1301;
const renderer = PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT, {
  antialiasing: false,
  transparent: false,
  resolution: window.devicePixelRatio,
  autoResize: true,
  backgroundColor: 0x999999
});

document.body.appendChild(renderer.view);


class Stage extends PIXI.Container {
  constructor(...args) {
    super(...args);
    this.interactive = true;
    const board = new BoardContainer();
    this.board = board;
    this.addHeader();
    this.addChild(board);
  }

  animate() {
    return this.board.animatePiece();
  }

  askForReset(winner) {
    // Draw game finish, restart screen

    winner = (winner == 'bot')?'I win!':'You win!';
    const restartContainer = new PIXI.Container();
    restartContainer.name = 'restartContainer';
    restartContainer.interactive = true;

    const layer = new PIXI.Graphics();
    layer.beginFill(0x812390, 1);
    layer.drawRect(0, 0, renderer.width, renderer.height);
    layer.alpha = 0.8;
    restartContainer.addChild(layer);

    const text = new PIXI.Text(`${winner} Restart Game?`, {
      font : 'bold 80px Courier',
      fill : '#889199',
      stroke : '#4a1850',
      strokeThickness : 5,
      dropShadow : true,
      dropShadowColor : '#000000',
      dropShadowAngle : Math.PI/6,
      dropShadowDistance : 6,
      wordWrap : true,
      wordWrapWidth : 440
    });
    text.interactive = true;
    text.anchor.x = 0.5;
    text.anchor.y = 0.5;
    text.x = renderer.width/2;
    text.y = renderer.height/2;
    restartContainer.addChild(text);
    text.on('mousedown', this.onDownHandler());
    text.on('touchstart', this.onDownHandler());

    this.addChild(restartContainer);
  }

  onDownHandler() {
    const self = this;
    return function() {
      self.restartGame();
    }
  }

  restartGame() {
    this.removeChild(this.getChildByName('restartContainer'));
    this.board.resetGame();
  }

  addHeader() {
    // draw game header

    const header = new PIXI.Text('Connect 4', {
      font : 'bold 50px Courier',
      fill : '#910239',
      stroke : '#4a1850',
      strokeThickness : 5,
      dropShadow : true,
      dropShadowColor : '#000000',
      dropShadowAngle : Math.PI/6,
      dropShadowDistance : 6,
      wordWrap : true,
      wordWrapWidth : 440
    });

    header.anchor.x = 0.5;
    header.y = 20;
    header.x = renderer.width/2;
    this.addChild(header);
  }

// End class
}

const stage = new Stage();

function resize(){
  stage.scale.x = stage.scale.y = (RATIO*window.innerWidth/GAME_WIDTH);
  renderer.resize(Math.ceil(window.innerWidth * RATIO),
                  Math.ceil(window.innerWidth * RATIO * 7/8));
}

function animate() {
  const winner = stage.animate();
  if(winner)
    stage.askForReset(winner);
  renderer.render(stage);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
resize();
animate();

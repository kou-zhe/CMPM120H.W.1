class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('0.mp3', './assets/0.mp3');
        this.load.audio('2.mp3', './assets/2.mp3');
        this.load.audio('5.mp3', './assets/5.mp3');
        this.load.audio('3.mp3', './assets/3.mp3');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.image('bg','./assets/bg.png');

    }

    create() {
        // menu text configuration
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px Arial',
            backgroundColor: 'orange',
            color: 'blue',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        this.add.image(640,200,'bg');
        
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'Yasuo Patrol', menuConfig).setOrigin(0.5,5);
        menuConfig.fontSize = '18px Arial';
        this.add.text(game.config.width/2, game.config.height/2, 'Use ←→ arrows to move & (F) to do Sweeping Blade', menuConfig).setOrigin(0.5,-1);
        menuConfig.backgroundColor = 'grey';
        menuConfig.color = '#000';
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5,-2);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // Novice mode
          game.settings = {
            spaceshipSpeed: 3,
            gameTimer: 60000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // Expert mode
          game.settings = {
            spaceshipSpeed: 6,
            gameTimer: 45000    
          }
          this.sound.play('sfx_select');
          this.scene.start("playScene");    
        }
      }
}
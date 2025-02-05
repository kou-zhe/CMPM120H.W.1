class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('yasuo', './assets/yasuo.png'); //5points
        this.load.image('baron', './assets/baron.png');
        this.load.image('riven', './assets/riven.png')
        this.load.image('rift', './assets/rift.png');
        //load bgm
        this.load.audio('bgmgotime', './assets/bgmgotime.mp3') //5points bgm
        // load spritesheet
        this.load.spritesheet('explosion1', './assets/explosion1.png', { frameWidth: 84, frameHeight: 70, startFrame: 0, endFrame: 12 });
    }

    create() { 
        this.LastBreathText = this.add.text(440, borderUISize + borderPadding + 40, 'Last Breath(R): ');
        //Allow the player to control the Rocket after it's fired (5)
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'rift').setOrigin(0, 0);

        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width / 2, game.config.height - borderUISize - borderPadding - 20, 'yasuo').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'baron', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'baron', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'baron', 0, 10).setOrigin(0, 0);
        //add Spaceship04
        this.ship04 = new Spaceship(this, game.config.width + borderUISize * 8, borderUISize * 4, 'riven', 0, 100).setOrigin(0, 0);
        this.ship04.moveSpeed = 10;
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion1', { start: 0, end: 12, first: 0 }),
            frameRate: 30
        });

        // initialize score

        this.p1Score = 0;
        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '15px',
            //backgroundColor: '#000000',
            color: '#843605', // color hex code: black
            align: 'left',
            padding: {  // set the size of the display box
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }



        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.topScoreText = this.add.text(borderUISize + 300, borderUISize + borderPadding + 10, 'Top:', scoreConfig);
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.topScoreLeft = this.add.text(borderUISize + 450, borderUISize + borderPadding + 10,
            localStorage.getItem("RocketPatrolTopScore"), scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.bgm.stop();
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        this.bgm = this.sound.add('bgmgotime', {
            mute: false,
            volume: 0.7,
            rate: 1,
            loop: true,
            delay: 0
        });
        this.firecount = 0;
        this.fireText = this.add.text(borderUISize + 200, borderUISize + borderPadding + 10, 'Fire!' , textConfig);
        this.bgm.play();
        
    }

    update() {
        // check key input for restart / menu
        if (this.p1Rocket.isFiring){
            this.fireText.setVisible(true);

        }else {
            this.fireText.setVisible(false);
        }
        
        if (this.p1Rocket.firecount) {
           
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.starfield.tilePositionX -= 4;  // update tile sprite

        if (!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (Phaser.Input.Keyboard.JustDown(keyR)) { 
            let ships = [
                this.ship01,
                this.ship02,
                this.ship03,
                this.ship04
            ];

            let randomShip = ships[Math.floor(Math.random() * ships.length)];
            this.p1Rocket.reset();
            this.shipExplode(randomShip);
        }
        
    }
    
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion1').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.p1Score += ship.points;
        if (this.p1Score > localStorage.getItem("RocketPatrolTopScore")) {
            localStorage.setItem("RocketPatrolTopScore", this.p1Score);
            this.topScoreLeft.text = localStorage.getItem("RocketPatrolTopScore");
        }
        this.scoreLeft.text = this.p1Score;
        let soundFXLib = [
            '0.mp3',
            '2.mp3',
            '3.mp3',
            '5.mp3'
        ];
        let random4SoundFX = Math.floor(Math.random() * soundFXLib.length);
        this.sound.play(soundFXLib[random4SoundFX]);



    }
}
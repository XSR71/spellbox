enchant();

window.onload = function () {
    game = new Game(320, 160);
    game.fps = 60;
    game.width = 320;
    game.height = 160;
    game.keybind('32', 'a');
    game.keybind('13', 'b');

    game.score = 0;
    game.touched = false;

    game.preload('graphic.png', 'effect0.gif', 'icon0.png', 'font0.png', 'boxes.png');

    game.onload = function () {
        player = new Player(144, 64);
        game.rootScene.backgroundColor = 'black';

        game.rootScene.addEventListener('enterframe', function () {
            
        });
    };
    game.start();
};

var Trail = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y) {
        enchant.Sprite.call(this, 16, 16);
        this.image = game.assets['icon0.png'];
        this.x = x - this.width/2;
        this.y = y - this.height/2;
        this.frame = 47;

        this.addEventListener('enterframe', function () {
            this.opacity = 1 - this.age / game.fps;

            if (this.age == game.fps) {
                game.rootScene.removeChild(this);
            }
        });

        game.rootScene.addChild(this);
    }
});

var Player = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y) {
        enchant.Sprite.call(this, 32, 32);
        this.image = game.assets['boxes.png'];
        this.x = x;
        this.y = y;
        this.frame = [0];
        this.speed = 10;
        this.autoDirectionX = 0;
        this.autoDirectionY = 0;
        this.autoMove = 0;
        this.touched = false;


        /*
        game.rootScene.addEventListener('touchstart', function (e) {
            player.y = e.y;
            game.touched = true;
        });
        game.rootScene.addEventListener('touchmove', function (e) {
            player.y = e.y;
        });
        game.rootScene.addEventListener('touchend', function (e) {
            player.y = e.y;
            game.touched = false;
        });
        */

        game.rootScene.addEventListener('bbuttondown', function (e) {
            if (player.autoMove) {
                player.autoMove = 0;
            } else {
                player.autoMove = 1;
                var x = Math.floor((Math.random()*3)-1);
                var y = Math.floor((Math.random()*3)-1);
                if (x == 0 && y == 0) {
                    x = 1;
                }
                player.autoDirectionX = x;
                player.autoDirectionY = y;
            }
        });

        this.addEventListener('enterframe', function () {
            if (game.input.left) {
                this.x += -this.speed;
            }
            if (game.input.right) {
                this.x += this.speed;
            }
            if (game.input.down) {
                //this.y += this.speed;
            }
            if (game.input.up) {
                //this.y += -this.speed;
            }

            // Boundary detection
            if (this.x <= 0) {
                this.x = 0;
                this.autoDirectionX = 1;
            }

            if (this.x + this.width >= game.width) {
                this.x = game.width - this.width;
                this.autoDirectionX = -1;
            }

            if (this.y <= 0) {
                this.y = 0;
                this.autoDirectionY = 1;
            }

            if (this.y + this.height >= game.height) {
                this.y = game.height - this.height;
                this.autoDirectionY = -1;
            }

            // Movement
            if (game.input.a) {
                this.scaleX = 2;
                this.scaleY = 2;
            } else {
                if ((this.scaleX > 1 || this.scaleY > 1) && game.frame % 10 == 0) {
                    this.scaleX = 1;
                    this.scaleY = 1;
                }
            }

            // Auto Movement
            if (this.autoMove) {
                var trail = new Trail(this.x + this.width/2, this.y + this.height/2);

                this.x += this.speed * this.autoDirectionX;
                this.y += this.speed * this.autoDirectionY;
            }


            /*
            if(game.touched && game.frame % 3 == 0) {
                var s = new PlayerShoot(this.x, this.y);
            }
            */
        });

        game.rootScene.addChild(this);
    }
});


enchant();

window.onload = function () {
    game = new Game(320, 320);
    game.opacity = 1.0; //For debugging

    game.fps = 60;
    game.width = 320;
    game.height = 320;
    game.chocSize = 16;
    game.fruitSize = 16;
    game.playerSize = 32;
    game.keybind('32', 'a');
    game.keybind('13', 'b');
    // game.scale = 1;

    game.score = 0;
    game.fat = 0;
    game.touched = false;
    game.msg = new Label();
    game.msg.opacity = game.opacity;
    game.chocs = 0;

    game.preload('graphic.png', 'effect0.gif', 'icon0.png', 'font0.png', 'boxes.png');

    game.onload = function () {
        player = new Player(game.width/2, game.height-game.playerSize);
        chocs = new Array();
        fruits = new Array();

        game.rootScene.backgroundColor = 'white';

        game.rootScene.addEventListener('enterframe', function () {
            // Spawns chocolate - yummy
            if(game.frame % 25 == 0) {
                var x = rand(game.width)+1; //0 to 320(inclusive)
                var lanes = Math.floor(game.width/game.chocSize); //This is why is better to use a width multiple of 16
                x = x % lanes * game.chocSize;
                var choc = new Choc(x, 0, game.chocSize);
                choc.key = game.frame;
                chocs[choc.key] = choc;
                game.chocs++;
            }

            // Spawns fruit
            if(game.frame % 40 == 0) {
                var x = rand(game.width)+1; //0 to 320(inclusive)
                var lanes = Math.floor(game.width/game.fruitSize); //This is why is better to use a width multiple of 16
                x = x % lanes * game.fruitSize;
                var fruit = new Fruit(x, 0, game.fruitSize);
                fruit.key = game.frame;
                fruits[fruit.key] = fruit;
            }

            game.msg.text = " Score: " + game.score + " Fat: " + game.fat;

            // Game over
            if (game.fat > 4) {
                game.msg.text = "Game over! Final Score: " + game.score;
                game.stop();
            }

        });

        game.rootScene.addChild(game.msg);
    };
    game.start();
};

var Fruit = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y, size) {
        enchant.Sprite.call(this, size, size);
        this.image = game.assets['icon0.png'];
        this.x = x;
        this.y = y;
        this.frame = 15 + rand(4); //15,16,17,18
        this.speed = 1;
        this.opacity = game.opacity;

        this.addEventListener('enterframe', function () {
            this.y += this.speed;
            if(this.y > game.height || this.x > game.width || this.x < -this.width || this.y < -this.height) {
                this.remove();
            } 

        });

        game.rootScene.addChild(this);
    },

    remove: function () {
        game.rootScene.removeChild(this);
        delete fruits[this.key];
    }
});

var Choc = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y, size) {
        enchant.Sprite.call(this, size, size);
        this.image = game.assets['icon0.png'];
        this.x = x;
        this.y = y;
        this.frame = 24;
        this.speed = 1;
        this.opacity = game.opacity;

        this.addEventListener('enterframe', function () {
            this.y += this.speed;
            if(this.y > game.height || this.x > game.width || this.x < -this.width || this.y < -this.height) {
                this.remove();
            } 

        });

        game.rootScene.addChild(this);
    },

    remove: function () {
        game.rootScene.removeChild(this);
        delete chocs[this.key];
        game.chocs--;
    }
});

var Player = enchant.Class.create(enchant.Sprite, {

    initialize: function (x, y) {
        enchant.Sprite.call(this, 32, 32);
        this.image = game.assets['boxes.png'];
        this.x = x;
        this.y = y;
        this.frame = [0];
        this.speed = 3;
        this.autoDirectionX = 0;
        this.autoDirectionY = 0;
        this.autoMove = 0;
        this.touched = false;
        this.opacity = game.opacity;

        this.addEventListener('enterframe', function () {
            if (game.input.left) {
                this.x += -this.speed;
            }
            if (game.input.right) {
                this.x += this.speed;
            }

            this.testBoundary();
            this.testCollision();

            this.scaleX = 1 + game.fat/10;
        });

        game.rootScene.addChild(this);
    },


    testBoundary: function () {
        // Boundary detection
        if (this.x <= 0) {
            this.x = 0;
        }

        if (this.x + this.width >= game.width) {
            this.x = game.width - this.width;
        }

        if (this.y <= 0) {
            this.y = 0;
        }

        if (this.y + this.height >= game.height) {
            this.y = game.height - this.height;
        }
    },

    testCollision: function () {
        for (var i in chocs) {
            if(chocs[i].intersect(this)) {
                chocs[i].remove();
                game.fat += 1;
            }
        }
        for (var i in fruits) {
            if(fruits[i].intersect(this)) {
                fruits[i].remove();
                game.score += 1;
            }
        }
    }

});

function rand(num) {
    return Math.floor(Math.random() * num);
}

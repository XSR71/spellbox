enchant();

window.onload = function() {
    var game = new Game(320, 320);
    game.fps = 20;
    game.preload('chara1.png', 'map0.png');
    game.onload = function() {
        var map = new Map(16, 16);
        map.image = game.assets['map0.png'];
        map.loadData(
            [
                [8, 8, 8, 8, 8, 8, 8],
                [8, 7, 7, 7, 7, 7, 8],
                [8, 7, 8, 7, 8, 7, 8],
                [8, 7, 7, 7, 7, 7, 8],
                [8, 7, 8, 7, 8, 7, 8],
                [8, 7, 7, 7, 7, 7, 8],
                [8, 8, 8, 8, 8, 8, 8]
            ]
        );
        game.rootScene.addChild(map);

        bear = new Sprite(32, 32);
        bear.image = game.assets["chara1.png"];
        bear.x = 0;
        bear.y = 0;
        bear.frame = 5;
        game.rootScene.addChild(bear);
        bear.addEventListener("enterframe", function(){
            this.x += 1;
            this.frame = this.age % 2 + 6;
        });
        bear.addEventListener("touchstart", function(){
            this.x += -10;
        });

    };
    game.start();
};

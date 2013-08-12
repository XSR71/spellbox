enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.onload = function() {
        var label = new enchant.Label();
        label.text = "Hello test!";
        //label.width = 128;
        //label.height = 64;
        label.font = "20px 'Sans'";
        game.rootScene.addChild(label);
    }
    game.start();
}
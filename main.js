(function() {
    self.Board = function(width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = true;
    }

    self.Board.prototype = {
        get elements() {
            var elements = this.bars.map(function(bar) {
                return bar;
            });
            elements.push(this.ball);
            return elements;
        }
    }
})();

(function() {
    self.Bar = function(x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 10;
    }
    self.Bar.prototype = {
        down: function() {
            this.y += this.speed;
        },
        up: function() {
            this.y -= this.speed;
        },
        toString: function() {
            return "x: " + this.x + " y: " + this.y;
        }
    }
})();

(function() {
    self.BoardView = function(canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = this.canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function() {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function() {
            for (var i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el);
            }
        },
        play: function() {
            this.clean();
            this.draw();
        }
    }

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height)
                break;
        }
    }
})();

var board = new Board(800, 400);
var bar = new Bar(0, 150, 20, 100, board);
var bar_2 = new Bar(780, 150, 20, 100, board);
var canvas = document.getElementById("canvas");
var board_view = new BoardView(canvas, board);
var ball = new Ball(400, 200, 10, board);

document.addEventListener("keydown", function(ev) {

    if (ev.keyCode == 38) {
        ev.preventDefault();
        bar.up();
    } else if (ev.keyCode == 40) {
        ev.preventDefault();
        bar.down();
    } else if (ev.keyCode == 87) {
        ev.preventDefault();
        //W
        bar_2.up();
    } else if (ev.keyCode == 83) {
        ev.preventDefault();
        //S
        bar_2.down();
    } else if (ev.keyCode == 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
})

window.requestAnimationFrame(controller);

window.addEventListener("load", main);

function controller() {
    board_view.play();

    window.requestAnimationFrame(controller);
}
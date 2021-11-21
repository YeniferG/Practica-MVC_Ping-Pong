// Esta funcion es la configuracion del juego
var player1 = document.getElementById("pj1");
var player2 = document.getElementById("pj2");
// Puntaje -tratamiento de puntaje y ganador
var score1 = player1.innerHTML = 0;
var score2 = player2.innerHTML = 0;
const limite = 5;

function score(player) {
    if (player == 1) {
        score1++;
        player1.innerHTML = score1;
    } else {
        score2++;
        player2.innerHTML = score2;
    }
}

function winner(player) {
    if (player == 1) {
        alert("Ganó el jugador 1");
        score1 = 0;
        location.reload();
    } else {
        alert("Ganó el jugador 2");
        score2 = 0;
        location.reload();
    }
}

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
    self.Ball = function(x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }

    self.Ball.prototype = {
        move: function() {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);

            // score- tratamiento puntage 
            if (score1 == limite) { winner(1); } else if (score2 == limite) { winner(2); }

            if (this.x <= 10) {
                score(2);
                this.x = 400;
                this.y = 200;
                this.speed_x = -this.speed_x;
                this.bounce_angle = -this.bounce_angle;
            }
            if (this.x >= 790) {
                score(1);
                this.x = 400;
                this.y = 200;
                this.speed_x = -this.speed_x;
                this.bounce_angle = -this.bounce_angle;
            }

            if (this.y <= 10) {
                this.speed_y = -this.speed_y;
                this.bounce_angle = -this.bounce_angle;
            }
            if (this.y >= 390) {
                this.speed_y = -this.speed_y;
                this.bounce_angle = -this.bounce_angle;
            }
        },
        get width() {
            return this.radius * 2;
        },
        get height() {
            return this.radius * 2;
        },
        collision: function(bar) {
            //Reacciona a la colision con una barra que recibe como parametro
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
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
        check_collisions: function() {
            for (var i = this.board.bars.length - 1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function() {
            if (!this.board.playing) {
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }

    function hit(a, b) {
        //Revisa si a colisiona con b
        var hit = false;
        //colisiones horizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            //Colisiones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }
        //Colision de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }
        //Colision de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit = true;
            }
        }
        return hit;
    }

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height)
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
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
        if (bar_2.y >= 10) {
            bar_2.up(); // Se mueve la barra hacia arriba
        }
    } else if (ev.keyCode == 40) {
        ev.preventDefault();
        if (bar_2.y <= 290) {
            bar_2.down(); // Se mueve la barra hacia abajo
        }
    } else if (ev.keyCode == 87) {
        //W
        ev.preventDefault();
        if (bar.y >= 10) {
            bar.up(); // Se mueve la segunda barra hacia arriba
        }

    } else if (ev.keyCode == 83) {
        //S
        ev.preventDefault();
        if (bar.y <= 290) {
            bar.down(); // Se mueve la segunda barra hacia abajo
        }
    } else if (ev.keyCode == 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
})

board_view.draw();

window.requestAnimationFrame(controller);

function controller() {
    board_view.play();

    window.requestAnimationFrame(controller);
}
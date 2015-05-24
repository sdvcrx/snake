(function () {

  var browserWidth = window.innerWidth;
  var browserHight = window.innerHeight;

  var canvas = document.getElementById('game');
  var c = canvas.getContext('2d');
  var gameLoop;

  canvas.width = browserWidth;
  canvas.height = browserHight;

  var gameStatus = {
    width: browserWidth,
    height: browserHight,
    direction: 'down',
    paused: false,
    speed: 15
  };

  function GameEvents() {
    var listen, remove, trigger;
    var obj = {};
    var self = this;

    return {
      listen: function(key, eventfn) {
        obj[key] = obj[key] || [];
        return obj[key].push(eventfn);
      },

      remove: function(key) {
        var stack = obj[key];
        return stack != null ? stack.length = 0 : void 0;
      },

      trigger: function() {
        var stack, eventfn;
        var key = Array.prototype.shift.call(arguments);
        stack = obj[key] || [];
        for (var i = 0, len = stack.length; i < len; i++) {
          fn = stack[i];
          if (fn.apply(self, arguments) === false) {
            return false;
          }
        }
      }
    };
  }

  var gameEvents = GameEvents();

  // canvas init
  function draw(c) {
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
  }

  var Food, Snake;

  Food = (function () {
    function Food(width, height, size) {
      if (size == null) {
        size = 10;
      }
      this._size = size;
      this.x = Math.round(Math.random() * (width - size) / size);
      this.y = Math.round(Math.random() * (height - size) / size);
    }

    Food.prototype.draw = function(context) {
      context.fillStyle = 'white';
      context.fillRect(this.x * this._size, this.y * this._size, this._size, this._size);
    };

    return Food;
  })();

  Snake = (function () {
    function Snake(width, height, context, size) {
      if (size == null) {
        this._size = 10;
      }
      this._width = width;
      this._height = height;
      var length = 10;
      this._snake = [];
      for (var i = length; i >= 0; i--) {
        this._snake.push({x: i, y: 0});
      }
    }

    Snake.prototype.draw = function(context) {
      for (var i = 0, len = this._snake.length; i < len; i++) {
        var s = this._snake[i];
        context.fillStyle = 'white';
        context.fillRect(s.x * this._size, s.y * this._size, this._size, this._size);
      }
      return this;
    };

    Snake.prototype.crawl = function(direction) {
      var head_x = this._snake[0].x;
      var head_y = this._snake[0].y;
      switch (direction) {
        case 'up':
          head_y--;
          break;
        case 'down':
          head_y++;
          break;
        case 'left':
          head_x--;
          break;
        case 'right':
          head_x++;
          break;
        default:
          break;
      }

      // Move
      var tail = this._snake.pop();
      tail.x = head_x;
      tail.y = head_y;
      this._snake.unshift(tail);

      // If hit the wall
      if (head_x >= this._width/this._size || head_x <= -1 ||
          head_y >= this._height/this._size || head_y <= -1) {
        gameEvents.trigger('stop');
      }

      // If hit the food
      // TODO: Add Score
      if (head_x === food.x && head_y === food.y) {
        console.log(this._snake.length);
        this._snake.unshift({ x: head_x, y: head_y });
        gameEvents.trigger('stop');
        food = new Food(canvas.width, canvas.height);
        if (gameStatus.speed <= 50) {
          gameStatus.speed += 2;
        }
        gameEvents.trigger('start');
      } else {
        for (var i = 1, len = this._snake.length; i < len; i++) {
          var s = this._snake[i];
          if (head_x === s.x && head_y === s.y) {
            gameEvents.trigger('fail');
          }
        }
      }
    };

    return Snake;
  })();


  var food = new Food(canvas.width, canvas.height);
  var snake = new Snake(canvas.width, canvas.height);

  gameEvents.listen('start', function() {
    if (gameStatus.paused === true) {
      gameStatus.paused = false;
    }
    gameLoop = setInterval(function() {
      draw(c);
      food.draw(c);
      snake.crawl(gameStatus.direction);
      snake.draw(c);
    }, 1000/gameStatus.speed);
  });

  gameEvents.listen('stop', function() {
    if (gameLoop !== undefined) {
      clearInterval(gameLoop);
    }
  });

  gameEvents.listen('fail', function() {
    if (gameLoop !== undefined) {
      clearInterval(gameLoop);
    }
  });

  gameEvents.listen('pause', function() {
    if (gameStatus.paused === false && gameLoop !== undefined) {
      gameStatus.paused = true;
      clearInterval(gameLoop);
    }
  });

  gameEvents.trigger('start');

  document.addEventListener('keyup', function(event) {
    event.preventDefault();
    switch (event.which) {
      // UP
      case 38:
        if (gameStatus.direction !== 'up' && gameStatus.direction !== 'down') {
          gameStatus.direction = 'up';
        }
        break;
        // DOWN
      case 40:
        if (gameStatus.direction !== 'up' && gameStatus.direction !== 'down') {
          gameStatus.direction = 'down';
        }
        break;
        // LEFT
      case 37:
        if (gameStatus.direction !== 'left' && gameStatus.direction !== 'right') {
          gameStatus.direction = 'left';
        }
        break;
        // RIGHT
      case 39:
        if (gameStatus.direction !== 'left' && gameStatus.direction !== 'right') {
          gameStatus.direction = 'right';
        }
        break;
        // SPACE
      case 32:
        // Pause if click space
        if (gameStatus.paused === true) {
          gameEvents.trigger('start');
        } else {
          gameEvents.trigger('pause');
        }
        break;
    }
  });

})();

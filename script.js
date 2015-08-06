// general class function
var Class = function() {
    return function() {
        this.constructor.apply(this, arguments);
    };
};

// TODO: mache Geschwindigkeit abhängig von Masse!
// TODO: Anziehungskraft!
// TODO: mache Einsaugen nicht direkt bei Kollision
// TODO: fix canvas size
// TODO: Vererbung für Player Class fixen -> remove redundant code
// TODO: set max velocity
// TODO: add winning condition
// TODO: add losing condition

// Stage class
var Stage = Class();
Stage.prototype = {
    constructor: function(canvasId, canvasColor, canvasRefreshRate) {
        this.refreshRate = Math.round(1000 / canvasRefreshRate);
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.color = canvasColor;
        this.rectangle = this.canvas.getBoundingClientRect();
        this.children = [];
    },
    addChild: function(child) {
        child.stage = this;
        this.children.push(child);
    },
    removeChild: function(child) {
        var index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    },
    // repaint the canvas
    refresh: function() {
        this.context.fillStyle = this.color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].draw();
        };
    },
    // internal update function
    update: function() {
        /*
    for( var i = 0; i < this.children.length; i++ ) {
        this.children[i].update();
        this.children[i].checkBoundaryCollision();
    };
    */
        for (var i = 0; i < this.children.length; i++) {
            var blob1 = this.children[i];
            for (var j = i + 1; j < this.children.length; j++) {
                var blob2 = this.children[j];
                var dX = blob2.x - blob1.x;
                var dY = blob2.y - blob1.y;
                var distance = Math.sqrt((dX * dX) + (dY * dY));
                if (distance < blob1.radius + blob2.radius) {
                    if (blob1.mass > blob2.mass) {
                        blob1.mass += blob2.mass * 0.2;
                        blob2.destroy();
                    } else if (blob2.mass > blob1.mass) {
                        blob2.mass += blob1.mass * 0.2;
                        blob1.destroy();
                    } else {
                    // TODO
                    }
                }
            }
            this.children[i].update();
            this.children[i].checkBoundaryCollision();
        }
        this.refresh();
    },
    // actual game loop
    rendering: function() {
        var self = this;
        setInterval(function() {
            self.update();
        }
        , this.refreshRate);
    }
};

// Blob class
var Blob = Class();
Blob.prototype = {
    constructor: function(x, y, mass, color, vX, vY, config) {
        this.radius = mass * 0.6;
        this.mass = mass;
        this.color = color;
        this.stage = null ;
        this.x = x;
        this.y = y;
        this.vX = vX;
        this.vY = vY;
        this.config = config;
    },
    draw: function() {
        if (this.stage == null ) {
            return;
        }
        var ctx = this.stage.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    },
    update: function() {
        this.x += this.vX;
        this.y += this.vY;
        this.radius = this.mass * 0.6;
        //console.log(this.radius);
    },
    checkBoundaryCollision: function() {
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vX *= -1;
        } else if (this.x + this.radius > this.stage.canvas.width) {
            this.x = this.stage.canvas.width - this.radius;
            this.vX *= -1;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vY *= -1;
        } else if (this.y + this.radius > this.stage.canvas.height) {
            this.y = this.stage.canvas.height - this.radius;
            this.vY *= -1;
        }
    },
    destroy() {
        this.stage.removeChild(this);
        delete this;
    }
};

var Config = Class();
Config.prototype = {
  constructor: function() {
    this.enemies = 20;
    this.difficulty = "easy";
    this.fieldsize = 1000;
    this.blobsize = 0.6;
  }
}

var Player = Class();
Player.prototype = {
  constructor: function(x, y, mass, color, vX, vY, config) {
      this.radius = mass * 0.6;
      this.mass = mass;
      this.color = color;
      this.stage = null ;
      this.x = x;
      this.y = y;
      this.vX = vX;
      this.vY = vY;
      this.config = config;
      var self = this;
      window.onkeydown = function (event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
          case 38: // arrow up
              self.vY -= 1;
              break;
            case 40: // arrow down
              self.vY += 1;
              //console.log("arrow down pressed");
              break;
            case 37: // arrow left
              self.vX -= 1;
              // console.log("arrow left pressed");
              break;
            case 39: //arrow right
            self.vX += 1;
              //console.log("arrow right pressed");
              break;
            default:
            // do nothing
              break;
        };
      };
  },
  draw: function() {
      if (this.stage == null ) {
          return;
      }
      var ctx = this.stage.context;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.stroke();
  },
  update: function() {
      this.x += this.vX;
      this.y += this.vY;
      this.radius = this.mass * 0.6;
  },
  checkBoundaryCollision: function() {
      if (this.x - this.radius < 0) {
          this.x = this.radius;
          this.vX *= -1;
      } else if (this.x + this.radius > this.stage.canvas.width) {
          this.x = this.stage.canvas.width - this.radius;
          this.vX *= -1;
      }
      if (this.y - this.radius < 0) {
          this.y = this.radius;
          this.vY *= -1;
      } else if (this.y + this.radius > this.stage.canvas.height) {
          this.y = this.stage.canvas.height - this.radius;
          this.vY *= -1;
      }
  },
  destroy() {
      this.stage.removeChild(this);
      delete this;
  }
}

// main function
window.addEventListener("load", function() {
    var stage = new Stage("canvas","#ccc",60);
    var config = new Config();
    var player = new Player(200, 200, 15, "#cfa", 0, 0, config);
    for (var i = 0; i < config.enemies; i++) {
      var x = 20 + (Math.random() * (400 ));
      var y = 20 + (Math.random() * (400 ));
      var mass = 5 + Math.random() * 5;
      var vX = Math.random() * 4 - 2;
      var vY = Math.random() * 4 - 2;
      stage.addChild(new Blob(x, y, mass, "#ccc", vX, vY, config));
    }
    stage.addChild(player);
    stage.rendering();
    }
);

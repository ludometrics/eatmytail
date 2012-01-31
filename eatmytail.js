window.onload = (function() {
	var WIDTH = 512,
			HEIGHT  = 512,
			BOX_WIDTH = 16,
			BOX_HEIGHT = 16,
		  BOARD_TOP = 0,
      BOARD_LEFT = 0,
			BOARD_ROWS = 32,
			BOARD_COLS = 32;
	Crafty.init( WIDTH, HEIGHT );
	Crafty.canvas.init();
	
	Crafty.load(["snake.png", "shroom.png", "title.png"], function() {
		Crafty.sprite( 16, "snake.png", { snake: [0, 0] } );
		Crafty.sprite( 16, "shroom.png", { shroom: [0, 0] } );
		
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("url('grid.png')");
		
		var snake = Crafty.e("2D, Canvas, Mouse, Controls, Collision, snake")
			.attr( {x: BOARD_ROWS / 2 * 16, y: BOARD_COLS / 2 * 16, width: 16, height: 16, direction: 1, frame: 1, length: 1, speed: 25} )
			.bind("Click", function() {
				direction += 1;
				if (direction == 4)
					direction = 0;
			})
			.bind("KeyDown", function(e) {
				console.log("keydown");
				if (e.keyCode === Crafty.keys.SPACE) {
					this.direction += 1;
					if (this.direction == 4)
						this.direction = 0;
				}
			})
			.bind("EnterFrame", function() {
				this.frame++;
				if (this.frame % this.speed == 0) {
					if (this.direction == 1) {
						this.x += 16;
						if (this.x >= WIDTH)
							this.x = 0;
					}
					else if (this.direction == 3) {
						this.x -= 16;
						if (this.x < 0)
							this.x = WIDTH - BOX_WIDTH;
					}
					else if (this.direction == 0) {
						this.y -= 16;
						if (this.y < 0)
							this.y = HEIGHT - BOX_HEIGHT;
					}
					else if (this.direction == 2) {
						this.y += 16;
						if (this.y >= HEIGHT)
							this.y = 0;
					}
				}
//				if (this.frame % 25) console.log("direction=" + this.direction);
			}).collision().onHit("snake", function() {
				console.log("hit");
			}).collision().onHit("food", function() {
				this.length += 1;
				//this.speed -= 1;
			});

			Crafty.c("food", {
				init: function() {
					this.attr({ 
						x: Crafty.randRange(0, 31) * 16, 
						y: Crafty.randRange(0, 31) * 16 }
					).collision()
					.onHit("snake", function() {
						this.destroy();
					});
				}
			});
			
			Crafty.e("2D, Canvas, Collision, shroom, food");
			var bg = Crafty.e("2D, DOM, Tween, Image").image("title.png", "no-repeat").attr({x: 512-128-32, y: 512-128-32, w: 128, h: 32, alpha: 0, z: -999})
			setTimeout( function() {
				bg.tween({alpha: 1}, 300);				
				setTimeout( function() {
					bg.tween({alpha: 0}, 300);				
				}, 8800);
			}, 2200);
	}); // main
	
});

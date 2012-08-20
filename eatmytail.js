window.onload = (function() {
	var WIDTH = 256,
			HEIGHT  = 256,
			BOX_WIDTH = 16,
			BOX_HEIGHT = 16,
		  BOARD_TOP = 0,
      BOARD_LEFT = 0,
			BOARD_ROWS = 16,
			BOARD_COLS = 16;
	Crafty.init( WIDTH, HEIGHT );
	Crafty.canvas.init();
	
	Crafty.load(["snake2.png", "shroom.png", "small-title.png"], function() {
		Crafty.sprite( 16, "snake2.png", { snake: [0, 0] } );
		Crafty.sprite( 16, "snake2.png", { tail: [0, 0] } );
		Crafty.sprite( 16, "shroom.png", { shroom: [0, 0] } );
		
		Crafty.scene("main");
	});
	
	Crafty.scene("main", function() {
		Crafty.background("url('grid256.png')");
		
		var segments = new Array();
		var showHint = true;
		var scored = false;
		var speedDelay = 500;
		var scorePanel = null;
		
		var snake = Crafty.e("2D, Canvas, Controls, Collision, snake")
			.attr( {x: BOARD_ROWS / 2 * 16, y: BOARD_COLS / 2 * 16, width: 16, height: 16, direction: 1, frame: 1, speed: 25, crashed: false, moveQueue: 0 } )
			.bind("KeyDown", function(e) {
				if (e.keyCode === Crafty.keys.SPACE) {
					if (scored) {
						console.log("should restart here");
						scored = false;
						speedDelay = 500;
						segments.forEach(function (element) {
    					element.visible = false;
						});
						segments = new Array();
						this.crashed = false;
						this.speed = 25;
						if (scorePanel)
							scorePanel.visible = false;
					}
					else {
						showHint = false;
						this.moveQueue += 1;
					}
				}
			})
			.bind("EnterFrame", function() {
				this.frame++;
				if (showHint && this.frame % 1000 == 0) {					
					var tip = Crafty.e("2D, DOM, Tween, Image").image("hint2.png", "no-repeat").attr({x: (256-176)/2, y: 64, w: 176, h: 16, alpha: 0, z: -999})
					setTimeout( function() {
						tip.tween({alpha: 1}, 200);				
						setTimeout( function() {
							tip.tween({alpha: 0}, 200);				
						}, 4400);
					}, 1100);
				}
				
				if (this.frame % this.speed == 0 && !this.crashed) {

					if (this.moveQueue > 0) {
						this.moveQueue -= 1;
						this.direction += 1;
						if (this.direction == 4)
							this.direction = 0;
					}

					if (segments.length > 0) {
						for (var i=segments.length-1; i > 0; i--) {
							var s = segments[i];
							var t = segments[i-1];
							s.x = t.x;
							s.y = t.y;
						}
						segments[0].x = this.x;
						segments[0].y = this.y;
					}

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

					if (!showHint && ((this.frame % speedDelay) == 0) && this.speed > 3) {
						// every 10 seconds, increase speed
						this.speed--;
						speedDelay = this.speed * 20;
					}
				}
			}).collision().onHit("tail", function() {
				if (segments.length > 1 && !this.crashed) {
					this.crashed = true;
				}
			}).collision().onHit("food", function() {
				//if (this.speed > 5) this.speed = Math.round(25 - (this.length-1/2));				
				Crafty.e("2D, Canvas, Collision, shroom, food");
				var sg;
				if (segments.length > 0) {
					sg = segments[segments.length-1];
				}
				else {
					sg = this;
				}
				var s = Crafty.e("2D, Canvas, Collision, tail")
											.attr( {x: sg.x, y: sg.y, width: 16, height: 16, segment: (segments.length+1)} )
											.collision().onHit("snake", function() {
												if (segments.length > 1 && !scored) {
													scorePanel = Crafty.e("2D, DOM, Text").attr({x: 16, y: 16, width: 256}).textFont({size: '14px', family: "Futura, Helvetica, sans-serif"}).text("YOU SCORE " + (this.segment * this.segment));
													scored = true;
												}
											});
				segments.push(s);
			});

			Crafty.c("food", {
				init: function() {
					this.attr({ 
						x: Crafty.math.randomInt(0, 15) * 16, 
						y: Crafty.math.randomInt(0, 15) * 16 }
					).collision()
					.onHit("snake", function() {
						this.destroy();
					});
				}
			});
			
			Crafty.e("2D, Canvas, Collision, shroom, food");
			var bg = Crafty.e("2D, DOM, Tween, Image").image("small-title.png", "no-repeat").attr({x: 256-96-16, y: 256-64-16, w: 128, h: 32, alpha: 0, z: -999})
			setTimeout( function() {
				bg.tween({alpha: 1}, 300);				
				setTimeout( function() {
					bg.tween({alpha: 0}, 300);				
				}, 4400);
			}, 2200);
	}); // main
	
});

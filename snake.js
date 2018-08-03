const scoreCount = document.querySelector('.scoreCount');
const highScore = document.querySelector('.highScore');
const message = document.querySelector('.message');
const start = document.querySelector('.start');
const stop = document.querySelector('.stop');
const dPad = document.querySelector('.dPad');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.height = 300;
canvas.width = 300;
const canvasColor = '#465814';
const snakeColor = '#000000';
const foodColor = '#000000';
const blockWidth = 10;
const blockHeight = 10;
const generateBlock = (x,y) => ctx.fillRect(x,y,blockWidth,blockHeight);
const generateStroke = (x,y) => ctx.strokeRect(x,y,blockWidth,blockHeight);
let direction;
let score;
let looper;
let speed;
let gameRunning = false;


const xyRand = () => {
	let numRange = Math.floor(Math.random() * 30);
		return numRange * blockWidth;
}

const scoreCheck = () => {
	let currentScore = scoreCount.textContent.match(/\d+/); //ex 0 or [1, 4]
	let currentHighScore = highScore.textContent.match(/\d+/);

	if(currentScore instanceof Array || currentHighScore instanceof Array) {
		currentScore = parseInt(currentScore.join(""));
		currentHighScore = parseInt(currentHighScore.join(""));
	}
	if(currentScore > currentHighScore) {
		const newMessage = document.createElement("p");
		const newText = document.createTextNode("NEW HIGH SCORE!");
		newMessage.appendChild(newText);
		message.appendChild(newMessage);
		highScore.textContent = `High Score: ${score}`;
	}
	console.log(highScore.textContent);
}

/**------------------------------FOOD OBJECT CONSTRUCTOR---------------------**/
function food() {
		this.x;
		this.y;

	this.draw = (x, y) => {
		this.x = x;
		this.y = y;
		ctx.fillStyle = foodColor;
		generateBlock(x, y);
	}
	//check if the snake has eaten the food
	this.hasSnakeCollided = () => {
		const snakeBodyFilter = firstSnake.snakeBody.filter(block => {
			return (block.x === this.x && block.y === this.y);
		});
		if ( snakeBodyFilter.length > 0	) {
			console.log('Food eaten.');
			return true;
		} 
		return false;
	}
}

/**-----------------------------------SNAKE OBJECT CONSTRUCTOR-----------------------------**/
function snake() {
	this.snakeBody = [];

	this.draw = (x, y) => {
			ctx.strokeStyle = canvasColor;
			generateStroke(x, y);
			ctx.fillStyle = snakeColor;
			generateBlock(x, y);
		}

	this.initSnake = () => {
		this.snakeBody = [];
		let length = 3;
		let num = 0;
		for(let i = 0; i < length; i++) {
			this.snakeBody.push({x: 100, y: 100 - num});
			num+=10;
		}
		// this.snakeBody.push({x: 300, y: 80}, {x: 300, y: 90}, {x: 300, y: 100});
	}
		
		this.update = () => {
			// this.checkCollision(this.snakeBody);
			let tail;
		
			if(newFood.hasSnakeCollided() ) {
				if((newFood.x === this.snakeBody[0].x) && newFood.y === this.snakeBody[0].y) {
					tail = {x: newFood.x, y: newFood.y};
					this.snakeBody.unshift(tail);
					score++;
					console.log(`Score: ${score}`);
					newFood.draw(xyRand(), xyRand());

					if(score % 3 === 0) {
						if(speed === 10) {
							return;
						}
						speed -= 10;
						clearInterval(looper);
						looper = setInterval(animate, speed);
						console.log("Speed increased.");
					}
				}
				// keep rerendering food if it's on snake
				while(newFood.hasSnakeCollided() ) {
					console.log('rerendering');
					newFood.draw(xyRand(), xyRand());
				}
			} else {
					this.checkCollision(this.snakeBody);
					tail = this.snakeBody.pop();
					tail.x = this.snakeBody[0].x;
					tail.y = this.snakeBody[0].y;
					this.snakeBody.unshift(tail);
				}
		}

		this.checkCollision = (array) => {
			array.forEach(block => {
					if (
						// out of bounds
						block.y < 0 || block.y > (canvas.height - 10) || block.x < 0 || block.x > (canvas.width -10) ||
						// or if snake collides itself *****NOT WORKING ON THE TAIL
						((block.x === this.snakeBody[0].x && block.y === this.snakeBody[0].y) && block !== this.snakeBody[0])
					) {
						// if((firstSnake.snakeBody[0].x === firstSnake.snakeBody[firstSnake.snakeBody.length-1].x) && (firstSnake.snakeBody[0].y === firstSnake.snakeBody[firstSnake.snakeBody.length-1].y)) {
						// 	console.log("Got your tail");
						// }
						stopGame();
					}
			});
		}

}


let firstSnake = new snake();
let newFood = new food();


const init = () => {
	firstSnake.initSnake();
	firstSnake.snakeBody.forEach(block => {
		firstSnake.draw(block.x, block.y);
	});
	newFood.draw(xyRand(), xyRand());
	direction = 'right';
	score = 0;
	speed = 100;
	message.textContent = '';
	
	// re-initialize if food and snake are in the same spot
	if(newFood.hasSnakeCollided()) {
		// clearCanvas();
		newFood.draw(xyRand(), xyRand());
	}
	
	gameRunning = true;
	console.log('game has been initialized.');
}

const animate = () => {
	clearCanvas();
	// window.addEventListener("keydown", directionHandler);
	// dPad.addEventListener("click", directionHandler);

	switch(direction) {
		case 'left':
		firstSnake.snakeBody[0].x-=10;
		break;
		case 'right':
		firstSnake.snakeBody[0].x+=10;
		break;
		case 'up':
		firstSnake.snakeBody[0].y-=10;
		break;
		case 'down':
		firstSnake.snakeBody[0].y+=10;
		break;
	}
	
	newFood.draw(newFood.x, newFood.y);
	// newFood.draw(xyRand(), xyRand());

	firstSnake.snakeBody.forEach(block => {
		firstSnake.draw(block.x, block.y);
	});

	firstSnake.update();

	scoreCount.textContent = `Score: ${score}`;
	// highScore.textContent = `High Score: 0`;

	// console.log(`snake length: ${firstSnake.snakeBody.length}`);
	// console.log(firstSnake.snakeBody);
	// console.log(firstSnake.snakeBody[2]);

}

const startGame = () => {
	
	if(!gameRunning) {
		if(pauseGame()) {
			continueGame();
			return;
		}
		
		init();
		// momentary pause before game starts
		setTimeout(() => {
			looper = setInterval(animate, speed);
			window.addEventListener("keydown", directionHandler);
			window.addEventListener("keyup", directionHandler);
			dPad.addEventListener("click", directionHandler);
			console.log(`Game running ${gameRunning}`);
		},200);

	} else if(gameRunning) {
		pauseGame();
	}
}

const continueGame = () => {
	looper = setInterval(animate, speed);
	window.addEventListener("keydown", directionHandler);
	dPad.addEventListener("click", directionHandler);
	message.textContent = '';
	gameRunning = true;
	console.log("Continued");
}

const pauseGame = () => {
	if(gameRunning) {
		clearInterval(looper);
		window.removeEventListener("keydown", directionHandler);
		dPad.removeEventListener("click", directionHandler);
		message.textContent = 'paused';
		console.log("Paused");
		gameRunning = false;
		return true;
	}
	if(!gameRunning && message.textContent === 'paused') {
		return true;
	}
	return false;
}

const stopGame = () => {
	
	if(gameRunning) {
		message.textContent = 'GAME OVER';
		clearInterval(looper);
		clearCanvas();
		gameRunning = false;
		window.removeEventListener("keydown", directionHandler);
		dPad.removeEventListener("click", directionHandler);
		console.log(`Game running ${gameRunning}`);
		scoreCheck();
	}
}

const keyPressStartGame = event => {
	// ENTER to start
	if(event.which === 13 && !gameRunning) {
		if(pauseGame()) {
			continueGame();
			return;
		}
		startGame();
	} else if (event.which === 13 && gameRunning) {
			pauseGame();
		}
}

const keyPressStopGame = event => {
	// R or SpaceBar to stop
	if((event.which === 32 || event.key === 'r' || event.which === 82) && gameRunning) {
		stopGame();
	}
}

const clearCanvas = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = canvasColor;
	ctx.fillRect(0,0,300,400);
}

const directionHandler = event => {

	if(event.type === "keydown") {
		switch(event.which){
			case 38:
			case 87:
			if(direction !== 'down') {
				direction = 'up';
			}
			break;
			case 39:
			case 68:
			if(direction !== 'left') {
				direction = 'right';
			}
			break;
			case 40:
			case 83:
				if(direction !== 'up') {
					direction = 'down';
				}
			break;
			case 37:
			case 65:
				if(direction !== 'right') {
					direction = 'left';
				}
			break;
		}
	}

	if(event.type === "click") {
		switch(event.target) {
			case dPad.children[1]:
			case dPad.children[1].children[0]:
				if(direction !== 'down') {
					direction = 'up';
				}
			break;
			case dPad.children[2]:
			case dPad.children[2].children[0]:
				if(direction !== 'left') {
						direction = 'right';
					}
			break;
			case dPad.children[3]:
			case dPad.children[3].children[0]:
				if(direction !== 'up') {
						direction = 'down';
					}
			break;
			case dPad.children[4]:
			case dPad.children[4].children[0]:
				if(direction !== 'right') {
						direction = 'left';
					}
			break;
		}
	}

	pushButtons(event);

}

const pushButtons = event => {
	if(event.type === "keydown") {
		for (let i = 0; i < dPad.children.length; i++) {
			let dir = dPad.children[i];

			switch(dir.classList[0]) {
				case "up":
				if(direction === "up") {
					dir.classList.add('activated');
					return;
				}
				break;
				case "right":
					if(direction === "right") {
						dir.classList.add('activated');
						return;
					}
				break;
				case "down":
				if(direction === "down") {
					dir.classList.add('activated');
					return;
				}
				break;
				case "left":
				if(direction === "left") {
					dir.classList.add('activated');
					return;
				}
				break;
			}
		}
	}

	if(event.type === "keyup") {
		for (let i = 0; i < dPad.children.length; i++) {
			const dir = dPad.children[i];
			dir.classList.remove('activated');
		}
	}
}

window.addEventListener("keypress", keyPressStartGame);
window.addEventListener("keypress", keyPressStopGame);
start.addEventListener("mousedown", startGame);
stop.addEventListener("mousedown", stopGame);
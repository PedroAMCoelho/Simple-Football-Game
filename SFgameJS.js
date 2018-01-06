var canvas; //a handle on the info about the dimentions of our display area
var canvasContext; //sort of underlying graphical info we draw
var ballX = 450; //here bc we need this variable in other parts of our program
var ballSpeedX = 10;
var ballY = 300; 
var ballSpeedY = 4;

const BALL_RADIUS = 10;
const PLAYER_RADIUS = 20;

var player1X = 225;
var player1Y = 300;

var player1Score = 0;
var player2Score = 0;

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_THICKNESS = 10; //essa const so foi criada p ser + facil entender e n ficar só o valor 10 varias vezes la em baixo
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

window.onload = function(){

canvas = document.getElementById('gameCanvas');
canvasContext = canvas.getContext('2d');

var framesPerSecond = 10; //temporary local variable

setInterval(function(){
	moveEverything();
	drawEverything();
	ballColision(); 
}, 1000/framesPerSecond); //quanto menor aqui, mais veloz. 1000 = 1s



canvas.addEventListener('mousemove',//atualiza pos do paddle qdo mouse mexe
		function(evt) {
			var mousePos = calculateMousePos(evt);
			player1X = mousePos.x; // o /10 é pra deixar o cursor mais perto do objeto
			player1Y = mousePos.y;
		});


} //onload

function ballReset(){

	//ballSpeedX = -ballSpeedX; // para mudar a direção do respawn qdo pontuar
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}

function ballColision(){

	if(((ballY+13) + BALL_RADIUS*3 > player1Y && (ballY+13) + BALL_RADIUS*2 < player1Y+PLAYER_RADIUS*3 && 
	(ballX+13) + BALL_RADIUS*2 > player1X && (ballX+13) + BALL_RADIUS*2 < player1X+PLAYER_RADIUS*3.3)){ // 20 = diametro da bola, substituir por uma variavel dps
			ballSpeedX = 1-ballSpeedX;

} 



//o erro q eu fiz aki em baixo foi q n restringiu o suficiente pros objetos, ai qdo o mouse/jogador 
//ia pra qqr lugar do canvas q fosse < ou > (dependendo da logica) q a posição da bola, ela mudava a direção...

//talvez seguindo a logica ali em cima adaptando pra essa de baixo, dê certo
/**
	if(ballX > player1X){
		if(player1X + PLAYER_RADIUS <= ballX - BALL_RADIUS && ballY - BALL_RADIUS >= player1Y + PLAYER_RADIUS){ //ball hitting on player's right
			ballSpeedX = -ballSpeedX;
		}
	} else if(ballX < player1X){ 
	if(player1X - PLAYER_RADIUS >= ballX + BALL_RADIUS){ //ball hitting on player's left
		ballSpeedX = -ballSpeedX;
	}
}

	if(ballY - BALL_RADIUS >= player1Y + PLAYER_RADIUS){ //ball hitting player's bottom
		ballSpeedX = -ballSpeedX;
	} else if(ballY + BALL_RADIUS <= player1Y - PLAYER_RADIUS){ //ball hitting player's top
		ballSpeedX = -ballSpeedX;
	}
	**/ 

}


function moveEverything(){
	

	ballX = ballX + ballSpeedX; //quanto menor aqui, mais smooth("integrado") o movimento
	ballY = ballY + ballSpeedY;

	if (ballX >= canvas.width){ //se a bola ultrapassar lá no lado direito do canvas

		if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){ //se a bola estiver passando acima e acima do paddle...
			ballReset();
			player1Score++;
			ballSpeedX= 0;
			ballSpeedY = 0;

		}else{ 
			ballSpeedX = -ballSpeedX;
			ballX = 600;
			ballY = 300;
			ballSpeedX = 0;
			ballSpeedY = 0;
}
		//ballSpeedX = -ballSpeedX; //qdo bater na direita, volta

	}  else if (ballX < 0){ //lado esquerdo do canvas

		if(ballY > paddle1Y &&
		   ballY < paddle1Y+PADDLE_HEIGHT){ //é gol!
			ballReset();
			player2Score++;
			ballSpeedX = 0;
			ballSpeedY = 0;
		}else{
			ballSpeedX = -ballSpeedX;
			ballX = 100;
			ballY = 200;
			ballSpeedX = 0;
			ballSpeedY = 0;
		}
		

		//ballSpeedX=-ballSpeedX;} // qdo bater na esquerda, volta dnv
		
	}  if (ballY >= canvas.height){

		ballSpeedY = -ballSpeedY;

	} else if (ballY < 0){

		ballSpeedY=-ballSpeedY;}



}  //moveEverything

//ESSAS LINHAS SE TRANSFORMARAM NA COLOR RECT, PARA FIM DE ORGANIZAÇÃO E PRATICIDADE
//function drawEverything(){

//canvasContext.fillStyle = 'black';
//canvasContext.fillRect(0,0,canvas.width,canvas.height);
//canvasContext.fillStyle = 'white';
//canvasContext.fillRect(0,210,10,100);
//canvasContext.fillStyle = 'red'; //vai se sobrepor à figura branca
//canvasContext.fillRect(ballX,100,10,10); // pq esse elemento foi escrito dps


function drawEverything() {
	//next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');
	//this is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	//this is right computer paddle
	colorRect(canvas.width - PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	//next line draws the ball
	colorCircle(ballX, ballY, BALL_RADIUS,'white');
	//next line draws player1
	colorCircle(player1X, player1Y, PLAYER_RADIUS,'red');

	//ESSAS LINHAS SE TRANSFORMARAM NA COLOR CIRCLE
	//canvasContext.fillStyle = 'white';
	//canvasContext.beginPath();
	//canvasContext.arc(ballX, 50, 10, 0, Math.PI*2, true);
	//canvasContext.fill();

	colorScore(player1Score, player2Score, 900, 'white');
}

function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}

function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}

function colorScore (player1Score, player2Score,canvasWidth, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillText(player1Score, 100, 100); // score e score position in canvas
	canvasContext.fillText(player2Score, canvasWidth - 100, 100);

}




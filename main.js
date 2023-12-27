var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

var dino = {
  x: 25,
  y: 200,
  width: 30,
  height: 50,
  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
};

var cactusSprite = new Image();
cactusSprite.src = "cactus_run_3p.png";
class Cactus {
  constructor() {
    this.x = 500;
    this.y = 220;
    this.width = 50;
    this.height = 80;
    this.spriteWidth = 210;
    this.spriteHeight = 309;
    this.totalFrames = 3;
    this.currentFrame = 0;
    this.frameUpdateCounter = 0; // 프레임 업데이트 카운터 추가
    this.frameUpdateSpeed = 10; // 업데이트 속도 조절 (낮을수록 빠름)
  }
  draw() {
    ctx.drawImage(
      cactusSprite,
      this.currentFrame * this.spriteWidth, 0, // 스프라이트 시트에서의 x, y 위치
      this.spriteWidth, this.spriteHeight, // 스프라이트 시트에서의 프레임 크기
      this.x, this.y, // 캔버스에서의 위치
      this.width, this.height // 캔버스에서의 크기
    );
  }
  updateFrame() {
    // 프레임 업데이트 로직
    this.frameUpdateCounter++;
    if (this.frameUpdateCounter % this.frameUpdateSpeed === 0) {
      this.currentFrame = ++this.currentFrame % this.totalFrames;}
  }
}

var timer = 0;
var jumpTimer = 0;
var cacti = [];
var animation;
var isJumping = false;

function frameAction() {
  animation = requestAnimationFrame(frameAction);
  timer++;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (timer % 240 === 0) {
    var cactus = new Cactus();
    cacti.push(cactus);
  }

  cacti.forEach((cactus, i, arr) => {
    cactus.x -= 2;
    cactus.updateFrame(); //스프라이트 프레임 업데이트

    checkCollision(dino, cactus);
    cactus.draw();

    if (cactus.x < 0) {
      arr.splice(i, 1);
    }
  });

  if (isJumping) {
    if (jumpTimer < currentJumpHeight / 2) {
      dino.y -= 2; // 상승
    } else if (jumpTimer > currentJumpHeight / 2) {
      dino.y += 2; // 하강
    }
    jumpTimer++;
    if (jumpTimer > currentJumpHeight) {
      isJumping = false;
      jumpTimer = 0;
    }
  }

  dino.draw();
}

frameAction();

//기능 함수

var currentJumpHeight = 120; // 현재 점프 높이

document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !isJumping) {
    isJumping = true;
    jumpStartTime = Date.now(); // 점프 시작 시간 기록
  }
});

document.addEventListener('keyup', function (e) {
  if (e.code === 'Space' && isJumping) {
    var jumpDuration = Date.now() - jumpStartTime; // 점프 지속 시간 계산
    adjustJumpHeight(jumpDuration); // 점프 높이 조절
  }
});

var maxJumpHeight = 120; // 최대 점프 높이 설정

function adjustJumpHeight(jumpDuration) {
  // 점프 지속 시간에 따라 점프 높이 조절
  // 예: 짧게 누른 경우 jumpDuration이 작을 것이고, 길게 누른 경우 jumpDuration이 클 것임
  // 이 값을 사용하여 점프 높이를 조절할 수 있음
  // 예를 들어, 최소 점프 시간을 150ms, 최대 점프 시간을 500ms로 설정할 수 있음
  var minJumpTime = 150;
  var maxJumpTime = 500;
  var jumpHeight = Math.min(jumpDuration, maxJumpTime) / maxJumpTime;
  currentJumpHeight = maxJumpHeight * jumpHeightRatio; // 점프 높이 계산
  // jumpHeight를 사용하여 점프 로직에 적용
  // 예: jumpHeight에 따라 점프 속도나 최대 높이를 조절
}

/*document.addEventListener('keydown', function (e) {
  if (e.code === 'Space' && !isJumping) {
    isJumping = true;
  }
});*/

function checkCollision(dino, cactus) {
  var xOverlap = dino.x < cactus.x + cactus.width && dino.x + dino.width > cactus.x;
  var yOverlap = dino.y < cactus.y + cactus.height && dino.y + dino.height > cactus.y;

  if (xOverlap && yOverlap) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animation);
  }
}
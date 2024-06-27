let bullets = [];
let player = { x: 0, y: 0, size: 0, moveSpeed: 0 };
let level = 1;
let levelTimer = 0;
let levelStarted = false;
let keys = { up: false, down: false, left: false, right: false };

function setup() {
  createCanvas(400, 500);
  frameRate(60);
  noStroke();
  init();
}

function init() {
  bullets = [];
  player = { x: 200, y: 400, size: 15, moveSpeed: 4 };
  keys = { up: false, down: false, left: false, right: false };
  frameCount = 0;
  level = 1;
  levelTimer = 0;
  levelStarted = false;
}

function draw() {
  background(0);
  if (!levelStarted) {
    displayLevel();
    if (frameCount % 60 == 0) {
      levelStarted = true;
      frameCount = 0;
    }
    return;
  }

  movePlayer();
  moveBullets();
  shoot();
  deleteOutBullets();
  renderPlayer();
  renderBullets();
  checkHit();
  updateLevel();
}

function movePlayer() {
  let xUnit = 0;
  let yUnit = 0;

  if (keys.left) xUnit--;
  if (keys.right) xUnit++;
  if (keys.up) yUnit--;
  if (keys.down) yUnit++;

  let vectorSize = sqrt(xUnit * xUnit + yUnit * yUnit);
  if (vectorSize == 0) return;
  xUnit /= vectorSize;
  yUnit /= vectorSize;

  player.x += xUnit * player.moveSpeed;
  player.y += yUnit * player.moveSpeed;

  player.x = constrain(player.x, player.size / 2, 400 - player.size / 2);
  player.y = constrain(player.y, player.size / 2, 500 - player.size / 2);
}

function keyPressed() {
  switch (key) {
    case 'W':
    case 'w':
      keys.up = true;
      break;
    case 'S':
    case 's':
      keys.down = true;
      break;
    case 'A':
    case 'a':
      keys.left = true;
      break;
    case 'D':
    case 'd':
      keys.right = true;
      break;
  }
}

function keyReleased() {
  switch (key) {
    case 'W':
    case 'w':
      keys.up = false;
      break;
    case 'S':
    case 's':
      keys.down = false;
      break;
    case 'A':
    case 'a':
      keys.left = false;
      break;
    case 'D':
    case 'd':
      keys.right = false;
      break;
  }
}

function moveBullets() {
  for (let bullet of bullets) {
    bullet.x += bullet.speed * cos(bullet.angle);
    bullet.y += bullet.speed * sin(bullet.angle);
  }
}

function deleteOutBullets() {
  let newBullets = [];
  for (let bullet of bullets) {
    let { x, y, size } = bullet;
    if (0 - size < x && x < 400 + size && 0 - size < y && y < 500 + size) {
      newBullets.push(bullet);
    }
  }
  bullets = newBullets;
}

function checkHit() {
  for (let bullet of bullets) {
    let hitDistance = (bullet.size / 2 + player.size / 2) * 0.8;
    if (dist(player.x, player.y, bullet.x, bullet.y) < hitDistance) {
      init();
    }
  }
}

function renderPlayer() {
  push();
  fill("red");
  circle(player.x, player.y, player.size);
  pop();
}

function renderBullets() {
  for (let { x, y, size } of bullets) {
    circle(x, y, size);
  }
}

function shoot() {
  if (frameCount >= 200) return;
  if (frameCount % (20 - level * 2) == 0) {
    let deltaAngle = random(TAU);
    for (let i = 0; i < 10 + level * 10; i++) {
      bullets.push({
        x: 200,
        y: 100,
        angle: i / (10 + level * 10) * TAU + deltaAngle,
        speed: 3 + level,
        size: 10,
      });
    }
  }
}

function displayLevel() {
  background(0);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(`Level ${level}`, width / 2, height / 2);
}

function updateLevel() {
  levelTimer++;
  if (levelTimer > 600) {
    level++;
    levelTimer = 0;
    levelStarted = false;
    frameCount = 0;
    if (level > 5) {
      level = 1;
    }
  }
}

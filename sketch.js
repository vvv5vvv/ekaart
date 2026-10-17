const FOREST_DENSITY = 180;
const GROUND_HEIGHT = 150;

const BOX_SIZE = 80;
const OPEN_SPEED = 0.08;

let trees = [];

let openAmount = 0;
let isOpen = false;

let laikaImages = [];
let photos = [];

function preload() {
  laikaImages[0] = loadImage("laikad1.jpg");
  laikaImages[1] = loadImage("laikad2.jpg");
  laikaImages[2] = loadImage("laikad3.jpg");
  laikaImages[3] = loadImage("laikad4.jpg");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < FOREST_DENSITY; i++) {
    trees.push({
      x: random(width),
      depth: random(),
      crownColor: color(
        random(20, 50),
        random(100, 170),
        random(20, 50)
      )
    });
  }

  rectMode(CENTER);
  imageMode(CENTER);
}

function draw() {
  drawSky();
  drawGround();
  drawForest();

  updateBox();

  drawPhotos();
  drawBox();
}

function drawSky() {
  background(160, 215, 255);
}

function drawGround() {
  noStroke();

  fill(60, 130, 60);

  rectMode(CORNER);
  rect(
    0,
    height - GROUND_HEIGHT,
    width,
    GROUND_HEIGHT
  );
  rectMode(CENTER);
}

function drawForest() {
  for (let t of trees) {

    let scaleFactor =
      map(t.depth, 0, 1, 0.5, 2.2);

    let y =
      map(
        t.depth,
        0,
        1,
        height * 0.18,
        height - GROUND_HEIGHT + 20
      );

    let trunkH = 18 * scaleFactor;
    let trunkW = 4 * scaleFactor;

    fill(100, 70, 40);
    noStroke();

    rect(
      t.x,
      y + trunkH / 2,
      trunkW,
      trunkH
    );

    fill(t.crownColor);

    triangle(
      t.x,
      y - 28 * scaleFactor,
      t.x - 16 * scaleFactor,
      y + 4 * scaleFactor,
      t.x + 16 * scaleFactor,
      y + 4 * scaleFactor
    );

    triangle(
      t.x,
      y - 14 * scaleFactor,
      t.x - 22 * scaleFactor,
      y + 12 * scaleFactor,
      t.x + 22 * scaleFactor,
      y + 12 * scaleFactor
    );

    triangle(
      t.x,
      y,
      t.x - 28 * scaleFactor,
      y + 20 * scaleFactor,
      t.x + 28 * scaleFactor,
      y + 20 * scaleFactor
    );
  }
}

function updateBox() {
  let target = isOpen ? 1 : 0;

  openAmount = lerp(
    openAmount,
    target,
    OPEN_SPEED
  );
}

function drawBox() {

  const cx = width / 2;
  const cy = height - GROUND_HEIGHT + 35;

  push();

  translate(cx, cy);

  fill(25);
  noStroke();

  rect(
    0,
    0,
    BOX_SIZE,
    BOX_SIZE
  );

  push();

  translate(-BOX_SIZE / 2, 0);

  scale(
    max(
      0.05,
      cos(openAmount * HALF_PI)
    ),
    1
  );

  fill(40);

  rect(
    BOX_SIZE / 4,
    0,
    BOX_SIZE / 2,
    BOX_SIZE
  );

  pop();

  push();

  translate(BOX_SIZE / 2, 0);

  scale(
    max(
      0.05,
      cos(openAmount * HALF_PI)
    ),
    1
  );

  fill(55);

  rect(
    -BOX_SIZE / 4,
    0,
    BOX_SIZE / 2,
    BOX_SIZE
  );

  pop();

  pop();

  fill(255);
  textAlign(CENTER);
  textSize(18);

  text(
    "Klõpsa kastil",
    width / 2,
    cy - 70
  );
}

function createPhotos() {

  if (photos.length > 0) return;

  const startX = width / 2;
  const startY = height - GROUND_HEIGHT + 35;

  const targets = [
    { x: width * 0.20, y: height * 0.25 },
    { x: width * 0.40, y: height * 0.18 },
    { x: width * 0.60, y: height * 0.22 },
    { x: width * 0.80, y: height * 0.30 }
  ];

  for (let i = 0; i < 4; i++) {

    photos.push({
      img: laikaImages[i],

      startX,
      startY,

      targetX: targets[i].x,
      targetY: targets[i].y,

      progress: 0,

      angle: random(-0.2, 0.2),

      rotationSpeed:
        random(-0.005, 0.005)
    });
  }
}

function drawPhotos() {

  for (let p of photos) {

    if (p.progress < 1) {
      p.progress += 0.01;
    }

    let eased =
      1 -
      pow(1 - p.progress, 3);

    let x = lerp(
      p.startX,
      p.targetX,
      eased
    );

    let y = lerp(
      p.startY,
      p.targetY,
      eased
    );

    let size = lerp(
      40,
      170,
      eased
    );

    p.angle += p.rotationSpeed;

    push();

    translate(x, y);
    rotate(p.angle);

    drawingContext.shadowBlur = 25;
    drawingContext.shadowColor =
      "rgba(0,0,0,0.35)";

    fill(255);
    noStroke();

    rect(
      0,
      0,
      size + 18,
      size + 18,
      6
    );

    image(
      p.img,
      0,
      0,
      size,
      size
    );

    pop();
  }
}

function mousePressed() {

  const cx = width / 2;
  const cy = height - GROUND_HEIGHT + 35;

  if (
    mouseX > cx - BOX_SIZE / 2 &&
    mouseX < cx + BOX_SIZE / 2 &&
    mouseY > cy - BOX_SIZE / 2 &&
    mouseY < cy + BOX_SIZE / 2
  ) {
    isOpen = true;
    createPhotos();
  }
}

function windowResized() {
  resizeCanvas(
    windowWidth,
    windowHeight
  );
}
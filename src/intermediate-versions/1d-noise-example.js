/** Example to illustrate 1D Perlin noise. */

let zoomFactor = 150;
let xOffset = 0.008;

function setup() {
  createCanvas(600, 600);
  background(50);
  // noiseSeed(39854);
  noiseDetail(4, 0.5);
  // noLoop();
}

function draw() {
  background(50);

  beginShape();
  stroke(255);
  strokeWeight(2);
  noFill();

  for (x = 0; x < width; x++) {
    // const noiseValue = Math.random();
    const noiseValue = noise(x / zoomFactor + xOffset);
    vertex(x, noiseValue * height);
  }
  xOffset += 0.008;
  endShape();
}

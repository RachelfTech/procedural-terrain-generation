/** This version has basic Perlin noise shown in grayscale. */

let zoomFactor = 100;

function setup() {
  createCanvas(400, 400);
  noLoop();
}

function draw() {
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      // zoomFactor zooms in on the noise to make there be more steps between
      // each plotted value. If zoomFactor is 100, we're effectively zooming in
      // 100x on the noise map.
      const noiseValue = noise(x / zoomFactor, y / zoomFactor);
      set(x, y, color(255 * noiseValue));
    }
  }
  updatePixels();
}

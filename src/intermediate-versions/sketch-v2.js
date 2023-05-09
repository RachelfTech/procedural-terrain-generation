/** This version adds colors based on Perlin noise value. */

let zoomFactor = 100;

function setup() {
  createCanvas(600, 600);
  noLoop();
}

function draw() {
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      // zoomFactor zooms in on the noise to make there be more steps between
      // each plotted value. If zoomFactor is 100, we're effectively zooming in
      // 100x on the noise map.
      const noiseValue = noise(x / zoomFactor, y / zoomFactor);

      // Treat the noise values as a height map. Set different colors based on
      // the current noise value for the given x, y.
      let terrainColor;
      if (noiseValue < 0.4) {
        terrainColor = color(0, 0, 255);
      } else if (noiseValue < 0.5) {
        terrainColor = color(255, 255, 0);
      } else if (noiseValue < 0.7) {
        terrainColor = color(0, 255, 0);
      } else {
        terrainColor = color(0, 100, 100);
      }
      set(x, y, terrainColor);
    }
  }
  updatePixels();
}
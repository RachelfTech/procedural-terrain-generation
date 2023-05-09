/** This final version adds map zooming and panning. */

class TerrainType {
  constructor(minHeight, maxHeight, minColor, maxColor, lerpAdjustment = 0) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.minColor = minColor;
    this.maxColor = maxColor;
    // An adjustment to the color lerp for the map type, this weighs the color
    // towards the min or max color.
    this.lerpAdjustment = lerpAdjustment;
  }
}

let waterTerrain;
let sandTerrain;
let grassTerrain;
let treesTerrain;

let zoomFactor = 100;
let mapChanged = true;
// The x and y offset need to be large because Perlin noise mirrors around 0.
let xOffset = 10000;
let yOffset = 10000;
const cameraSpeed = 10;

function setup() {
  createCanvas(600, 600);

  // Adjusts the level of detail created by the Perlin noise by layering
  // multiple versions of it together.
  noiseDetail(9, 0.5);

  // Perlin noise doesn't often go below 0.2, so pretend the min is 0.2 and not
  // 0 so that the colors are more evenly distributed. Otherwise, there is 
  // little deep water represented. This is the same for setting the max for 
  // 'trees' to 0.75: noise rarely goes above 0.8 and the tree colors look 
  // better assuming 0.75 as the max.
  waterTerrain =
    new TerrainType(0.2, 0.4, color(30, 176, 251), color(40, 255, 255));
  sandTerrain =
    new TerrainType(0.4, 0.5, color(215, 192, 158), color(255, 246, 193), 0.3);
  grassTerrain =
    new TerrainType(0.5, 0.7, color(2, 166, 155), color(118, 239, 124));
  treesTerrain =
    new TerrainType(0.7, 0.75, color(22, 181, 141), color(10, 145, 113), -0.5);
}

function draw() {
  if (keyIsDown(RIGHT_ARROW)) {
    xOffset += 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
  if (keyIsDown(LEFT_ARROW)) {
    xOffset -= 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
  if (keyIsDown(UP_ARROW)) {
    yOffset -= 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yOffset += 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }

  // We only need to re-draw the canvas if the map has changed.
  if (!mapChanged) {
    return;
  }

  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      // Set xVal and yVal for the noise such that the map is centered around
      // the center of the canvas. Adding x and y offset values allows us to
      // move around the noise with the arrow keys.
      const xVal = (x - width / 2) / zoomFactor + xOffset;
      const yVal = (y - height / 2) / zoomFactor + yOffset;
      const noiseValue = noise(xVal, yVal);

      let terrainColor;
      // Compare the current noise value to each mapType max height and get the
      // terrain color accordingly. For easier extendability and less code 
      // repetition you could store the terrain types in an array and iterate
      // over it with a for loop checking for maxHeight. For this example I just
      // wanted to keep it simple and similar to previous versions.
      if (noiseValue < waterTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, waterTerrain);
      } else if (noiseValue < sandTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, sandTerrain);
      } else if (noiseValue < grassTerrain.maxHeight) {
        terrainColor = getTerrainColor(noiseValue, grassTerrain);
      } else {
        terrainColor = getTerrainColor(noiseValue, treesTerrain);
      }
      set(x, y, terrainColor);
    }
  }
  updatePixels();
  mapChanged = false;
}

function getTerrainColor(noiseValue, mapType) {
  // Given a noise value, normalize to to be between 0 to 1 representing how
  // close it is to the min or max height for the given terrain type.
  const normalized =
    normalize(noiseValue, mapType.maxHeight, mapType.minHeight);
  // Blend between the min and max height colors based on the normalized
  // noise value.
  return lerpColor(mapType.minColor, mapType.maxColor,
    normalized + mapType.lerpAdjustment);
}

// Return a number between 0 and 1 between max and min based on value.
function normalize(value, max, min) {
  if (value > max) {
    return 1;
  }
  if (value < min) {
    return 0;
  }
  return (value - min) / (max - min);
}

function mouseWheel(event) {
  zoomFactor -= event.delta / 10;
  // Set the min zoom factor to 10 so that the map stays somewhat recognizeable.
  zoomFactor = Math.max(10, zoomFactor);
  mapChanged = true;
}

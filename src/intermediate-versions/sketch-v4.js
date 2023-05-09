/** This version adds color lerping. */

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

function setup() {
  createCanvas(600, 600);

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

  noLoop();
}

function draw() {
  for (x = 0; x < width; x++) {
    for (y = 0; y < height; y++) {
      // zoomFactor zooms in on the noise to make there be more steps between
      // each plotted value. If zoomFactor is 100, we're effectively zooming in
      // 100x on the noise map.
      const noiseValue = noise(x / zoomFactor, y / zoomFactor);

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

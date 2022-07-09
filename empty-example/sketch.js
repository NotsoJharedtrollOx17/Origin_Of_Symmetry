// Elaborado con la biblioteca p5.js (Lenguaje capaz de ser ejecutado por navegadores web)

const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8/3;
const LORENZ_X_0 = 0.11;
const LORENZ_Y_0 = 1;
const LORENZ_Z_0 = 1;
const LORENZ_TIME_DIFFERENTIAL = 1/60;
const PATH_MAX_LEN = 60;
const ROTATING_FACTOR = 0.005;
const SCALE_FACTOR = 1/80;
const BACKGROUND_COLOR = 15;
const LINE_WEIGHT = 0.6;
const STROKE_COLOR = 255;
const RECTANGLE_COLOR_FILL = 200;
const RECTANGLE_STROKE_PARAMETER = 50;
const WINDOW_WIDTH = 850;
const WINDOW_HEIGHT = 1000;
const ZERO = 0;
const ONE = 1;
const ONE_HUNDRED = 100;

let path_offset = ZERO;
let path_values = [];
let lorenz_coordinates;
let lorenz_new_coordinates;
let previous_path_value;
let next_path_value;

function lorenzAttractorInitialValues() {
  lorenz_coordinates = createVector(
    LORENZ_X_0, 
    LORENZ_Y_0, 
    LORENZ_Z_0
  );
}

function lorenzAttractorInit() { 
    lorenz_new_coordinates = createVector(
      LORENZ_SIGMA * (lorenz_coordinates.y - lorenz_coordinates.x),
      lorenz_coordinates.x * (LORENZ_RHO - lorenz_coordinates.z) - lorenz_coordinates.y, 
      lorenz_coordinates.x * lorenz_coordinates.y - LORENZ_BETA * lorenz_coordinates.z
    );
    
    lorenz_new_coordinates.mult(LORENZ_TIME_DIFFERENTIAL);
  }

function lorenzAttractorUpdate() {
    lorenz_coordinates.add(lorenz_new_coordinates);
}

function pathValuesInit() {
    path_values.push(lorenz_coordinates.copy());
    
    if (path_values.length > PATH_MAX_LEN)
    {
      path_values.splice(ZERO, ONE);
      ++path_offset;   
    }
  }

function pathValueUpdate() {
    previous_path_value = path_values[ZERO];
}

function rectangleDraw() {
      rect(
        previous_path_value.x + noise(previous_path_value.x), 
        previous_path_value.x + noise(previous_path_value.x),
        previous_path_value.y + noise(previous_path_value.y), 
        previous_path_value.z * noise(previous_path_value.z)
      );
}

function rectangleStroke(i) {
    stroke(
        i + path_offset, 
        RECTANGLE_STROKE_PARAMETER, 
        RECTANGLE_STROKE_PARAMETER - (path_values.length - i) * PATH_MAX_LEN
    );
  }

function rectangleGeneration() {
    for (let i = ONE; i < path_values.length; ++i)
    {
      fill(RECTANGLE_COLOR_FILL);
      
      rectangleDraw();

      rectangleStroke(i);
      
      next_path_value = path_values[i];
      previous_path_value = next_path_value;
    }
  }

function drawingPreparations() {
  rotateY(frameCount * ROTATING_FACTOR); 
  rotateZ(frameCount * ROTATING_FACTOR); 
  scale(width * SCALE_FACTOR); 
  background(BACKGROUND_COLOR);
  strokeWeight(LINE_WEIGHT);
  stroke(STROKE_COLOR); 
  noFill();
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  colorMode(HSB, ONE_HUNDRED);
  lorenzAttractorInitialValues();
}

function draw() {
  drawingPreparations();
  lorenzAttractorInit();
  lorenzAttractorUpdate();
  pathValuesInit();
  rectangleGeneration();
  pathValueUpdate();
}
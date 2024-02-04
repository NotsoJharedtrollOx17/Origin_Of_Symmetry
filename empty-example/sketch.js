// Elaborado con la biblioteca p5.js (Lenguaje capaz de ser ejecutado por navegadores web)

// * Name: Abraham Jhared Flores Azcona
// * Date: May 2022

// * Constants
const LORENZ_SIGMA = 10;
const LORENZ_RHO = 28;
const LORENZ_BETA = 8/3;
const LORENZ_X_0 = 0.11;
const LORENZ_Y_0 = 1;
const LORENZ_Z_0 = 1;
const LORENZ_TIME_DIFFERENTIAL = 1/60;
const PATH_MAX_LEN = 60;
const ROTATING_FACTOR = 0.005;
const SCALE_FACTOR = 0.008;
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

// * Global variables
let path_offset = ZERO;
let path_values = []; // * stores the entire history of the generated lorenz values
let previous_path_value = null;
let lorenz_coordinates = null;
let lorenz_new_coordinates = null;

// * Sets Initial coordinates of the system
function setLorenzAttractorInitialValues() {
  lorenz_coordinates = createVector(
    LORENZ_X_0, 
    LORENZ_Y_0, 
    LORENZ_Z_0
  );
}

// * Calculates the current coordinates of the system
function getLorenzAttractorCurrentValues() { 
    lorenz_new_coordinates = createVector(
      LORENZ_SIGMA * (lorenz_coordinates.y - lorenz_coordinates.x),
      lorenz_coordinates.x * (LORENZ_RHO - lorenz_coordinates.z) - lorenz_coordinates.y, 
      lorenz_coordinates.x * lorenz_coordinates.y - LORENZ_BETA * lorenz_coordinates.z
    );
    
    lorenz_new_coordinates.mult(LORENZ_TIME_DIFFERENTIAL);
  }

// * Sums the previous lorenzs coordinates with the lorenz_new_coordinates
function setLorenzAttractorCurrentValues() {
    lorenz_coordinates.add(lorenz_new_coordinates);
}

// * Updates the path_values array with a new lorenz coordinate
function setPathValues() {
    path_values.push(lorenz_coordinates.copy());
    
    /*
      adds more related system noise; if length > 60, cuts the first value of the history
      and adds 1 to path_offset which is used to affect rectangleGeneration() via rentangleStroke()
    */
    if (path_values.length > PATH_MAX_LEN)
    {
      path_values.shift();
      ++path_offset;   
    }
  }

// * Sets previous_path_value to the first element of the path_values array
function setPreviousPathValue() {
    previous_path_value = path_values[ZERO];
}

// * Draws the rectangles with the given lorenz coordinates and a 1D noise filter
function getRectangleDrawing(i) {
    fill(RECTANGLE_COLOR_FILL);    
    rect(
        previous_path_value.x + noise(previous_path_value.x), 
        previous_path_value.x + noise(previous_path_value.x),
        previous_path_value.y + noise(previous_path_value.y), 
        previous_path_value.z * noise(previous_path_value.z)
      );
    setRectangleStroke(i);
}

// * Sets the stroke of the given rectangles using the current index given by rentangleGeneration & path_offset
function setRectangleStroke(i) {
    stroke(
        i + path_offset, 
        RECTANGLE_STROKE_PARAMETER, 
        RECTANGLE_STROKE_PARAMETER - (path_values.length - i) * PATH_MAX_LEN
    );
  }

// * Generates the rentangles given the modifications of rectangleDraw
function rectangleGeneration() {
    for (let i = ONE; i < path_values.length; ++i)
    {
      getRectangleDrawing(i);
      previous_path_value = path_values[i];
    }
}

// * Updates the rotation of the animation object
function getDrawingPreparations() {
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
  setLorenzAttractorInitialValues();
}

function draw() {
  getDrawingPreparations();
  getLorenzAttractorCurrentValues();
  setLorenzAttractorCurrentValues();
  setPathValues();
  rectangleGeneration();
  setPreviousPathValue();
}
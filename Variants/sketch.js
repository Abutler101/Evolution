// nex generation automation based on vehicles healthiest survivor + some fine tinuning to the genetic algorithm
// press ctrl for switch debug on/off
// mouse press for adding new vehicles

var vehicles = [];
var vehiclesNum = 10;
var food = [];
var poison = [];
var foodPieces = 40;
var poisonPieces = 20;
var d = 25;
var genCount = 0;
var debug = true;

function setup() {
  createCanvas(windowWidth, windowHeight);
  for (var i = 0; i < vehiclesNum; i++) {
    vehicles[i] = new Vehicle(random(d * 2, width - d * 2), random(d * 2, height - d * 2));
  }
  for (var i = 0; i < foodPieces; i++) {
    food.push(createVector(random(width), random(height)));
  }
  for (var i = 0; i < poisonPieces; i++) {
    poison.push(createVector(random(width), random(height)));
  }
  genCount += 1;
  console.log("Generation: " + genCount);
}
function draw() {
  background(51);
  if (random(1) < 0.10) { //10% probability to drop more food
    food.push(createVector(random(width), random(height)));
  }
  if (random(1) < 0.01) { //1% probability to drop more poison
    poison.push(createVector(random(width), random(height)));
  }
  for (var i = 0; i < food.length; i++) {
    noStroke();
    fill(0, 255, 0);
    ellipse(food[i].x, food[i].y, 6, 6);
  }
  for (var i = 0; i < poison.length; i++) {
    noStroke();
    fill(255, 0, 0);
    ellipse(poison[i].x, poison[i].y, 6, 6);
  }
  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].applyBehaviors(food, poison);
    vehicles[i].boundaries();
    vehicles[i].update();
    vehicles[i].show();
    var newVehicle = vehicles[i].clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }
    if (vehicles[i].isdead()) {
      if (vehicles.length <= 1) {
        regenerate(vehicles[i]);
      }
      food.push(createVector(vehicles[i].position.x, vehicles[i].position.y));
      vehicles.splice(i, 1);
    }
  }
}
function mousePressed() {
  vehicles.push(new Vehicle(mouseX, mouseY));
}
function keyPressed() {
  if (keyCode == CONTROL) {
    debug = !debug;
    console.log(debug);
  }
}
function regenerate(champion) {
  console.log("repopulating");
  for (n = 0; n < vehiclesNum; n++) {
    vehicles.push(champion.repopulate());
  }
  genCount += 1;
  console.log("Generation: " + genCount);
};
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
};

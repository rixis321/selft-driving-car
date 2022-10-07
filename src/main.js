const carCanvas = document.getElementById("carCanvas");
const networkCanvas = document.getElementById("networkCanvas");

carCanvas.width = 200;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width / 2, carCanvas.width * 0.85);

const N = 100;
const cars = generateCars(N);
let closestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  closestCar.brain = JSON.parse(localStorage.getItem("bestBrain"));
}

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 1)];
animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(closestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}
function generateCars(N) {
  const cars = [];
  for (let i = 0; i <= N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function animate(time) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }

  closestCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)));
  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -closestCar.y + carCanvas.height * 0.7);
  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  closestCar.draw(carCtx, "blue", true);
  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, closestCar.brain);
  requestAnimationFrame(animate);
}

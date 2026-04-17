 let img;

function preload() {
  img = loadImage(
    'images/NAGA LIGHTS copy.JPG',
    () => console.log('image loaded'),
    () => console.error('image failed to load')
  );
}

function setup() {
  createCanvas(1204, 1600);
}

function draw() {
  background(255);
  if (img) {
    image(img, 0, 0);
  }
}

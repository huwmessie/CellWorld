let cells =[];
let nPts = 40;
let inc = 2; // affects resolution of voronoi
let bg;

function setup() {
  createCanvas(600, 400);
  initCells(nPts,width,height);
  bg = applyVoronoi(cells,inc);
}

function draw() {
  image(bg,0,0,width,height);
  
  //strokeWeight(13);
  //for (var i=0; i<cells.length; i++) {
  //  stroke(cells[i].color);
  //  point(cells[i].pos.x,cells[i].pos.y);
  //}
}

function initCells(n, maxX, maxY) {
  let area = maxX*maxY;
  let dist = 50;
  cells = [];
  var placed = 0;
  var tries = 0;
  while (placed<n && tries<100000) {
    let newPt = createVector(random(maxX),random(maxY));
    var farEnough = true;
    for (var i=0; i<placed; i++) {
      if (cells[i].pos.dist(newPt)<dist) {
        farEnough = false;
      }
    }
    if (farEnough) {
      let newCell = new Cell(newPt);
      append(cells, newCell);
      placed++;
    }
    tries++;
  }
  print(tries);
}

function mousePressed() {
  setup();
}

function mouseWheel(event) {
  print(event.delta);
  //move the square according to the vertical scroll amount
  for (var i=0; i<cells.length; i++) {
    let newAdd = createVector(event.delta);
    newAdd.rotate(random(360));
    cells[i].pos.add(newAdd);
  }
  bg = applyVoronoi(cells,inc);
  //uncomment to block page scrolling
  //return false;
}

function applyVoronoi(cs,inc) {
  let img = createImage(int(width/inc),int(height/inc));
  img.loadPixels();
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var minD = cells[0].pos.dist(vec);
      var clstCell = cells[0];
      
      for (var i=1; i<cells.length; i++) {
        let d = cells[i].pos.dist(vec);
        if (d<minD) {
          minD = d;
          clstCell = cells[i];
        }
      }
      writeColor(img, int(x/inc), int(y/inc), clstCell.color);
    }
  }
  img.updatePixels();
  return img;
}

function writeColor(img, x, y, c) {
  let index = (x + y * img.width) * 4;
  img.pixels[index] = red(c);
  img.pixels[index + 1] = green(c);
  img.pixels[index + 2] = blue(c);
  img.pixels[index + 3] = alpha(c);
}


let cells =[];
let maxPts = 60;
let minSpace = 100;
let inc = 10; // affects resolution of voronoi image
let bg;
var showCellNuc = true;

function setup() {
  createCanvas(900, 600);
  initCells(maxPts,width,height);
  bg = applyVoronoi(cells,inc);
  noSmooth();
  
}

function draw() {
  //background(255);
  image(bg,0,0,width,height);
  
  let m = createVector(mouseX,mouseY);
  
  let clstInd = closestCell(m.copy());
  for (i=0; i<cells.length&&showCellNuc; i++) {
    if (i==clstInd) {cells[i].draw(20);}
    else {cells[i].draw(12);}
  }
  for (var i=0; i<cells.length; i++) {
    if (i==clstInd) {cells[i].run(m.copy(), false);}
    else {cells[i].run(m.copy(),true);}
  }
  bg = applyVoronoiHL(cells,inc,cells[clstInd]);
}

function initCells(n, maxX, maxY) {
  let area = maxX*maxY;
  let dist = minSpace;
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
  let m = createVector(mouseX,mouseY);
  let clstCell = cell[closestCell(m)];
  clstCell.color = color(random(255),random(255),random(255));
}

function applyVoronoi(cs,inc) {
  let img = createImage(int(width/inc),int(height/inc));
  img.loadPixels();
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var minD = cells[0].absPos().dist(vec);
      var clstCell = cells[0];
      
      for (var i=1; i<cells.length; i++) {
        let d = cells[i].absPos().dist(vec);
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

function applyVoronoiHL(cs,inc,hlCell) {
  let img = createImage(int(width/inc),int(height/inc));
  img.loadPixels();
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var minD = cells[0].absPos().dist(vec);
      var clstCell = cells[0];
      for (var i=1; i<cells.length; i++) {
        let d = cells[i].absPos().dist(vec);
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


function closestCell(v) {
  if (cells==null||cells.length<1) {return null;}
  var minD = v.dist(cells[0].absPos());
  var minInd = 0;
  for (var i=1; i<cells.length; i++) {
    let d = v.dist(cells[i].absPos());
    if (d<minD) {
      minD = d;
      minInd = i;
    }
  }
  return minInd;
}

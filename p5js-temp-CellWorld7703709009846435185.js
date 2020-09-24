let cells =[];
let blobs =[];
let maxSpace = 2000;
let minSpace = 90;
let inc = 8; // affects resolution of voronoi image
let bg;
var showCellNuc = false;
var manhattanDistances = false;

function setup() {
  createCanvas(900, 600);
  initCells(minSpace,maxSpace,width,height);
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
  bg = applyVoronoi(cells,inc);
  bg = applyBlobs(blobs,inc,bg);
}

function initCells(minD, maxD, maxX, maxY) {
  let area = maxX*maxY;
  let dist = minSpace;
  cells = [];
  var placed = 1;
  var tries = 0;
  let newPt = createVector(random(100,maxX-100),random(100,maxY-100));
  append(cells, new Cell(newPt));
  while ( tries<100000) {
    newPt = createVector(random(100,maxX-100),random(100,maxY-100));
    var farEnough = true;
    var closeEnough = false;
    for (var i=0; i<placed; i++) {
      let d = cells[i].pos.dist(newPt);
      if (d<minD) {
        farEnough = false;
      }
      if (d<maxD) {
        closeEnough = true;
      }
    }
    if (farEnough&&closeEnough) {
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
  let clstCell = cells[closestCell(m)];
  append(blobs,new Blob(clstCell));
}



function applyVoronoi(cs,inc,from) {
  let img = createImage(int(width/inc),int(height/inc));
  if (from!=null) {img = from;}
  img.loadPixels();
  var prevC = color(0);
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var clstCell = cells[closestCell(vec)];
      let c = clstCell.color;
      if (c!= prevC) {c=color(0);}
      writeColor(img, int(x/inc), int(y/inc), c);
      prevC = clstCell.color;
    }
  }
  img.updatePixels();
  return img;
}

//function applyBlobs(bs,inc,from) {
//  let img = createImage(int(width/inc),int(height/inc));
//  if (from!=null) {img = from;}
//  img.loadPixels();
//  for (var y=0; y<height; y+=inc) {
//    for (var x=0; x<width; x+=inc) {
//      let vec = createVector(x,y);
//      var total = 0;
//      for (int i=0; i<bs.size(); i++) {
        
//      }
//      let c = clstCell.color;
//      writeColor(img, int(x/inc), int(y/inc), c);
//    }
//  }
//  img.updatePixels();
//  return img;
//}

function applyBlobs(cs,inc,from) {
  let img = createImage(int(width/inc),int(height/inc));
  if (from!=null) {img = from;}
  img.loadPixels();
  var prevC = color(0);
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var clstCell = cells[closestCell(vec)];
      let c = clstCell.color;
      if (c!= prevC) {c=color(0);}
      writeColor(img, int(x/inc), int(y/inc), c);
      prevC = clstCell.color;
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
  if (cells==null||cells.length<1) {print("no"); return null;}
  var minD = cellDist(v,cells[0].absPos());
  var minInd = 0;
  for (var i=1; i<cells.length; i++) {
    var d = cellDist(v,cells[i].absPos());
    if (d<minD) {
      minD = d;
      minInd = i;
    }
  }
  return minInd;
}

function manhattanDist(v1, v2) {
  return abs(v2.x-v1.x)+abs(v2.y-v1.y);
}
function cellDist(v1,v2) {
  if (manhattanDistances) {return manhattanDist(v1,v2);}
  return v1.dist(v2);
}

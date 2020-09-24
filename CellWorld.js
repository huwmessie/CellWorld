let cells =[];
let blobs =[];
let maxSpace = 2000;
let minSpace = 100;
let inc = 12; // affects resolution of voronoi image
let bg;
var showCellNuc = false;
var manhattanDistances = false;

function setup() {
  createCanvas(1280, 720);
  //createCanvas(640, 480);
  initCells(minSpace,maxSpace,width,height);
  bg = applyVoronoi(cells,inc);
  noSmooth();
  
}

function draw() {
  frameRate(30);
  colorMode(RGB);
  background(128);
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
  let newPt = createVector(random(maxX),random(maxY));
  append(cells, new Cell(newPt));
  while ( tries<100000) {
    newPt = createVector(random(maxX),random(maxY));
    var farEnough = true;
    var closeEnough = false;
    for (var i=0; i<placed; i++) {
      let d = cellDist(cells[i].pos,newPt);
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
  print(blobs.length);
  //me = !me;
}

function mouseDragged() {
  mousePressed();
}



function applyVoronoi(cs,inc,from) {
  colorMode(RGB);
  let img = createImage(int(width/inc),int(height/inc));
  if (from!=null) {img = from;}
  img.loadPixels();
  var prevCx = color(0);
  var prevCys = [];
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var clstCell = cells[closestCell(vec)];
      let c = clstCell.color;
      if (c!= prevCx) {
        c=color(0);
      }
      else if (c!= prevCys[x]) {
        writeColor(img, int(x/inc), int(y/inc)-1, color(0));
      }
      
      writeColor(img, int(x/inc), int(y/inc), c);
      prevCx = clstCell.color;
      prevCys[x] = clstCell.color;
    }
  }
  img.updatePixels();
  return img;
}

function applyBlobs(bs,inc,from) {
  colorMode(RGB);
  let img = createImage(int(width/inc),int(height/inc));
  if (from!=null) {img = from;}
  if (bs.length==0) {return img;}
  img.loadPixels();
  
  for (var y=0; y<height; y+=inc) {
    for (var x=0; x<width; x+=inc) {
      let vec = createVector(x,y);
      var total = 0;
      for (var i=0; i<bs.length; i++) {
        let bp = bs[i].cell.absPos();
        let d = cellDist(vec,bp);
        if (d>0) {total+=bs[i].cell.life/pow(d,2);}
      }
      if (total>1) {
        let c = color(255,0,0);
        writeColor(img, int(x/inc), int(y/inc), c);
      }
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

function getColor(img, x, y) {
  colorMode(RGB);
  
  let index = (x + y * img.width) * 4;
  let red = img.pixels[index];
  let green = img.pixels[index + 1];
  let blue = img.pixels[index + 2];
  let alpha = img.pixels[index + 3];
  
  return color(red, green, blue, alpha);
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

function weirdDist(v1,v2) {
  let dx = v2.x-v1.x;
  let dy = v2.y-v1.y;
  return 2;
}
function cellDist(v1,v2) {
  if (manhattanDistances) {return manhattanDist(v1,v2);}
  return v1.dist(v2);
}

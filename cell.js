class Cell {
  constructor(vec) {
    this.pos = vec;
    this.color = color(random(255),random(255),random(255));
    this.offset = createVector();
    this.vel = createVector();
  }
  
  draw(w) {
    stroke(0);
    strokeWeight(w+2);
    let at = this.pos.copy().add(this.offset);
    point(at.x,at.y);
    stroke(this.color);
    strokeWeight(w);
    point(at.x,at.y);
  }
  
  absPos() {
    return this.pos.copy().add(this.offset);
  }
  
  run(m, repel) {
    this.offset.add(this.vel);
    let aPos = this.absPos();
    let toM = m.copy().sub(aPos);
    if (!repel) {
      let addVel = toM.copy();
      addVel.mult(0.01);
      this.vel.add(addVel);
    }
    else {
      let d = toM.mag();
      let osMag = width/pow(d,0.5)/18;
      osMag = min(osMag,width);
      if (repel) {
        osMag*=-1;
      }
      toM.normalize().mult(osMag);
      this.offset.add(toM);
    }
    this.offset.mult(0.9);
    this.vel.mult(0.9);
  }
}

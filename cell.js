class Cell {
  constructor(vec) {
    this.pos = vec;
    colorMode(RGB);
    this.color = color(random(40,120),random(120,190));
    this.offset = createVector();
    this.vel = createVector();
    this.life = 1000;
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
      //let addVel = toM.copy();
      //addVel.mult(0.0001);
      //this.vel.add(addVel);
      this.vel.mult(0);
    }
    else {
      let d = toM.mag();
      let osMag = minSpace*32/pow(d,1);
      osMag = min(osMag,width);
      if (repel) {
        osMag*=-1;
      }
      toM.normalize().mult(osMag);
      this.offset.add(toM);
    }
    this.offset.mult(0.9);
    this.vel.mult(0.97);
  }
}

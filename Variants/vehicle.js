var mr = 0.1; // arbitrary mutation rate // 10% chance of mutation

function Vehicle(x, y, dna) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(0, -2);
  this.position = createVector(x, y);
  this.r = 4;
  this.maxspeed = 5;
  this.maxforce = 0.5;

  this.health = 1.0;

  this.dna = [];
  if (dna === undefined) {
    // Food weight
    this.dna[0] = random(-2, 2);
    // Poison weight
    this.dna[1] = random(-2, 2);
    // Food perception
    this.dna[2] = random(10, 100);
    // Poison perception
    this.dna[3] = random(10, 100);
  } else {
    for (var i = 0; i < dna.length; i++) {
      this.dna[i] = dna[i];
      if (random(1) < mr) {
        if (i < 2) {
          this.dna[i] += random(-0.2, 0.2);
        } else if (i >= 2) {
          this.dna[i] += random(-10, 10);
          this.dna[i] = constrain(this.dna[i], 0, 100);
        }
      }
    }
  }
  this.update = function() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.health -= 0.002;
  };
  this.applyBehaviors = function(good, bad) {
    var steerG = this.eat(good, 0.06, this.dna[2]);
    var steerB = this.eat(bad, -0.5, this.dna[3]);
    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);
    this.applyForce(steerG);
    this.applyForce(steerB);
  }
  this.applyForce = function(force) {
    this.acceleration.add(force);
  };
  this.clone = function() {
    var r = random(1);
    if (r < 0.001 && this.health > 0.5) {
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
      return null;
    }
  }
  this.repopulate = function() {
      return new Vehicle(random(d * 2, width - d * 2), random(d * 2, height - d * 2), this.dna);
  }
  this.seek = function(target) {
    var desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxspeed);
    var steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  };
  this.eat = function(list, hvalue, perception) {
    var record = Infinity;
    var closest = null;
    for (var i = list.length - 1; i >= 0; i--) {
      var d = p5.Vector.dist(list[i], this.position);
      if (d < this.maxspeed) {
        list.splice(i, 1);
        this.health += hvalue;
      } else if (d < record && d < perception) {
        record = d;
        closest = list[i];
      }
    }
    if (closest != null) {
      return this.seek(closest);
    }
    return createVector(0, 0);
  };
  this.isdead = function() {
    return (this.health < 0);
  }
  this.boundaries = function() {
    var desired = null;
    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }
    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };
  this.show = function() {
    var angle = this.velocity.heading() + PI / 2;
    var green = color(0, 255, 0);
    var red = color(255, 0, 0);
    var col = lerpColor(red, green, this.health);
    var alphy = lerp(50, 100, this.health);
    fill(col);
    noStroke();
    strokeWeight(1);
    push();
    translate(this.position.x, this.position.y);
    rotate(angle);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    if (debug) {
      noFill();
      strokeWeight(4);
      stroke(0, 255, 0, alphy);
      line(0, 0, 0, -this.dna[0] * 15);
      ellipse(0, 0, this.dna[2] * 2);
      strokeWeight(2);
      stroke(255, 0, 0, alphy);
      line(0, 0, 0, -this.dna[1] * 15);
      ellipse(0, 0, this.dna[3] * 2);
    }
    pop();
  };
  this.bounceedges = function() {
    if (this.position.x < 0 || this.position.x > width) {
      this.velocity.x *= -1;
    }
    if (this.position.y < 0 || this.position.y > height) {
      this.position.y *= -1;
    }
  };
  this.wrapedges = function() {
    if (this.position.x > width) this.position.x = 0;
    if (this.position.x < 0) this.position.x = width;
    if (this.position.y > height) this.position.y = 0;
    if (this.position.y < 0) this.position.y = height;
  };

}

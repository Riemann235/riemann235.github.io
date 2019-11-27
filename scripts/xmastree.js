var thetamin = 0,
  thetamax = 6 * Math.PI,
  period = 5,
  linespacing = 1 / 18,
  linelength = linespacing / 2,
  yscreenoffset = 130,
  xscreenoffset = 100,
  xscreenscale = 180,
  yscreenscale = 180,
  ycamera = 2,
  zcamera = -3,

  rate = 1 / (2 * Math.PI), // every rotation y gets one bigger
  factor = rate / 3;

function run() {
  var ctx = document.getElementById('scene').getContext('2d'),
      spirals = [
       /* new Spiral({
          foreground: "#220000", // Second shadow for red spiral
          angleoffset: Math.PI * 0.92,
          factor: 0.90 * factor
        }),
        new Spiral({
            foreground: "#00b359", // Second shadow for cyan spiral
          angleoffset: -Math.PI * 0.08,
          factor: 0.90 * factor
        }),
        new Spiral({
          foreground: "#660000", // red spiral shadow
          angleoffset: Math.PI * 0.95,
          factor: 0.93 * factor
        }),
        new Spiral({
            foreground: "#009966", // cyan spiral shadow
          angleoffset: -Math.PI * 0.05,
          factor: 0.93 * factor
        }), */
        new Spiral({
        foreground: "#0000e6", // blue Spiral
        angleoffset: Math.PI * 1.50,
        factor: factor
        }),
        new Spiral({
          foreground: "#ff0000", // red Spiral
          angleoffset: Math.PI,
          factor: factor
        }),
        new Spiral({
          foreground: "#00ffcc", // cyan spiral
          angleoffset: 0,
          factor: factor
        })];

  renderFrame(); // animation loop starts here

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    ctx.clearRect(0, 0, 200, 200);
    ctx.beginPath();
    spirals.forEach(renderSpiral);
      //drawStar(100, 60, 6, 8, 3);
      drawStar(100, 15, 6, 8, 3);
  }

  function renderSpiral(spiral) {
    spiral.render(ctx);
  }

  function Spiral(config) {
    var offset = 0;
    var lineSegments = computeLineSegments();

    this.render = function(ctx) {
      offset -= 1;
      if (offset <= -period) {
        offset += period;
      }

      lineSegments[offset].forEach(drawLineSegment);
    };

    function drawLineSegment(segment) {
      stroke(config.foreground, segment.start.alpha);
      ctx.moveTo(segment.start.x, segment.start.y);
      ctx.lineTo(segment.end.x, segment.end.y);
    }

    function computeLineSegments() {
      var lineSegments = {};
      var factor = config.factor;
      var thetanew, thetaold;
      for (var offset = 0; offset > -period; offset--) {
        lineSegments[offset] = lines = [];
        for (var theta = thetamin + getdtheta(thetamin, offset * linespacing / period, rate, factor); theta < thetamax; theta += getdtheta(theta, linespacing, rate, factor)) {
          thetaold = (theta >= thetamin) ? theta : thetamin;
          thetanew = theta + getdtheta(theta, linelength, rate, factor);

          if (thetanew <= thetamin) {
            continue;
          }

          lines.push({
            start: getPointByAngle(thetaold, factor, config.angleoffset, rate),
            end: getPointByAngle(thetanew, factor, config.angleoffset, rate)
          });
        }
      }

      return lineSegments;
    }
  }

  function stroke(color, alpha) {
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
  }

  function getPointByAngle(theta, factor, angleoffset, rate) {
    var x = theta * factor *  Math.cos(theta + angleoffset);
    var z = - theta * factor * Math.sin(theta + angleoffset);
    var y = rate * theta;
    // now that we have 3d coorinates, project them into 2d space:
    var point = projectTo2d(x, y, z);
    // calculate point's color alpha level:
    point.alpha = Math.atan((y * factor / rate * 0.1 + 0.02 - z) * 40) * 0.35 + 0.65;

    return point;
  }

  function getdtheta(theta, lineLength, rate, factor) {
    return lineLength / Math.sqrt(rate * rate + factor * factor * theta * theta);
  }

  function projectTo2d(x, y, z) {
    return {
      x: xscreenoffset + xscreenscale * (x / (z - zcamera)),
      y: yscreenoffset + yscreenscale * ((y - ycamera) / (z - zcamera))
    };
  }

  // I actually want it to be slower then 60fps
  function requestAnimationFrame(callback) {
    window.setTimeout(callback, 1000 / 24);
  }

    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        ctx.save();
        var rot = Math.PI / 2 * 3;
        var x = cx;
        var y = cy;
        var step = Math.PI / spikes;

        ctx.strokeSyle = "#e9ecef";
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius)
        for (i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y)
            rot += step

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y)
            rot += step
        }
        ctx.lineTo(cx, cy - outerRadius)
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#ffcc00";
        /*ctx.strokeStyle='blue';*/
        ctx.stroke();
        ctx.fillStyle = "#ffff99";
        /*ctx.fillStyle='skyblue';*/
        ctx.fill();
        ctx.restore();
    }
}
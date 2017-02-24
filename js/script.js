
var executeFirst = function(){


  var w = canvas.width = window.innerWidth,
    h = canvas.height = window.innerHeight,
    ctx = canvas.getContext( '2d' ),
    
    opts = {
      
      len: 20,
      count: 50,
      baseTime: 10,
      addedTime: 10,
      dieChance: .05,
      spawnChance: 1,
      sparkChance: .1,
      sparkDist: 10,
      sparkSize: 2,
      
      color: 'hsl(hue,100%,light%)',
      baseLight: 50,
      addedLight: 10, // [50-10,50+10]
      shadowToTimePropMult: 6,
      baseLightInputMultiplier: .01,
      addedLightInputMultiplier: .02,
      
      cx: w / 2,
      cy: h / 2,
      repaintAlpha: .04,
      hueChange: .1
    },
    
    tick = 0,
    lines = [],
    dieX = w / 2 / opts.len,
    dieY = h / 2 / opts.len,
    
    baseRad = Math.PI * 2 / 6;
    
ctx.fillStyle = 'black';
ctx.fillRect( 0, 0, w, h );

function loop() {
  
  window.requestAnimationFrame( loop );
  
  ++tick;
  
  ctx.globalCompositeOperation = 'source-over';
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(0,0,0,alp)'.replace( 'alp', opts.repaintAlpha );
  ctx.fillRect( 0, 0, w, h );
  ctx.globalCompositeOperation = 'lighter';
  
  if( lines.length < opts.count && Math.random() < opts.spawnChance )
    lines.push( new Line );
  
  lines.map( function( line ){ line.step(); } );
}
function Line(){
  
  this.reset();
}
Line.prototype.reset = function(){
  
  this.x = 0;
  this.y = 0;
  this.addedX = 0;
  this.addedY = 0;
  
  this.rad = 0;
  
  this.lightInputMultiplier = opts.baseLightInputMultiplier + opts.addedLightInputMultiplier * Math.random();
  
  this.color = opts.color.replace( 'hue', tick * opts.hueChange );
  this.cumulativeTime = 0;
  
  this.beginPhase();
}
Line.prototype.beginPhase = function(){
  
  this.x += this.addedX;
  this.y += this.addedY;
  
  this.time = 0;
  this.targetTime = ( opts.baseTime + opts.addedTime * Math.random() ) |0;
  
  this.rad += baseRad * ( Math.random() < .5 ? 1 : -1 );
  this.addedX = Math.cos( this.rad );
  this.addedY = Math.sin( this.rad );
  
  if( Math.random() < opts.dieChance || this.x > dieX || this.x < -dieX || this.y > dieY || this.y < -dieY )
    this.reset();
}
Line.prototype.step = function(){
  
  ++this.time;
  ++this.cumulativeTime;
  
  if( this.time >= this.targetTime )
    this.beginPhase();
  
  var prop = this.time / this.targetTime,
      wave = Math.sin( prop * Math.PI / 2  ),
      x = this.addedX * wave,
      y = this.addedY * wave;
  
  ctx.shadowBlur = prop * opts.shadowToTimePropMult;
  ctx.fillStyle = ctx.shadowColor = this.color.replace( 'light', opts.baseLight + opts.addedLight * Math.sin( this.cumulativeTime * this.lightInputMultiplier ) );
  ctx.fillRect( opts.cx + ( this.x + x ) * opts.len, opts.cy + ( this.y + y ) * opts.len, 2, 2 );
  
  if( Math.random() < opts.sparkChance )
    ctx.fillRect( opts.cx + ( this.x + x ) * opts.len + Math.random() * opts.sparkDist * ( Math.random() < .5 ? 1 : -1 ) - opts.sparkSize / 2, opts.cy + ( this.y + y ) * opts.len + Math.random() * opts.sparkDist * ( Math.random() < .5 ? 1 : -1 ) - opts.sparkSize / 2, opts.sparkSize, opts.sparkSize )
}
loop();

window.addEventListener( 'resize', function(){
  
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  ctx.fillStyle = 'black';
  ctx.fillRect( 0, 0, w, h );
  
  opts.cx = w / 2;
  opts.cy = h / 2;
  
  dieX = w / 2 / opts.len;
  dieY = h / 2 / opts.len;
});
}

$(document).ready(function(){

var minNumber = 1;
var maxNumber = 3;

randomNumberFromRange(minNumber, maxNumber);
var random;
function randomNumberFromRange(min,max)
{
    random = Math.floor(Math.random()*(max-min+1)+min);
}

if (random == 1) {

  executeFirst();

}else if(random == 2){


      var canvas,
        ctx,
        width,
        height,
        size,
        lines,
        tick;

      function line() {
        this.path = [];
        this.speed = rand( 10, 20 );
        this.count = randInt( 10, 30 );
        this.x = width / 2, + 1;
        this.y = height / 2 + 1;
        this.target = { x: width / 2, y: height / 2 };
        this.dist = 0;
        this.angle = 0;
        this.hue = tick / 5;
        this.life = 1;
        this.updateAngle();
        this.updateDist();
      }

      line.prototype.step = function( i ) {
        this.x += Math.cos( this.angle ) * this.speed;
        this.y += Math.sin( this.angle ) * this.speed;
        
        this.updateDist();
        
        if( this.dist < this.speed ) {
          this.x = this.target.x;
          this.y = this.target.y;
          this.changeTarget();
        }
          
        this.path.push( { x: this.x, y: this.y } ); 
        if( this.path.length > this.count ) {
          this.path.shift();
        }
        
        this.life -= 0.001;
        
        if( this.life <= 0 ) {
          this.path = null;
          lines.splice( i, 1 ); 
        }
      };

      line.prototype.updateDist = function() {
        var dx = this.target.x - this.x,
          dy = this.target.y - this.y;
        this.dist = Math.sqrt( dx * dx + dy * dy );
      }

      line.prototype.updateAngle = function() {
        var dx = this.target.x - this.x,
          dy = this.target.y - this.y;
        this.angle = Math.atan2( dy, dx );
      }

      line.prototype.changeTarget = function() {
        var randStart = randInt( 0, 3 );
        switch( randStart ) {
          case 0: // up
            this.target.y = this.y - size;
            break;
          case 1: // right
            this.target.x = this.x + size;
            break;
          case 2: // down
            this.target.y = this.y + size;
            break;
          case 3: // left
            this.target.x = this.x - size;
        }
        this.updateAngle();
      };

      line.prototype.draw = function( i ) {
        ctx.beginPath();
        var rando = rand( 0, 10 );
        for( var j = 0, length = this.path.length; j < length; j++ ) {
          ctx[ ( j === 0 ) ? 'moveTo' : 'lineTo' ]( this.path[ j ].x + rand( -rando, rando ), this.path[ j ].y + rand( -rando, rando ) );
        }
        ctx.strokeStyle = 'hsla(' + rand( this.hue, this.hue + 30 ) + ', 80%, 55%, ' + ( this.life / 3 ) + ')';
        ctx.lineWidth = rand( 0.1, 2 );
        ctx.stroke();
      };

      function rand( min, max ) {
        return Math.random() * ( max - min ) + min;
      }

      function randInt( min, max ) {
        return Math.floor( min + Math.random() * ( max - min + 1 ) );
      };

      function init() {
        canvas = document.getElementById( 'canvas' );
        ctx = canvas.getContext( '2d' );
        size = 30;
        lines = [];
        reset();
        loop();
      }

      function reset() {
        width = Math.ceil( window.innerWidth / 2 ) * 2;
        height = Math.ceil( window.innerHeight / 2 ) * 2;
        tick = 0;
        
        lines.length = 0; 
        canvas.width = width;
        canvas.height = height;
      }

      function create() {
        if( tick % 10 === 0 ) {   
          lines.push( new line());
        }
      }

      function step() {
        var i = lines.length;
        while( i-- ) {
          lines[ i ].step( i ); 
        }
      }

      function clear() {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'hsla(0, 0%, 0%, 0.1';
        ctx.fillRect( 0, 0, width, height );
        ctx.globalCompositeOperation = 'lighter';
      }

      function draw() {
        ctx.save();
        ctx.translate( width / 2, height / 2 );
        ctx.rotate( tick * 0.001 );
        var scale = 0.8 + Math.cos( tick * 0.02 ) * 0.2;
        ctx.scale( scale, scale );
        ctx.translate( -width / 2, -height / 2 );
        var i = lines.length;
        while( i-- ) {
          lines[ i ].draw( i ); 
        }
        ctx.restore();
      }

      function loop() {
        requestAnimationFrame( loop );
        create();
        step();
        clear();
        draw();
        tick++;
      }

      function onresize() {
        reset();  
      }

      window.addEventListener( 'resize', onresize );

      init();
}else{
  $('#canvas').css('background-image', 'url(http://www.marcoguglie.it/Codepen/AnimatedHeaderBg/demo-1/img/demo-1-bg.jpg)');
  
  (function() {

    var width, height, largeHeader, canvas, ctx, points, target, animateHeader = true;

    // Main
    initHeader();
    initAnimation();
    addListeners();

    function initHeader() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};


        canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        // create points
        points = [];
        for(var x = 0; x < width; x = x + width/20) {
            for(var y = 0; y < height; y = y + height/20) {
                var px = x + Math.random()*width/20;
                var py = y + Math.random()*height/20;
                var p = {x: px, originX: px, y: py, originY: py };
                points.push(p);
            }
        }

        // for each point find the 5 closest points
        for(var i = 0; i < points.length; i++) {
            var closest = [];
            var p1 = points[i];
            for(var j = 0; j < points.length; j++) {
                var p2 = points[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in points) {
            var c = new Circle(points[i], 2+Math.random()*2, 'rgba(255,255,255,0.3)');
            points[i].circle = c;
        }
    }

    // Event handling
    function addListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
        window.addEventListener('scroll', scrollCheck);
        window.addEventListener('resize', resize);
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        target.x = posx;
        target.y = posy;
    }

    function scrollCheck() {
        if(document.body.scrollTop > height) animateHeader = false;
        else animateHeader = true;
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    // animation
    function initAnimation() {
        animate();
        for(var i in points) {
            shiftPoint(points[i]);
        }
    }

    function animate() {
        if(animateHeader) {
            ctx.clearRect(0,0,width,height);
            for(var i in points) {
                // detect points in range
                if(Math.abs(getDistance(target, points[i])) < 4000) {
                    points[i].active = 0.3;
                    points[i].circle.active = 0.6;
                } else if(Math.abs(getDistance(target, points[i])) < 20000) {
                    points[i].active = 0.1;
                    points[i].circle.active = 0.3;
                } else if(Math.abs(getDistance(target, points[i])) < 40000) {
                    points[i].active = 0.02;
                    points[i].circle.active = 0.1;
                } else {
                    points[i].active = 0;
                    points[i].circle.active = 0;
                }

                drawLines(points[i]);
                points[i].circle.draw();
            }
        }
        requestAnimationFrame(animate);
    }

    function shiftPoint(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftPoint(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }
    
})();
}

});
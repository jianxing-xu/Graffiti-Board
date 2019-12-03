function hasClass(dom, name) {
  let names = dom.className;
  let i = names.indexOf(name);
  if (~i) {
    return true;
  }
  return false;
}
function toggleClass(dom, name) {
  let f = hasClass(dom, name);
  if (f) {
    dom.className = dom.className.replace(name, '');
  } else {
    dom.className = dom.className += " " + name;
  }
}
const draw = {
  canvas: document.getElementById('canvas'),
  ctx: document.getElementById('canvas').getContext('2d'),
  arrow: document.getElementById('arrow'),
  colors: document.getElementById('colors'),
  range: document.getElementById('range'),
  save: document.getElementById('save'),
  pickColor: document.getElementById('pickColor'),
  imgArr: [],
  isRubrer: false,
  color: '#222',
  lineWidth: 3,
  lineCap: 'round',
  lineJoin: 'round',
  isDown: false,
  getPos(e){
    return {
      x: e.pageX,
      y: e.pageY
    }
  },
  drawLine(begin,control,end) {
    this.ctx.beginPath();
    this.ctx.moveTo(begin.x,begin.y);
    this.ctx.quadraticCurveTo(control.x,control.y,end.x,end.y);
    this.ctx.stroke();
    this.ctx.closePath();
  },
  init() {
    this.ctx.strokeStyle = '#000';
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0,0,10000,10000);
    this.drawing();
    this.bindEvent();
  },
  setStyle(){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = this.lineCap;
    this.ctx.lineJoin = this.lineJoin;
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = this.lineWidth/2;
  },
  drawing() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDown = true;
      this.setStyle();
      var {x,y} = this.getPos(e);
      this.ctx.beginPath();
      this.ctx.moveTo(x,y);
      this.imgArr.push(this.ctx.getImageData(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight));
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDown) {
        var {x,y} = this.getPos(e);
        this.ctx.lineTo(x,y);
        this.ctx.stroke();
      }
    });
    this.canvas.addEventListener('mouseup', (e) => {
      this.isDown = false;
      this.saveImg();
    });
    this.canvas.onmouseout = () => {
      this.isDown = false;
      this.saveImg();
    }
    this.range.onchange = (e) => {
      this.lineWidth = e.target.value;
    }
  },
  bindEvent() {
    this.pickColor.onchange = (e) => {
      this.color = e.target.value;
    }
    this.arrow.addEventListener('click', (e) => {
      let { c } = e.target.dataset;
      if (c === "prev") {
        if (this.imgArr.length > 0) {
          this.ctx.putImageData(this.imgArr.pop(), 0, 0);
        }
      }
      if(c === "clear") {
        this.imgArr.push(this.ctx.getImageData(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight));
        this.saveImg();
        this.ctx.clearRect(0,0,10000,10000);
      }
    });
    this.colors.addEventListener('click', (e) => {
      let { c } = e.target.dataset;
      let children = [...this.colors.children];
      children.forEach(item => {
        item.className = item.className.replace('active', '');
        item.style.boxShadow = '';
      });
      e.target.classList.add('active');
      e.target.style.boxShadow = `0 0 10px 0 ${c}`
      this.color = c;
    });
  },
  saveImg() {
    let img = this.canvas.toDataURL();
    this.save.download = 'canvas绘图';
    this.save.href = img;
  }
}
draw.init();

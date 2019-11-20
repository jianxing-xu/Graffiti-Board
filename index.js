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
  init() {
    this.ctx.strokeStyle = '#000';
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineCap = this.lineCap;
    this.ctx.lineJoin = this.lineJoin;
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.ctx.fillStyle = '#fff';
    this.ctx.fillRect(0,0,10000,10000);
    this.drawing();
    this.bindEvent();
  },
  drawing() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDown = true;
      this.ctx.beginPath();
      this.ctx.moveTo(e.pageX, e.pageY);
      var img = this.ctx.getImageData(0, 0, this.canvas.offsetWidth, this.canvas.offsetHeight);
      this.imgArr.push(img);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDown) {
        this.ctx.lineTo(e.pageX, e.pageY);
        this.ctx.stroke();
      }
    });
    this.canvas.addEventListener('mouseup', (e) => {
      this.isDown = false;
      this.ctx.closePath();
      this.saveImg();
    });
    this.canvas.onmouseout = () => {
      this.isDown = false;
      this.ctx.closePath();
    }
    this.range.onchange = (e) => {
      this.ctx.lineWidth = e.target.value;
    }
  },
  bindEvent() {
    this.pickColor.onchange = (e) => {
      this.ctx.strokeStyle = e.target.value;
    }
    this.arrow.addEventListener('click', (e) => {
      let { c } = e.target.dataset;
      if (c === "prev") {
        if (this.imgArr.length > 0) {
          this.ctx.putImageData(this.imgArr.pop(), 0, 0);
        }
      }
      if(c === "clear") {
        this.ctx.clearRect(0,0,10000,10000);
      }
    });
    this.colors.addEventListener('click', (e) => {
      let { c } = e.target.dataset;
      let children = [...this.colors.children];
      children.forEach(item => {
        item.className = item.className.replace('active', '');
      });
      e.target.classList.add('active');
      this.ctx.strokeStyle = c;
    });
  },
  saveImg() {
    let img = this.canvas.toDataURL();
    this.save.download = 'canvas绘图';
    this.save.href = img;
  }
}
draw.init();

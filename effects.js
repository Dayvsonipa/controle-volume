/* Visual de avaria: apenas animação local, sem áudio e sem alterar a medição. */
(function (scope) {
  'use strict';
  function advanceDamage(heat, dt, status, enabled, active, calibrating) {
    if (!enabled || !active || calibrating) return 0;
    const seconds = Math.max(0, Math.min(dt, 250)) / 1000;
    if (status === 'alert') return Math.min(1, heat + seconds * .065);
    if (status === 'attention') return heat < .22 ? Math.min(.22, heat + seconds * .045) : Math.max(.22, heat - seconds * .07);
    return Math.max(0, heat - seconds * .14);
  }
  function damageStage(heat) { return heat >= .88 ? 'critical' : heat >= .48 ? 'overload' : heat >= .08 ? 'warm' : 'stable'; }
  if (typeof module !== 'undefined' && module.exports) { module.exports = { advanceDamage, damageStage }; return; }

  class BunkerDamage {
    constructor(root, canvas, readout) {
      this.root = root; this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.readout = readout;
      this.heat = 0; this.enabled = true; this.particles = []; this.sparks = []; this.spawn = 0; this.sparkClock = 0; this.lastDraw = 0; this.state = '';
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.smoke = this.makeSmoke();
      this.resize = () => {
        const rect = root.getBoundingClientRect(); this.width = rect.width; this.height = rect.height;
        this.ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = Math.round(rect.width * this.ratio); canvas.height = Math.round(rect.height * this.ratio);
        this.ctx?.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
        this.particles.length = 0; this.sparks.length = 0;
      };
      this.observer = new ResizeObserver(this.resize); this.observer.observe(root); this.resize(); this.clear();
    }
    makeSmoke() {
      const sprite = document.createElement('canvas'); sprite.width = sprite.height = 160;
      const c = sprite.getContext('2d'); if (!c) return sprite;
      const lobes = [[80,80,73],[57,65,48],[102,60,42],[108,97,43],[51,96,45],[80,110,40],[74,41,37]];
      for (const [x,y,r] of lobes) {
        const g = c.createRadialGradient(x,y,1,x,y,r);
        g.addColorStop(0,'rgba(160,163,153,.42)'); g.addColorStop(.37,'rgba(115,121,114,.30)'); g.addColorStop(.7,'rgba(75,83,77,.15)'); g.addColorStop(1,'rgba(55,60,55,0)');
        c.fillStyle = g; c.fillRect(x-r,y-r,r*2,r*2);
      }
      return sprite;
    }
    reset() { this.heat = 0; this.spawn = 0; this.sparkClock = 0; this.particles.length = 0; this.sparks.length = 0; this.clear(); this.present('stable', false); }
    clear() { if (this.ctx) this.ctx.clearRect(0,0,this.width,this.height); }
    setEnabled(value) { this.enabled = value; if (!value) this.reset(); }
    preview() { if (this.enabled) this.heat = 1; }
    present(stage, recovering) {
      const state = stage + (recovering ? '-cooling' : '');
      this.root.style.setProperty('--damage', this.heat.toFixed(3));
      if (state === this.state) return;
      this.state = state; this.root.dataset.damage = stage;
      this.readout.textContent = recovering ? 'RESFRIAMENTO EM CURSO • REDUZA A CONVERSA' : ({stable:'BUNKER SONORO • SALA DE AULA',warm:'SISTEMA AQUECENDO • VENTILAÇÃO ATIVA',overload:'SOBRECARGA • FALHA NA VENTILAÇÃO',critical:'PANE CRÍTICA • CONTENÇÃO COMPROMETIDA'})[stage];
    }
    step(now, dt, status, active, calibrating, soundLevel = 0) {
      this.heat = advanceDamage(this.heat, dt, status, this.enabled, active, calibrating);
      const stage = damageStage(this.heat); this.present(stage, active && status === 'normal' && this.heat >= .08);
      if (!this.ctx) return;
      if (!this.enabled || !active || calibrating || this.motion.matches || this.heat < .01) {
        this.particles.length = 0; this.sparks.length = 0; this.spawn = 0; this.clear(); this.lastDraw = now; return;
      }
      if (now - this.lastDraw < 33) return;
      const seconds = Math.min((now - this.lastDraw) / 1000, .1); this.lastDraw = now;
      const w = this.width, h = this.height;
      // A fumaça sobe pelos flancos, preservando o centro de leitura e os controles.
      const vents = [[w*.065,h*.17,-1],[w*.935,h*.17,1],[w*.045,h*.69,-1],[w*.955,h*.69,1]];
      this.spawn += seconds * (5 + this.heat * 34) * (.5 + Math.min(1, Math.max(0, soundLevel / 100)) * .5);
      while (this.spawn >= 1 && this.particles.length < 110) {
        this.spawn -= 1; const v = vents[Math.floor(Math.random()*vents.length)];
        this.particles.push({x:v[0]+(Math.random()-.5)*18,y:v[1],vx:(Math.random()-.5)*13-v[2]*6,vy:-20-Math.random()*25,size:w*(.04+Math.random()*.035),age:0,life:4+Math.random()*2,angle:Math.random()*6,spin:(Math.random()-.5)*.2,opacity:.2+this.heat*.8});
      }
      this.spawn = Math.min(this.spawn, 1);
      this.clear();
      if (this.heat > .48) for (const v of vents.slice(2)) {
        const glow = this.ctx.createRadialGradient(v[0],v[1],2,v[0],v[1],w*.09);
        glow.addColorStop(0,`rgba(255,104,30,${(this.heat-.48)*.7})`); glow.addColorStop(.3,`rgba(255,46,10,${(this.heat-.48)*.25})`); glow.addColorStop(1,'rgba(255,40,0,0)');
        this.ctx.fillStyle = glow; this.ctx.fillRect(v[0]-w*.1,v[1]-w*.1,w*.2,w*.2);
      }
      this.particles = this.particles.filter(p=>p.age<p.life);
      for (const p of this.particles) {
        p.age += seconds; p.x += p.vx*seconds+Math.sin(now*.0008+p.angle)*seconds*4; p.y += p.vy*seconds; p.angle += p.spin*seconds;
        const progress = p.age/p.life, size = p.size*(1+progress*2.7);
        this.ctx.save(); this.ctx.globalAlpha = Math.max(0,Math.sin(Math.min(1,progress)*Math.PI)*p.opacity*this.heat); this.ctx.translate(p.x,p.y); this.ctx.rotate(p.angle);
        this.ctx.drawImage(this.smoke,-size,-size,size*2,size*2); this.ctx.restore();
      }
      this.sparkClock += seconds;
      if (this.heat > .48 && status === 'alert' && this.sparkClock > .65 && this.sparks.length < 24) {
        this.sparkClock = 0; const v = vents[2+Math.floor(Math.random()*2)];
        for(let i=0;i<6;i++) this.sparks.push({x:v[0],y:v[1],vx:(Math.random()-.5)*w*.23,vy:-25-Math.random()*75,age:0,life:.35+Math.random()*.5});
      }
      this.sparks = this.sparks.filter(s=>s.age<s.life);
      this.ctx.lineWidth = 1.5;
      for (const s of this.sparks) {
        s.age += seconds; s.x += s.vx*seconds; s.y += s.vy*seconds; s.vy += 130*seconds;
        this.ctx.globalAlpha = Math.max(0,(1-s.age/s.life)*this.heat); this.ctx.strokeStyle = '#ffc878'; this.ctx.beginPath(); this.ctx.moveTo(s.x,s.y); this.ctx.lineTo(s.x-s.vx*.035,s.y-s.vy*.035); this.ctx.stroke();
      }
      this.ctx.globalAlpha = 1;
      // Máscara suave: números, mensagens e botões permanecem legíveis e clicáveis.
      this.ctx.save(); this.ctx.globalCompositeOperation = 'destination-out';
      const mask = this.ctx.createLinearGradient(0,0,w,0);
      mask.addColorStop(0,'rgba(0,0,0,0)'); mask.addColorStop(.17,'rgba(0,0,0,0)'); mask.addColorStop(.29,'rgba(0,0,0,.95)'); mask.addColorStop(.71,'rgba(0,0,0,.95)'); mask.addColorStop(.83,'rgba(0,0,0,0)'); mask.addColorStop(1,'rgba(0,0,0,0)');
      this.ctx.fillStyle = mask; this.ctx.fillRect(0,0,w,h); this.ctx.fillStyle = '#000'; this.ctx.fillRect(0,h*.8,w,h*.2); this.ctx.restore();
    }
  }
  scope.BunkerDamage = BunkerDamage;
})(typeof window !== 'undefined' ? window : globalThis);

const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const elements=new Map();
function element(){return {children:[],style:{setProperty(){}},classList:{toggle(){}},value:50,textContent:'',dataset:{},listeners:{},addEventListener(n,fn){this.listeners[n]=fn},appendChild(c){this.children.push(c)},querySelector(){return element()},setAttribute(){},getBoundingClientRect(){return {width:300,height:80}},getContext(){return new Proxy({}, {get:()=>()=>{}})}}};
let time=0,amplitude=.011,stopped=0,closed=0,getUserMedia;
const track={stop(){stopped++},addEventListener(){}};
class AudioContext {state='running';resume(){return Promise.resolve()}close(){closed++;this.state='closed';return Promise.resolve()}createAnalyser(){return {fftSize:2048,getFloatTimeDomainData(data){data.fill(amplitude)}}}createMediaStreamSource(){return {connect(){}}}}
const context=vm.createContext({document:{getElementById(id){if(!elements.has(id))elements.set(id,element());return elements.get(id)},querySelectorAll(){return []},createElement:element,createElementNS:element,addEventListener(){}},localStorage:{getItem(){return null},setItem(){}},window:{AudioContext,addEventListener(){}},navigator:{mediaDevices:{getUserMedia(...a){return getUserMedia(...a)}}},performance:{now:()=>time},ResizeObserver:class{observe(){}},requestAnimationFrame(){},devicePixelRatio:1,Float32Array,Math,Date,Number,JSON,Array,Blob,URL,setTimeout(){},clearTimeout(){}});
vm.runInContext(fs.readFileSync('app.js','utf8'),context);
const run=src=>vm.runInContext(src,context);
(async()=>{
 getUserMedia=async()=>({getTracks:()=>[track],getAudioTracks:()=>[track]});
 await run('startMic()');assert.equal(run('active'),true);assert.equal(run('mode'),'mic');
 run('tick(100)');assert.ok(run('level')>50&&run('level')<53);assert.equal(run('status'),'attention');
 run('pauseMonitoring()');assert.equal(run('active'),false);assert.equal(stopped,1);assert.equal(closed,1);
 await run('startMic(true)');assert.equal(run('active'),true);
 amplitude=.001;time=1000;elements.get('calibrate').listeners.click();for(time=1100;time<=6100;time+=100)run(`tick(${time})`);
 assert.equal(run('calibration'),null);assert.ok(Math.abs(run('config.baseline')+65)<.01);
 amplitude=.1;for(time=6200;time<=12000;time+=100)run(`tick(${time})`);assert.equal(run('status'),'alert');
 amplitude=.0001;for(time=12100;time<=18000;time+=100)run(`tick(${time})`);assert.equal(run('status'),'normal');
 run('pauseMonitoring()');getUserMedia=async()=>{throw Object.assign(new Error('denied'),{name:'NotAllowedError'})};await run('startMic()');assert.equal(run('active'),false);assert.equal(run('pending'),false);assert.match(elements.get('message').textContent,/LIBERE/);
 let resolveOld;getUserMedia=()=>new Promise(resolve=>resolveOld=resolve);const old=run('startMic()');await Promise.resolve();await Promise.resolve();run('pauseMonitoring()');
 getUserMedia=async()=>({getTracks:()=>[track],getAudioTracks:()=>[track]});await run('startMic()');const before=stopped;resolveOld({getTracks:()=>[{stop(){stopped++}}]});await old;assert.equal(run('active'),true);assert.equal(run('pending'),false);assert.equal(stopped,before+1);
 run('pauseMonitoring()');console.log('PASS: microphone start/pause/resume, calibration, moving-average alerts, permission failure, stale request cleanup.');
})().catch(e=>{console.error(e);process.exitCode=1});

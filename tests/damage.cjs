const assert = require('node:assert/strict');
const {advanceDamage, damageStage} = require('../effects.js');
function advance(seconds, status, initial=0){let heat=initial;for(let ms=0;ms<seconds*1000;ms+=100)heat=advanceDamage(heat,100,status,true,true,false);return heat;}
assert.equal(advance(20,'normal'),0,'Silence does not cause damage');
const warm=advance(20,'attention');assert.ok(warm<=.22);assert.equal(damageStage(warm),'warm','Attention only warms the panel');
assert.equal(damageStage(advance(2,'alert')),'warm','A short alert does not cause instant critical failure');
assert.equal(damageStage(advance(9,'alert')),'overload');
const critical=advance(16,'alert');assert.equal(critical,1);assert.equal(damageStage(critical),'critical');
assert.equal(advance(9,'normal',critical),0,'Quiet restores the panel');
assert.equal(damageStage(advance(15,'attention',critical)),'warm','Attention reduces the damage but retains warmth');
assert.equal(advanceDamage(1,100,'alert',true,false,false),0,'Pausing clears the damage');
assert.equal(advanceDamage(1,100,'alert',true,true,true),0,'Calibration clears the damage');
assert.equal(advanceDamage(1,100,'alert',false,true,false),0,'Effects can be disabled');
assert.ok(advanceDamage(0,60000,'alert',true,true,false)<.02,'A backgrounded frame must not immediately destroy the panel');
console.log('PASS: progressive damage, silence recovery, short peaks, pause, calibration, disabled effects and frame gaps.');

const assert = require('node:assert/strict');
const {advanceDamage,damageStage}=require('../effects.js');
const levels=require('../levels.js');
function advance(seconds,status,initial=0){let heat=initial;for(let ms=0;ms<seconds*1000;ms+=100)heat=advanceDamage(heat,100,status,true,true,false);return heat;}
for(const [value,id] of [[0,'normal'],[49,'normal'],[50,'attention'],[59,'attention'],[60,'warning'],[69,'warning'],[70,'alert'],[79,'alert'],[80,'overload'],[89,'overload'],[90,'critical'],[100,'critical']])assert.equal(levels.forValue(value).id,id,`Boundary ${value}`);
assert.equal(levels.forValue(49.49).id,'normal');assert.equal(levels.forValue(49.5).id,'attention','Uses the displayed rounded average');
assert.equal(levels.forValue(-10).id,'normal');assert.equal(levels.forValue(150).id,'critical');
const expectedStages=['stable','stable','warm','overload','overload','critical'];
levels.tiers.forEach((tier,i)=>{const heat=advance(60,tier.id);assert.equal(heat,tier.heat,`${tier.id} must not exceed its own tier after a long duration`);assert.equal(damageStage(heat),expectedStages[i]);});
assert.equal(advance(10,'normal',1),0,'Quiet fully restores the panel');
assert.equal(advance(10,'warning',1),.28,'Reducing to 60–69 also reduces the damage');
assert.equal(advance(10,'attention',1),.06,'Dropping to 50–59 removes smoke');
assert.equal(advanceDamage(1,100,'critical',true,false,false),0,'Pause clears effects');
assert.equal(advanceDamage(1,100,'critical',true,true,true),0,'Calibration clears effects');
assert.equal(advanceDamage(1,100,'critical',false,true,false),0,'Disable clears effects');
assert.ok(advanceDamage(0,60000,'critical',true,true,false)<.1,'A delayed frame cannot trigger full damage');
console.log('PASS: all tier boundaries, displayed-average rounding, tier limits, progressive damage, recovery and reset controls.');

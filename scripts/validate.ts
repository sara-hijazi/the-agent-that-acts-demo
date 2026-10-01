import { availability, initialJourney, journeyReducer, parseRequest } from '../src/engine/agent';
function assert(value:unknown,message:string):asserts value {if(!value)throw new Error(message);}
const now=new Date(2026,9,4,12);
const cases=[['أبغا استشارة تسويقية الأسبوع الجاي بعد الظهر لمناقشة إطلاق منتج جديد','launch','afternoon'],['احجز لي موعد صباح الأربعاء لمناقشة استراتيجية المحتوى','content','morning'],['I need a marketing consultation next week to discuss a new campaign.','campaign','any'],['Book Tuesday evening to discuss marketing strategy','strategy','evening'],['احجز استشارة بكرة في المساء','general','evening']] as const;
for(const [request,topic,period] of cases){const c=parseRequest(request,now);assert(c.intent==='booking','intent');assert(c.topic===topic,'topic');assert(c.period===period,'period');const {slots,exact}=availability(c,now);assert(slots.length>=2&&slots.length<=3,'two or three slots');assert(exact,'expected matching slots');assert(slots.every(s=>period==='any'||period==='morning'&&s.hour<12||period==='afternoon'&&s.hour>=12&&s.hour<18||period==='evening'&&s.hour>=18),'time preference');if(c.dateKind==='weekday')assert(slots.every(s=>new Date(`${s.date}T12:00:00`).getDay()===c.weekday),'weekday preference');}
assert(parseRequest('write a poem',now).intent==='unknown','unsupported request');
assert(parseRequest('احجز بكرة',now).date==='2026-10-05','tomorrow');
assert(parseRequest('Book Wednesday next week',now).date==='2026-10-07','next-week weekday');
assert(!availability(parseRequest('Book Friday morning',now),now).exact,'unavailable day fallback');
let s=initialJourney();s=journeyReducer(s,{type:'finish'});assert(s.records.length===0,'cannot execute from home');s=journeyReducer(s,{type:'start'});s=journeyReducer(s,{type:'understand',context:parseRequest('Book a marketing consultation next week afternoon')});s=journeyReducer(s,{type:'ready'});assert(s.context,'context');const slot=availability(s.context).slots[0];s=journeyReducer(s,{type:'select',slot});assert(s.stage==='approval','approval gate');s=journeyReducer(s,{type:'finish'});assert(s.records.length===0,'no booking before approval');s=journeyReducer(s,{type:'back'});assert(s.stage==='slots'&&!s.approved,'back');s=journeyReducer(s,{type:'select',slot});s=journeyReducer(s,{type:'approve'});assert(s.stage==='execution'&&s.records.length===0,'approval starts execution only');s=journeyReducer(s,{type:'finish'});assert(s.records.length===1&&s.appointment?.status==='confirmed','company state changed');s=journeyReducer(s,{type:'finish'});assert(s.records.length===1,'idempotent completion');s=journeyReducer(s,{type:'company'});assert(s.stage==='company','company view');s=journeyReducer(s,{type:'reset',target:'home'});assert(s.stage==='home'&&!s.context&&!s.approved&&!s.selected&&s.records.length===1,'home clears journey, retains company record');
console.log('PASS: 5 bilingual parsing cases, dates, preferences, fallback, approval, execution, company state, reset.');


// Focused refinement checks: clean session, canonical booking and alternatives.
const sessionNow=new Date(2026,9,1,23,59);
let session=initialJourney();
assert(Number(session.records.length)===0&&session.appointment===null,'fresh session is empty');
const requested=parseRequest('احجز استشارة بكرة في المساء',sessionNow);
assert(requested.date==='2026-10-02'&&requested.weekday===5,'tomorrow resolves to actual Friday');
const alternative=availability(requested);
assert(!alternative.exact,'Friday needs an alternative');
assert(alternative.slots[0].date==='2026-10-04','nearest Sunday alternative');
const snapshot=JSON.stringify(alternative);
assert(JSON.stringify(availability(requested))===snapshot,'availability anchored to request date, not current clock');
function completeRequest(request:string) {
 session=journeyReducer(session,{type:'reset',target:'request'});
 const context=parseRequest(request,sessionNow);
 session=journeyReducer(session,{type:'understand',context});
 session=journeyReducer(session,{type:'ready'});
 const canonicalSlot=availability(context).slots[0];
 session=journeyReducer(session,{type:'select',slot:{...canonicalSlot,hour:23}});
 assert(session.selected?.hour===canonicalSlot.hour,'selection resolves canonical slot, not arbitrary supplied values');
 const before=session.records.length;
 session=journeyReducer(session,{type:'finish'});
 assert(Number(session.records.length)===before,'approval still required');
 session=journeyReducer(session,{type:'approve'});
 session=journeyReducer(session,{type:'finish'});
 assert(Number(session.records.length)===before+1,'one record per execution');
 assert(session.appointment===session.records.at(-1),'details and calendar reference exact same object');
 assert(session.appointment?.context.original===request,'original request retained');
 assert(JSON.stringify(session.appointment?.slot)===JSON.stringify(canonicalSlot),'approved final slot retained');
 assert(session.appointment?.durationMinutes===45&&session.appointment.confirmation==='local'&&session.appointment.status==='confirmed','canonical duration and confirmation');
 return session.appointment!;
}
const first=completeRequest(requested.original);
assert(Number(session.records.length)===1&&first.alternative,'exactly one booking; alternative explicit');
const second=completeRequest('Book Wednesday morning for content strategy');
assert(Number(session.records.length)===2&&!second.alternative,'second booking accumulates with exact preference');
assert(second.context.date===second.slot.date&&second.slot.hour<12,'requested and booked preferences agree');
assert(session.records[0]===first&&session.records[1]===second,'no old record replaced or fabricated');
const immutable=JSON.stringify(session);
for(const locale of ['ar-SA','en-US']) {
 for(const record of session.records) {
 const d=new Date(`${record.slot.date}T12:00:00`);
 const label=new Intl.DateTimeFormat(locale,{weekday:'long',day:'numeric',month:'long',calendar:'gregory'}).format(d);
 assert(label.includes(new Intl.DateTimeFormat(locale,{weekday:'long'}).format(d)),'weekday and date formatting share one date');
 }
}
assert(JSON.stringify(session)===immutable,'bilingual formatting does not mutate bookings');
const third=completeRequest('Book a consultation next week afternoon');
assert(Number(session.records.length)===3&&third.id!==second.id,'third booking accumulates with unique ID');
session=journeyReducer(session,{type:'reset',target:'home'});
assert(Number(session.records.length)===3&&!session.appointment&&!session.selected,'approved Home semantics: retain current session records, reset journey');
session=journeyReducer(session,{type:'finish'});
assert(Number(session.records.length)===3,'Home cannot create or duplicate appointments');
assert(initialJourney().records.length===0,'new page session has no historical bookings');
assert(parseRequest('Book tomorrow',new Date(2026,11,31,23,59)).date==='2027-01-01','year boundary relative date');
console.log('PASS: fresh 0 → first 1 → second 2 → third 3, canonical identity, alternative, clock snapshot, Home, bilingual dates.');

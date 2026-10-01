import type { Context, Slot, Journey, Appointment } from '../types';
const days = [/sunday|الاحد/, /monday|الاثنين/, /tuesday|الثلاثاء/, /wednesday|الاربعاء/, /thursday|الخميس/, /friday|الجمعه/, /saturday|السبت/];
export function dateKey(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
export function localDate(key: string): Date { const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d,12); }
function add(date: Date, amount: number): Date { const result = new Date(date); result.setDate(result.getDate()+amount); return result; }
export function parseRequest(original: string, now = new Date()): Context {
 const text = original.toLowerCase().normalize('NFKD').replace(/[\u064B-\u065F\u0670]/g,'').replace(/[أإآ]/g,'ا').replace(/ة/g,'ه');
 const weekday = days.findIndex(day => day.test(text));
 const nextWeek = /next week|الاسبوع (الجاي|القادم|المقبل)|اسبوع جاي/.test(text);
 const tomorrow = /tomorrow|بكره|غدا/.test(text);
 let date: string | null = null;
 let dateKind: Context['dateKind'] = 'flexible';
 if (nextWeek) { const monday = add(now, ((8-now.getDay())%7)||7); date = dateKey(weekday >= 0 ? add(monday,(weekday+6)%7) : monday); dateKind = 'nextWeek'; }
 else if (tomorrow) { date = dateKey(add(now,1)); dateKind = 'tomorrow'; }
 else if (weekday >= 0) { date = dateKey(add(now,((weekday-now.getDay()+7)%7)||7)); dateKind = 'weekday'; }
 const topic = /product|launch|منتج|اطلاق/.test(text) ? 'launch' : /content|محتوى|المحتوى/.test(text) ? 'content' : /campaign|حمله|حملات/.test(text) ? 'campaign' : /strategy|استراتيجي/.test(text) ? 'strategy' : 'general';
 const period = /afternoon|بعد الظهر/.test(text) ? 'afternoon' : /morning|صباح/.test(text) ? 'morning' : /evening|مساء/.test(text) ? 'evening' : 'any';
 const intent = /book|appointment|consult|schedule|meeting|احجز|حجز|موعد|استشار|اجتماع/.test(text) ? 'booking' : 'unknown';
 return { original, intent, topic, period, date, dateKind, weekday: date && dateKind==='tomorrow' ? localDate(date).getDay() : weekday < 0 ? null : weekday, referenceDate: dateKey(now) };
}
function matchesPeriod(context: Context, slot: Slot): boolean {
 return context.period === 'any' || (context.period === 'morning' ? slot.hour<12 : context.period==='afternoon' ? slot.hour>=12&&slot.hour<18 : slot.hour>=18);
}
function matchesDate(context: Context, slot: Slot): boolean {
 return !context.date || (context.dateKind==='nextWeek'&&context.weekday===null ? slot.date>=context.date && slot.date<dateKey(add(localDate(context.date),7)) : slot.date===context.date);
}
export function matchesPreferences(context: Context, slot: Slot): boolean { return matchesDate(context,slot)&&matchesPeriod(context,slot); }
export function availability(context: Context, now = localDate(context.referenceDate)): { slots: Slot[]; exact: boolean } {
 const dataset: Slot[] = [];
 for(let i=1;i<=21;i++) { const day = add(now,i); if ([5,6].includes(day.getDay())) continue; const date = dateKey(day); for (const [hour,minute] of [[9,0],[10,30],[14,0],[16,0],[18,0],[19,0]]) dataset.push({id:`${date}-${hour}-${minute}`,date,hour,minute}); }
 const exact = dataset.filter(s=>matchesPreferences(context,s));
 const score = (s: Slot) => (matchesDate(context,s)?0:100) + (matchesPeriod(context,s)?0:30) + (context.date ? Math.abs((localDate(s.date).getTime()-localDate(context.date).getTime())/86400000) : 0);
 return { slots: (exact.length ? exact : [...dataset].sort((a,b)=>score(a)-score(b))).slice(0,3), exact: exact.length>0 };
}
export const initialJourney = (): Journey => ({stage:'home',context:null,selected:null,approved:false,appointment:null,records:[]});
export type Action = {type:'start'} | {type:'reset'; target:'home'|'request'} | {type:'understand'; context:Context} | {type:'ready'} | {type:'select';slot:Slot} | {type:'back'} | {type:'approve'} | {type:'finish'} | {type:'company'};
export function journeyReducer(state: Journey, action: Action): Journey {
 switch(action.type) {
 case 'start': return {...state,stage:'request'};
 case 'reset': return {...initialJourney(),records:state.records,stage:action.target};
 case 'understand': return state.stage==='request'&&action.context.intent==='booking' ? {...state,context:action.context,stage:'understanding',selected:null,approved:false} : state;
 case 'ready': return state.stage==='understanding'?{...state,stage:'slots'}:state;
 case 'select': { if(state.stage!=='slots'||!state.context)return state; const slot=availability(state.context).slots.find(s=>s.id===action.slot.id); return slot?{...state,selected:slot,stage:'approval'}:state; }
 case 'back': return state.stage==='approval'?{...state,stage:'slots',approved:false}:state;
 case 'approve': return state.stage==='approval'&&state.selected&&state.context?{...state,approved:true,stage:'execution'}:state;
 case 'finish': { if(state.stage!=='execution'||!state.approved||!state.context||!state.selected)return state; const appointment:Appointment={id:`booking-${state.records.length+1}`,context:{...state.context},slot:{...state.selected},status:'confirmed',confirmation:'local',durationMinutes:45,alternative:!matchesPreferences(state.context,state.selected)}; return {...state,appointment,records:[...state.records,appointment],stage:'complete'}; }
 case 'company': return state.stage==='complete'?{...state,stage:'company'}:state;
 }
}

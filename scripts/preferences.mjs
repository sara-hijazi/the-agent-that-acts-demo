import { readFileSync } from 'node:fs';
function assert(value,message){if(!value)throw new Error(message);}
const app=readFileSync(new URL('../src/App.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
assert(app.includes("preference('agent-language','ar'"),'Arabic default');
assert(app.includes("localStorage.setItem('agent-language',language)")&&app.includes("localStorage.setItem('agent-theme',theme)"),'persist language and theme');
assert(app.includes("document.documentElement.dir=language==='ar'?'rtl':'ltr'"),'direction switch');
assert(css.includes('html[data-theme=light]')&&css.includes('prefers-reduced-motion'),'themes and motion');
console.log('PASS: Arabic default, direction, language/theme persistence and reduced-motion source checks.');
assert(!app.includes('sessionStorage'),'no appointment sessionStorage');
const stored=[...app.matchAll(/localStorage\.(?:getItem|setItem)\(([^)]*)\)/g)].map(match=>match[1]);
assert(stored.every(value=>value==='key'||value.startsWith("'agent-language'")||value.startsWith("'agent-theme'")),'only theme/language persisted');
assert(!app.includes('answer-card')&&!app.includes('t.proof')&&!app.includes('t.approvalDescription')&&!app.includes('t.completeDetail'),'removed hero/copy');
assert(css.includes('.hero-copy .primary svg{color:#fff}'),'hero CTA arrow white');
assert(app.includes('data-booking-id={record.id}')&&app.includes('data-booking-id={state.appointment.id}'),'calendar and details identify canonical booking');
assert(app.includes('state.appointment.alternative&&')&&app.includes('t.booked')&&app.includes('t.context'),'requested versus booked alternative distinction');
assert(!/setLanguage[^\n]*dispatch\(/.test(app)&&! /setTheme[^\n]*dispatch\(/.test(app),'preferences do not dispatch booking changes');
console.log('PASS: no appointment storage, refinements, canonical view bindings, alternative disclosure.');

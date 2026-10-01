type Name = 'agent'|'home'|'sun'|'moon'|'arrow'|'check'|'calendar'|'shield'|'sparkle';
export function Icon({name, size=22}:{name:Name;size?:number}) {
 const paths:Record<Name, React.ReactNode> = {
 agent:<><path d="m5 18 3-12 11 4-6 3-3 7-2-7Z"/><path d="m17 2 .6 2.4L20 5l-2.4.6L17 8l-.6-2.4L14 5l2.4-.6Z"/></>,
 home:<><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/></>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
 moon:<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>,
 arrow:<path d="M4 12h16m-6-6 6 6-6 6"/>, check:<path d="m5 12 4 4L19 6"/>,
 calendar:<><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 4h3m3 0h2"/></>,
 shield:<><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/></>,
 sparkle:<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5Z"/>
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

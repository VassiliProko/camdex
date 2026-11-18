// WCAG contrast check for the colour pairs used in the UI.
const lum = (h) => { const v=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.03928?c/12.92:((c+0.055)/1.055)**2.4); return 0.2126*v[0]+0.7152*v[1]+0.0722*v[2]; };
const cr = (a,b)=>{const [x,y]=[lum(a),lum(b)].sort((p,q)=>q-p);return (x+0.05)/(y+0.05)};
const pairs = [
 ['body text on page','#14213d','#f3f7ff'],['muted on page','#4f5f86','#f3f7ff'],['muted on white','#4f5f86','#ffffff'],
 ['primary btn','#ffffff','#1d5fd1'],['link/blue-d on white','#123f94','#ffffff'],['chip','#123f94','#e8f2ff'],
 ['fit hi','#07583a','#d6f5e6'],['fit mid','#123f94','#e0ecff'],['fit lo','#3b2fa6','#ece9ff'],
 ['toast','#ffffff','#14213d'],['toast link','#9fc3ff','#14213d'],['tooltip em','#bcd2ff','#14213d'],['heart on','#ffffff','#d6336c'],
 ['win cell','#07583a','#e9f8f0'],['opt-sub on white','#3d4b70','#ffffff'],['ribbon','#ffffff','#14213d'],
];
const Q=[['#1D5FD1','#5DAEFF','#E8F2FF'],['#4338CA','#9A92FF','#EEEDFF'],['#7B3FD1','#BE9BFF','#F4ECFF'],['#0B7A75','#4FD8CB','#E1F8F6'],['#0A6C8C','#58CDF0','#E1F6FD'],['#0E7753','#5BDBAA','#E2F8EF']];
Q.forEach(([d,b,t],i)=>{pairs.push([`Q${i+1} deep on tint`,d,t],[`Q${i+1} strip label ink on bright`,'#0f1c38',b],[`Q${i+1} selected option ink on bright`,'#14213d',b],[`Q${i+1} Continue white on deep`,'#ffffff',d],[`Q${i+1} muted hint on tint`,'#4f5f86',t])});
let fail=0;for(const [n,f,b] of pairs){const r=cr(f,b);const ok=r>=4.5;if(!ok)fail++;console.log((ok?'PASS':'FAIL'),r.toFixed(2),n)}
console.log(fail?`${fail} failing`:'all pass');

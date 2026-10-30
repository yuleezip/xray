// Illustrative skeletal anatomy, not a medical scan. Each shape follows pose landmarks.
const interp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
const average=(a,b)=>interp(a,b,.5);
export function drawAnatomy(ctx,landmarks,W,H,mirror=false,opacity=.9){
  if(!landmarks?.length)return;
  const p=(i)=>{const v=landmarks[i];if(!v || (v.visibility??1)<.35)return null;return {x:(mirror?1-v.x:v.x)*W,y:v.y*H}};
  const a={head:p(0),ls:p(11),rs:p(12),le:p(13),re:p(14),lw:p(15),rw:p(16),lh:p(23),rh:p(24),lk:p(25),rk:p(26),la:p(27),ra:p(28)};
  ctx.save();ctx.globalAlpha=opacity;ctx.lineCap='round';ctx.lineJoin='round';ctx.shadowColor='#75e7ff';ctx.shadowBlur=13;
  const ink='#c7faff',inner='#77d3ed';
  function bone(A,B,thick=10){if(!A||!B)return; ctx.strokeStyle=ink;ctx.lineWidth=thick;ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();ctx.strokeStyle='#426c86';ctx.lineWidth=Math.max(1,thick*.28);ctx.beginPath();ctx.moveTo(A.x,A.y);ctx.lineTo(B.x,B.y);ctx.stroke();}
  function joint(A,r=7){if(!A)return;ctx.fillStyle=ink;ctx.beginPath();ctx.arc(A.x,A.y,r,0,Math.PI*2);ctx.fill();}
  const shoulder=a.ls&&a.rs?average(a.ls,a.rs):null,hip=a.lh&&a.rh?average(a.lh,a.rh):null;
  const scale=shoulder&&a.ls?Math.max(5,Math.hypot(a.ls.x-a.rs.x,a.ls.y-a.rs.y)):40;
  // Spine: several vertebral bodies (stylized)
  if(shoulder&&hip){const neck=interp(shoulder,hip,-.13);bone(neck,hip,Math.max(5,scale*.095));for(let i=0;i<14;i++){const q=interp(neck,hip,i/14);ctx.fillStyle=ink;ctx.beginPath();ctx.ellipse(q.x,q.y,Math.max(3,scale*.048),Math.max(2,scale*.033),0,0,Math.PI*2);ctx.fill();}}
  // Rib cage: curved ribs spaced along torso. Left/right flip naturally with pose.
  if(a.ls&&a.rs&&a.lh&&a.rh){
    for(let i=0;i<8;i++){
      const t=.12+i*.077;
      const left=interp(a.ls,a.lh,t),right=interp(a.rs,a.rh,t),mid=average(left,right);
      const bow=Math.sin((i+1)/9*Math.PI)*scale*.13;
      for(const end of [left,right]){
        ctx.beginPath();ctx.moveTo(mid.x,mid.y);ctx.quadraticCurveTo((mid.x+end.x)/2,mid.y+bow,end.x,end.y);
        ctx.strokeStyle=ink;ctx.lineWidth=Math.max(2,scale*.022);ctx.stroke();
      }
    }
    // Clavicles
    const collar=interp(shoulder,hip,-.04);bone(collar,a.ls,Math.max(3,scale*.04));bone(collar,a.rs,Math.max(3,scale*.04));
    // Pelvis (bowl-like rim)
    ctx.beginPath();ctx.moveTo(a.lh.x,a.lh.y);ctx.quadraticCurveTo(hip.x,hip.y+scale*.38,a.rh.x,a.rh.y);ctx.strokeStyle=ink;ctx.lineWidth=Math.max(4,scale*.065);ctx.stroke();
  }
  // Skull: approximate ellipse anchored to nose and shoulder orientation.
  if(a.head&&shoulder){const neckLen=Math.max(scale*.35,Math.hypot(a.head.x-shoulder.x,a.head.y-shoulder.y));const r=Math.max(scale*.2,Math.min(scale*.42,neckLen*.52));const center={x:a.head.x,y:a.head.y-r*.3};ctx.beginPath();ctx.ellipse(center.x,center.y,r*.73,r,0,0,Math.PI*2);ctx.fillStyle='rgba(205,246,255,.20)';ctx.fill();ctx.strokeStyle=ink;ctx.lineWidth=Math.max(3,r*.09);ctx.stroke();ctx.beginPath();ctx.moveTo(center.x-r*.4,center.y+r*.48);ctx.quadraticCurveTo(center.x,center.y+r*.78,center.x+r*.4,center.y+r*.48);ctx.stroke();}
  // Upper/lower arm and leg bones
  for(const [u,v,t] of [[a.ls,a.le,.09],[a.rs,a.re,.09],[a.le,a.lw,.075],[a.re,a.rw,.075],[a.lh,a.lk,.14],[a.rh,a.rk,.14],[a.lk,a.la,.11],[a.rk,a.ra,.11]]){
    const thick=Math.max(5,scale*t);bone(u,v,thick);joint(v,thick*.56);
  }
  ctx.shadowBlur=0;ctx.restore();
}

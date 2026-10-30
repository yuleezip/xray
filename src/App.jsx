import React,{useEffect,useRef,useState} from 'react';
import {FilesetResolver,PoseLandmarker} from '@mediapipe/tasks-vision';
import {drawAnatomy} from './skeleton';
const MODEL='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
const WASM='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm';
export default function App(){
 const video=useRef(null),canvas=useRef(null),landmarker=useRef(null),stream=useRef(null),raf=useRef(0),running=useRef(false),lastInference=useRef(0),lastPose=useRef(null);
 const [status,setStatus]=useState('按下啟動相機'),[active,setActive]=useState(false),[facing,setFacing]=useState('environment'),[opacity,setOpacity]=useState(.9),[cameraOpacity,setCameraOpacity]=useState(.44),[mode,setMode]=useState('xray');
 const opt=useRef({opacity,cameraOpacity,mode,facing});useEffect(()=>{opt.current={opacity,cameraOpacity,mode,facing}},[opacity,cameraOpacity,mode,facing]);
 function stop(){running.current=false;cancelAnimationFrame(raf.current);stream.current?.getTracks().forEach(x=>x.stop());stream.current=null;if(video.current){video.current.pause();video.current.srcObject=null;}setActive(false)}
 useEffect(()=>()=>{stop();landmarker.current?.close()},[]);
 async function loadModel(){if(landmarker.current)return landmarker.current;setStatus('載入人體追蹤模型…（首次需要網路）');const files=await FilesetResolver.forVisionTasks(WASM);try{landmarker.current=await PoseLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:MODEL,delegate:'GPU'},runningMode:'VIDEO',numPoses:1,minPoseDetectionConfidence:.5,minTrackingConfidence:.5});}catch{landmarker.current=await PoseLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:MODEL,delegate:'CPU'},runningMode:'VIDEO',numPoses:1});}return landmarker.current;}
 async function start(selected=facing){stop();try{if(!navigator.mediaDevices?.getUserMedia)throw new Error('需要 HTTPS 或 localhost 才能使用相機');await loadModel();setStatus('要求相機權限…');const s=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:selected},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}}});stream.current=s;const v=video.current;v.srcObject=s;await v.play();running.current=true;setFacing(selected);setActive(true);setStatus('正在搜尋人體…');lastInference.current=0;loop()}catch(e){stop();setStatus(`無法啟動：${e.message}`)}}
 function loop(){if(!running.current)return;const v=video.current,c=canvas.current;if(!v||!c)return;const ctx=c.getContext('2d');if(v.readyState>=2&&v.videoWidth){
  const dpr=Math.min(window.devicePixelRatio||1,2),W=Math.round(c.clientWidth*dpr),H=Math.round(c.clientHeight*dpr);if(c.width!==W||c.height!==H){c.width=W;c.height=H;}
  const aspect=Math.max(W/v.videoWidth,H/v.videoHeight),dw=v.videoWidth*aspect,dh=v.videoHeight*aspect,dx=(W-dw)/2,dy=(H-dh)/2;
  const {facing,opacity,cameraOpacity,mode}=opt.current,flip=facing==='user';
  ctx.clearRect(0,0,W,H);ctx.fillStyle='#020811';ctx.fillRect(0,0,W,H);ctx.save();ctx.globalAlpha=mode==='xray'?cameraOpacity:1;ctx.filter=mode==='xray'?'grayscale(1) contrast(1.75) brightness(.7) sepia(.55) hue-rotate(145deg) saturate(3)':'none';if(flip){ctx.translate(W,0);ctx.scale(-1,1)}ctx.drawImage(v,dx,dy,dw,dh);ctx.restore();
  const now=performance.now();if(now-lastInference.current>100&&v.currentTime!==lastInference.current){try{const r=landmarker.current.detectForVideo(v,now);lastPose.current=r.landmarks?.[0]||null;setStatus(lastPose.current?'BODY DETECTED':'正在搜尋人體…')}catch(e){console.warn(e)}lastInference.current=now;}
  const pts=lastPose.current;if(pts){ // landmark coords must match the video crop (cover)
   const mapped=pts.map(p=>({...p,x:(dx+p.x*dw)/W,y:(dy+p.y*dh)/H}));
   drawAnatomy(ctx,mapped,W,H,flip,opacity);
  }
  if(mode==='xray'){ctx.save();ctx.globalAlpha=.12;ctx.fillStyle='#68d6ff';for(let y=0;y<H;y+=5*dpr)ctx.fillRect(0,y,W,.6*dpr);ctx.restore();}
 }
 raf.current=requestAnimationFrame(loop)}
 function capture(){const c=canvas.current;if(!c)return;c.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`xray-${Date.now()}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000)},'image/png')}
 return <main className="app"><header><div><small>LIVE VISION / EXPERIMENTAL</small><h1>XRAY<span>CAM</span></h1></div><div className={'pill '+(active?'on':'')}>{active?'● LIVE':'○ OFFLINE'}</div></header><section className="viewport"><video ref={video} muted playsInline autoPlay className="hidden"/><canvas ref={canvas}/><div className="reticle"><i/><i/><i/><i/></div><div className="viewportStatus">{status}</div><div className="fakeNotice">SIMULATED ANATOMY · NOT MEDICAL IMAGING</div></section><section className="controls"><div className="actions"><button onClick={()=>active?stop():start()} className="primary">{active?'■ Stop Camera':'◉ Start Camera'}</button><button disabled={!active} onClick={()=>start(facing==='user'?'environment':'user')}>↻ Flip</button><button disabled={!active} onClick={capture}>◎ Capture</button></div><div className="modes"><button className={mode==='xray'?'selected':''} onClick={()=>setMode('xray')}>X-RAY</button><button className={mode==='normal'?'selected':''} onClick={()=>setMode('normal')}>NORMAL + BONES</button></div><label>Bone intensity <b>{Math.round(opacity*100)}%</b><input type="range" min="0" max="1" step="0.05" value={opacity} onChange={e=>setOpacity(+e.target.value)}/></label><label>Background visibility <b>{Math.round(cameraOpacity*100)}%</b><input type="range" min="0" max="1" step="0.05" value={cameraOpacity} onChange={e=>setCameraOpacity(+e.target.value)}/></label><p>請讓完整上半身或全身入鏡、光線充足。拍照會儲存合成後的 PNG。加入主畫面：Safari → 分享 → 加入主畫面。</p></section></main>
}

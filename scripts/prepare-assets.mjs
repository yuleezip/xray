import {cp, mkdir, stat, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dst=path.join(root,'public');
const source=path.join(root,'node_modules','@mediapipe','tasks-vision','wasm');
await mkdir(path.join(dst,'wasm'),{recursive:true});
await cp(source,path.join(dst,'wasm'),{recursive:true,force:true});
console.log('Copied local MediaPipe WASM files.');
const modelPath=path.join(dst,'models','pose_landmarker_lite.task');
await mkdir(path.dirname(modelPath),{recursive:true});
let valid=false;
try{valid=(await stat(modelPath)).size>100000}catch{}
if(!valid){
 const url='https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task';
 let last;
 for(let attempt=1;attempt<=3;attempt++){
   try{const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
     if(!response.ok)throw new Error(`HTTP ${response.status}`);
     const data=Buffer.from(await response.arrayBuffer());
     if(data.length<100000)throw new Error('Model download unexpectedly small');
     await writeFile(modelPath,data);console.log(`Saved pose model (${data.length} bytes)`);last=null;break;
   }catch(e){last=e;console.error(`Model download attempt ${attempt}: ${e.message}`)}
 }
 if(last)throw new Error(`Cannot download model during build: ${last.message}`);
}else console.log('Local pose model already exists.');

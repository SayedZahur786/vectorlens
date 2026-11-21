import {UMAP} from 'umap-js';
import {fixture,rng,Index,validate,topK} from './engine.mjs';
let data,d,n,index,labels;
onmessage=async({data:m})=>{try{if(m.type==='load'){
 const start=performance.now();if(m.rows){({data,d,n,labels}=validate(m.rows));}else{n=m.n;d=m.d||32;data=fixture(n,d);labels=null;}
 postMessage({status:'Building original-space ANN index'});index=new Index(data,d);const indexMs=performance.now()-start;
 postMessage({status:'Optimizing UMAP in worker'});const pstart=performance.now(),full=n<=3000,count=full?n:512,ids=Array.from({length:count},(_,i)=>Math.floor(i*n/count)),rows=ids.map(i=>Array.from(data.subarray(i*d,(i+1)*d)));
 const umap=new UMAP({nComponents:3,nNeighbors:Math.min(15,count-1),nEpochs:150,random:rng(42)});const embedding=umap.fit(rows),positions=new Float32Array(n*3);
 if(full){positions.set(embedding.flat());}else{const landmarks=new Index(Float32Array.from(rows.flat()),d,4);for(let i=0;i<n;i++){const q=data.subarray(i*d,(i+1)*d),near=landmarks.search(q,4,16).neighbors;let total=0;for(const a of near){const w=1/(a.distance+.00001);total+=w;for(let j=0;j<3;j++)positions[i*3+j]+=embedding[a.id][j]*w;}for(let j=0;j<3;j++)positions[i*3+j]/=total;}}
 let max=0;const mean=[0,0,0];for(let i=0;i<n;i++)for(let j=0;j<3;j++)mean[j]+=positions[i*3+j]/n;for(let i=0;i<n;i++)for(let j=0;j<3;j++){positions[i*3+j]-=mean[j];max=Math.max(max,Math.abs(positions[i*3+j]));}for(let i=0;i<positions.length;i++)positions[i]/=max||1;
 postMessage({id:m.id,positions,n,d,indexMs,projectionMs:performance.now()-pstart,mode:full?'full UMAP':'landmark UMAP (512 landmarks; inverse-distance interpolation)',labels},[positions.buffer]);
 }else if(m.type==='query'){const start=performance.now(),q=m.vector??Array.from(data.subarray(m.point*d,(m.point+1)*d)),result=index.search(q,m.k||20,m.window||1024);let recall=null;if(m.exact){const exact=topK(data,d,q,Uint32Array.from({length:n},(_,i)=>i),m.k||20),set=new Set(exact.map(x=>x.id));recall=result.neighbors.filter(x=>set.has(x.id)).length/exact.length;}postMessage({id:m.id,...result,searchMs:performance.now()-start,recall,vector:q});}
 }catch(e){postMessage({id:m.id,error:e.message});}};

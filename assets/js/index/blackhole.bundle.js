var Lc=Object.defineProperty;var Dc=(e,t)=>{for(var n in t)Lc(e,n,{get:t[n],enumerable:!0})};var wi={};Dc(wi,{Geometry:()=>Et,Uniform:()=>tn,VGPUError:()=>h,bundle:()=>Ma,clock:()=>Ba,compute:()=>Oa,draw:()=>wa,effect:()=>La,frame:()=>Va,frameLoop:()=>Na,geometry:()=>Ko,init:()=>gp,initFromDevice:()=>zo,isShaderFunctionExport:()=>Xn,pingPong:()=>Ya,pingPongStorage:()=>Xa,sampler:()=>sa,storage:()=>ja,surface:()=>Ys,target:()=>qa,timer:()=>ec,uniforms:()=>nc,visibility:()=>cc});var Ge=class extends Error{code;severity;fix;where;cause;detail;constructor(t){super(t.message,{cause:t.cause}),this.name="VGPUError",this.code=t.code,this.severity=t.severity??"error",this.fix=t.fix,this.where=t.where,this.cause=t.cause,this.detail=t.detail}},F=class extends Ge{constructor(t){super({...t,severity:"error"}),this.name="ValidationError"}};function Gi(e){return new Ge({code:"VGPU-FEATURE-UNSUPPORTED",message:`Adapter does not support requested feature(s): ${e.map(t=>`"${t}"`).join(", ")}.`,fix:"Remove the unsupported name(s) from init({ requiredFeatures: [...] }) or run on an adapter that supports them; gate optional code paths on device.features after init.",where:"init"})}function zn(e,t){if(!e)return;let n=(t??[]).filter(r=>!e.has(r));if(n.length)throw Gi(n)}var $c={map_read:1,map_write:2,copy_src:4,copy_dst:8,index:16,vertex:32,uniform:64,storage:128,indirect:256,query_resolve:512};function le(e){let t=globalThis.GPUBufferUsage;return e.reduce((n,r)=>n|Gc(r,t),0)}function Gc(e,t){let n=e.toUpperCase();return t?.[n]??$c[e]}function Wn(){return globalThis.GPUMapMode?.READ??1}var Mc={copy_src:1,copy_dst:2,texture_binding:4,storage_binding:8,render_attachment:16};function Mi(e){let t=globalThis.GPUTextureUsage;return e.reduce((n,r)=>n|Uc(r,t),0)}function Uc(e,t){let n=e.toUpperCase();return t?.[n]??Mc[e]}function Vt(e){return"__vgpuMockBytes"in e}function qn(e){return"__vgpuMockBytes"in e}var Bc=1;function ue(e){return Object.freeze({kind:e,id:Bc++})}var Y=class{callbacks=new Set;destroyed=!1;onDestroy(t,n){return this.destroyed?(n(t),()=>{}):(this.callbacks.add(n),()=>{this.callbacks.delete(n)})}emit(t){if(this.destroyed)return!1;this.destroyed=!0;let n=[...this.callbacks];this.callbacks.clear();for(let r of n)r(t);return!0}};var U=class{device;gpu;options;ownership;destroySignal=new Y;identity=ue("buffer");destroyed=!1;constructor(t,n,r,i="owned"){this.device=t,this.gpu=n,this.options=r,this.ownership=i,Object.defineProperty(this,"assertUsable",{value:o=>this.#e(o)})}get resourceIdentity(){return this.identity}onDestroy(t){return this.destroySignal.onDestroy(this,t)}#e(t="Buffer"){if(this.destroyed)throw new F({code:"VGPU-BUFFER-DISPOSED",message:"Buffer is destroyed.",where:t,fix:"Wrap or create a live GPUBuffer before using it."});this.device.assertUsable(t)}write(t,n=0){this.#e("Buffer.write"),this.ownership==="external"&&this.validateExternalOperation("write",n,t.byteLength,"copy_dst");try{this.device.queue.writeBuffer(this.gpu,n,t)}catch(r){throw this.ownership!=="external"?r:Nt("Buffer.write","The external GPUBuffer rejected the write operation.",r)}}async read(t,n=0){this.#e("Buffer.read"),this.ownership==="external"&&this.validateExternalOperation("read",n,t,"copy_src");try{let r=await this.device.readback.read(this.gpu,t,n);return this.#e("Buffer.read"),r}catch(r){throw r instanceof F||this.ownership!=="external"?r:Nt("Buffer.read","The external GPUBuffer rejected the read operation.",r)}}destroy(){this.destroyed||(this.destroyed=!0,this.destroySignal.emit(this),this.ownership==="owned"&&!Vt(this.gpu)&&this.gpu.destroy())}dispose(){this.destroy()}validateExternalOperation(t,n,r,i){if(!(Number.isSafeInteger(n)&&n>=0&&n%4===0&&Number.isSafeInteger(r)&&r>=0&&r%4===0&&n<=this.options.size&&r<=this.options.size-n))throw Nt(`Buffer.${t}`,"External buffer offsets and lengths must be non-negative, 4-byte aligned, and within the buffer size.");if((this.gpu.usage&le([i]))===0)throw Nt(`Buffer.${t}`,`External buffer is missing ${i.toUpperCase()} usage.`)}};function Nt(e,t,n){return new F({code:"VGPU-EXTERNAL-BUFFER-VALIDATION",message:t,where:e,cause:n,fix:"Use a buffer with the required usage flags and an aligned in-range operation."})}function jn(e){if(Nc(e))throw zc();let t={version:1,mappings:[]},n={version:1,modules:[{path:"<runtime>",text:e}],diagnostics:[],sourceMap:t,cacheKey:Oc(e)};return{kind:"wgsl",wgsl:e,source:{text:e,path:"<runtime>",imports:[]},ast:n,sourceMap:t,diagnostics:[],cacheKey:n.cacheKey,entryPoints:Vc(e),stats:{lines:e.split(/\r?\n/).length,bytes:new TextEncoder().encode(e).byteLength,bindGroups:0}}}function Oc(e){let t=2166136261;for(let n=0;n<e.length;n++)t=Math.imul(t^e.charCodeAt(n),16777619);return{default:`vgpu-wgsl-1:${(t>>>0).toString(16).padStart(8,"0")}`}}function Vc(e){let t=[],n=/@(vertex|fragment|compute)\s+fn\s+([A-Za-z_][A-Za-z0-9_]*)/g;for(let r of e.matchAll(n))t.push(r[2]);return t}function Nc(e){let t=e.replace(/\/\*[\s\S]*?\*\//g,"").replace(/\/\/.*$/gm,"").trimStart();return t.startsWith("import ")||t.startsWith("import{")}function zc(){let e=new Error("Runtime WGSL strings cannot contain import statements. Use a build-time loader or @vgpu/wgsl/runtime.");return e.name="VGPUWGSLRuntimeImportError",e.code="VGPU-WGSL-RUNTIME-IMPORT",e.severity="error",e.source="wgsl",e}var Ui=new Set(["alias","break","case","const","const_assert","continue","continuing","default","diagnostic","discard","else","enable","false","fn","for","if","let","loop","override","requires","return","struct","switch","true","var","while"]),Bi=new Set(["import","export","from","as"]),mt=new Set([...Ui,...Bi]),Hn=new Set(["NULL","Self","abstract","active","alignas","alignof","as","asm","asm_fragment","async","attribute","auto","await","become","cast","catch","class","co_await","co_return","co_yield","coherent","column_major","common","compile","compile_fragment","concept","const_cast","consteval","constexpr","constinit","crate","debugger","decltype","delete","demote","demote_to_helper","do","dynamic_cast","enum","explicit","export","extends","extern","external","fallthrough","filter","final","finally","friend","from","fxgroup","get","goto","groupshared","highp","impl","implements","import","inline","instanceof","interface","layout","lowp","macro","macro_rules","match","mediump","meta","mod","module","move","mut","mutable","namespace","new","nil","noexcept","noinline","nointerpolation","non_coherent","noncoherent","noperspective","null","nullptr","of","operator","package","packoffset","partition","pass","patch","pixelfragment","precise","precision","premerge","priv","protected","pub","public","readonly","ref","regardless","register","reinterpret_cast","require","resource","restrict","self","set","shared","sizeof","smooth","snorm","static","static_assert","static_cast","std","subroutine","super","target","template","this","thread_local","throw","trait","try","type","typedef","typeid","typename","typeof","union","unless","unorm","unsafe","unsized","use","using","varying","virtual","volatile","wgsl","where","with","writeonly","yield"]),Kn=new Set(["binding_array"]);function Oi(e){return/^[A-Za-z_][A-Za-z0-9_]*$/u.test(e)&&e!=="_"&&!e.startsWith("__")&&!mt.has(e)&&!Hn.has(e)&&!Kn.has(e)}function Xn(e){if(typeof e!="object"||e===null)return!1;try{let{name:t,resolvedName:n,parameterNames:r}=e;return Yn(t)&&Yn(n)&&Wc(r)}catch{return!1}}function Yn(e){return typeof e=="string"&&Oi(e)}function Wc(e){if(!Array.isArray(e))return!1;let t=new Set;for(let n=0;n<e.length;n++){let r=e[n];if(!Yn(r)||t.has(r))return!1;t.add(r)}return!0}var Vi=le(["copy_dst","map_read"]),zt=class{device;constructor(t){this.device=t}async read(t,n,r){if(Vt(t))return t.__vgpuMockBytes.slice(r,r+n).buffer;let i=this.device.createBuffer({size:n,usage:Vi});try{let o=this.device.createCommandEncoder();o.copyBufferToBuffer(t,r,i,0,n),this.device.queue.submit([o.finish()]),await i.mapAsync(Wn());let s=i.getMappedRange().slice(0);return Ni(i),s}finally{zi(i)}}async readTexture(t,n,r){let[i,o]=n,s=ht(r,"Readback.readTexture"),a=s.bytesPerPixel,c=qc(i*a,256),l=c*o,u=this.device.createBuffer({size:l,usage:Vi}),d;try{let f=this.device.createCommandEncoder();f.copyTextureToBuffer({texture:t},{buffer:u,bytesPerRow:c,rowsPerImage:o},{width:i,height:o}),this.device.queue.submit([f.finish()]),await u.mapAsync(Wn());let m=new Uint8Array(u.getMappedRange());d=new Uint8Array(i*o*a);for(let x=0;x<o;x++){let g=x*c,E=x*i*a;d.set(m.subarray(g,g+i*a),E)}Ni(u)}finally{zi(u)}return s.swizzle==="bgra-to-rgba"&&Hi(d),d}destroy(){}};function Ni(e){try{e.unmap()}catch{}}function zi(e){try{e.destroy()}catch{}}function qc(e,t){return Math.ceil(e/t)*t}var Wi={r8unorm:{bytesPerPixel:1,components:1,componentType:"unorm8"},rg8unorm:{bytesPerPixel:2,components:2,componentType:"unorm8"},rgba8unorm:{bytesPerPixel:4,components:4,componentType:"unorm8"},"rgba8unorm-srgb":{bytesPerPixel:4,components:4,componentType:"unorm8"},bgra8unorm:{bytesPerPixel:4,components:4,componentType:"unorm8",swizzle:"bgra-to-rgba"},"bgra8unorm-srgb":{bytesPerPixel:4,components:4,componentType:"unorm8",swizzle:"bgra-to-rgba"},r16float:{bytesPerPixel:2,components:1,componentType:"float16"},rg16float:{bytesPerPixel:4,components:2,componentType:"float16"},rgba16float:{bytesPerPixel:8,components:4,componentType:"float16"},r32float:{bytesPerPixel:4,components:1,componentType:"float32"},rg32float:{bytesPerPixel:8,components:2,componentType:"float32"},rgba32float:{bytesPerPixel:16,components:4,componentType:"float32"}};function ht(e,t){let n=Wi[e];if(n)return n;throw new F({code:"VGPU-CORE-UNSUPPORTED-FORMAT",message:`Texture.read does not support format ${e}. Supported formats: ${Object.keys(Wi).join(", ")}.`,where:t})}function qi(e,t,n="Texture.readFloats"){let r=ht(t,n),i=r.bytesPerPixel/r.components,o=Math.floor(e.byteLength/i),s=new Float32Array(o),a=new DataView(e.buffer,e.byteOffset,e.byteLength);for(let c=0;c<o;c++)r.componentType==="unorm8"?s[c]=a.getUint8(c)/255:r.componentType==="float16"?s[c]=jc(a.getUint16(c*2,!0)):s[c]=a.getFloat32(c*4,!0);return s}function jc(e){let t=e&32768?-1:1,n=e>>10&31,r=e&1023;return n===0?t*r*2**-24:n===31?r===0?t*Number.POSITIVE_INFINITY:Number.NaN:t*(r+1024)*2**(n-25)}function ji(e,t,n){let r=e.slice(0,t[0]*t[1]*n.bytesPerPixel);return n.swizzle==="bgra-to-rgba"&&Hi(r),r}function Hi(e){for(let t=0;t<e.length;t+=4){let n=e[t];e[t]=e[t+2],e[t+2]=n}}function Ki(e){return{size:e,usage:le(["copy_src","copy_dst"])}}var Wt=class{gpu;guard;constructor(t,n=()=>{}){this.gpu=t,this.guard=n}writeBuffer(t,n,r){this.guard("Queue.writeBuffer"),this.gpu.writeBuffer(t,n,r)}async flush(){this.guard("Queue.flush"),await this.gpu.onSubmittedWorkDone?.(),this.guard("Queue.flush")}};var qt=class{gpu;resolved;constructor(t,n){this.gpu=t,this.resolved=n}dispose(){}get kind(){return this.resolved.kind}get source(){return this.resolved.source}get code(){return this.resolved.wgsl}get entryPoints(){return this.resolved.entryPoints}get stats(){return this.resolved.stats}};var Hc=Symbol.for("vgpu/Texture"),Kc=Symbol.for("vgpu/Texture/resizeLock"),z=class{device;ownership;[Hc]=!0;destroySignal=new Y;identity=ue("texture");currentGpu;currentOptions;defaultView=null;resizeLock;destroyed=!1;constructor(t,n,r,i="owned"){this.device=t,this.ownership=i,this.currentGpu=n,this.currentOptions=r,Object.defineProperty(this,Kc,{value:o=>{this.resizeLock=o}})}get gpu(){return this.currentGpu}get options(){return this.currentOptions}get size(){return this.options.size}get format(){return this.options.format}get usage(){return this.options.usage}get mipLevelCount(){return this.options.mipLevelCount??1}get sampleCount(){return this.options.sampleCount??1}get dimension(){return this.options.dimension??"2d"}get viewFormats(){return this.options.viewFormats??[]}get label(){return this.options.label}get resourceIdentity(){return this.identity}onDestroy(t){return this.destroySignal.onDestroy(this,t)}get view(){return this.assertAlive(),this.defaultView??=this.createView(),this.defaultView}createView(t){return this.assertAlive("Texture.createView"),this.gpu.createView(t)}resize(t){if(this.assertAlive(),this.ownership==="external")throw new F({code:"VGPU-CORE-EXTERNAL-TEXTURE",message:"Texture wraps an externally owned GPUTexture and cannot be resized.",where:"Texture.resize"});if(this.resizeLock)throw new F({code:"VGPU-CORE-TEXTURE-RESIZE-LOCKED",message:this.resizeLock,where:"Texture.resize"});let n=this.options.size[2]??1,r=t[2]??n;if(this.options.size[0]===t[0]&&this.options.size[1]===t[1]&&n===r)return!1;let i=t[2]===void 0&&this.options.size[2]===void 0?[t[0],t[1]]:[t[0],t[1],r],o={...this.options,size:i},s=this.gpu;return this.currentGpu=this.device.gpu.createTexture(Qn(o)),this.currentOptions=o,this.defaultView=null,s.destroy(),!0}async read(){this.assertAlive("Texture.read");let t=ht(this.options.format,"Texture.read");if(qn(this.gpu))return ji(this.gpu.__vgpuMockBytes,this.options.size,t);let n=await this.device.readback.readTexture(this.gpu,this.options.size,this.options.format);return this.assertAlive("Texture.read"),n}async readFloats(){return ht(this.options.format,"Texture.readFloats"),qi(await this.read(),this.options.format)}destroy(){this.destroyed||(this.destroyed=!0,this.defaultView=null,this.destroySignal.emit(this),this.ownership!=="external"&&(qn(this.gpu)||this.gpu.destroy()))}dispose(){this.destroy()}assertAlive(t="Texture"){if(this.destroyed)throw new F({code:"VGPU-CORE-TEXTURE-DESTROYED",message:"Texture is destroyed",where:t});this.device.assertUsable?.(t)}};function Qn(e){let t={label:e.label,size:{width:e.size[0],height:e.size[1],depthOrArrayLayers:e.size[2]??1},format:e.format,usage:Mi(e.usage)};return e.mipLevelCount!==void 0&&(t.mipLevelCount=e.mipLevelCount),e.sampleCount!==void 0&&(t.sampleCount=e.sampleCount),e.dimension!==void 0&&(t.dimension=e.dimension),e.viewFormats!==void 0&&(t.viewFormats=[...e.viewFormats]),t}var de=class{gpu;adapterInfo;queue;readback;isCompatibilityMode;scopes=[];ownership;state="alive";lossInfo;observeLoss=!0;constructor(t,n=null,r="owned",i={}){this.gpu=t,this.adapterInfo=n,Object.defineProperty(this,"assertUsable",{value:a=>this.#e(a)}),this.ownership=typeof r=="string"?r:"owned";let o=typeof r=="string"?i:r;this.isCompatibilityMode=o.isCompatibilityMode??!1,this.queue=new Wt(t.queue,a=>this.#e(a)),this.readback=new zt(t);let s=t.lost;s&&typeof s.then=="function"&&Promise.resolve(s).then(a=>{!this.observeLoss||this.state!=="alive"||(this.lossInfo=a,this.state="lost")},()=>{})}get limits(){return this.#e("Device.limits"),this.gpu.limits}get features(){return this.#e("Device.features"),this.gpu.features}createShader(t){this.#e("Device.createShader");let n=typeof t=="string"?jn(t):t;return new qt(this.gpu.createShaderModule({code:n.wgsl}),n)}createTexture(t){return this.#e("Device.createTexture"),new z(this,this.gpu.createTexture(Qn(t)),t)}createBuffer(t){this.#e("Device.createBuffer");let n=Yc(t);n&&this.captureError(n);let r=n?Ki(Math.max(4,t.size||4)):Xc(t);return new U(this,this.gpu.createBuffer(r),t)}wrapBuffer(t){if(this.#e("Device.wrapBuffer"),!Zc(t))throw new F({code:"VGPU-EXTERNAL-BUFFER-INVALID",message:"Device.wrapBuffer requires a GPUBuffer with finite size and usage properties.",where:"Device.wrapBuffer",fix:"Pass a live GPUBuffer created for this GPUDevice."});let n={size:t.size,usage:el(t.usage),...t.label?{label:t.label}:{}};return new U(this,t,n,"external")}pushErrorScope(t){this.#e("Device.pushErrorScope"),this.scopes.push([]),this.gpu.pushErrorScope?.(t)}async popErrorScope(){this.#e("Device.popErrorScope");let t=this.scopes.pop(),n=await this.gpu.popErrorScope?.();return this.#e("Device.popErrorScope"),t?.[0]??Qc(n)??null}#e(t){if(this.state==="alive")return;if(this.state==="disposed")throw new F({code:"VGPU-DEVICE-DISPOSED",message:"The GPU device wrapper has been disposed.",where:t,fix:"Create a new Gpu instance before performing more work."});let n=this.lossInfo?.reason,r=this.lossInfo?.message;throw new F({code:"VGPU-DEVICE-LOST",message:`The GPU device was lost${n?` (${n})`:""}${r?`: ${r}`:"."}`,where:t,cause:this.lossInfo})}destroy(){if(this.state==="disposed")return;let t=this.state==="lost";this.state="disposed",this.observeLoss=!1,this.scopes.length=0,this.readback.destroy(),this.ownership==="owned"&&!t&&this.gpu.destroy()}dispose(){this.destroy()}captureError(t){let n=this.scopes.at(-1);if(n)n.push(t);else throw t}};function Yc(e){return!Number.isFinite(e.size)||e.size<=0?Yi("Buffer size must be greater than zero."):e.usage.length===0?Yi("Buffer usage must not be empty."):null}function Yi(e){return new F({code:"VGPU-CORE-INVALID-USAGE",message:e,where:"Device.createBuffer"})}function Xc(e){return{label:e.label,size:e.size,usage:le(e.usage)}}function Qc(e){return e?new F({code:"VGPU-CORE-VALIDATION",message:e.message,where:"GPUDevice.popErrorScope",cause:e}):null}function Zc(e){if(typeof e!="object"&&typeof e!="function"||e===null)return!1;let t=e;return Number.isSafeInteger(t.size)&&(t.size??-1)>=0&&Number.isSafeInteger(t.usage)&&(t.usage??-1)>=0&&typeof t.destroy=="function"}var Jc=["map_read","map_write","copy_src","copy_dst","index","vertex","uniform","storage","indirect","query_resolve"];function el(e){return Jc.filter(t=>(e&le([t]))!==0)}var Xi=new WeakMap,Qi=new WeakMap;function gt(e,t){return Xi.set(e,tl(t)),e}function fe(e){return Xi.get(e)}function Zn(e,t){let n=fe(t);return n&&Qi.set(e,{layout:n}),e}function jt(e){return Qi.get(e)}function tl(e){return{entries:e.entries.map(t=>({...t}))}}function Jn(e,t){let n=Zi(e).createBindGroupLayout({label:t.label,entries:[...t.entries]});return gt(n,{entries:t.entries})}function er(e,t){if(!t.layout)throw new F({code:"VGPU-CORE-BIND-GROUP-LAYOUT-REQUIRED",message:'createBindGroup requires an explicit layout. vgpu does not use layout: "auto" for bind groups.',where:"createBindGroup"});let n=Zi(e).createBindGroup({label:t.label,layout:t.layout,entries:[...t.entries]});return Zn(n,t.layout)}var Ht={uniform:nl,storage:rl,readonlyStorage:il,texture:ol,storageTexture:sl,sampler:al,resource:cl};function nl(e,t,n={}){return{binding:Me(e),visibility:Ke(t),buffer:{...n,type:"uniform"}}}function rl(e,t,n={}){return{binding:Me(e),visibility:Ke(t),buffer:{...n,type:"storage"}}}function il(e,t,n={}){return{binding:Me(e),visibility:Ke(t),buffer:{...n,type:"read-only-storage"}}}function ol(e,t,n={}){return{binding:Me(e),visibility:Ke(t),texture:n}}function sl(e,t,n){return{binding:Me(e),visibility:Ke(t),storageTexture:n}}function al(e,t,n={}){return{binding:Me(e),visibility:Ke(t),sampler:n}}function cl(e,t){return{binding:Me(e),resource:ll(t)}}function Zi(e){return e instanceof de||"gpu"in e?e.gpu:e}function ll(e){return e instanceof U?{buffer:e.gpu}:e instanceof z||fl(e)?e.createView():dl(e)?{buffer:e.gpu}:ul(e)?e:Ji(e)?{buffer:e}:e}function ul(e){return Kt(e)&&"buffer"in e}function Ji(e){return Kt(e)&&"size"in e&&"usage"in e&&typeof e.destroy=="function"}function dl(e){return Kt(e)&&Ji(e.gpu)}function fl(e){return Kt(e)&&typeof e.createView=="function"&&"gpu"in e}function Me(e){if(!Number.isInteger(e)||e<0)throw new F({code:"VGPU-CORE-BINDING-INVALID",message:"Binding entries require an explicit non-negative integer binding number.",where:"bind"});return e}function Ke(e){return typeof e=="number"?e:(typeof e=="string"?e.split(/[|,\s]+/):e).reduce((n,r)=>n|pl(r),0)}function pl(e){let t=e.trim().toLowerCase(),n=globalThis.GPUShaderStage,i={vertex:n?.VERTEX??1,fragment:n?.FRAGMENT??2,compute:n?.COMPUTE??4}[t];if(!i)throw new F({code:"VGPU-CORE-VISIBILITY-INVALID",message:`Unknown shader stage visibility '${e}'.`,where:"bind"});return i}function Kt(e){return typeof e=="object"&&e!==null}var h=class extends Ge{};function eo(e,t,n,r,i,o){let s=t==="vertex"?"Vertex":"Fragment",a=t==="vertex"?"VERTEX":"FRAGMENT",c=`maxStorageBuffersIn${s}Stage`;return new h({code:`VGPU-LIMIT-STORAGE-${a}`,message:`${s} entry '${n}' in '${e}' uses ${r} storage buffer(s), but device limit ${c} is ${i}.`,fix:t==="vertex"?`Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or move vertex data to geometry(gpu, ...) vertex streams.`:`Request init({ requiredLimits: { ${c}: ${r} } }) if the adapter supports it, or reduce fragment storage buffers.`,where:`${e}.pipelineLayout`,detail:{stage:t,entryPoint:n,count:r,limit:i,bindings:o.map(({name:l,group:u,binding:d})=>({name:l,group:u,binding:d}))}})}function to(e,t,n,r,i){return new h({code:"VGPU-SET-TEXTURE-FILTERABILITY",message:`${r} (${n}) cannot satisfy filtering texture '${t.name}' @group(${t.group}) @binding(${t.binding}).`,fix:"Use a filterable format; request float32-filterable for rgba32float when supported; or use textureLoad without a sampler.",where:`${e}.set`,detail:{format:n,group:t.group,binding:t.binding,bindingName:t.name,resourceName:r,samplerName:i?.name,samplerGroup:i?.group,samplerBinding:i?.binding}})}function no(e,t){let n=xl(e,t);return new h({code:"VGPU-R1-BINDING-NEVER-SET",message:`Unset \`${t.name}\` @group(${t.group}) @binding(${t.binding}) in '${e}'. Fix: ${n}; or ${e}.group(${t.group}, bindGroup).`,where:`${e}.draw`})}function tr(e,t){let n=t==="lib"?"lib-owned by its first JS set()":"user-owned by its first resource set()",r=t==="lib"?`Fix: pass a resource from the start: wave.set({ ${e}: new Uniform(gpu.device, { size: 4 }) }).`:`Fix: pass JS values from the first set(): wave.set({ ${e}: jsValue }).`;return new h({code:"VGPU-R1-OWNERSHIP-FLIP",message:`\`${e}\` is ${n}; ownership cannot change. ${r}`,where:"set"})}function ro(e,t){return new h({code:"VGPU-R4-GROUP-CLAIMED",message:`group ${t} of '${e}' is claimed; set() cannot update it.`,fix:`Call set() first, or build from ${e}.layout(${t}); pass dynamic offsets to p.draw().`,where:`${e}.set`})}function io(e,t,n,r){return new h({code:"VGPU-R4-GROUP-INCOMPATIBLE",message:`claimed group ${t} in '${e}' is incompatible: ${n}.`,fix:`Build from ${e}.layout(${t}, { dynamicOffsets? }) then call ${e}.group(${t}, bindGroup).`,where:`${e}.group`,cause:r})}function Q(e,t,n){return new h({code:"VGPU-R4-GROUP-VALIDATION",message:`WebGPU rejected claimed group ${t} in '${e}'.`,fix:`Build from ${e}.layout(${t}); pass offsets via p.draw(draw, { offsets: { ${t}: [...] } }).`,where:`${e}.draw`,cause:n,detail:{drawLabel:e,group:t}})}function nr(e,t){return new h({code:"VGPU-BLEND-INVALID",message:`Invalid blend '${String(t)}' in '${e}'.`,fix:'Use "alpha", "additive", "premultiplied", or { color, alpha? } components.',where:"draw"})}function rr(e,t){return new h({code:"VGPU-BLEND-CONSTANT-INVALID",message:`Invalid blendConstant in '${e}': ${t}`,fix:'Use [r, g, b, a] finite numbers with a blend whose color or alpha uses "constant"/"one-minus-constant"; omit it to keep the pass default (0, 0, 0, 0).',where:"draw"})}function oo(e,t){return new h({code:"VGPU-BUNDLE-BLEND-CONSTANT",message:`bundle '${e}' cannot record draw '${t}': blendConstant is render-pass state and render bundle encoders cannot set it.`,fix:"Encode the draw with p.draw(...) in a frame pass, or drop blendConstant from the draw.",where:"bundle"})}function ir(e,t){return new h({code:"VGPU-WRITEMASK-INVALID",message:`Invalid writeMask ${t} in '${e}'.`,fix:"Use an array of r/g/b/a; omit it for all channels.",where:"draw"})}function Yt(e,t,n="draw"){return new h({code:"VGPU-COLORS-INVALID",message:`Invalid colors in '${e}': ${t}`,fix:"Use one { blend?, writeMask? } or null entry per color attachment of the target, aligned by index; omit colors to apply the top-level blend/writeMask to every attachment.",where:n})}function so(e,t){return new h({code:"VGPU-CULL-INVALID",message:`Invalid cull '${String(t)}' in '${e}'.`,fix:'Use "none", "front", or "back"; omit it for no culling.',where:"draw"})}function ao(e,t){return new h({code:"VGPU-FRONTFACE-INVALID",message:`Invalid frontFace '${String(t)}' in '${e}'.`,fix:'Use "ccw" or "cw"; omit it for counter-clockwise.',where:"draw"})}function or(e,t){return new h({code:"VGPU-UNCLIPPED-DEPTH-INVALID",message:`Invalid unclippedDepth in '${e}': ${t}`,fix:'Use a boolean. unclippedDepth: true needs the "depth-clip-control" device feature \u2014 request it with init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it. Omit the option to keep depth clipping.',where:"draw"})}function Z(e,t){return new h({code:"VGPU-DEPTH-INVALID",message:`Invalid depth in '${e}': ${t}`,fix:'Use false or { write?, compare?, bias?, biasSlopeScale?, biasClamp? }; omit it for { write: true, compare: "less-equal" }.',where:"draw"})}function Ue(e,t,n="draw"){return new h({code:"VGPU-STENCIL-INVALID",message:`Invalid stencil in '${e}': ${t}`,fix:`Use { front?, back?, readMask?, writeMask?, ref? } with GPUCompareFunction/GPUStencilOperation faces and u32 masks, against a target whose depth format has a stencil aspect (depth: "depth24plus-stencil8"); omit it for WebGPU's pass-through defaults.`,where:n})}function co(e,t){return new h({code:"VGPU-BUNDLE-STENCIL-REF",message:`bundle '${e}' cannot record draw '${t}': stencil.ref is render-pass state and render bundle encoders cannot set it.`,fix:"Encode the draw with p.draw(...) in a frame pass, or drop ref from the draw's stencil.",where:"bundle"})}function xt(e,t,n="draw"){return new h({code:"VGPU-MULTISAMPLE-INVALID",message:`Invalid multisample in '${e}': ${t}`,fix:"Use { alphaToCoverage?, mask? }: alphaToCoverage needs a target created with msaa: true, and mask must be an integer in [0, 0xFFFFFFFF] (bits above the target's sampleCount are ignored). Omit multisample for full-coverage defaults.",where:n})}function bt(e,t,n="draw"){return new h({code:"VGPU-CONSTANTS-INVALID",message:`Invalid constants in '${e}': ${t}`,fix:"Key WGSL `override` constants by name, or by the decimal string of N when the declaration has @id(N); values are finite numbers or booleans, converted to the override's WGSL type (bool/i32/u32/f32/f16). Every override without a default value must be provided. Omit constants to keep the WGSL defaults.",where:n})}function Ye(e,t,n="draw"){return new h({code:"VGPU-ENTRY-INVALID",message:`Invalid entry in '${e}': ${t}`,fix:"Name an entry point declared in the shader with the matching stage \u2014 { vertex?, fragment? } strings for draw, one @compute name string for compute. Omit entry (or a field) to use the first entry point of that stage.",where:n})}function J(e,t,n){return new h({code:"VGPU-INDIRECT-INVALID",message:`Invalid indirect in '${e}': ${t}`,fix:"Pass a storage buffer created with storage(gpu, bytes, { indirect: true }) \u2014 bare, or as { buffer, offset? } with a 4-aligned byte offset \u2014 sized so the GPU-read arguments fit: 16 bytes for drawIndirect, 20 for drawIndexedIndirect, 12 for dispatchWorkgroupsIndirect. Omit indirect to use CPU-side counts.",where:n})}function lo(){return new h({code:"VGPU-PASS-PRESERVE-MSAA",message:"clear:false cannot preserve MSAA; use a non-MSAA target.",fix:"Use non-MSAA for accumulation.",where:"Frame.pass"})}function sr(e,t="expected a number in [0, 1].",n='Use 1 (default), or 0 with depth: { compare: "greater" } for reversed-Z.'){return new h({code:"VGPU-PASS-CLEARDEPTH-INVALID",message:`clearDepth received ${String(e)}; ${t}`,fix:n,where:"Frame.pass"})}function ee(e){return new h({code:"VGPU-PASS-VIEWPORT-INVALID",message:`Invalid viewport: ${e}`,fix:"Use { x?, y?, width, height, minDepth?, maxDepth? } finite numbers within device limits; omit it for the full target.",where:"Frame.pass"})}function Xt(e){return new h({code:"VGPU-PASS-SCISSOR-INVALID",message:`Invalid scissor: ${e}`,fix:"Use [x, y, width, height] non-negative integers with x + width and y + height within the target's current pixel size; omit it for the full target.",where:"Frame.pass"})}function uo(){return new h({code:"VGPU-PASS-PRESERVE-CLEARDEPTH",message:"clear:false preserves depth; clearDepth cannot apply.",fix:"Remove clearDepth, or let the pass clear.",where:"Frame.pass"})}function ar(e){return new h({code:"VGPU-PASS-CLEARSTENCIL-INVALID",message:`clearStencil ${e}`,fix:`Use an integer in [0, 0xFFFFFFFF] on a target whose depth format has a stencil aspect, e.g. depth: "depth24plus-stencil8"; the value is masked to the stencil aspect's bit width.`,where:"Frame.pass"})}function fo(){return new h({code:"VGPU-PASS-PRESERVE-CLEARSTENCIL",message:"clear:false preserves stencil; clearStencil cannot apply.",fix:"Remove clearStencil, or let the pass clear.",where:"Frame.pass"})}function be(e,t,n="Frame.pass"){return new h({code:"VGPU-PASS-DEPTH-READONLY",message:`depthReadOnly ${e}`,fix:t,where:n})}function po(){return new h({code:"VGPU-PASS-DEPTH-READONLY-MSAA",message:`depthReadOnly cannot read an MSAA target's depth: multisampled depth is stored with storeOp "discard", so a read-only pass tests against discarded contents.`,fix:"Use a non-MSAA target for read-only depth, or drop depthReadOnly and let the pass own its depth.",where:"Frame.pass"})}function ye(e,t,n="timer"){return new h({code:"VGPU-TIMER-INVALID",message:`Invalid timer use: ${e}`,fix:t,where:n})}function mo(e,t){return new h({code:"VGPU-TIMER-CAPACITY",message:`frame exceeds ${e} timed spans; a timer holds one timestamp query set and WebGPU createQuerySet requires count <= ${t} (2 queries per span).`,fix:"Time fewer passes per frame, or spread timing across frames.",where:"Frame.pass"})}function _e(e,t,n="visibility"){return new h({code:"VGPU-VIS-INVALID",message:`Invalid visibility use: ${e}`,fix:t,where:n})}function ho(e,t){return new h({code:"VGPU-VIS-CAPACITY-LIMIT",message:`capacity received ${String(e)}; expected an integer in [1, ${t}] \u2014 a visibility instance holds one occlusion query set and WebGPU createQuerySet requires count <= ${t}.`,fix:`Use visibility(gpu, { capacity }) with an integer capacity of at most ${t} (default 64), or create several visibility instances.`,where:"visibility"})}function go(e){return new h({code:"VGPU-VIS-CAPACITY",message:`frame uses more than the declared ${e} occlusion query slot(s); the query set is bound to this frame's pass descriptors and cannot grow mid-frame.`,fix:"Raise visibility(gpu, { capacity }) (max 4096), or dispose() unused query handles so fewer slots are needed per frame.",where:"FramePass.occlusion"})}function xo(e){return new h({code:"VGPU-VIS-LABEL-DUPLICATE",message:`query label '${e}' is already live on this visibility instance.`,fix:"Reuse the existing handle \u2014 vis.query(label) handles are stable, created once outside the loop \u2014 or dispose() the old handle first, or pick a distinct label.",where:"Visibility.query"})}function Qt(e,t){return new h({code:"VGPU-VIS-DISPOSED",message:`the ${e} is disposed.`,fix:e==="visibility"?"Create a new instance with visibility(gpu).":"Create a new handle with vis.query(label).",where:t})}function bo(){return new h({code:"VGPU-VIS-NO-DEPTH",message:'visibility is set, but the pass target has no depth attachment; without depth testing an occlusion query passes for anything rasterized, so it always reports "visible" and is useless for culling.',fix:"Create the target with depth: true (or a depth format), or drop visibility from this pass.",where:"Frame.pass"})}function yo(){return new h({code:"VGPU-QUERY-NO-VISIBILITY",message:"occlusion() needs the pass to be opened with a visibility instance; the render pass has no occlusionQuerySet to write into.",fix:"Open the pass with f.pass({ target, visibility: vis }, ...) using the visibility(gpu) instance that created the query handle.",where:"FramePass.occlusion"})}function _o(){return new h({code:"VGPU-QUERY-NESTED",message:"occlusion() cannot nest inside an active occlusion() body; WebGPU allows one active occlusion query per pass at a time.",fix:"Encode each occlusion scope sequentially: p.occlusion(a, ...); p.occlusion(b, ...).",where:"FramePass.occlusion"})}function vo(e){return new h({code:"VGPU-QUERY-DUPLICATE",message:`query '${e}' was already used this frame; a slot holds one result per frame, so reuse would silently overwrite it.`,fix:`Use one handle per measured object per frame, e.g. vis.query("${e}-2") for a second scope.`,where:"FramePass.occlusion"})}function yt(e="Frame.pass"){return new h({code:"VGPU-TARGET-REQUIRED",message:"Target required. Fix: pass surface(gpu, canvas) or target(gpu, { size }) as { target }.",where:e})}function te(e,t,n,r){return new h({code:e,message:`${e}: ${n}`,fix:r,where:t})}function B(e,t){return te("VGPU-MESH-LAYOUT-INVALID",e,t,"Fix attributes/formats/offsets; use non-numeric names and 4-aligned stride <= 2048.")}function cr(e,t){return te("VGPU-MESH-LIMIT-EXCEEDED",e,t,"Use <= 8 buffers and <= 16 attributes (or the device limits).")}function lr(e,t){return te("VGPU-MESH-LOCATION-CONFLICT",e,`Duplicate geometry @location(${t}).`,"Use unique locations, or omit them for name matching.")}function ur(e,t){return te("VGPU-MESH-DATA-MISALIGNED",e,t,"Fix: repack data, set matching stride, or give raw buffers an explicit count.")}function ve(e,t){return te("VGPU-MESH-RANGE-INVALID",e,t,"Use index ranges for indexed geometries, vertex ranges otherwise, within geometry counts.")}function Be(e,t){return te("VGPU-MESH-WRITE-RANGE",e,t,"Write within the buffer byteLength, or create a larger geometry.")}function wo(e,t,n=[]){return te("VGPU-MESH-ATTRIBUTE-UNMATCHED",e,`Geometry attribute '${t}' has no shader input.`,`Use shader name${n.length?` (${n.join(",")})`:""} or { location:n }.`)}function So(e,t,n){return te("VGPU-MESH-ATTRIBUTE-UNMATCHED",e,`Geometry attribute '${t}' matches locations ${n.join(",")}.`,"Rename inputs or set { location:n }.")}function Eo(e,t,n=[]){return te("VGPU-MESH-INPUT-MISSING",e,`Geometry lacks shader input '${t}'.`,`Add/remove it. Geometry attributes: ${n.join(",")||"none"}.`)}function ko(e,t,n,r){return te("VGPU-MESH-FORMAT-MISMATCH",e,`Attribute '${t}' ${n} != shader ${r}.`,"Match the float/sint/uint shader base type; widths may differ.")}function Po(e){return new h({code:"VGPU-PIPELINE-LAYOUT-GAP",message:`Pipeline bind group ${e} is missing.`,fix:"Use consecutive @group() indices starting at 0.",where:"pipeline layout"})}function Xe(e,t,n){return new h({code:"VGPU-COMPILE-FAILED",message:"WebGPU pipeline compilation failed.",fix:"Check WGSL, vertex layouts, and target signature.",where:e,cause:t,detail:n?{signature:n}:void 0})}function dr(e){return new h({code:"VGPU-COMPILE-DISPOSED",message:"GPU disposed during pipeline compilation.",where:e})}function _t(e,t){return new h({code:"VGPU-COMPILE-SIGNATURE-INVALID",message:`Invalid TargetSignature: ${t}`,fix:"Pass { colors, depth?, sampleCount?:1|4 } or a Target.",where:e})}function Io(e){return new h({code:"VGPU-TARGET-DEPTH-STENCIL-ONLY",message:`depth received '${e}'; stencil-only depth targets are not supported yet.`,fix:'Use a format with a depth aspect such as "depth24plus" or "depth24plus-stencil8".',where:"target"})}function fr(){return new h({code:"VGPU-TARGET-SIZE-REQUIRED",message:"Target size required. Fix: target(gpu, { size: [w,h] }); update surface-derived targets in onResize.",where:"target"})}function Qe(e){return new h({code:"VGPU-SURFACE-NOT-IN-FRAME",message:"Surface targets are only available inside frame(gpu).",fix:"surface passes must run inside frame(gpu, ...); precompile against an offscreen target(gpu, ...) instead",where:e})}function Ro(){return new h({code:"VGPU-SURFACE-CONTEXT",message:"Canvas WebGPU context failed. Fix: check navigator.gpu and remove any existing 2d/webgl context.",where:"surface"})}function Ao(e){return new h({code:"VGPU-SURFACE-DUPLICATE",message:`Canvas already has surface${e?` '${e}'`:""}. Fix: reuse or dispose it.`,where:"surface"})}function Co(e){return new h({code:"VGPU-SURFACE-DISPOSED",message:`Surface '${e??"surface"}' is disposed. Fix: call surface(gpu, canvas).`,where:"surface"})}function To(){return new h({code:"VGPU-SURFACE-AUTORESIZE-UNSUPPORTED",message:"autoResize needs clientWidth. Fix: call surface.resize([w,h]) for OffscreenCanvas; onResize still fires.",where:"surface"})}function Fo(e){return new h({code:"VGPU-SURFACE-RESIZE-REENTRANT",message:`Cannot resize this surface${e?` '${e}'`:""} in onResize. Fix: resize derived targets only.`,where:"surface.resize"})}function Lo(e){return new h({code:"VGPU-CLEAR-COLOR-INVALID",message:`Invalid ${e}: expected four finite numbers.`,fix:"Assign [r, g, b, a] or a GPUColor object ({ r, g, b, a }).",where:e})}function Do(e){return new h({code:"VGPU-CLOCK-DELTA-INVALID",message:`clock.advance() received ${String(e)}; expected a finite, non-negative number of seconds.`,fix:"Pass the elapsed seconds, e.g. clock(gpu).advance(1 / 60); use frame(gpu) alone to advance with wall-clock time.",where:"clock.advance"})}function Zt(){return new h({code:"VGPU-FRAME-REENTRANT",message:"Nested frame(gpu) is invalid. Fix: queue work for the next frame.",where:"frame"})}function $o(e,t){return new h({code:"VGPU-QUERY-READBACK",message:`${e} dropped a query readback: ${ml(t)}`,fix:"Usually a lost or destroyed device: recreate the gpu (and the timer/visibility instance) before reading queries again. Results resume on the next successful readback; the frame itself is unaffected.",where:"QueryRing.onSubmitted",cause:t})}function pr(e){return new h({code:"VGPU-FRAME-CANCELED",message:"the frame was canceled; its command encoder was dropped and nothing more can be encoded or submitted on it.",fix:"Open a new frame(gpu) for further work; cancel() is the last operation on a frame.",where:e})}function Go(e){return new h({code:"VGPU-FRAME-PASS-ACTIVE",message:"the frame cannot be canceled while a pass callback is active.",fix:"Return from the frame.pass(...) callback first, then call frame.cancel(); this keeps pass descriptor resources alive until the pass is closed.",where:e})}function Mo(e){return new h({code:"VGPU-FRAME-SUBMITTED",message:"the frame was already submitted; submitted GPU work cannot be canceled.",fix:"Call cancel() only on a frame you decided not to submit; the frame you did submit needs no cleanup.",where:e})}function ne(e,t,n){return new h({code:"VGPU-R1-BINDING-INCOMPATIBLE-RESOURCE",message:`binding \`${e.name}\` @group(${e.group}) @binding(${e.binding}) needs ${t}.`,fix:n,where:"set"})}function P(e,t,n){return new h({code:"VGPU-RING1-UNSUPPORTED",message:t,fix:n,where:e})}function vt(e){return hl(e)&&e.version!==1?new h({code:"VGPU-SHADER-SOURCE-INVALID",message:`VGPU-SHADER-SOURCE-INVALID: unsupported ShaderSource v${String(e.version)}; expected v1. Fix: update vgpu or regenerate it.`,where:"shader source"}):new h({code:"VGPU-SHADER-SOURCE-INVALID",message:`VGPU-SHADER-SOURCE-INVALID: expected WGSL or { version, wgsl }, got ${gl(e)}. Fix: configure @vgpu/wgsl loader-vite or loader-webpack.`,where:"shader source"})}function Uo(e){return new h({code:"VGPU-R1-STORAGE-ALIASING",message:"`src` and writable `dst` alias. Fix: alternate them with pingPongStorage(gpu).",where:e})}function Bo(e){return new h({code:"VGPU-R1-SHARED-UNIFORMS-LAYOUT-MISMATCH",message:`Uniform '${e.bindingName}' layout ${e.adoptedLayout} from ${e.adoptedSource} != ${e.incomingLayout} from ${e.incomingSource}. Fix: align structs or split uniforms.`,where:"uniforms"})}function ml(e){return e instanceof Error?`${e.name}: ${e.message}`:String(e)}function hl(e){return typeof e=="object"&&e!==null&&"version"in e}function gl(e){if(typeof e!="object"||e===null)return typeof e;try{let t=JSON.stringify(e);return t.length>80?`${t.slice(0,77)}...`:t}catch{return"object"}}function xl(e,t){switch(t.kind){case"sampler":return`${e}.set({${t.name}:sampler(gpu)})`;case"texture":return`${e}.set({${t.name}:scene.color})`;case"buffer":return t.addressSpace==="uniform"?`${e}.set({${t.name}:{ /* values */ }})`:`${e}.set({${t.name}:buffer})`;default:return`${e}.set({${t.name}:resource})`}}var Oo=["scheduler","resource","service"];function re(e){return{name:e}}var Vo=new WeakMap;function No(e){let t=Vo.get(e);if(!t)throw new h({code:"VGPU-GPU-FOREIGN",message:"This object was not created by init(); it has no vgpu kernel.",fix:"Pass the gpu returned by init() from vgpu, vgpu/node or vgpu/mock.",where:"gpu"});return t}var mr=class{device;#e=new Map;#t=new Map(Oo.map(t=>[t,new Set]));#n=new Set;#r=new Set;#i=new Set;#o=!1;constructor(t){this.device=t}get disposed(){return this.#o}service(t,n){let r=this.#e.get(t);if(r!==void 0)return r;let i=n(this);return this.#e.set(t,i),i}peekService(t){return this.#e.get(t)}own(t,n){let r=this.#t.get(t);return r.add(n),()=>{r.delete(n)}}addErrorListener(t){return this.#n.add(t),()=>{this.#n.delete(t)}}reportError(t){if(this.#o)return Promise.resolve();let n=Promise.resolve().then(()=>{let r=[...this.#n];if(!r.length){console.error(t);return}for(let i of r)try{i(t)}catch(o){console.error(o)}});return this.trackDelivery(n)}trackDelivery(t){let n=Promise.resolve(t).then(()=>{},r=>{console.error(r)});return this.#r.add(n),n.finally(()=>this.#r.delete(n)),n}registerSettledSource(t){return this.#i.add(t),()=>{this.#i.delete(t)}}async settled(){let t=[...this.#r,...[...this.#i].flatMap(n=>n())];await Promise.allSettled(t)}dispose(){if(!this.#o){this.#o=!0;for(let t of Oo){let n=this.#t.get(t);for(let r of[...n])r();n.clear()}this.#e.clear(),this.#i.clear(),this.#n.clear(),this.device.dispose()}}};function hr(e){let t=new mr(e),n={device:e,gpu:e.gpu,get disposed(){return t.disposed},onError:r=>t.addErrorListener(r),settled:()=>t.settled(),dispose:()=>{t.dispose()}};return Vo.set(n,t),n}async function gr(e,t={},n){return hr(await bl(e,t,n))}async function bl(e,t,n){if(t.adapter||n)return(t.adapter??n()).requestDevice(t);if(e==="browser")return yl(t);throw P("init",`init(${e}) requires adapterFactory.`)}async function yl(e){let n=await globalThis.navigator.gpu?.requestAdapter({powerPreference:e.powerPreference});if(!n)throw P("init","navigator.gpu.requestAdapter() returned null.");zn(n.features,e.requiredFeatures);let r=await n.requestDevice({requiredFeatures:e.requiredFeatures,requiredLimits:e.requiredLimits});return new de(r,n.info??null)}function I(e,t){e.assertUsable(t)}function wt(e,t){e.assertUsable(t)}async function zo(e){if(!_l(e))throw vl("VGPU-INIT-DEVICE-INVALID","Invalid external GPUDevice shape.");let t=new de(e,null,"external");await Promise.resolve();try{return I(t,"initFromDevice"),hr(t)}catch(n){throw t.dispose(),n}}function _l(e){if(typeof e!="object"&&typeof e!="function"||e===null)return!1;try{let t=e;return(typeof t.queue=="object"||typeof t.queue=="function")&&t.queue!==null&&typeof t.createBuffer=="function"&&typeof t.createCommandEncoder=="function"&&!!t.lost&&typeof t.lost.then=="function"}catch{return!1}}function vl(e,t){return new h({code:e,message:t,where:"initFromDevice"})}var St=Symbol("vgpu.bindingResource");function Wo(e){return typeof(typeof e=="object"&&e!==null?e[St]:void 0)=="function"?e:void 0}var we=Symbol("vgpu.geometry.layoutResolver");function S(e,t){let n=No(e);if(n.disposed)throw xr(t);return n}function xr(e){return new h({code:"VGPU-GPU-DISPOSED",message:`${e}() ran after gpu.dispose(); the device and everything it owned are gone.`,fix:"Create resources before disposing the gpu, or init() a new one.",where:e})}function Jt(e,t){let n=()=>{},r=t({trackSettled:i=>{e.trackDelivery(i)},errorSink:i=>e.reportError(i),onDispose:()=>{n()}});return n=e.own("resource",()=>r.dispose()),r}function pe(e,t,n,r){let i=e.own("resource",()=>n(t));return r?.(i),t}var Et=class{vertexCount;indexCount;instanceCount;vertexBuffers;indexBuffer;indexFormat;vertexBufferLayouts;topology;stripIndexFormat;buffers;#e;#t;#n;#r=new Map;#i=new Set;#o=!1;constructor(t,n){let r="geometry";if(n.buffers.length>8)throw cr(r,`${n.buffers.length} vertex buffers exceed limit 8.`);let i=0,o=new Set,s=n.buffers.map((f,m)=>{let x=El(t,f,`${r}.buffers[${m}]`);i+=x.attributes.length;for(let g of x.attributes)if(g.location!==void 0){if(o.has(g.location))throw lr(`${r}.buffers[${m}]`,g.location);o.add(g.location)}return x}),a=t.gpu.limits.maxVertexAttributes;if(i>a)throw cr(r,`${i} attributes exceed device limit ${a}.`);let c=n.topology??"triangle-list";if(!Il.has(c))throw B(r,`Invalid topology: ${String(c)}.`);let l=kl(t,n,r),u=jo(s,"vertex"),d=jo(s,"instance");Ho(s,"vertex",n.vertexCount??u,r),Ho(s,"instance",n.instanceCount??d,r),br(r,"vertexCount",n.vertexCount,u),br(r,"instanceCount",n.instanceCount,d),br(r,"indexCount",n.indexCount,l.count),this.topology=c,this.stripIndexFormat=c.endsWith("strip")?l.format:void 0,this.#n=s,this.vertexBufferLayouts=Object.freeze(s.map(f=>f.layout)),this.vertexBuffers=Object.freeze(s.map(f=>f.gpu)),this.buffers=Object.freeze(s.map((f,m)=>new yr(`${r}.buffers[${m}]`,f))),this.vertexCount=n.vertexCount??u,this.instanceCount=n.instanceCount??d,this.indexBuffer=l.gpu,this.indexFormat=l.format,this.indexCount=n.indexCount??l.count,this.#e=l.owned,this.#t=l.byteLength,Pl(this)}[we](t,n){if(this.#o)throw B(n,"Geometry is destroyed; create a live geometry.");let r=t.map(l=>`${l.name}:${l.location}:${en(l.type)}`).join("|"),i=this.#r.get(r);if(i)return i;let o=new Set,s=this.#n.flatMap(l=>l.attributes.map(u=>u.name)),a=this.#n.map(l=>{let u=[...l.layout.attributes],d=l.attributes.map((f,m)=>{let x=f.location===void 0?t.filter(k=>k.name===f.name):[];if(f.location===void 0&&x.length===0)throw wo(n,f.name,t.map(k=>k.name));if(x.length>1)throw So(n,f.name,x.map(k=>k.location));let g=f.location??x[0].location;if(o.has(g))throw lr(n,g);o.add(g);let E=t.find(k=>k.location===g);if(E&&Cl(f.format)!==en(E.type))throw ko(n,f.name,f.format,en(E.type));return Object.freeze({...u[m],shaderLocation:g})});return Object.freeze({arrayStride:l.layout.arrayStride,...l.layout.stepMode?{stepMode:l.layout.stepMode}:{},attributes:Object.freeze(d)})});for(let l of t)if(!o.has(l.location))throw Eo(n,l.name,s);let c=Object.freeze(a);return this.#r.set(r,c),c}slice(t={}){return new _r(this,t)}write(t,n=0){let r=this.buffers[0];if(!r)throw Be("geometry.write","No vertex buffer 0; add one before writing.");r.write(t,n)}writeIndices(t,n=0){if(this.#o)throw Be("geometry.writeIndices","Geometry is destroyed; create a new geometry before writing.");if(!this.#e||this.#t===void 0)throw Be("geometry.writeIndices","No owned index buffer; write caller-owned buffers directly.");Xo("geometry.writeIndices",this.#t,t.byteLength,n),this.#e.write(t,n)}destroy(){if(!this.#o){this.#o=!0;for(let t of this.buffers)t.destroyOwned();this.#e?.destroy();for(let t of[...this.#i])t();this.#i.clear()}}onDestroy(t){return this.#o?(t(),()=>{}):(this.#i.add(t),()=>{this.#i.delete(t)})}},yr=class{where;inner;gpu;stride;stepMode;#e={destroyed:!1};constructor(t,n){this.where=t,this.inner=n,this.gpu=n.gpu,this.stride=n.stride,this.stepMode=n.stepMode,Object.freeze(this)}write(t,n=0){if(this.#e.destroyed)throw Be(this.where,"Geometry is destroyed; create a new geometry before writing.");if(!this.inner.owned||this.inner.byteLength===void 0)throw Be(this.where,"Caller-owned buffer; write it directly.");Xo(this.where,this.inner.byteLength,Yo(t),n),this.inner.owned.write(t,n)}destroyOwned(){this.#e.destroyed=!0,this.inner.owned?.destroy()}},_r=class{geometry;vertexCount;indexCount;instanceCount;vertexBuffers;indexBuffer;indexFormat;vertexBufferLayouts;topology;stripIndexFormat;firstIndex;baseVertex;firstVertex;[we](t,n){return this.geometry[we](t,n)}constructor(t,n){if(this.geometry=t,this.vertexBuffers=t.vertexBuffers,this.indexBuffer=t.indexBuffer,this.indexFormat=t.indexFormat,this.vertexBufferLayouts=t.vertexBufferLayouts,this.topology=t.topology,this.stripIndexFormat=t.stripIndexFormat,t.indexBuffer){if(n.firstVertex!==void 0||n.vertexCount!==void 0)throw ve("geometry.slice","Indexed slice needs firstIndex/indexCount/baseVertex; omit vertex range fields.");let r=n.firstIndex??0,i=t.indexCount??0,o=n.indexCount??i-r;Se("geometry.slice","firstIndex",r,i),Se("geometry.slice","indexCount",o,i-r),Se("geometry.slice","baseVertex",n.baseVertex??0,Number.MAX_SAFE_INTEGER),this.firstIndex=r,this.indexCount=o,this.baseVertex=n.baseVertex??0,this.vertexCount=t.vertexCount}else{if(n.firstIndex!==void 0||n.indexCount!==void 0||n.baseVertex!==void 0)throw ve("geometry.slice","Non-indexed slice needs firstVertex/vertexCount; omit index range fields.");let r=n.firstVertex??0,i=t.vertexCount??0,o=n.vertexCount??i-r;Se("geometry.slice","firstVertex",r,i),Se("geometry.slice","vertexCount",o,i-r),this.firstVertex=r,this.vertexCount=o,this.indexCount=t.indexCount}Se("geometry.slice","instanceCount",n.instanceCount??t.instanceCount??0,Number.MAX_SAFE_INTEGER),this.instanceCount=n.instanceCount??t.instanceCount,Object.freeze(this)}};function Ko(e,t){let n=S(e,"geometry"),r=wl(t)?t.build(n.device):t;return Sl(n,new Et(n.device,r))}function wl(e){return"build"in e&&typeof e.build=="function"}function Sl(e,t){return pe(e,t,n=>n.destroy(),n=>{t.onDestroy(n)})}function qo(e){if(e==="unorm10-10-10-2"||e==="unorm8x4-bgra")return 4;let t=/^(float|uint|sint|unorm|snorm)(8|16|32)(?:x([234]))?$/.exec(e);if(!t)return 0;let[,n,r,i]=t;return(r==="32"?/norm/.test(n):!i||i==="3"||r==="8"&&n==="float")?0:Number(r)/8*Number(i??1)}function El(e,t,n){if(t.data!==void 0&&t.buffer!==void 0)throw B(n,"Choose data or buffer, not both.");let r=t.stepMode??"vertex";if(r!=="vertex"&&r!=="instance")throw B(n,`Invalid stepMode: ${String(r)}.`);let i=[],o=[],s=0;for(let[d,f]of Object.entries(t.attributes)){if(/^\d+$/.test(d))throw B(n,`Attribute '${d}' is numeric; use a non-numeric name.`);let m=typeof f=="string"?{format:f}:f,x=qo(m.format);if(!x)throw B(n,`Unknown GPUVertexFormat '${m.format}'.`);let g=m.offset??s,E=Math.min(4,x);if(!Number.isInteger(g)||g<0||g%E!==0)throw B(n,`Attribute '${d}' offset ${String(g)} needs ${E}-byte alignment.`);if(m.location!==void 0&&(!Number.isInteger(m.location)||m.location<0||m.location>=e.gpu.limits.maxVertexAttributes))throw B(n,`Location ${String(m.location)} for '${d}' is outside limit ${e.gpu.limits.maxVertexAttributes}.`);i.push({shaderLocation:m.location??i.length,offset:g,format:m.format}),o.push({name:d,format:m.format,location:m.location}),s+=x}let a=t.stride??Al(s);if(!Number.isInteger(a)||a<=0||a>2048||a%4!==0)throw B(n,`Stride ${String(a)} must be 4-aligned in [4,2048].`);for(let[d,f]of i.entries()){let m=qo(f.format);if(f.offset+m>a)throw B(n,`Attribute '${o[d]?.name}' (${f.offset}+${m}) exceeds stride ${a}.`)}let c=t.data?Yo(t.data):void 0;if(c!==void 0&&c%a!==0)throw ur(n,`Data byteLength ${c} is not divisible by stride ${a}.`);let l=t.data!==void 0?e.createBuffer({label:t.label,size:Math.max(4,c??0),usage:["vertex","copy_dst"]}):void 0;return l&&t.data&&l.write(t.data),{layout:Object.freeze({arrayStride:a,...t.stepMode?{stepMode:r}:{},attributes:Object.freeze(i)}),attributes:Object.freeze(o),stride:a,stepMode:r,byteLength:c,gpu:l?.gpu??Rl(t.buffer,n),owned:l}}function kl(e,t,n){if(t.indices!==void 0&&t.indexBuffer!==void 0)throw B(n,"Choose indices or indexBuffer, not both.");if(t.indices===void 0){let c=[t.indexBuffer,t.indexFormat,t.indexCount].filter(l=>l!==void 0).length;if(c!==0&&c!==3)throw B(n,"Provide indexBuffer, indexFormat, and indexCount together.");if(t.indexFormat!==void 0&&t.indexFormat!=="uint16"&&t.indexFormat!=="uint32")throw B(n,`Unknown index format '${String(t.indexFormat)}'.`);return t.indexCount!==void 0&&Se(n,"indexCount",t.indexCount,Number.MAX_SAFE_INTEGER),{gpu:t.indexBuffer,format:t.indexFormat,count:t.indexCount}}if(t.indexFormat!==void 0)throw B(n,"indices infer format; omit indexFormat.");let r=Array.isArray(t.indices)?new Uint32Array(t.indices):t.indices,i=r instanceof Uint16Array?"uint16":"uint32",o=r.byteLength;if(o%(i==="uint16"?2:4)!==0)throw ur(n,`Index byteLength ${o} is invalid for ${i}.`);let s=e.createBuffer({label:t.label?`${t.label}.indices`:void 0,size:Math.max(4,o),usage:["index","copy_dst"]});return s.write(r),{gpu:s.gpu,owned:s,format:i,count:r.length,byteLength:o}}function jo(e,t){let n;for(let r of e)r.stepMode===t&&r.byteLength!==void 0&&(n=Math.min(n??1/0,Math.floor(r.byteLength/r.stride)));return n}function Ho(e,t,n,r){if(n===void 0&&e.some(i=>i.stepMode===t&&i.byteLength===void 0))throw B(r,`Raw ${t} buffer needs ${t}Count.`)}function br(e,t,n,r){n!==void 0&&Se(e,t,n,r??Number.MAX_SAFE_INTEGER)}function Pl(e){for(let t of Object.keys(e))t!=="destroyed"&&Object.defineProperty(e,t,{writable:!1,configurable:!1})}var Il=new Set(["point-list","line-list","line-strip","triangle-list","triangle-strip"]);function Rl(e,t){if(!e)throw B(t,"Provide geometry buffer data or buffer.");return e}function Yo(e){return e.byteLength}function Al(e){return e+3&-4}function Xo(e,t,n,r){if(!Number.isInteger(r)||r<0||r%4!==0||n%4!==0||r+n>t)throw Be(e,`Write size ${n}/offset ${String(r)} must be 4-aligned within ${t} bytes.`)}function Se(e,t,n,r){if(!Number.isInteger(n)||n<0||n>r)throw ve(e,`${t}=${String(n)} must be an integer in [0,${r}].`)}function Cl(e){return e.startsWith("sint")?"i32":e.startsWith("uint")?"u32":"f32"}function en(e){return e.kind==="scalar"?e.name:e.kind==="vector"||e.kind==="matrix"||e.kind==="atomic"?en(e.element):e.kind}var Tl=(globalThis.GPUShaderStage?.VERTEX??1)|(globalThis.GPUShaderStage?.FRAGMENT??2),tn=class{device;size;buffer;bindGroupLayout;bindGroup;#e=!1;constructor(t,n){this.device=t,this.size=n.size,this.buffer=t.createBuffer({size:n.size,usage:["uniform","copy_dst"],label:n.label}),this.bindGroupLayout=n.bindGroupLayout??Jn(t,{label:n.label?`${n.label}.bgl`:void 0,entries:[Ht.uniform(0,n.visibility??Tl,{minBindingSize:n.size})]}),this.bindGroup=er(t,{label:n.label?`${n.label}.bg`:void 0,layout:this.bindGroupLayout,entries:[Ht.resource(0,this.buffer)]})}get gpu(){return this.buffer.gpu}write(t,n=0){this.buffer.write(t,n)}destroy(){this.#e||(this.#e=!0,this.buffer.destroy())}dispose(){this.destroy()}};var vr=class{gpu;constructor(t){this.gpu=t}setPipeline(t){this.gpu.setPipeline(t)}setBindGroup(t,n,r){this.gpu.setBindGroup(t,n,r)}setVertexBuffer(t,n,r=0,i){this.gpu.setVertexBuffer(t,Fl(n),r,i)}draw(t,n=1,r=0,i=0){if(typeof t=="number"){this.gpu.draw(t,n,r,i);return}this.gpu.draw(t.vertexCount,t.instanceCount??1,t.firstVertex??0,t.firstInstance??0)}};function Qo(e,t){let n=e.gpu.createRenderBundleEncoder({label:t.label,colorFormats:t.colorFormats,depthStencilFormat:t.depthStencilFormat,sampleCount:t.sampleCount,depthReadOnly:t.depthReadOnly,stencilReadOnly:t.stencilReadOnly});return t.record(new vr(n)),n.finish({label:t.label})}function Fl(e){return e instanceof U?e.gpu:e}var nn=class extends Error{code;line;column;severity;metadata;relatedDiagnostics;fix;where;cause;constructor(t,n,r=1,i=1,o="error"){super(n),this.name="VGPUError",this.code=t,this.line=r,this.column=i,this.severity=o}};function Zo(e,t,n={}){let r=new nn(e,t,n.line??1,n.column??1,n.severity??"error");return n.fix!==void 0&&(r.fix=n.fix),n.where!==void 0&&(r.where=n.where),n.cause!==void 0&&(r.cause=n.cause),n.metadata!==void 0&&(r.metadata=n.metadata),r}function R(e,t,n=1,r=1){return new nn(e,t,n,r)}var Ll=new Set(["fn","struct","const","alias","var","override"]);function Jo(e){let t=[],n=[],r=[],i=0,o=!1,s=0;for(;i<e.length;){let a=e[i];if(a.text==="{"){s++,i++;continue}if(a.text==="}"){s=Math.max(0,s-1),i++;continue}if(Er(a)){i++;continue}if(s>0){i++;continue}if(a.text==="import"){if(o)throw R("VGPU-WGSL-IMP-ORDER","Imports must precede declarations",a.line,a.column);let[d,f]=Dl(e,i);t.push(d),i=f;continue}if(a.text==="export"&&e[i+1]?.text==="{")throw R("VGPU-WGSL-EXP-REEXPORT-CYCLE","Re-export cycles are not supported",a.line,a.column);if(a.text==="@"&&e[i+2]?.text==="export"&&e[i+3]?.text==="@")throw R("VGPU-WGSL-EXP-NOTDECL","Repeated export attributes",a.line,a.column);let c=a.text==="export"||a.text==="@"&&e[i+2]?.text==="export",l=c?$l(e,a.text==="export"?i+1:i+3):i,u=e[l];if(u&&Ll.has(u.text)){let d=Gl(e,l);n.push({name:d,localName:d,kind:u.text}),c&&r.push({name:d,localName:d,kind:u.text}),o=!0,i=l+1;continue}i++}return{imports:t,exports:r,locals:n}}function Dl(e,t){let n=t+1,r=[];if(e[n]?.text==="{"){for(n++;e[n]&&e[n].text!=="}";){if(Er(e[n])){n++;continue}let s=Sr(e[n]),a=s;n++,e[n]?.text==="as"&&(a=Sr(e[n+1]),n+=2),r.push({imported:s,local:a}),e[n]?.text===","&&n++}n++,wr(e[n],"from"),n++}else if(e[n]?.text==="*")wr(e[n+1],"as"),r.push({imported:"*",local:Sr(e[n+2]),namespace:!0}),n+=3,wr(e[n],"from"),n++;else throw e[n]?.kind==="string"?R("VGPU-WGSL-IMP-SIDEEFFECT","Side-effect imports are not supported",e[n].line,e[n].column):R("VGPU-WGSL-IMP-DEFAULT","Default imports are not supported",e[n]?.line,e[n]?.column);let i=e[n];if(i?.kind!=="string")throw R("VGPU-WGSL-RES-NOTFOUND","Import path must be a string",i?.line,i?.column);let o=i.text.slice(1,-1);return n++,e[n]?.text===";"&&n++,[{from:o,bindings:r,start:e[t].start,end:e[n-1].end},n]}function $l(e,t){for(t=rn(e,t);e[t]?.text==="@";){let n=rn(e,t+1);if(t=rn(e,n+1),e[t]?.text==="("){let r=0;do e[t]?.text==="("?r++:e[t]?.text===")"&&r--,t++;while(e[t]&&r>0);t=rn(e,t)}}return t}function rn(e,t){for(;e[t]&&Er(e[t]);)t++;return t}function Gl(e,t){let n=t+1;if(e[t]?.text==="var"&&e[n]?.text==="<")for(;e[n]&&e[n].text!==">";)n++;for(;n<e.length;n++)if(e[n].kind==="ident")return e[n].text;throw R("VGPU-WGSL-EXP-NOTDECL","Exported declaration has no name",e[t]?.line,e[t]?.column)}function wr(e,t){if(e?.text!==t)throw R("VGPU-WGSL-IMP-DEFAULT",`Expected ${t}`,e?.line,e?.column)}function Sr(e){if(e?.kind!=="ident")throw R("VGPU-WGSL-IMP-DEFAULT","Expected identifier",e?.line,e?.column);return e.text}function Er(e){return e.kind==="lineComment"||e.kind==="blockComment"}function es(e,t){return t==="uniform"||t==="storage"?"buffer":e.kind==="sampler"?"sampler":e.kind==="texture"?e.textureKind==="texture_external"?"externalTexture":"texture":"unknown"}function ts(e,t,n,r,i){if(e==="buffer")return Ml(t,n,i);if(r.kind==="sampler")return Ul(r);if(r.kind==="texture")return r.textureKind==="texture_external"?{kind:"externalTexture",externalTexture:{}}:r.textureKind.startsWith("texture_storage_")?Bl(r):Ol(r)}function Ml(e,t,n){return{kind:"buffer",buffer:{type:e==="uniform"?"uniform":t==="read"?"read-only-storage":"storage",hasDynamicOffset:!1,minBindingSize:n?.size}}}function Ul(e){return{kind:"sampler",sampler:{type:e.comparison?"comparison":"filtering"}}}function Bl(e){return{kind:"storageTexture",storageTexture:{access:Nl(e.access),format:e.texelFormat??"rgba8unorm",viewDimension:ns(e.dimension)}}}function Ol(e){return{kind:"texture",texture:{sampleType:Vl(e),viewDimension:ns(e.dimension),multisampled:e.dimension==="multisampled_2d"||e.dimension==="depth_multisampled_2d"}}}function Vl(e){if(e.textureKind.startsWith("texture_depth_"))return"depth";let t=e.sampleType;return t?.kind==="scalar"&&t.name==="i32"?"sint":t?.kind==="scalar"&&t.name==="u32"?"uint":"unfilterable-float"}function ns(e){switch(e){case"1d":return"1d";case"2d_array":case"depth_2d_array":return"2d-array";case"cube":case"depth_cube":return"cube";case"cube_array":case"depth_cube_array":return"cube-array";case"3d":return"3d";default:return"2d"}}function Nl(e){return e==="read"?"read-only":e==="read_write"?"read-write":"write-only"}var zl=new Set(["array","atomic","bool","f16","f32","i32","mat2x2","mat2x3","mat2x4","mat3x2","mat3x3","mat3x4","mat4x2","mat4x3","mat4x4","ptr","sampler","sampler_comparison","texture_1d","texture_2d","texture_2d_array","texture_3d","texture_cube","texture_cube_array","texture_depth_2d","texture_depth_2d_array","texture_depth_cube","texture_depth_cube_array","texture_depth_multisampled_2d","texture_external","texture_multisampled_2d","texture_storage_1d","texture_storage_2d","texture_storage_2d_array","texture_storage_3d","u32","vec2","vec2f","vec2h","vec2i","vec2u","vec3","vec3f","vec3h","vec3i","vec3u","vec4","vec4f","vec4h","vec4i","vec4u"]),Wl=new Set(["abs","acos","acosh","all","any","arrayLength","asin","asinh","atan","atan2","atanh","ceil","clamp","cos","cosh","countLeadingZeros","countOneBits","countTrailingZeros","cross","degrees","determinant","distance","dot","dot4I8Packed","dot4U8Packed","dpdx","dpdxCoarse","dpdxFine","dpdy","dpdyCoarse","dpdyFine","exp","exp2","extractBits","faceForward","firstLeadingBit","firstTrailingBit","floor","fma","fract","frexp","fwidth","fwidthCoarse","fwidthFine","insertBits","inverseSqrt","ldexp","length","log","log2","max","min","mix","modf","normalize","pack2x16float","pack2x16snorm","pack2x16unorm","pack4x8snorm","pack4x8unorm","pack4xI8","pack4xU8","pack4xI8Clamp","pack4xU8Clamp","pow","quantizeToF16","radians","reflect","refract","reverseBits","round","saturate","select","sign","sin","sinh","smoothstep","sqrt","step","storageBarrier","tan","tanh","textureBarrier","textureDimensions","textureGather","textureGatherCompare","textureLoad","textureNumLayers","textureNumLevels","textureNumSamples","textureSample","textureSampleBaseClampToEdge","textureSampleBias","textureSampleCompare","textureSampleCompareLevel","textureSampleGrad","textureSampleLevel","textureStore","transpose","trunc","unpack2x16float","unpack2x16snorm","unpack2x16unorm","unpack4x8snorm","unpack4x8unorm","unpack4xI8","unpack4xU8","workgroupBarrier"]),ql=new Set(["frag_depth","front_facing","global_invocation_id","instance_index","local_invocation_id","local_invocation_index","num_workgroups","position","sample_index","sample_mask","subgroup_invocation_id","subgroup_size","vertex_index","workgroup_id"]),jl=new Set(["align","binding","blend_src","builtin","compute","diagnostic","fragment","group","id","interpolate","invariant","location","must_use","size","vertex","workgroup_size"]),Hl=new Set(["function","private","storage","uniform","workgroup"]),Kl=new Set(["read","read_write","write"]),Yl=new Set(["bgra8unorm","r32float","r32sint","r32uint","rg32float","rg32sint","rg32uint","rgba16float","rgba16sint","rgba16uint","rgba32float","rgba32sint","rgba32uint","rgba8sint","rgba8snorm","rgba8uint","rgba8unorm"]),vh=new Set([...mt,...Hn,...Kn,...zl,...Wl,...ql,...jl,...Hl,...Kl,...Yl]);var Xl="VGPU-WGSL-IDENT-NONASCII",Ql="https://github.com/vercel-labs/vgpu/issues/294";function is(e,t){let n=[],r=0,i=1,o=1,s=(c,l,u,d,f)=>n.push({kind:c,text:e.slice(l,u),start:l,end:u,line:d,column:f}),a=()=>{e[r]===`
`?(i++,o=1):o++,r++};for(;r<e.length;){let c=e[r];if(/\s/.test(c)){a();continue}let l=r,u=i,d=o;if(c==="/"&&e[r+1]==="/"){for(;r<e.length&&e[r]!==`
`;)a();s("lineComment",l,r,u,d);continue}if(c==="/"&&e[r+1]==="*"){let f=0;for(;r<e.length;){if(e[r]==="/"&&e[r+1]==="*"){f++,a(),a();continue}if(e[r]==="*"&&e[r+1]==="/"){if(f--,a(),a(),f===0){s("blockComment",l,r,u,d);break}continue}a()}if(f!==0)throw R("VGPU-WGSL-LEX-UNTERM-COMMENT","Unterminated block comment",u,d);continue}if(c==='"'||c==="'"){let f=c;for(a();r<e.length&&e[r]!==f;){if(e[r]===`
`)throw R("VGPU-WGSL-LEX-UNTERM-STRING","Unterminated string",u,d);e[r]==="\\"&&a(),a()}if(r>=e.length)throw R("VGPU-WGSL-LEX-UNTERM-STRING","Unterminated string",u,d);a(),s("string",l,r,u,d);continue}if(/[A-Za-z_]/.test(c)){for(;r<e.length&&/[A-Za-z0-9_]/.test(e[r]);)a();let f=e.slice(l,r);s(mt.has(f)?"keyword":"ident",l,r,u,d);continue}if(/[0-9]/.test(c)||c==="."&&/[0-9]/.test(e[r+1]??"")){for(c==="."&&a();r<e.length;){let f=e[r];if(/[A-Za-z0-9_.]/.test(f)){a();continue}if((f==="+"||f==="-")&&Jl(e[r-1])&&/[0-9]/.test(e[r+1]??"")){a();continue}break}s("number",l,r,u,d);continue}if(c.charCodeAt(0)>127)throw Zl(e,r,i,o,t);a(),s("punct",l,r,u,d)}return n}function Zl(e,t,n,r,i){let o=t;for(;o>0&&rs(e[o-1]);)o--;let s=t+1;for(;s<e.length&&rs(e[s]);)s++;let a=e.slice(o,s),c=r-(t-o),l=i===void 0?"":` in ${i}`,u=Zo(Xl,`Non-ASCII identifier '${a}'${l} at line ${n} column ${c}; vgpu's WGSL pipeline supports ASCII identifiers only`,{fix:`Rename '${a}' using ASCII letters, digits and '_'. Unicode (XID) identifiers are tracked in ${Ql}`,line:n,column:c});return u.range={file:i,start:{line:n,column:c}},u}function rs(e){return e.charCodeAt(0)>127||/[A-Za-z0-9_]/.test(e)}function Jl(e){return e==="e"||e==="E"||e==="p"||e==="P"}var K=(1n<<64n)-1n,Oe=11400714785074694791n,Pt=14029467366897019727n,os=1609587929392839161n,as=9650029242287828579n,ss=2870177450012600261n;function cs(e,t=0n){let n=new TextEncoder().encode(e),r=0,i;if(n.length>=32){let o=t+Oe+Pt,s=t+Pt,a=t,c=t-Oe,l=n.length-32;do o=Ze(o,kt(n,r)),r+=8,s=Ze(s,kt(n,r)),r+=8,a=Ze(a,kt(n,r)),r+=8,c=Ze(c,kt(n,r)),r+=8;while(r<=l);i=Ee(o,1n)+Ee(s,7n)+Ee(a,12n)+Ee(c,18n),i=on(i,o),i=on(i,s),i=on(i,a),i=on(i,c)}else i=t+ss;for(i=i+BigInt(n.length)&K;r+8<=n.length;)i^=Ze(0n,kt(n,r)),i=Ee(i,27n)*Oe+as&K,r+=8;for(r+4<=n.length&&(i^=eu(n,r)*Oe&K,i=Ee(i,23n)*Pt+os&K,r+=4);r<n.length;)i^=BigInt(n[r])*ss&K,i=Ee(i,11n)*Oe&K,r++;return i^=i>>33n,i=i*Pt&K,i^=i>>29n,i=i*os&K,i^=i>>32n,i.toString(16).padStart(16,"0")}function Ze(e,t){return Ee(e+t*Pt&K,31n)*Oe&K}function on(e,t){return e^=Ze(0n,t),e*Oe+as&K}function Ee(e,t){return(e<<t|e>>64n-t)&K}function kt(e,t){let n=0n;for(let r=7;r>=0;r--)n=(n<<8n)+BigInt(e[t+r]);return n}function eu(e,t){return BigInt(e[t])|BigInt(e[t+1])<<8n|BigInt(e[t+2])<<16n|BigInt(e[t+3])<<24n}function tu(e){return cs(e)}function nu(e){return tu(e).slice(0,8)}function ls(e,t){return`_vgsl_${nu(e)}__${t}`}function O(e,t){let n=e.find(o=>o.name===t);if(!n)return;let r=n.args.map(o=>o.text).join(""),i=Number(r.replace(/[ui]$/,""));return Number.isFinite(i)?i:void 0}function Je(e){let t=[[]],n=0,r=0;for(let i of e){if(i.text==="<"?n++:i.text===">"?n=Math.max(0,n-1):i.text==="("?r++:i.text===")"&&(r=Math.max(0,r-1)),i.text===","&&n===0&&r===0){t.push([]);continue}t[t.length-1].push(i)}return t.map(kr).filter(i=>i.length>0)}function kr(e){let t=0,n=e.length;for(;t<n&&e[t].text===",";)t++;for(;n>t&&e[n-1].text===",";)n--;return e.slice(t,n)}function us(e){if(e!==void 0&&Pr(e))return Number(e.replace(/[ui]$/,""))}function Pr(e){return/^(0|[1-9][0-9]*)([ui])?$/.test(e)}function sn(e){if(e==="read"||e==="write"||e==="read_write")return e}function ds(e){return["f32","f16","i32","u32","bool"].find(t=>t===e)}function fs(e){return{kind:"scalar",name:e==="f"?"f32":e==="h"?"f16":e==="i"?"i32":"u32"}}function Ir(e){return e==="f16"?2:4}function ke(e,t){return Math.ceil(t/e)*e}function X(e){let t=kr(e);if(t.length===0)throw R("VGPU-WGSL-REFLECT-TYPE","Expected WGSL type");let n=t.map(o=>o.text).join(""),r=ru(n);if(r)return r;if(t[1]?.text==="<"){let o=t[0].text,s=Je(t.slice(2,-1)),a=iu(o,s);if(a)return a}let i=ou(n);return i||su(n)}function ru(e){let t=ds(e);if(t)return{kind:"scalar",name:t};let n=e.match(/^vec([234])([fiuh])$/);if(n)return{kind:"vector",width:Number(n[1]),element:fs(n[2])};let r=e.match(/^mat([234])x([234])([fh])$/);if(r){let i=r[3]==="h"?{kind:"scalar",name:"f16"}:{kind:"scalar",name:"f32"};return{kind:"matrix",columns:Number(r[1]),rows:Number(r[2]),element:i}}}function iu(e,t){if(e==="array"){let n=t[1]?.map(i=>i.text).join(""),r=n===void 0?void 0:us(n);return{kind:"array",element:X(t[0]??[]),count:r,countExpression:n}}if(e==="atomic")return{kind:"atomic",element:X(t[0]??[])};if(e==="vec2"||e==="vec3"||e==="vec4")return{kind:"vector",width:Number(e.slice(3)),element:X(t[0]??[])};if(/^mat[234]x[234]$/.test(e))return{kind:"matrix",columns:Number(e[3]),rows:Number(e[5]),element:X(t[0]??[])};if(e==="ptr")return{kind:"ptr",addressSpace:t[0]?.map(n=>n.text).join("")??"",element:X(t[1]??[]),access:t[2]?.map(n=>n.text).join("")};if(e==="sampler")return{kind:"sampler",comparison:!1};if(e.startsWith("texture_storage_"))return{kind:"texture",textureKind:e,dimension:e.slice(16),texelFormat:t[0]?.map(n=>n.text).join(""),access:sn(t[1]?.map(n=>n.text).join(""))};if(e.startsWith("texture_"))return{kind:"texture",textureKind:e,dimension:e.slice(8),sampleType:t[0]?X(t[0]):void 0}}function ou(e){if(e==="sampler"||e==="sampler_comparison")return{kind:"sampler",comparison:e==="sampler_comparison"};if(e==="texture_external")return{kind:"texture",textureKind:e};if(e.startsWith("texture_depth_"))return{kind:"texture",textureKind:e,dimension:e.slice(8)};if(e.startsWith("texture_"))return{kind:"texture",textureKind:e,dimension:e.slice(8)}}function su(e){return{kind:"identifier",name:e}}function me(e){if(e?.kind!=="ident"&&e?.kind!=="keyword")throw R("VGPU-WGSL-REFLECT-PARSE","Expected identifier",e?.line,e?.column);return e.text}function he(e,t,n){for(let r=t;r<e.length;r++)if(e[r].text===n)return r;throw R("VGPU-WGSL-REFLECT-PARSE",`Expected ${n}`,e[t]?.line,e[t]?.column)}function ps(e,t,n,r){for(let i=t;i<n;i++)if(e[i].text===r)return i}function It(e,t,n){let r=0;for(let i=t;i<e.length;i++)if((e[i].text==="{"||e[i].text==="(")&&r++,(e[i].text==="}"||e[i].text===")")&&(r=Math.max(0,r-1)),r===0&&e[i].text===n)return i;return e.length}function an(e,t){let n=e[t].text,r=n==="("?")":n==="{"?"}":">",i=0;for(let o=t;o<e.length;o++)if(e[o].text===n&&i++,e[o].text===r&&(i--,i===0))return o;throw R("VGPU-WGSL-REFLECT-PARSE",`Unclosed ${n}`,e[t]?.line,e[t]?.column)}function cn(e,t){let n=[],r=t;for(;e[r]?.text==="@";){let i=e[r],o=me(e[r+1]);r+=2;let s=[];if(e[r]?.text==="("){let a=an(e,r);s=e.slice(r+1,a),r=a+1}n.push({name:o,args:s,token:i})}return[n,r]}function Ve(e){switch(e.kind){case"scalar":return e.name;case"identifier":return e.name;case"vector":return`vec${e.width}<${Ve(e.element)}>`;case"matrix":return`mat${e.columns}x${e.rows}<${Ve(e.element)}>`;case"array":return`array<${Ve(e.element)}${e.count===void 0?"":`,${e.count}`}>`;default:return e.kind}}function ms(e){let t=e.find(r=>r.name==="workgroup_size");if(!t)return;let n=Je(t.args).map(r=>Number(r.map(i=>i.text).join("")));return[n[0]??1,n[1]??1,n[2]??1]}function hs(e,t){if(e[t]?.text!=="<")return{after:t};let n=he(e,t,">"),r=Je(e.slice(t+1,n)).map(i=>i.map(o=>o.text).join(""));return{addressSpace:r[0],access:sn(r[1]),after:n+1}}function gs(e){let t=[],n=[],r=[],i=[],o=[],s=[],a=e.tokens.filter(u=>u.kind!=="lineComment"&&u.kind!=="blockComment"),c=0,l=0;for(;c<a.length;){let u=a[c];if(u.text==="{"){l++,c++;continue}if(u.text==="}"){l=Math.max(0,l-1),c++;continue}if(l>0){c++;continue}let d=c,[f,m]=cn(a,c);c=m,a[c]?.text==="export"&&c++;let x=a[c]?.text;if(x==="enable"){a[c+1]?.kind==="ident"&&s.push(a[c+1].text),c=It(a,c,";")+1;continue}if(x==="struct"){let g=au(e,a,c,f);g.item&&t.push(g.item),c=g.next;continue}if(x==="alias"){let g=cu(e,a,c,f);g.item&&n.push(g.item),c=g.next;continue}if(x==="var"){let g=lu(e,a,c,f);g.item&&r.push(g.item),c=g.next;continue}if(x==="fn"){let g=uu(e,a,c,f);g.item&&i.push(g.item),c=g.next;continue}if(x==="override"){let g=fu(a,c,f);g.item&&o.push(g.item),c=g.next;continue}c=Math.max(d+1,c+1)}return{structs:t,aliases:n,vars:r,entries:i,overrides:o,features:s}}function au(e,t,n,r){let i=me(t[n+1]),o=he(t,n+2,"{"),s=an(t,o);return{item:{name:i,originalName:i,mangledName:Rr(e,i,"struct"),members:pu(t.slice(o+1,s)),path:e.path},next:s+1}}function cu(e,t,n,r){let i=me(t[n+1]),o=he(t,n+2,"="),s=It(t,o+1,";");return{item:{name:i,originalName:i,mangledName:Rr(e,i,"alias"),target:X(t.slice(o+1,s)),path:e.path},next:s+1}}function lu(e,t,n,r){let{addressSpace:i,access:o,after:s}=hs(t,n+1),a=me(t[s]),c=he(t,s+1,":"),l=It(t,c+1,";");return{item:{path:e.path,name:a,mangledName:mu(r)?a:Rr(e,a,"var"),attrs:r,addressSpace:i,access:o,type:X(t.slice(c+1,l))},next:l+1}}function uu(e,t,n,r){let i=me(t[n+1]),o=r.find(c=>c.name==="vertex"||c.name==="fragment"||c.name==="compute")?.name;if(!o)return{item:void 0,next:n+1};let s=he(t,n+2,"("),a=an(t,s);return{item:{name:i,mangledName:i,stage:o,workgroupSize:ms(r),path:e.path,params:du(t.slice(s+1,a))},next:a+1}}function du(e){let t=[],n=0;for(;n<e.length;){let[r,i]=cn(e,n);if(n=i,!e[n]||e[n].text===","){n++;continue}let o=me(e[n]),s=he(e,n+1,":"),a=s+1,c=0;for(;a<e.length&&(e[a].text==="<"&&c++,e[a].text===">"&&(c=Math.max(0,c-1)),!(c===0&&e[a].text===","));)a++;t.push({name:o,attrs:r,type:X(e.slice(s+1,a))}),n=a+1}return t}function fu(e,t,n){let r=me(e[t+1]),i=It(e,t+1,";"),o=ps(e,t+2,i,"=");return{item:{name:r,mangledName:r,id:O(n,"id"),defaultValue:o===void 0?void 0:e.slice(o+1,i).map(s=>s.text).join("")},next:i+1}}function pu(e){let t=[],n=0;for(;n<e.length;){let[r,i]=cn(e,n);if(n=i,!e[n]||e[n].text===","||e[n].text===";"){n++;continue}let o=me(e[n]),s=he(e,n+1,":"),a=s+1,c=0;for(;a<e.length&&(e[a].text==="<"&&c++,e[a].text===">"&&(c=Math.max(0,c-1)),!(c===0&&(e[a].text===","||e[a].text===";")));)a++;t.push({name:o,attrs:r,type:X(e.slice(s+1,a)),align:O(r,"align"),size:O(r,"size")}),n=a+1}return t}function Rr(e,t,n){return n==="override"?t:ls(e.path,t)}function mu(e){return O(e,"group")!==void 0||O(e,"binding")!==void 0}var hu="literal length required for auto layout; use draw.group(n, bg) manual binding",gu="VGPUError: `bool` is not host-shareable in uniform/storage. Fix: use `u32` (0 | 1) \u2192 struct Params { enabled: u32 }",xs="use a manual group claim (`draw.group(n, bg)`)";function bs(e=1,t=1){return R("VGPU-WGSL-REFLECT-ARRAY-LENGTH",hu,e,t)}function Ar(e=1,t=1){return R("VGPU-WGSL-REFLECT-BOOL-HOST-SHAREABLE",gu,e,t)}function et(e,t,n=1,r=1){return R("VGPU-WGSL-REFLECT-UNKNOWN-TYPE",`type '${e}' is unknown in ${t}; ${xs}`,n,r)}function Cr(e,t,n=1,r=1){return R("VGPU-WGSL-REFLECT-NS-TYPE",`type '${e}' is a namespace-member import; use a named import or manual @group(1+) binding`,n,r)}function Tr(e,t=1,n=1){return R("VGPU-WGSL-REFLECT-NON-HOST-SHAREABLE",`Type ${e} is not host-shareable; ${xs}`,t,n)}var Ne="naga-standard";function ys(e,t,n){let r=new Map;for(let s of t){let a=new Map;for(let c of[...s.structs,...s.aliases])a.set(c.originalName,{path:c.path,name:c.originalName,mangledName:c.mangledName,kind:"members"in c?"struct":"alias"});r.set(s.structs[0]?.path??s.aliases[0]?.path??s.vars[0]?.path??"",a)}let i=new Map(e.map(s=>[s.path,r.get(s.path)??new Map])),o=new Map;for(let s of e){let a=new Map(i.get(s.path));for(let c of s.parsed.imports)xu(s,c,a,e,i,n);o.set(s.path,a)}return o}function xu(e,t,n,r,i,o){let s=bu(t,e.path,r,o),a=i.get(s);for(let c of t.bindings){if(c.namespace){n.set(c.local,{path:s,name:c.local,mangledName:c.local,kind:"namespace"});continue}let l=a?.get(c.imported);l&&n.set(c.local,l)}}function _s(e,t){let n=new Map,r=new Map,i=new Map,o={structs:n,aliases:r,byMangled:i};for(let s of e){for(let a of s.structs){let c={name:a.name,mangledName:a.mangledName,members:a.members.map(l=>({name:l.name,type:Pe(l.type,a.path,t,o),align:l.align,size:l.size}))};n.set(a.mangledName,c),i.set(a.mangledName,c)}for(let a of s.aliases){let c={name:a.name,mangledName:a.mangledName,target:Pe(a.target,a.path,t,o)};r.set(a.mangledName,c),i.set(a.mangledName,c)}}return{structs:n,aliases:r,byMangled:i}}function Pe(e,t,n,r){switch(e.kind){case"identifier":{let i=e.name.indexOf(".");if(i>0){let s=e.name.slice(0,i);if(n.get(t)?.get(s)?.kind==="namespace")throw Cr(e.name,t)}let o=n.get(t)?.get(e.name);if(o?.kind==="namespace")throw Cr(e.name,t);if(!o)throw et(e.name,t);return{kind:"identifier",name:o.name,mangledName:o.mangledName}}case"array":case"atomic":case"vector":case"matrix":case"ptr":return{...e,element:Pe(e.element,t,n,r)};case"texture":return{...e,sampleType:e.sampleType?Pe(e.sampleType,t,n,r):void 0};default:return e}}function Ie(e,t){if(!t||e.kind!=="identifier")return e;let n=t.aliases.get(e.mangledName??e.name);return n?Ie(n.target,t):e}function ln(e,t){let n=Ie(e,t);switch(n.kind){case"array":case"atomic":case"vector":case"matrix":case"ptr":return{...n,element:ln(n.element,t)};case"texture":return{...n,sampleType:n.sampleType?ln(n.sampleType,t):void 0};default:return n}}function bu(e,t,n,r){let i=yu(e,t,r);if(i!==void 0&&n.some(l=>l.path===i))return i;let o=e.from,s=t.slice(0,t.lastIndexOf("/")+1),a=o.startsWith("/")?o:_u(`${s}${o}`);return[o,a].find(l=>n.some(u=>u.path===l))??i??a}function yu(e,t,n){if(n)try{return n(t,e)}catch{return}}function _u(e){let t=e.startsWith("/"),n=[];for(let r of e.split("/"))!r||r==="."||(r===".."?n.pop():n.push(r));return`${t?"/":""}${n.join("/")}`}function tt(e,t,n=Ve(e),r=n,i){let o=i?ln(e,i):e;return vu(o,t,n,r,i)}function vu(e,t,n,r,i){switch(e.kind){case"scalar":return wu(e,t,n,r);case"atomic":return Su(e,t,n,r);case"vector":return Eu(e,t,n,r,i);case"matrix":return ku(e,t,n,r,i);case"array":return Pu(e,t,n,r,i);case"identifier":return Ru(e,t,n,r,i);default:throw Tr(Ve(e))}}function wu(e,t,n,r){let i=Ir(e.name);if(e.name==="bool")throw Ar();return{name:n,mangledName:r,addressSpace:t,layoutMode:Ne,type:e,align:i,size:i}}function Su(e,t,n,r){return{name:n,mangledName:r,addressSpace:t,layoutMode:Ne,type:e,align:4,size:4}}function Eu(e,t,n,r,i){let s=tt(e.element,t,n,r,i).size??4,a=e.width===2?s*2:s*4;return{name:n,mangledName:r,addressSpace:t,layoutMode:Ne,type:e,align:a,size:s*e.width}}function ku(e,t,n,r,i){let o={kind:"vector",width:e.rows,element:e.element},s=tt(o,t,`${n}[]`,`${r}[]`,i),a=ke(s.align,s.size??0);return{name:n,mangledName:r,addressSpace:t,layoutMode:Ne,type:e,align:s.align,size:a*e.columns,stride:a,element:s}}function Pu(e,t,n,r,i){Iu(e.countExpression);let o=tt(e.element,t,`${n}[]`,`${r}[]`,i),s=ke(Rt(e.element,t,i),o.size??0);return{name:n,mangledName:r,addressSpace:t,layoutMode:Ne,type:e,align:Rt(e,t,i),size:e.count===void 0?void 0:s*e.count,stride:s,element:o,runtimeSized:e.count===void 0}}function Iu(e){if(e!==void 0&&!Pr(e))throw bs()}function Ru(e,t,n,r,i){if(!i)throw et(e.name,"<unknown>");let o=i.structs.get(e.mangledName??e.name);if(!o)throw et(e.name,"<unknown>");let s=[],a=0,c=1;for(let u of o.members){let d=Au(u,t,a,i);s.push(d.member),a=Cu(t,u.type,d.offset,d.member.size??0,i),c=Math.max(c,d.member.align)}let l=Fu(t,c);return{name:n,mangledName:r,addressSpace:t,layoutMode:Ne,type:e,align:l,size:ke(l,a),members:s}}function Au(e,t,n,r){let i=tt(e.type,t,e.name,e.name,r),o=Math.max(Rt(e.type,t,r),e.align??1),s=Math.max(i.size??0,e.size??0),a=ke(o,n);return{member:{name:e.name,offset:a,align:o,size:s,type:e.type,layout:i,explicitAlign:e.align,explicitSize:e.size},offset:a}}function Cu(e,t,n,r,i){return n+(e==="uniform"&&Tu(t,i)?ke(16,r):r)}function Tu(e,t){let n=Ie(e,t);return n.kind==="identifier"&&t.structs.has(n.mangledName??n.name)}function Fu(e,t){return e==="uniform"?ke(16,t):t}function Rt(e,t,n){let r=n?Ie(e,n):e,i=un(r,t,n);return t==="uniform"&&Lu(r,n)?ke(16,i):i}function Lu(e,t){return e.kind==="array"||e.kind==="identifier"&&!!t?.structs.get(e.mangledName??e.name)}function un(e,t,n){let r=n?Ie(e,n):e;switch(r.kind){case"scalar":return Du(r.name);case"atomic":return 4;case"vector":return r.width===2?un(r.element,t,n)*2:un(r.element,t,n)*4;case"matrix":return un({kind:"vector",width:r.rows,element:r.element},t,n);case"array":return Rt(r.element,t,n);case"identifier":return $u(r,t,n);default:throw Tr(Ve(r))}}function Du(e){if(e==="bool")throw Ar();return Ir(e)}function $u(e,t,n){let r=n?.structs.get(e.mangledName??e.name);if(!r)throw et(e.name,"<unknown>");return Math.max(1,...r.members.map(i=>Math.max(Rt(i.type,t,n),i.align??1)))}var Gu=/^_vgsl_[0-9a-f]{8,16}__[A-Za-z_][A-Za-z0-9_]*$/,Mu=new Set(["fn","struct","const","alias","var","override"]);function dn(e){return new Fr(e).analyze()}var Fr=class{tokens;scopes=[];declarations=[];references=[];functions=[];preserved=new Map;symbolsByScope=new Map;moduleFallbackReasons=[];pendingSymbols=[];moduleScopeId;constructor(t){this.tokens=t,this.moduleScopeId=this.createScope("module",void 0,void 0,0)}analyze(){this.collectTopLevel();for(let t of this.functions)this.walkFunction(t);return{tokens:this.tokens,scopes:this.scopes,declarations:this.declarations,references:this.references,functions:this.functions,preservedTokens:[...this.preserved.entries()].map(([t,n])=>({tokenIndex:t,reason:n})),fallback:{wholeModule:this.moduleFallbackReasons.length>0,reasons:this.moduleFallbackReasons}}}collectTopLevel(){let t=0;for(let n=0;n<this.tokens.length;n++){let r=this.tokens[n];if(!ge(r)){if(r.text==="{"){t++;continue}if(r.text==="}"){t--,t<0&&(this.moduleFallback("unmatched top-level closing brace",n),t=0);continue}if(t===0){if(r.text==="@"){n=this.preserveAttribute(n);continue}if(r.text==="enable"||r.text==="requires"||r.text==="diagnostic"||r.text==="const_assert"){n=this.preserveStatement(n,"directive");continue}if(r.text!=="export"){if(r.text==="struct"){n=this.collectStruct(n);continue}if(r.text==="fn"){n=this.collectFunction(n);continue}if(r.text==="const"||r.text==="alias"||r.text==="var"||r.text==="override"){n=this.preserveGlobalDeclaration(n);continue}r.kind==="keyword"&&!Mu.has(r.text)&&this.moduleFallback(`unexpected top-level keyword '${r.text}'`,n)}}}}t!==0&&this.moduleFallback("unclosed top-level brace",this.tokens.length-1),this.scopes[this.moduleScopeId].endToken=Math.max(0,this.tokens.length-1)}collectStruct(t){let n=this.nextSig(t);if(n===void 0||this.tokens[n]?.kind!=="ident")return this.moduleFallback("struct without name",t),t;this.preserveToken(n,"global");let r=this.nextSig(n);if(r===void 0||this.tokens[r]?.text!=="{")return this.moduleFallback("struct without body",t),n;let i=this.findMatching(r,"{","}");if(i===void 0)return this.moduleFallback("unclosed struct body",r),r;for(let o=r;o<=i;o++)this.tokens[o]?.kind==="ident"&&this.preserveToken(o,"struct");return i}collectFunction(t){let n=this.nextSig(t);if(n===void 0||this.tokens[n]?.kind!=="ident")return this.moduleFallback("function without name",t),t;let r=this.tokens[n].text,i=Gu.test(r)&&!this.hasEntryAttributeBefore(t),o=this.addDeclaration(r,"function",n,this.moduleScopeId,void 0,i);i||this.preserveToken(n,"global");let s=this.nextSig(n);if(s===void 0||this.tokens[s]?.text!=="(")return this.moduleFallback("function without parameter list",n),n;let a=this.findMatching(s,"(",")");if(a===void 0)return this.moduleFallback("unclosed function parameter list",s),s;let c=this.findNextText(a+1,"{");if(c===void 0)return this.moduleFallback("function without body",a),a;this.preserveFunctionSignatureTail(a+1,c);let l=this.findMatching(c,"{","}");if(l===void 0)return this.moduleFallback("unclosed function body",c),c;let u=this.createScope("function",this.moduleScopeId,this.functions.length,s);return this.functions.push({id:this.functions.length,name:r,nameTokenIndex:n,scopeId:u,bodyStartToken:c,bodyEndToken:l,skipped:!1,fallbackReasons:[]}),this.collectParams(s,a,u,this.functions.length-1),this.scopes[u].endToken=l,l}collectParams(t,n,r,i){for(let o=t+1;o<n;o++){let s=this.tokens[o];if(!ge(s)){if(s.text==="@"){o=this.preserveAttribute(o);continue}if(s.kind==="ident"&&this.nextSig(o)!==void 0&&this.tokens[this.nextSig(o)]?.text===":"){this.addDeclaration(s.text,"param",o,r,i,!0);let a=this.nextSig(o);o=this.preserveTypeFrom(a+1,[",",")"],n)}}}}preserveFunctionSignatureTail(t,n){for(let r=t;r<n;r++){let i=this.tokens[r];if(!ge(i)){if(i.text==="@"){r=this.preserveAttribute(r);continue}i.kind==="ident"&&this.preserveToken(r,"type")}}}preserveGlobalDeclaration(t){let n=t+1;if(this.tokens[t]?.text==="var"){let o=this.nextSig(t);if(o!==void 0&&this.tokens[o]?.text==="<"){let s=this.findMatching(o,"<",">");if(s===void 0)return this.moduleFallback("unparseable top-level var template",o),o;this.preserveRange(o,s,"type"),n=s+1}}let r=this.findNextIdent(n);r!==void 0&&(this.preserveToken(r,"global"),this.addDeclaration(this.tokens[r].text,"global",r,this.moduleScopeId,void 0,!1));let i=this.findStatementEnd(t);for(let o=t;o<=i;o++)this.tokens[o]?.kind==="ident"&&this.preserveToken(o,"global");return i}walkFunction(t){let n=[this.moduleScopeId,t.scopeId],r=[],i=(a,c)=>{let l=this.createScope(a,n[n.length-1],t.id,c);return n.push(l),l},o=a=>{if(n.length<=2){this.functionFallback(t,"scope frame underflow",a);return}let c=n.pop();return this.scopes[c].endToken=a,c};i("block",t.bodyStartToken);let s=1;for(let a=t.bodyStartToken+1;a<t.bodyEndToken;a++){this.activatePendingSymbols(a);let c=this.tokens[a];if(ge(c))continue;if(c.text==="@"){a=this.preserveAttribute(a);continue}if(c.text==="."){let u=this.nextSig(a);u!==void 0&&this.tokens[u]?.kind==="ident"&&this.preserveToken(u,"member");continue}if(c.text==="enable"||c.text==="requires"||c.text==="diagnostic"){a=this.preserveStatement(a,"directive");continue}if(c.text==="for"){let u=i("for-init",a),d=this.nextSig(a);(d===void 0||this.tokens[d]?.text!=="(")&&this.functionFallback(t,"for without parenthesized header",a),r.push({scopeId:u,headerDepth:0,awaitingBody:!1});continue}let l=r[r.length-1];if(l&&l.bodyDepth===void 0&&(c.text==="("&&l.headerDepth++,c.text===")"&&(l.headerDepth--,l.headerDepth<=0&&(l.awaitingBody=!0))),c.text==="{"){s++;let u=Uu(r,d=>d.awaitingBody&&d.bodyDepth===void 0);u&&(u.bodyDepth=s),i("block",a);continue}if(c.text==="}"){let u=s;for(o(a),s--;r.length>0&&r[r.length-1].bodyDepth===u;)o(a),r.pop();s<0&&this.functionFallback(t,"unmatched closing brace",a);continue}if(c.text===":"){a=this.preserveTypeFrom(a+1,["=",";",",",")","{"],t.bodyEndToken);continue}if(c.text==="-"&&this.tokens[this.nextSig(a)??-1]?.text===">"){a=this.preserveTypeFrom((this.nextSig(a)??a)+1,["{"],t.bodyEndToken);continue}if(c.text==="let"||c.text==="const"||c.text==="var"){a=this.collectLocalDeclaration(a,n[n.length-1],t);continue}if(c.kind==="ident"&&!this.preserved.has(a)){let u=this.resolve(c.text,n);u!==void 0?this.references.push({name:c.text,tokenIndex:a,declarationId:u,scopeId:n[n.length-1],functionId:t.id}):this.preserveToken(a,"unknown")}}for(;n.length>2;)o(t.bodyEndToken)}collectLocalDeclaration(t,n,r){let i=this.tokens[t].text,o=t+1;if(i==="var"){let c=this.nextSig(t);if(c!==void 0&&this.tokens[c]?.text==="<"){let l=this.findMatching(c,"<",">");if(l===void 0)return this.functionFallback(r,"unparseable var template",c),c;this.preserveRange(c,l,"type"),o=l+1}}let s=this.findNextIdent(o);if(s===void 0||s>=r.bodyEndToken)return this.functionFallback(r,`${i} without identifier`,t),t;this.addDeclaration(this.tokens[s].text,i,s,n,r.id,!0,this.findStatementEnd(t));let a=this.nextSig(s);return a!==void 0&&this.tokens[a]?.text===":"?this.preserveTypeFrom(a+1,["=",";",",",")"],r.bodyEndToken):s}addDeclaration(t,n,r,i,o,s,a){let c=this.declarations.length;return this.declarations.push({id:c,name:t,kind:n,tokenIndex:r,scopeId:i,functionId:o,safeToRename:s}),a!==void 0?this.pendingSymbols.push({name:t,id:c,scopeId:i,activateAfter:a}):this.activateSymbol(t,c,i),c}activatePendingSymbols(t){for(let n=this.pendingSymbols.length-1;n>=0;n--){let r=this.pendingSymbols[n];r.activateAfter>=t||(this.activateSymbol(r.name,r.id,r.scopeId),this.pendingSymbols.splice(n,1))}}activateSymbol(t,n,r){let i=this.symbolsByScope.get(r);i||(i=new Map,this.symbolsByScope.set(r,i)),i.has(t)||i.set(t,n)}resolve(t,n){for(let r=n.length-1;r>=0;r--){let i=this.symbolsByScope.get(n[r])?.get(t);if(i!==void 0)return i}}preserveAttribute(t){this.preserveToken(t,"attribute");let n=this.nextSig(t);if(n===void 0)return t;this.preserveToken(n,"attribute");let r=this.nextSig(n);if(r===void 0||this.tokens[r]?.text!=="(")return n;let i=this.findMatching(r,"(",")");return i===void 0?(this.preserveRange(r,r,"attribute"),r):(this.preserveRange(r,i,"attribute"),i)}preserveTypeFrom(t,n,r){let i=0,o=0,s=0,a=t-1;for(let c=t;c<r;c++){let l=this.tokens[c];if(!ge(l)){if(i===0&&o===0&&s===0&&n.includes(l.text))return Math.max(t-1,c-1);if(l.text==="<")i++;else if(l.text===">")i=Math.max(0,i-1);else if(l.text==="(")o++;else if(l.text===")"){if(o===0&&n.includes(")"))return Math.max(t-1,c-1);o=Math.max(0,o-1)}else l.text==="["?s++:l.text==="]"&&(s=Math.max(0,s-1));l.kind==="ident"&&this.preserveToken(c,"type"),a=c}}return a}preserveStatement(t,n){let r=this.findStatementEnd(t);return this.preserveRange(t,r,n),r}preserveRange(t,n,r){for(let i=t;i<=n;i++)this.tokens[i]&&this.tokens[i].kind!=="lineComment"&&this.tokens[i].kind!=="blockComment"&&this.preserveToken(i,r)}preserveToken(t,n){this.preserved.has(t)||this.preserved.set(t,n)}createScope(t,n,r,i){let o=this.scopes.length;return this.scopes.push({id:o,kind:t,parentId:n,functionId:r,startToken:i}),o}nextSig(t){for(let n=t+1;n<this.tokens.length;n++)if(!ge(this.tokens[n]))return n}findNextIdent(t){for(let n=t;n<this.tokens.length;n++){let r=this.tokens[n];if(!ge(r)){if(r.kind==="ident")return n;if(r.text!=="@")return}}}findNextText(t,n){for(let r=t;r<this.tokens.length;r++)if(!ge(this.tokens[r])&&this.tokens[r].text===n)return r}findStatementEnd(t){let n=0;for(let r=t;r<this.tokens.length;r++){let i=this.tokens[r].text;if(i==="(")n++;else if(i===")")n=Math.max(0,n-1);else if(n===0&&(i===";"||i==="{"||i==="}"))return r}return this.tokens.length-1}findMatching(t,n,r){let i=0;for(let o=t;o<this.tokens.length;o++){let s=this.tokens[o].text;if(s===n&&i++,s===r&&(i--,i===0))return o}}hasEntryAttributeBefore(t){for(let n=t-1;n>=0;n--){let r=this.tokens[n];if(!ge(r)){if(r.text===")"||r.kind==="ident"||r.text==="@"){let i=r.text;if(i==="compute"||i==="vertex"||i==="fragment")return!0;continue}break}}return!1}moduleFallback(t,n){this.moduleFallbackReasons.push(`${t} at token ${n}`)}functionFallback(t,n,r){t.skipped=!0,t.fallbackReasons.push(`${n} at token ${r}`)}};function Uu(e,t){for(let n=e.length-1;n>=0;n--)if(t(e[n]))return e[n]}function ge(e){return e.kind==="lineComment"||e.kind==="blockComment"}var Bu=new Set(["textureSample","textureSampleBias","textureSampleLevel","textureSampleGrad","textureGather","textureSampleBaseClampToEdge"]),Ou=new Set(["textureSampleCompare","textureSampleCompareLevel","textureGatherCompare"]);function vs(e,t,n){let r=new Map;for(let i=0;i<e.length;i++){let o=e[i],s=t[i],a=dn(o.tokens),c=new Map;for(let u of s.vars){let d=O(u.attrs,"group"),f=O(u.attrs,"binding"),m=a.declarations.find(x=>x.kind==="global"&&x.name===u.name);d!==void 0&&f!==void 0&&m&&c.set(m.id,{group:d,binding:f})}let l=new Map;for(let u of a.declarations){if(u.kind!=="function")continue;let d=a.functions.find(f=>f.nameTokenIndex===u.tokenIndex);d&&l.set(u.id,d.id)}for(let u of s.entries){let d=a.functions.find(g=>g.name===u.name),f=[],m=a.fallback.wholeModule||!d;!m&&d&&(m=!ws(d.id,new Map,new Set,a,c,l,f));let x=d?qu(d.id,a,c,l):n.map(Lr);r.set(u,m?ju(n,x):Hu(f))}}return r}function ws(e,t,n,r,i,o,s){let a=r.functions[e];if(!a||a.skipped)return!1;let c=`${e}|${[...t].map(([d,f])=>`${d}:${f.group}:${f.binding}`).join(",")}`;if(n.has(c))return!0;n.add(c);let l=r.references.filter(d=>d.functionId===e),u=new Map(l.map(d=>[d.tokenIndex,d]));for(let d=a.bodyStartToken+1;d<a.bodyEndToken;d++){let f=r.tokens[d]?.text,m=Bu.has(f??"")?"filtering":Ou.has(f??"")?"comparison":void 0,x=u.get(d),g=x&&o.get(x.declarationId);if(!m&&g===void 0)continue;let E=Wu(r,d);if(E===void 0||r.tokens[E]?.text!=="(")continue;let k=zu(r,E);if(!k)return!1;let C=k.map(([T,N])=>Vu(T,N,r,i,t));if(m){let T=f==="textureGather"&&!Nu(k[0],r,i,t)?1:0,N=C[T],D=C[T+1];if(!N||!D)return!1;s.push({texture:N,sampler:D,mode:m})}else{let T=r.declarations.filter(D=>D.kind==="param"&&D.functionId===g).sort((D,H)=>D.tokenIndex-H.tokenIndex),N=new Map;for(let D=0;D<T.length;D++)C[D]&&N.set(T[D].id,C[D]);if(!ws(g,N,n,r,i,o,s))return!1}}return!0}function Vu(e,t,n,r,i){for(let o of n.references){if(o.tokenIndex<e||o.tokenIndex>t)continue;let s=r.get(o.declarationId)??i.get(o.declarationId);if(s)return s}}function Nu(e,t,n,r){let i=t.references.find(o=>o.tokenIndex>=e[0]&&o.tokenIndex<=e[1]);return i?.tokenIndex===e[0]?n.get(i.declarationId)??r.get(i.declarationId):void 0}function zu(e,t){let n=[],r=1,i=0,o=0,s=0,a=t+1;for(let c=t+1;c<e.tokens.length;c++){let l=e.tokens[c].text;if(l==="(")r++;else if(l===")"){if(r--,r===0)return n.push([a,c-1]),n}else l==="["?i++:l==="]"?i--:l==="{"?o++:l==="}"?o--:l==="<"?s++:l===">"?s--:l===","&&r===1&&i===0&&o===0&&s===0&&(n.push([a,c-1]),a=c+1)}}function Wu(e,t){for(let n=t+1;n<e.tokens.length;n++)if(e.tokens[n].kind!=="lineComment"&&e.tokens[n].kind!=="blockComment")return n}function qu(e,t,n,r){let i=[e],o=new Set,s=new Map;for(;i.length;){let a=i.pop();if(!o.has(a)){o.add(a);for(let c of t.references){if(c.functionId!==a)continue;let l=n.get(c.declarationId);l&&s.set(`${l.group}:${l.binding}`,l);let u=r.get(c.declarationId);u!==void 0&&i.push(u)}}}return[...s.values()]}function ju(e,t){let n=new Set(t.map(s=>`${s.group}:${s.binding}`)),r=e.filter(s=>n.has(`${s.group}:${s.binding}`)),i=r.filter(s=>s.bindingLayout?.kind==="texture"&&s.bindingLayout.texture.sampleType==="unfilterable-float"&&!s.bindingLayout.texture.multisampled),o=r.filter(s=>s.bindingLayout?.kind==="sampler"&&s.bindingLayout.sampler.type==="filtering");return i.flatMap(s=>o.map(a=>({texture:Lr(s),sampler:Lr(a),mode:"filtering"})))}function Lr(e){return{group:e.group,binding:e.binding}}function Hu(e){let t=new Set;return e.filter(n=>{let r=`${n.texture.group}:${n.texture.binding}:${n.sampler.group}:${n.sampler.binding}:${n.mode}`;return t.has(r)?!1:(t.add(r),!0)})}function Es(e,t){let n=e.map(gs),r=ys(e,n,t),i=_s(n,r),o=[],s=[];for(let l of n)for(let u of l.vars){let d=O(u.attrs,"group"),f=O(u.attrs,"binding");if(d===void 0||f===void 0)continue;let m=Pe(u.type,u.path,r,i),x=es(m,u.addressSpace),g=u.addressSpace==="uniform"||u.addressSpace==="storage"?tt(m,u.addressSpace,u.name,u.mangledName,i):void 0;g&&s.push(g),o.push({group:d,binding:f,name:u.name,mangledName:u.mangledName,type:m,kind:x,addressSpace:u.addressSpace,access:u.access,struct:m.kind==="identifier"?i.structs.get(m.mangledName??m.name):void 0,layout:g,bindingLayout:ts(x,u.addressSpace,u.access,m,g)})}o.sort((l,u)=>l.group-u.group||l.binding-u.binding);let a=Ku(e,n,o),c=vs(e,n,o);return{bindings:o,entryPoints:n.flatMap(l=>l.entries.map(u=>Yu(u,n.flatMap(d=>d.structs),r,i,a.get(u)??o,c.get(u)??[]))),overrides:n.flatMap(l=>l.overrides),featuresRequired:[...new Set(n.flatMap(l=>l.features))],aliases:[...i.aliases.values()],structs:[...i.structs.values()],hostShareableLayouts:s}}function Ku(e,t,n){let r=new Map;for(let i=0;i<e.length;i++){let o=e[i],s=t[i],a=dn(o.tokens),c=a.fallback.wholeModule,l=new Map;for(let d of a.declarations){if(d.kind!=="function")continue;let f=a.functions.find(m=>m.nameTokenIndex===d.tokenIndex);f&&l.set(d.id,f.id)}let u=new Map;for(let d of s.vars){let f=O(d.attrs,"group"),m=O(d.attrs,"binding");if(f===void 0||m===void 0)continue;let x=a.declarations.find(g=>g.kind==="global"&&g.name===d.name);x&&u.set(x.id,{group:f,binding:m})}for(let d of s.entries){let f=a.functions.find(E=>E.name===d.name);if(c||!f){r.set(d,n);continue}let m=[f.id],x=new Set,g=new Map;for(;m.length;){let E=m.pop();if(!x.has(E)&&(x.add(E),!!a.functions[E]))for(let k of a.references){if(k.functionId!==E)continue;let C=u.get(k.declarationId);C&&g.set(`${C.group}:${C.binding}`,C);let T=l.get(k.declarationId);T!==void 0&&m.push(T)}}r.set(d,[...g.values()].sort((E,k)=>E.group-k.group||E.binding-k.binding))}}return r}function Yu(e,t,n,r,i,o){return{name:e.name,mangledName:e.mangledName,stage:e.stage,...e.workgroupSize?{workgroupSize:e.workgroupSize}:{},bindings:i.map(({group:s,binding:a})=>({group:s,binding:a})),samplingPairs:o,...e.stage==="vertex"?{inputs:Xu(e,t,n,r)}:{}}}function Xu(e,t,n,r){let i=[];for(let o of e.params){if(Ss(o.attrs,"builtin"))continue;let s=Pe(o.type,e.path,n,r),a=O(o.attrs,"location");if(a!==void 0){i.push({name:o.name,location:a,type:s});continue}let c=Ie(s,r);if(c.kind!=="identifier")continue;let l=t.find(d=>d.mangledName===(c.mangledName??c.name)),u=r.structs.get(c.mangledName??c.name);if(l)for(let d=0;d<l.members.length;d++){let f=l.members[d];if(Ss(f.attrs,"builtin"))continue;let m=O(f.attrs,"location");m!==void 0&&i.push({name:f.name,location:m,type:u?.members[d]?.type??Pe(f.type,l.path,n,r)})}}return i}function Ss(e,t){return e.some(n=>n.name===t)}function nt(e,t="<runtime>"){let n=is(e,t),r=Jo(n);if(r.imports.length>0)throw R("VGPU-WGSL-REFLECT-SOURCE-IMPORT","reflectSource() accepts a single raw WGSL string; use resolveShader() for WGSL import graphs.");return Es([{path:t,source:e,tokens:n,parsed:r}])}function it(){let e=new Map;return{getOrCreate(t,n,r,i){let o=r.map(rt),s=`${t}:${n}:${o.join("|")}`,a=e.get(s);if(a)return a.bindGroup;let c=i();return e.set(s,{identities:o,bindGroup:c}),c},evictIdentity(t){let n=rt(t);for(let[r,i]of e)i.identities.includes(n)&&e.delete(r)},clearDraw(t){let n=`${t}:`;for(let r of e.keys())r.startsWith(n)&&e.delete(r)},dispose(){e.clear()}}}function rt(e){return typeof e=="string"||typeof e=="number"?String(e):`${e.kind}:${e.id}`}function xe(e,t,n){let r=e[t];if(!r)throw new h({code:"VGPU-REFLECT-ENTRY-METADATA-MISSING",message:`Entry point '${e.name}' has no reflected ${t}.`,fix:"Pass the reflection from reflectSource()/resolveShader().",where:n});return r}var fn=new WeakMap;function ze(e,t){if(!e.gpu.pushErrorScope||!e.gpu.popErrorScope)return;e.gpu.pushErrorScope("validation");let n=fn.get(e.gpu);n?n.push(t):fn.set(e.gpu,[t])}function W(e){let t=fn.get(e.gpu);if(!t?.length||!e.gpu.popErrorScope)return;let n=t.pop();return t.length||fn.delete(e.gpu),{context:n,error:e.gpu.popErrorScope()}}function Dr(e){let t=[],n=W(e);for(;n;)t.push(n),n=W(e);return t}function ks(e){let t=W(e);t&&$r(t)}function pn(e){for(let t of Dr(e))$r(t)}function V(e){for(let t of e)$r(t)}function At(e){return e.gpu.queue.onSubmittedWorkDone?.()??Promise.resolve()}function mn(e,t=[],n={}){return Zu(e,t,n.errorSink??Ju)}function ot(e,t){return{context:e.context,error:Qu(e.error,t.error)}}async function Qu(e,t){let n=await Promise.allSettled([e,t]);for(let i of n)if(i.status==="fulfilled"&&i.value)return i.value;let r=n.find(i=>i.status==="rejected");if(r?.status==="rejected")throw r.reason;return null}async function Zu(e,t,n){await At(e);for(let r of t)try{let i=await r.error;i&&await n(Q(r.context.label,r.context.group,i))}catch(i){await n(Q(r.context.label,r.context.group,i))}}function $r(e){e.error.catch(()=>{})}function Ju(e){console.error(e)}function hn(e,t,n,r){try{t.end()}catch(i){let o=Dr(e);V(n),V(o),n.length=0;let s=o[0]?.context??r;throw s?Q(s.label,s.group,i):i}}var ed=1,Ps=new WeakMap;function Rs(e){return e===null||typeof e!="object"||ArrayBuffer.isView(e)||e instanceof ArrayBuffer||Array.isArray(e)?!0:e instanceof U||e instanceof z?!1:!Cs(e)}function gn(e){return typeof e!="object"||e===null||Array.isArray(e)||ArrayBuffer.isView(e)||e instanceof ArrayBuffer||e instanceof U||e instanceof z?!1:!Cs(e)}function Gr(e,t,n){switch(e.bindingLayout?.kind){case"buffer":return td(e,t,n);case"texture":return nd(e,t,n);case"sampler":return rd(e,t);case"storageTexture":throw ne(e,"storage texture","Pass a storage-compatible texture.");case"externalTexture":throw ne(e,"external texture","Pass a compatible GPUExternalTexture.");default:throw ne(e,"reflected resource","Fix shader reflection bindingLayout.")}}function td(e,t,n){let r=Wo(t);if(r)return r[St](e,n.sourceHint);if(t instanceof U)return wt(t,`${n.sourceHint}.set`),od(e,t.options.usage),{resource:{buffer:t.gpu},identity:t.resourceIdentity,unsubscribe:i=>t.onDestroy(i)};if(ad(t))return wt(t.buffer,`${n.sourceHint}.set`),{resource:{buffer:t.gpu,offset:0,size:t.size},identity:t.buffer.resourceIdentity,unsubscribe:i=>t.buffer.onDestroy(i)};if(Fs(t))return{resource:t,identity:Ct(t.buffer)};if(Mr(t))return{resource:{buffer:t},identity:Ct(t)};throw ne(e,"buffer",`Pass a compatible Buffer/Uniform: ${e.name}.set({ ${e.name}: gpu.device.createBuffer(...) }).`)}function nd(e,t,n){let r=As(t);if(r){let i=r.color;Is(e,i,n);let o=r.onTexturesRecreated?.bind(r);return{resource:i.createView(),identity:i.resourceIdentity,unsubscribe:s=>r.onDestroy(s),onRecreate:o?s=>o(s):void 0}}if(t instanceof z)return sd(e,t.usage),Is(e,t,n),{resource:t.createView(),identity:t.resourceIdentity,unsubscribe:i=>t.onDestroy(i)};if(Ts(t))return{resource:t.createView(),identity:t.resourceIdentity??Ct(t)};if(typeof t=="object"&&t!==null)return{resource:t,identity:Ct(t)};throw ne(e,"texture/target",`Pass a Texture or Target: ${e.name}.set({ ${e.name}: scene.color }) or set({ ${e.name}: scene }).`)}function rd(e,t){if(id(t))return{resource:t,identity:Ct(t)};throw ne(e,"sampler",`Use the cached sampler: set({ ${e.name}: sampler(gpu) }).`)}function id(e){return typeof e!="object"||e===null||e instanceof U||e instanceof z?!1:!Mr(e)&&!Fs(e)&&!Ts(e)&&!As(e)}function od(e,t){let n=e.bindingLayout?.kind==="buffer"?e.bindingLayout.buffer.type:void 0;if(n==="uniform"&&!t.includes("uniform"))throw ne(e,"uniform buffer","Create with usage: ['uniform','copy_dst'].");if((n==="storage"||n==="read-only-storage")&&!t.includes("storage"))throw ne(e,"storage buffer","Create with usage: ['storage','copy_dst'].")}function sd(e,t){if(!t.includes("texture_binding")&&!t.includes("render_attachment"))throw ne(e,"sampled texture","Use texture_binding usage or a sampleable Target.")}function Is(e,t,n){if(!(!n.filterableTexture||n.float32Filterable)&&(t.format==="r32float"||t.format==="rg32float"||t.format==="rgba32float"))throw to(n.sourceHint,e,t.format,t.label??"texture",n.pairedSampler)}function As(e){if(typeof e!="object"||e===null)return;let t=e;if(!(!t.resourceIdentity||!t.color||typeof t.onDestroy!="function"))return t}function Cs(e){let t=e;return"gpu"in t||"bindGroup"in t||"createView"in t||"resourceIdentity"in t}function Ct(e){if(typeof e!="object"||e===null)return`value:${String(e)}`;let t=Ps.get(e);return t||(t={kind:"external",id:ed++},Ps.set(e,t)),t}function ad(e){return typeof e=="object"&&e!==null&&"gpu"in e&&"size"in e&&"buffer"in e&&e.buffer instanceof U}function Ts(e){return typeof e=="object"&&e!==null&&typeof e.createView=="function"}function Fs(e){return typeof e=="object"&&e!==null&&"buffer"in e&&Mr(e.buffer)}function Mr(e){return typeof e=="object"&&e!==null&&"size"in e&&"usage"in e&&typeof e.destroy=="function"}function xn(e,t){cd(e);let n=new ArrayBuffer(e.size);return Ur(new DataView(n),e,0,t),n}function cd(e){if(e.size===void 0)throw P("set",`No se puede inferir byteLength para layout runtime-sized '${e.name}'.`)}function Ur(e,t,n,r){if(t.members)return ld(e,t.members,n,r);ud(e,t,n,r)}function ld(e,t,n,r){let i=r;for(let o of t)Ur(e,o.layout,n+o.offset,i?.[o.name])}function ud(e,t,n,r){switch(t.type.kind){case"scalar":return Br(e,n,t.type.name,r);case"vector":return dd(e,n,t.type,r);case"matrix":return fd(e,t,n,r);case"array":return pd(e,t,n,r);default:throw P("set",`No hay writer para layout ${t.type.kind}.`)}}function Br(e,t,n,r){n==="f32"?e.setFloat32(t,Number(r??0),!0):n==="i32"?e.setInt32(t,Number(r??0),!0):n==="u32"||n==="bool"?e.setUint32(t,n==="bool"?r?1:0:Number(r??0),!0):e.setUint16(t,md(Number(r??0)),!0)}function dd(e,t,n,r){let i=r,o=Ls(n.element);for(let s=0;s<n.width;s++)Br(e,t+s*o,Or(n.element),i?.[s]??0)}function fd(e,t,n,r){let i=t.type,o=r,s=Ls(i.element),a=t.stride??16;for(let c=0;c<i.columns;c++)for(let l=0;l<i.rows;l++)Br(e,n+c*a+l*s,Or(i.element),o?.[c*i.rows+l]??0)}function pd(e,t,n,r){let i=r,o=t.stride??t.element?.size??0;if(!t.element)throw P("set","Array layout sin element layout.");for(let s=0;s<(i?.length??0);s++)Ur(e,t.element,n+s*o,i[s])}function Ls(e){return Or(e)==="f16"?2:4}function Or(e){if(e.kind!=="scalar")throw P("set",`Expected scalar, got ${e.kind}`);return e.name}function md(e){let t=new Float32Array(1),n=new Uint32Array(t.buffer);t[0]=e;let r=n[0],i=r>>16&32768,o=r&8388607,s=r>>23&255;if(s===255)return i|(o?32256:31744);let a=s-127+15;return a>=31?i|31744:a<=0?a<-10?i:i|(o|8388608)>>1-a+13:i|a<<10|o>>13}var Ds=new WeakMap;function bn(e,t){let n=new Map,r=new Set;for(let o of t){let s=o.stage==="vertex"?1:o.stage==="fragment"?2:4;for(let a of xe(o,"bindings","visibility")){let c=`${a.group}:${a.binding}`;n.set(c,(n.get(c)??0)|s)}for(let a of xe(o,"samplingPairs","visibility"))a.mode==="filtering"&&r.add(`${a.texture.group}:${a.texture.binding}`)}let i=o=>n.get(`${o.group}:${o.binding}`)??0;return Object.defineProperty(i,"filterable",{value:r}),i}function yn(e,t,n=zr){return e.flatMap(r=>{if(r.group!==t)return[];let i=n(r);return i===0?[]:[{binding:r.binding,visibility:i,...bd(r,n.filterable?.has(`${r.group}:${r.binding}`)??!1)}]})}function Tt(e,t,n,r=zr){let i=new Map,o=n.bindings.filter(a=>r(a)!==0).map(a=>a.group),s=Math.max(-1,...o);for(let a=0;a<=s;a++)i.set(a,hd(e,t,n,a,r));return i}function Vr(e,t){return e.gpu.createPipelineLayout({bindGroupLayouts:gd(t)})}function hd(e,t,n,r,i=zr){return Nr(e,`${t}.group${r}.bgl`,yn(n.bindings,r,i))}function Nr(e,t,n){let r=Ds.get(e.gpu);r||(r=new Map,Ds.set(e.gpu,r));let i=JSON.stringify(n),o=r.get(i);if(o)return o;let s=gt(e.gpu.createBindGroupLayout({label:t,entries:n}),{entries:n});return r.set(i,s),s}function gd(e){let t=Math.max(-1,...e.keys()),n=[];for(let r=0;r<=t;r++)n.push(xd(e,r));return n}function xd(e,t){let n=e.get(t);if(!n)throw P("pipelineLayout",`Bind groups must be contiguous for pipeline layout; missing group(${t}).`);return n}function bd(e,t){let n=e.bindingLayout;if(!n)throw P("bindGroupLayout",`Binding '${e.name}' does not have a reflected bindingLayout.`);return t&&n.kind==="texture"&&n.texture.sampleType==="unfilterable-float"&&!n.texture.multisampled?{texture:{...n.texture,sampleType:"float"}}:yd(n)}function yd(e){switch(e.kind){case"buffer":return{buffer:{...e.buffer}};case"sampler":return{sampler:{...e.sampler}};case"texture":return{texture:{...e.texture}};case"storageTexture":return{storageTexture:{...e.storageTexture}};case"externalTexture":return{externalTexture:{}}}}function zr(e){let t=globalThis.GPUShaderStage,n=t?.VERTEX??1,r=t?.FRAGMENT??2,i=t?.COMPUTE??4;return e.kind==="buffer"?n|r|i:r|i}function vn(e){let t=_d(e.reflection),n=[...e.bindGroupLayouts.keys()].sort((p,b)=>p-b),r=new Map;function i(p){let b=[];for(let[y,w]of Object.entries(p))b.push(...s(y,w));return b}function o(p){let b=e.bindGroupLayouts.get(p.info.group);return!!b&&!!fe(b)?.entries.some(y=>y.binding===p.info.binding)}function s(p,b){let y=t.get(p);if(y)return a(y,p,b);let w=vd(p,t,e.label);if(!w)throw P(`${e.label}.set`,`Binding '${p}' does not exist in '${e.label}'.`);return c(w,p,b)}function a(p,b,y){D(p.info.group);let w=$s(p.info,y);Gs(p,b,w);let A=_n(p.identity);return w==="lib"?l(p,kd(p.libValue,y)):d(p,y),o(p)?Wr(p,A):[]}function c(p,b,y){D(p.info.group);let w=$s(p.info,y);if(Gs(p,b,w),wd(p,b,w),w!=="lib")throw P(`${e.label}.set`,`Member '${b}' needs a JS value; set resource '${p.info.name}' instead.`);let A=_n(p.identity);return l(p,{...Pd(p.libValue),[b]:y}),o(p)?Wr(p,A):[]}function l(p,b){let y=oe(p);p.libValue=b;let w=xn(y,b);p.buffer||H(p,y.size),p.bytes=w,p.buffer.write(w,0)}function u(p){let b=fe(e.bindGroupLayouts.get(p.group))?.entries.find(A=>A.binding===p.binding),y=e.reflection.entryPoints.flatMap(A=>xe(A,"samplingPairs",e.label)).find(A=>A.mode==="filtering"&&A.texture.group===p.group&&A.texture.binding===p.binding),w=y&&e.reflection.bindings.find(A=>A.group===y.sampler.group&&A.binding===y.sampler.binding);return{sourceHint:e.label,filterableTexture:b?.texture?.sampleType==="float",float32Filterable:e.device.features.has("float32-filterable"),pairedSampler:w}}function d(p,b){let y=Gr(p.info,b,u(p.info));p.unsubscribe?.(),p.unsubscribeRecreate?.(),p.resource=y.resource,p.identity=y.identity,p.unsubscribe=y.unsubscribe?.(()=>{p.identity&&e.cache.evictIdentity(p.identity)}),p.unsubscribeRecreate=y.onRecreate?.(()=>f(p,b))}function f(p,b){let y=_n(p.identity);p.identity&&e.cache.evictIdentity(p.identity);let w=Gr(p.info,b,u(p.info));if(p.unsubscribe?.(),p.unsubscribeRecreate?.(),p.resource=w.resource,p.identity=w.identity,p.unsubscribe=w.unsubscribe?.(()=>{p.identity&&e.cache.evictIdentity(p.identity)}),p.unsubscribeRecreate=w.onRecreate?.(()=>f(p,b)),o(p))for(let A of Wr(p,y))e.onIdentityChange?.(A)}function m(p,b,y){x(p),Sd(e.label,p,b,y);let w=r.has(p)?`claimed-group:${p}`:void 0;return r.set(p,b),w}function x(p){let b=e.bindGroupLayouts.get(p);if(!b)throw P(`${e.label}.layout`,`@group(${p}) does not exist in '${e.label}'.`);return b}function g(){return n.map(E)}function E(p){let b=r.get(p);if(b)return{group:p,bindGroup:b,offsets:[],claimValidation:k(b,p)};let y=new Set(fe(x(p))?.entries.map(ae=>ae.binding)),w=e.reflection.bindings.filter(ae=>ae.group===p&&y.has(ae.binding)),A=C(w),je=T(w),se=e.cache.getOrCreate(e.drawId,p,je,()=>e.device.gpu.createBindGroup({label:`${e.label}.group${p}`,layout:x(p),entries:A}));return{group:p,bindGroup:se,offsets:[]}}function k(p,b){return jt(p)?void 0:{label:e.label,group:b}}function C(p){return p.map(b=>{let y=N(b);return{binding:b.binding,resource:y.resource}})}function T(p){return p.map(b=>N(b).identity)}function N(p){let b=t.get(p.name);if(!b?.resource||!b.identity)throw no(e.label,p);return b}function D(p){if(r.has(p))throw ro(e.label,p)}function H(p,b){p.buffer=e.device.createBuffer({size:b,usage:["uniform","copy_dst"],label:`${e.label}.${p.info.name}`}),p.resource={buffer:p.buffer.gpu,offset:0,size:b},p.identity=p.buffer.resourceIdentity,p.unsubscribe=p.buffer.onDestroy(()=>e.cache.evictIdentity(p.buffer.resourceIdentity))}function oe(p){if(p.info.kind!=="buffer"||!p.info.layout?.size)throw P(`${e.label}.set`,`Binding '${p.info.name}' needs a compatible resource, not JS.`);return p.info.layout}return{get groups(){return n},set:i,claimGroup:m,layout:x,bindGroups:g,bindingState(p){let b=t.get(p);if(!(!b?.ownership||!b.resource||!b.identity))return{info:b.info,ownership:b.ownership,resource:b.resource,identity:b.identity}}}}function _d(e){return new Map(e.bindings.map(t=>[t.name,{info:t,memberOwnership:new Map}]))}function vd(e,t,n){let r;for(let i of t.values())if(i.info.layout?.members?.some(o=>o.name===e)){if(r)throw P(`${n}.set`,`Binding member '${e}' is ambiguous in '${n}'; set the complete binding.`);r=i}return r}function $s(e,t){return e.bindingLayout?.kind==="buffer"&&Rs(t)?"lib":"user"}function Gs(e,t,n){if(e.ownership&&e.ownership!==n)throw tr(t,e.ownership);e.ownership??=n}function wd(e,t,n){let r=e.memberOwnership.get(t);if(r&&r!==n)throw tr(t,r);e.memberOwnership.set(t,n)}function Sd(e,t,n,r){let i=jt(n);if(!i)return;let o=fe(r);if(!o)return;let s=Ed(o.entries,i.layout.entries);if(s)throw io(e,t,s)}function Ed(e,t){if(e.length!==t.length)return`expected ${e.length} bindings and received ${t.length}`;let n=Ms(e),r=Ms(t);for(let[i,o]of n){let s=r.get(i);if(!s)return`missing @binding(${i})`;if(Us(o)!==Us(s))return`@binding(${i}) does not match the reflected layout`}}function Ms(e){return new Map(e.map(t=>[t.binding,t]))}function Us(e){return JSON.stringify({binding:e.binding,visibility:e.visibility,buffer:e.buffer,sampler:e.sampler,texture:e.texture,storageTexture:e.storageTexture,externalTexture:e.externalTexture?{}:void 0})}function Wr(e,t){let n=_n(e.identity);return!n||t===n?[]:[{group:e.info.group,binding:e.info.binding,bindingName:e.info.name,bindingKind:e.info.kind,previousIdentity:t,newIdentity:n}]}function _n(e){return e===void 0?void 0:rt(e)}function kd(e,t){return gn(e)&&gn(t)?{...e,...t}:t}function Pd(e){return gn(e)?e:{}}var Id="rgba8unorm",st=Object.freeze([0,0,0,1]);function at(e,t){let n=e,r=Array.isArray(e)?e:[n?.r,n?.g,n?.b,n?.a];if(r.length!==4||!r.every(i=>typeof i=="number"&&Number.isFinite(i)))throw Lo(t);return Ft(e)}function Ft(e){let t=e;return Array.isArray(e)?[e[0],e[1],e[2],e[3]]:{r:t.r,g:t.g,b:t.b,a:t.a}}function Lt(e){return e.colors??[{format:e.format??Id}]}function qr(e){return e.depth===!0?"depth24plus":e.depth||void 0}function jr(e){let t=e.msaa;if(t===!0||t===4)return 4;if(t===void 0||t===!1)return 1;let n=fr();throw n.code="VGPU-TARGET-MSAA-INVALID",n.message=`msaa received ${t}; WebGPU 1|4; use true`,n}function Bs(e,t){if(!e?.size)throw fr();let n=qr(e);if(n==="stencil8")throw Io(n);if(jr(e)===4)for(let r of Lt(e))Rd(r.format,t)}function Rd(e,t){if(t.isCompatibilityMode&&e==="rgba16float")throw P("target","Dawn compatibility mode does not support rgba16float+msaa.","Use rgba8unorm for MSAA here, or disable msaa.")}function Os(e,t,n,r){let i={view:(t??e).createView(),resolveTarget:t?e.createView():void 0,loadOp:r?"load":"clear",storeOp:t?"discard":"store"};return r||(i.clearValue=Hr(n)),i}function Vs(e,t,n,r,i){if(i){let s={view:e.createView(),depthReadOnly:!0};return We(e.format)&&(s.stencilReadOnly=!0),s}let o={view:e.createView(),depthLoadOp:t?"load":"clear",depthStoreOp:e.sampleCount>1?"discard":"store"};return t||(o.depthClearValue=n??1),e.format&&We(e.format)&&(o.stencilLoadOp=t?"load":"clear",o.stencilStoreOp=e.sampleCount>1?"discard":"store",t||(o.stencilClearValue=r??0)),o}function We(e){return!!e&&e.includes("stencil")}function Hr(e){return Array.isArray(e)?{r:e[0],g:e[1],b:e[2],a:e[3]}:e}function wn(e,t){return e[0]===t[0]&&e[1]===t[1]}function Re(e){return typeof e=="object"&&e!==null&&typeof e.renderPassDescriptor=="function"}var Ad=1,Cd=1,Td=new WeakMap,Fd=new WeakMap;function Sn(e){return Re(e)?{colors:e.colors.map(t=>t.format),depth:e.depth?.format,sampleCount:e.sampleCount}:typeof e!="object"||e===null?{colors:[]}:{colors:Array.isArray(e.colors)?[...e.colors]:e.colors??[],depth:e.depth,sampleCount:e.sampleCount??1}}function ct(e){return`${e.colors.join(",")}:${e.depth??"none"}:${e.sampleCount??1}`}function En(e,t){if(!Array.isArray(e.colors)||e.colors.length===0)throw _t(t,"colors must be a non-empty array.");let n=e.colors.find(i=>typeof i!="string"||i.length===0);if(n!==void 0)throw _t(t,`colors must contain only GPUTextureFormat strings; received ${String(n)}.`);if(e.depth!==void 0&&(typeof e.depth!="string"||e.depth.length===0))throw _t(t,"depth must be a GPUTextureFormat string.");let r=e.sampleCount??1;if(r!==1&&r!==4)throw _t(t,`sampleCount must be 1 or 4; received ${String(r)}.`)}function qs(e){let t=`${Ws(Td,e.module,()=>Ad++)}|${Ws(Fd,e.pipelineLayout,()=>Cd++)}|${Gd(e.vertexBufferLayouts??[])}|${ct(e.signature)}`,n=e.topology||e.stripIndexFormat?`${t}|${e.topology??"triangle-list"}|${e.stripIndexFormat??"none"}`:t,r=e.cullMode||e.frontFace?`${n}|${e.cullMode??"none"}|${e.frontFace??"ccw"}`:n,i=e.unclippedDepth?`${r}|unclipped`:r,o=e.depthKey?`${i}|${e.depthKey}`:i,s=e.stencilKey?`${o}|${e.stencilKey}`:o,a=e.multisampleKey?`${s}|${e.multisampleKey}`:s,c=e.constantsKey?`${a}|${e.constantsKey}`:a,l=e.entryKey?`${c}|${e.entryKey}`:c;return e.fragmentKey?`${l}|${e.fragmentKey}`:l}function Dt(e,t,n,r,i){if(r===void 0)return t.find(s=>s.stage===n);if(typeof r!="string")throw Ye(e,`${n} received ${Kr(r)}; expected an entry point name string.`,i);let o=t.find(s=>s.name===r);if(!o)throw Ye(e,`"${r}" matches no entry point in the shader; available entry points: ${Ns(t)}.`,i);if(o.stage!==n)throw Ye(e,`"${r}" is a @${o.stage} entry point, not @${n}; available entry points: ${Ns(t)}.`,i);return o}function Ns(e){return e.length?e.map(t=>`"${t.name}" (@${t.stage})`).join(", "):"none"}function kn(e,t,n,r){if(t!==void 0&&(typeof t!="object"||t===null||Array.isArray(t)))throw bt(e,`received ${Kr(t)}; expected { overrideNameOrId: number | boolean }.`,r);let i=new Map(n.map(s=>[zs(s),s])),o={};for(let[s,a]of Object.entries(t??{})){if(!i.has(s))throw bt(e,`"${s}" matches no override in the shader; available overrides: ${Ld(n)}.`,r);if(typeof a=="boolean"){o[s]=a?1:0;continue}if(typeof a!="number"||!Number.isFinite(a))throw bt(e,`"${s}" received ${Kr(a)}; use a finite number or a boolean (WebGPU converts the value to the override's WGSL type, and NaN/Infinity fail that conversion).`,r);o[s]=a}for(let s of n){let a=zs(s);if(s.defaultValue===void 0&&!(a in o))throw bt(e,`override '${s.name}' has no default value and must be provided; add constants: { "${a}": value }.`,r)}return Object.keys(o).length===0?{}:{constants:o,constantsKey:Dd(o)}}function zs(e){return e.id!==void 0?String(e.id):e.name}function Ld(e){return e.length?e.map(t=>t.id!==void 0?`"${t.id}" (@id of ${t.name})`:`"${t.name}"`).join(", "):"none"}function Dd(e){return`cn~${Object.entries(e).sort(([t],[n])=>t<n?-1:t>n?1:0).map(([t,n])=>`${t}=${n}`).join("~")}`}function Kr(e){if(typeof e=="string")return`"${e}"`;try{return JSON.stringify(e)??String(e)}catch{return String(e)}}function Pn(e){let t=new Map;return{get(n,r){let i=t.get(n);return i||(i=e.gpu.createShaderModule({label:r,code:n}),t.set(n,i)),i},dispose(){t.clear()}}}function In(e){let t=new Map;return{get(n){let r=Md(n),i=t.get(r);return i||(i=e.gpu.createPipelineLayout({bindGroupLayouts:Ud(n)}),t.set(r,i)),i},dispose(){t.clear()}}}function Rn(e,t={}){return new Yr(e,t)}var Yr=class{device;#e=new Map;#t=new Set;#n;#r;#i=!1;constructor(t,n){this.device=t,this.#n=n.errorSink??(()=>{}),this.#r=n.registerSettledSource?.(()=>[...this.#t])}getReady(t){return this.#e.get(t)?.pipeline}getSync(t,n,r){this.#a(r.where);let i=this.#e.get(t);if(i?.pipeline)return i.pipeline;let o=i??{};i||this.#e.set(t,o);let s=this.#o(t,o,n,r);if(!s){o.pending||this.#e.delete(t);return}return o.pipeline=s,o.pending?.resolve(s),o.pending=void 0,s}getAsync(t,n,r){this.#a(r.where);let i=this.#e.get(t);if(i?.pipeline)return Promise.resolve(i.pipeline);if(i?.pending)return i.pending.promise;let o={},s=$d();o.pending=s,this.#e.set(t,o);let a;try{a=n()}catch(c){let l=Xe(r.where,c,r.signature);return s.reject(l),this.#e.delete(t),s.promise}return this.#u(a),a.then(c=>{this.#e.get(t)!==o||o.pipeline||o.pending!==s||(o.pipeline=c,o.pending=void 0,s.resolve(c))},c=>{this.#e.get(t)!==o||o.pipeline||o.pending!==s||(o.pending=void 0,this.#e.delete(t),s.reject(Xe(r.where,c,r.signature)))}),s.promise}dispose(){if(this.#i)return;this.#i=!0;let t=dr("gpu.dispose");for(let n of this.#e.values())n.pending?.reject(t);this.#e.clear(),this.#t.clear(),this.#r?.()}#o(t,n,r,i){let o=this.device.gpu,s=typeof o.pushErrorScope=="function"&&typeof o.popErrorScope=="function";s&&o.pushErrorScope("validation");try{let a=r();return s&&this.#s(t,n,i),a}catch(a){s&&this.#l();let c=Xe(i.where,a,i.signature);this.#n(c);return}}#s(t,n,r){let i=this.device.gpu.popErrorScope().then(o=>{if(!o)return;let s=Xe(r.where,o,r.signature);return this.#e.get(t)===n&&this.#e.delete(t),this.#n(s)},o=>{let s=Xe(r.where,o,r.signature);return this.#e.get(t)===n&&this.#e.delete(t),this.#n(s)});this.#u(i)}#l(){let t=this.device.gpu.popErrorScope?.();t&&t.catch(()=>{})}#a(t){if(this.#i)throw dr(t)}#u(t){this.#t.add(t),t.catch(()=>{}).then(()=>this.#t.delete(t),()=>this.#t.delete(t))}};function $d(){let e,t,n=new Promise((r,i)=>{e=r,t=i});return n.catch(()=>{}),{promise:n,resolve:e,reject:t}}function Ws(e,t,n){let r=e.get(t);return r||(r=n(),e.set(t,r)),r}function Gd(e){return JSON.stringify(e.map(t=>({arrayStride:t.arrayStride,stepMode:t.stepMode??"vertex",attributes:[...t.attributes].map(n=>({shaderLocation:n.shaderLocation,offset:n.offset,format:n.format}))})))}function Md(e){return JSON.stringify([...e.entries()].map(([t,n])=>({group:t,entries:Od(n)})))}function Ud(e){let t=Math.max(-1,...e.keys()),n=[];for(let r=0;r<=t;r++)n.push(Bd(e,r));return n}function Bd(e,t){let n=e.get(t);if(!n)throw Po(t);return n}function Od(e){return(fe(e)?.entries??[]).map(t=>({binding:t.binding,visibility:t.visibility,buffer:t.buffer?{...t.buffer}:void 0,sampler:t.sampler?{...t.sampler}:void 0,texture:t.texture?{...t.texture}:void 0,storageTexture:t.storageTexture?{...t.storageTexture}:void 0,externalTexture:t.externalTexture?{...t.externalTexture}:void 0}))}var Vd=re("frame-state");function Ae(e){return e.service(Vd,Nd)}function Nd(){let e=new Set,t=js(),n=!1,r=!1,i={time:0,deltaTime:0,frameCount:0,advanceBy(o){i.deltaTime=o,i.time+=o,r=!0},tick(){if(n)throw Zt();n=!0;try{let o=js();r?r=!1:(i.deltaTime=Math.max(0,(o-t)/1e3),i.time+=i.deltaTime),t=o,i.frameCount+=1;for(let s of[...e])s()}finally{n=!1}},onAdvance(o){return e.add(o),()=>{e.delete(o)}}};return i}function js(){return globalThis.performance?.now?.()??Date.now()}function Ys(e,t,n={}){let r=S(e,"surface"),i=Wd(r),o=i.get(t);if(o&&!o.disposed)throw Ao(o.label);let s=new Cn(r.device,t,n,l=>{i.get(l.canvas)===l&&i.delete(l.canvas),a(),c()}),a=Ae(r).onAdvance(()=>s.applyAutoResize()),c=r.own("resource",()=>s.dispose());return i.set(t,s),s}var zd=re("surfaces");function Wd(e){return e.service(zd,()=>new Map)}var $t=0,Xr=0;function Xs(){return $t>0}function Fn(){return Xr>0}function Qs(){Xr+=1}function Zs(){Xr-=1}function lt(e){return e instanceof Cn}var Cn=class{device;canvas;options;unregister;resourceIdentity=ue("render-target");label;context;autoResize;layoutBacked;format;#e=new Y;#t=new Set;#n=new Set;#r;#i;#o=!1;#s=!1;constructor(t,n,r,i){this.device=t,this.canvas=n,this.options=r,this.unregister=i,this.label=r.label,this.#i=r.clearColor===void 0?st:at(r.clearColor,"surface.clearColor");let o=n.getContext("webgpu");if(!o)throw Ro();if(this.context=o,this.layoutBacked=qd(n),r.autoResize===!0&&!this.layoutBacked)throw To();this.autoResize=r.autoResize??(r.size?!1:this.layoutBacked),this.#r=Ks(r.dpr),this.format=r.format??Hd();let s=jd(n,r,this.layoutBacked,this.#r);(r.size||this.layoutBacked)&&Hs(n,s),o.configure({device:t.gpu,format:this.format,alphaMode:r.alphaMode??"premultiplied",colorSpace:r.colorSpace??"srgb",usage:Kd()})}get gpu(){return this.context}get size(){return this.#c(),An(this.canvas)}get texelSize(){let t=this.size;return[1/t[0],1/t[1]]}get color(){return this.#c(),new z(this.device,this.context.getCurrentTexture(),{size:this.size,format:this.format,usage:["render_attachment","texture_binding","copy_src"],label:this.options.label?`${this.options.label}.color`:"surface.color"},"external")}get colors(){return[this.color]}get depth(){this.#c()}get sampleCount(){return this.#c(),1}get dpr(){return this.#r}get clearColor(){return Ft(this.#i)}set clearColor(t){this.#i=at(t,"surface.clearColor")}get disposed(){return this.#o}resize(t){if(this.#c(),this.#s)throw Fo(this.options.label);this.#l(Tn(t),this.#r,!0)}applyAutoResize(){if(this.#o||!this.autoResize||!this.layoutBacked)return;let t=Ks(this.options.dpr),n=Js(this.canvas,t);this.#l(n,t,!0)}onResize(t){this.#c(),this.#t.add(t),this.#s=!0,$t+=1;try{t(this.#d())}finally{$t-=1,this.#s=!1}return()=>{this.#t.delete(t)}}async read(){return this.#c(),this.color.read()}async readFloats(){return this.#c(),this.color.readFloats()}onDestroy(t){return this.#c(),this.#e.onDestroy(this,t)}onTexturesRecreated(t){return this.#c(),this.#n.add(t),()=>{this.#n.delete(t)}}renderPassDescriptor(t={}){let{clear:n=[0,0,0,1],preserve:r}=t;this.#c();let i={view:this.context.getCurrentTexture().createView(),loadOp:r?"load":"clear",storeOp:"store"};return r||(i.clearValue=Hr(n)),{colorAttachments:[i]}}dispose(){if(!this.#o){this.#o=!0;try{this.context.unconfigure?.()}catch{}this.unregister(this),this.#t.clear(),this.#n.clear(),this.#e.emit(this)}}#l(t,n,r){let i=!wn(An(this.canvas),t);this.#r=n,i&&(Hs(this.canvas,t),this.#a(),r&&this.#u())}#a(){for(let t of[...this.#n])t()}#u(){this.#s=!0,$t+=1;try{let t=this.#d();for(let n of[...this.#t])n(t)}finally{$t-=1,this.#s=!1}}#d(){let t=An(this.canvas);return{width:t[0],height:t[1],dpr:this.#r,surface:this}}#c(){if(this.#o)throw Co(this.options.label)}};function qd(e){return typeof e.clientWidth=="number"}function jd(e,t,n,r){return t.size?Tn(t.size):n?Js(e,r):Tn(An(e))}function Js(e,t){let n=e;return Tn([Math.round(n.clientWidth*t),Math.round(n.clientHeight*t)])}function An(e){let t=e;return[t.width,t.height]}function Hs(e,t){let n=e;n.width=t[0],n.height=t[1]}function Tn(e){return[Math.max(1,Math.floor(e[0])),Math.max(1,Math.floor(e[1]))]}function Ks(e){let t=globalThis.devicePixelRatio??1;return Array.isArray(e)?Math.min(e[1],Math.max(e[0],t)):typeof e=="number"?e:t}function Hd(){return globalThis.navigator?.gpu?.getPreferredCanvasFormat?.()??"bgra8unorm"}function Kd(){let e=globalThis.GPUTextureUsage;return e?e.RENDER_ATTACHMENT|e.TEXTURE_BINDING|e.COPY_SRC:void 0}var Yd={drawIndirect:{bytes:16,args:"4 u32 values: vertexCount, instanceCount, firstVertex, firstInstance"},drawIndexedIndirect:{bytes:20,args:"5 32-bit values: indexCount, instanceCount, firstIndex, baseVertex (signed), firstInstance"},dispatchWorkgroupsIndirect:{bytes:12,args:"3 u32 values: workgroupCountX, workgroupCountY, workgroupCountZ"}};function Ln(e,t,n,r){let i=typeof n=="object"&&n!==null?n.buffer:void 0,o=ea(n)?n:ea(i)?i:void 0;if(!o)throw J(e,`received ${ta(n)}; expected a StorageBuffer or { buffer, offset? }.`,t);let s=o===n?0:n.offset??0;if(typeof s!="number"||!Number.isInteger(s)||s<0)throw J(e,`offset must be an integer >= 0; received ${ta(s)}.`,t);if(s%4!==0)throw J(e,`offset must be a multiple of 4 (WebGPU requires "indirectOffset is a multiple of 4"); received ${s}.`,t);if(!o.buffer.options.usage.includes("indirect"))throw J(e,`the buffer lacks the "indirect" usage (WebGPU requires "indirectBuffer.usage contains INDIRECT"); create it with storage(gpu, ${o.size}, { indirect: true }).`,t);let{bytes:a,args:c}=Yd[r];if(s+a>o.size)throw J(e,`${r} reads ${a} bytes (${c}) at offset ${s}, but offset + ${a} = ${s+a} exceeds the buffer size ${o.size}.`,t);return{buffer:o.gpu,offset:s}}function ea(e){return typeof e=="object"&&e!==null&&"gpu"in e&&"size"in e&&e.buffer instanceof U}function ta(e){if(typeof e=="string")return`"${e}"`;try{return JSON.stringify(e)??String(e)}catch{return String(e)}}var ut=Symbol("vgpu.frame.drawable");function na(e){return e?.[ut]}var Qr=Symbol("vgpu.frame.bundle");function ra(e){return e?.[Qr]}var qe=Symbol("vgpu.frame.passAttachment");function ia(e){return typeof e?.[qe]=="function"?e:void 0}function sa(e,t){return Ce(S(e,"sampler")).sampler(t)}var oa=1;function aa(e){let t=new Map,n=new WeakMap;return{sampler(r={}){let i=Zr(r),o=t.get(i);return o||(o=e.gpu.createSampler(r),t.set(i,o),n.set(o,{kind:"sampler",id:oa++})),o},identity(r){let i=n.get(r);return i||(i={kind:"sampler",id:oa++},n.set(r,i)),i}}}function Zr(e){if(e===null||typeof e!="object")return JSON.stringify(e);if(Array.isArray(e))return`[${e.map(Zr).join(",")}]`;let t=e;return`{${Object.keys(t).sort().map(n=>`${JSON.stringify(n)}:${Zr(t[n])}`).join(",")}}`}var Xd=re("render-service");function Ce(e){return e.service(Xd,Qd)}function Qd(e){let t=e.device,n=it(),r=Rn(t,{errorSink:a=>e.reportError(a),registerSettledSource:a=>e.registerSettledSource(a)}),i=Pn(t),o=In(t),s=aa(t);return e.own("service",()=>{r.dispose(),i.dispose(),o.dispose(),n.dispose()}),{binds:n,pipelines:r,shaderModules:i,pipelineLayouts:o,sampler:a=>s.sampler(a)}}function dt(e){if(typeof e=="string")return e;if(!Zd(e))throw vt(e);if(!("version"in e))throw vt(e);if(e.version!==1)throw vt(e);let n=e.wgsl;if(typeof n!="string")throw vt(e);return n}function Zd(e){return typeof e=="object"&&e!==null}function wa(e,t){let n=S(e,"draw"),r=Ce(n),i=dt(t.shader);return new Gt(n.device,i,{...t,shader:i},r.binds,void 0,r.pipelines,r.shaderModules,r.pipelineLayouts,o=>n.reportError(o),o=>{n.trackDelivery(o)})}var Jd=1,Sa=new WeakMap,Gt=class{source;label;#e=new Map;constructor(t,n,r,i=it(),o,s=Rn(t),a=Pn(t),c=In(t),l,u){this.source=n,I(t,"Draw.constructor"),this.label=r.label??"draw";let d=Jd++,f=nt(n,`${this.label}.wgsl`),m=lf(this.label,r.entry),x=Dt(this.label,f.entryPoints,"vertex",m.vertex,"draw"),g=Dt(this.label,f.entryPoints,"fragment",m.fragment,"draw"),E=uf(f,x,g),k=[x,g].filter(ce=>!!ce),C=bn(f.bindings,k);ef(t,this.label,f.bindings,k,C);let T=r.geometry,N=x?xe(x,"inputs",this.label):[],D=T&&we in T?T[we](N,`${this.label}.geometry`):T?.vertexBufferLayouts,H=new Map(Tt(t,this.label,f,C)),oe=c.get(H),p=a.get(n,`${this.label}.shader`),b=Pf(),y=rf(this.label,r),w=sf(this.label,r,y),A=df(t,this.label,r),je=hf(t,this.label,r),se=yf(this.label,r),ae=vf(this.label,r),$e=kn(this.label,r.constants,f.overrides,"draw"),Bt=vn({device:t,label:this.label,drawId:d,reflection:f,bindGroupLayouts:H,cache:i,onIdentityChange:ce=>b.markStale({kind:"binding-identity",drawLabel:this.label,...ce})});Sa.set(this,{id:d,device:t,opts:r,vertexBufferLayouts:D,cache:i,defaultTarget:o,reflection:f,visibility:C,vertexEntry:x?.name??"vs_main",fragmentEntry:g?.name??"fs_main",entryKey:E,setCore:Bt,bindGroupLayouts:H,pipelineLayout:oe,shaderModule:p,pipelineStore:s,pipelineLayouts:c,errorSink:l,trackSettled:u,resolvedPipelineKeys:new Set,recordedIn:b,...y,...w,...A,...je,...se,...ae,...$e}),r.set&&this.set(r.set);for(let ce of r.targets??[])this.compileSync(ce)}get gpu(){let t=_(this);for(let n of t.resolvedPipelineKeys){let r=t.pipelineStore.getReady(n);if(r)return r}}get targets(){return _(this).opts.targets}get[ut](){return this}writesDepth(){return Ef(this)}stencilWritingOps(){return kf(this)}set(t){let n=_(this);I(n.device,`${this.label}.set`);for(let r of n.setCore.set(t))n.recordedIn.markStale({kind:"binding-identity",drawLabel:this.label,...r});return this}group(t,n){let r=_(this);I(r.device,`${this.label}.group`);let i=this.#e.get(t)??this.layout(t),o=r.setCore.claimGroup(t,n,i);return r.recordedIn.markStale({kind:"group-claim",drawLabel:this.label,group:t,previousIdentity:o,newIdentity:`claimed-group:${t}`}),this}layout(t,n={}){return I(_(this).device,`${this.label}.layout`),n.dynamicOffsets?this.#t(t):_(this).setCore.layout(t)}#t(t){let n=_(this);n.setCore.layout(t);let r=this.#e.get(t);if(r)return r;let i=Rf(this,t),o=Nr(n.device,`${this.label}.group${t}.dynamic.bgl`,i);return this.#e.set(t,o),n.bindGroupLayouts.set(t,o),n.pipelineLayout=n.pipelineLayouts.get(n.bindGroupLayouts),o}draw(t={}){I(_(this).device,`${this.label}.draw`);let n=Re(t)?{target:t}:t,r=_(this),i=n.target??r.defaultTarget;if(!i)throw yt(`${this.label}.draw`);va(i,`${this.label}.draw`);let o=r.device.gpu.createCommandEncoder(),s=o.beginRenderPass(i.renderPassDescriptor()),a=[];try{this.encode(s,i,n,d=>a.push(d))}catch(d){V(a),pn(r.device);try{s.end()}catch{}throw d}hn(r.device,s,a,a[0]?.context);let c,l=a[0]?.context;l&&ze(r.device,l);try{c=o.finish()}catch(d){let f=l?W(r.device):void 0;V(a),f&&V([f]);let m=f?.context??l;if(m){_a(r,m.label,m.group,d);return}throw d}if(l){let d=W(r.device);d&&(a[0]=a[0]?ot(d,a[0]):d)}let u=a[0]?.context;u&&ze(r.device,u);try{r.device.gpu.queue.submit([c])}catch(d){let f=u?W(r.device):void 0;V(a),f&&V([f]);let m=f?.context??u;if(m){_a(r,m.label,m.group,d);return}throw d}if(u){let d=W(r.device);d&&(a[0]=a[0]?ot(d,a[0]):d)}if(a.length){let d=mn(r.device,a,{errorSink:r.errorSink});r.trackSettled?.(d)}}encode(t,n,r={},i){I(_(this).device,`${this.label}.encode`);let o=this.pipelineFor(n,!0);if(!o)return;t.setPipeline(o);let s=_(this);s.blendConstant&&t.setBlendConstant(s.blendConstant),s.stencilRef!==void 0&&t.setStencilReference(s.stencilRef);for(let a of s.setCore.bindGroups())this.#n(t,a,r,i);this.#s(t,r)}#n(t,n,r,i){let o=If(r.offsets,n.group,n.offsets);if(!n.claimValidation||!i){t.setBindGroup(n.group,n.bindGroup,o);return}ze(_(this).device,n.claimValidation);try{t.setBindGroup(n.group,n.bindGroup,o)}catch(a){throw ks(_(this).device),Q(n.claimValidation.label,n.claimValidation.group,a)}let s=W(_(this).device);s&&i(s)}compile(t){I(_(this).device,`${this.label}.compile`);let{key:n,signature:r,signatureKey:i}=this.#r(t,`${this.label}.compile`);return _(this).pipelineStore.getAsync(n,()=>this.#u(r),{where:`${this.label}.compile`,signature:i}).then(()=>(I(_(this).device,`${this.label}.compile`),_(this).resolvedPipelineKeys.add(n),this))}compileSync(t){I(_(this).device,`${this.label}.compileSync`);let{key:n,signature:r,signatureKey:i}=this.#r(t,`${this.label}.compileSync`);return _(this).pipelineStore.getSync(n,()=>this.#a(r),{where:`${this.label}.compileSync`,signature:i})&&_(this).resolvedPipelineKeys.add(n),this}pipelineFor(t,n=!1){I(_(this).device,`${this.label}.pipelineFor`);let{key:r,signature:i,signatureKey:o}=this.#r(t,`${this.label}.pipelineFor`,n),s=_(this).pipelineStore.getSync(r,()=>this.#a(i),{where:`${this.label}.pipelineFor`,signature:o});return s&&_(this).resolvedPipelineKeys.add(r),s}pipelineForAsync(t){I(_(this).device,`${this.label}.pipelineForAsync`);let{key:n,signature:r,signatureKey:i}=this.#r(t,`${this.label}.pipelineForAsync`);return _(this).pipelineStore.getAsync(n,()=>this.#u(r),{where:`${this.label}.pipelineForAsync`,signature:i}).then(s=>(I(_(this).device,`${this.label}.pipelineForAsync`),_(this).resolvedPipelineKeys.add(n),s))}#r(t,n,r=!1){let i=this.#i(t,n,r),o=ct(i);return{signature:i,signatureKey:o,key:this.#o(i)}}#i(t,n,r=!1){let i=_(this),o=t??i.defaultTarget;if(!o)throw yt(n);r||va(o,n);let s=Sn(o);if(En(s,n),i.colorStates&&i.colorStates.length!==s.colors.length)throw Yt(this.label,`expected one entry per color attachment; colors has ${i.colorStates.length}, but the target signature has ${s.colors.length}.`,n);if(i.multisampleState?.alphaToCoverageEnabled&&(s.sampleCount??1)<=1)throw xt(this.label,`alphaToCoverage requires a multisampled target, but the target signature has sampleCount ${s.sampleCount??1}; create the target with msaa: true.`,n);if((i.stencilState||i.stencilRef!==void 0)&&!We(s.depth))throw Ue(this.label,`stencil requires a depth format with a stencil aspect, but the target signature has ${s.depth?`"${s.depth}"`:"no depth"}; create the target with depth: "depth24plus-stencil8".`,n);return s}#o(t){let n=_(this),r=n.opts.geometry;return qs({module:n.shaderModule,pipelineLayout:n.pipelineLayout,vertexBufferLayouts:n.vertexBufferLayouts,signature:t,fragmentKey:n.fragmentKey,topology:r?.topology,stripIndexFormat:Ea(r),cullMode:n.cullMode,frontFace:n.frontFace,unclippedDepth:n.unclippedDepth,depthKey:n.depthKey,stencilKey:n.stencilKey,multisampleKey:n.multisampleKey,constantsKey:n.constantsKey,entryKey:n.entryKey})}#s(t,n={}){let r=_(this).opts.geometry;if(r?.vertexBuffers&&r.vertexBuffers.forEach((o,s)=>t.setVertexBuffer(s,o)),n.indirect!==void 0)return this.#l(t,r,n);let i=nf(this.label,r,_(this).opts,n);if(!r?.indexBuffer)return t.draw(i.vertexCount,i.instanceCount,i.firstVertex,i.firstInstance);t.setIndexBuffer(r.indexBuffer,r.indexFormat??"uint32"),t.drawIndexed(i.indexCount,i.instanceCount,i.firstIndex,i.baseVertex,i.firstInstance)}#l(t,n,r){let i=`${this.label}.draw`,o=tf.find(l=>r[l]!==void 0);if(o!==void 0)throw J(this.label,`indirect cannot be combined with ${o} in the same call; the GPU reads the draw arguments from the buffer, so the CPU-side value would be ignored.`,i);let s=!!n?.indexBuffer,{buffer:a,offset:c}=Ln(this.label,i,r.indirect,s?"drawIndexedIndirect":"drawIndirect");if(!s)return t.drawIndirect(a,c);t.setIndexBuffer(n.indexBuffer,n.indexFormat??"uint32"),t.drawIndexedIndirect(a,c)}#a(t){let n=_(this);return n.device.gpu.createRenderPipeline({label:`${this.label}.pipeline`,layout:n.pipelineLayout,vertex:{module:n.shaderModule,entryPoint:n.vertexEntry,buffers:[...n.vertexBufferLayouts??[]],...n.constants?{constants:n.constants}:{}},fragment:{module:n.shaderModule,entryPoint:n.fragmentEntry,targets:ca(t,n),...n.constants?{constants:n.constants}:{}},primitive:la(n.opts.geometry,n.cullMode,n.frontFace,n.unclippedDepth),depthStencil:ha(t,n),multisample:ba(t,n)})}#u(t){let n=_(this);return n.device.gpu.createRenderPipelineAsync({label:`${this.label}.pipeline`,layout:n.pipelineLayout,vertex:{module:n.shaderModule,entryPoint:n.vertexEntry,buffers:[...n.vertexBufferLayouts??[]],...n.constants?{constants:n.constants}:{}},fragment:{module:n.shaderModule,entryPoint:n.fragmentEntry,targets:ca(t,n),...n.constants?{constants:n.constants}:{}},primitive:la(n.opts.geometry,n.cullMode,n.frontFace,n.unclippedDepth),depthStencil:ha(t,n),multisample:ba(t,n)})}};function ef(e,t,n,r,i){let o=e.limits;for(let[s,a,c]of[["vertex",1,"maxStorageBuffersInVertexStage"],["fragment",2,"maxStorageBuffersInFragmentStage"]]){let l=r.find(f=>f.stage===s);if(!l)continue;let u=n.filter(f=>f.bindingLayout?.kind==="buffer"&&f.bindingLayout.buffer.type!=="uniform"&&i(f)&a),d=o[c]??o.maxStorageBuffersPerShaderStage;if(d!==void 0&&u.length>d)throw eo(t,s,l.name,u.length,d,u)}}var tf=["vertices","indices","instances","firstVertex","firstIndex","baseVertex","firstInstance"];function ca(e,t){return e.colors.map((n,r)=>{let i=t.colorStates?.[r],o=i?.blendState??t.blendState,s=i?.writeMask??t.writeMask,a={format:n};return o&&(a.blend=o),s!==void 0&&(a.writeMask=s),a})}function nf(e,t,n,r){Fe(e,"DrawOptions.instances",n.instances),Fe(e,"DrawOptions.vertices",n.vertices),Fe(e,"DrawOptions.firstInstance",n.firstInstance),Fe(e,"DrawCallOptions.instances",r.instances),Te(e,"DrawCallOptions.vertices",r.vertices),Te(e,"DrawCallOptions.indices",r.indices),Te(e,"DrawCallOptions.firstVertex",r.firstVertex),Te(e,"DrawCallOptions.firstIndex",r.firstIndex),Te(e,"DrawCallOptions.baseVertex",r.baseVertex),Fe(e,"DrawCallOptions.firstInstance",r.firstInstance),Fe(e,"GeometryLike.vertexCount",t?.vertexCount),Fe(e,"GeometryLike.indexCount",t?.indexCount),Fe(e,"GeometryLike.instanceCount",t?.instanceCount),Te(e,"GeometryLike.firstVertex",t?.firstVertex),Te(e,"GeometryLike.firstIndex",t?.firstIndex),Te(e,"GeometryLike.baseVertex",t?.baseVertex);let i=!!t?.indexBuffer,s=t?.geometry??(t&&we in t?t:void 0),a=r.firstVertex??t?.firstVertex??0,c=r.vertices??t?.vertexCount??n.vertices??3,l=r.firstIndex??t?.firstIndex??0,u=r.indices??t?.indexCount??0,d=r.baseVertex??t?.baseVertex??0;if(i)ua(e,"index",l,u,s?.indexCount);else if(r.indices!==void 0||r.firstIndex!==void 0||r.baseVertex!==void 0)throw ve(`${e}.draw`,"Index range needs an indexed geometry.");return i||ua(e,"vertex",a,c,s?.vertexCount),{instanceCount:r.instances??n.instances??t?.instanceCount??1,firstInstance:r.firstInstance??n.firstInstance??0,vertexCount:c,firstVertex:a,indexCount:u,firstIndex:l,baseVertex:d}}function Ea(e){let t=e?.topology??"triangle-list";return e?.stripIndexFormat??(t.endsWith("strip")?e?.indexFormat:void 0)}function la(e,t,n,r){let i=e?.topology??"triangle-list",o=Ea(e),s=o?{topology:i,stripIndexFormat:o}:{topology:i};return t!==void 0&&(s.cullMode=t),n!==void 0&&(s.frontFace=n),r&&(s.unclippedDepth=!0),s}function ua(e,t,n,r,i){if(!(i===void 0||n+r<=i))throw ve(`${e}.draw`,`${t} range [${n}, ${n+r}) exceeds parent geometry ${t} count ${i}.`)}function Te(e,t,n){if(!(n===void 0||Number.isInteger(n)&&n>=0))throw ve(`${e}.draw`,`${t} must be an integer >= 0; received ${String(n)}.`)}function Fe(e,t,n){if(n!==void 0&&!(Number.isInteger(n)&&n>=0))throw new h({code:"VGPU-R1-DRAW-COUNT",message:`${t} of '${e}' must be an integer >= 0; received ${String(n)}. Use 0 only when you want to issue a valid draw with no vertices/instances.`,where:`${e}.draw`})}function rf(e,t){let n=t.blend===void 0?void 0:ka(e,t.blend),r=t.writeMask===void 0?void 0:Ra(e,t.writeMask),i=t.colors===void 0?void 0:of(e,t.colors),o=i?`${ya(n,r)}@${i.map(Sf).join("@")}`:n||r!==void 0?ya(n,r):void 0;return{blendState:n,writeMask:r,colorStates:i,fragmentKey:o}}function of(e,t){if(!Array.isArray(t))throw Yt(e,`colors must be an array; received ${L(t)}.`);return t.map((n,r)=>{if(n==null)return null;if(typeof n!="object"||Array.isArray(n))throw Yt(e,`colors[${r}] must be null or { blend?, writeMask? }; received ${L(n)}.`);let i=n.blend===void 0?void 0:ka(`${e}.colors[${r}]`,n.blend),o=n.writeMask===void 0?void 0:Ra(`${e}.colors[${r}]`,n.writeMask);return!i&&o===void 0?null:{blendState:i,writeMask:o}})}function ka(e,t){if(t==="alpha")return Dn({src:"src-alpha",dst:"one-minus-src-alpha"},{src:"one",dst:"one-minus-src-alpha"});if(t==="premultiplied")return Dn({src:"one",dst:"one-minus-src-alpha"},{src:"one",dst:"one-minus-src-alpha"});if(t==="additive")return Dn({src:"one",dst:"one"},{src:"one",dst:"one"});if(typeof t!="object"||t===null||!da(t.color))throw nr(e,t);let n=t.color,r=t.alpha;if(r!==void 0&&!da(r))throw nr(e,t);return Dn(n,r??n)}function da(e){return typeof e=="object"&&e!==null&&typeof e.src=="string"&&typeof e.dst=="string"}function Dn(e,t){return{color:fa(e),alpha:fa(t)}}function fa(e){return{srcFactor:e.src,dstFactor:e.dst,operation:e.op??"add"}}function sf(e,t,n){if(t.blendConstant===void 0)return{};let r=t.blendConstant;if(!Array.isArray(r)||r.length!==4||r.some(i=>typeof i!="number"||!Number.isFinite(i)))throw rr(e,`received ${L(r)}; expected [r, g, b, a] finite numbers.`);if(!af(n).some(i=>i&&cf(i)))throw rr(e,`no color target's effective blend uses a "constant"/"one-minus-constant" factor (colors[i].blend replaces the top-level blend for that target), so blendConstant would have no effect.`);return{blendConstant:{r:r[0],g:r[1],b:r[2],a:r[3]}}}function af(e){return e.colorStates?e.colorStates.map(t=>t?.blendState??e.blendState):[e.blendState]}function cf(e){return[e.color.srcFactor,e.color.dstFactor,e.alpha.srcFactor,e.alpha.dstFactor].some(t=>t==="constant"||t==="one-minus-constant")}function lf(e,t){if(t===void 0)return{};if(typeof t!="object"||t===null||Array.isArray(t))throw Ye(e,`received ${L(t)}; expected { vertex?, fragment? } entry point names.`);return t}function uf(e,t,n){let r=e.entryPoints.find(o=>o.stage==="vertex"),i=e.entryPoints.find(o=>o.stage==="fragment");if(!(t===r&&n===i))return`en~${t?.name??""}~${n?.name??""}`}function df(e,t,n){let r=n.cull===void 0?void 0:pf(t,n.cull),i=n.frontFace===void 0?void 0:mf(t,n.frontFace),o=n.unclippedDepth===void 0?void 0:ff(e,t,n.unclippedDepth);return{cullMode:r,frontFace:i,unclippedDepth:o}}function ff(e,t,n){if(typeof n!="boolean")throw or(t,`received ${L(n)}; expected a boolean.`);if(n){if(!e.features.has("depth-clip-control"))throw or(t,'the device lacks the "depth-clip-control" feature; request it at init: init({ requiredFeatures: ["depth-clip-control"] }) on an adapter that supports it.');return!0}}function pf(e,t){if(t==="none"||t==="front"||t==="back")return t;throw so(e,t)}function mf(e,t){if(t==="ccw"||t==="cw")return t;throw ao(e,t)}var Pa={depthWriteEnabled:!0,depthCompare:"less-equal"},Ia=["never","less","equal","less-equal","greater","not-equal","greater-equal","always"],pa=-2147483648,ma=2147483647;function ha(e,t){if(e.depth)return{format:e.depth,...t.depthState??Pa,...t.stencilState??{}}}function hf(e,t,n){if(n.depth===void 0)return{};let r=gf(e,t,n.depth,n.geometry?.topology??"triangle-list");return{depthState:r,depthKey:xf(r)}}function gf(e,t,n,r){if(n===!1)return{depthWriteEnabled:!1,depthCompare:"always"};if(typeof n!="object"||n===null)throw Z(t,`received ${L(n)}.`);if(n.write!==void 0&&typeof n.write!="boolean")throw Z(t,`write must be a boolean; received ${L(n.write)}.`);if(n.compare!==void 0&&!Ia.includes(n.compare))throw Z(t,`compare must be a GPUCompareFunction; received ${L(n.compare)}.`);if(n.bias!==void 0&&!Number.isInteger(n.bias))throw Z(t,`bias must be an integer (WebGPU depthBias is i32); received ${L(n.bias)}.`);if(n.bias!==void 0&&(n.bias<pa||n.bias>ma))throw Z(t,`bias must fit in the i32 range [${pa}, ${ma}] (WebGPU depthBias is i32); received ${L(n.bias)}.`);if(n.biasSlopeScale!==void 0&&!Number.isFinite(n.biasSlopeScale))throw Z(t,`biasSlopeScale must be a finite number; received ${L(n.biasSlopeScale)}.`);if(n.biasClamp!==void 0&&!Number.isFinite(n.biasClamp))throw Z(t,`biasClamp must be a finite number; received ${L(n.biasClamp)}.`);let i=n.bias??0,o=n.biasSlopeScale??0,s=n.biasClamp??0;if((i!==0||o!==0||s!==0)&&!r.startsWith("triangle"))throw Z(t,`bias, biasSlopeScale, and biasClamp must be 0 for "${r}" topology.`);if(s!==0&&e.isCompatibilityMode)throw Z(t,`biasClamp must be 0 on a compatibility-mode device; received ${L(n.biasClamp)}.`);return{depthWriteEnabled:n.write??!0,depthCompare:n.compare??"less-equal",...i!==0?{depthBias:i}:{},...o!==0?{depthBiasSlopeScale:o}:{},...s!==0?{depthBiasClamp:s}:{}}}function xf(e){return`${e.depthWriteEnabled?1:0}~${e.depthCompare}~${e.depthBias??0}~${e.depthBiasSlopeScale??0}~${e.depthBiasClamp??0}`}var bf=["keep","zero","replace","invert","increment-clamp","decrement-clamp","increment-wrap","decrement-wrap"];function yf(e,t){if(t.stencil===void 0)return{};let n=t.stencil;if(typeof n!="object"||n===null||Array.isArray(n))throw Ue(e,`received ${L(n)}; expected { front?, back?, readMask?, writeMask?, ref? }.`);let r=n.front===void 0?void 0:ga(e,"front",n.front),i=n.back===void 0?void 0:ga(e,"back",n.back);Jr(e,"readMask",n.readMask),Jr(e,"writeMask",n.writeMask),Jr(e,"ref",n.ref);let o={...r?{stencilFront:r}:{},...i??r?{stencilBack:i??{...r}}:{},...n.readMask!==void 0?{stencilReadMask:n.readMask}:{},...n.writeMask!==void 0?{stencilWriteMask:n.writeMask}:{}},s=o.stencilFront!==void 0||o.stencilBack!==void 0||o.stencilReadMask!==void 0||o.stencilWriteMask!==void 0;return!s&&n.ref===void 0?{}:{...s?{stencilState:o,stencilKey:_f(o)}:{},...n.ref!==void 0?{stencilRef:n.ref}:{}}}function ga(e,t,n){if(typeof n!="object"||n===null||Array.isArray(n))throw Ue(e,`${t} must be a { compare?, fail?, depthFail?, pass? } object; received ${L(n)}.`);if(n.compare!==void 0&&!Ia.includes(n.compare))throw Ue(e,`${t}.compare must be a GPUCompareFunction; received ${L(n.compare)}.`);for(let[r,i]of[["fail",n.fail],["depthFail",n.depthFail],["pass",n.pass]])if(i!==void 0&&!bf.includes(i))throw Ue(e,`${t}.${r} must be a GPUStencilOperation; received ${L(i)}.`);return{compare:n.compare??"always",failOp:n.fail??"keep",depthFailOp:n.depthFail??"keep",passOp:n.pass??"keep"}}function Jr(e,t,n){if(n!==void 0&&(typeof n!="number"||!Number.isInteger(n)||n<0||n>4294967295))throw Ue(e,`${t} must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue is u32); received ${L(n)}.`)}function _f(e){return`st~${xa(e.stencilFront)}~${xa(e.stencilBack)}~${e.stencilReadMask??4294967295}~${e.stencilWriteMask??4294967295}`}function xa(e){return e?`${e.compare},${e.failOp},${e.depthFailOp},${e.passOp}`:"default"}function ba(e,t){return{count:e.sampleCount??1,...t.multisampleState??{}}}function vf(e,t){if(t.multisample===void 0)return{};let n=t.multisample;if(typeof n!="object"||n===null||Array.isArray(n))throw xt(e,`received ${L(n)}; expected { alphaToCoverage?, mask? }.`);if(n.alphaToCoverage!==void 0&&typeof n.alphaToCoverage!="boolean")throw xt(e,`alphaToCoverage must be a boolean; received ${L(n.alphaToCoverage)}.`);if(n.mask!==void 0&&(typeof n.mask!="number"||!Number.isInteger(n.mask)||n.mask<0||n.mask>4294967295))throw xt(e,`mask must be an integer in [0, 0xFFFFFFFF] (WebGPU GPUSampleMask is u32); received ${L(n.mask)}.`);let r={...n.alphaToCoverage!==void 0?{alphaToCoverageEnabled:n.alphaToCoverage}:{},...n.mask!==void 0?{mask:n.mask}:{}};return r.alphaToCoverageEnabled===void 0&&r.mask===void 0?{}:{multisampleState:r,multisampleKey:wf(r)}}function wf(e){return`ms~${e.alphaToCoverageEnabled?1:0}~${e.mask??4294967295}`}function Ra(e,t){if(!Array.isArray(t))throw ir(e,L(t));let n=0;for(let r of t)if(r==="r")n|=1;else if(r==="g")n|=2;else if(r==="b")n|=4;else if(r==="a")n|=8;else throw ir(e,L(r));return n}function ya(e,t){return`${Aa(e)};${t??15}`}function Aa(e){if(!e)return"none;none";let t=e.color,n=e.alpha;return`${t.srcFactor},${t.dstFactor},${t.operation};${n.srcFactor},${n.dstFactor},${n.operation}`}function Sf(e){return e?`${e.blendState?Aa(e.blendState):"inherit"};${e.writeMask??"inherit"}`:"inherit"}function L(e){if(typeof e=="string")return`"${e}"`;try{return JSON.stringify(e)??String(e)}catch{return String(e)}}function Ca(e,t){_(e).recordedIn.add(t)}function Ta(e){return _(e).blendConstant!==void 0}function Fa(e){return _(e).stencilRef!==void 0}function Ef(e){return(_(e).depthState??Pa).depthWriteEnabled}function kf(e){let t=_(e),n=t.stencilState;if(!n||n.stencilWriteMask===0)return[];let r=t.cullMode??"none",i=[],o=(s,a)=>{if(a)for(let[c,l]of[["fail",a.failOp],["depthFail",a.depthFailOp],["pass",a.passOp]])l!==void 0&&l!=="keep"&&i.push(`${s}.${c}: "${l}"`)};return r!=="front"&&o("front",n.stencilFront),r!=="back"&&o("back",n.stencilBack),i}function $n(e,t,n,r={},i){e.encode(t,n,r,i)}function _(e){let t=Sa.get(e);if(!t)throw new TypeError("Invalid Draw instance");return t}function _a(e,t,n,r){let i=(async()=>{await At(e.device),I(e.device,`${t}.validation`);let o=Q(t,n,r);e.errorSink?await e.errorSink(o):console.error(o)})();return e.trackSettled?.(i),i}function Pf(){let e=new Set;return{add(t){e.add(t)},delete(t){e.delete(t)},list(){return[...e]},markStale(t){for(let n of e)n.markStale(t)}}}function If(e,t,n){return e?Array.isArray(e)?e:e[t]??n:n}function Rf(e,t){let n=_(e);return yn(n.reflection.bindings,t,n.visibility).map(Af)}function Af(e){return e.buffer?{...e,buffer:{...e.buffer,hasDynamicOffset:!0}}:e}function va(e,t){if(lt(e)&&!Fn())throw Qe(t)}function La(e,t,n={}){if("geometry"in n)throw P("effect","effect() never accepts vertex buffers; use draw(gpu, { shader, geometry: geometry(gpu, descriptor) }).");let r=S(e,"effect"),i=Ce(r);return new Mt(r.device,dt(t),n,i.binds,void 0,i.pipelines,i.shaderModules,i.pipelineLayouts,o=>r.reportError(o),o=>{r.trackDelivery(o)})}var Da=new WeakMap,Mt=class{get gpu(){return Le(this).gpu}constructor(t,n,r={},i,o,s,a,c,l,u){let d=Cf(n),f=new Gt(t,d,{shader:d,set:r.set,label:r.label??"effect",blend:r.blend,writeMask:r.writeMask},i,o,s,a,c,l,u);Da.set(this,f)}set(t){return Le(this).set(t),this}draw(t={}){Le(this).draw(Re(t)?{target:t}:t)}compile(t){return Le(this).compile(t).then(()=>this)}compileSync(t){return Le(this).compileSync(t),this}encode(t,n,r={},i){$n(Le(this),t,n,r,i)}get[ut](){return Le(this)[ut]}};function $a(e){return Le(e)}function Le(e){let t=Da.get(e);if(!t)throw new TypeError("Invalid Effect instance");return t}function Cf(e){return Tf(e)?e:`
struct VgpuFullscreenVertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};
@vertex fn vgpu_fullscreen_vs(@builtin(vertex_index) vi: u32) -> VgpuFullscreenVertexOut {
  var pos = array<vec2f, 3>(vec2f(-1.0, -1.0), vec2f(3.0, -1.0), vec2f(-1.0, 3.0));
  var uv = array<vec2f, 3>(vec2f(0.0, 1.0), vec2f(2.0, 1.0), vec2f(0.0, -1.0));
  var out: VgpuFullscreenVertexOut;
  out.position = vec4f(pos[vi], 0.0, 1.0);
  out.uv = uv[vi];
  return out;
}
${e}`}function Tf(e){return nt(e,"effect.wgsl").entryPoints.some(t=>t.stage==="vertex")}function Ma(e,t,n){return Lf(S(e,"bundle").device,t,n)}var Ff=1,ei=0;function Lf(e,t,n){let r=t.label??`bundle${Ff++}`;if(lt(t.target)&&!Fn())throw Qe("bundle");let i=Ua(t.target),o=new ti(e,r,i);return o.record(n),o}var ti=class{device;id;signature;gpu;#e;#t;#n=new Set;constructor(t,n,r){this.device=t,this.id=n,this.signature=r,this.#t=ct(r)}record(t){this.gpu=Qo(this.device,{label:this.id,colorFormats:this.signature.colors,depthStencilFormat:this.signature.depth,sampleCount:this.signature.sampleCount??1,record:n=>this.#r(t,n.gpu)});for(let n of this.#n)Ca(n,this)}get[Qr](){return this}markStale(t){ei>0||(this.#e??=t)}assertReplayable(t){let n=Ua(t),r=ct(n);if(this.#t!==r)throw Ga(this.id,Df(this.id,this.#t,r));if(this.#e)throw Ga(this.id,$f(this.id,this.#e))}remember(t){this.#n.add(t)}#r(t,n){ei+=1;try{t(new ni(this,n))}finally{ei-=1}}},ni=class{bundle;encoder;constructor(t,n){this.bundle=t,this.encoder=n}draw(t,n={}){let r=t instanceof Mt?$a(t):t;if(Ta(r))throw oo(this.bundle.id,r.label);if(Fa(r))throw co(this.bundle.id,r.label);this.bundle.remember(r),$n(r,this.encoder,this.bundle.signature,n)}};function Ua(e){let t=Sn(e);return En(t,"bundle"),t}function Df(e,t,n){return`bundle '${e}' is stale: the replay target signature does not match the recorded signature. Bundles freeze format/depth/sampleCount and bind groups.
  Recorded signature: ${t}
  Actual signature: ${n}
  Fix: re-record the bundle for this target \u2192 ${e} = bundle(gpu, { target: scene }, ...)
  (re-recording is always your responsibility; the library only detects this).`}function $f(e,t){return t.kind==="group-claim"?`bundle '${e}' is stale: group ${t.group} of draw
  '${t.drawLabel}' changed bind group after recording. Bundles freeze commands and bind groups.
  Fix: re-record it \u2192 ${e} = bundle(gpu, { target: scene }, ...)
  (re-recording is always your responsibility; the library only detects this).`:`bundle '${e}' is stale: binding \`${t.bindingName}\` (@group(${t.group}) @binding(${t.binding})) of draw
  '${t.drawLabel}' changed resource after recording. Bundles freeze commands and bind groups.
  Fix: re-record it \u2192 ${e} = bundle(gpu, { target: scene }, ...)
  (re-recording is always your responsibility; the library only detects this).`}function Ga(e,t){return new h({code:"VGPU-R3-BUNDLE-STALE",message:t,where:`bundle '${e}' replay`})}var Gf=re("clock");function Ba(e){return Mf(S(e,"clock"))}function Mf(e){return e.service(Gf,t=>{let n=Ae(t),r=i=>{if(t.disposed)throw xr(i);I(t.device,i)};return{get time(){return r("clock.time"),n.time},get deltaTime(){return r("clock.deltaTime"),n.deltaTime},get frameCount(){return r("clock.frameCount"),n.frameCount},advance(i){if(r("clock.advance"),typeof i!="number"||!Number.isFinite(i)||i<0)throw Do(i);n.advanceBy(i)}}})}function Oa(e,t,n={}){let r=S(e,"compute");return new ri(r.device,dt(t),n,Ce(r).binds)}var Uf=1,ri=class{device;source;opts;cache;id=Uf++;label;reflection;entryPoint;setCore;bindGroupLayouts;pipelineLayout;shaderModule;pipeline;#e;constructor(t,n,r={},i=it()){this.device=t,this.source=n,this.opts=r,this.cache=i,I(t,"Compute.constructor"),this.label=r.label??"compute",this.reflection=nt(n,`${this.label}.wgsl`);let o=Bf(this.reflection,this.label,r.entry);this.entryPoint=o.name;let{constants:s}=kn(this.label,r.constants,this.reflection.overrides,"compute");this.bindGroupLayouts=Tt(t,this.label,this.reflection,bn(this.reflection.bindings,[o])),this.pipelineLayout=Vr(t,this.bindGroupLayouts),this.shaderModule=t.gpu.createShaderModule({label:`${this.label}.shader`,code:n}),this.pipeline=t.gpu.createComputePipeline({label:`${this.label}.pipeline`,layout:this.pipelineLayout,compute:{module:this.shaderModule,entryPoint:this.entryPoint,...s?{constants:s}:{}}}),this.setCore=vn({device:t,label:this.label,drawId:this.id,reflection:this.reflection,bindGroupLayouts:this.bindGroupLayouts,cache:this.cache});let a=new Set(xe(o,"bindings",this.label).map(c=>`${c.group}:${c.binding}`));this.#e=this.reflection.bindings.filter(c=>c.kind==="buffer"&&c.addressSpace==="storage"&&a.has(`${c.group}:${c.binding}`)),r.set&&this.set(r.set)}set(t){return I(this.device,`${this.label}.set`),this.setCore.set(t),this}dispatch(t,n,r){I(this.device,`${this.label}.dispatch`);let i=typeof t=="object"&&t!==null?this.#t(t,n,r):void 0;this.#n();let o=this.device.gpu.createCommandEncoder({label:`${this.label}.encoder`}),s=o.beginComputePass({label:`${this.label}.pass`});s.setPipeline(this.pipeline);for(let a of this.setCore.bindGroups())s.setBindGroup(a.group,a.bindGroup,a.offsets);i?s.dispatchWorkgroupsIndirect(i.buffer,i.offset):s.dispatchWorkgroups(t,n??1,r??1),s.end(),this.device.gpu.queue.submit([o.finish()])}#t(t,n,r){let i=`${this.label}.dispatch`;if(n!==void 0||r!==void 0)throw J(this.label,"indirect cannot be combined with explicit workgroup counts in the same call; the GPU reads the counts from the buffer, so the CPU-side values would be ignored.",i);return Ln(this.label,i,t.indirect,"dispatchWorkgroupsIndirect")}#n(){if(!this.#e.length)return;let t=new Map;for(let n of this.#e){let r=this.setCore.bindingState(n.name);if(!r)continue;let i=rt(r.identity);t.has(i)||t.set(i,[]),t.get(i).push({identity:r.identity,writable:n.access!=="read"})}for(let n of t.values())if(!(n.length<2)&&n.some(r=>r.writable))throw Uo(`${this.label}.dispatch`)}};function Bf(e,t,n){let r=Dt(t,e.entryPoints,"compute",n,"compute");if(!r)throw P(`${t}.compute`,"The compute shader requires a @compute entry point.");return r}function Va(e,t){return Wa(S(e,"frame")).frame(t)}function Na(e,t,n={}){return Wa(S(e,"frameLoop")).loop(t,n)}var za,Of=re("frame-runner");function Wa(e){return e.service(Of,t=>{let n=Ae(t);return new si(()=>{let r=()=>{},i=new ii(t.device,void 0,o=>t.reportError(o),o=>{t.trackDelivery(o)},()=>r());return r=t.own("scheduler",()=>i.cancel()),i},()=>n.tick(),r=>t.own("scheduler",()=>r.stop()))})}var ii=class{device;defaultTarget;errorSink;trackSettled;releaseLifecycle;done=Promise.resolve();#e;#t=[];#n=new Set;#r=new Set;#i=!1;#o=!1;#s=!1;static{za=t=>!(#i in t)||!t.#i&&!t.#o}constructor(t,n,r,i,o){this.device=t,this.defaultTarget=n,this.errorSink=r,this.trackSettled=i,this.releaseLifecycle=o,I(t,"Frame.constructor"),this.#e=t.gpu.createCommandEncoder({label:"vgpu.frame"})}pass(t,n){if(this.#o)throw pr("Frame.pass");I(this.device,"Frame.pass");let r=Re(t),i=typeof n=="function"?n:g=>g.draw(n),o=r?t:t.target??this.defaultTarget;if(!o)throw yt("Frame.pass");if(lt(o)&&this.#i)throw Qe("Frame.pass");let s=r?void 0:t.clear,a=s===!1;if(a&&o.sampleCount===4)throw lo();let c=r?void 0:t.clearDepth;if(c!==void 0){if(typeof c!="number"||!(c>=0&&c<=1))throw sr(c);if(a)throw uo();if(!o.depth)throw sr(c,"but the target has no depth attachment, so clearDepth would have no effect.","Create the target with depth: true (or a depth format), or drop clearDepth.")}let l=r?void 0:t.clearStencil;if(l!==void 0){if(typeof l!="number"||!Number.isInteger(l)||l<0||l>4294967295)throw ar(`received ${String(l)}; expected an integer in [0, 0xFFFFFFFF] (WebGPU GPUStencilValue).`);if(a)throw fo();let g=o.depth?.format;if(!We(g))throw ar(`received ${String(l)}, but the target's depth format ${g?`"${g}"`:"(none)"} has no stencil aspect, so clearStencil would have no effect.`)}let u=r?void 0:t.depthReadOnly;if(u!==void 0&&typeof u!="boolean")throw be(`received ${De(u)}; expected a boolean.`,"Pass depthReadOnly: true to open the pass with a read-only depth attachment, or omit it.");if(u){if(!o.depth)throw be("is set, but the target has no depth attachment, so there is nothing to make read-only.","Create the target with depth: true (or a depth format), or drop depthReadOnly.");if(o.sampleCount===4)throw po();if(c!==void 0)throw be("cannot be combined with clearDepth; a read-only depth aspect omits its load/store ops and is never cleared.","Remove clearDepth, or drop depthReadOnly.");if(l!==void 0)throw be("cannot be combined with clearStencil; a read-only stencil aspect omits its load/store ops and is never cleared.","Remove clearStencil, or drop depthReadOnly.")}let d=r?void 0:jf(t.viewport,this.device.gpu.limits,o.size),f=r?void 0:Hf(t.scissor,o.size),m=[],x;try{let g=r||t.timer===void 0?void 0:this.#c(t.timer,o,m,Wf),k=(r||t.visibility===void 0?void 0:this.#c(t.visibility,o,m,qf))?.occlusion,C=o.renderPassDescriptor({clear:s===void 0||s===!0||s===!1?o.clearColor??st:s,preserve:a,clearDepth:c,clearStencil:l,depthReadOnly:u});g?.timestampWrites&&(C={...C,timestampWrites:g.timestampWrites}),k&&(C={...C,occlusionQuerySet:k.querySet}),x=this.#e.beginRenderPass(C),d&&x.setViewport(d.x,d.y,d.width,d.height,d.minDepth,d.maxDepth),f&&x.setScissorRect(f[0],f[1],f[2],f[3]),this.#s=!0;try{i(new oi(x,o,this.#t,u===!0,k,this,T=>{if(I(this.device,T),this.#o)throw pr(T)}))}finally{this.#s=!1}}catch(g){this.#u(m),V(this.#t),this.#t.length=0,pn(this.device);try{x?.end()}catch{}throw g}hn(this.device,x,this.#t)}submit(){if(this.#i||this.#o)return;I(this.device,"Frame.submit"),this.#i=!0,this.releaseLifecycle?.();for(let i of this.#d())i.finalizeFrame(this,this.#e);let t,n=this.#t[0]?.context;n&&ze(this.device,n);try{t=this.#e.finish()}catch(i){this.#l(this.#a());let o=n?W(this.device):void 0;V(this.#t),o&&V([o]);let s=o?.context??n;if(!s)throw i;this.done=this.#p(this.#f(s.label,s.group,i));return}if(n){let i=W(this.device);i&&(this.#t[0]=this.#t[0]?ot(i,this.#t[0]):i)}let r=this.#t[0]?.context;r&&ze(this.device,r);try{this.device.gpu.queue.submit([t])}catch(i){this.#l(this.#a());let o=r?W(this.device):void 0;V(this.#t),o&&V([o]);let s=o?.context??r;if(!s)throw i;this.done=this.#p(this.#f(s.label,s.group,i));return}if(r){let i=W(this.device);i&&(this.#t[0]=this.#t[0]?ot(i,this.#t[0]):i)}for(let i of this.#d())i.frameSubmitted(this);this.#l(this.#r),this.done=this.#p(mn(this.device,this.#t,{errorSink:this.errorSink}))}cancel(){if(!this.#o){if(this.#i)throw Mo("Frame.cancel");if(this.#s)throw Go("Frame.cancel");this.#o=!0,this.releaseLifecycle?.(),this.#l(this.#a()),this.#n.clear(),this.#r.clear(),V(this.#t),this.#t.length=0}}#l(t){for(let n of[...t])n.frameAbandoned(this)}#a(){return[...this.#n,...this.#r]}#u(t){for(let n of[...t])this.#n.delete(n),this.#r.add(n)}#d(){return[...this.#n].filter(t=>!this.#r.has(t))}#c(t,n,r,i){let o=ia(t);if(!o)throw i(t);let s;try{s=o[qe]({frame:this,device:this.device,target:n})}catch(a){throw this.#u(this.#n),a}return this.#n.add(s.owner),r.push(s.owner),s}async#f(t,n,r){await At(this.device),I(this.device,"Frame.validation");let i=Q(t,n,r);this.errorSink?await this.errorSink(i):console.error(i)}#p(t){return this.trackSettled?.(t),t}},oi=class{encoder;target;validations;depthReadOnly;occlusionSource;frame;assertFrameOpen;#e=!1;constructor(t,n,r,i=!1,o,s,a){this.encoder=t,this.target=n,this.validations=r,this.depthReadOnly=i,this.occlusionSource=o,this.frame=s,this.assertFrameOpen=a}draw(t,n={}){this.assertFrameOpen?.("FramePass.draw");let r=Nf(t);this.depthReadOnly&&Vf(r,this.target),r.encode(this.encoder,this.target,n,i=>this.validations.push(i))}occlusion(t,n){if(this.assertFrameOpen?.("FramePass.occlusion"),!this.occlusionSource)throw yo();if(this.#e)throw _o();let r=this.occlusionSource.beginQuery(t,this.frame);this.encoder.beginOcclusionQuery(r),this.#e=!0;try{typeof n=="function"?n():this.draw(n)}finally{this.#e=!1,this.encoder.endOcclusionQuery()}}bundles(...t){if(this.assertFrameOpen?.("FramePass.bundles"),this.depthReadOnly)throw be("pass cannot replay bundles: bundle records bundles with writable depth/stencil, and WebGPU only executes read-only-recorded bundles in a read-only pass.","Encode the draws directly with pass.draw(...) inside the depthReadOnly pass.","FramePass.bundles");let n=t.map(r=>ra(r)??zf());for(let r of n)r.assertReplayable(this.target);this.encoder.executeBundles(n.map(r=>r.gpu))}};function Vf(e,t){if(e.writesDepth())throw be(`pass cannot encode draw '${e.label}': its depth state writes depth (the default is write: true). Give the draw depth: { write: false } (or depth: false to disable depth testing).`,"Use depth: { write: false } on the draw, or open the pass without depthReadOnly.","FramePass.draw");if(We(t.depth?.format)){let n=e.stencilWritingOps();if(n.length)throw be(`pass cannot encode draw '${e.label}': its stencil ops can write (${n.join(", ")}), and the pass's stencil aspect is read-only too.`,'Use "keep" for those ops or stencil writeMask: 0, or open the pass without depthReadOnly.',"FramePass.draw")}}function Nf(e){let t=na(e);if(!t)throw new TypeError("Invalid Effect instance: pass.draw() expects a Draw or an Effect created by this library.");return t}function zf(){throw new h({code:"VGPU-R3-BUNDLE-INVALID",message:"p.bundles() expected bundles created by bundle(gpu, { target }, cb).",where:"FramePass.bundles"})}function Wf(e){return ye(`FramePassOptions.timer received ${De(e)}; expected a TimerSpan from timer.span(name).`,'Create const passTimer = timer(gpu) once, then pass passTimer.span("name") per pass.',"Frame.pass")}function qf(e){return _e(`FramePassOptions.visibility received ${De(e)}; expected a Visibility from visibility(gpu).`,"Create const vis = visibility(gpu) once, then pass { target, visibility: vis } per pass.","Frame.pass")}function jf(e,t,n){if(e===void 0)return;if(typeof e!="object"||e===null||Array.isArray(e))throw ee(`received ${De(e)}; expected { x?, y?, width, height, minDepth?, maxDepth? }.`);let{x:r=0,y:i=0,width:o,height:s,minDepth:a=0,maxDepth:c=1}=e;for(let[f,m]of[["x",r],["y",i],["width",o],["height",s],["minDepth",a],["maxDepth",c]])if(typeof m!="number"||!Number.isFinite(m))throw ee(`${f} received ${De(m)}; expected a finite number.`);let l=t.maxTextureDimension2D,u=l*2,d=`target is ${n[0]}x${n[1]}px, device maxTextureDimension2D is ${l}`;if(!(o>=0&&o<=l))throw ee(`width ${o} is outside [0, ${l}] (${d}).`);if(!(s>=0&&s<=l))throw ee(`height ${s} is outside [0, ${l}] (${d}).`);if(!(r>=-u&&r+o<=u-1))throw ee(`x ${r} with width ${o} is outside [${-u}, ${u-1}] (${d}).`);if(!(i>=-u&&i+s<=u-1))throw ee(`y ${i} with height ${s} is outside [${-u}, ${u-1}] (${d}).`);if(!(a>=0&&a<=1))throw ee(`minDepth ${a} is outside [0, 1].`);if(!(c>=0&&c<=1))throw ee(`maxDepth ${c} is outside [0, 1].`);if(!(a<=c))throw ee(`minDepth ${a} exceeds maxDepth ${c}.`);return{x:r,y:i,width:o,height:s,minDepth:a,maxDepth:c}}function Hf(e,t){if(e===void 0)return;if(!Array.isArray(e)||e.length!==4)throw Xt(`received ${De(e)}; expected [x, y, width, height].`);let[n,r,i,o]=e;for(let[c,l]of[["x",n],["y",r],["width",i],["height",o]])if(typeof l!="number"||!Number.isInteger(l)||l<0)throw Xt(`${c} received ${De(l)}; expected a non-negative integer.`);let[s,a]=t;if(n+i>s||r+o>a)throw Xt(`[${n}, ${r}, ${i}, ${o}] exceeds the target's current size ${s}x${a}px (x + width <= ${s}, y + height <= ${a}).`);return[n,r,i,o]}function De(e){return typeof e=="string"?`'${e}'`:Array.isArray(e)?`[${e.map(t=>De(t)).join(", ")}]`:typeof e=="object"&&e!==null?"an object":String(e)}function Kf(e){let t=e?.code;return t==="VGPU-DEVICE-DISPOSED"||t==="VGPU-DEVICE-LOST"}var si=class{createFrame;advance;trackLoop;#e=!1;constructor(t,n,r){this.createFrame=t,this.advance=n,this.trackLoop=r}frame(t){if(this.#e||Xs())throw Zt();this.#e=!0,Qs();try{this.advance();let n=this.createFrame();if(t){try{t(n)}catch(r){if(za(n))try{n.cancel()}catch{}throw r}try{n.submit()}catch(r){if(!Kf(r))throw r}}return n}finally{Zs(),this.#e=!1}}loop(t,n={}){let r=!1,i=globalThis.requestAnimationFrame??(m=>setTimeout(()=>m(performance.now()),16)),o=globalThis.cancelAnimationFrame??(m=>clearTimeout(m)),s=n.fps&&n.fps>0?1e3/n.fps:0,a,c=0,l,u=()=>{r=!0,o(c),l?.(),l=void 0},d=m=>{if(!r){if(Yf(m,a,s)){a=m;try{this.frame(t)}catch(x){throw u(),x}}r||(c=i(d))}};c=i(d);let f={stop:u};return l=this.trackLoop?.(f),f}};function Yf(e,t,n){return t===void 0||n<=0?!0:e-t>=n}function qa(e,t){return new ft(S(e,"target").device,t)}var ft=class{device;options;resourceIdentity=ue("render-target");#e=new Y;#t=new Set;#n;#r;#i;#o;#s;constructor(t,n){this.device=t,this.options=n,Bs(n,t),this.#s=n.clearColor===void 0?st:at(n.clearColor,"target.clearColor"),this.#n=n.size,this.#r=this.#d(),this.#i=this.sampleCount===4?this.#c():void 0,this.#o=this.#f()}get gpu(){return this.color.gpu}get size(){return this.#n}get texelSize(){return[1/this.#n[0],1/this.#n[1]]}get color(){return this.#r[0]}get colors(){return this.#r}get depth(){return this.#o}get format(){return Lt(this.options)[0]?.format??"rgba8unorm"}get clearColor(){return Ft(this.#s)}set clearColor(t){this.#s=at(t,"target.clearColor")}get sampleCount(){return jr(this.options)}resize(t){wn(this.#n,t)||this.#l(t)}async read(){return this.color.read()}async readFloats(){return this.color.readFloats()}onDestroy(t){return this.#e.onDestroy(this,t)}onTexturesRecreated(t){return this.#t.add(t),()=>{this.#t.delete(t)}}destroy(){this.#e.emit(this),this.#t.clear(),this.#u()}renderPassDescriptor(t={}){let{clear:n=[0,0,0,1],preserve:r,clearDepth:i,clearStencil:o,depthReadOnly:s}=t;return{colorAttachments:this.#r.map((a,c)=>Os(a,this.#i?.[c],n,r)),depthStencilAttachment:this.#o?Vs(this.#o,r,i,o,s):void 0}}#l(t){this.#u(),this.#n=[t[0],t[1]],this.#r=this.#d(),this.#i=this.sampleCount===4?this.#c():void 0,this.#o=this.#f(),this.#a()}#a(){for(let t of[...this.#t])t()}#u(){for(let t of this.#r)t.destroy();for(let t of this.#i??[])t.destroy();this.#o?.destroy()}#d(){return Lt(this.options).map((t,n)=>this.device.createTexture({size:this.#n,format:t.format,usage:["render_attachment","texture_binding","copy_src"],sampleCount:1,label:this.options.label?`${this.options.label}.color${n}.resolve`:void 0}))}#c(){return Lt(this.options).map((t,n)=>this.device.createTexture({size:this.#n,format:t.format,usage:["render_attachment"],sampleCount:4,label:this.options.label?`${this.options.label}.color${n}`:void 0}))}#f(){let t=qr(this.options);return t?this.device.createTexture({size:this.#n,format:t,usage:["render_attachment","texture_binding"],sampleCount:this.sampleCount,label:this.options.label?`${this.options.label}.depth`:void 0}):void 0}};function ja(e,t,n="read-write"){let r=S(e,"storage"),i=typeof n=="string"?{access:n}:n,o=Gn(r.device,t,i.access??"read-write",void 0,i.indirect??!1);return pe(r,o,s=>s.destroy(),s=>{o.onDestroy(s)})}var ai=class e{size;access;buffer;constructor(t,n){this.buffer=t,this.access=n,this.size=t.options.size}static create(t,n,r,i,o=!1){let s=o?["storage","copy_dst","copy_src","indirect"]:["storage","copy_dst","copy_src"],a=t.createBuffer({size:n,usage:s,label:i});return new e(a,r)}read(){return this.buffer.read(this.size)}write(t,n=0){this.buffer.write(Xf(t),n)}get gpu(){return this.buffer.gpu}get resourceIdentity(){return this.buffer.resourceIdentity}onDestroy(t){return this.buffer.onDestroy(t)}destroy(){this.buffer.destroy()}};function Gn(e,t,n,r,i=!1){return ai.create(e,t,n,r,i)}function Xf(e){if(e instanceof ArrayBuffer||ArrayBuffer.isView(e))return e;throw new TypeError("StorageBuffer.write() requires ArrayBuffer or ArrayBufferView.")}function Ya(e,t,n,r={}){let i=S(e,"pingPong");return Jf(i.device,t,n,r,o=>Qf(i,o))}function Xa(e,t){let n=S(e,"pingPongStorage");return ep(n.device,t,"read-write",r=>Zf(n,r))}function Qf(e,t){return pe(e,t,n=>n.destroy(),n=>{t.onDestroy(n)})}function Zf(e,t){return pe(e,t,n=>n.destroy(),n=>{t.onDestroy(n)})}function Jf(e,t,n,r={},i=Qa){let o=[Ha(t),Ha(n)],s={...r,size:o},a=i(new ft(e,Ka(s,r.label,"ping"))),c=i(new ft(e,Ka(s,r.label,"pong")));return new ci([a,c])}function ep(e,t,n="read-write",r=Qa){let i=r(Gn(e,t,n,void 0)),o=r(Gn(e,t,n,void 0));return new li([i,o])}function Qa(e){return e}var ci=class{halves;#e=0;constructor(t){this.halves=t}get read(){return this.halves[this.#e]}get write(){return this.halves[this.#e^1]}swap(){this.#e^=1}},li=class{halves;#e=0;constructor(t){this.halves=t}get read(){return this.halves[this.#e]}get write(){return this.halves[this.#e^1]}swap(){this.#e^=1}};function Ha(e){return Math.max(1,Math.floor(e))}function Ka(e,t,n){return t?{...e,label:`${t}.${n}`}:e}var ui=8,tp=globalThis.GPUMapMode?.READ??1;function Mn(e,t){return new di(e,t)}var di=class{querySet;capacity;#e;#t;#n;#r;#i;#o=0;#s=0;#l=-1;#a;#u=0;#d=0;#c=!1;#f=!1;constructor(t,n){this.capacity=n.capacity;let r=n.label??"vgpu.query-ring";this.#e=r;let i=n.capacity*ui;this.querySet=t.gpu.createQuerySet({type:n.type,count:n.capacity,label:r}),this.#t=t.createBuffer({size:i,usage:["query_resolve","copy_src"],label:`${r}.resolve`}),this.#n=Array.from({length:n.depth??3},(o,s)=>({buffer:t.createBuffer({size:i,usage:["map_read","copy_dst"],label:`${r}.staging${s}`}),mapPending:!1,retired:!1})),this.#r=n.trackSettled,this.#i=n.errorSink}encodeResolve(t,n){if(this.#a=void 0,this.#c||n<=0)return!1;let r=this.#p();if(!r)return!1;let i=Math.min(n,this.capacity);return t.resolveQuerySet(this.querySet,0,i,this.#t.gpu,0),t.copyBufferToBuffer(this.#t.gpu,0,r.buffer.gpu,0,i*ui),this.#a={staging:r,usedCount:i,seq:this.#s},this.#s+=1,this.#o+=1,!0}onSubmitted(t){let n=this.#a;if(this.#a=void 0,!n)return;n.staging.mapPending=!0,this.#u+=1;let r=n.staging.buffer.gpu.mapAsync(tp).then(()=>{let i=this.#m(n);n.seq<=this.#l||(this.#l=n.seq,t(i))}).catch(i=>{this.#x(i)}).finally(()=>{n.staging.mapPending=!1,this.#u-=1,this.#g()});this.#r?.(r)}#p(){for(let t=0;t<this.#n.length;t+=1){let n=this.#n[this.#o%this.#n.length];if(!n.retired)return n.mapPending?void 0:n;this.#o+=1}}#m(t){let n;try{n=new BigUint64Array(t.staging.buffer.gpu.getMappedRange().slice(0,t.usedCount*ui))}catch(r){throw this.#h(t.staging),r}try{t.staging.buffer.gpu.unmap()}catch(r){throw t.staging.retired=!0,r}return n}#h(t){try{t.buffer.gpu.unmap()}catch{t.retired=!0}}retain(){this.#d+=1}release(){this.#d>0&&(this.#d-=1),this.#g()}dispose(){this.#c||(this.#c=!0,this.#a=void 0,this.#g())}#g(){if(!(!this.#c||this.#f||this.#u>0||this.#d>0)){this.#f=!0,this.querySet.destroy(),this.#t.dispose();for(let t of this.#n)t.buffer.dispose()}}#x(t){let n=$o(this.#e,t),r=this.#i;if(!r){console.error(n);return}try{Promise.resolve(r(n)).catch(i=>{console.error(i)})}catch(i){console.error(i)}}};var Za=32,fi=4096,Ja=fi/2,np=1/1e6,pi=class{name;owner;constructor(t,n){this.name=t,this.owner=n}[qe](t){return{owner:this.owner,timestampWrites:this.owner.attachSpan(this,t.frame,t.device)}}};function ec(e){let t=S(e,"timer");return Jt(t,n=>new mi(t.device,n))}var mi=class{#e;#t;#n=new Map;#r=new Set;#i;#o=Za*2;#s=Za*2;#l;#a=[];#u=new Set;#d=0;#c;#f=0;#p=-1;#m=new Map;#h=!1;constructor(t,n={}){if(!t.features.has("timestamp-query"))throw ye('timer(gpu) needs the "timestamp-query" device feature \u2014 request it at init: init({ requiredFeatures: ["timestamp-query"] }).','Pass init({ requiredFeatures: ["timestamp-query"] }) on an adapter that supports it; gate optional timing on gpu.device.features.has("timestamp-query").');this.#e=t,this.#t=n,this.#i=this.#_()}span(t){if(this.#b("Timer.span"),typeof t!="string"||t.length===0)throw ye(`span name received ${ip(t)}; expected a non-empty string.`,'Name each timed pass, e.g. timer.span("shadows").',"Timer.span");let n=this.#n.get(t);return n||(n=new pi(t,this),this.#n.set(t,n)),n}onResults(t){return this.#b("Timer.onResults"),this.#r.add(t),()=>{this.#r.delete(t)}}dispose(){this.#h||(this.#h=!0,this.#r.clear(),this.#n.clear(),this.#u.clear(),this.#a=[],this.#c=void 0,this.#i.dispose(),this.#t.onDispose?.())}attachSpan(t,n,r){if(this.#b("Frame.pass"),r!==this.#e)throw ye(`span '${t.name}' belongs to a timer created on a different gpu; timestamp queries cannot cross devices.`,"Create one timer(gpu) per gpu and use its spans only with that gpu's frames.","Frame.pass");if(n!==this.#l&&this.#g(n),this.#u.has(t.name))throw ye(`duplicate span '${t.name}' in one frame; each result key holds a single begin/end pair per frame.`,`Use one timer.span(name) per pass per frame, e.g. timer.span("${t.name}-2") for the second pass.`,"Frame.pass");if(this.#u.size>=Ja)throw mo(Ja,fi);this.#u.add(t.name);let i=this.#u.size*2-2;if(this.#s<i+2&&(this.#s=i+2),!(i+2>this.#i.capacity))return this.#d=i+2,this.#a.push({name:t.name,begin:i}),this.#v(n),{querySet:this.#i.querySet,beginningOfPassWriteIndex:i,endOfPassWriteIndex:i+1}}finalizeFrame(t,n){this.#c=void 0,!(this.#h||t!==this.#l||this.#d===0)&&this.#i.encodeResolve(n,this.#d)&&(this.#c=[...this.#a])}frameSubmitted(t){if(this.#y(t),t!==this.#l||this.#h)return;let n=this.#c;if(this.#c=void 0,!n||n.length===0)return;let r=this.#f;this.#f+=1,this.#i.onSubmitted(i=>{r<=this.#p||(this.#p=r,this.#x(n,i))})}frameAbandoned(t){t===this.#l&&(this.#c=void 0),this.#y(t)}#g(t){this.#s>this.#i.capacity&&(this.#i.dispose(),this.#o=Math.min(fi,rp(this.#s)),this.#i=this.#_()),this.#s=this.#o,this.#l=t,this.#a=[],this.#u.clear(),this.#d=0}#x(t,n){let r={};for(let{name:o,begin:s}of t){let a=n[s]??0n,c=n[s+1]??0n;r[o]=c>a?Number(c-a)*np:0}let i=Object.freeze(r);for(let o of[...this.#r])try{o(i)}catch(s){console.error(s)}}#v(t){this.#m.has(t)||(this.#m.set(t,this.#i),this.#i.retain())}#y(t){let n=this.#m.get(t);n&&(this.#m.delete(t),n.release())}#_(){return Mn(this.#e,{type:"timestamp",capacity:this.#o,label:"vgpu.timer",trackSettled:this.#t.trackSettled,errorSink:this.#t.errorSink})}#b(t){if(this.#h)throw ye("the timer is disposed.","Create a new timer with timer(gpu).",t)}};function rp(e){let t=1;for(;t<e;)t*=2;return t}function ip(e){return typeof e=="string"?`'${e}'`:String(e)}function hi(e){return JSON.stringify(gi(e))}function Ut(e,t={}){return e.members?.length?sp(e.members,t.abbreviated===!0):e.element?ap(e):xi(e.type)}function gi(e){return{type:pt(e.type),align:e.align,size:e.size,stride:e.stride,members:e.members?.map(op),element:e.element?gi(e.element):void 0}}function op(e){return{name:e.name,offset:e.offset,align:e.align,size:e.size,explicitAlign:e.explicitAlign,explicitSize:e.explicitSize,type:pt(e.type),layout:gi(e.layout)}}function pt(e){switch(e.kind){case"scalar":return{scalar:e.name};case"vector":return{vector:e.width,element:pt(e.element)};case"matrix":return{matrix:[e.columns,e.rows],element:pt(e.element)};case"array":return{array:pt(e.element),count:e.count??e.countExpression};case"atomic":return{atomic:pt(e.element)};default:return e.kind}}function sp(e,t){let n=t?e.slice(0,1):e,r=t&&e.length>1?", ...":"";return`{ ${n.map(cp).join(", ")}${r} }`}function ap(e){let t=up(e.type),n=t===void 0?"":`, ${t}`;return`array<${Ut(e.element)}${n}>`}function cp(e){return`${e.name}: ${Ut(e.layout)}`}function xi(e){switch(e.kind){case"scalar":return e.name;case"vector":return`vec${e.width}${tc(e.element)}`;case"matrix":return`mat${e.columns}x${e.rows}${tc(e.element)}`;case"array":return lp(e);case"identifier":return e.name;case"atomic":return`atomic<${xi(e.element)}>`;default:return e.kind}}function lp(e){let t=e.count??e.countExpression,n=t===void 0?"":`, ${t}`;return`array<${xi(e.element)}${n}>`}function tc(e){return e.kind!=="scalar"?"":e.name==="bool"?"b":e.name.slice(0,1)}function up(e){return e.kind==="array"?e.count??e.countExpression:void 0}var bi=class{device;#e;#t;#n;constructor(t,n){this.device=t,this.#e=ic(n)}get buffer(){return this.#n}get gpu(){return this.#n?.gpu}get size(){return this.#t?.layout.size}set(t){rc(this.#e,t),this.#s()}[St](t,n){dp(t);let r=this.#r(t,n),i=this.#l();return wt(i,`${n}.set`),{resource:{buffer:i.gpu,offset:0,size:r.layout.size},identity:i.resourceIdentity,unsubscribe:o=>i.onDestroy(o)}}#r(t,n){let r=fp(t),i=mp(t.addressSpace);return this.#t?(this.#o(t,r,i,n),this.#t):this.#i(t,r,i,n)}#i(t,n,r,i){return this.#t={layout:n,layoutSignature:hi(n),layoutText:Ut(n),sourceHint:i,bindingName:t.name,addressSpace:r},this.#n=this.device.createBuffer({size:n.size,usage:r==="storage"?["storage","copy_dst"]:["uniform","copy_dst"],label:`${t.name}.sharedUniform`}),this.#s(),this.#t}#o(t,n,r,i){let o=this.#t;if(o.addressSpace!==r)throw P("uniforms",`shared uniforms '${o.bindingName}' already adopted address space ${o.addressSpace}; '${t.name}' uses ${r}.`);if(hi(n)!==o.layoutSignature)throw Bo({bindingName:o.bindingName,adoptedLayout:o.layoutText,adoptedSource:o.sourceHint,incomingLayout:Ut(n,{abbreviated:!0}),incomingSource:i})}#s(){!this.#t||!this.#n||this.#n.write(xn(this.#t.layout,this.#e),0)}#l(){if(!this.#n)throw P("uniforms","shared uniforms have not adopted a layout yet.");return this.#n}destroy(){this.#n?.destroy()}};function nc(e,t){let n=S(e,"uniforms");return pe(n,new bi(n.device,t),r=>r.destroy())}function dp(e){if(e.bindingLayout?.kind!=="buffer")throw P("uniforms",`Binding '${e.name}' does not accept shared uniforms; the shader reflected ${e.bindingLayout?.kind??"none"}.`)}function fp(e){if(!e.layout)throw P("uniforms",`Binding '${e.name}' does not expose a host-shareable layout.`);if(e.layout.size===void 0)throw P("uniforms",`Binding '${e.name}' has a runtime-sized layout; it cannot be shared.`);return e.layout}function rc(e,t){for(let[n,r]of Object.entries(t))oc(n)||(yi(r)&&yi(e[n])?rc(e[n],r):e[n]=_i(r))}function ic(e){let t={};for(let[n,r]of Object.entries(e))oc(n)||(t[n]=_i(r));return t}function oc(e){return e==="__proto__"||e==="constructor"||e==="prototype"}function _i(e){return Array.isArray(e)?e.map(_i):ArrayBuffer.isView(e)?pp(e):yi(e)?ic(e):e}function pp(e){return e instanceof Float32Array||e instanceof Uint32Array||e instanceof Int32Array?e.slice():e}function yi(e){return typeof e=="object"&&e!==null&&!Array.isArray(e)&&!ArrayBuffer.isView(e)}function mp(e){return e==="storage"?"storage":"uniform"}var sc=4096,hp=64;function cc(e,t={}){let n=S(e,"visibility");return Jt(n,r=>new vi(n.device,t,()=>Ae(n).frameCount,r))}var Un=class{label;owner;#e="unknown";#t;#n=0;#r=!1;constructor(t,n){this.label=t,this.owner=n}get hidden(){return this.#e==="hidden"}get state(){return this.#e}get age(){return this.#t===void 0?1/0:this.owner.currentFrame()-this.#t}reset(){if(this.#r)throw Qt("query handle","VisibilityQuery.reset");this.#e="unknown",this.#t=void 0,this.#n+=1}dispose(){this.#r||(this.#r=!0,this.#e="unknown",this.#t=void 0,this.owner.releaseLabel(this))}get disposed(){return this.#r}get generation(){return this.#n}applyResult(t,n,r){this.#r||n!==this.#n||(this.#e=t!==0n?"visible":"hidden",this.#t=r)}},vi=class{#e;#t;#n;#r;capacity;#i=new Map;#o;#s=[];#l=new Set;#a;#u=new Map;#d=!1;constructor(t,n,r,i={}){let o=n.capacity??hp;if(typeof o!="number"||!Number.isInteger(o)||o<1||o>sc)throw ho(o,sc);this.#e=t,this.#t=r,this.#n=i,this.capacity=o,this.#r=Mn(t,{type:"occlusion",capacity:o,label:"vgpu.visibility",trackSettled:i.trackSettled,errorSink:i.errorSink})}query(t){if(this.#m("Visibility.query"),typeof t!="string"||t.length===0)throw _e(`query label received ${ac(t)}; expected a non-empty string.`,'Label each queried object, e.g. vis.query("statue").',"Visibility.query");if(this.#i.has(t))throw xo(t);let n=new Un(t,this);return this.#i.set(t,n),n}reset(){this.#m("Visibility.reset");for(let t of this.#i.values())t.reset()}dispose(){this.#d||(this.#d=!0,this.#i.clear(),this.#s=[],this.#l.clear(),this.#a=void 0,this.#r.dispose(),this.#n.onDispose?.())}get disposed(){return this.#d}currentFrame(){return this.#t()}releaseLabel(t){this.#i.get(t.label)===t&&this.#i.delete(t.label)}get querySet(){return this.#r.querySet}[qe](t){if(!t.target.depth)throw bo();return this.attachFrame(t.frame,t.device),{owner:this,occlusion:{querySet:this.querySet,beginQuery:(n,r)=>this.beginQuery(n,r)}}}attachFrame(t,n){if(this.#m("Frame.pass"),n!==this.#e)throw _e("the visibility instance belongs to a different gpu; occlusion queries cannot cross devices.","Create one visibility(gpu) per gpu and use it only with that gpu's frames.","Frame.pass");t!==this.#o&&this.#c(t),this.#f(t)}beginQuery(t,n){if(this.#m("FramePass.occlusion"),!(t instanceof Un))throw _e(`occlusion() received ${ac(t)}; expected a VisibilityQuery from vis.query(label).`,`Create const q = vis.query("label") once from the pass's visibility instance, then p.occlusion(q, body).`,"FramePass.occlusion");if(t.owner!==this)throw _e(`query '${t.label}' belongs to a different visibility instance than the one this pass was opened with.`,"Use handles from the same visibility(gpu) instance passed as the pass's visibility option.","FramePass.occlusion");if(t.disposed)throw Qt("query handle","FramePass.occlusion");if(n!==this.#o)throw _e("the pass is not part of the current frame; occlusion() must run inside the frame that opened the pass.","Encode occlusion scopes inside the pass callback of the current frame(gpu).","FramePass.occlusion");if(this.#l.has(t))throw vo(t.label);let r=this.#s.length;if(r>=this.capacity)throw go(this.capacity);return this.#l.add(t),this.#s.push({query:t,generation:t.generation}),r}finalizeFrame(t,n){this.#a=void 0,!(this.#d||t!==this.#o||this.#s.length===0)&&this.#r.encodeResolve(n,this.#s.length)&&(this.#a=[...this.#s])}frameSubmitted(t){if(this.#p(t),t!==this.#o||this.#d)return;let n=this.#a;this.#a=void 0,!(!n||n.length===0)&&this.#r.onSubmitted(r=>{if(this.#d)return;let i=this.#t();for(let o=0;o<n.length;o++){let s=n[o],a=r[o];a!==void 0&&s.query.applyResult(a,s.generation,i)}})}frameAbandoned(t){t===this.#o&&(this.#a=void 0),this.#p(t)}#c(t){this.#o=t,this.#s=[],this.#l.clear()}#f(t){this.#u.has(t)||(this.#u.set(t,this.#r),this.#r.retain())}#p(t){let n=this.#u.get(t);n&&(this.#u.delete(t),n.release())}#m(t){if(this.#d)throw Qt("visibility",t)}};function ac(e){return typeof e=="string"?`'${e}'`:String(e)}function gp(e){return gr("browser",e)}var lc=`// vgsl-module: e:\\pfolio\\optimized-black-hole\\bake.wgsl
// One-shot geodesic bake: store two disk crossings, the lensed sky, and view directions.

        

struct _vgsl_9ae85266__Bake {
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  diskOuter: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
}

@group(0) @binding(0) var<uniform> bake: _vgsl_9ae85266__Bake;

const _vgsl_9ae85266__FLAG_HOLE: f32 = 1.0;

const _vgsl_9ae85266__FLAG_ESCAPED: f32 = 2.0;

struct _vgsl_9ae85266__GBuffer {
  @location(0) hit1: vec2f,
  @location(1) hit2: vec2f,
  @location(2) sky: vec4f,
  @location(3) view: vec4f,
}

@fragment fn fs_main(@location(0) uv: vec2f) -> _vgsl_9ae85266__GBuffer {
  let ray = _vgsl_a7584409__cameraRay(
    uv,
    bake.resolution,
    bake.yaw,
    bake.pitch,
    bake.orbitRadius,
    bake.fov,
    bake.centerX,
    bake.centerY,
    bake.roll,
  );
  var traced = _vgsl_a7584409__traceRay(ray.position, ray.velocity, bake.diskOuter, _vgsl_a7584409__escapeRadiusFor(bake.orbitRadius));

  if (traced.swallowed < 0.5 && traced.escaped < 0.5) {
    traced.swallowed = 1.0;
  }

  return _vgsl_9ae85266__GBuffer(
    traced.hit1Plane,
    traced.hit2Plane,
    vec4f(traced.finalVelocity, traced.swallowed * _vgsl_9ae85266__FLAG_HOLE + traced.escaped * _vgsl_9ae85266__FLAG_ESCAPED),
    vec4f(traced.hit1Direction, traced.hit2Direction),
  );
}

// vgsl-module: e:\\pfolio\\optimized-black-hole\\geodesic.wgsl
// Shared Schwarzschild-like ray integration used by the bake and refinement passes.

 const _vgsl_a7584409__HORIZON: f32 = 1.0;

 const _vgsl_a7584409__ISCO: f32 = 3.0;

 const _vgsl_a7584409__MAX_STEPS: i32 = 768;

 struct _vgsl_a7584409__TraceResult {
  hit1Plane: vec2f,
  hit1Direction: vec2f,
  hit2Plane: vec2f,
  hit2Direction: vec2f,
  hitCount: i32,
  swallowed: f32,
  escaped: f32,

  finalVelocity: vec3f,
}

 struct _vgsl_a7584409__CameraRay {
  position: vec3f,
  velocity: vec3f,
}

 fn _vgsl_a7584409__escapeRadiusFor(orbitRadius: f32) -> f32 {
  return max(120.0, orbitRadius + 8.0);
}

 fn _vgsl_a7584409__encodeDirection(direction: vec3f) -> vec2f {
  return vec2f(direction.y, atan2(direction.z, direction.x));
}

fn _vgsl_a7584409__geodesicAcceleration(position: vec3f, velocity: vec3f) -> vec3f {
  let r2 = max(dot(position, position), 0.0001);
  let angularMomentum = cross(position, velocity);
  let h2 = dot(angularMomentum, angularMomentum);
  return -1.5 * h2 * position / (r2 * r2 * sqrt(r2));
}

 fn _vgsl_a7584409__cameraRay(
  uv: vec2f,
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
) -> _vgsl_a7584409__CameraRay {
  let aspect = resolution.x / max(resolution.y, 1.0);
  let ndc = vec2f(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
  let screenPlane = (ndc - vec2f(centerX, centerY)) * vec2f(aspect, 1.0);
  let cosine = cos(roll);
  let sine = sin(roll);
  let screen = vec2f(
    screenPlane.x * cosine - screenPlane.y * sine,
    screenPlane.x * sine + screenPlane.y * cosine,
  );

  let clampedPitch = clamp(pitch, -1.319, 1.319);
  let cameraPosition = vec3f(
    sin(yaw) * cos(clampedPitch) * orbitRadius,
    sin(clampedPitch) * orbitRadius,
    cos(yaw) * cos(clampedPitch) * orbitRadius,
  );
  let forward = normalize(vec3f(0.0) - cameraPosition);
  let right = normalize(cross(forward, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, forward);

  var ray: _vgsl_a7584409__CameraRay;
  ray.position = cameraPosition;
  ray.velocity = normalize(forward * fov + right * screen.x + up * screen.y);
  return ray;
}

 fn _vgsl_a7584409__traceRay(cameraPosition: vec3f, initialVelocity: vec3f, diskOuter: f32, escapeRadius: f32) -> _vgsl_a7584409__TraceResult {
  var position = cameraPosition;
  var velocity = initialVelocity;

  var result: _vgsl_a7584409__TraceResult;
  result.hit1Plane = vec2f(0.0);
  result.hit1Direction = vec2f(0.0);
  result.hit2Plane = vec2f(0.0);
  result.hit2Direction = vec2f(0.0);
  result.hitCount = 0;
  result.swallowed = 0.0;
  result.escaped = 0.0;

  for (var stepIndex = 0; stepIndex < _vgsl_a7584409__MAX_STEPS; stepIndex++) {
    let radius = length(position);
    if (radius < _vgsl_a7584409__HORIZON * 1.004) {
      result.swallowed = 1.0;
      break;
    }
    if (radius > escapeRadius && dot(position, velocity) > 0.0) {
      result.escaped = 1.0;
      break;
    }

    let stepSize = clamp((radius - _vgsl_a7584409__HORIZON) * 0.035, 0.0045, 0.075 * max(1.0, radius / 6.0));

    let previousPosition = position;
    let previousVelocity = velocity;

    let acceleration0 = _vgsl_a7584409__geodesicAcceleration(position, velocity);
    velocity += acceleration0 * (0.5 * stepSize);
    position += velocity * stepSize;
    let acceleration1 = _vgsl_a7584409__geodesicAcceleration(position, velocity);
    velocity += acceleration1 * (0.5 * stepSize);
    velocity = normalize(velocity);

    if (result.hitCount < 2) {
      let previousSide = select(-1.0, 1.0, previousPosition.y >= 0.0);
      let currentSide = select(-1.0, 1.0, position.y >= 0.0);
      if (previousSide != currentSide) {
        let t = clamp(previousPosition.y / (previousPosition.y - position.y), 0.0, 1.0);
        let crossing = mix(previousPosition, position, t);
        let planeRadius = length(crossing.xz);
        if (planeRadius >= _vgsl_a7584409__ISCO && planeRadius <= diskOuter) {
          let direction = _vgsl_a7584409__encodeDirection(normalize(mix(previousVelocity, velocity, t)));
          if (result.hitCount == 0) {
            result.hit1Plane = crossing.xz;
            result.hit1Direction = direction;
          } else {
            result.hit2Plane = crossing.xz;
            result.hit2Direction = direction;
          }
          result.hitCount += 1;
        }
      }
    }
  }

  result.finalVelocity = velocity;
  return result;
}
`,uc=`// vgsl-module: e:\\pfolio\\optimized-black-hole\\refine.wgsl
// One-shot photon-ring refinement: measure sub-pixel coverage and synthesize missed crossings.

          

struct _vgsl_7e0948a4__Refine {
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  diskOuter: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
}

@group(0) @binding(0) var<uniform> refine: _vgsl_7e0948a4__Refine;

@group(0) @binding(1) var gHit1: texture_2d<f32>;

@group(0) @binding(2) var gSky: texture_2d<f32>;

const _vgsl_7e0948a4__SUB_STEPS: i32 = 4;

const _vgsl_7e0948a4__MASK_RADIUS: i32 = 2;

const _vgsl_7e0948a4__GRADIENT_LIMIT: f32 = 0.12;

const _vgsl_7e0948a4__B_CRIT: f32 = 2.59807621;

const _vgsl_7e0948a4__CRITICAL_BAND: f32 = 0.06;

fn _vgsl_7e0948a4__isHitAt(plane: vec2f) -> bool {
  return length(plane) > _vgsl_a7584409__ISCO * 0.5;
}

struct _vgsl_7e0948a4__RefineOut {
  @location(0) coverage: vec2f,
  @location(1) geometry: vec4f,
}

@fragment fn fs_main(@location(0) uv: vec2f) -> _vgsl_7e0948a4__RefineOut {
  let dimensions = vec2i(textureDimensions(gHit1, 0));
  let texel = vec2i(clamp(uv * refine.resolution, vec2f(0.0), refine.resolution - vec2f(1.0)));
  let annulus = max(refine.diskOuter - _vgsl_a7584409__ISCO, 0.001);

  let centerPlane = textureLoad(gHit1, texel, 0).xy;
  let centerHit = _vgsl_7e0948a4__isHitAt(centerPlane);
  let centerHole = (i32(textureLoad(gSky, texel, 0).w + 0.5) & 1) != 0;
  let centerRadiusNorm = clamp((length(centerPlane) - _vgsl_a7584409__ISCO) / annulus, 0.0, 1.0);

  let centerRay = _vgsl_a7584409__cameraRay(
    uv,
    refine.resolution,
    refine.yaw,
    refine.pitch,
    refine.orbitRadius,
    refine.fov,
    refine.centerX,
    refine.centerY,
    refine.roll,
  );
  let impactParameter = length(cross(centerRay.position, centerRay.velocity));

  var boundary = abs(impactParameter - _vgsl_7e0948a4__B_CRIT) < _vgsl_7e0948a4__CRITICAL_BAND * _vgsl_a7584409__HORIZON;
  for (var dy = -_vgsl_7e0948a4__MASK_RADIUS; dy <= _vgsl_7e0948a4__MASK_RADIUS; dy++) {
    for (var dx = -_vgsl_7e0948a4__MASK_RADIUS; dx <= _vgsl_7e0948a4__MASK_RADIUS; dx++) {
      let neighbor = clamp(texel + vec2i(dx, dy), vec2i(0), dimensions - vec2i(1));
      let plane = textureLoad(gHit1, neighbor, 0).xy;
      let hit = _vgsl_7e0948a4__isHitAt(plane);
      let hole = (i32(textureLoad(gSky, neighbor, 0).w + 0.5) & 1) != 0;
      if (hit != centerHit || hole != centerHole) {
        boundary = true;
      }
      if (hit && centerHit) {
        let radiusNorm = clamp((length(plane) - _vgsl_a7584409__ISCO) / annulus, 0.0, 1.0);
        if (abs(radiusNorm - centerRadiusNorm) > _vgsl_7e0948a4__GRADIENT_LIMIT) {
          boundary = true;
        }
      }
    }
  }

  if (!boundary) {
    return _vgsl_7e0948a4__RefineOut(vec2f(select(0.0, 1.0, centerHit), 0.0), vec4f(0.0));
  }

  let escapeRadius = _vgsl_a7584409__escapeRadiusFor(refine.orbitRadius);
  var hits = 0.0;
  var minRadius = 1e9;
  var maxRadius = -1e9;
  var bestPlane = vec2f(0.0);
  var bestDirection = vec2f(0.0);
  var bestRadius = 0.0;
  var bestDistance = 1e9;
  for (var sy = 0; sy < _vgsl_7e0948a4__SUB_STEPS; sy++) {
    for (var sx = 0; sx < _vgsl_7e0948a4__SUB_STEPS; sx++) {
      let offset = (vec2f(f32(sx), f32(sy)) + vec2f(0.5)) / f32(_vgsl_7e0948a4__SUB_STEPS);
      let subUv = (vec2f(texel) + offset) / refine.resolution;
      let ray = _vgsl_a7584409__cameraRay(
        subUv,
        refine.resolution,
        refine.yaw,
        refine.pitch,
        refine.orbitRadius,
        refine.fov,
        refine.centerX,
        refine.centerY,
        refine.roll,
      );
      let traced = _vgsl_a7584409__traceRay(ray.position, ray.velocity, refine.diskOuter, escapeRadius);
      if (traced.hitCount > 0) {
        let radius = length(traced.hit1Plane);
        hits += 1.0;
        minRadius = min(minRadius, radius);
        maxRadius = max(maxRadius, radius);
        let distance = length(offset - vec2f(0.5));
        if (distance < bestDistance) {
          bestDistance = distance;
          bestPlane = traced.hit1Plane;
          bestDirection = traced.hit1Direction;
          bestRadius = radius;
        }
      }
    }
  }

  let coverage = hits / f32(_vgsl_7e0948a4__SUB_STEPS * _vgsl_7e0948a4__SUB_STEPS);
  if (hits < 0.5) {
    return _vgsl_7e0948a4__RefineOut(vec2f(0.0, 0.0), vec4f(0.0));
  }

  var r0 = length(centerPlane);
  var span = 0.0;
  var geometry = vec4f(0.0);
  if (centerHit) {
    span = 2.0 * max(abs(maxRadius - r0), abs(r0 - minRadius));
  } else {
    r0 = 0.5 * (minRadius + maxRadius);
    span = maxRadius - minRadius;
    geometry = vec4f(bestPlane * (r0 / max(bestRadius, _vgsl_a7584409__ISCO)), bestDirection);
  }
  return _vgsl_7e0948a4__RefineOut(vec2f(coverage, clamp(span / annulus, 0.0, 1.0)), geometry);
}

// vgsl-module: e:\\pfolio\\optimized-black-hole\\geodesic.wgsl
// Shared Schwarzschild-like ray integration used by the bake and refinement passes.

 const _vgsl_a7584409__HORIZON: f32 = 1.0;

 const _vgsl_a7584409__ISCO: f32 = 3.0;

 const _vgsl_a7584409__MAX_STEPS: i32 = 768;

 struct _vgsl_a7584409__TraceResult {
  hit1Plane: vec2f,
  hit1Direction: vec2f,
  hit2Plane: vec2f,
  hit2Direction: vec2f,
  hitCount: i32,
  swallowed: f32,
  escaped: f32,

  finalVelocity: vec3f,
}

 struct _vgsl_a7584409__CameraRay {
  position: vec3f,
  velocity: vec3f,
}

 fn _vgsl_a7584409__escapeRadiusFor(orbitRadius: f32) -> f32 {
  return max(120.0, orbitRadius + 8.0);
}

 fn _vgsl_a7584409__encodeDirection(direction: vec3f) -> vec2f {
  return vec2f(direction.y, atan2(direction.z, direction.x));
}

fn _vgsl_a7584409__geodesicAcceleration(position: vec3f, velocity: vec3f) -> vec3f {
  let r2 = max(dot(position, position), 0.0001);
  let angularMomentum = cross(position, velocity);
  let h2 = dot(angularMomentum, angularMomentum);
  return -1.5 * h2 * position / (r2 * r2 * sqrt(r2));
}

 fn _vgsl_a7584409__cameraRay(
  uv: vec2f,
  resolution: vec2f,
  yaw: f32,
  pitch: f32,
  orbitRadius: f32,
  fov: f32,
  centerX: f32,
  centerY: f32,
  roll: f32,
) -> _vgsl_a7584409__CameraRay {
  let aspect = resolution.x / max(resolution.y, 1.0);
  let ndc = vec2f(uv.x * 2.0 - 1.0, 1.0 - uv.y * 2.0);
  let screenPlane = (ndc - vec2f(centerX, centerY)) * vec2f(aspect, 1.0);
  let cosine = cos(roll);
  let sine = sin(roll);
  let screen = vec2f(
    screenPlane.x * cosine - screenPlane.y * sine,
    screenPlane.x * sine + screenPlane.y * cosine,
  );

  let clampedPitch = clamp(pitch, -1.319, 1.319);
  let cameraPosition = vec3f(
    sin(yaw) * cos(clampedPitch) * orbitRadius,
    sin(clampedPitch) * orbitRadius,
    cos(yaw) * cos(clampedPitch) * orbitRadius,
  );
  let forward = normalize(vec3f(0.0) - cameraPosition);
  let right = normalize(cross(forward, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, forward);

  var ray: _vgsl_a7584409__CameraRay;
  ray.position = cameraPosition;
  ray.velocity = normalize(forward * fov + right * screen.x + up * screen.y);
  return ray;
}

 fn _vgsl_a7584409__traceRay(cameraPosition: vec3f, initialVelocity: vec3f, diskOuter: f32, escapeRadius: f32) -> _vgsl_a7584409__TraceResult {
  var position = cameraPosition;
  var velocity = initialVelocity;

  var result: _vgsl_a7584409__TraceResult;
  result.hit1Plane = vec2f(0.0);
  result.hit1Direction = vec2f(0.0);
  result.hit2Plane = vec2f(0.0);
  result.hit2Direction = vec2f(0.0);
  result.hitCount = 0;
  result.swallowed = 0.0;
  result.escaped = 0.0;

  for (var stepIndex = 0; stepIndex < _vgsl_a7584409__MAX_STEPS; stepIndex++) {
    let radius = length(position);
    if (radius < _vgsl_a7584409__HORIZON * 1.004) {
      result.swallowed = 1.0;
      break;
    }
    if (radius > escapeRadius && dot(position, velocity) > 0.0) {
      result.escaped = 1.0;
      break;
    }

    let stepSize = clamp((radius - _vgsl_a7584409__HORIZON) * 0.035, 0.0045, 0.075 * max(1.0, radius / 6.0));

    let previousPosition = position;
    let previousVelocity = velocity;

    let acceleration0 = _vgsl_a7584409__geodesicAcceleration(position, velocity);
    velocity += acceleration0 * (0.5 * stepSize);
    position += velocity * stepSize;
    let acceleration1 = _vgsl_a7584409__geodesicAcceleration(position, velocity);
    velocity += acceleration1 * (0.5 * stepSize);
    velocity = normalize(velocity);

    if (result.hitCount < 2) {
      let previousSide = select(-1.0, 1.0, previousPosition.y >= 0.0);
      let currentSide = select(-1.0, 1.0, position.y >= 0.0);
      if (previousSide != currentSide) {
        let t = clamp(previousPosition.y / (previousPosition.y - position.y), 0.0, 1.0);
        let crossing = mix(previousPosition, position, t);
        let planeRadius = length(crossing.xz);
        if (planeRadius >= _vgsl_a7584409__ISCO && planeRadius <= diskOuter) {
          let direction = _vgsl_a7584409__encodeDirection(normalize(mix(previousVelocity, velocity, t)));
          if (result.hitCount == 0) {
            result.hit1Plane = crossing.xz;
            result.hit1Direction = direction;
          } else {
            result.hit2Plane = crossing.xz;
            result.hit2Direction = direction;
          }
          result.hitCount += 1;
        }
      }
    }
  }

  result.finalVelocity = velocity;
  return result;
}
`,dc=`// vgsl-module: e:\\pfolio\\optimized-black-hole\\shade.wgsl
// Per-frame shading: decode the bake, shade stars and disk layers, then composite them.

           
        
      

struct _vgsl_5a0e5554__Shade {
  resolution: vec2f,
  time: f32,
  diskOuter: f32,
  sceneYaw: f32,
  centerFade: f32,
}

const _vgsl_5a0e5554__DISK_GAIN: f32 = 1.35;

fn _vgsl_5a0e5554__centeredCopyFade(uvY: f32) -> f32 {
  let distanceFromCenter = abs(uvY - 0.5);
  return pow(smoothstep(0.08, 0.38, distanceFromCenter), 2.2);
}

@group(0) @binding(0) var<uniform> shade: _vgsl_5a0e5554__Shade;
@group(0) @binding(1) var gHit1: texture_2d<f32>;
@group(0) @binding(2) var gHit2: texture_2d<f32>;
@group(0) @binding(3) var gSky: texture_2d<f32>;
@group(0) @binding(4) var gView: texture_2d<f32>;
@group(0) @binding(5) var<uniform> disk: _vgsl_c301a541__DiskLook;
@group(0) @binding(6) var<uniform> stars: _vgsl_a87f9ea6__StarLook;

@group(0) @binding(7) var noiseVolume: texture_3d<f32>;
@group(0) @binding(8) var noiseSampler: sampler;

@group(0) @binding(9) var gAa: texture_2d<f32>;

@group(0) @binding(10) var gAaGeom: texture_2d<f32>;

fn _vgsl_5a0e5554__diskFootprintAxes(g: _vgsl_0afbd304__GBufferSample) -> vec2f {
  let angular = max(disk.stretch, 0.05);
  let noiseAngle = g.diskPolar.y
    - min(shade.time, _vgsl_c301a541__SHEAR_PERIOD * 0.5) * (disk.speed * 0.55 / pow(g.diskPolar.x, 1.5));
  let noiseCoords = vec3f(
    cos(noiseAngle) * angular,
    sin(noiseAngle) * angular,
    g.diskPolar.x * disk.detail,
  );
  return vec2f(
    max(fwidth(noiseCoords.x), fwidth(noiseCoords.y)),
    fwidth(noiseCoords.z),
  );
}

fn _vgsl_5a0e5554__diskFootprint(axes: vec2f) -> f32 {
  return min(max(axes.x, axes.y), 4.0);
}

fn _vgsl_5a0e5554__rotateY(v: vec3f, angle: f32) -> vec3f {
  let c = cos(angle);
  let s = sin(angle);
  return vec3f(c * v.x + s * v.z, v.y, -s * v.x + c * v.z);
}

fn _vgsl_5a0e5554__wrapAngle(angle: f32) -> f32 {
  return angle - _vgsl_0afbd304__TAU * floor((angle + _vgsl_0afbd304__PI_CONST) / _vgsl_0afbd304__TAU);
}

fn _vgsl_5a0e5554__rotateSample(g: _vgsl_0afbd304__GBufferSample, angle: f32) -> _vgsl_0afbd304__GBufferSample {
  var rotated = g;
  rotated.position = _vgsl_5a0e5554__rotateY(g.position, angle);
  rotated.viewDirection = _vgsl_5a0e5554__rotateY(g.viewDirection, angle);
  rotated.rayDirection = _vgsl_5a0e5554__rotateY(g.rayDirection, angle);
  let azimuth = _vgsl_5a0e5554__wrapAngle(g.diskPolar.y - angle);
  rotated.diskPolar = vec2f(g.diskPolar.x, azimuth);
  rotated.diskUv = vec2f(g.diskUv.x, (azimuth + _vgsl_0afbd304__PI_CONST) / _vgsl_0afbd304__TAU);
  return rotated;
}

fn _vgsl_5a0e5554__rotateLayers(layers: _vgsl_0afbd304__GBufferLayers, angle: f32) -> _vgsl_0afbd304__GBufferLayers {
  var rotated: _vgsl_0afbd304__GBufferLayers;
  rotated.front = _vgsl_5a0e5554__rotateSample(layers.front, angle);
  rotated.back = _vgsl_5a0e5554__rotateSample(layers.back, angle);
  return rotated;
}

const _vgsl_5a0e5554__AA_TAPS: i32 = 6;

const _vgsl_5a0e5554__AA_SPAN_MIN: f32 = 0.15;

fn _vgsl_5a0e5554__shadeFront(g: _vgsl_0afbd304__GBufferSample, footprint: f32, angularFootprint: f32) -> _vgsl_c301a541__DiskSample {
  let annulus = max(shade.diskOuter - _vgsl_0afbd304__ISCO, 0.001);
  let spanWorld = g.span * annulus;
  if (g.span <= _vgsl_5a0e5554__AA_SPAN_MIN) {
    return _vgsl_c301a541__shadeDisk(g, disk, shade.time, footprint, noiseVolume, noiseSampler);
  }

  let tapFootprint = min(max(angularFootprint, max(disk.detail, 0.05) * (spanWorld / f32(_vgsl_5a0e5554__AA_TAPS))), 4.0);
  let step = spanWorld / f32(_vgsl_5a0e5554__AA_TAPS);
  let start = g.diskPolar.x - spanWorld * 0.5;

  var sumEmission = vec3f(0.0);
  var sumAlpha = 0.0;
  var taps = 0.0;
  for (var i = 0; i < _vgsl_5a0e5554__AA_TAPS; i++) {
    let radius = start + (f32(i) + 0.5) * step;
    if (radius < _vgsl_0afbd304__ISCO || radius > shade.diskOuter) {
      continue;
    }
    let tap = _vgsl_c301a541__shadeDisk(
      _vgsl_0afbd304__sampleAtRadius(g, radius, shade.diskOuter), disk, shade.time,
      tapFootprint, noiseVolume, noiseSampler,
    );
    sumEmission += tap.color * tap.alpha;
    sumAlpha += tap.alpha;
    taps += 1.0;
  }
  if (taps < 0.5) {
    return _vgsl_c301a541__shadeDisk(g, disk, shade.time, footprint, noiseVolume, noiseSampler);
  }

  var sample: _vgsl_c301a541__DiskSample;
  let meanAlpha = sumAlpha / taps;
  sample.alpha = meanAlpha;
  sample.color = select(vec3f(0.0), (sumEmission / taps) / max(meanAlpha, 1e-6), meanAlpha > 1e-6);
  return sample;
}

fn _vgsl_5a0e5554__emptyDiskSample() -> _vgsl_c301a541__DiskSample {
  var sample: _vgsl_c301a541__DiskSample;
  sample.color = vec3f(0.0);
  sample.alpha = 0.0;
  return sample;
}

fn _vgsl_5a0e5554__compositeDisk(under: vec3f, sample: _vgsl_c301a541__DiskSample) -> vec3f {
  return sample.color * sample.alpha * _vgsl_5a0e5554__DISK_GAIN + under * (1.0 - sample.alpha);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let dimensions = vec2f(textureDimensions(gHit1, 0));
  let texel = vec2i(clamp(uv * dimensions, vec2f(0.0), dimensions - vec2f(1.0)));

  let aa = textureLoad(gAa, texel, 0).xy;
  let aaGeom = textureLoad(gAaGeom, texel, 0);

  let baked = _vgsl_0afbd304__decodeGBuffer(
    textureLoad(gHit1, texel, 0).xy,
    textureLoad(gHit2, texel, 0).xy,
    textureLoad(gSky, texel, 0),
    textureLoad(gView, texel, 0),
    shade.diskOuter,
    aa,
    aaGeom,
  );

  let frontAxes = _vgsl_5a0e5554__diskFootprintAxes(baked.front);
  let backAxes = _vgsl_5a0e5554__diskFootprintAxes(baked.back);
  let frontFootprint = _vgsl_5a0e5554__diskFootprint(frontAxes);
  let backFootprint = _vgsl_5a0e5554__diskFootprint(backAxes);

  let bakedRayDirection = baked.front.rayDirection;
  let skyDdx = dpdx(bakedRayDirection);
  let skyDdy = dpdy(bakedRayDirection);

  let layers = _vgsl_5a0e5554__rotateLayers(baked, -shade.sceneYaw);
  let g = layers.front;
  let skyDdxRotated = _vgsl_5a0e5554__rotateY(skyDdx, -shade.sceneYaw);
  let skyDdyRotated = _vgsl_5a0e5554__rotateY(skyDdy, -shade.sceneYaw);

  var background = vec3f(0.0);
  if (!g.isBlackHole && g.escaped) {
    background = _vgsl_a87f9ea6__shadeStars(g.rayDirection, stars, shade.time, skyDdxRotated, skyDdyRotated);
  }

  var backSample = _vgsl_5a0e5554__emptyDiskSample();
  var frontSample = _vgsl_5a0e5554__emptyDiskSample();
  if (layers.back.isHit) {
    backSample = _vgsl_c301a541__shadeDisk(layers.back, disk, shade.time, backFootprint, noiseVolume, noiseSampler);
  }
  if (layers.front.isHit) {
    frontSample = _vgsl_5a0e5554__shadeFront(layers.front, frontFootprint, frontAxes.x);
    frontSample.alpha *= layers.front.coverage;
  }

  var color = background;
  color = _vgsl_5a0e5554__compositeDisk(color, backSample);
  color = _vgsl_5a0e5554__compositeDisk(color, frontSample);

  let centerMask = mix(
    1.0,
    _vgsl_5a0e5554__centeredCopyFade(uv.y),
    clamp(shade.centerFade, 0.0, 1.0),
  );
  let heroFade = centerMask;

  color *= heroFade;

  return vec4f(color, 1.0);
}

// vgsl-module: e:\\pfolio\\optimized-black-hole\\gbuffer.wgsl
// Shared decoding contract for the baked crossings consumed by the frame shader.

 const _vgsl_0afbd304__HORIZON: f32 = 1.0;

 const _vgsl_0afbd304__ISCO: f32 = 3.0;
 const _vgsl_0afbd304__TAU: f32 = 6.28318530718;
 const _vgsl_0afbd304__PI_CONST: f32 = 3.14159265359;

 struct _vgsl_0afbd304__GBufferSample {
  position: vec3f,
  normal: vec3f,
  diskUv: vec2f,
  diskPolar: vec2f,
  rayDirection: vec3f,
  viewDirection: vec3f,
  side: f32,
  coverage: f32,
  span: f32,
  isHit: bool,
  synthesized: bool,
  isBlackHole: bool,
  escaped: bool,
}

 struct _vgsl_0afbd304__GBufferLayers {
  front: _vgsl_0afbd304__GBufferSample,
  back: _vgsl_0afbd304__GBufferSample,
}

fn _vgsl_0afbd304__decodeDirection(encoded: vec2f) -> vec3f {
  let horizontal = sqrt(max(1.0 - encoded.x * encoded.x, 0.0));
  return vec3f(cos(encoded.y) * horizontal, encoded.x, sin(encoded.y) * horizontal);
}

fn _vgsl_0afbd304__decodeLayer(
  plane: vec2f, encodedDirection: vec2f, sky: vec4f, flags: i32,
  diskOuter: f32, aa: vec2f, synthesized: bool,
) -> _vgsl_0afbd304__GBufferSample {
  var sample: _vgsl_0afbd304__GBufferSample;
  let planeRadius = length(plane);
  let isHit = planeRadius > _vgsl_0afbd304__ISCO * 0.5;
  let radius = max(planeRadius, _vgsl_0afbd304__ISCO);
  let azimuth = atan2(plane.y, plane.x);
  let direction = _vgsl_0afbd304__decodeDirection(encodedDirection);
  let side = select(1.0, -1.0, direction.y > 0.0);

  sample.position = select(vec3f(0.0), vec3f(plane.x, 0.0, plane.y), isHit);
  sample.normal = select(vec3f(0.0), vec3f(0.0, side, 0.0), isHit);
  sample.diskUv = vec2f(
    clamp((radius - _vgsl_0afbd304__ISCO) / max(diskOuter - _vgsl_0afbd304__ISCO, 0.001), 0.0, 1.0),
    (azimuth + _vgsl_0afbd304__PI_CONST) / _vgsl_0afbd304__TAU,
  );
  sample.diskPolar = vec2f(radius, azimuth);
  sample.rayDirection = sky.xyz;
  sample.viewDirection = direction;
  sample.side = select(0.0, side, isHit);
  sample.coverage = clamp(aa.x, 0.0, 1.0);
  sample.span = clamp(aa.y, 0.0, 1.0);
  sample.isHit = isHit;
  sample.synthesized = synthesized && isHit;
  sample.isBlackHole = (flags & 1) != 0;
  sample.escaped = (flags & 2) != 0;
  return sample;
}

 fn _vgsl_0afbd304__decodeGBuffer(
  hit1: vec2f, hit2: vec2f, sky: vec4f, view: vec4f,
  diskOuter: f32, aa: vec2f, aaGeom: vec4f,
) -> _vgsl_0afbd304__GBufferLayers {
  let flags = i32(sky.w + 0.5);
  let substitute = length(hit1) <= _vgsl_0afbd304__ISCO * 0.5 && length(aaGeom.xy) > _vgsl_0afbd304__ISCO * 0.5;
  let frontPlane = select(hit1, aaGeom.xy, substitute);
  let frontDirection = select(view.xy, aaGeom.zw, substitute);
  var layers: _vgsl_0afbd304__GBufferLayers;
  layers.front = _vgsl_0afbd304__decodeLayer(frontPlane, frontDirection, sky, flags, diskOuter, aa, substitute);
  layers.back = _vgsl_0afbd304__decodeLayer(hit2, view.zw, sky, flags, diskOuter, vec2f(1.0, 0.0), false);
  if (!layers.front.isHit) {
    layers.back.isHit = false;
    layers.back.side = 0.0;
    layers.back.normal = vec3f(0.0);
  }
  return layers;
}

 fn _vgsl_0afbd304__sampleAtRadius(g: _vgsl_0afbd304__GBufferSample, radius: f32, diskOuter: f32) -> _vgsl_0afbd304__GBufferSample {
  var moved = g;
  let clamped = clamp(radius, _vgsl_0afbd304__ISCO, max(diskOuter, _vgsl_0afbd304__ISCO));
  let azimuth = g.diskPolar.y;
  moved.position = vec3f(cos(azimuth) * clamped, 0.0, sin(azimuth) * clamped);
  moved.diskPolar = vec2f(clamped, azimuth);
  moved.diskUv = vec2f(
    clamp((clamped - _vgsl_0afbd304__ISCO) / max(diskOuter - _vgsl_0afbd304__ISCO, 0.001), 0.0, 1.0),
    g.diskUv.y,
  );
  return moved;
}

// vgsl-module: e:\\pfolio\\optimized-black-hole\\disk.wgsl
// Accretion-disk material with deterministic tiled noise and radial prefiltering.

       

 struct _vgsl_c301a541__DiskLook {
  brightness: f32,
  speed: f32,
  stretch: f32,
  detail: f32,
  turbulence: f32,
  density: f32,
  doppler: f32,
  cloudScale: f32,
  cloudSpeed: f32,
  cloudStrength: f32,
  spare0: f32,
  spare1: f32,
  spare2: f32,
  spare3: f32,
}

 struct _vgsl_c301a541__DiskSample {
  color: vec3f,
  alpha: f32,
}

struct _vgsl_c301a541__NoiseLattice {
  invSize: f32,
}

fn _vgsl_c301a541__noise3(tex: texture_3d<f32>, samp: sampler, lattice: _vgsl_c301a541__NoiseLattice, p: vec3f) -> f32 {
  let i = floor(p);
  let f = p - i;
  let u = f * f * (3.0 - 2.0 * f);
  return textureSampleLevel(tex, samp, (i + u + vec3f(0.5)) * lattice.invSize, 0.0).r;
}

fn _vgsl_c301a541__streakFbm(
  tex: texture_3d<f32>,
  samp: sampler,
  lattice: _vgsl_c301a541__NoiseLattice,
  angle: f32,
  radius: f32,
  angScale: f32,
  radScale: f32,
  octaves: i32,
  dAngle: f32,
  dRadius: f32,
  lacAng: f32,
  lacRad: f32,
  seed: f32,
) -> f32 {
  var value: f32 = 0.0;
  var total: f32 = 0.0;
  var amplitude: f32 = 0.5;
  var a = angScale;
  var r = radScale;
  var offset = seed;
  for (var i = 0; i < octaves; i++) {
    let visible = clamp(1.0 - 1.7 * max(dAngle * a, dRadius * r), 0.0, 1.0);
    var sampleValue: f32 = 0.5;
    if (visible > 0.004) {
      sampleValue = mix(
        0.5,
        _vgsl_c301a541__noise3(tex, samp, lattice, vec3f(cos(angle) * a, sin(angle) * a, radius * r + offset)),
        visible,
      );
    }
    value += amplitude * sampleValue;
    total += amplitude;
    a *= lacAng;
    r *= lacRad;
    offset += 23.7;
    amplitude *= 0.55;
  }
  return value / max(total, 0.0001);
}

fn _vgsl_c301a541__ridgeFbm(
  tex: texture_3d<f32>,
  samp: sampler,
  lattice: _vgsl_c301a541__NoiseLattice,
  angle: f32,
  radius: f32,
  angScale: f32,
  radScale: f32,
  octaves: i32,
  dAngle: f32,
  dRadius: f32,
  lacAng: f32,
  lacRad: f32,
  seed: f32,
) -> f32 {
  var value: f32 = 0.0;
  var total: f32 = 0.0;
  var amplitude: f32 = 0.5;
  var a = angScale;
  var r = radScale;
  var offset = seed;
  for (var i = 0; i < octaves; i++) {
    let visible = clamp(1.0 - 1.7 * max(dAngle * a, dRadius * r), 0.0, 1.0);
    var crest: f32 = 0.42;
    if (visible > 0.004) {
      let n = _vgsl_c301a541__noise3(tex, samp, lattice, vec3f(cos(angle) * a, sin(angle) * a, radius * r + offset));
      crest = mix(0.42, pow(1.0 - abs(n * 2.0 - 1.0), 1.35), visible);
    }
    value += amplitude * crest;
    total += amplitude;
    a *= lacAng;
    r *= lacRad;
    offset += 41.9;
    amplitude *= 0.62;
  }
  return value / max(total, 0.0001);
}

struct _vgsl_c301a541__FieldParams {
  angBase: f32,
  radBase: f32,
  flowRad: f32,
  chaos: f32,
  outward: f32,
  dAngle: f32,
  dRadius: f32,
}

fn _vgsl_c301a541__smokeField(
  tex: texture_3d<f32>, samp: sampler, lattice: _vgsl_c301a541__NoiseLattice,
  angle: f32, radius: f32, p: _vgsl_c301a541__FieldParams,
) -> vec2f {
  let warpA = (_vgsl_c301a541__streakFbm(
    tex, samp, lattice, angle, radius, p.angBase * 0.55, p.flowRad * 1.6,
    2, p.dAngle, p.dRadius, 1.6, 2.0, 3.7,
  )) - 0.5;
  let warpB = (_vgsl_c301a541__streakFbm(
    tex, samp, lattice, angle + 2.4, radius * 1.13,
    p.angBase * 2.8, p.radBase * 0.45, 3, p.dAngle, p.dRadius,
    1.7, 2.0, 61.3,
  )) - 0.5;
  let radiusW = radius + (warpA * 1.9 + warpB * 1.25 * p.outward) * p.chaos;
  let angleW = angle + (warpB * 0.9 - warpA * 0.35) * p.chaos * 0.55 / max(radius * 0.22, 0.35);

  let flow = _vgsl_c301a541__streakFbm(
    tex, samp, lattice, angleW, radiusW, p.angBase, p.flowRad,
    3, p.dAngle, p.dRadius, 2.0, 1.12, 131.7,
  );
  let threads = _vgsl_c301a541__ridgeFbm(
    tex, samp, lattice, angleW, radiusW, p.angBase * 0.85, p.radBase,
    5, p.dAngle, p.dRadius, 1.26, 2.05, 0.0,
  );

  let fineVis = clamp(1.0 - 1.7 * max(p.dAngle * p.angBase * 0.85, p.dRadius * p.radBase), 0.0, 1.0);
  let field = mix(flow, flow * 0.22 + threads * 1.05, fineVis);
  let rim = (warpA + warpB * 0.5) * 0.9;
  return vec2f(f32(field), rim);
}

const _vgsl_c301a541__FIELD_MEAN = 0.52;

const _vgsl_c301a541__SHEAR_REF_RADIUS = 6.5;

 const _vgsl_c301a541__SHEAR_PERIOD: f32 = 10.0;
const _vgsl_c301a541__TWO_PI = 6.283185307;

 fn _vgsl_c301a541__shadeDisk(
  g: _vgsl_0afbd304__GBufferSample,
  look: _vgsl_c301a541__DiskLook,
  time: f32,
  footprint: f32,
  noiseTex: texture_3d<f32>,
  noiseSampler: sampler,
) -> _vgsl_c301a541__DiskSample {
  var lattice: _vgsl_c301a541__NoiseLattice;
  lattice.invSize = 1.0 / f32(textureDimensions(noiseTex).x);

  let plane = vec2f(g.position.x, g.position.z);
  let radius = g.diskPolar.x;
  let azimuth = g.diskPolar.y;
  let radiusNorm = clamp(g.diskUv.x, 0.0, 1.0);
  let viewDirection = g.viewDirection;

  let slant = max(abs(viewDirection.y), 0.022);
  let grazing = min(1.0 / slant, 34.0);

  let viewPlane = normalize(vec2f(viewDirection.x, viewDirection.z) + vec2f(1e-6, 0.0));
  let radialDir = normalize(plane + vec2f(1e-6, 0.0));
  let alignR = clamp(abs(dot(radialDir, viewPlane)), 0.0, 1.0);
  let alignT = sqrt(max(1.0 - alignR * alignR, 0.0));
  let stretchSq = grazing * grazing - 1.0;
  let kR = sqrt(1.0 + stretchSq * alignR * alignR);   // radial elongation
  let kT = sqrt(1.0 + stretchSq * alignT * alignT);   // tangential elongation
  let baseScaleR = max(look.detail, 0.05);
  let baseScaleA = max(look.stretch, 0.05);
  let pixelWorld = footprint / max(baseScaleR * kR, baseScaleA * kT / max(radius, _vgsl_0afbd304__ISCO));
  let dRadius = pixelWorld * kR;
  let dAngle = pixelWorld * kT / max(radius, _vgsl_0afbd304__ISCO);

  let omega = look.speed * 0.55 / pow(radius, 1.5);
  let omegaRef = look.speed * 0.55 / pow(_vgsl_c301a541__SHEAR_REF_RADIUS, 1.5);
  let dOmega = omega - omegaRef;
  let rigid = fract(time * omegaRef / _vgsl_c301a541__TWO_PI) * _vgsl_c301a541__TWO_PI;
  let swirl = max(0.0, 0.85 + look.spare1);
  let flowBase = azimuth - rigid + swirl * log(radius / _vgsl_0afbd304__ISCO);

  let cycle = time / _vgsl_c301a541__SHEAR_PERIOD;
  let u0 = fract(cycle);
  let u1 = fract(cycle + 0.5);
  let shear0 = (u0 - 0.5) * _vgsl_c301a541__SHEAR_PERIOD;
  let shear1 = (u1 - 0.5) * _vgsl_c301a541__SHEAR_PERIOD;
  let w0 = 1.0 - abs(2.0 * u0 - 1.0);
  let w1 = 1.0 - w0;
  let angle0 = flowBase - dOmega * shear0;
  let angle1 = flowBase - dOmega * shear1;

  let outward = smoothstep(0.0, 0.92, radiusNorm);
  let fray = max(0.0, 1.0 + look.spare3);
  let chaos = look.turbulence * (0.08 + 2.10 * outward * outward) * fray;

  let angBase = max(look.stretch, 0.05) * 0.45 * (0.80 + 1.45 * outward * fray);
  let radBase = max(look.detail, 0.05) * 2.35;
  let flowRad = max(look.detail, 0.05) * 0.105;

  var params: _vgsl_c301a541__FieldParams;
  params.angBase = angBase;
  params.radBase = radBase;
  params.flowRad = flowRad;
  params.chaos = chaos;
  params.outward = outward;
  params.dAngle = dAngle;
  params.dRadius = dRadius;
  let lobeShift = abs(dOmega) * _vgsl_c301a541__SHEAR_PERIOD * 0.5 * angBase * 0.85;
  let rho = 1.0 - smoothstep(0.12, 1.1, lobeShift);

  var blended: vec2f;
  var lobeVariance = 1.0;
  if (rho > 0.98) {
    let angleMerged = mix(angle1, angle0, w0);
    blended = _vgsl_c301a541__smokeField(noiseTex, noiseSampler, lattice, angleMerged, radius, params);
  } else {
    let lobe0 = _vgsl_c301a541__smokeField(noiseTex, noiseSampler, lattice, angle0, radius, params);
    let lobe1 = _vgsl_c301a541__smokeField(noiseTex, noiseSampler, lattice, angle1, radius, params);
    blended = mix(lobe1, lobe0, w0);
    lobeVariance = sqrt(max(w0 * w0 + w1 * w1 + 2.0 * rho * w0 * w1, 0.25));
  }
  var field = _vgsl_c301a541__FIELD_MEAN + (blended.x - _vgsl_c301a541__FIELD_MEAN) / lobeVariance;

  let cloudRate = omegaRef * look.cloudSpeed;
  let cloudRigid = fract(time * cloudRate / _vgsl_c301a541__TWO_PI) * _vgsl_c301a541__TWO_PI;
  let cloudAngle = azimuth - cloudRigid + 0.32 * log(radius / _vgsl_0afbd304__ISCO);
  let cloudScale = max(look.cloudScale, 0.05);
  let cloudRaw = _vgsl_c301a541__streakFbm(
    noiseTex,
    noiseSampler,
    lattice,
    cloudAngle,
    radius,
    cloudScale,
    cloudScale * 0.34,
    2,
    dAngle,
    dRadius,
    1.72,
    1.86,
    211.7,
  );
  let cloud = smoothstep(0.28, 0.72, cloudRaw);
  let cloudStrength = clamp(look.cloudStrength, 0.0, 0.95);
  let cloudMultiplier = mix(1.0 - cloudStrength, 1.0 + cloudStrength, cloud);
  field *= cloudMultiplier;

  let rimNoise = blended.y;
  let innerEdge = smoothstep(0.0, 0.055, radiusNorm);
  let outerEdge = 1.0 - smoothstep(0.42 + rimNoise * 0.30 * fray, 1.0, radiusNorm);
  let envelope = innerEdge * outerEdge * mix(1.0, 0.62, outward);

  let contrast = max(0.2, 1.0 + look.spare2);
  let lo = 0.50 - 0.16 / contrast;
  let hi = 0.50 + 0.21 / contrast;
  var smoke = clamp(pow(smoothstep(lo, hi, field), 1.0 + 0.9 * contrast) * envelope, 0.0, 1.0);

  let fieldN = clamp((field - (lo - 0.10)) / max(hi - lo + 0.26, 0.02), 0.0, 1.0);
  let emissivity = (mix(0.05, 1.0, pow(fieldN, 1.35)) + 2.2 * pow(fieldN, 5.0)) * envelope;

  let path = pow(grazing, 0.62);
  let thickness = mix(0.30, 0.85, radiusNorm);
  let opticalDepth = smoke * thickness * path * look.density * 0.95;
  let coverage = 1.0 - exp(-opticalDepth);

  let heat = pow(1.0 - radiusNorm, 1.25);
  var thermal = mix(vec3f(0.52, 0.14, 0.03), vec3f(1.0, 0.56, 0.17), smoothstep(0.03, 0.5, heat));
  thermal = mix(thermal, vec3f(1.0, 0.94, 0.83), pow(heat, 2.2));

  let tangent = normalize(vec3f(-plane.y, 0.0, plane.x));
  let orbitalSpeed = min(0.64, 0.94 / sqrt(max(radius - _vgsl_0afbd304__HORIZON, 0.25)));
  let towardObserver = dot(tangent, -normalize(viewDirection));
  let beaming = pow(clamp(1.0 / (1.0 - orbitalSpeed * towardObserver), 0.72, 1.55), 1.5 * look.doppler);
  let redshift = sqrt(max(1.0 - _vgsl_0afbd304__HORIZON / radius, 0.025));

  let facing = mix(0.82, 1.0, step(0.0, g.side));

  let flux = pow(clamp(_vgsl_0afbd304__ISCO / radius, 0.0, 1.0), 1.7);
  let core = 1.0 + 2.6 * pow(1.0 - radiusNorm, 5.0);

  let arcLift = max(0.0, 1.0 + look.spare0);
  let faceOn = smoothstep(0.16, 0.75, abs(viewDirection.y));
  let lift = 1.0 + 1.55 * arcLift * faceOn;
  let edgeGlow = 1.0 + 0.55 * smoothstep(6.0, 26.0, grazing);

  let source = thermal * beaming * redshift * facing * flux * lift * edgeGlow * core * emissivity;
  let emission = source * look.brightness * 1.35;

  var sample: _vgsl_c301a541__DiskSample;
  sample.color = vec3f(emission);
  sample.alpha = coverage;
  return sample;
}

// vgsl-module: e:\\pfolio\\optimized-black-hole\\stars.wgsl
// Procedural lensed star field with anisotropic footprint prefiltering.

      

const _vgsl_a87f9ea6__STAR_INTENSITY: f32 = 1.9;

const _vgsl_a87f9ea6__ANCHOR_CELLS: f32 = 36.0;
const _vgsl_a87f9ea6__ANCHOR_FILL: f32 = 0.75;
const _vgsl_a87f9ea6__ANCHOR_RADIUS: f32 = 0.00110;
const _vgsl_a87f9ea6__ANCHOR_PEAK: f32 = 1.0;

const _vgsl_a87f9ea6__FIELD_CELLS: f32 = 93.0;
const _vgsl_a87f9ea6__FIELD_FILL: f32 = 0.75;
const _vgsl_a87f9ea6__FIELD_RADIUS: f32 = 0.00070;
const _vgsl_a87f9ea6__FIELD_PEAK: f32 = 0.45;

const _vgsl_a87f9ea6__DUST_CELLS: f32 = 151.0;
const _vgsl_a87f9ea6__DUST_FILL: f32 = 0.75;
const _vgsl_a87f9ea6__DUST_RADIUS: f32 = 0.00040;
const _vgsl_a87f9ea6__DUST_PEAK: f32 = 0.22;

const _vgsl_a87f9ea6__COUNT_SLOPE: f32 = 2.0;

const _vgsl_a87f9ea6__STAR_FLUX_AREA: f32 = 0.5385;

const _vgsl_a87f9ea6__MAX_PREFILTER_PIXELS: f32 = 4.0;

const _vgsl_a87f9ea6__STAR_WARM: vec3f = vec3f(1.1741, 0.9745, 0.7397);
const _vgsl_a87f9ea6__STAR_COOL: vec3f = vec3f(0.8954, 1.0131, 1.1781);

 struct _vgsl_a87f9ea6__StarLook {
  brightness: f32,
  density: f32,
  contrast: f32,
  warmth: f32,
  twinkle: f32,
}

fn _vgsl_a87f9ea6__faceCoords(direction: vec3f) -> vec3f {
  let magnitude = abs(direction);
  if (magnitude.x >= magnitude.y && magnitude.x >= magnitude.z) {
    return vec3f(direction.yz / magnitude.x, select(1.0, 0.0, direction.x > 0.0));
  }
  if (magnitude.y >= magnitude.z) {
    return vec3f(direction.xz / magnitude.y, select(3.0, 2.0, direction.y > 0.0));
  }
  return vec3f(direction.xy / magnitude.z, select(5.0, 4.0, direction.z > 0.0));
}

fn _vgsl_a87f9ea6__faceProject(direction: vec3f, axis: i32) -> vec2f {
  if (axis == 0) {
    return direction.yz / abs(direction.x);
  }
  if (axis == 1) {
    return direction.xz / abs(direction.y);
  }
  return direction.xy / abs(direction.z);
}

struct _vgsl_a87f9ea6__SkyFilter {
  inverseJacobian: mat2x2f,
  pixelsPerFace: f32,
  faceMajor: f32,
}

fn _vgsl_a87f9ea6__skyFilter(direction: vec3f, axis: i32, ddx: vec3f, ddy: vec3f) -> _vgsl_a87f9ea6__SkyFilter {
  let base = _vgsl_a87f9ea6__faceProject(direction, axis);
  let jx = _vgsl_a87f9ea6__faceProject(direction + ddx, axis) - base;
  let jy = _vgsl_a87f9ea6__faceProject(direction + ddy, axis) - base;

  let determinant = jx.x * jy.y - jx.y * jy.x;
  let safeDeterminant = select(determinant, 1.0e-24, abs(determinant) < 1.0e-24);
  let inverse = mat2x2f(vec2f(jy.y, -jx.y), vec2f(-jy.x, jx.x)) * (1.0 / safeDeterminant);

  var prefilter: _vgsl_a87f9ea6__SkyFilter;
  prefilter.inverseJacobian = inverse;
  prefilter.pixelsPerFace = 1.0 / sqrt(max(abs(determinant), 1.0e-24));
  prefilter.faceMajor = max(length(jx), length(jy));
  return prefilter;
}

struct _vgsl_a87f9ea6__SkyState {
  brightness: f32,
  rangePower: f32,
  meanFlux: f32,
  warmth: f32,
  twinkle: f32,
  time: f32,
  fillScale: f32,
  radiusScale: f32,
}

fn _vgsl_a87f9ea6__resolveSky(look: _vgsl_a87f9ea6__StarLook, face: vec2f, time: f32) -> _vgsl_a87f9ea6__SkyState {
  let range = clamp(look.contrast, 1.0, 512.0);
  let rangePower = range * range;

  let compression = 1.0 + dot(face, face);
  let root = sqrt(compression);

  var sky: _vgsl_a87f9ea6__SkyState;
  sky.brightness = max(0.0, look.brightness) * _vgsl_a87f9ea6__STAR_INTENSITY;
  sky.rangePower = rangePower;
  sky.meanFlux = _vgsl_a87f9ea6__COUNT_SLOPE / (range + _vgsl_a87f9ea6__COUNT_SLOPE - 1.0);
  sky.warmth = clamp(look.warmth, 0.0, 1.0);
  sky.twinkle = clamp(look.twinkle, 0.0, 1.0);
  sky.time = time;
  sky.fillScale = max(0.0, look.density) / (compression * root);
  sky.radiusScale = sqrt(compression * root);
  return sky;
}

struct _vgsl_a87f9ea6__Species {
  cells: f32,
  fill: f32,
  peak: f32,
  faceRadius: f32,
  radiusPixels: f32,
  gain: f32,
}

fn _vgsl_a87f9ea6__resolveSpecies(
  cells: f32,
  fill: f32,
  peak: f32,
  angularRadius: f32,
  sky: _vgsl_a87f9ea6__SkyState,
  prefilter: _vgsl_a87f9ea6__SkyFilter,
) -> _vgsl_a87f9ea6__Species {
  let faceRadius = angularRadius * sky.radiusScale;
  let starPixels = faceRadius * prefilter.pixelsPerFace;

  var species: _vgsl_a87f9ea6__Species;
  species.cells = cells;
  species.fill = clamp(fill * sky.fillScale, 0.0, 1.0);
  species.peak = peak * sky.brightness;
  species.faceRadius = faceRadius;
  species.radiusPixels = clamp(starPixels, 1.0, _vgsl_a87f9ea6__MAX_PREFILTER_PIXELS);
  species.gain = min(1.0, starPixels * starPixels);
  return species;
}

fn _vgsl_a87f9ea6__starPoint(
  cell: vec2f,
  grid: vec2f,
  faceIndex: i32,
  seed: i32,
  species: _vgsl_a87f9ea6__Species,
  sky: _vgsl_a87f9ea6__SkyState,
  prefilter: _vgsl_a87f9ea6__SkyFilter,
) -> vec3f {
  let hashed = _vgsl_d9acb16b__pcg3d(bitcast<vec3u>(vec3i(vec2i(cell), faceIndex * 131 + seed)));
  let presence = _vgsl_d9acb16b__unitFloat(hashed.x);
  if (presence > species.fill) {
    return vec3f(0.0);
  }

  let jitter = vec2f(_vgsl_d9acb16b__unitFloat(hashed.y), _vgsl_d9acb16b__unitFloat(hashed.z)) - vec2f(0.5);
  let center = cell + vec2f(0.5) + jitter * 0.8;
  let offsetPixels = prefilter.inverseJacobian * ((grid - center) / species.cells);
  let falloff = 1.0 - smoothstep(0.0, species.radiusPixels, length(offsetPixels));

  let uniform01 = presence / max(species.fill, 1.0e-6);
  let flux = inverseSqrt(1.0 + uniform01 * (sky.rangePower - 1.0));

  let tint = mix(vec3f(1.0), mix(_vgsl_a87f9ea6__STAR_WARM, _vgsl_a87f9ea6__STAR_COOL, _vgsl_d9acb16b__unitFloat(hashed.y ^ hashed.z)), sky.warmth);

  let phase = _vgsl_d9acb16b__unitFloat(hashed.y) * 6.2831853;
  let shimmer = 1.0 + sky.twinkle * 0.06 * sin(sky.time * (0.35 + _vgsl_d9acb16b__unitFloat(hashed.z) * 0.4) + phase);
  return tint * (falloff * falloff * species.peak * flux * shimmer * species.gain);
}

fn _vgsl_a87f9ea6__starSpecies(
  face: vec3f,
  seed: i32,
  species: _vgsl_a87f9ea6__Species,
  sky: _vgsl_a87f9ea6__SkyState,
  prefilter: _vgsl_a87f9ea6__SkyFilter,
) -> vec3f {
  let faceIndex = i32(face.z);
  let grid = face.xy * species.cells;
  let total = _vgsl_a87f9ea6__starPoint(floor(grid), grid, faceIndex, seed, species, sky, prefilter);

  let extent = species.faceRadius * species.cells;
  let mean = species.peak * sky.meanFlux * species.fill * _vgsl_a87f9ea6__STAR_FLUX_AREA * extent * extent;
  let meanTint = mix(vec3f(1.0), 0.5 * (_vgsl_a87f9ea6__STAR_WARM + _vgsl_a87f9ea6__STAR_COOL), sky.warmth);
  let cellsPerPixel = species.cells * prefilter.faceMajor;
  return mix(total, meanTint * mean, smoothstep(1.0, 3.0, cellsPerPixel));
}

 fn _vgsl_a87f9ea6__shadeStars(direction: vec3f, look: _vgsl_a87f9ea6__StarLook, time: f32, ddx: vec3f, ddy: vec3f) -> vec3f {
  let d = normalize(direction);
  let face = _vgsl_a87f9ea6__faceCoords(d);
  let prefilter = _vgsl_a87f9ea6__skyFilter(d, i32(face.z) / 2, ddx, ddy);
  let sky = _vgsl_a87f9ea6__resolveSky(look, face.xy, time);

  return _vgsl_a87f9ea6__starSpecies(
    face, 17,
    _vgsl_a87f9ea6__resolveSpecies(_vgsl_a87f9ea6__ANCHOR_CELLS, _vgsl_a87f9ea6__ANCHOR_FILL, _vgsl_a87f9ea6__ANCHOR_PEAK, _vgsl_a87f9ea6__ANCHOR_RADIUS, sky, prefilter),
    sky, prefilter,
  ) + _vgsl_a87f9ea6__starSpecies(
    face, 71,
    _vgsl_a87f9ea6__resolveSpecies(_vgsl_a87f9ea6__FIELD_CELLS, _vgsl_a87f9ea6__FIELD_FILL, _vgsl_a87f9ea6__FIELD_PEAK, _vgsl_a87f9ea6__FIELD_RADIUS, sky, prefilter),
    sky, prefilter,
  ) + _vgsl_a87f9ea6__starSpecies(
    face, 149,
    _vgsl_a87f9ea6__resolveSpecies(_vgsl_a87f9ea6__DUST_CELLS, _vgsl_a87f9ea6__DUST_FILL, _vgsl_a87f9ea6__DUST_PEAK, _vgsl_a87f9ea6__DUST_RADIUS, sky, prefilter),
    sky, prefilter,
  );
}

// vgsl-module: e:\\pfolio\\optimized-black-hole\\node_modules\\@vgpu\\wgsl-std\\src\\hash\\index.wgsl
// Wellons lowbias32: https://github.com/skeeto/hash-prospector
 

 

 fn _vgsl_d9acb16b__pcg3d(value: vec3u) -> vec3u {
  var hashed = value * 1664525u + 1013904223u;
  hashed.x = hashed.x + hashed.y * hashed.z;
  hashed.y = hashed.y + hashed.z * hashed.x;
  hashed.z = hashed.z + hashed.x * hashed.y;
  hashed = hashed ^ (hashed >> vec3u(16u));
  hashed.x = hashed.x + hashed.y * hashed.z;
  hashed.y = hashed.y + hashed.z * hashed.x;
  hashed.z = hashed.z + hashed.x * hashed.y;
  hashed = hashed ^ (hashed >> vec3u(16u));
  return hashed;
}

 fn _vgsl_d9acb16b__unitFloat(hash: u32) -> f32 {
  return f32(hash >> 8u) * (1.0 / 16777216.0);
}

 

 

 
`,ie=`// vgsl-module: e:\\pfolio\\optimized-black-hole\\bloom.wgsl
// HDR bloom downsample and separable Gaussian blur.

struct _vgsl_648ad52a__Bloom {
  sourceSize: vec2f,
  direction: vec2f,
  params: vec4f,
}

@group(0) @binding(0) var<uniform> bloom: _vgsl_648ad52a__Bloom;
@group(0) @binding(1) var source: texture_2d<f32>;
@group(0) @binding(2) var linearSampler: sampler;

fn _vgsl_648ad52a__softThreshold(color: vec3f) -> vec3f {
  let threshold = bloom.params.x;
  if (threshold <= 0.0) {
    return color;
  }

  let brightness = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  let knee = max(min(bloom.params.y, threshold), 0.000001);
  let soft = clamp(brightness - threshold + knee, 0.0, 2.0 * knee);
  let softContribution = soft * soft / (4.0 * knee + 0.0001);
  let contribution = max(brightness - threshold, softContribution) / max(brightness, 0.0001);
  return color * contribution;
}

fn _vgsl_648ad52a__downsample(uv: vec2f) -> vec3f {
  let texel = 1.0 / bloom.sourceSize;
  let offset = texel * 0.5;
  let color = (
    textureSample(source, linearSampler, uv + vec2f(-offset.x, -offset.y)).rgb +
    textureSample(source, linearSampler, uv + vec2f( offset.x, -offset.y)).rgb +
    textureSample(source, linearSampler, uv + vec2f(-offset.x,  offset.y)).rgb +
    textureSample(source, linearSampler, uv + vec2f( offset.x,  offset.y)).rgb
  ) * 0.25;
  return _vgsl_648ad52a__softThreshold(color);
}

fn _vgsl_648ad52a__gaussianBlur(uv: vec2f) -> vec3f {
  let sigma = max(bloom.params.z, 0.5);
  let inverseTwoSigmaSquared = 0.5 / (sigma * sigma);
  let w0 = 1.0;
  let w1 = exp(-1.0 * inverseTwoSigmaSquared);
  let w2 = exp(-4.0 * inverseTwoSigmaSquared);
  let w3 = exp(-9.0 * inverseTwoSigmaSquared);
  let w4 = exp(-16.0 * inverseTwoSigmaSquared);

  let pair12 = w1 + w2;
  let pair34 = w3 + w4;
  let offset12 = (w1 + 2.0 * w2) / max(pair12, 0.000001);
  let offset34 = (3.0 * w3 + 4.0 * w4) / max(pair34, 0.000001);
  let normalization = w0 + 2.0 * (pair12 + pair34);
  let texel = bloom.direction / bloom.sourceSize;

  var color = textureSample(source, linearSampler, uv).rgb * w0;
  color += textureSample(source, linearSampler, uv + texel * offset12).rgb * pair12;
  color += textureSample(source, linearSampler, uv - texel * offset12).rgb * pair12;
  color += textureSample(source, linearSampler, uv + texel * offset34).rgb * pair34;
  color += textureSample(source, linearSampler, uv - texel * offset34).rgb * pair34;
  return color / normalization;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  var color: vec3f;
  if (bloom.params.w > 0.5) {
    color = _vgsl_648ad52a__gaussianBlur(uv);
  } else {
    color = _vgsl_648ad52a__downsample(uv);
  }
  return vec4f(color, 1.0);
}
`,fc=`// vgsl-module: e:\\pfolio\\optimized-black-hole\\composite.wgsl
// Combine bloom levels, tone map, vignette, and convert to display output.

struct _vgsl_da4b42cc__Composite {
  params: vec4f,
}

@group(0) @binding(0) var<uniform> composite: _vgsl_da4b42cc__Composite;
@group(0) @binding(1) var scene: texture_2d<f32>;
@group(0) @binding(2) var bloomNear: texture_2d<f32>;
@group(0) @binding(3) var bloomMedium: texture_2d<f32>;
@group(0) @binding(4) var bloomFar: texture_2d<f32>;
@group(0) @binding(5) var linearSampler: sampler;

const _vgsl_da4b42cc__EXPOSURE: f32 = 1.15;
const _vgsl_da4b42cc__SATURATION: f32 = 0.0;

// PORTFOLIO CHANGE: how opaque the empty space around the black hole is.
// 0.0 = fully transparent, so the card's own themed background shows through;
// 1.0 = the upstream behaviour, a hard black rectangle over the card.
const _vgsl_da4b42cc__BACKDROP_OPACITY: f32 = 0.0;

fn _vgsl_da4b42cc__aces(x: vec3f) -> vec3f {
  let a = 2.51;
  let b = 0.03;
  let c = 2.43;
  let d = 0.59;
  let e = 0.14;
  return clamp((x * (a * x + vec3f(b))) / (x * (c * x + vec3f(d)) + vec3f(e)), vec3f(0.0), vec3f(1.0));
}

fn _vgsl_da4b42cc__tonemap(linearColor: vec3f, uv: vec2f) -> vec3f {
  var color = _vgsl_da4b42cc__aces(linearColor * _vgsl_da4b42cc__EXPOSURE);

  let centered = uv - vec2f(0.5);
  let vignette = 1.0 - smoothstep(0.55, 1.15, length(centered) * 1.6);
  color *= mix(0.72, 1.0, vignette);

  color = pow(color, vec3f(1.0 / 2.2));
  let luma = dot(color, vec3f(0.2126, 0.7152, 0.0722));
  return mix(vec3f(luma), color, _vgsl_da4b42cc__SATURATION);
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let sceneColor = textureSample(scene, linearSampler, uv).rgb;
  let bloom =
    textureSample(bloomNear, linearSampler, uv).rgb * 0.50 +
    textureSample(bloomMedium, linearSampler, uv).rgb * 0.32 +
    textureSample(bloomFar, linearSampler, uv).rgb * 0.18;
  let hdr = sceneColor + bloom * composite.params.x;
  let color = _vgsl_da4b42cc__tonemap(hdr, uv);

  // PORTFOLIO CHANGE: emit premultiplied alpha instead of a constant 1.0 so the
  // card background shows through empty space. SATURATION = 0 makes \`color\`
  // greyscale, so rgb == luma == alpha - already valid premultiplied output,
  // and the result over a backdrop B is exactly luma + (1 - luma) * B.
  let luma = clamp(dot(color, vec3f(0.2126, 0.7152, 0.0722)), 0.0, 1.0);
  let alpha = mix(luma, 1.0, _vgsl_da4b42cc__BACKDROP_OPACITY);
  return vec4f(color, alpha);
}
`;var xp="r8unorm";var G=Math.fround,Bn=e=>G(e-Math.floor(e)),bp=G(.1031),yp=G(.103),_p=G(.0973),Si=G(33.33);function vp(e,t,n){let r=Bn(G(e*bp)),i=Bn(G(t*yp)),o=Bn(G(n*_p)),s=G(G(G(r*G(i+Si))+G(i*G(o+Si)))+G(o*G(r+Si)));return r=G(r+s),i=G(i+s),o=G(o+s),Bn(G(G(r+i)*o))}function Ei(e,t){return e<t/2?e:e-t}function wp(e,t){let n=new Uint8Array(e*e*e),r=t*1024,i=0;for(let o=0;o<e;o++){let s=Ei(o,e)+r;for(let a=0;a<e;a++){let c=Ei(a,e);for(let l=0;l<e;l++)n[i++]=Math.min(255,Math.round(vp(Ei(l,e),c,s)*255))}}return n}var pc=new Map;function Sp(e,t){let n=`${e}:${t}`,r=pc.get(n);return r||(r=wp(e,t),pc.set(n,r)),r}function mc(e,t=64,n="black-hole-noise"){let r=e.device.createTexture({size:[t,t,t],dimension:"3d",format:xp,usage:["texture_binding","copy_dst"],label:n});try{return e.gpu.queue.writeTexture({texture:r.gpu},Sp(t,13),{offset:0,bytesPerRow:t,rowsPerImage:t},{width:t,height:t,depthOrArrayLayers:t}),r}catch(i){try{r.destroy()}catch{}throw i}}function hc(e,t){return e.sampler(t,{addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat",minFilter:"linear",magFilter:"linear"})}var kp=["rg32float","rg32float","rgba16float","rgba16float"],Pp=["rg8unorm","rgba16float"],j=[0,0,0,1];function gc(e,t){let n=e.sampler(t,{minFilter:"linear",magFilter:"linear"}),r=hc(e,t);return{bake:e.effect(t,lc),refine:e.effect(t,uc),shade:e.effect(t,dc),bloomExtract:e.effect(t,ie),bloomBlurH0:e.effect(t,ie),bloomBlurV0:e.effect(t,ie),bloomDown1:e.effect(t,ie),bloomBlurH1:e.effect(t,ie),bloomBlurV1:e.effect(t,ie),bloomDown2:e.effect(t,ie),bloomBlurH2:e.effect(t,ie),bloomBlurV2:e.effect(t,ie),composite:e.effect(t,fc),postSampler:n,noiseSampler:r,noiseVolume:mc(t,64)}}function Pi(e,t,n){let r=Rp(n),i=ki(r,2),o=ki(r,4),s=ki(r,8),a=u=>e.target(t,{size:u,colors:[{format:"rgba16float"}]}),c=[],l=u=>(c.push(u),u);try{return{gbuffer:l(e.target(t,{size:r,colors:kp.map(u=>({format:u}))})),aa:l(e.target(t,{size:r,colors:Pp.map(u=>({format:u}))})),scene:l(a(r)),bloom0:l(a(i)),bloomPing0:l(a(i)),bloom1:l(a(o)),bloomPing1:l(a(o)),bloom2:l(a(s)),bloomPing2:l(a(s))}}catch(u){try{xc(c.reverse())}catch{}throw u}}function Ii(e){xc([e.gbuffer,e.aa,e.scene,e.bloom0,e.bloomPing0,e.bloom1,e.bloomPing1,e.bloom2,e.bloomPing2])}function xc(e){let t=!1,n;for(let r of e)try{Ip(r)}catch(i){t||(n=i),t=!0}if(t)throw n}function Ip(e){e?.destroy?.()}function Ri(e,t){let[n,r,i,o]=t.gbuffer.colors,[s,a]=t.aa.colors;e.bake.set({bake:{resolution:t.gbuffer.size}}),e.refine.set({gHit1:n,gSky:i,refine:{resolution:t.gbuffer.size}}),e.shade.set({gHit1:n,gHit2:r,gSky:i,gView:o,gAa:s,gAaGeom:a,noiseVolume:e.noiseVolume,noiseSampler:e.noiseSampler,shade:{resolution:t.gbuffer.size}});let c=t.scene.colors[0],l=t.bloom0.colors[0],u=t.bloomPing0.colors[0],d=t.bloom1.colors[0],f=t.bloomPing1.colors[0],m=t.bloom2.colors[0],x=t.bloomPing2.colors[0];e.bloomExtract.set({source:c,linearSampler:e.postSampler}),e.bloomBlurH0.set({source:l,linearSampler:e.postSampler}),e.bloomBlurV0.set({source:u,linearSampler:e.postSampler}),e.bloomDown1.set({source:l,linearSampler:e.postSampler}),e.bloomBlurH1.set({source:d,linearSampler:e.postSampler}),e.bloomBlurV1.set({source:f,linearSampler:e.postSampler}),e.bloomDown2.set({source:d,linearSampler:e.postSampler}),e.bloomBlurH2.set({source:m,linearSampler:e.postSampler}),e.bloomBlurV2.set({source:x,linearSampler:e.postSampler}),e.composite.set({scene:c,bloomNear:l,bloomMedium:d,bloomFar:m,linearSampler:e.postSampler})}function bc(e,t,n){let r={resolution:t.gbuffer.size,yaw:0,pitch:n.cameraY,orbitRadius:n.distance,diskOuter:n.diskRadius,fov:n.fov,centerX:n.centerX,centerY:n.centerY,roll:n.cameraRoll};e.bake.set({bake:r}),e.refine.set({refine:r})}function yc(e,t,n,r,i){e.shade.set({shade:{resolution:t.gbuffer.size,time:r,diskOuter:n.diskRadius,sceneYaw:i,centerFade:n.centerFade},disk:n.disk,stars:n.stars})}function Ai(e,t,n){let r=Math.max(0,n.bloom.threshold),i=Math.max(1e-4,n.bloom.knee),o=Math.max(.1,n.bloom.radius),s=(c,l)=>({sourceSize:c,direction:[0,0],params:[l?r:-1,i,o,0]}),a=(c,l,u)=>({sourceSize:c,direction:[l,u],params:[-1,i,o,1]});e.bloomExtract.set({bloom:s(t.scene.size,!0)}),e.bloomBlurH0.set({bloom:a(t.bloom0.size,1,0)}),e.bloomBlurV0.set({bloom:a(t.bloomPing0.size,0,1)}),e.bloomDown1.set({bloom:s(t.bloom0.size,!1)}),e.bloomBlurH1.set({bloom:a(t.bloom1.size,1,0)}),e.bloomBlurV1.set({bloom:a(t.bloomPing1.size,0,1)}),e.bloomDown2.set({bloom:s(t.bloom1.size,!1)}),e.bloomBlurH2.set({bloom:a(t.bloom2.size,1,0)}),e.bloomBlurV2.set({bloom:a(t.bloomPing2.size,0,1)}),e.composite.set({composite:{params:[Math.max(0,n.bloom.strength),0,0,0]}})}async function _c(e,t,n){let r={colors:[t.bloom0.format]};await Promise.all([e.bake.compile(t.gbuffer),e.refine.compile(t.aa),e.shade.compile(t.scene),e.bloomExtract.compile(r),e.bloomBlurH0.compile(r),e.bloomBlurV0.compile(r),e.bloomDown1.compile(r),e.bloomBlurH1.compile(r),e.bloomBlurV1.compile(r),e.bloomDown2.compile(r),e.bloomBlurH2.compile(r),e.bloomBlurV2.compile(r),e.composite.compile({colors:[n.format]})])}function vc(e,t,n,r,i){i&&(e.pass({target:n.gbuffer,clear:j},o=>o.draw(t.bake)),e.pass({target:n.aa,clear:j},o=>o.draw(t.refine))),e.pass({target:n.scene,clear:j},o=>o.draw(t.shade)),e.pass({target:n.bloom0,clear:j},o=>o.draw(t.bloomExtract)),e.pass({target:n.bloomPing0,clear:j},o=>o.draw(t.bloomBlurH0)),e.pass({target:n.bloom0,clear:j},o=>o.draw(t.bloomBlurV0)),e.pass({target:n.bloom1,clear:j},o=>o.draw(t.bloomDown1)),e.pass({target:n.bloomPing1,clear:j},o=>o.draw(t.bloomBlurH1)),e.pass({target:n.bloom1,clear:j},o=>o.draw(t.bloomBlurV1)),e.pass({target:n.bloom2,clear:j},o=>o.draw(t.bloomDown2)),e.pass({target:n.bloomPing2,clear:j},o=>o.draw(t.bloomBlurH2)),e.pass({target:n.bloom2,clear:j},o=>o.draw(t.bloomBlurV2)),e.pass({target:r,clear:j},o=>o.draw(t.composite))}function Rp(e){return[Math.max(1,Math.floor(e[0])),Math.max(1,Math.floor(e[1]))]}function ki(e,t){return[Math.max(1,Math.floor(e[0]/t)),Math.max(1,Math.floor(e[1]/t))]}function wc(){return{mouseYaw:0,autoYaw:.16}}function Sc(){return{cameraY:.16,distance:13.5,diskRadius:9,fov:3,centerX:.8,centerY:.3,cameraRoll:-.27,mouseYaw:.15,autoYaw:0,autoYawPeriod:40,centerFade:0,bloom:{strength:1,threshold:0,knee:.18,radius:1.5},disk:{brightness:.75,speed:.75,stretch:5.75,detail:3.44,turbulence:4.46,density:1.38,doppler:1.21,cloudScale:20,cloudSpeed:.3,cloudStrength:.2,spare0:.43,spare1:-.25,spare2:-.67,spare3:.69},stars:{brightness:1,density:1,contrast:13,warmth:.5,twinkle:0}}}var Ap=.325,Cp=.1,Tp=60,Fp=2,Lp=1e3/Tp-Fp,Dp="(max-width: 767px)",$p=45,Gp=60,Mp=34,Up=2;function zy({canvas:e,onError:t,onSlow:n,interactionElement:r}){let i=Sc(),o={centerX:i.centerX,centerY:i.centerY,cameraRoll:i.cameraRoll,mouseYaw:i.mouseYaw,autoYaw:i.autoYaw,centerFade:i.centerFade,distance:i.distance,fov:i.fov},s=window.matchMedia(Dp),a=()=>{Object.assign(i,s.matches?wc():o)};a();let c=Math.min(Math.max(window.devicePixelRatio,1),2)/2;i.bloom.radius*=c,i.bloom.strength*=c;let l=!1,u,d,f,m,x,g,E,k,C=typeof document>"u"?!0:!document.hidden,T=!0,N=!1,D=0,H,oe=0,p,b=!0,y=0,w=0,A,je=()=>{a(),b=!0};s.addEventListener("change",je);let se=r||e,ae=v=>{if(v.pointerType!=="mouse")return;let M=se.getBoundingClientRect();if(M.width<=0)return;let $=(v.clientX-M.left)/M.width;y=Math.min(1,Math.max(-1,$*2-1))},$e=()=>{y=0},Bt=()=>{document.hidden&&$e(),C=!document.hidden,ce()};function ce(){if(!N||!d||!u)return;let v=!l&&C&&T;v!==!!g&&(v?(H=void 0,A=void 0,g=Ec(u,d)):(g?.stop(),g=void 0))}function Ec(v,M){let $=!1,q,He=Nn=>{if(!$){if(q===void 0||Nn-q>=Lp){let $i=q;q=Nn;try{v.frame(M,Ic)}catch(Fc){$=!0,Vn(Fc);return}$i!==void 0&&kc(Nn-$i)}$||(Di=requestAnimationFrame(He))}},Di=requestAnimationFrame(He);return{stop(){$=!0,cancelAnimationFrame(Di)}}}let Ci=$p,Ot=[],On=0,Ti=!1,kc=v=>{if(!n||Ti)return;if(Ci>0){Ci--;return}if(Ot.push(v),Ot.length<Gp)return;let M=Ot.slice().sort((q,He)=>q-He),$=M[M.length>>1];Ot.length=0,On=$>Mp?On+1:0,!(On<Up)&&(Ti=!0,n($))},Pc=v=>(D+=H===void 0?0:Math.max(0,(v-H)/1e3),H=v,D),Ic=v=>{if(l||!m||!x||!f)return;let M=Bp(),$=b;b=!1,$&&bc(m,x,i),yc(m,x,i,Pc(M),Rc(M)),vc(v,m,x,f,$)},Rc=v=>{if(i.autoYaw>0){A=v;let q=Math.max(1,i.autoYawPeriod||26),He=(D/q+.25)%1;return w=(1-Math.abs(4*He-2))*i.autoYaw,w}if(i.mouseYaw<=0)return w=0,A=v,0;let M=A===void 0?0:Math.min(Math.max((v-A)/1e3,0),Cp);A=v;let $=y*Math.max(0,i.mouseYaw);return w+=($-w)*(1-Math.exp(-M/Ap)),w},Ac=()=>{oe=0;let v=p;if(p=void 0,!(l||!v||!d||!u||!m||!x||!f))try{let M=x,$=Pi(u,d,[Math.max(1,Math.round(v.width)),Math.max(1,Math.round(v.height))]);try{Ri(m,$),Ai(m,$,i)}catch(q){throw Ii($),q}x=$,Ii(M),b=!0}catch(M){Vn(M)}},Cc=v=>{l||v.width<=0||v.height<=0||(p=v,oe||(oe=requestAnimationFrame(Ac)))},Fi=()=>{Cc({width:e.clientWidth,height:e.clientHeight})},Li=()=>{l||(l=!0,g?.stop(),g=void 0,oe&&cancelAnimationFrame(oe),E?.disconnect(),k?.disconnect(),typeof window<"u"&&(s.removeEventListener("change",je),se.removeEventListener("pointermove",ae),se.removeEventListener("pointerleave",$e),window.removeEventListener("blur",$e),document.removeEventListener("visibilitychange",Bt)),d?.dispose())},Tc=async()=>{let v=wi,{init:M}=v;if(l)return;let $=await M();if(l){$.dispose();return}d=$,u=v,f=v.surface(d,e,{dpr:1,alphaMode:"premultiplied"}),m=gc(v,d),x=Pi(v,d,f.size),Ri(m,x),Ai(m,x,i),await _c(m,x,f),!l&&(E=typeof ResizeObserver>"u"?void 0:new ResizeObserver(Fi),E?.observe(e),se.addEventListener("pointermove",ae,{passive:!0}),se.addEventListener("pointerleave",$e,{passive:!0}),window.addEventListener("blur",$e),document.addEventListener("visibilitychange",Bt),typeof IntersectionObserver<"u"&&(k=new IntersectionObserver(q=>{T=q[q.length-1]?.isIntersecting??T,ce()},{threshold:0}),k.observe(e)),Fi(),N=!0,C=!document.hidden,ce())};function Vn(v){if(Li(),t){t(v);return}throw v}return{ready:Tc().catch(v=>{if(!l&&(Vn(v),!t))throw v}),dispose:Li}}function Bp(){return typeof performance>"u"?Date.now():performance.now()}export{zy as createRenderer};

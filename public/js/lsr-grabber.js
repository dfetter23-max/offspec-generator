/* ============================================================
 * LSR Grabber v5 — universal extractor
 * Loaded by the thin bookmarklet on bookmarklet.html.
 *
 * Goals (compared with v4 which was inlined in the bookmarklet):
 *   1. Always show a persistent overlay with status + a clickable
 *      "Open Offspec Generator" button. v4's only output channel was
 *      window.open() — silently blocked by some Chrome popup-blocker
 *      configs (the symptom on Dan's boss's machine).
 *   2. File-picker fallback so the user can re-pick the PDF from disk
 *      when the in-tab PDF URL can't be fetched (Adobe extension,
 *      "always download PDFs" policy, weird SAP wrappers, etc.).
 *   3. Multi-CDN pdf.js loader with timeout & fallback.
 *   4. 10-second timeout on getDocument so we never hang silently.
 *   5. Triple-delivery of the parsed JSON:
 *        (a) clipboard.writeText  — for the "Paste from LSR" button
 *        (b) window.open #bm=...  — fast path when popups allowed
 *        (c) overlay's big "Open Offspec Generator" button — always
 *            works since the user's own click counts as activation.
 *   6. Collapsible diagnostics so when something still fails on a
 *      machine we can't physically reach, the user can copy the log
 *      and send it back.
 *
 * IMPORTANT: keep the emitted JSON shape compatible with the receiver
 * at public/js/offspec.js (auto-load #bm= block ~ line 352, and the
 * "Paste from LSR" button ~ line 326). Shape: { type, ln, lr, mm, so? }
 * where mm[manifest] = { mn, sd, g, li:[ {it,mn,pg,li,ws,gn,rd,sd,
 * cont,cType,procCD,weight,sample, group?, pln?, note?} ] }.
 * ============================================================ */
(function(){
'use strict';

var ROOT_ID='__lsrgrab_root_v5';
var APP_URL='https://ec-receiving.web.app/';
var PDFJS_URLS=[
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js'
];
var WORKER_URLS=[
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'
];
var FETCH_TIMEOUT_MS=10000;

// ── Remove any prior overlay (idempotent re-runs) ──
var existing=document.getElementById(ROOT_ID);
if(existing)existing.remove();

// ── Diagnostics log ──
var diag=[];
function log(msg){
  var t=new Date().toISOString().slice(11,19);
  diag.push('['+t+'] '+msg);
  try{console.log('[LSRGrab v5] '+msg);}catch(e){}
  if(logEl){logEl.textContent=diag.join('\n');logEl.scrollTop=logEl.scrollHeight;}
}

// ── Build overlay ──
var root=document.createElement('div');
root.id=ROOT_ID;
root.style.cssText='all:initial;position:fixed;top:16px;right:16px;z-index:2147483647;width:380px;max-width:calc(100vw - 32px);font-family:Arial,sans-serif;';
var shadowHost=root;
var shadow=null;
try{shadow=root.attachShadow({mode:'open'});}catch(e){}
var ui=document.createElement('div');
ui.innerHTML=''
+'<style>'
+':host,div{box-sizing:border-box;}'
+'.card{background:#1a1d23;color:#e6e1d4;border:1px solid #3a3f48;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,.5);padding:14px 16px;font-family:Arial,sans-serif;font-size:13px;line-height:1.45;}'
+'.hdr{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #3a3f48;padding-bottom:8px;margin-bottom:10px;}'
+'.hdr .name{font-weight:700;font-size:14px;letter-spacing:.02em;}'
+'.hdr .ver{font-size:11px;color:#8a8678;font-family:Consolas,monospace;}'
+'.hdr .x{cursor:pointer;background:transparent;color:#8a8678;border:none;font-size:18px;line-height:1;padding:0 4px;}'
+'.hdr .x:hover{color:#fff;}'
+'.status{padding:8px 10px;background:#0f1116;border-radius:6px;margin-bottom:10px;font-size:12px;color:#cfcab8;}'
+'.status.ok{color:#7ddc97;border-left:3px solid #1f7a3f;}'
+'.status.err{color:#ff8a7a;border-left:3px solid #b8400a;}'
+'.status.wait{color:#9bc6ff;border-left:3px solid #1a73e8;}'
+'.spinner{display:inline-block;width:10px;height:10px;border:2px solid #9bc6ff;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite;margin-right:6px;vertical-align:-1px;}'
+'@keyframes spin{to{transform:rotate(360deg);}}'
+'.row{display:flex;gap:8px;margin-bottom:8px;}'
+'.btn{flex:1;padding:10px 12px;border-radius:6px;border:1px solid #3a3f48;background:#262a32;color:#e6e1d4;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:background .1s;}'
+'.btn:hover{background:#323742;}'
+'.btn.primary{background:#1a73e8;border-color:#1a73e8;color:#fff;}'
+'.btn.primary:hover{background:#2b86f5;}'
+'.btn.good{background:#1f7a3f;border-color:#1f7a3f;color:#fff;}'
+'.btn.good:hover{background:#2a9050;}'
+'.btn:disabled{opacity:.4;cursor:not-allowed;}'
+'.hint{font-size:11px;color:#8a8678;margin-top:4px;}'
+'details{margin-top:8px;border-top:1px solid #3a3f48;padding-top:8px;}'
+'summary{cursor:pointer;font-size:11px;color:#8a8678;user-select:none;list-style:none;}'
+'summary::-webkit-details-marker{display:none;}'
+'summary::before{content:"▸ ";}'
+'details[open] summary::before{content:"▾ ";}'
+'pre.log{margin:8px 0 0;padding:8px;background:#0f1116;border-radius:4px;font-family:Consolas,monospace;font-size:10px;color:#8a8678;max-height:140px;overflow:auto;white-space:pre-wrap;word-break:break-all;}'
+'.copy-log{margin-top:6px;font-size:11px;color:#9bc6ff;background:transparent;border:1px solid #3a3f48;padding:4px 8px;border-radius:4px;cursor:pointer;font-family:inherit;}'
+'.copy-log:hover{background:#262a32;}'
+'</style>'
+'<div class="card">'
+'  <div class="hdr">'
+'    <div><span class="name">LSR Grabber</span> <span class="ver">v5</span></div>'
+'    <button class="x" id="closeBtn" type="button" title="Close">×</button>'
+'  </div>'
+'  <div class="status wait" id="status"><span class="spinner"></span><span id="statusText">Starting…</span></div>'
+'  <div class="row" id="actionRow">'
+'    <button class="btn" id="pickBtn" type="button">📄 Pick PDF from disk…</button>'
+'  </div>'
+'  <div class="hint" id="hint">Tip: if the in-tab read fails, click <b>Pick PDF</b> and select the file from Downloads.</div>'
+'  <input type="file" id="filePicker" accept="application/pdf,.pdf" style="display:none">'
+'  <details>'
+'    <summary>Diagnostics</summary>'
+'    <pre class="log" id="diagLog"></pre>'
+'    <button class="copy-log" id="copyLog" type="button">Copy log</button>'
+'  </details>'
+'</div>';
if(shadow){shadow.appendChild(ui);}else{shadowHost.appendChild(ui);}
document.body.appendChild(root);

var $=function(id){return shadow?shadow.getElementById(id):root.querySelector('#'+id);};
var statusEl=$('status'),statusText=$('statusText'),hintEl=$('hint');
var actionRow=$('actionRow'),pickBtn=$('pickBtn'),filePicker=$('filePicker');
var logEl=$('diagLog');
var closeBtn=$('closeBtn');

closeBtn.addEventListener('click',function(){root.remove();});
$('copyLog').addEventListener('click',function(){
  var text=diag.join('\n')+'\n\n--\nUA: '+navigator.userAgent+'\nURL: '+location.href;
  navCopy(text).then(function(ok){
    $('copyLog').textContent=ok?'Copied ✓':'Select & Ctrl-C';
    if(!ok){
      var range=document.createRange();range.selectNodeContents(logEl);
      var sel=window.getSelection();sel.removeAllRanges();sel.addRange(range);
    }
    setTimeout(function(){$('copyLog').textContent='Copy log';},2200);
  });
});

function setStatus(kind,text,withSpinner){
  statusEl.className='status '+kind;
  statusEl.innerHTML=(withSpinner?'<span class="spinner"></span>':'')+'<span id="statusText"></span>';
  (shadow?shadow.getElementById('statusText'):root.querySelector('#statusText')).textContent=text;
}

function navCopy(t){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    return navigator.clipboard.writeText(t).then(function(){return true;}).catch(function(){return false;});
  }
  return Promise.resolve(false);
}

// ── pdf.js loader with CDN fallback ──
function loadPdfJs(){
  if(typeof window.pdfjsLib!=='undefined'){log('pdf.js already present');return Promise.resolve();}
  log('Loading pdf.js…');
  return tryUrls(PDFJS_URLS,'pdf.js script').then(function(){
    if(typeof window.pdfjsLib==='undefined'){throw new Error('pdf.js script loaded but pdfjsLib not defined');}
    return pickWorkerUrl().then(function(workerUrl){
      window.pdfjsLib.GlobalWorkerOptions.workerSrc=workerUrl;
      log('Worker set: '+workerUrl);
    });
  });
}
function pickWorkerUrl(){
  // Just pick the same CDN family that loaded the main script. We can't easily probe HEAD here.
  return Promise.resolve(WORKER_URLS[0]);
}
function tryUrls(urls,label){
  return new Promise(function(resolve,reject){
    var i=0;
    function next(){
      if(i>=urls.length){reject(new Error('All CDNs failed for '+label));return;}
      var u=urls[i++];
      log('try '+label+': '+u);
      var s=document.createElement('script');
      s.src=u;
      s.onload=function(){log('loaded: '+u);resolve();};
      s.onerror=function(){log('FAILED: '+u);next();};
      document.head.appendChild(s);
    }
    next();
  });
}

// ── PDF acquisition strategies ──
function withTimeout(promise,ms,label){
  return new Promise(function(resolve,reject){
    var done=false;
    var to=setTimeout(function(){if(!done){done=true;reject(new Error(label+' timed out after '+ms+'ms'));}},ms);
    promise.then(function(v){if(!done){done=true;clearTimeout(to);resolve(v);}},
                 function(e){if(!done){done=true;clearTimeout(to);reject(e);}});
  });
}

function acquireFromUrl(){
  log('Strategy A: pdfjsLib.getDocument({url:location.href})');
  log('  href = '+location.href);
  var task=window.pdfjsLib.getDocument({url:location.href});
  return withTimeout(task.promise,FETCH_TIMEOUT_MS,'URL fetch').catch(function(e){
    log('Strategy A failed: '+e.message);
    // Strategy B: look for <embed>/<iframe> tags with PDF src
    var nodes=document.querySelectorAll('embed[type*="pdf"], embed[src*=".pdf"], iframe[src*=".pdf"], object[type*="pdf"]');
    log('Strategy B: scanning '+nodes.length+' embed/iframe/object nodes');
    var srcs=[];
    for(var i=0;i<nodes.length;i++){
      var n=nodes[i];
      var s=n.src||n.getAttribute('src')||n.data||n.getAttribute('data');
      if(s&&srcs.indexOf(s)<0)srcs.push(s);
    }
    if(!srcs.length)throw e;
    log('  found candidate srcs: '+srcs.join(', '));
    // Try each candidate
    var p=Promise.reject(e);
    srcs.forEach(function(src){
      p=p.catch(function(){
        log('  trying embed src: '+src);
        var t=window.pdfjsLib.getDocument({url:src});
        return withTimeout(t.promise,FETCH_TIMEOUT_MS,'embed fetch '+src);
      });
    });
    return p;
  });
}

function acquireFromFile(file){
  log('Strategy C: file picker — '+file.name+' ('+Math.round(file.size/1024)+' KB)');
  return file.arrayBuffer().then(function(buf){
    var task=window.pdfjsLib.getDocument({data:new Uint8Array(buf)});
    return withTimeout(task.promise,FETCH_TIMEOUT_MS*2,'file parse');
  });
}

// ── Parser (column-anchored bucketing — identical logic to v4) ──
function readAllItems(pdf){
  var pages=[];
  function readPage(i){
    if(i>pdf.numPages){return Promise.resolve(pages);}
    return pdf.getPage(i).then(function(pg){
      return pg.getTextContent().then(function(c){
        var items=[];
        for(var j=0;j<c.items.length;j++){
          var it=c.items[j];
          if(!it.str||!it.str.trim())continue;
          items.push({t:it.str,x:it.transform[4],y:it.transform[5],w:it.width||(it.str.length*4)});
        }
        pages.push(items);
        return readPage(i+1);
      });
    });
  }
  return readPage(1);
}

function groupLines(items){
  var sorted=items.slice().sort(function(a,b){return b.y-a.y||a.x-b.x;});
  var lines=[],cur=[],curY=null;
  for(var i=0;i<sorted.length;i++){
    var it=sorted[i];
    if(curY===null){cur=[it];curY=it.y;}
    else if(Math.abs(it.y-curY)<=2.5)cur.push(it);
    else{lines.push({y:curY,items:cur.sort(function(a,b){return a.x-b.x;})});cur=[it];curY=it.y;}
  }
  if(cur.length)lines.push({y:curY,items:cur.sort(function(a,b){return a.x-b.x;})});
  return lines;
}

function flattenPages(pages){
  var out='';
  for(var p=0;p<pages.length;p++){
    var lines=groupLines(pages[p]);
    for(var li=0;li<lines.length;li++){
      var ln=lines[li],s='',lastEnd=0;
      for(var k=0;k<ln.items.length;k++){
        var it=ln.items[k];
        if(k>0&&it.x-lastEnd>1)s+=' ';
        s+=it.t;
        lastEnd=it.x+(it.w||0);
      }
      out+=s+'\n';
    }
    out+='\n';
  }
  return out;
}

var COLS=[
  {n:'item',  min:0,   max:50},
  {n:'mn',    min:50,  max:145},
  {n:'pgln',  min:145, max:175},
  {n:'ws',    min:175, max:250},
  {n:'group', min:250, max:270},
  {n:'gn',    min:270, max:380},
  {n:'pln',   min:380, max:430},
  {n:'cont',  min:430, max:458},
  {n:'cType', min:458, max:495},
  {n:'procCD',min:495, max:530},
  {n:'weight',min:530, max:565},
  {n:'sample',min:565, max:625},
  {n:'rd',    min:625, max:705},
  {n:'note',  min:705, max:9999}
];
function colOf(x){for(var i=0;i<COLS.length;i++)if(x>=COLS[i].min&&x<COLS[i].max)return COLS[i].n;return null;}

function joinCol(tokens,colName){
  if(!tokens.length)return '';
  var out=tokens[0].t;
  for(var i=1;i<tokens.length;i++){
    var prev=tokens[i-1],cur=tokens[i];
    var sameLine=Math.abs(cur.y-prev.y)<=2.5;
    var addSpace;
    if(sameLine){var gap=cur.x-(prev.x+(prev.w||0));addSpace=gap>1;}
    else if(colName==='ws'){addSpace=/^[(\[{]/.test(cur.t);if(out.charAt(out.length-1)==='-')addSpace=false;}
    else if(colName==='gn'||colName==='note'){addSpace=true;}
    else{addSpace=false;}
    out+=(addSpace?' ':'')+cur.t;
  }
  return out;
}

function parseLSR(pages){
  var flat=flattenPages(pages);
  var lr='',ln='';
  var lm=flat.match(/Load\s*No\.?:?\s*(L\d+)/i);
  if(lm){lr=lm[1];ln=lr.replace(/^L0*/,'');if(ln.length>5)ln=ln.slice(-5);}
  var mm={},currentSD='';
  for(var p=0;p<pages.length;p++){
    var items=pages[p];
    var lines=groupLines(items);
    for(var li=0;li<lines.length;li++){
      var line=lines[li];
      if(!line.items.length)continue;
      var joined='';
      for(var z=0;z<line.items.length;z++)joined+=line.items[z].t+' ';
      var sdM=joined.match(/Sales\s*Doc\.?\s*(\d+)/i);
      if(sdM){currentSD=sdM[1];continue;}
      var first=line.items[0];
      if(first.x>=35)continue;
      if(!/^\d+$/.test(first.t.trim()))continue;
      var hasMn=false;
      for(var z2=0;z2<line.items.length;z2++){
        var it2=line.items[z2];
        if(Math.abs(it2.x-58)<8&&/^\d{8,10}JJK$/i.test(it2.t.trim())){hasMn=true;break;}
      }
      if(!hasMn)continue;
      var band=[];
      for(var z3=0;z3<items.length;z3++){
        if(Math.abs(items[z3].y-line.y)<=6)band.push(items[z3]);
      }
      band.sort(function(a,b){return b.y-a.y||a.x-b.x;});
      var cols={};
      for(var z4=0;z4<band.length;z4++){
        var c=colOf(band[z4].x);
        if(!c)continue;
        if(!cols[c])cols[c]=[];
        cols[c].push(band[z4]);
      }
      var v={};
      for(var ck in cols)v[ck]=joinCol(cols[ck],ck);
      var mn=(v.mn||'').trim();
      if(!mn)continue;
      var pglnM=(v.pgln||'').match(/(\d+)\/(\d+)/);
      var pg=pglnM?pglnM[1]:'';
      var lnv=pglnM?pglnM[2]:'';
      var rdM=(v.rd||'').match(/\d{2}\/\d{2}\/\d{4}/);
      var rd=rdM?rdM[0]:'';
      if(!mm[mn])mm[mn]={mn:mn,sd:currentSD,g:'',li:[]};
      var row={
        it:(v.item||'').trim(),mn:mn,pg:pg,li:lnv,
        ws:(v.ws||'').trim(),gn:(v.gn||'').trim(),
        rd:rd,sd:currentSD,
        cont:(v.cont||'').trim(),cType:(v.cType||'').trim(),
        procCD:(v.procCD||'').trim(),weight:(v.weight||'').trim(),
        sample:(v.sample||'').trim(),
        group:(v.group||'').trim(),pln:(v.pln||'').trim(),note:(v.note||'').trim()
      };
      mm[mn].li.push(row);
      if(row.gn&&!mm[mn].g)mm[mn].g=row.gn;
    }
  }
  return{type:'lsr',ln:ln,lr:lr,mm:mm};
}

function parseValidation(txt){
  var lm=txt.match(/Load\s*Number\s*(L\d+)/i);
  if(!lm)lm=txt.match(/Load\s*Number\s*\n\s*(L\d+)/i);
  var lr=lm?lm[1]:'',ln=lr.replace(/^L0*/,'');
  if(ln.length>5)ln=ln.slice(-5);
  var soRe=/Sales\s*Order\s+(\d+)/i;
  var mm={},so=[],curSO='';
  var rowRe=/^\s*(\d+)\s+(\S+)\/(\d+)\/(\d+)\s+(?:S\d+\s+)?(\d+)\s+(\S+)\s+(\S+)\s+(\S+)/;
  var lines=txt.split('\n');
  for(var i=0;i<lines.length;i++){
    var sm=lines[i].match(soRe);
    if(sm){curSO=sm[1];if(so.indexOf(curSO)<0)so.push(curSO);continue;}
    var rm=lines[i].match(rowRe);
    if(!rm)continue;
    var it=rm[1],mn=rm[2],pg=rm[3],lnv=rm[4],desc=rm[6],ws=rm[7];
    if(!mm[mn])mm[mn]={mn:mn,sd:curSO,g:'',li:[]};
    mm[mn].li.push({it:it,mn:mn,pg:pg,li:lnv,ws:ws,gn:'',rd:'',sd:curSO,procCD:desc});
  }
  return{type:'validation',ln:ln,lr:lr,so:so,mm:mm};
}

// ── Main pipeline ──
var fileChosen=false;
pickBtn.addEventListener('click',function(){filePicker.click();});
filePicker.addEventListener('change',function(){
  if(!filePicker.files[0])return;
  fileChosen=true;
  cancelInTab();
  setStatus('wait','Reading '+filePicker.files[0].name+'…',true);
  runPipeline(acquireFromFile(filePicker.files[0]));
});

var inTabCanceller={cancelled:false};
function cancelInTab(){inTabCanceller.cancelled=true;}

function runPipeline(getPdfPromise){
  return getPdfPromise.then(function(pdf){
    log('PDF opened — '+pdf.numPages+' page(s)');
    setStatus('wait','Reading '+pdf.numPages+' page(s)…',true);
    return readAllItems(pdf);
  }).then(function(pages){
    log('Text extracted: '+pages.length+' pages, '+pages.reduce(function(a,b){return a+b.length;},0)+' items');
    setStatus('wait','Parsing…',true);
    var flat=flattenPages(pages);
    var isVal=/Validation\s*Error\s*Report/i.test(flat);
    var data=isVal?parseValidation(flat):parseLSR(pages);
    var cnt=Object.keys(data.mm).length;
    log((isVal?'Validation Report':'LSR')+': '+cnt+' manifest(s) parsed');
    if(!cnt){throw new Error('No manifests found in PDF. (Is the text layer present? Scanned PDFs need OCR.)');}
    return data;
  }).then(deliver).catch(function(e){
    log('FATAL: '+(e&&e.message||e));
    setStatus('err','Could not extract: '+(e&&e.message||e),false);
    // After URL failure, keep the file picker prominent.
    hintEl.innerHTML='<b>Try the file picker above.</b> If you just downloaded the PDF, pick it from your Downloads folder.';
  });
}

function deliver(data){
  var json=JSON.stringify(data);
  var cnt=Object.keys(data.mm).length;
  var rows=0;for(var k in data.mm)rows+=data.mm[k].li.length;
  var lbl=data.type==='validation'?'Validation Report':'LSR';
  var summary=cnt+' manifest(s), '+rows+' line(s)'+(data.ln?' — Load '+data.ln:'')+' ('+lbl+')';
  setStatus('ok','✅ '+summary,false);
  log('Delivering: '+summary+' — JSON '+Math.round(json.length/1024)+' KB');

  // (a) clipboard — best effort, may fail silently on insecure contexts
  navCopy(json).then(function(ok){log('clipboard.writeText: '+(ok?'OK':'FAILED'));});

  // (b) build a real anchor so user click ALWAYS opens — bypasses popup blocker
  var hashUrl=APP_URL+'#bm='+encodeURIComponent(json);
  hintEl.style.display='none';
  actionRow.innerHTML='';
  var openA=document.createElement('a');
  openA.href=hashUrl;
  openA.target='_blank';
  openA.rel='noopener';
  openA.className='btn primary';
  openA.style.cssText='flex:2;text-align:center;text-decoration:none;display:flex;align-items:center;justify-content:center;';
  openA.textContent='→ Open Offspec Generator';
  var copyBtn=document.createElement('button');
  copyBtn.className='btn';
  copyBtn.type='button';
  copyBtn.textContent='Copy JSON';
  copyBtn.addEventListener('click',function(){
    navCopy(json).then(function(ok){
      copyBtn.textContent=ok?'Copied ✓':'Copy failed';
      setTimeout(function(){copyBtn.textContent='Copy JSON';},1800);
    });
  });
  actionRow.appendChild(openA);
  actionRow.appendChild(copyBtn);

  // (c) best-effort auto-open (still useful when popups ARE allowed)
  try{
    var w=window.open(hashUrl,'_blank');
    if(w){log('window.open succeeded (auto-opened tab)');}
    else{log('window.open returned null — popup likely blocked. User must click the button above.');}
  }catch(e){log('window.open threw: '+e.message);}
}

// ── Kick off ──
setStatus('wait','Loading pdf.js…',true);
loadPdfJs().then(function(){
  setStatus('wait','Reading PDF from this tab…',true);
  log('Looks like: '+(/\.pdf(\?|#|$)/i.test(location.href)?'PDF URL':'non-PDF URL — may need file picker'));
  var p=acquireFromUrl();
  // If user picks a file mid-flight, we ignore this promise
  return p.then(function(pdf){
    if(fileChosen){log('in-tab finished after user picked file; ignoring');return;}
    return runPipeline(Promise.resolve(pdf));
  }).catch(function(e){
    if(fileChosen)return;
    log('in-tab read failed: '+e.message);
    setStatus('err','Could not read PDF from this tab. Click "Pick PDF from disk" above.',false);
    hintEl.innerHTML='<b>Common cause:</b> popup blocker, Adobe/Foxit PDF extension hijacking the viewer, or SAP auth on the PDF URL. The file picker works regardless.';
  });
}).catch(function(e){
  log('pdf.js load failed: '+e.message);
  setStatus('err','Could not load pdf.js — check network/firewall: '+e.message,false);
});

})();

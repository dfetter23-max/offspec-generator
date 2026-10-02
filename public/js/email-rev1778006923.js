(function(){
var ED_TPLS=['offspec','manifest','rejection','delay','csr','profile','receipt','custom'];
var ED_DEF_SUBJ={offspec:'Off-Spec Notification{gen}{ref}',manifest:'Manifest Issue{gen}{ref}',rejection:'Load Rejection Notice{gen}{ref}',delay:'Delay Update{gen}{ref}',csr:'CSR Follow-Up{gen}{ref}',profile:'Profile Approval Request{gen}{ref}',receipt:'Receipt Confirmation{gen}{ref}',custom:'{customsubject}'};
var ED_DEF_BODY={
  offspec:'Dear {generator},\n\nThis is to notify you that a shipment received{date} has been identified as non-conforming with the approved waste profile{waste}.\n\nNon-Conformance:\n{nonconformance}\n\nThis load is currently on hold pending further review and resolution. Please contact us at your earliest convenience to discuss next steps.{notes}\n\nWe appreciate your prompt attention to this matter.',
  manifest:'Dear {generator},\n\nWe are writing regarding a discrepancy identified on the following shipment{refs}.\n\nIssue Identified:\n{issue}{action}{due}{notes}\n\nIf you have any questions, please don\'t hesitate to contact us.',
  rejection:'Dear {generator},\n\nPlease be advised that the shipment{refs} has been rejected upon arrival at our facility and cannot be accepted for processing.\n\nReason for Rejection:\n{reason}{instructions}{notes}\n\nWe understand this is an inconvenience and are committed to working with you to resolve this matter. Please contact us to coordinate next steps.',
  delay:'Dear {generator},\n\nWe want to proactively reach out regarding a {type} affecting your shipment{refs}.{original}{newdate}\n\nReason:\n{reason}{notes}\n\nWe sincerely apologize for any inconvenience this may cause and appreciate your patience.',
  csr:'Hi {csrname},\n\nFollowing up on the {generator} account{refs}.\n\nSubject: {subject}\nPriority: {priority}\n\n{details}{due}\n\nThank you,',
  profile:'Hello,\n\nI am submitting a {type} for review and approval.\n\nGenerator / Customer: {generator}{profile}{waste}{so}\n\nReview Notes:\n{notes}{due}\n\nPlease let me know if you need any additional information.',
  receipt:'Dear {generator},\n\nThis email confirms the successful receipt of your waste shipment at our facility.\n\nReceipt Details:{date}{qty}{waste}{notes}\n\nPlease retain this confirmation for your records. Contact us if you have any questions.',
  custom:'{body}'
};
var ED_DEF_PRESETS=["pH out of range (spec: 6\u201312.5, actual outside range)","Wrong physical state (liquid expected, solid received)","Incorrect container type (drums vs. totes)","Labeling non-conformance (missing or incorrect hazard labels)","Undeclared reactive material identified","Halogen content exceeds profile specification","Odor inconsistent with approved waste stream","Color/appearance inconsistent with approved profile","Flashpoint below profile minimum","Free liquid in otherwise solid waste stream"];

var edCurTpl='offspec';
Object.defineProperty(window,'edCurTpl',{get:function(){return edCurTpl;},set:function(v){edCurTpl=v;}});
var edToastTimer=null;

function edInit(){
  edLoadPresets();
  edBuildTplEditors();
  // Static built-in panel buttons (kept for backwards compat but hidden — all templates now from Firestore)
  document.querySelectorAll('#emaildash .ed-tplbtn[data-edtpl]').forEach(function(btn){
    btn.addEventListener('click',function(){
      edCurTpl=btn.dataset.edtpl;
      document.querySelectorAll('#emaildash .ed-tplbtn').forEach(function(b){b.classList.remove('active');});
      document.querySelectorAll('#emaildash .ed-panel').forEach(function(p){p.classList.remove('active');p.style.display='none';});
      btn.classList.add('active');
      var activePanel=document.getElementById('ed-panel-'+edCurTpl);
      if(activePanel){activePanel.style.display='block';activePanel.classList.add('active');}
      document.getElementById('ed_sharedPreview').style.display='';
      document.getElementById('ed_sharedDivider').style.display='';
      edRenderPreview();
    });
  });
  edRenderPreview();
}

function edBuildTplEditors(){
  ED_TPLS.forEach(function(tpl){
    var wrap=document.getElementById('ed_tew-'+tpl);
    if(!wrap)return;
    var saved=edGetTplText(tpl);
    wrap.innerHTML='<button class="ed-tet" onclick="edToggleTew(\''+tpl+'\')">✎\u00a0 Edit default subject &amp; body text</button><div class="ed-teb" id="ed_teb-'+tpl+'"><div class="ed-f"><label>Default Subject Line</label><input type="text" id="ed_ts-'+tpl+'" value="'+edEsc(saved.subject)+'" placeholder="Subject template..." oninput="edSaveTpl(\''+tpl+'\')"></div><div class="ed-f"><label>Default Body Text</label><textarea id="ed_tb-'+tpl+'" rows="9" placeholder="Body template..." oninput="edSaveTpl(\''+tpl+'\')" style="font-family:\'JetBrains Mono\',monospace;font-size:11px;line-height:1.65">'+edEsc(saved.body)+'</textarea></div><div class="ed-tea"><span style="font-size:10px;color:#7a8ba8;font-family:\'JetBrains Mono\',monospace;margin-right:auto">Saves automatically</span><button class="ed-btn ed-btn-g" onclick="edResetTpl(\''+tpl+'\')">&#8635; Reset</button></div></div>';
  });
}
window.edToggleTew=function(tpl){
  var t=document.querySelector('#ed_tew-'+tpl+' .ed-tet'),b=document.getElementById('ed_teb-'+tpl);
  var o=!b.classList.contains('open');
  b.classList.toggle('open',o);t.classList.toggle('open',o);
  t.innerHTML=o?'&#9650;\u00a0 Close editor':'✎\u00a0 Edit default subject &amp; body text';
};
function edGetTplText(tpl){try{var s=localStorage.getItem('tradebe_tpl_'+tpl);if(s)return JSON.parse(s);}catch(e){}return{subject:ED_DEF_SUBJ[tpl]||'',body:ED_DEF_BODY[tpl]||''};}
window.edSaveTpl=function(tpl){var s=document.getElementById('ed_ts-'+tpl),b=document.getElementById('ed_tb-'+tpl);if(!s||!b)return;localStorage.setItem('tradebe_tpl_'+tpl,JSON.stringify({subject:s.value,body:b.value}));edRenderPreview();};
window.edResetTpl=function(tpl){localStorage.removeItem('tradebe_tpl_'+tpl);document.getElementById('ed_ts-'+tpl).value=ED_DEF_SUBJ[tpl]||'';document.getElementById('ed_tb-'+tpl).value=ED_DEF_BODY[tpl]||'';edRenderPreview();edShowToast('↺','Reset to default');};


function edGetPresets(){try{var s=localStorage.getItem('tradebe_presets');return s?JSON.parse(s):ED_DEF_PRESETS.slice();}catch(e){return ED_DEF_PRESETS.slice();}}
function edSavePresets(p){localStorage.setItem('tradebe_presets',JSON.stringify(p));}
function edLoadPresets(){var p=edGetPresets();edRenderPresetList(p);edRenderPresetDrop(p);}
function edRenderPresetList(presets){var list=document.getElementById('ed_presetList');if(!list)return;list.innerHTML=presets.map(function(p,i){return'<div class="ed-pi"><span class="ed-pidx">'+String(i+1).padStart(2,'0')+'</span><input type="text" value="'+edEsc(p)+'" data-idx="'+i+'" onchange="edUpdatePreset(this)" placeholder="Preset text..."><button class="ed-brm" onclick="edRemovePreset('+i+')">✕</button></div>';}).join('');}
function edRenderPresetDrop(presets){var sel=document.getElementById('ed_os_preset');if(!sel)return;sel.innerHTML='<option value="">— Select a preset —</option>'+presets.map(function(p){return'<option value="'+edEsc(p)+'">'+edEsc(p.length>65?p.slice(0,65)+'…':p)+'</option>';}).join('');}
window.edApplyPreset=function(){var sel=document.getElementById('ed_os_preset');if(sel.value){document.getElementById('ed_os_nonconformance').value=sel.value;edRenderPreview();}};
window.edAddPreset=function(){var p=edGetPresets();p.push('New preset description');edSavePresets(p);edRenderPresetList(p);edRenderPresetDrop(p);};
window.edRemovePreset=function(i){var p=edGetPresets();p.splice(i,1);edSavePresets(p);edRenderPresetList(p);edRenderPresetDrop(p);};
window.edUpdatePreset=function(input){var p=edGetPresets();p[parseInt(input.dataset.idx)]=input.value;edSavePresets(p);edRenderPresetDrop(p);};

function edV(id){var el=document.getElementById(id);return el?el.value.trim():'';}
function edRef(l,s,m){var p=[l&&'L#'+l,s&&'SO#'+s,m&&'Manifest #'+m].filter(Boolean);return p.length?' ('+p.join(' / ')+')':('' );}

function edBuildEmail(tpl){
  var saved=edGetTplText(tpl),sTpl=saved.subject,body=saved.body,subject='';
  function bs(t,g,l,s,m){var gp=g?' \u2013 '+g.toUpperCase():'';var rp=[l&&'L#'+l,s&&'SO#'+s,m&&'M#'+m].filter(Boolean);var r=rp.length?' \u2013 '+rp[0]:'';return t.replace('{gen}',gp).replace('{ref}',r).replace('{customsubject}','').replace(/ \u2013 $/,'').trim();}
  switch(tpl){
    case 'offspec':{var l=edV('ed_os_load'),s=edV('ed_os_so'),m=edV('ed_os_manifest'),g=edV('ed_os_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{date}',edV('ed_os_date')?' on '+edV('ed_os_date'):'').replace('{waste}',edV('ed_os_waste')?' for "'+edV('ed_os_waste')+'"':'').replace('{nonconformance}',edV('ed_os_nonconformance')||'[Describe non-conformance]').replace('{notes}',edV('ed_os_notes')?'\n\n'+edV('ed_os_notes'):'');break;}
    case 'manifest':{var l=edV('ed_mf_load'),s=edV('ed_mf_so'),m=edV('ed_mf_manifest'),g=edV('ed_mf_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{refs}',edRef(l,s,m)).replace('{issue}',edV('ed_mf_issue')||'[Describe the issue]').replace('{action}',edV('ed_mf_action')?'\n\nRequired Action: '+edV('ed_mf_action'):'').replace('{due}',edV('ed_mf_due')?'\nDue By: '+edV('ed_mf_due'):'').replace('{notes}',edV('ed_mf_notes')?'\n\n'+edV('ed_mf_notes'):'');break;}
    case 'rejection':{var l=edV('ed_rj_load'),s=edV('ed_rj_so'),m=edV('ed_rj_manifest'),g=edV('ed_rj_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{refs}',edRef(l,s,m)).replace('{reason}',edV('ed_rj_reason_txt')||edV('ed_rj_reason_sel')||'[Rejection reason]').replace('{instructions}',edV('ed_rj_instructions')?'\n\nReturn / Disposal Instructions:\n'+edV('ed_rj_instructions'):'').replace('{notes}',edV('ed_rj_notes')?'\n\n'+edV('ed_rj_notes'):'');break;}
    case 'delay':{var l=edV('ed_dl_load'),s=edV('ed_dl_so'),m=edV('ed_dl_manifest'),g=edV('ed_dl_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{type}',(edV('ed_dl_type')||'delay').toLowerCase()).replace('{refs}',edRef(l,s,m)).replace('{original}',edV('ed_dl_original')?'\nOriginal date: '+edV('ed_dl_original'):'').replace('{newdate}',edV('ed_dl_new')?'\nNew expected date: '+edV('ed_dl_new'):'').replace('{reason}',edV('ed_dl_reason')||'[Delay reason]').replace('{notes}',edV('ed_dl_notes')?'\n\n'+edV('ed_dl_notes'):'');break;}
    case 'csr':{var l=edV('ed_csr_load'),s=edV('ed_csr_so'),m=edV('ed_csr_manifest'),g=edV('ed_csr_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{csrname}',edV('ed_csr_name')||'[CSR Name]').replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{refs}',edRef(l,s,m)).replace('{subject}',edV('ed_csr_subject_txt')||edV('ed_csr_subject_sel')||'[Subject]').replace('{priority}',edV('ed_csr_priority')||'Normal').replace('{details}',edV('ed_csr_details')||'[Details]').replace('{due}',edV('ed_csr_due')?'\nResponse needed by: '+edV('ed_csr_due'):'');break;}
    case 'profile':{var l=edV('ed_pr_load'),s=edV('ed_pr_so'),m=edV('ed_pr_manifest'),g=edV('ed_pr_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{type}',(edV('ed_pr_type')||'profile').toLowerCase()).replace('{profile}',edV('ed_pr_profile')?'\nWaste Profile #: '+edV('ed_pr_profile'):'').replace('{waste}',edV('ed_pr_waste')?'\nWaste Stream: '+edV('ed_pr_waste'):'').replace('{so}',s?'\nSales Order #: '+s:'').replace('{notes}',edV('ed_pr_notes')||'[Review notes]').replace('{due}',edV('ed_pr_due')?'\nApproval requested by: '+edV('ed_pr_due'):'');break;}
    case 'receipt':{var l=edV('ed_rc_load'),s=edV('ed_rc_so'),m=edV('ed_rc_manifest'),g=edV('ed_rc_generator');subject=bs(sTpl,g,l,s,m);body=body.replace('{generator}',g?g.toUpperCase():'[Generator Name]').replace('{date}',edV('ed_rc_date')?'\n  Date Received: '+edV('ed_rc_date'):'').replace('{qty}',edV('ed_rc_qty')?'\n  Quantity / Containers: '+edV('ed_rc_qty'):'').replace('{waste}',edV('ed_rc_waste')?'\n  Waste Description: '+edV('ed_rc_waste'):'').replace('{notes}',edV('ed_rc_notes')?'\n\nNotes:\n'+edV('ed_rc_notes'):'');break;}
    case 'custom':{var l=edV('ed_cu_load'),s=edV('ed_cu_so'),m=edV('ed_cu_manifest'),g=edV('ed_cu_generator');subject=edV('ed_cu_subject')||bs(sTpl,g,l,s,m);body=body.replace('{body}',edV('ed_cu_body')||'[Message body]').replace('{customsubject}',edV('ed_cu_subject'));break;}
  }
  var hr=new Date().getHours();
  var greeting=hr<12?'Good morning,':hr<17?'Good afternoon,':'Good evening,';
  body=body.replace(/\{greeting\}/g,greeting);
  return{subject:subject,body:body.trimEnd()};
}

window.edRenderPreview=function(){var r=edBuildEmail(edCurTpl);document.getElementById('ed_prev_subject').textContent=r.subject||'—';var pb=document.getElementById('ed_previewBody');edRenderBodyWithInserts(pb,r.body||'Fill in the fields above.');};
window.edCopyEmail=function(){var r=edBuildEmail(edCurTpl);navigator.clipboard.writeText(edStripInserts(r.body)).then(function(){edShowToast('⎘','Body copied to clipboard');}).catch(function(){edShowToast('✕','Copy failed');});};
function edStripInserts(s){return s.replace(/\{insert_here:[^}]*\}/g,'').replace(/\n{3,}/g,'\n\n').trim();}
window.edStripInserts=edStripInserts;
// Outlook handoff helpers are defined at the bottom of this file (outside the
// IIFE) so they're accessible from edOWACustomEmail / edOutlookCustomEmail too.
window.edOpenOutlook=function(){var r=edBuildEmail(edCurTpl);window._edOpenMailto(edStripInserts(r.subject),edStripInserts(r.body));edShowToast('✓','Opening Outlook…');};
window.edOpenOWA=function(){var r=edBuildEmail(edCurTpl);window._edOpenOWA(edStripInserts(r.subject),edStripInserts(r.body));edShowToast('✓','Opening Outlook Web…');};

window.edShowToast=function(icon,msg){document.getElementById('ed_toastIcon').textContent=icon;document.getElementById('ed_toastMsg').textContent=msg;var el=document.getElementById('ed_toast');el.classList.add('show');clearTimeout(edToastTimer);edToastTimer=setTimeout(function(){el.classList.remove('show');},2400);};
function edEsc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',edInit);}else{edInit();}
})();

// ── FIREBASE (Email Dashboard) — uses shared firebase-init.js ──
// FIREBASE_DB is provided globally by firebase-init.js
onFirebaseReady(function() {
  edBdrStartListener();
});


// ── ADMIN ──
var edIsAdmin=false;
var ED_ADMIN_PW=ADMIN_PASSWORD; // from admin.js
window.edAdminLogin=function(){
  if(edIsAdmin){edIsAdmin=false;var btn=document.getElementById('ed_adminBtn');btn.textContent='🔒 Admin';btn.classList.remove('ed-adminbtn-on');edShowToast('🔒','Admin mode off');return;}
  document.getElementById('ed_adminPw').value='';
  document.getElementById('ed_adminErr').style.display='none';
  document.getElementById('ed_adminModal').classList.add('open');
  setTimeout(function(){document.getElementById('ed_adminPw').focus();},100);
};
window.edAdminClose=function(){document.getElementById('ed_adminModal').classList.remove('open');};
window.edAdminSubmit=function(){
  var pw=document.getElementById('ed_adminPw').value;
  if(pw===ED_ADMIN_PW){
    edIsAdmin=true;
    var btn=document.getElementById('ed_adminBtn');
    btn.textContent='🔓 Admin';btn.classList.add('ed-adminbtn-on');
    edAdminClose();edShowToast('🔓','Admin mode on');
  } else {
    document.getElementById('ed_adminErr').style.display='';
    document.getElementById('ed_adminPw').select();
  }
};

var ED_TAG_COLORS={amber:{bg:'rgba(232,160,32,.12)',color:'#f0c060',border:'rgba(232,160,32,.25)'},red:{bg:'rgba(224,85,85,.12)',color:'#f08080',border:'rgba(224,85,85,.25)'},blue:{bg:'rgba(85,153,224,.10)',color:'#80b8f0',border:'rgba(85,153,224,.25)'},green:{bg:'rgba(48,200,120,.10)',color:'#60e090',border:'rgba(48,200,120,.25)'},purple:{bg:'rgba(144,112,208,.10)',color:'#c0a0f0',border:'rgba(144,112,208,.25)'},gray:{bg:'rgba(122,139,168,.10)',color:'#a0b0c8',border:'rgba(122,139,168,.25)'}};
var ED_STD_TOKENS=[{t:'{greeting}',d:'Greeting (Good morning/afternoon/evening)'},{t:'{generator}',d:'Generator'},{t:'{l_num}',d:'Load #'},{t:'{so_num}',d:'SO #'},{t:'{manifest}',d:'Manifest #'},{t:'{manifest_line}',d:'Manifest Line #'},{t:'{waste_stream}',d:'Profile# (Waste Stream)'},{t:'{manifest_dot}',d:'Manifest DOT Description'},{t:'{sap_dot}',d:'SAP DOT Description'}];
var edBdrCurrentId=null,edBdrFocus='body',edBdrTpls={},edBdrTokenColors={};


window.edOpenBuilder=function(){
  document.getElementById('ed_mainContent').style.display='none';
  document.getElementById('ed_sharedPreview').style.display='none';
  document.getElementById('ed_sharedDivider').style.display='none';
  document.getElementById('ed_bdrPanel').classList.add('active');
  document.querySelectorAll('#emaildash .ed-tplbtn').forEach(function(b){b.classList.remove('active');});
  document.getElementById('ed_bdrBtn').classList.add('active');
  edBdrRenderChips([]);
};
window.edCloseBuilder=function(){
  document.getElementById('ed_bdrPanel').classList.remove('active');
  document.getElementById('ed_mainContent').style.display='';
  document.getElementById('ed_sharedPreview').style.display='';
  document.getElementById('ed_sharedDivider').style.display='';
  document.getElementById('ed_bdrBtn').classList.remove('active');
  var first=document.querySelector('#emaildash .ed-tplbtn[data-edtpl]');if(first)first.click();
};

function edBdrRenderChips(customFields){
  var wrap=document.getElementById('ed_bdrChips');if(!wrap)return;
  function chipWithColor(tok, label, cls) {
    var key = tok.replace(/[{}]/g, '');
    var curColor = edBdrTokenColors[key] || '';
    return '<span class="ed-chip-wrap"><span class="' + cls + '" title="' + label + '" onclick="edBdrInsert(\'' + tok + '\')">' + tok + '</span><span class="ed-chip-color" data-tokenkey="' + key + '" style="background:' + (curColor || '#555') + ';' + (curColor ? '' : 'opacity:0.3;') + '" onclick="edColorPick(this)" title="Color for ' + tok + '"></span></span>';
  }
  var html = ED_STD_TOKENS.map(function(t) {
    return chipWithColor(t.t, t.d, 'ed-chip');
  }).join('');
  customFields.forEach(function(f) {
    if (!f.token) return;
    var tok = '{' + f.token + '}';
    html += chipWithColor(tok, f.label, 'ed-chip ed-chip-custom');
  });
  html += '<span class="ed-chip ed-chip-insert" title="Insert a paste reminder — edit the label after the colon" onclick="edBdrInsertHere()">{insert_here}</span>';
  wrap.innerHTML = html;
}

// ── Custom Color Picker with Favorites ──
var ED_COLOR_PRESETS = [
  '#ffffff','#cccccc','#888888','#444444','#000000',
  '#ff5b5b','#ff6b35','#f0c060','#5bff8a','#5b8aff',
  '#b06ce0','#ff5b8a','#40d4f4','#e05555','#30c878',
  '#ff0000','#ff8800','#ffff00','#00cc00','#0066ff',
  '#8800cc','#cc0066','#006666','#663300','#336600'
];

function edGetFavColors(){try{return JSON.parse(localStorage.getItem('ed_fav_colors')||'[]');}catch(e){return[];}}
function edSaveFavColor(c){
  var favs=edGetFavColors().filter(function(f){return f!==c;});
  favs.unshift(c);
  if(favs.length>8)favs=favs.slice(0,8);
  try{localStorage.setItem('ed_fav_colors',JSON.stringify(favs));}catch(e){}
}

window.edColorPick=function(swatch){
  // Remove existing picker
  var old=document.getElementById('edColorPicker');if(old)old.remove();
  var key=swatch.dataset.tokenkey;
  var curColor=edBdrTokenColors[key]||'';

  var picker=document.createElement('div');
  picker.id='edColorPicker';
  picker.className='ed-cpicker';

  var html='<div class="ed-cp-label">Preset Colors</div><div class="ed-cp-grid">';
  ED_COLOR_PRESETS.forEach(function(c){
    html+='<span class="ed-cp-swatch'+(c===curColor?' ed-cp-active':'')+'" style="background:'+c+'" data-c="'+c+'" onclick="edColorSelect(\''+key+'\',\''+c+'\')"></span>';
  });
  html+='</div>';

  var favs=edGetFavColors();
  html+='<div class="ed-cp-label" style="margin-top:8px;">Favorites'+(favs.length?'':' <span style="color:#555;font-weight:400">(pick colors to save here)</span>')+'</div><div class="ed-cp-grid ed-cp-favs">';
  if(favs.length){
    favs.forEach(function(c){
      html+='<span class="ed-cp-swatch'+(c===curColor?' ed-cp-active':'')+'" style="background:'+c+'" data-c="'+c+'" onclick="edColorSelect(\''+key+'\',\''+c+'\')"></span>';
    });
  } else {
    html+='<span style="font-size:10px;color:#555;padding:4px;">None yet</span>';
  }
  html+='</div>';

  html+='<div class="ed-cp-custom"><input type="color" id="edCpCustom" value="'+(curColor||'#ffffff')+'"><button onclick="edColorSelectCustom(\''+key+'\')">Use</button>';
  if(curColor) html+='<button onclick="edColorClear(\''+key+'\')" style="color:#ff5b5b;border-color:#ff5b5b;">Clear</button>';
  html+='</div>';

  picker.innerHTML=html;

  // Position near the swatch
  var rect=swatch.getBoundingClientRect();
  picker.style.top=(rect.bottom+4)+'px';
  picker.style.left=Math.max(4,Math.min(rect.left,window.innerWidth-220))+'px';
  document.body.appendChild(picker);

  // Close on outside click
  setTimeout(function(){
    document.addEventListener('click',function edCpClose(e){
      if(!picker.contains(e.target)&&e.target!==swatch){
        picker.remove();
        document.removeEventListener('click',edCpClose);
      }
    });
  },10);
};

window.edColorSelect=function(key,color){
  edBdrTokenColors[key]=color;
  edSaveFavColor(color);
  var picker=document.getElementById('edColorPicker');if(picker)picker.remove();
  edBdrRenderChips(edBdrGetFields());
  edBdrPreview();
};

window.edColorSelectCustom=function(key){
  var c=document.getElementById('edCpCustom').value;
  edColorSelect(key,c);
};

window.edColorClear=function(key){
  delete edBdrTokenColors[key];
  var picker=document.getElementById('edColorPicker');if(picker)picker.remove();
  edBdrRenderChips(edBdrGetFields());
  edBdrPreview();
};
window.edRteCmd=function(cmd){
  document.execCommand(cmd,false,null);
  document.getElementById('ed_bdrBody').focus();
  edBdrPreview();
};
window.edRteColor=function(color){
  document.execCommand('foreColor',false,color);
  document.getElementById('ed_bdrBody').focus();
  edBdrPreview();
};
window.edBdrInsert=function(token){
  if(edBdrFocus==='subject'){
    var el=document.getElementById('ed_bdrSubject');if(!el)return;
    var s=el.selectionStart,e=el.selectionEnd;el.value=el.value.slice(0,s)+token+el.value.slice(e);el.selectionStart=el.selectionEnd=s+token.length;el.focus();
  } else {
    var el=document.getElementById('ed_bdrBody');if(!el)return;
    el.focus();
    document.execCommand('insertText',false,token);
  }
  edBdrPreview();
};
window.edBdrInsertHere=function(){
  if(edBdrFocus==='subject'){
    var el=document.getElementById('ed_bdrSubject');if(!el)return;
    var token='{insert_here: PASTE CONTENT HERE}';
    var s=el.selectionStart,e=el.selectionEnd;
    el.value=el.value.slice(0,s)+token+el.value.slice(e);
    var labelStart=s+token.indexOf(': ')+2;
    var labelEnd=s+token.length-1;
    el.focus();el.setSelectionRange(labelStart,labelEnd);
  } else {
    var el=document.getElementById('ed_bdrBody');if(!el)return;
    el.focus();
    document.execCommand('insertText',false,'{insert_here: PASTE CONTENT HERE}');
  }
  edBdrPreview();
};
window.edBdrAddField=function(){
  var wrap=document.getElementById('ed_bdrFields'),idx=wrap.querySelectorAll('.ed-cfield-row').length;
  var row=document.createElement('div');row.className='ed-cfield-row';row.dataset.idx=idx;
  row.innerHTML='<button onclick="edBdrMoveField(this,-1)" class="ed-cfield-arrow" title="Move up">\u25B2</button><button onclick="edBdrMoveField(this,1)" class="ed-cfield-arrow" title="Move down">\u25BC</button><input type="text" placeholder="Field label" data-role="label" oninput="edBdrFieldChanged('+idx+')">'+'<input type="text" placeholder="Prefix (e.g. TRL-)" data-role="prefix" style="width:90px;font-size:12px;color:#f0c060;" oninput="edBdrSyncChips();edBdrPreview()">'+'<span class="ed-cfield-tok" id="ed_bdrTok'+idx+'">{field_'+idx+'}</span>'+'<button onclick="this.closest(\'.ed-cfield-row\').remove();edBdrSyncChips();" style="background:transparent;border:none;color:#7a8ba8;cursor:pointer;font-size:13px;padding:0;width:22px;">\u2715</button>';
  wrap.appendChild(row);edBdrSyncChips();
};
window.edBdrFieldChanged=function(idx){
  var row=document.querySelector('.ed-cfield-row[data-idx="'+idx+'"]');if(!row)return;
  var label=row.querySelector('[data-role=label]').value;
  var token=label.trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'')||'field_'+idx;
  var tok=document.getElementById('ed_bdrTok'+idx);if(tok)tok.textContent='{'+token+'}';
  edBdrSyncChips();edBdrPreview();
};
window.edBdrMoveField=function(btn,dir){
  var row=btn.closest('.ed-cfield-row');
  var wrap=document.getElementById('ed_bdrFields');
  var rows=Array.from(wrap.querySelectorAll('.ed-cfield-row'));
  var i=rows.indexOf(row);
  if(i<0)return;
  if(dir===-1&&i>0){wrap.insertBefore(row,rows[i-1]);}
  else if(dir===1&&i<rows.length-1){wrap.insertBefore(rows[i+1],row);}
  edBdrSyncChips();edBdrPreview();
};
function edBdrGetFields(){
  return Array.from(document.querySelectorAll('#ed_bdrFields .ed-cfield-row')).map(function(row,i){
    var prefixEl=row.querySelector('[data-role=prefix]');
    return{label:row.querySelector('[data-role=label]').value.trim()||'Field '+(i+1),token:(document.getElementById('ed_bdrTok'+row.dataset.idx)||{textContent:'field_'+i}).textContent.replace(/[{}]/g,''),prefix:prefixEl?prefixEl.value.trim():''};
  });
}
function edBdrSyncChips(){edBdrRenderChips(edBdrGetFields());}

function edRenderBodyWithInserts(el, text){
  // Split on {insert_here: ...} tokens
  var parts=text.split(/(\{insert_here:[^}]*\})/g);
  el.innerHTML='';
  parts.forEach(function(part){
    var m=part.match(/^\{insert_here:\s*(.*)\}$/);
    if(m){
      var label=m[1].trim()||'PASTE CONTENT HERE';
      var block=document.createElement('div');
      block.style.cssText='margin:6px 0;padding:7px 12px;border:2px dashed #40d4f4;border-radius:5px;background:rgba(64,212,244,.06);display:flex;align-items:center;gap:8px;font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#40d4f4;';
      block.innerHTML='<span style="font-size:14px;">📋</span><span>'+label+'</span>';
      el.appendChild(block);
    } else {
      var node=document.createElement('span');
      node.style.whiteSpace='pre-wrap';
      node.textContent=part;
      el.appendChild(node);
    }
  });
}
window.edRenderBodyWithInserts=edRenderBodyWithInserts;
function edBdrPreview(){
  var subj=document.getElementById('ed_bdrSubject').value||'';
  var bodyEl=document.getElementById('ed_bdrBody');
  var body=bodyEl?bodyEl.innerHTML||'':'';
  // Convert to plain text for token preview, preserving HTML formatting
  var hr=new Date().getHours();
  var ex={greeting:hr<12?'Good morning,':hr<17?'Good afternoon,':'Good evening,',generator:'ACME INDUSTRIES',l_num:'L#12345',so_num:'SO#98765',manifest:'M#00123',manifest_line:'Line 10',waste_stream:'1000057139',manifest_dot:'UN1230, METHANOL',sap_dot:'UN1993, FLAMMABLE LIQUID, N.O.S.'};
  edBdrGetFields().forEach(function(f){ex[f.token]=(f.prefix||'')+'['+f.label+']';});
  function fillPlain(s){return s.replace(/\{(\w+)\}/g,function(_,k){return ex[k]!==undefined?ex[k]:'{'+k+'}';});}
  function fillHtml(s){return s.replace(/\{(\w+)\}/g,function(_,k){
    var val=ex[k]!==undefined?ex[k]:'{'+k+'}';
    var c=edBdrTokenColors[k];
    return c?'<span style="color:'+c+'">'+val+'</span>':val;
  });}
  document.getElementById('ed_bdrPrevSubj').textContent=fillPlain(subj)||'\u2014';
  var prevBody=document.getElementById('ed_bdrPrevBody');
  var filled=fillHtml(body)||'Fill in above.';
  prevBody.innerHTML=filled;
}
window.edBdrNew=function(){
  if(!edIsAdmin){window.edShowToast('🔒','Admin access required');return;}
  edBdrCurrentId=null;document.getElementById('ed_bdrFormTitle').textContent='New Template';document.getElementById('ed_bdrDelBtn').style.display='none';
  ['ed_bdrName','ed_bdrTag','ed_bdrSubject','ed_bdrSection','ed_bdrIcon'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('ed_bdrBody').innerHTML='';
  document.getElementById('ed_bdrTagColor').value='amber';document.getElementById('ed_bdrOrder').value='';document.getElementById('ed_bdrFields').innerHTML='';
  edBdrTokenColors={};
  edBdrRenderChips([]);edBdrPreview();
  document.getElementById('ed_bdrPlaceholder').style.display='flex';document.getElementById('ed_bdrForm').style.display='none';
  document.querySelectorAll('.ed-bdr-item').forEach(function(i){i.classList.remove('active');});
  document.getElementById('ed_bdrPlaceholder').style.display='none';document.getElementById('ed_bdrForm').style.display='flex';
  document.getElementById('ed_bdrName').focus();
};
window.edBdrSelect=function(id){
  var d=edBdrTpls[id];if(!d)return;edBdrCurrentId=id;
  document.getElementById('ed_bdrFormTitle').textContent='Edit Template';document.getElementById('ed_bdrDelBtn').style.display='';
  document.getElementById('ed_bdrName').value=d.name||'';document.getElementById('ed_bdrTag').value=(d.tag||'').toUpperCase();
  document.getElementById('ed_bdrTagColor').value=d.tagColor||'amber';document.getElementById('ed_bdrSubject').value=d.subject||'';
  var bodyEl=document.getElementById('ed_bdrBody');
  var bodyContent=d.body||'';
  // Backward compat: plain text bodies get newlines converted to <br>
  if(bodyContent.indexOf('<')===-1){bodyContent=bodyContent.replace(/\n/g,'<br>');}
  bodyEl.innerHTML=bodyContent;
  document.getElementById('ed_bdrSection').value=d.section||'';document.getElementById('ed_bdrIcon').value=d.icon||'';document.getElementById('ed_bdrOrder').value=d.order!==undefined?d.order:'';
  var wrap=document.getElementById('ed_bdrFields');wrap.innerHTML='';
  (d.customFields||[]).forEach(function(f,i){
    var row=document.createElement('div');row.className='ed-cfield-row';row.dataset.idx=i;
    var lbl=(f.label||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    var pfx=(f.prefix||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    row.innerHTML='<button onclick="edBdrMoveField(this,-1)" class="ed-cfield-arrow" title="Move up">\u25B2</button><button onclick="edBdrMoveField(this,1)" class="ed-cfield-arrow" title="Move down">\u25BC</button><input type="text" placeholder="Field label" value="'+lbl+'" data-role="label" oninput="edBdrFieldChanged('+i+')">'+'<input type="text" placeholder="Prefix" value="'+pfx+'" data-role="prefix" style="width:90px;font-size:12px;color:#f0c060;" oninput="edBdrSyncChips();edBdrPreview()">'+'<span class="ed-cfield-tok" id="ed_bdrTok'+i+'">{'+(f.token||'field_'+i)+'}</span>'+'<button onclick="this.closest(\'.ed-cfield-row\').remove();edBdrSyncChips();" style="background:transparent;border:none;color:#7a8ba8;cursor:pointer;font-size:13px;padding:0;width:22px;">\u2715</button>';
    wrap.appendChild(row);
  });
  edBdrTokenColors=Object.assign({},d.tokenColors||{});
  edBdrRenderChips(d.customFields||[]);edBdrPreview();
  document.getElementById('ed_bdrPlaceholder').style.display='none';document.getElementById('ed_bdrForm').style.display='flex';
  document.querySelectorAll('.ed-bdr-item').forEach(function(i){i.classList.toggle('active',i.dataset.id===id);});
};
window.edBdrSave=function(){
  if(!edIsAdmin){window.edShowToast('🔒','Admin access required');return;}
  if(!FIREBASE_DB){window.edShowToast('\u2715','Firebase not ready');return;}
  var name=document.getElementById('ed_bdrName').value.trim();if(!name){window.edShowToast('\u2715','Name required');return;}
  var orderVal=parseInt(document.getElementById('ed_bdrOrder').value)||99;var data={name:name,tag:document.getElementById('ed_bdrTag').value.trim().toUpperCase(),tagColor:document.getElementById('ed_bdrTagColor').value,icon:document.getElementById('ed_bdrIcon').value.trim()||'📧',section:document.getElementById('ed_bdrSection').value.trim(),order:orderVal,subject:document.getElementById('ed_bdrSubject').value.trim(),body:document.getElementById('ed_bdrBody').innerHTML.trim(),customFields:edBdrGetFields(),tokenColors:Object.assign({},edBdrTokenColors),updatedAt:Date.now(),createdAt:edBdrCurrentId?(edBdrTpls[edBdrCurrentId]&&edBdrTpls[edBdrCurrentId].createdAt||Date.now()):Date.now()};
  var btn=document.getElementById('ed_bdrSaveBtn');btn.textContent='Saving\u2026';btn.disabled=true;
  var op;
  if(edBdrCurrentId){
    op=FIREBASE_DB.collection('tradebe_custom_templates').doc(edBdrCurrentId).set(data);
  } else {
    op=FIREBASE_DB.collection('tradebe_custom_templates').add(data).then(function(ref){
      edBdrCurrentId=ref.id;
      document.getElementById('ed_bdrFormTitle').textContent='Edit Template';
      document.getElementById('ed_bdrDelBtn').style.display='';
    });
  }
  op.then(function(){window.edShowToast('\u2713','Saved');btn.textContent='\u2191 Save';btn.disabled=false;}).catch(function(e){window.edShowToast('\u2715','Save failed: '+e.message);btn.textContent='\u2191 Save';btn.disabled=false;});
};
window.edBdrDelete=function(){
  if(!edBdrCurrentId||!FIREBASE_DB)return;
  if(!edIsAdmin){window.edShowToast('🔒','Admin access required to delete');return;}
  if(!confirm('Delete "'+(edBdrTpls[edBdrCurrentId]&&edBdrTpls[edBdrCurrentId].name||'this template')+'"?'))return;
  FIREBASE_DB.collection('tradebe_custom_templates').doc(edBdrCurrentId).delete()
    .then(function(){edBdrCurrentId=null;document.getElementById('ed_bdrForm').style.display='none';document.getElementById('ed_bdrPlaceholder').style.display='flex';window.edShowToast('\u2713','Deleted');})
    .catch(function(e){window.edShowToast('\u2715','Delete failed: '+e.message);});
};
function edBdrStartListener(){
  if(!FIREBASE_DB)return;
  FIREBASE_DB.collection('tradebe_custom_templates').onSnapshot(function(snap){
    edBdrTpls={};
    var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
    // Sort docs client-side by order then createdAt
    var docs=[];snap.forEach(function(doc){docs.push(doc);});
    docs.sort(function(a,b){var ao=a.data().order||99,bo=b.data().order||99;if(ao!==bo)return ao-bo;return(a.data().createdAt||0)-(b.data().createdAt||0);});
    // Group by section
    var sections={};var sectionOrder=[];var listHtml='';
    docs.forEach(function(doc){
      var d=doc.data();edBdrTpls[doc.id]=Object.assign({},d);edBdrTpls[doc.id]._id=doc.id;
      var sec=d.section||'';
      if(!sections[sec]){sections[sec]=[];sectionOrder.push(sec);}
      sections[sec].push({id:doc.id,d:d});
      var col=ED_TAG_COLORS[d.tagColor||'amber'];
      var pill=d.tag?'<span style="font-family:monospace;font-size:9px;padding:1px 5px;border-radius:2px;background:'+col.bg+';color:'+col.color+';border:1px solid '+col.border+';">'+esc(d.tag)+'</span>':'';
      listHtml+='<div class="ed-bdr-item'+(edBdrCurrentId===doc.id?' active':'')+'" data-id="'+doc.id+'" onclick="edBdrSelect(\''+doc.id+'\')"><div class="ed-bdr-item-name">'+esc(d.name||'Untitled')+'</div>'+(d.section?'<div style="font-size:9px;color:#3d4f6e;margin-top:1px;">'+esc(d.section)+'</div>':'')+(pill?'<div style="margin-top:3px;">'+pill+'</div>':'')+'</div>';
    });
    // Build sidebar
    var sidebarHtml='';
    // Recent section
    var recentIds=edGetRecent();
    var recentItems=recentIds.filter(function(rid){return !!edBdrTpls[rid];});
    if(recentItems.length>0){
      sidebarHtml+='<div class="ed-sid-section"><div class="ed-sid-section-hdr">\u23F1 Recent</div>';
      recentItems.forEach(function(rid){
        var rd=edBdrTpls[rid];if(!rd)return;
        var rcol=ED_TAG_COLORS[rd.tagColor||'amber'];
        var ricon=rd.icon||'\uD83D\uDCE7';
        sidebarHtml+='<button class="ed-tplbtn" onclick="edLoadCustomTpl(\''+rid+'\',this)"><span class="ed-tico">'+ricon+'</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;">'+esc(rd.name||'Untitled')+'</span>'+(rd.tag?'<span class="ed-tdot" style="background:'+rcol.color+';"></span>':'')+'</button>';
      });
      sidebarHtml+='</div>';
    }
    sectionOrder.forEach(function(sec){
      if(sec) sidebarHtml+='<div class="ed-sid-section"><div class="ed-sid-section-hdr">'+esc(sec)+'</div>';
      else sidebarHtml+='<div class="ed-sid-section">';
      sections[sec].forEach(function(item){
        var col=ED_TAG_COLORS[item.d.tagColor||'amber'];
        var icon=item.d.icon||'📧';
        sidebarHtml+='<button class="ed-tplbtn" onclick="edLoadCustomTpl(\''+item.id+'\',this)"><span class="ed-tico">'+icon+'</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;text-align:left;">'+esc(item.d.name||'Untitled')+'</span>'+(item.d.tag?'<span class="ed-tdot" style="background:'+col.color+';"></span>':'')+'</button>';
      });
      sidebarHtml+='</div>';
    });
    var sidebarEl=document.getElementById('ed_sidebarList');
    if(sidebarEl)sidebarEl.innerHTML=docs.length>0?sidebarHtml:'<div style="padding:18px 12px;font-family:\'JetBrains Mono\',monospace;font-size:11px;color:#3d4f6e;">No templates yet.<br>Open Template Builder to create one.</div>';
    var inner=document.getElementById('ed_bdrListInner');
    if(inner)inner.innerHTML=docs.length>0?listHtml:'<div style="padding:18px 12px;font-family:monospace;font-size:11px;color:#3d4f6e;line-height:1.9;">No templates yet.<br>Click <strong style="color:#7a8ba8;">+ New</strong>.</div>';
    // Restore active
    if(edCurTpl&&edCurTpl.indexOf('cust-')===0){
      var activeId=edCurTpl.replace('cust-','');
      var activeBtn=document.querySelector('#ed_sidebarList .ed-tplbtn[onclick*="\''+activeId+'\'" ]');
      if(activeBtn){document.querySelectorAll('#emaildash .ed-tplbtn').forEach(function(b){b.classList.remove('active');});activeBtn.classList.add('active');}
    }
    // Auto-click first template if nothing active
    if(!document.querySelector('#emaildash .ed-tplbtn.active')){
      var first=document.querySelector('#ed_sidebarList .ed-tplbtn');
      if(first)first.click();
    }
  },function(err){console.error('Firestore:',err);});
}
window.edLoadCustomTpl=function(id,btn){
  var d=edBdrTpls[id];
  if(!d){
    setTimeout(function(){window.edLoadCustomTpl(id,btn);},300);
    return;
  }
  document.getElementById('ed_bdrPanel').classList.remove('active');document.getElementById('ed_mainContent').style.display='';
  document.getElementById('ed_sharedPreview').style.display='none';
  document.getElementById('ed_sharedDivider').style.display='none';
  document.querySelectorAll('#emaildash .ed-tplbtn').forEach(function(b){b.classList.remove('active');});
  if(btn)btn.classList.add('active');document.getElementById('ed_bdrBtn').classList.remove('active');
  var old=document.getElementById('ed-panel-cust-'+id);if(old)old.remove();
  var col=ED_TAG_COLORS[d.tagColor||'amber'];
  var esc=function(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
  var tagH=d.tag?'<span class="ed-tag" style="background:'+col.bg+';color:'+col.color+';border:1px solid '+col.border+';">'+esc(d.tag)+'</span>':'';
  var cfHtml=(d.customFields||[]).map(function(f,i){return'<div class="ed-f"><label>'+esc(f.label)+'</label><input type="text" id="edcust_'+id+'_cf'+i+'" placeholder="'+esc(f.label)+'..." oninput="edRenderCustomPreview(\''+id+'\')"></div>';}).join('');
  // Only show key fields actually used in this template
  var tplText=(d.subject||'')+(d.body||'');
  function uses(tok){return tplText.indexOf('{'+tok+'}')!==-1;}
  var kfHtml='';
  if(uses('l_num'))     kfHtml+='<div class="ed-kfw"><div class="ed-kl">Load Number</div><input class="ed-ki" id="edcust_'+id+'_l" placeholder="e.g. 80724" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  if(uses('so_num'))    kfHtml+='<div class="ed-kfw"><div class="ed-kl">Sales Order</div><input class="ed-ki" id="edcust_'+id+'_s" placeholder="e.g. 4657989" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  if(uses('manifest'))  kfHtml+='<div class="ed-kfw"><div class="ed-kl">Manifest #</div><input class="ed-ki" id="edcust_'+id+'_m" placeholder="e.g. 123456" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  if(uses('manifest_line')) kfHtml+='<div class="ed-kfw"><div class="ed-kl">Manifest Line</div><input class="ed-ki" id="edcust_'+id+'_ml" placeholder="e.g. 10" maxlength="3" style="width:60px;" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  if(uses('generator')) kfHtml+='<div class="ed-kfw"><div class="ed-kl">Generator Name</div><input class="ed-ki" id="edcust_'+id+'_g" placeholder="GENERATOR NAME" oninput="edRenderCustomPreview(\''+id+'\')" style="text-transform:uppercase;"></div>';
  if(uses('waste_stream')) kfHtml+='<div class="ed-kfw"><div class="ed-kl">Profile# (Waste Stream)</div><input class="ed-ki" id="edcust_'+id+'_w" placeholder="e.g. 1000057139" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  if(uses('manifest_dot')) kfHtml+='<div class="ed-kfw"><div class="ed-kl">Manifest DOT</div><input class="ed-ki" id="edcust_'+id+'_md" data-dot-field="manifest_dot" placeholder="Use DOT Lookup tool to fill" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  if(uses('sap_dot')) kfHtml+='<div class="ed-kfw"><div class="ed-kl">SAP DOT</div><input class="ed-ki" id="edcust_'+id+'_sd" data-dot-field="sap_dot" placeholder="Use DOT Lookup tool to fill" oninput="edRenderCustomPreview(\''+id+'\')" ></div>';
  var panel=document.createElement('div');panel.className='ed-panel';panel.id='ed-panel-cust-'+id;
  panel.innerHTML='<div class="ed-sh"><div><div class="ed-stitle">'+esc(d.name||'Custom Template')+'</div><div class="ed-sdesc">Custom template</div></div>'+tagH+'</div>'
    +(kfHtml?'<div class="ed-kf">'+kfHtml+'</div>':'')
    +(cfHtml?'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px;">'+cfHtml+'</div>':'')
    +'<div style="text-align:right;margin-bottom:4px;"><button onclick="edClearFields(\''+id+'\')" style="background:transparent;border:1px solid #2a3348;border-radius:4px;color:#7a8ba8;font-family:\'JetBrains Mono\',monospace;font-size:11px;padding:4px 12px;cursor:pointer;">✕ Clear All Fields</button></div>'
    +'<div style="height:1px;background:#2a3348;margin:14px 0;"></div>'
    +'<div class="ed-div" style="margin-top:16px;"></div>'+'<div class="ed-pcard">'+'<div class="ed-ptoolbar">'+'<span class="ed-plabel">📧 Preview</span>'+'<div class="ed-pactions">'+'<button class="ed-btn ed-btn-s" onclick="edCopyCustomEmail(\''+id+'\')">⎘ Copy Body</button>'+'<div class="ed-outlook-btns">'+'<button class="ed-outlook-btn" onclick="edOutlookCustomEmail(\''+id+'\')"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm8 13H4v-.57c0-.81.48-1.53 1.22-1.85C6.55 16.21 8.44 16 12 16s5.45.21 6.78.58c.74.32 1.22 1.04 1.22 1.85V19z"/></svg> Outlook APP</button>'+'<button class="ed-outlook-btn" onclick="edOWACustomEmail(\''+id+'\')"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style="flex-shrink:0"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg> Outlook WEB</button>'+'</div></div></div>'+'<div class="ed-pmeta"><div class="ed-mrow"><span class="ed-mkey">Subject:</span><input type="text" class="ed-mval-edit" id="edcust_'+id+'_ps" value="" style="flex:1;background:transparent;border:1px solid #2a3348;border-radius:4px;padding:4px 8px;color:#ccc;font-size:14px;font-family:inherit;outline:none;"></div></div>'+'<div class="ed-pbody" id="edcust_'+id+'_pb" contenteditable="true" style="width:100%;min-height:200px;background:transparent;border:1px solid #2a3348;border-radius:6px;padding:10px 12px;color:#ccc;font-size:14px;font-family:inherit;line-height:1.6;white-space:pre-wrap;outline:none;cursor:text;">Fill in the fields above.</div>'+'</div>';
  document.querySelectorAll('#emaildash .ed-panel').forEach(function(p){
    p.classList.remove('active');
    p.style.display='none';
  });
  document.getElementById('ed_mainContent').appendChild(panel);
  panel.style.display='block';
  panel.classList.add('active');
  edCurTpl='cust-'+id;edRenderCustomPreview(id);
  // Track recently used
  edTrackRecent(id);
  // Restore draft if exists
  var hadDraft=edDraftRestore(id);
  if(hadDraft){edRenderCustomPreview(id);window.edShowToast('\u270F\uFE0F Draft restored','ok');}
  // Autosave on any input in this panel
  panel.addEventListener('input',function(){edDraftSave(id);});
};
window.edRenderCustomPreview=function(id){
  var d=edBdrTpls[id];if(!d)return;
  function gv(sfx){var el=document.getElementById('edcust_'+id+sfx);return el?el.value.trim():'';}
  var hr=new Date().getHours();
  var _l=gv('_l'),_s=gv('_s'),_m=gv('_m'),_ml=gv('_ml');
  var vals={greeting:hr<12?'Good morning,':hr<17?'Good afternoon,':'Good evening,',generator:(gv('_g')||'').toUpperCase(),l_num:_l?'L#'+_l:'',so_num:_s?'SO#'+_s:'',manifest:_m?'M#'+_m:'',manifest_line:_ml?'Line '+_ml:'',waste_stream:gv('_w'),manifest_dot:gv('_md'),sap_dot:gv('_sd')};
  (d.customFields||[]).forEach(function(f,i){var v=gv('_cf'+i);vals[f.token]=v?(f.prefix||'')+v:'['+f.label+']';});
  var tc=d.tokenColors||{};
  function fillPlain(s){return(s||'').replace(/\{(\w+)\}/g,function(_,k){return vals[k]!==undefined?vals[k]:'{'+k+'}';});}
  function fillHtml(s){return(s||'').replace(/\{(\w+)\}/g,function(_,k){
    var val=vals[k]!==undefined?vals[k]:'{'+k+'}';
    var c=tc[k];
    return c?'<span style="color:'+c+'">'+val+'</span>':val;
  });}
  var body=fillHtml(d.body).trimEnd();
  var ps=document.getElementById('edcust_'+id+'_ps');if(ps)ps.value=fillPlain(d.subject)||'';
  var pb=document.getElementById('edcust_'+id+'_pb');if(pb)pb.innerHTML=body;
};
function edBuildCustomEmail(id){
  var d=edBdrTpls[id];if(!d)return{subject:'',body:'',html:''};
  var psEl=document.getElementById('edcust_'+id+'_ps');
  var pbEl=document.getElementById('edcust_'+id+'_pb');
  var subject=psEl?psEl.value.trim():'';
  var htmlBody=pbEl?pbEl.innerHTML:'';
  // Strip insert_here placeholders from the HTML view
  htmlBody=htmlBody.replace(/\{insert_here:[^}]*\}/g,'');
  // Use the browser's own innerText for plain text. This correctly preserves
  // line breaks introduced by Enter in a contenteditable (which Chrome/Edge
  // wrap in <div>...</div>, Firefox in <br>) without us having to fight an
  // HTML-stripping regex. Also resilient to pasted Word/Outlook HTML.
  var plainBody='';
  if(pbEl){
    plainBody=(pbEl.innerText||pbEl.textContent||'')
      .replace(/\{insert_here:[^}]*\}/g,'')
      .replace(/\r\n?/g,'\n')
      .trim()
      .replace(/\n{3,}/g,'\n\n');
  }
  return{subject:subject,body:plainBody,html:htmlBody};
}
window.edCopyCustomEmail=function(id){
  var d=edBdrTpls[id];if(!d)return;
  // Use the actual current contenteditable content so manual edits get copied
  // (the previous version rebuilt from the template and silently dropped any
  // text the user had typed into the preview).
  var r=edBuildCustomEmail(id);
  var rawHtml=(r.html||'').trim();
  var plainText=r.body||'';
  if(!rawHtml && !plainText){window.edShowToast('\u2715','Nothing to copy');return;}
  var cleanHtml='<div style="font-family:Calibri,Arial,sans-serif;font-size:11pt;color:#000000;">'+rawHtml+'</div>';
  try{
    var blob=new Blob([cleanHtml],{type:'text/html'});
    var plainBlob=new Blob([plainText],{type:'text/plain'});
    navigator.clipboard.write([new ClipboardItem({'text/html':blob,'text/plain':plainBlob})]).then(function(){
      window.edShowToast('\u2398','Copied');edDraftClear(id);edLogEmail(id,'copy',r);
    }).catch(function(err){
      console.warn('Clipboard.write failed, falling back to plain text:',err);
      navigator.clipboard.writeText(plainText).then(function(){window.edShowToast('\u2398','Copied (plain text)');edDraftClear(id);edLogEmail(id,'copy',r);}).catch(function(err2){console.error('Plain text copy failed:',err2);window.edShowToast('\u2715','Copy failed');});
    });
  }catch(e){
    console.warn('Clipboard API unavailable, using writeText:',e);
    navigator.clipboard.writeText(plainText).then(function(){window.edShowToast('\u2398','Copied');edDraftClear(id);edLogEmail(id,'copy',r);}).catch(function(){window.edShowToast('\u2715','Copy failed');});
  }
};
window.edOWACustomEmail=function(id){var r=edBuildCustomEmail(id);window._edOpenOWA(r.subject,r.body);window.edShowToast('\u2713','Opening Outlook Web\u2026');edDraftClear(id);edLogEmail(id,'owa',r);};
window.edOutlookCustomEmail=function(id){var r=edBuildCustomEmail(id);window._edOpenMailto(r.subject,r.body);window.edShowToast('\u2713','Opening Outlook\u2026');edDraftClear(id);edLogEmail(id,'outlook',r);};

// \u2500\u2500 Outlook handoff helpers (top-level, accessible from inside & outside the IIFE) \u2500\u2500
// Outlook desktop and OWA both want CRLF line breaks in URI bodies; bare \n
// encodes to %0A which both handlers can silently reject, leaving Outlook open
// on the inbox with no compose window.
// helper: normalize body line endings to CRLF so Outlook accepts the URI body
window._edCRLF = function(s){ return (s||'').replace(/\r\n/g,'\n').replace(/\n/g,'\r\n'); };
window._edOpenMailto = function(subj, body) {
  var qs = [];
  if (subj) qs.push('subject=' + encodeURIComponent(subj));
  if (body) qs.push('body=' + encodeURIComponent(window._edCRLF(body)));
  var url = 'mailto:?' + qs.join('&');
  console.log('[email] mailto url length:', url.length);
  // window.location.href reliably hands off mailto: to the OS protocol handler
  // (Outlook desktop) \u2014 what was working before the regression.
  try { window.location.href = url; }
  catch (e) { console.error('[email] mailto open failed:', e); }
};
window._edOpenOWA = function(subj, body) {
  var qs = [];
  if (subj) qs.push('subject=' + encodeURIComponent(subj));
  if (body) qs.push('body=' + encodeURIComponent(window._edCRLF(body)));
  var url = 'https://outlook.office.com/mail/deeplink/compose?' + qs.join('&');
  console.log('[email] OWA url length:', url.length);
  var w = window.open(url, '_blank');
  if (!w) { console.warn('[email] window.open blocked \u2014 pop-ups may be disabled'); }
};

// ── Clear All Fields ──
window.edClearFields=function(id){
  var panel=document.getElementById('ed-panel-cust-'+id);
  if(!panel)return;
  panel.querySelectorAll('input,textarea').forEach(function(el){
    if(el.type==='checkbox'||el.type==='radio'||el.type==='hidden'||el.type==='button')return;
    el.value='';
  });
  edDraftClear(id);
  edRenderCustomPreview(id);
  showToast('Fields cleared','ok');
};

// ── Email Usage Logging for The Lens ──
function edLogEmail(id,action,result){
  if(!FIREBASE_DB)return;
  try{
    var d=edBdrTpls[id]||{};
    var subKey=(result.subject||'').replace(/[\/\.#$\[\]\s]+/g,'-').substring(0,80);
    var docKey=[(d.name||id),subKey,action].join('_').replace(/[\/\.#$\[\]]/g,'-');
    FIREBASE_DB.collection('email_submissions').doc(docKey).set({
      timestamp:new Date().toISOString(),
      templateId:id,
      templateType:d.name||'Unknown',
      action:action,
      subject:result.subject||'',
      body:result.body||''
    });
  }catch(e){console.warn('Email log failed:',e);}
}

// ── Recently Used Tracking ──
function edGetRecent(){try{return JSON.parse(localStorage.getItem('ed_recent')||'[]');}catch(e){return[];}}
function edTrackRecent(id){
  var recent=edGetRecent().filter(function(r){return r!==id;});
  recent.unshift(id);
  if(recent.length>3)recent=recent.slice(0,3);
  try{localStorage.setItem('ed_recent',JSON.stringify(recent));}catch(e){}
}

// ── Draft Autosave ──
function edDraftKey(id){return 'ed_draft_'+id;}
function edDraftSave(id){
  var panel=document.getElementById('ed-panel-cust-'+id);
  if(!panel)return;
  var draft={};
  panel.querySelectorAll('input[id],textarea[id]').forEach(function(el){
    if(el.id&&el.value)draft[el.id]=el.value;
  });
  if(Object.keys(draft).length>0){
    try{localStorage.setItem(edDraftKey(id),JSON.stringify(draft));}catch(e){}
  }
}
function edDraftRestore(id){
  try{
    var raw=localStorage.getItem(edDraftKey(id));
    if(!raw)return false;
    var draft=JSON.parse(raw);
    var restored=false;
    Object.keys(draft).forEach(function(elId){
      var el=document.getElementById(elId);
      if(el&&draft[elId]){el.value=draft[elId];restored=true;}
    });
    return restored;
  }catch(e){return false;}
}
function edDraftClear(id){
  try{localStorage.removeItem(edDraftKey(id));}catch(e){}
}

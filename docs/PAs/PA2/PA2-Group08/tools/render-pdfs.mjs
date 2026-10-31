import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const dependencyRoot=process.env.PA2_RENDER_DEPS||here;
const req=createRequire(path.join(dependencyRoot,'package.json'));
const MarkdownIt=req('markdown-it');
const pwReq=process.env.PA2_PLAYWRIGHT_DEPS?createRequire(path.join(process.env.PA2_PLAYWRIGHT_DEPS,'package.json')):req;
const {chromium}=pwReq('playwright');
const settings=JSON.parse(await fs.readFile(path.join(here,'export-settings.json'),'utf8'));
const css=await fs.readFile(path.join(here,'print.css'),'utf8');
const mermaidRoot=path.dirname(req.resolve('mermaid/package.json'));
const tmp=process.env.PA2_RENDER_TMP||'/tmp/dinevina-pa2-export';
await fs.mkdir(tmp,{recursive:true});
await fs.mkdir(path.join(root,'evidence/diagrams'),{recursive:true});
const server=http.createServer(async(request,response)=>{
 try {
  const url=new URL(request.url,'http://localhost');
  let base,rel;
  if(url.pathname.startsWith('/mermaid/')){base=mermaidRoot;rel=url.pathname.slice(9);}
  else if(url.pathname.startsWith('/package/')){base=root;rel=url.pathname.slice(9);}
  else {base=tmp;rel=url.pathname.slice(1);}
  const file=path.resolve(base,decodeURIComponent(rel));
  if(!file.startsWith(base+path.sep))throw Error('Invalid path');
  const types={'.js':'application/javascript','.mjs':'application/javascript','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
  const bytes=await fs.readFile(file);response.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});response.end(bytes);
 }catch{response.writeHead(404);response.end('Not found');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const port=server.address().port;
const browser=await chromium.launch({executablePath:process.env.PA2_CHROME||'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const md=new MarkdownIt({html:true,linkify:true});
let docname='';let diagramCount=0;
const originalFence=md.renderer.rules.fence;
md.renderer.rules.fence=(tokens,idx,opts,env,self)=>{
 if(tokens[idx].info.trim()==='mermaid'){
  diagramCount++;
  return `<figure class="diagram"><pre class="mermaid" data-number="${diagramCount}">${md.utils.escapeHtml(tokens[idx].content)}</pre><figcaption>Workflow ${diagramCount}. DineVina product design.</figcaption></figure>`;
 }
 return originalFence(tokens,idx,opts,env,self);
};
// Rebuild the combined Markdown from the same editable chapter sources before exporting.
const reportPath=path.join(root,'PA2-Report.md');
const originalReport=await fs.readFile(reportPath,'utf8');
const chapterMarker='<div class="chapter-break"></div>';
const front=originalReport.split(chapterMarker)[0].trimEnd().replace(/^- README\n/m,'');
const chapters=['Project-Plan.md','Vision.md','Spec-Kit-Training.md','AI-Usage-Report.md','Weekly-Report.md','meeting-minutes/PA1-History.md','meeting-minutes/Sprint-Planning-Record.md','meeting-minutes/Scrum-Meetings.md','meeting-minutes/Sprint-Review-Minutes.md','evidence/Trello-Task-Index.md','Source-Register.md','Submission-Checklist.md'];
const chapterTexts=[];
function rootRelativeLinks(source,chapter){
 return source.replace(/(\]\()([^)]+)(\))/g,(match,open,href,close)=>{
  if(href.startsWith('#')||/^[a-z][a-z\d+.-]*:/i.test(href)||href.startsWith('//'))return match;
  const boundary=href.search(/[?#]/);
  const pathname=boundary<0?href:href.slice(0,boundary);
  const suffix=boundary<0?'':href.slice(boundary);
  const resolved=path.posix.normalize(path.posix.join(path.posix.dirname(chapter),decodeURIComponent(pathname)));
  if(resolved.startsWith('../')||path.posix.isAbsolute(resolved)||!fsSync.existsSync(path.join(root,resolved)))throw Error(`Unresolved local link in ${chapter}: ${href}`);
  return `${open}${encodeURI(resolved)}${suffix}${close}`;
 });
}
for(const chapter of chapters){
 let value=await fs.readFile(path.join(root,chapter),'utf8');
 if(chapter.startsWith('meeting-minutes/'))value=value.replaceAll('`Sprint-Review-Minutes.md`','`meeting-minutes/Sprint-Review-Minutes.md`');
 chapterTexts.push(rootRelativeLinks(value,chapter));
}
await fs.writeFile(reportPath,front+'\n\n'+chapterMarker+'\n\n'+chapterTexts.join('\n'+chapterMarker+'\n\n'));
const manifest=[];
try{
 for(docname of settings.outputs){
  diagramCount=0;
  const text=await fs.readFile(path.join(root,docname+'.md'),'utf8');
  let body=md.render(text).replace(/<p>(\s*<strong>Performed by:[\s\S]*?)<\/p>/g,'<p class="attribution">$1</p>');
  const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>DineVina - ${docname} - PA2 Group 08</title><base href="http://127.0.0.1:${port}/package/"><style>${css}</style></head><body data-document="${docname}"><div class="kicker">UNIVERSITY OF SCIENCE · GROUP 08 · PA2</div>${body}<script type="module">import mermaid from '/mermaid/dist/mermaid.esm.min.mjs';mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'base',themeVariables:{fontFamily:'DejaVu Sans',fontSize:'14px',primaryColor:'#edf5f4',primaryBorderColor:'#236b70',lineColor:'#476773'},flowchart:{htmlLabels:false,nodeSpacing:20,rankSpacing:20,padding:7,useMaxWidth:true}});try{await mermaid.run({querySelector:'.mermaid'});window.renderReady=true;}catch(e){window.renderFailure=String(e);}</script></body></html>`;
  await fs.writeFile(path.join(tmp,docname+'.html'),html);
  const page=await browser.newPage({viewport:{width:1000,height:1200}});
  page.on('pageerror',err=>console.error('PAGE ERROR',docname,String(err)));
  await page.goto(`http://127.0.0.1:${port}/${docname}.html`);
  await page.waitForFunction(()=>window.renderReady||window.renderFailure,{timeout:60000});
  const failure=await page.evaluate(()=>window.renderFailure);
  if(failure)throw Error(docname+': '+failure);
  await page.evaluate(()=>document.fonts.ready);
  await page.evaluate(()=>{for(const table of document.querySelectorAll('table')){const first=table.querySelector('th')?.textContent.trim();if(first==='ID'||first==='Card')table.classList.add('compact');if(first==='ID')table.classList.add('identifier-table');}});
  await page.waitForFunction(()=>Array.from(document.images).every(i=>i.complete));
  const broken=await page.evaluate(()=>Array.from(document.images).filter(i=>!i.naturalWidth).map(i=>i.src));
  if(broken.length)throw Error('Broken images: '+broken.join(', '));
  const svgs=await page.locator('figure.diagram svg').evaluateAll(nodes=>nodes.map(n=>n.outerHTML));
  for(let i=0;i<svgs.length;i++)await fs.writeFile(path.join(root,'evidence/diagrams',`${docname}-${i+1}.svg`),svgs[i]);
  await page.pdf({path:path.join(root,docname+'.pdf'),format:'A4',margin:{top:'19mm',bottom:'19mm',left:'17mm',right:'17mm'},printBackground:true,displayHeaderFooter:true,headerTemplate:'<span></span>',footerTemplate:`<div style="font-family:Arial;font-size:8px;width:100%;padding:0 17mm;color:#667785;display:flex;justify-content:space-between"><span>DineVina · Group 08 · ${md.utils.escapeHtml(docname)}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`});
  manifest.push({document:docname,diagrams:svgs.length,brokenImages:broken.length});
  console.log('Rendered',docname,'diagrams',svgs.length);
  await page.close();
 }
 await fs.writeFile(path.join(root,'evidence/pdf-export-log.json'),JSON.stringify({settings,documents:manifest},null,2)+'\n');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}

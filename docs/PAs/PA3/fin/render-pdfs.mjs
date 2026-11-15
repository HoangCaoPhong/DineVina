import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import { createRequire } from 'node:module';
const root = path.resolve('docs/PAs/PA3/fin/PA3-Group08');
const dep = path.resolve('docs/PAs/PA2/PA2-Group08/tools');
const req = createRequire(path.join(dep, 'package.json'));
const MarkdownIt = req('markdown-it');
const { chromium } = req('playwright');
const mermaidRoot = path.dirname(req.resolve('mermaid/package.json'));
const md = new MarkdownIt({ html: true, linkify: true });
const defaultFence = md.renderer.rules.fence;
md.renderer.rules.fence = (tokens, idx, opts, env, self) => tokens[idx].info.trim() === 'mermaid'
  ? `<pre class="mermaid">${md.utils.escapeHtml(tokens[idx].content)}</pre>`
  : defaultFence(tokens, idx, opts, env, self);
const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const isMermaid = url.pathname.startsWith('/mermaid/');
    const base = isMermaid ? mermaidRoot : root;
    const rel = decodeURIComponent(url.pathname.slice(isMermaid ? 9 : 1));
    const file = path.resolve(base, rel);
    if (!file.startsWith(base + path.sep)) throw Error('bad path');
    const body = await fs.readFile(file);
    const ext = path.extname(file);
    response.writeHead(200, { 'Content-Type': ({'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'}[ext] || 'application/octet-stream') });
    response.end(body);
  } catch { response.writeHead(404); response.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const browser = await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const files = ['source/README','README','Project-Plan','Vision','Changes','UseCase-Model','UC-Customer','UC-Partner-Admin','UC-AI','F3-Data-Dictionary','F3-Backend-and-Database-Report','PostgreSQL-Local-Verification','F3-Video-Narration-Script','Weekly-Report','AI-Usage-Report','AI-logs/Phong','AI-logs/Ngoc','AI-logs/Nhan','AI-logs/Kien','Submission-Checklist','meeting-minutes/PA3-Reconstructed-Meetings'];
const css = `@page{size:A4;margin:17mm}body{font:11pt/1.45 'DejaVu Sans',sans-serif;color:#182b34}h1{font-size:21pt}h2{font-size:15pt;break-after:avoid}h3{font-size:12pt;break-after:avoid}table{border-collapse:collapse;width:100%;font-size:8.5pt;break-inside:auto}td,th{border:1px solid #a9bac1;padding:5px;vertical-align:top;overflow-wrap:anywhere}tr{break-inside:avoid}th{background:#eef3f4}img{max-width:100%;max-height:210mm;object-fit:contain;break-inside:avoid}pre{white-space:pre-wrap;overflow-wrap:anywhere;font-size:8pt;background:#f4f6f7;padding:8px}pre.mermaid{background:white}a{color:#185f75}p,li{orphans:2;widows:2}blockquote{border-left:3px solid #8ba8b0;padding-left:10px}`;
try {
 for (const name of files) {
  const source = path.join(root, name + '.md');
  const output = path.join(root, name + '.pdf');
  const body = md.render(await fs.readFile(source,'utf8'));
  const base = `http://127.0.0.1:${port}/${name.includes('/') ? name.split('/')[0]+'/' : ''}`;
  const html = `<!doctype html><html><head><meta charset="utf-8"><base href="${base}"><style>${css}</style></head><body>${body}<script type="module">import mermaid from '/mermaid/dist/mermaid.esm.min.mjs';mermaid.initialize({startOnLoad:false,securityLevel:'strict',theme:'default',flowchart:{htmlLabels:false}});try{await mermaid.run({querySelector:'.mermaid'});window.ready=true}catch(e){window.failure=String(e)}</script></body></html>`;
  const page = await browser.newPage();
  await fs.writeFile(path.join(root,'.render-temp.html'),html);
  await page.goto(`http://127.0.0.1:${port}/.render-temp.html`,{waitUntil:'load'});
  await page.waitForFunction(() => window.ready || window.failure,{timeout:60000});
  const failure = await page.evaluate(() => window.failure);
  if (failure) throw Error(name+': '+failure);
  await page.evaluate(() => document.fonts.ready);
  const broken = await page.evaluate(() => [...document.images].filter(i=>!i.naturalWidth).map(i=>i.src));
  if (broken.length) throw Error(name+': broken images '+broken.join(','));
  await page.pdf({path:output,format:'A4',printBackground:true,margin:{top:'17mm',right:'17mm',bottom:'17mm',left:'17mm'}});
  console.log('Rendered',name);
  await page.close();
 }
} finally {await fs.rm(path.join(root,'.render-temp.html'),{force:true});await browser.close();await new Promise(resolve=>server.close(resolve));}

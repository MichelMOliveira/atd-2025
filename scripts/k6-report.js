const fs = require('fs');

function safeGet(obj, path, def = '-'){
  try{
    return path.split('.').reduce((a,b)=> a && a[b], obj) || def;
  }catch(e){return def}
}

const inFile = process.argv[2] || 'report.json';
const outFile = process.argv[3] || 'report.html';

if(!fs.existsSync(inFile)){
  console.error('Arquivo de entrada não encontrado:', inFile);
  process.exit(1);
}

const raw = fs.readFileSync(inFile, 'utf-8');
const data = JSON.parse(raw);

// Attempt to extract some metrics
const metrics = data.metrics || {};
const checks = metrics.checks || {};
const http_req_duration = metrics.http_req_duration || {};

const checksTotal = safeGet(checks, 'count', 0);
const checksPass = safeGet(checks, 'passes', 0);
const checksFail = checksTotal - checksPass;
const p95 = safeGet(http_req_duration, 'values.p(95)', safeGet(http_req_duration, 'p(95)', '-'));

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Relatório K6</title></head><body>
<h1>Relatório K6 - Execução</h1>
<ul>
  <li><strong>Checks total:</strong> ${checksTotal}</li>
  <li><strong>Checks aprovados:</strong> ${checksPass}</li>
  <li><strong>Checks falhados:</strong> ${checksFail}</li>
  <li><strong>http_req_duration p(95):</strong> ${p95} ms</li>
</ul>
<h2>Raw JSON</h2>
<pre style="max-height:400px;overflow:auto">${JSON.stringify(data, null, 2)}</pre>
</body></html>`;

fs.writeFileSync(outFile, html, 'utf-8');
console.log('Relatório gerado em', outFile);

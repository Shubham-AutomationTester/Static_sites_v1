
'use strict';
(() => {
  const PREFIX = 'ss5864-simple-v1:';
  const toast = document.getElementById('toast');
  let toastTimer;
  function announce(text) {
    if (!toast) return;
    toast.textContent = text; toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 3500);
  }
  function absolute(path) { return new URL(path, window.location.href).href; }
  async function copyText(text) {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard not available');
      await navigator.clipboard.writeText(text);
      announce('Copied');
    } catch (_) {
      window.prompt('Copy this text:', text);
    }
  }
  document.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-open')) window.location.assign(absolute(button.dataset.open));
    if (button.hasAttribute('data-copy-url')) await copyText(absolute(button.dataset.copyUrl));
    if (button.hasAttribute('data-copy-text')) await copyText(button.dataset.copyText);
    if (button.hasAttribute('data-reveal')) {
      const target = document.getElementById(button.dataset.reveal);
      if (target) { target.open = true; target.scrollIntoView({behavior:'smooth', block:'start'}); }
    }
  });
  document.querySelectorAll('[data-current-url]').forEach(el => { el.textContent = window.location.href; });
  const search = document.getElementById('case-search');
  let activeFilter = 'start';
  function filterCases() {
    const term = (search ? search.value : '').trim().toLowerCase();
    let total = 0;
    document.querySelectorAll('[data-case-card]').forEach(card => {
      const groupMatch = activeFilter === 'all' || (activeFilter === 'start' ? card.dataset.starter === 'yes' : card.dataset.group === activeFilter);
      const match = groupMatch && card.dataset.search.includes(term);
      card.hidden = !match; if (match) total++;
    });
    const count = document.getElementById('case-count');
    if (count) count.textContent = total + (total === 1 ? ' test shown' : ' tests shown');
    const empty = document.getElementById('empty-cases');
    if (empty) empty.hidden = total !== 0;
  }
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    filterCases();
  }));
  if (search) {
    search.addEventListener('input', () => {
      if (search.value.trim() && activeFilter === 'start') {
        activeFilter = 'all';
        document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.filter === 'all')));
      }
      filterCases();
    });
    filterCases();
  }
  function getRecord(id) {
    try { return JSON.parse(localStorage.getItem(PREFIX + id) || '{}'); } catch (_) { return {}; }
  }
  document.querySelectorAll('[data-record-id]').forEach(node => {
    const record = getRecord(node.dataset.recordId);
    node.textContent = 'Recorded result: ' + (record.status || 'Not run');
  });
  const resultForm = document.getElementById('result-form');
  if (resultForm) {
    const id = resultForm.dataset.caseId;
    const status = document.getElementById('actual-status');
    const notes = document.getElementById('actual-notes');
    const saved = getRecord(id);
    if (['Not run','Pass','Fail','Blocked'].includes(saved.status)) status.value = saved.status;
    notes.value = saved.notes || '';
    resultForm.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        localStorage.setItem(PREFIX + id, JSON.stringify({status:status.value, notes:notes.value, savedAt:new Date().toISOString()}));
        announce('Result saved in this browser only');
      } catch (_) { announce('Browser storage unavailable. Copy your notes before leaving.'); }
    });
  }
  // These checks make real same-origin GET requests only after the user clicks.
  // They inspect hosting headers, not SearchStax queue or indexing behavior.
  async function checkHeader(path, expected, output) {
    output.textContent = 'Checking the HTTP response...'; output.className = 'check-output';
    if (!['https:','http:'].includes(location.protocol)) {
      output.textContent = 'Deploy on Render first. A local file preview has no HTTP response headers.';
      output.classList.add('fail'); return false;
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(absolute(path), {method:'GET',cache:'no-store',redirect:'follow',signal:controller.signal});
      const actual = response.headers.get('X-Robots-Tag');
      const contentType = response.headers.get('Content-Type') || '';
      const html = await response.text();
      const pathMatch = new URL(response.url).pathname.replace(/\/$/, '') === path.replace(/\/$/, '');
      const fixtureMatch = html.includes('name="qa-fixture-path" content="' + path + '"');
      const valueMatch = expected === '' ? actual === null : (actual || '').trim() === expected;
      const ok = response.status === 200 && contentType.includes('text/html') && fixtureMatch && valueMatch;
      const valueLine = 'X-Robots-Tag: ' + (actual === null ? '(not present)' : actual);
      output.textContent = (ok ? 'READY' : 'NOT READY') + '\nHTTP ' + response.status + '\n' + valueLine + '\nExpected: ' + (expected || '(not present)') + '\nFinal URL: ' + response.url;
      if (!fixtureMatch) output.textContent += '\nWrong page returned. Check the publish directory and remove any catch-all rewrite.';
      if (!pathMatch) output.textContent += '\nThe URL redirected. Make sure your Render header rule matches the final path.';
      output.classList.add(ok ? 'ok' : 'fail');
      return ok;
    } catch (error) {
      output.textContent = 'NOT READY: ' + (error.name === 'AbortError' ? 'Request timed out.' : error.message);
      output.classList.add('fail'); return false;
    } finally { clearTimeout(timer); }
  }
  document.querySelectorAll('[data-check-path]').forEach(button => button.addEventListener('click', async () => {
    button.disabled = true;
    await checkHeader(button.dataset.checkPath, button.dataset.expected || '', document.getElementById(button.dataset.output));
    button.disabled = false;
  }));
  const checkAll = document.getElementById('check-all-headers');
  if (checkAll) checkAll.addEventListener('click', async () => {
    checkAll.disabled = true; let ready = 0;
    const rows = [...document.querySelectorAll('[data-header-path]')];
    for (const row of rows) {
      if (await checkHeader(row.dataset.headerPath, row.dataset.expected, row.querySelector('.check-output'))) ready++;
    }
    const controls = document.getElementById('header-controls');
    controls.hidden = false;
    const baselineOk = await checkHeader('/baseline.html', '', document.getElementById('baseline-check'));
    const childOk = await checkHeader('/targets/hdr001-child.html', '', document.getElementById('child-check'));
    const summary = document.getElementById('headers-summary');
    summary.textContent = ready + '/5 header pages ready. Control pages: ' + (baselineOk && childOk ? 'clean.' : 'check unexpected global headers or wrong content.');
    checkAll.disabled = false;
  });
})();

if (location.hash === '#http-setup') { const box = document.getElementById('http-setup'); if (box) box.open = true; }

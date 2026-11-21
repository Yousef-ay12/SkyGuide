window.addEventListener('error', function (e) {
  var c = document.getElementById('card'); if (!c || (c.textContent && !document.getElementById('nojs'))) return;
  var d = document.createElement('p'); d.style.cssText = 'color:#b33a3a;font-family:monospace;font-size:13px';
  d.textContent = 'Error: ' + (e.message || 'unknown') + (e.lineno ? ' (line ' + e.lineno + ')' : '') + '. Try a recent version of Chrome, Safari, Edge or Firefox.';
  c.appendChild(d);
});

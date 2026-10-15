(function () {
  var viewCount = document.getElementById('viewCount');
  if (!viewCount) return;

  var NS = 'olong-blog';
  var API = 'https://abacus.jasoncameron.dev';

  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  var base = hash(location.pathname + location.search);
  var vKey = 'v-' + base;

  function hit(key) {
    return fetch(API + '/hit/' + NS + '/' + key)
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }
  function get(key) {
    return fetch(API + '/get/' + NS + '/' + key)
      .then(function (r) { return r.ok ? r.json() : { value: 0 }; })
      .then(function (d) { return d && typeof d.value === 'number' ? d.value : 0; })
      .catch(function () { return null; });
  }

  var counted = false;
  try { counted = sessionStorage.getItem('v-' + base) === '1'; } catch (e) {}
  if (!counted) {
    hit(vKey).then(function (d) {
      if (d && typeof d.value === 'number') viewCount.textContent = d.value;
      else get(vKey).then(function (v) { if (v !== null) viewCount.textContent = v; });
    });
    try { sessionStorage.setItem('v-' + base, '1'); } catch (e) {}
  } else {
    get(vKey).then(function (v) { if (v !== null) viewCount.textContent = v; });
  }
})();

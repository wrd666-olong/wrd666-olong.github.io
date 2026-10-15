(function () {
  var viewCount = document.getElementById('viewCount');
  var likeCount = document.getElementById('likeCount');
  var likeBtn = document.getElementById('likeBtn');
  if (!viewCount && !likeCount && !likeBtn) return;

  var NS = 'olong-blog';
  var API = 'https://abacus.jasoncameron.dev';

  function hash(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  var base = hash(location.pathname + location.search);

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

  if (viewCount) {
    var vKey = 'v-' + base;
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
  }

  if (likeCount || likeBtn) {
    var hKey = 'lh-' + base;
    var uKey = 'lu-' + base;
    function total() {
      return Promise.all([get(hKey), get(uKey)]).then(function (a) {
        return Math.max(0, (a[0] || 0) - (a[1] || 0));
      });
    }
    function show() { if (likeCount) total().then(function (n) { likeCount.textContent = n; }); }

    var liked = false;
    try { liked = localStorage.getItem('lk2-' + base) === '1'; } catch (e) {}
    function sync() { if (likeBtn) likeBtn.classList.toggle('active', liked); }
    sync();
    show();

    if (likeBtn) {
      likeBtn.addEventListener('click', function () {
        if (liked) {
          hit(uKey).then(function () {
            liked = false;
            try { localStorage.setItem('lk2-' + base, '0'); } catch (e) {}
            sync();
            show();
          });
        } else {
          hit(hKey).then(function () {
            liked = true;
            try { localStorage.setItem('lk2-' + base, '1'); } catch (e) {}
            sync();
            show();
          });
        }
      });
    }
  }
})();

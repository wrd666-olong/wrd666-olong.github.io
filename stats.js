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
  var viewKey = 'v-' + base;
  var likeKey = 'l-' + base;

  function hit(key, dir) {
    return fetch(API + '/' + (dir || 'hit') + '/' + NS + '/' + key)
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
    var counted = false;
    try { counted = sessionStorage.getItem('v-' + base) === '1'; } catch (e) {}
    if (!counted) {
      hit(viewKey).then(function (d) {
        if (d && typeof d.value === 'number') viewCount.textContent = d.value;
        else get(viewKey).then(function (v) { if (v !== null) viewCount.textContent = v; });
      });
      try { sessionStorage.setItem('v-' + base, '1'); } catch (e) {}
    } else {
      get(viewKey).then(function (v) { if (v !== null) viewCount.textContent = v; });
    }
  }

  if (likeCount || likeBtn) {
    var liked = false;
    try { liked = localStorage.getItem('l-' + base) === '1'; } catch (e) {}
    function sync() { if (likeBtn) likeBtn.classList.toggle('active', liked); }
    if (likeCount) get(likeKey).then(function (v) { if (v !== null) likeCount.textContent = v; });
    sync();
    if (likeBtn) {
      likeBtn.addEventListener('click', function () {
        hit(likeKey, liked ? 'decrement' : 'hit').then(function (d) {
          liked = !liked;
          try { localStorage.setItem('l-' + base, liked ? '1' : '0'); } catch (e) {}
          sync();
          if (d && typeof d.value === 'number') likeCount.textContent = d.value;
          else get(likeKey).then(function (v) { if (v !== null) likeCount.textContent = v; });
        });
      });
    }
  }
})();

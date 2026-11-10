window.__ModuleLoader__.load({
  id: '@local/dsh-skillbox',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    let createPortal = null;
    try {
      const reactDom = require('react-dom');
      if (reactDom && typeof reactDom.createPortal === 'function') createPortal = reactDom.createPortal;
    } catch (error) {
      createPortal = null;
    }

    function Overlay(props) {
      if (!createPortal) return props.children;
      return createPortal(props.children, document.body);
    }

    // 最近使用：只记在 localStorage，纯本地偏好，不上报。
    var RECENT_KEY = 'skillbox-recent';
    function readRecentMap() {
      try {
        var raw = window.localStorage.getItem(RECENT_KEY);
        var obj = raw ? JSON.parse(raw) : {};
        return obj && typeof obj === 'object' ? obj : {};
      } catch (error) {
        return {};
      }
    }
    function markRecentKey(key) {
      if (!key) return;
      try {
        var map = readRecentMap();
        map[key] = Date.now();
        var keys = Object.keys(map);
        if (keys.length > 300) {
          keys.sort(function (a, b) { return map[a] - map[b]; });
          for (var i = 0; i < keys.length - 300; i += 1) delete map[keys[i]];
        }
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(map));
      } catch (error) {
        /* 隐私模式下 localStorage 可能不可用 */
      }
    }
    function isRecent(map, key) {
      var t = map && map[key];
      return typeof t === 'number' && Date.now() - t < 7 * 24 * 3600 * 1000;
    }

    const CSS = [
        '.sh-sort-hint{font-size:11px;opacity:.6}',
        '.sh-sort{font-size:12px;padding:4px 6px;border-radius:6px;border:1px solid var(--sh-line);background:transparent;color:inherit}',
        '.sh-note{grid-column:1/-1;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:8px 10px;border:1px solid rgba(214,158,46,.35);background:rgba(214,158,46,.10);border-radius:8px;font-size:12px;color:var(--sh-fg)}',
        '.sh-note-row{display:flex;gap:8px;flex:1 1 260px;align-items:center}',
        '.sh-note-row .sh-input{flex:1;min-width:180px}',
      '.sk-btn{display:inline-flex;align-items:center;gap:6px;padding:5px 9px;border-radius:8px;border:1px solid rgba(140,160,190,.22);background:rgba(120,150,190,.10);color:inherit;font:inherit;font-size:12px;line-height:1;cursor:pointer;opacity:.86;transition:background .15s ease,opacity .15s ease}',
      '.sk-btn:hover{background:rgba(120,160,220,.22);opacity:1}',
      '.sk-mask{position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(4,8,14,.55);backdrop-filter:blur(6px)}',
      '.sk-panel{width:min(780px,92vw);max-height:78vh;display:flex;flex-direction:column;border-radius:16px;border:1px solid rgba(150,170,200,.20);background:rgba(18,23,32,.94);color:#e8eef7;box-shadow:0 24px 70px rgba(0,0,0,.55);overflow:hidden;font-size:13px}',
      '.sk-head{display:flex;align-items:center;gap:10px;padding:14px 16px 10px}',
      '.sk-title{font-size:15px;font-weight:600;letter-spacing:.3px}',
      '.sk-sub{color:#8fa2bb;font-size:11.5px}',
      '.sk-x{margin-left:auto;border:0;background:transparent;color:#9fb0c6;font-size:18px;line-height:1;cursor:pointer;padding:4px 8px;border-radius:8px}',
      '.sk-x:hover{background:rgba(160,180,210,.16);color:#fff}',
      '.sk-tools{display:flex;gap:8px;align-items:center;padding:0 16px 10px;flex-wrap:wrap}',
      '.sk-search{flex:1;min-width:180px;padding:7px 10px;border-radius:9px;border:1px solid rgba(140,160,190,.24);background:rgba(255,255,255,.05);color:#e8eef7;font:inherit;font-size:12.5px;outline:none}',
      '.sk-search:focus{border-color:rgba(120,170,255,.55)}',
      '.sk-tab{padding:5px 10px;border-radius:999px;border:1px solid rgba(140,160,190,.22);background:transparent;color:#a9bbd2;font:inherit;font-size:11.5px;cursor:pointer}',
      '.sk-tab.on{background:rgba(96,140,220,.28);border-color:rgba(120,170,255,.5);color:#eaf2ff}',
      '.sk-list{flex:1;overflow:auto;padding:2px 10px 10px}',
      '.sk-item{display:flex;gap:12px;align-items:flex-start;padding:10px 10px;border-radius:10px;border:1px solid transparent}',
      '.sk-item:hover{background:rgba(120,150,200,.10);border-color:rgba(140,170,210,.18)}',
      '.sk-item .sk-main{flex:1;min-width:0}',
      '.sk-item .sk-name{display:flex;align-items:center;gap:8px;font-weight:600;font-size:13px}',
      '.sk-desc{color:#93a5bd;font-size:12px;line-height:1.5;margin-top:3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}',
      '.sk-badge{font-size:10.5px;padding:1px 7px;border-radius:999px;border:1px solid rgba(150,175,210,.3);color:#a8bcd8;font-weight:500}',
      '.sk-badge.dsh{color:#7fd7a8;border-color:rgba(110,220,160,.35)}',
      '.sk-badge.workbuddy{color:#f0b776;border-color:rgba(240,183,118,.35)}',
      '.sk-badge.claude{color:#e59a86;border-color:rgba(229,154,134,.35)}',
      '.sk-badge.codex{color:#8fb7f5;border-color:rgba(143,183,245,.35)}',
      '.sk-badge.wb{color:#c7a8f7;border-color:rgba(199,168,247,.35)}',
      '.sk-ava{width:40px;height:40px;border-radius:11px;object-fit:cover;flex:0 0 auto;background:rgba(255,255,255,.07);border:1px solid rgba(150,175,210,.18)}',
      '.sk-ava-ph{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;color:#b8c9e2}',
      '.sk-act{flex:0 0 auto;padding:6px 12px;border-radius:9px;border:1px solid rgba(130,165,225,.35);background:rgba(90,130,205,.20);color:#dce9ff;font:inherit;font-size:12px;cursor:pointer;white-space:nowrap}',
      '.sk-act:hover{background:rgba(100,145,225,.34)}',
      '.sk-act.on{border-color:rgba(150,170,200,.22);background:transparent;color:#8b9db4}',
      '.sk-act.on:hover{border-color:rgba(235,130,130,.45);color:#ff9c9c;background:rgba(200,80,80,.12)}',
      '.sk-empty{padding:26px;text-align:center;color:#7f92aa;font-size:12.5px}',
      '.sk-foot{padding:9px 16px 12px;border-top:1px solid rgba(140,160,190,.14);color:#7f92aa;font-size:11px;display:flex;gap:8px;align-items:center}',
      '.sk-err{color:#ff9c9c}',
      '.sk-ec{display:inline-flex;align-items:center;gap:6px}',
      '.sk-ec-pill{display:inline-flex;align-items:center;gap:7px;padding:3px 9px 3px 3px;border-radius:999px;border:1px solid rgba(140,160,190,.25);background:rgba(120,150,190,.10);color:inherit;font:inherit;font-size:12px;line-height:1;cursor:pointer;max-width:230px}',
      '.sk-ec-pill:hover{background:rgba(120,160,220,.20)}',
      '.sk-ec-ava{width:20px;height:20px;border-radius:50%;object-fit:cover;flex:0 0 auto}',
      '.sk-ec-ph{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(120,150,200,.28);font-size:11px;flex:0 0 auto}',
      '.sk-ec-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:150px}',
      '.sk-ec-x{border:0;background:transparent;color:#9fb0c6;font-size:13px;line-height:1;cursor:pointer;padding:0 2px;margin-left:2px}',
      '.sk-ec-x:hover{color:#fff}',
      '.sk-hdr{display:flex;align-items:center;gap:8px;margin:12px 0 2px;font-size:13px;line-height:1;opacity:.92;user-select:none;pointer-events:none}',
      '.sk-hdr-ava{width:22px;height:22px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 1px rgba(140,160,190,.35);cursor:default}',
      '.sk-hdr-ph{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(120,150,200,.28);font-size:12px}',
      '.sk-hdr-name{font-weight:600;letter-spacing:.2px}',
      '.sk-hdr-prof{opacity:.55;font-size:11px;border-left:1px solid rgba(140,160,190,.35);padding-left:8px}',
      '.sk-pop{position:fixed;z-index:9500;width:268px;max-height:330px;overflow:auto;border-radius:12px;border:1px solid rgba(150,170,200,.22);background:rgba(20,25,34,.97);color:#e8eef7;box-shadow:0 18px 50px rgba(0,0,0,.5);padding:6px;font-size:12.5px}',
      '.sk-pop-h{padding:5px 8px 7px;color:#8fa2bb;font-size:11px}',
      '.sk-pop-hint{padding:0 8px 7px;color:#6f819a;font-size:10.5px;line-height:1.45}',
      '.sk-pop-item{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:8px;cursor:pointer}',
      '.sk-pop-item:hover{background:rgba(120,150,200,.16)}',
      '.sk-pop-item.on{background:rgba(96,140,220,.26)}',
      '.sk-pop-t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.sk-pop-p{color:#8fa2bb;font-size:11px;white-space:nowrap}',
      '.sh-page{--sh-line:rgba(127,140,160,.18);--sh-fg:rgba(127,140,160,.10);display:flex;flex-direction:column;height:100%;min-height:0;font-size:13px;color:inherit}',
      '.sh-head{display:flex;align-items:center;gap:12px;padding:16px 20px 13px;border-bottom:1px solid var(--sh-line)}',
      '.sh-head-l{min-width:0}',
      '.sh-title{font-size:16px;font-weight:650;letter-spacing:.2px}',
      '.sh-sub{font-size:11.5px;opacity:.55;margin-top:3px}',
      '.sh-search{flex:0 0 280px;margin-left:auto;padding:8px 11px;border-radius:9px;border:1px solid var(--sh-line);background:var(--sh-fg);color:inherit;font:inherit;font-size:12.5px;outline:none}',
      '.sh-search:focus{border-color:rgba(120,170,255,.5)}',
      '.sh-body{flex:1;display:flex;min-height:0}',
      '.sh-nav{flex:0 0 196px;width:196px;border-right:1px solid var(--sh-line);padding:8px 8px 20px;overflow:auto}',
      '.sh-nav-t{font-size:10.5px;letter-spacing:.1em;opacity:.42;padding:12px 9px 5px}',
      '.sh-nav-i{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:8px;cursor:pointer;font-size:12.5px;opacity:.82;user-select:none}',
      '.sh-nav-i:hover{background:var(--sh-fg)}',
      '.sh-nav-i.on{background:rgba(110,155,230,.16);opacity:1;font-weight:600;box-shadow:inset 0 0 0 1px rgba(120,170,255,.22)}',
      '.sh-nav-l{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.sh-nav-n{font-size:11px;opacity:.55;font-variant-numeric:tabular-nums}',
      '.sh-dot{width:7px;height:7px;border-radius:50%;background:rgba(140,160,190,.5);flex:0 0 auto}',
      '.sh-dot.dsh{background:#66c99a}.sh-dot.workbuddy{background:#e5a25f}.sh-dot.claude{background:#d9836c}.sh-dot.codex{background:#6f9de0}.sh-dot.doubao{background:#8a7fd8}',
      '.sh-list{flex:1;min-width:0;overflow:auto;padding:12px 14px 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(226px,1fr));gap:10px;align-content:start}',
      '.sh-row{display:flex;flex-direction:column;gap:7px;padding:11px 12px 10px;border-radius:12px;border:1px solid var(--sh-line);background:rgba(127,140,160,.045);cursor:pointer;min-width:0}',
      '.sh-row:hover{background:var(--sh-fg);border-color:rgba(120,170,255,.30)}',
      '.sh-row.on{background:rgba(110,155,230,.14);border-color:rgba(120,170,255,.55)}',
      '.sh-row-h{display:flex;align-items:center;gap:9px;min-width:0}',
      '.sh-row-t{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}',
      '.sh-row-name{font-weight:600;font-size:13px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.sh-row-b{display:flex;gap:5px;flex-wrap:wrap;min-width:0}',
      '.sh-row-d{font-size:11.5px;line-height:1.5;opacity:.66;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;min-height:50px}',
      '.sh-row-m{font-size:10.5px;opacity:.40;font-family:ui-monospace,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-top:auto}',
      '.sh-empty{grid-column:1/-1}',
      '.sh-glyph{width:30px;height:30px;flex:0 0 auto;border-radius:9px;display:flex;align-items:center;justify-content:center;background:var(--sh-fg);border:1px solid var(--sh-line);opacity:.8}',
      '.sh-ava{width:30px;height:30px;flex:0 0 auto;border-radius:9px;object-fit:cover;background:var(--sh-fg);border:1px solid var(--sh-line)}',
      '.sh-ava-ph{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;opacity:.7}',
      '.sh-badge{font-size:10.5px;padding:1px 7px;border-radius:999px;border:1px solid var(--sh-line);opacity:.8;font-weight:500;white-space:nowrap}',
      '.sh-badge.ok{color:#66c99a;border-color:rgba(102,201,154,.4);opacity:1}',
      '.sh-badge.dsh{color:#66c99a;border-color:rgba(102,201,154,.36)}',
      '.sh-badge.workbuddy{color:#e5a25f;border-color:rgba(229,162,95,.36)}',
      '.sh-badge.claude{color:#d9836c;border-color:rgba(217,131,108,.36)}',
      '.sh-badge.codex{color:#6f9de0;border-color:rgba(111,157,224,.36)}',
      '.sh-badge.doubao{color:#8a7fd8;border-color:rgba(138,127,216,.4)}',
      '.sh-badge.wb{color:#b48cf0;border-color:rgba(180,140,240,.4)}',
      '.sh-act{flex:0 0 auto;padding:4px 9px;border-radius:8px;border:1px solid rgba(120,170,255,.38);background:rgba(90,130,205,.20);color:inherit;font:inherit;font-size:11.5px;cursor:pointer;white-space:nowrap}',
      '.sh-act:hover{background:rgba(100,145,225,.32)}',
      '.sh-act.ghost{border-color:var(--sh-line);background:transparent;opacity:.62}',
      '.sh-act.ghost:hover{opacity:1;border-color:rgba(235,130,130,.45);color:#ff9c9c;background:rgba(200,80,80,.1)}',
      '.sh-side{flex:0 0 340px;width:340px;border-left:1px solid var(--sh-line);padding:16px 18px 24px;overflow:auto}',
      '.sh-side-empty{padding:26px 4px;font-size:12.5px;opacity:.5;line-height:1.6}',
      '.sh-d-title{font-size:15px;font-weight:650;line-height:1.4;word-break:break-word}',
      '.sh-d-badges{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}',
      '.sh-d-desc{font-size:12.5px;line-height:1.62;opacity:.72;margin-top:10px;white-space:pre-wrap;word-break:break-word}',
      '.sh-d-k{font-size:10.5px;letter-spacing:.08em;opacity:.4;margin:16px 0 6px;text-transform:uppercase}',
      '.sh-d-path{font-family:ui-monospace,Consolas,monospace;font-size:11px;line-height:1.5;opacity:.62;word-break:break-all;background:var(--sh-fg);padding:7px 9px;border-radius:7px}',
      '.sh-d-actions{display:flex;gap:8px;margin-top:12px}',
      '.sh-btn{padding:6px 12px;border-radius:8px;border:1px solid var(--sh-line);background:var(--sh-fg);color:inherit;font:inherit;font-size:12px;cursor:pointer}',
      '.sh-btn:hover{opacity:.85}',
      '.sh-row-zh{font-weight:400;opacity:.5;font-size:11px}',
      '.sh-modes{display:flex;gap:6px;margin-right:10px;padding-right:10px;border-right:1px solid var(--sh-line)}',
  '.sh-chips{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:6px;margin-bottom:4px}',
      '.sh-chip{padding:4px 11px;border-radius:999px;border:1px solid var(--sh-line);font-size:12px;cursor:pointer;opacity:.8;user-select:none}',
      '.sh-chip.on{background:rgba(96,150,255,.18);border-color:rgba(96,150,255,.5);color:#8ab6ff;opacity:1}',
      '.sh-btn.on{background:rgba(96,150,255,.20);border-color:rgba(96,150,255,.55);color:#8ab6ff}',
      '.sh-btn.primary{border-color:rgba(120,170,255,.45);background:rgba(90,130,205,.24)}',
      '.sh-btn.danger{border-color:rgba(235,130,130,.4);color:#ff9c9c}',
      '.sh-files{border:1px solid var(--sh-line);border-radius:8px;overflow:hidden;max-height:190px;overflow-y:auto}',
      '.sh-file{display:flex;gap:8px;padding:4px 9px;font-family:ui-monospace,Consolas,monospace;font-size:11px;line-height:1.5;opacity:.72;border-bottom:1px solid rgba(127,140,160,.08)}',
      '.sh-file.dir{opacity:.5}',
      '.sh-file-n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.sh-file-s{opacity:.6;font-variant-numeric:tabular-nums}',
      '.sh-excerpt{margin:0;padding:10px 11px;border-radius:8px;border:1px solid var(--sh-line);background:var(--sh-fg);font-family:ui-monospace,Consolas,monospace;font-size:11px;line-height:1.6;white-space:pre-wrap;word-break:break-word;max-height:280px;overflow:auto;opacity:.78}',
      '.sh-empty{padding:28px 8px;text-align:center;font-size:12.5px;opacity:.5}',
      '.sh-err{color:#ff9c9c;opacity:1}',
      '.sh-more{grid-column:1/-1;display:flex;justify-content:center;padding:10px 0 4px}',
      '.sh-foot{display:flex;gap:10px;align-items:center;padding:8px 20px;border-top:1px solid var(--sh-line);font-size:11px;opacity:.45}',
      '.sh-foot-r{margin-left:auto}',
      '.sh-upd{display:flex;align-items:center;gap:8px;margin-left:14px;padding-left:14px;border-left:1px solid var(--sh-line)}',
      '.sh-ver{font-family:ui-monospace,Consolas,monospace;opacity:.75}',
      '.sh-upd-ok{color:#5fd08a;opacity:.9}',
      '.sh-upd-msg{opacity:.7;max-width:520px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.sh-upd-link{color:#7cb7ff;text-decoration:none}',
      '.sh-sort{height:30px;padding:0 8px;border-radius:8px;border:1px solid var(--sh-line);background:transparent;color:inherit;font-size:12.5px;cursor:pointer}',
  '.sh-badge.rec{background:rgba(64,158,255,.18);color:#7cb7ff;border-color:rgba(64,158,255,.35)}',
  '.sh-modal-mask{position:fixed;inset:0;background:rgba(8,10,14,.62);display:flex;align-items:center;justify-content:center;z-index:9500;padding:40px}',
  '.sh-modal{width:min(860px,92vw);max-height:80vh;display:flex;flex-direction:column;background:var(--dsw-alias-bg-base,rgba(22,24,30,.98));color:inherit;border:1px solid var(--sh-line);border-radius:14px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.45)}',
  '.sh-modal-h{display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--sh-line)}',
  '.sh-modal-t{flex:1;font-size:12.5px;font-family:ui-monospace,Consolas,monospace;opacity:.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.sh-modal-b{flex:1;overflow:auto;padding:14px 16px}',
  '.sh-full{margin:0;font-size:12.5px;line-height:1.65;white-space:pre-wrap;word-break:break-word;font-family:ui-monospace,Consolas,monospace}',
  '.sh-d-empty{padding:10px 2px 4px;font-size:12px;line-height:1.7;opacity:.72}',
  '.sh-d-empty-b{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}',
  '.sh-prev{width:min(760px,94vw);max-height:82vh}',
  '.sh-prev-h{display:flex;align-items:flex-start;gap:10px;padding:16px 18px 8px}',
  '.sh-prev-tt{flex:1;min-width:0}',
  '.sh-prev-name{font-size:15px;font-weight:650;letter-spacing:.2px}',
  '.sh-prev-repo{font-size:11.5px;opacity:.55;margin-top:3px;font-family:ui-monospace,Consolas,monospace;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.sh-x{width:28px;height:28px;border-radius:8px;border:1px solid var(--sh-line);background:transparent;color:inherit;cursor:pointer;font-size:16px;line-height:1;opacity:.7}',
  '.sh-x:hover{opacity:1}',
  '.sh-prev-meta{display:flex;flex-wrap:wrap;gap:6px;padding:0 18px 12px}',
  '.sh-prev-b{flex:1;overflow:auto;margin:0 18px;background:rgba(127,140,160,.07);border:1px solid var(--sh-line);border-radius:10px;padding:12px 14px}',
  '.sh-prev-f{display:flex;align-items:center;gap:10px;padding:12px 18px 16px}',
  '.sh-prev-tip{flex:1;font-size:11.5px;opacity:.55;line-height:1.5}',
  '.sh-prev-w{width:0}',
  '.sh-file{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 9px;border-radius:7px;font-size:12px}',
  '.sh-file:hover{background:rgba(127,140,160,.12)}',
  '.sh-file-n{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
  '.sh-file-s{font-size:11px;opacity:.5;flex:none}',
  '.sh-toast{position:fixed;left:50%;bottom:34px;transform:translateX(-50%);padding:9px 16px;border-radius:10px;background:rgba(28,34,44,.96);color:#eaf2ff;font-size:12.5px;box-shadow:0 10px 30px rgba(0,0,0,.4);z-index:9600}',
    ].join('\n');

    function ensureStyle() {
      try {
        if (document.getElementById('dsh-skillbox-style')) return;
        const st = document.createElement('style');
        st.id = 'dsh-skillbox-style';
        st.textContent = CSS;
        document.head.appendChild(st);
      } catch (error) {
        /* 样式注入失败时不影响逻辑 */
      }
    }

    ensureStyle();

    function api(path, body) {      const opts = body
        ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
        : { method: 'GET' };
      return fetch(path, opts).then(function (res) {
        return res.json().catch(function () {
          return { ok: false, error: 'bad response' };
        });
      });
    }

    function checkUpdate(setState) {
      const setBusy = setState.busy;
      const setMsg = setState.msg;
      const setUpd = setState.upd;
      setBusy(true);
      setMsg('');
      return api('/skillbox/update/check')
        .then(function (r) {
          setUpd(r || null);
          if (r && r.ok === false) setMsg(r.error || '检查失败');
        })
        .catch(function (e) {
          setMsg(String((e && e.message) || e));
        })
        .then(function () {
          setBusy(false);
        });
    }

    function applyUpdate(setState) {
      const setBusy = setState.busy;
      const setMsg = setState.msg;
      const setUpd = setState.upd;
      setBusy(true);
      setMsg('正在下载并覆盖文件…');
      return api('/skillbox/update/apply', {})
        .then(function (r) {
          if (r && r.ok) {
            setMsg('已更新到 v' + r.to + '（覆盖 ' + r.files + ' 个文件，旧版本备份在 ' + r.backup + '）。重启 DSH 后生效。');
            setUpd({ ok: true, current: r.to, latest: r.to, hasUpdate: false });
          } else {
            setMsg((r && r.error) || '更新失败');
          }
        })
        .catch(function (e) {
          setMsg(String((e && e.message) || e));
        })
        .then(function () {
          setBusy(false);
        });
    }

    function ExpertChip(props) {
      const sessionId = props && props.sessionId ? props.sessionId : '';
      const [cur, setCur] = React.useState(null);
      const [open, setOpen] = React.useState(false);
      const [list, setList] = React.useState([]);
      const [pos, setPos] = React.useState(null);
      const btnRef = React.useRef(null);
      const briefsRef = React.useRef({});

      function republish(res) {
        if (!res || !res.ok) return;
        publishExpert({
          sessionId: sessionId,
          history: res.history || [],
          briefs: briefsRef.current || {},
        });
      }

      React.useEffect(
        function () {
          if (!sessionId) return;
          Promise.all([
            api('/skillbox/selection?sessionId=' + encodeURIComponent(sessionId)),
            api('/skillbox/experts'),
          ])
            .then(function (pair) {
              const res = pair[0] || {};
              const exps = pair[1] || {};
              if (!res.ok) return;
              const briefs = {};
              (exps.experts || []).forEach(function (e) {
                briefs[e.key] = e;
              });
              briefsRef.current = briefs;
              setCur(res.expert || null);
              publishExpert({ sessionId: sessionId, history: res.history || [], briefs: briefs });
              // 旧版存档没有 sinceTurn：补一个“从下一轮开始”，让历史轮次保持无归属。
              const legacy = (res.history || []).filter(function (e) {
                return e && e.key && typeof e.sinceTurn !== 'number';
              })[0];
              if (legacy) {
                api('/skillbox/select-expert', {
                  sessionId: sessionId,
                  key: legacy.key,
                  sinceTurn: nextTurnIndex(),
                })
                  .then(function (out) {
                    republish(out);
                  })
                  .catch(function () {});
              }
            })
            .catch(function () {});
        },
        [sessionId],
      );

      function toggle() {
        if (open) {
          setOpen(false);
          return;
        }
        const rect = btnRef.current && btnRef.current.getBoundingClientRect();
        if (rect) setPos({ left: Math.max(8, rect.left), bottom: Math.max(8, window.innerHeight - rect.top + 8) });
        setOpen(true);
        api('/skillbox/experts')
          .then(function (res) {
            if (res && res.ok) setList(res.experts || []);
          })
          .catch(function () {});
      }

      function choose(entry) {
        api('/skillbox/select-expert', {
          sessionId: sessionId,
          key: entry ? entry.key : null,
          sinceTurn: nextTurnIndex(),
        })
          .then(function (res) {
            if (res && res.ok) {
              setCur(res.expert || null);
              republish(res);
              setOpen(false);
            }
          })
          .catch(function () {});
      }

      const pop =
        open && pos
          ? h(
              Overlay,
              null,
              h(
                'div',
                { className: 'sk-pop', style: { left: pos.left + 'px', bottom: pos.bottom + 'px' } },
                h('div', { className: 'sk-pop-h' }, '本对话使用的专家'),
                h(
                  'div',
                  { className: 'sk-pop-hint' },
                  '直接选用即可，无需导入；导入 = 存成常驻技能，不挂专家时也能用',
                ),
                cur
                  ? h(
                      'div',
                      { className: 'sk-pop-item on', onClick: function () { choose(null); } },
                      h('span', { style: { flex: 1 } }, '不使用专家'),
                    )
                  : null,
                list.length
                  ? list.map(function (e) {
                      return h(
                        'div',
                        {
                          key: e.key,
                          className: 'sk-pop-item' + (cur && cur.key === e.key ? ' on' : ''),
                          onClick: function () { choose(e); },
                        },
                        e.hasAvatar
                          ? h('img', {
                              className: 'sk-ec-ava',
                              src: '/skillbox/avatar?key=' + encodeURIComponent(e.key),
                              alt: '',
                            })
                          : h('div', { className: 'sk-ec-ph' }, String(e.title || '?').slice(0, 1)),
                        h('span', { className: 'sk-pop-t' }, e.title),
                        e.profession ? h('span', { className: 'sk-pop-p' }, e.profession) : null,
                      );
                    })
                  : h('div', { className: 'sk-pop-h' }, '没有找到专家包'),
              ),
            )
          : null;

      return h(
        'div',
        { className: 'sk-ec' },
        h(
          'button',
          { ref: btnRef, className: 'sk-ec-pill', onClick: toggle, title: cur ? '点击更换专家' : '为这个对话选择专家' },
          cur
            ? h(
                React.Fragment,
                null,
                cur.hasAvatar
                  ? h('img', { className: 'sk-ec-ava', src: '/skillbox/avatar?key=' + encodeURIComponent(cur.key), alt: '' })
                  : h('div', { className: 'sk-ec-ph' }, String(cur.title || '?').slice(0, 1)),
                h('span', { className: 'sk-ec-name' }, cur.title || '专家'),
              )
            : h('span', { className: 'sk-ec-name' }, '＋ 专家'),
        ),
        cur
          ? h(
              'button',
              { className: 'sk-ec-x', title: '取消专家', onClick: function () { choose(null); } },
              '×',
            )
          : null,
        pop,
      );
    }

    // —— 技能库：整页主面板（sidebar.panellist 图标 + main 面板） ——
    function fmtSize(bytes) {
      const n = Number(bytes) || 0;
      if (!n) return '';
      if (n < 1024) return n + ' B';
      if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
      return (n / 1024 / 1024).toFixed(1) + ' MB';
    }

    function sumSize(files) {
      let total = 0;
      (files || []).forEach(function (f) {
        if (!f.dir) total += Number(f.size) || 0;
      });
      return total;
    }

    function SkillHubIcon(props) {
      const size = (props && props.size) || 18;
      return h(
        'svg',
        { width: size, height: size, viewBox: '0 0 16 16', 'aria-hidden': 'true' },
        h('path', {
          d: 'M3 2h4v3.2a1.3 1.3 0 0 0 2.6 0V2H13v4h-3.2a1.3 1.3 0 0 0 0 2.6H13v5.4H9v-3.2a1.3 1.3 0 0 0-2.6 0V14H3z',
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 1.2,
          strokeLinejoin: 'round',
        }),
      );
    }

    function SkillHubPage() {
      const [view, setView] = React.useState('skills');
      const [source, setSource] = React.useState('all');
      const [query, setQuery] = React.useState('');
      const [skills, setSkills] = React.useState([]);
      const [experts, setExperts] = React.useState([]);
      const [skillsDir, setSkillsDir] = React.useState('');
      const [version, setVersion] = React.useState('');
      const [loading, setLoading] = React.useState(true);
      const [error, setError] = React.useState('');
      const [busy, setBusy] = React.useState('');
      const [selKey, setSelKey] = React.useState('');
      const [detail, setDetail] = React.useState(null);
      const [detailLoading, setDetailLoading] = React.useState(false);
      const [toast, setToast] = React.useState('');
      const [sortMode, setSortMode] = React.useState('default');
      const [recent, setRecent] = React.useState(readRecentMap());
      const [fullOpen, setFullOpen] = React.useState(false);
      const [fullText, setFullText] = React.useState('');
      const [fullLoading, setFullLoading] = React.useState(false);
      const [zh, setZh] = React.useState(function () {
        try { return localStorage.getItem('skillbox-zh') !== '0'; } catch (e) { return true; }
      });
      const [tr, setTr] = React.useState({});
      const trAsked = React.useRef({});
      const [dItems, setDItems] = React.useState([]);
      const [dTotal, setDTotal] = React.useState(0);
      const [dLoading, setDLoading] = React.useState(false);
      const [dErr, setDErr] = React.useState('');
      const [dCat, setDCat] = React.useState('claude');
      const [dMode, setDMode] = React.useState('skills');
      const [repoSel, setRepoSel] = React.useState(null);
      const [prev, setPrev] = React.useState(null);
      const [installing, setInstalling] = React.useState('');
      const [gh, setGh] = React.useState(null);
      const [ghInput, setGhInput] = React.useState('');
      const [ghOpen, setGhOpen] = React.useState(false);
      const [ghBusy, setGhBusy] = React.useState(false);
      const [dSort, setDSort] = React.useState('default');
      const [dMeta, setDMeta] = React.useState({});
      const [dSrc, setDSrc] = React.useState('github');
      const [clawItems, setClawItems] = React.useState([]);
      const [clawLoading, setClawLoading] = React.useState(false);
      const [clawErr, setClawErr] = React.useState('');
      const [clawCursor, setClawCursor] = React.useState('');
      const [clawSort, setClawSort] = React.useState('downloads');
      const [upd, setUpd] = React.useState(null);
      const [updBusy, setUpdBusy] = React.useState(false);
      const [updMsg, setUpdMsg] = React.useState('');
      const D_CATS = [
        { id: 'claude', label: 'Claude', q: 'topic:claude-skills' },
        { id: 'codex', label: 'Codex', q: 'topic:codex' },
        { id: 'dsh', label: 'DSH', q: '\"deepseek harness\"' },
        { id: 'agent', label: '通用 Agent', q: 'topic:agent-skills' },
      ];

      function say(msg) {
        setToast(msg);
        window.setTimeout(function () {
          setToast('');
        }, 2200);
      }

      function load() {
        setLoading(true);
        setError('');
        return Promise.all([api('/skillbox/list'), api('/skillbox/experts')])
          .then(function (pair) {
            const a = pair[0] || {};
            const b = pair[1] || {};
            if (!a.ok) throw new Error(a.error || '读取技能失败');
            setSkills(a.entries || []);
            setSkillsDir(a.skillsDir || '');
            setVersion(a.version || '');
            setExperts(b.ok ? b.experts || [] : []);
          })
          .catch(function (err) {
            setError(String((err && err.message) || err));
          })
          .finally(function () {
            setLoading(false);
          });
      }

      React.useEffect(function () {
        load();
      }, []);

      function needsTr(text) {
        const t = String(text || '').trim();
        if (!t) return false;
        if (!/[A-Za-z]/.test(t)) return false;
        if (/[\u4e00-\u9fa5]/.test(t)) return false;
        return true;
      }

      function zhTitle(text) {
        const t = String(text || '').trim();
        if (!zh || !needsTr(t)) return '';
        const v = tr[t];
        return v && v !== t ? v : '';
      }

      function zhOf(text) {
        const t = String(text || '').trim();
        if (!zh || !needsTr(t)) return text;
        return tr[t] || text;
      }

      React.useEffect(function () {
        if (!zh) return undefined;
        const pool = [];
        function push(text) {
          const t = String(text || '').trim();
          if (!needsTr(t)) return;
          if (tr[t] || trAsked.current[t]) return;
          trAsked.current[t] = true;
          pool.push(t);
        }
        for (const item of skills) { push(item.title); push(item.description); }
        for (const item of experts) { push(item.title); push(item.description); }
        for (const item of dItems) { push(item.description); }
        if (!pool.length) return undefined;
        let stopped = false;
        (async function run() {
          for (let i = 0; i < pool.length && !stopped; i += 8) {
            const slice = pool.slice(i, i + 8);
            try {
              const res = await fetch('/skillbox/translate', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  target: 'zh',
                  items: slice.map(function (text, idx) { return { k: String(idx), text: text }; }),
                }),
              }).then(function (r) { return r.json(); });
              if (res && res.ok && res.map) {
                const add = {};
                for (const k in res.map) add[slice[Number(k)]] = res.map[k];
                if (Object.keys(add).length) {
                  setTr(function (prev) { return Object.assign({}, prev, add); });
                }
              }
            } catch (e) { /* 网络失败就保持原文 */ }
          }
        })();
        return function () { stopped = true; };
      }, [zh, skills, experts, dItems]);

      React.useEffect(
        function () {
          if (!selKey) {
            setDetail(null);
            return;
          }
          setDetailLoading(true);
          api('/skillbox/detail?key=' + encodeURIComponent(selKey))
            .then(function (res) {
              setDetail(res && res.ok ? res : null);
            })
            .catch(function () {
              setDetail(null);
            })
            .finally(function () {
              setDetailLoading(false);
            });
        },
        [selKey],
      );

      const q = query.trim().toLowerCase();
      function hit(text) {
        return String(text || '').toLowerCase().includes(q);
      }

      const installedSkills = skills.filter(function (e) {
        return Boolean(e.importedAs);
      });
      const installedExperts = experts.filter(function (e) {
        return Boolean(e.importedAs);
      });

      const sourceCounts = {};
      for (const e of skills) sourceCounts[e.platform] = (sourceCounts[e.platform] || 0) + 1;
      const sourceLabels = { all: '全部来源', dsh: 'DSH', workbuddy: 'WorkBuddy', claude: 'Claude', codex: 'Codex', doubao: '豆包' };

      let rows = [];
      if (view === 'experts') {
        rows = experts
          .filter(function (e) {
            if (!q) return true;
            return hit(e.title) || hit(e.name) || hit(e.profession) || hit(e.description) || hit(e.folder);
          })
          .map(function (e) {
            return Object.assign({ __kind: 'expert' }, e);
          });
      } else if (view === 'installed') {
        rows = installedSkills
          .filter(function (e) {
            return !q || hit(e.title) || hit(e.name) || hit(e.description);
          })
          .map(function (e) {
            return Object.assign({ __kind: 'skill' }, e);
          });
      } else {
        rows = skills
          .filter(function (e) {
            if (source !== 'all' && e.platform !== source) return false;
            return !q || hit(e.title) || hit(e.name) || hit(e.description) || hit(e.rel);
          })
          .map(function (e) {
            return Object.assign({ __kind: 'skill' }, e);
          });
      }

      function choose(entry) {
        setSelKey(entry.key);
        markRecentKey(entry.key);
        setRecent(readRecentMap());
      }

      if (sortMode === 'name') {
        rows = rows.slice().sort(function (a, b) {
          return String(a.title || a.name || '').localeCompare(String(b.title || b.name || ''), 'zh-Hans-CN');
        });
      } else if (sortMode === 'size') {
        rows = rows.slice().sort(function (a, b) {
          return (b.size || 0) - (a.size || 0);
        });
      } else if (sortMode === 'recent') {
        rows = rows.slice().sort(function (a, b) {
          return (recent[b.key] || 0) - (recent[a.key] || 0);
        });
      }

      function runSearch(text, catId) {
        const q = String(text == null ? query : text).trim();
        const cat = D_CATS.find(function (c) { return c.id === (catId || dCat); });
        const real = q || (cat ? cat.q : 'topic:claude-skills');
        setDLoading(true);
        setDErr('');
        setRepoSel(null);
        const mode = arguments[2] || dMode;
        const sortParam =
          dSort === 'stars' || dSort === 'forks' || dSort === 'updated' ? '&sort=' + dSort : '';
        const url = mode === 'skills'
          ? '/skillbox/discover/skills?per=100&q=' + encodeURIComponent(q)
          : '/skillbox/discover?q=' + encodeURIComponent(real) + sortParam;
        api(url)
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '搜索失败');
            setDItems(res.items || []);
            setDTotal(res.total || 0);
          })
          .catch(function (err) {
            setDItems([]);
            setDErr(String((err && err.message) || err));
          })
          .finally(function () {
            setDLoading(false);
          });
      }

      function openRepo(item) {
        setRepoSel({ loading: true, repo: item.repo, branch: item.branch });
        api('/skillbox/discover/tree?repo=' + encodeURIComponent(item.repo))
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '读取仓库失败');
            setRepoSel({
              loading: false,
              repo: item.repo,
              branch: res.branch || item.branch,
              stars: res.stars || item.stars,
              skills: res.skills || [],
              item: item,
            });
          })
          .catch(function (err) {
            setRepoSel({ loading: false, error: String((err && err.message) || err), repo: item.repo });
          });
      }

      function openPreview(skill, repoArg, branchArg) {
        const pRepo = repoArg || (repoSel && repoSel.repo) || '';
        const pBranch = branchArg || (repoSel && repoSel.branch) || '';
        setPrev({
          loading: true,
          repo: pRepo,
          branch: pBranch,
          path: skill.path,
          name: skill.name || String(skill.path || '').split('/').slice(-2)[0],
          size: skill.size || 0,
          isReadme: !!skill.isReadme,
          text: '',
        });
        api(
          '/skillbox/discover/file?repo=' +
            encodeURIComponent(pRepo) +
            '&path=' +
            encodeURIComponent(skill.path) +
            '&branch=' +
            encodeURIComponent(pBranch || ''),
        )
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '读取失败');
            setPrev({ loading: false, repo: pRepo, branch: pBranch, path: skill.path, name: skill.name || String(skill.path || '').split('/').slice(-2)[0], size: skill.size || 0, isReadme: !!skill.isReadme, text: res.text || '' });
          })
          .catch(function (err) {
            setPrev({ loading: false, repo: pRepo, branch: pBranch, path: skill.path, name: skill.name || '', size: skill.size || 0, text: '读取失败：' + String((err && err.message) || err) });
          });
      }

      function installFromGitHub() {
        if (!prev) return;
        setInstalling(prev.path);
        api('/skillbox/discover/install', { repo: prev.repo, path: prev.path, branch: prev.branch || '' })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '安装失败');
            say('已安装 ' + res.files + ' 个文件到 ' + res.target);
            setPrev(null);
            return load();
          })
          .catch(function (err) {
            say('安装失败：' + String((err && err.message) || err));
          })
          .finally(function () {
            setInstalling('');
          });
      }

      function loadClaw(nextSort, text, more) {
        const sort = nextSort || clawSort;
        const q = String(text == null ? '' : text).trim();
        const cursor = more ? clawCursor : '';
        setClawLoading(true);
        setClawErr('');
        const url = q
          ? '/skillbox/clawhub/search?q=' + encodeURIComponent(q) + '&limit=30'
          : '/skillbox/clawhub/list?sort=' + encodeURIComponent(sort) + '&limit=30' +
            (cursor ? '&cursor=' + encodeURIComponent(cursor) : '');
        api(url)
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || 'ClawHub 请求失败');
            const items = res.items || [];
            setClawItems(function (old) {
              if (!more) return items;
              const seen = {};
              (old || []).forEach(function (x) { seen[x.key] = 1; });
              return (old || []).concat(items.filter(function (x) { return !seen[x.key]; }));
            });
            setClawCursor(res.nextCursor || '');
          })
          .catch(function (err) {
            if (!more) setClawItems([]);
            setClawErr(String((err && err.message) || err));
          })
          .finally(function () {
            setClawLoading(false);
          });
      }

      function openClawPrev(item) {
        const base = { src: 'clawhub', owner: item.owner, slug: item.slug, name: item.name || item.slug, path: 'SKILL.md', item: item, tag: 'clawhub:' + item.owner + '/' + item.slug };
        setPrev(Object.assign({ loading: true, text: '' }, base));
        api(
          '/skillbox/clawhub/file?owner=' + encodeURIComponent(item.owner) +
            '&slug=' + encodeURIComponent(item.slug) + '&path=SKILL.md',
        )
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '读取失败');
            setPrev(Object.assign({ loading: false, text: res.text || '' }, base));
          })
          .catch(function (err) {
            setPrev(Object.assign({ loading: false, text: '读取失败：' + String((err && err.message) || err) }, base));
          });
      }

      function installClaw(item) {
        const tag = 'clawhub:' + item.owner + '/' + item.slug;
        setInstalling(tag);
        api('/skillbox/clawhub/install', { owner: item.owner, slug: item.slug })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '安装失败');
            say('已安装 ' + res.files + ' 个文件到 ' + res.target);
            setPrev(null);
            return load();
          })
          .catch(function (err) {
            say('安装失败：' + String((err && err.message) || err));
          })
          .finally(function () {
            setInstalling('');
          });
      }

      function loadGh() {
        api('/skillbox/gh-status')
          .then(function (res) {
            if (res && res.ok) setGh(res);
          })
          .catch(function () {});
      }

      function loadMeta(items) {
        const repos = [];
        const seen = {};
        (items || []).forEach(function (it) {
          if (!it.repo || seen[it.repo]) return;
          if (it.stars != null) return;
          seen[it.repo] = 1;
          repos.push(it.repo);
        });
        if (!repos.length) return;
        api('/skillbox/discover/meta', { repos: repos }).then(function (res) {
          if (res && res.ok && res.meta) {
            setDMeta(function (prev) {
              const next = Object.assign({}, prev);
              for (const k of Object.keys(res.meta)) next[k] = res.meta[k];
              return next;
            });
          }
        }).catch(function () {});
      }

      React.useEffect(function () {
        if (view !== 'discover') return;
        if (dSort === 'default' || dSort === 'name') return;
        if (dMode === 'repos') return;
        loadMeta(dItems);
      }, [dSort, dItems]);

      React.useEffect(function () {
        if (view !== 'discover') return;
        if (dMode !== 'repos') return;
        runSearch('', dCat, 'repos');
      }, [dSort]);

      function saveGhToken() {
        setGhBusy(true);
        api('/skillbox/gh-token', { token: ghInput })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '保存失败');
            setGhInput('');
            setGhOpen(false);
            loadGh();
            say(res.hasToken ? '已保存，正在使用你的 GitHub Token' : '已清空 Token，回到匿名模式');
            if (view === 'discover') runSearch('', dCat, dMode);
          })
          .catch(function (err) {
            say('保存失败：' + String((err && err.message) || err));
          })
          .finally(function () {
            setGhBusy(false);
          });
      }

      React.useEffect(function () {
        if (view === 'discover') loadGh();
      }, [view]);

      React.useEffect(function () {
        if (view === 'discover' && !dItems.length && !dLoading && !dErr) runSearch('', dCat);
      }, [view]);

      function openFull() {
        if (!detail) return;
        const rel = detail.mainRel || 'SKILL.md';
        setFullOpen(true);
        setFullText('');
        setFullLoading(true);
        api('/skillbox/file?key=' + encodeURIComponent(detail.key) + '&rel=' + encodeURIComponent(rel))
          .then(function (res) {
            setFullText(res && res.ok ? res.text : '读取失败：' + ((res && res.error) || 'unknown'));
          })
          .catch(function (err) {
            setFullText('读取失败：' + String((err && err.message) || err));
          })
          .finally(function () {
            setFullLoading(false);
          });
      }

      function doImport(entry) {
        setBusy(entry.key);
        const path = entry.__kind === 'expert' || entry.__isExpert ? '/skillbox/import-expert' : '/skillbox/import';
        api(path, { key: entry.key })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '导入失败');
            say('已导入到 ' + (res.target || '本地技能目录'));
            return load();
          })
          .catch(function (err) {
            say('导入失败：' + String((err && err.message) || err));
          })
          .finally(function () {
            setBusy('');
          });
      }

      function doRemove(entry) {
        const name = entry.importedAs;
        if (!name) return;
        if (!window.confirm('移除「' + entry.title + '」？只删除 DSH 里的副本，来源不受影响。')) return;
        setBusy(entry.key);
        api('/skillbox/remove', { name: name })
          .then(function (res) {
            if (!res || !res.ok) throw new Error((res && res.error) || '移除失败');
            say('已移除');
            return load();
          })
          .catch(function (err) {
            say('移除失败：' + String((err && err.message) || err));
          })
          .finally(function () {
            setBusy('');
          });
      }

      function copyPath() {
        const p = (detail && detail.path) || '';
        if (!p) return;
        const done = function () {
          say('路径已复制');
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(p).then(done, function () {
            say(p);
          });
        } else {
          say(p);
        }
      }

      function navItem(id, label, count, onClick) {
        return h(
          'div',
          {
            key: 'nav-' + id,
            className: 'sh-nav-i' + (onClick && id === 'x' ? '' : ''),
            onClick: onClick || function () {},
          },
          h('span', { className: 'sh-nav-l' }, label),
          count === null || count === undefined ? null : h('span', { className: 'sh-nav-n' }, String(count)),
        );
      }

      const views = [
        { id: 'skills', label: '全部技能', count: skills.length },
        { id: 'experts', label: '专家', count: experts.length },
        { id: 'installed', label: '已安装', count: installedSkills.length + installedExperts.length },
        { id: 'discover', label: '发现', count: null },
      ];

      const nav = h(
        'div',
        { className: 'sh-nav' },
        h('div', { className: 'sh-nav-t' }, '浏览'),
        views.map(function (v) {
          return h(
            'div',
            {
              key: v.id,
              className: 'sh-nav-i' + (view === v.id ? ' on' : ''),
              onClick: function () {
                setView(v.id);
                setSource('all');
                setSelKey('');
              },
            },
            h('span', { className: 'sh-nav-l' }, v.label),
            h('span', { className: 'sh-nav-n' }, String(v.count)),
          );
        }),
        view === 'experts' ? null : h('div', { className: 'sh-nav-t' }, '来源'),
        view === 'experts'
          ? null
          : Object.keys(sourceCounts).map(function (id) {
              return h(
                'div',
                {
                  key: 'src-' + id,
                  className: 'sh-nav-i' + (view === 'skills' && source === id ? ' on' : ''),
                  onClick: function () {
                    setView('skills');
                    setSource(id);
                    setSelKey('');
                  },
                },
                h('span', { className: 'sh-dot sh-dot-' + id }),
                h('span', { className: 'sh-nav-l' }, sourceLabels[id] || id),
                h('span', { className: 'sh-nav-n' }, String(sourceCounts[id])),
              );
            }),
      );

      const list = h(
        'div',
        { className: 'sh-list' },
        loading ? h('div', { className: 'sh-empty' }, '扫描中…') : null,
        !loading && error ? h('div', { className: 'sh-empty sh-err' }, error) : null,
        !loading && !error && !rows.length
          ? h('div', { className: 'sh-empty' }, q ? '没有匹配的条目' : '这里还没有内容')
          : null,
        rows.map(function (e) {
          const isExpert = e.__kind === 'expert';
          const done = Boolean(e.importedAs);
          return h(
            'div',
            {
              key: e.key,
              className: 'sh-row' + (selKey === e.key ? ' on' : ''),
              onClick: function () {
                choose(e);
              },
            },
            h(
              'div',
              { className: 'sh-row-h' },
              isExpert
                ? e.hasAvatar
                  ? h('img', {
                      className: 'sh-ava',
                      src: '/skillbox/avatar?key=' + encodeURIComponent(e.key),
                      alt: '',
                      loading: 'lazy',
                    })
                  : h('div', { className: 'sh-ava sh-ava-ph' }, String(e.title || '?').slice(0, 1))
                : h('div', { className: 'sh-glyph' }, h(SkillHubIcon, { size: 15 })),
              h(
                'div',
                { className: 'sh-row-t' },
                h(
                  'span',
                  { className: 'sh-row-name', title: e.title || e.name || e.key },
                  e.title || e.name || e.key,
                  zhTitle(e.title) ? h('span', { className: 'sh-row-zh' }, ' · ' + zhTitle(e.title)) : null,
                ),
                h(
                  'div',
                  { className: 'sh-row-b' },
                  h('span', { className: 'sh-badge ' + (isExpert ? 'wb' : e.platform) }, isExpert ? e.profession || e.platformLabel || '专家' : e.platformLabel || e.platform),
                  done ? h('span', { className: 'sh-badge ok' }, '已安装') : null,
                  isRecent(recent, e.key) ? h('span', { className: 'sh-badge rec' }, '最近') : null,
                ),
              ),
              h(
                'button',
                {
                  className: 'sh-act' + (done ? ' ghost' : ''),
                  disabled: busy === e.key,
                  onClick: function (ev) {
                    ev.stopPropagation();
                    if (done) doRemove(e);
                    else doImport(e);
                  },
                },
                busy === e.key ? '…' : done ? '移除' : '导入',
              ),
            ),
            h('div', { className: 'sh-row-d', title: e.description || '' }, zhOf(e.description) || e.rel || e.folder || ''),
            h(
              'div',
              { className: 'sh-row-m', title: isExpert ? '' : e.rel || '' },
              isExpert ? (e.skills && e.skills.length ? '附带 ' + e.skills.length + ' 个技能' : '无人设技能') : e.rel || '',
            ),
          );
        }),
      );

      const selEntry = rows.find(function (r) {
        return r.key === selKey;
      });

      const side = h(
        'div',
        { className: 'sh-side' },
        !selKey
          ? h('div', { className: 'sh-side-empty' }, '从左边选一个技能或专家，这里显示详情。')
          : detailLoading
            ? h('div', { className: 'sh-empty' }, '读取中…')
            : !detail
              ? h('div', { className: 'sh-empty sh-err' }, '详情读取失败')
              : h(
                  'div',
                  { className: 'sh-detail' },
                  h(
                    'div',
                    { className: 'sh-d-title' },
                    h(
                      'span',
                      null,
                      (detail.entry && detail.entry.title) || (selEntry && selEntry.title) || '未命名',
                      zhTitle((detail.entry && detail.entry.title) || (selEntry && selEntry.title)) ?
                        h('span', { className: 'sh-row-zh' }, ' · ' + zhTitle((detail.entry && detail.entry.title) || (selEntry && selEntry.title))) :
                        null,
                    ),
                  ),
                  h(
                    'div',
                    { className: 'sh-d-badges' },
                    h('span', { className: 'sh-badge' }, detail.kind === 'expert' ? '专家' : '技能'),
                    detail.entry && detail.entry.platformLabel
                      ? h('span', { className: 'sh-badge ' + detail.entry.platform }, detail.entry.platformLabel)
                      : null,
                    detail.entry && detail.entry.importedAs ? h('span', { className: 'sh-badge ok' }, '已安装') : null,
                  ),
                  h('div', { className: 'sh-d-desc' }, zhOf((detail.entry && detail.entry.description) || '') || '（没有描述）'),
                  h('div', { className: 'sh-d-k' }, '来源路径'),
                  h('div', { className: 'sh-d-path' }, detail.path),
                  h(
                    'div',
                    { className: 'sh-d-actions' },
                    h(
                      'button',
                      { className: 'sh-btn', onClick: copyPath },
                      '复制路径',
                    ),
                    h(
                      'button',
                      { className: 'sh-btn', onClick: openFull },
                      '查看全文',
                    ),
                    detail.entry && detail.entry.importedAs
                      ? h(
                          'button',
                          { className: 'sh-btn danger', onClick: function () { doRemove(detail.entry); } },
                          '移除',
                        )
                      : h(
                          'button',
                          {
                            className: 'sh-btn primary',
                            onClick: function () {
                              doImport(Object.assign({ __kind: detail.kind, __isExpert: detail.kind === 'expert' }, detail.entry));
                            },
                          },
                          '导入到 DSH',
                        ),
                  ),
                  h(
                    'div',
                    { className: 'sh-d-k' },
                    '文件 ' + (detail.files || []).length + (sumSize(detail.files) ? ' · ' + fmtSize(sumSize(detail.files)) : ''),
                  ),
                  h(
                    'div',
                    { className: 'sh-files' },
                    (detail.files || []).slice(0, 120).map(function (f) {
                      return h(
                        'div',
                        { key: f.rel, className: 'sh-file' + (f.dir ? ' dir' : '') },
                        h('span', { className: 'sh-file-n' }, f.rel),
                        f.dir ? null : h('span', { className: 'sh-file-s' }, fmtSize(f.size)),
                      );
                    }),
                  ),
                  detail.excerpt
                    ? h(
                        'div',
                        null,
                        h('div', { className: 'sh-d-k' }, 'SKILL.md 摘要'),
                        h('pre', { className: 'sh-excerpt' }, detail.excerpt),
                      )
                    : null,
                ),
      );

      const dSorted = (function () {
        const arr = dItems.slice();
        function metaOf(it, field) {
          if (it[field] != null) return it[field];
          const m = dMeta[it.repo];
          return m ? m[field] : null;
        }
        if (dSort === 'stars') {
          arr.sort(function (a, b) {
            return (metaOf(b, 'stars') || 0) - (metaOf(a, 'stars') || 0);
          });
        } else if (dSort === 'forks') {
          arr.sort(function (a, b) {
            return (metaOf(b, 'forks') || 0) - (metaOf(a, 'forks') || 0);
          });
        } else if (dSort === 'updated') {
          arr.sort(function (a, b) {
            return String(metaOf(b, 'updatedAt') || '').localeCompare(String(metaOf(a, 'updatedAt') || ''));
          });
        } else if (dSort === 'name') {
          arr.sort(function (a, b) {
            return String(a.name || '').localeCompare(String(b.name || ''));
          });
        }
        return arr;
      })();
      const dNoMeta = dMode === 'skills' && (dSort === 'stars' || dSort === 'forks' || dSort === 'updated') && !ghHasToken();

      function ghHasToken() {
        return !!(gh && gh.hasToken);
      }

      const srcChips = h(
        'div',
        { className: 'sh-modes' },
        h(
          'div',
          {
            className: 'sh-chip' + (dSrc === 'github' ? ' on' : ''),
            onClick: function () {
              if (dSrc === 'github') return;
              setDSrc('github');
            },
          },
          'GitHub 搜索',
        ),
        h(
          'div',
          {
            className: 'sh-chip' + (dSrc === 'clawhub' ? ' on' : ''),
            title: 'ClawHub 是注册式技能目录，带真实下载 / 安装 / 星标统计',
            onClick: function () {
              if (dSrc === 'clawhub') return;
              setDSrc('clawhub');
              if (!clawItems.length && !clawLoading) loadClaw(clawSort, '');
            },
          },
          'ClawHub 热门',
        ),
      );

      const CLAW_SORTS = [
        ['downloads', '按下载量'],
        ['installs', '按安装量'],
        ['stars', '按星标'],
        ['updated', '按最近更新'],
      ];

      const ghChips = h(
          'div',
          { className: 'sh-chips' },
          srcChips,
          h(
            'div',
            { className: 'sh-modes' },
            h(
              'div',
              {
                className: 'sh-chip' + (dMode === 'skills' ? ' on' : ''),
                onClick: function () {
                  if (dMode === 'skills') return;
                  setDMode('skills');
                  runSearch('', dCat, 'skills');
                },
              },
              '按技能',
            ),
            h(
              'div',
              {
                className: 'sh-chip' + (dMode === 'repos' ? ' on' : ''),
                onClick: function () {
                  if (dMode === 'repos') return;
                  setDMode('repos');
                  runSearch('', dCat, 'repos');
                },
              },
              '按仓库',
            ),
          ),
          h(
            'select',
            {
              className: 'sh-sort',
              value: dSort,
              onChange: function (ev) {
                setDSort(ev.target.value);
              },
            },
            [
              ['default', '默认相关度'],
              ['stars', '按星标'],
              ['forks', '按 Fork'],
              ['updated', '按最近更新'],
              ['name', '按名称'],
            ].map(function (opt) {
              return h('option', { key: opt[0], value: opt[0] }, opt[1]);
            }),
          ),
          dSort !== 'default'
            ? h(
                'span',
                { className: 'sh-sort-hint' },
                dNoMeta
                  ? '匿名模式拿不到星标数据，填 Token 后可按星标排序'
                  : dMode === 'repos'
                    ? '服务端排序：' + dSorted.length + ' 条'
                    : '当前 ' + dItems.length + ' 条结果内排序',
              )
            : null,
          D_CATS.map(function (c) {
            return h(
              'div',
              {
                key: c.id,
                className: 'sh-chip' + (dCat === c.id ? ' on' : ''),
                onClick: function () {
                  setDCat(c.id);
                  runSearch('', c.id);
                },
              },
              c.label,
            );
          }),
        );

      const clawChips = h(
        'div',
        { className: 'sh-chips' },
        srcChips,
        h(
          'span',
          { className: 'sh-sort-hint' },
          'ClawHub 目录按真实统计排序（约 30 条一页，可加载更多）',
        ),
        CLAW_SORTS.map(function (s) {
          return h(
            'div',
            {
              key: s[0],
              className: 'sh-chip' + (clawSort === s[0] ? ' on' : ''),
              onClick: function () {
                setClawSort(s[0]);
                loadClaw(s[0], '');
              },
            },
            s[1],
          );
        }),
      );

      const clawRows = clawItems.map(function (item) {
        const tag = 'clawhub:' + item.owner + '/' + item.slug;
        return h(
          'div',
          { key: item.key, className: 'sh-row', title: item.owner + '/' + item.slug },
          h(
            'div',
            { className: 'sh-row-h' },
            h(
              'div',
              { className: 'sh-row-t' },
              h('span', { className: 'sh-row-name' }, item.name),
              h(
                'div',
                { className: 'sh-row-b' },
                h('span', { className: 'sh-badge' }, item.owner + '/' + item.slug),
                item.downloads ? h('span', { className: 'sh-badge' }, '↓ ' + item.downloads.toLocaleString()) : null,
                item.installs ? h('span', { className: 'sh-badge' }, '⤓ ' + item.installs.toLocaleString()) : null,
                item.stars ? h('span', { className: 'sh-badge' }, '★ ' + item.stars.toLocaleString()) : null,
              ),
            ),
            h(
              'button',
              {
                className: 'sh-act',
                disabled: installing === tag,
                onClick: function (ev) {
                  ev.stopPropagation();
                  openClawPrev(item);
                },
              },
              installing === tag ? '安装中…' : '预览 / 安装',
            ),
          ),
          h('div', { className: 'sh-row-d' }, zhOf(item.description) || '（无描述）'),
          h('div', { className: 'sh-row-m' }, item.url + (item.version ? '  · v' + item.version : '')),
        );
      });

      const discoverList = h(
        'div',
        { className: 'sh-list' },
        dSrc === 'github' && gh && !gh.hasToken ?
          h(
                        'div',
                        { className: 'sh-note' },
                        h('span', null, '匿名模式：每小时 60 次请求，搜索 10 次/分钟。填个自己的 Token 就宽裕了。'),
                        h(
                          'button',
                          {
                            className: 'sh-btn',
                            onClick: function () {
                              setGhOpen(!ghOpen);
                            },
                          },
                          ghOpen ? '收起' : '填写 Token',
                        ),
                        ghOpen
                          ? h(
                              'div',
                              { className: 'sh-note-row' },
                              h('input', {
                                className: 'sh-input',
                                placeholder: 'ghp_… / github_pat_…（只存在本机）',
                                value: ghInput,
                                onChange: function (ev) {
                                  setGhInput(ev.target.value);
                                },
                              }),
                              h(
                                'button',
                                {
                                  className: 'sh-btn on',
                                  disabled: ghBusy,
                                  onClick: saveGhToken,
                                },
                                ghBusy ? '保存中…' : '保存',
                              ),
                            )
                          : null,
                      )
                    : null,
        dSrc === 'github' ? ghChips : clawChips,
        dSrc === 'clawhub'
          ? [
              clawLoading && !clawItems.length
                ? h('div', { className: 'sh-empty' }, '读取 ClawHub…')
                : null,
              !clawLoading && clawErr ? h('div', { className: 'sh-empty sh-err' }, clawErr) : null,
              !clawLoading && !clawErr && !clawItems.length
                ? h('div', { className: 'sh-empty' }, '没有结果，换个关键词或分类试试')
                : null,
              clawRows,
              clawItems.length && clawCursor && !String(query || '').trim()
                ? h(
                    'div',
                    { className: 'sh-more' },
                    h(
                      'button',
                      {
                        className: 'sh-btn',
                        disabled: clawLoading,
                        onClick: function () {
                          loadClaw(clawSort, '', true);
                        },
                      },
                      clawLoading ? '加载中…' : '加载更多',
                    ),
                  )
                : null,
            ]
          : [
                dLoading ? h('div', { className: 'sh-empty' }, '搜索中…') : null,
                !dLoading && dErr ? h('div', { className: 'sh-empty sh-err' }, dErr) : null,
                !dLoading && !dErr && !dItems.length
                  ? h('div', { className: 'sh-empty' }, '没有结果，换个关键词或分类试试')
                  : null,
                dMode === 'skills'
                  ? dSorted.map(function (item) {
                      return h(
                        'div',
                        { key: item.key, className: 'sh-row', title: item.repo + '/' + item.path },
                        h(
                          'div',
                          { className: 'sh-row-h' },
                          h(
                            'div',
                            { className: 'sh-row-t' },
                            h('span', { className: 'sh-row-name' }, item.name),
                            h(
                              'div',
                              { className: 'sh-row-b' },
                              h('span', { className: 'sh-badge' }, item.repo),
                              item.stars
                                ? h('span', { className: 'sh-badge' }, '★ ' + item.stars)
                                : dMeta[item.repo]
                                  ? h('span', { className: 'sh-badge' }, '★ ' + dMeta[item.repo].stars)
                                  : null,
                              item.language ? h('span', { className: 'sh-badge' }, item.language) : null,
                            ),
                          ),
                          h(
                            'button',
                            {
                              className: 'sh-act',
                              onClick: function (ev) {
                                ev.stopPropagation();
                                openPreview({ path: item.path, name: item.name, size: 0 }, item.repo, '');
                              },
                            },
                            '预览 / 安装',
                          ),
                        ),
                        h('div', { className: 'sh-row-d' }, zhOf(item.description) || item.path),
                        h('div', { className: 'sh-row-m' }, item.path),
                      );
                    })
                  : dSorted.map(function (item) {
                  return h(
                    'div',
                    {
                      key: item.repo,
                      className: 'sh-row' + (repoSel && repoSel.repo === item.repo ? ' on' : ''),
                      onClick: function () {
                        openRepo(item);
                      },
                    },
                    h(
                      'div',
                      { className: 'sh-row-h' },
                      h(
                        'div',
                        { className: 'sh-row-t' },
                        h('span', { className: 'sh-row-name', title: item.repo }, item.repo),
                        h(
                          'div',
                          { className: 'sh-row-b' },
                          h('span', { className: 'sh-badge' }, '★ ' + item.stars),
                          item.language ? h('span', { className: 'sh-badge' }, item.language) : null,
                          h('span', { className: 'sh-badge' }, String(item.updated || '').slice(0, 10)),
                        ),
                      ),
                    ),
                    h('div', { className: 'sh-row-d' }, zhOf(item.description) || '（无描述）'),
                    h('div', { className: 'sh-row-m', title: item.url }, item.url),
                  );
                }),
            ],
      );
      const discoverSide = h(
        'div',
        { className: 'sh-side' },
        !repoSel
          ? h('div', { className: 'sh-side-empty' }, '左边选一个仓库，这里列出它里面的 SKILL.md。')
          : repoSel.loading
            ? h('div', { className: 'sh-empty' }, '读取仓库…')
            : repoSel.error
              ? h('div', { className: 'sh-empty sh-err' }, repoSel.error)
              : h(
                  'div',
                  { className: 'sh-detail' },
                  h('div', { className: 'sh-d-title' }, repoSel.repo),
                  h(
                    'div',
                    { className: 'sh-d-badges' },
                    h('span', { className: 'sh-badge' }, '★ ' + (repoSel.stars || 0)),
                    h('span', { className: 'sh-badge' }, 'SKILL.md ' + (repoSel.skills || []).length + ' 个'),
                  ),
                  repoSel.item
                    ? h('div', { className: 'sh-d-desc' }, zhOf(repoSel.item.description) || '')
                    : null,
                  h(
                    'div',
                    { className: 'sh-d-k' },
                    (repoSel.skills || []).length ? '仓库里的技能（点一行预览）' : '这个仓库里没有 SKILL.md',
                  ),
                  (repoSel.skills || []).length
                    ? null
                    : h(
                        'div',
                        { className: 'sh-d-empty' },
                        h('div', null, '它是一个索引 / 合集仓库：里面的技能是链接到别的仓库的，本页没法直接安装。'),
                        h(
                          'div',
                          { className: 'sh-d-empty-b' },
                          h(
                            'button',
                            {
                              className: 'sh-btn primary',
                              onClick: function () {
                                openPreview({ path: 'README.md', name: 'README.md', size: 0, isReadme: true });
                              },
                            },
                            '看 README（里面是技能清单）',
                          ),
                          h(
                            'a',
                            {
                              className: 'sh-btn',
                              href: 'https://github.com/' + repoSel.repo,
                              target: '_blank',
                              rel: 'noreferrer',
                            },
                            '在 GitHub 打开',
                          ),
                        ),
                      ),
                  h(
                    'div',
                    { className: 'sh-files' },
                    (repoSel.skills || []).slice(0, 40).map(function (sk) {
                      return h(
                        'div',
                        {
                          key: sk.path,
                          className: 'sh-file',
                          title: sk.path,
                          style: { cursor: 'pointer' },
                          onClick: function () {
                            openPreview(sk);
                          },
                        },
                        h('span', { className: 'sh-file-n' }, sk.name || sk.path),
                        h('span', { className: 'sh-file-s' }, Math.max(1, Math.round((sk.size || 0) / 1024)) + ' KB'),
                      );
                    }),
                  ),
                  (repoSel.skills || []).length
                    ? h('div', { className: 'sh-d-k' }, '安装会把该技能整个目录下载到 ~/.dsh/skills，只读原仓库。')
                    : null,
                ),
      );

      return h(
        'div',
        { className: 'sh-page' },
        h(
          'div',
          { className: 'sh-head' },
          h(
            'div',
            { className: 'sh-head-l' },
            h('div', { className: 'sh-title' }, '技能库'),
            h(
              'div',
              { className: 'sh-sub' },
              '本机扫描到 ' + skills.length + ' 个技能 · ' + experts.length + ' 个专家，导入后即可在对话里使用',
            ),
          ),
          h('input', {
            className: 'sh-search',
            placeholder:
              view !== 'discover'
                ? '搜索名称、描述、路径…'
                : dSrc === 'clawhub'
                  ? '搜索 ClawHub 技能（如 github、pdf），回车搜索…'
                  : '搜索 GitHub 仓库，回车搜索…',
            value: query,
            onChange: function (e) {
              setQuery(e.target.value);
            },
            onKeyDown: function (e) {
              if (e.key === 'Enter' && view === 'discover') {
                if (dSrc === 'clawhub') loadClaw(clawSort, query);
                else runSearch(query);
              }
            },
          }),
          h(
            'select',
            {
              className: 'sh-sort',
              value: sortMode,
              onChange: function (e) { setSortMode(e.target.value); },
              title: '排序方式',
            },
            h('option', { value: 'default' }, '默认排序'),
            h('option', { value: 'name' }, '按名称'),
            h('option', { value: 'size' }, '按大小'),
            h('option', { value: 'recent' }, '最近使用'),
          ),
          h(
            'button',
            {
              className: 'sh-btn' + (zh ? ' on' : ''),
              title: zh ? '当前显示中文翻译，点击看原文' : '把英文简介翻译成中文',
              onClick: function () {
                const next = !zh;
                setZh(next);
                try { localStorage.setItem('skillbox-zh', next ? '1' : '0'); } catch (e) { /* ignore */ }
              },
            },
            zh ? '中文' : '原文',
          ),
          h(
            'button',
            { className: 'sh-btn', onClick: load, title: '重新扫描本机目录' },
            '重新扫描',
          ),
        ),
        h('div', { className: 'sh-body' }, nav, view === 'discover' ? discoverList : list, view === 'discover' ? discoverSide : side),
        h(
          'div',
          { className: 'sh-foot' },
          h('span', null, '导入目录：' + (skillsDir || '~/.dsh/skills')),
          h(
            'span',
            { className: 'sh-upd' },
            h('span', { className: 'sh-ver' }, 'v' + ((upd && upd.current) || version || '0.0.0')),
            h(
              'button',
              {
                className: 'sh-btn',
                disabled: updBusy,
                onClick: function () {
                  checkUpdate({ busy: setUpdBusy, msg: setUpdMsg, upd: setUpd });
                },
              },
              updBusy ? '检查中…' : '检查更新',
            ),
            upd && upd.hasUpdate
              ? h(
                  'button',
                  {
                    className: 'sh-btn primary',
                    disabled: updBusy,
                    title: upd.notes ? String(upd.notes).slice(0, 300) : '',
                    onClick: function () {
                      applyUpdate({ busy: setUpdBusy, msg: setUpdMsg, upd: setUpd });
                    },
                  },
                  '更新到 v' + upd.latest,
                )
              : null,
            upd && upd.ok && !upd.hasUpdate
              ? h('span', { className: 'sh-upd-ok' }, '已是最新')
              : null,
            upd && upd.url
              ? h(
                  'a',
                  { className: 'sh-upd-link', href: upd.url, target: '_blank', rel: 'noreferrer' },
                  '更新说明',
                )
              : null,
          ),
          updMsg ? h('span', { className: 'sh-upd-msg' }, updMsg) : null,
          h('span', { className: 'sh-foot-r' }, '只读取本机明文文件，不修改来源'),
        ),
        prev
          ? h(
              Overlay,
              null,
              h(
                'div',
                { className: 'sh-modal-mask', onClick: function () { setPrev(null); } },
                h(
                  'div',
                  { className: 'sh-modal sh-prev', onClick: function (e) { e.stopPropagation(); } },
                  h(
                    'div',
                    { className: 'sh-prev-h' },
                    h(
                      'div',
                      { className: 'sh-prev-tt' },
                      h('div', { className: 'sh-prev-name' }, prev.name || 'SKILL.md'),
                      h(
                        'div',
                        { className: 'sh-prev-repo' },
                        prev.src === 'clawhub'
                          ? 'ClawHub · ' + prev.owner + '/' + prev.slug
                          : prev.repo + ' · ' + (prev.branch || 'main'),
                      ),
                    ),
                    h('button', { className: 'sh-x', onClick: function () { setPrev(null); } }, '×'),
                  ),
                  h(
                    'div',
                    { className: 'sh-prev-meta' },
                    h('span', { className: 'sh-badge' }, prev.path),
                    prev.size ? h('span', { className: 'sh-badge' }, Math.max(1, Math.round(prev.size / 1024)) + ' KB') : null,
                    h(
                      'span',
                      { className: 'sh-badge' },
                      installing === (prev.tag || prev.path)
                        ? '安装中…'
                        : prev.src === 'clawhub'
                          ? '来自 ClawHub'
                          : '来自 GitHub',
                    ),
                  ),
                  h(
                    'div',
                    { className: 'sh-prev-b' },
                    prev.loading
                      ? h('div', { className: 'sh-empty' }, '读取中…')
                      : h(
                          'pre',
                          { className: 'sh-full' },
                          String(prev.text || '').slice(0, 800) +
                            (String(prev.text || '').length > 800 ? '\n\n……（只预览前 800 字，安装后可在详情页看全文）' : ''),
                        ),
                  ),
                  h(
                    'div',
                    { className: 'sh-prev-f' },
                    h(
                      'span',
                      { className: 'sh-prev-tip' },
                      prev.src === 'clawhub'
                        ? '安装会把该技能整个包下载到 ~/.dsh/skills，不改动 ClawHub 上的原技能'
                        : '安装会把该技能整个目录下载到 ~/.dsh/skills，不改动原仓库',
                    ),
                    h('span', { className: 'sh-prev-w' }),
                    h(
                      'a',
                      {
                        className: 'sh-btn',
                        href:
                          prev.src === 'clawhub'
                            ? 'https://clawhub.ai/' + prev.owner + '/' + prev.slug
                            : 'https://github.com/' + prev.repo + '/blob/' + (prev.branch || 'main') + '/' + prev.path,
                        target: '_blank',
                        rel: 'noreferrer',
                      },
                      prev.src === 'clawhub' ? '在 ClawHub 打开' : '在 GitHub 打开',
                    ),
                    prev.isReadme
                      ? h('span', { className: 'sh-badge' }, 'README 不能安装')
                      : h(
                          'button',
                          {
                            className: 'sh-btn primary',
                            disabled: prev.loading || Boolean(installing),
                            onClick:
                              prev.src === 'clawhub'
                                ? function () {
                                    installClaw(prev.item);
                                  }
                                : installFromGitHub,
                          },
                          installing ? '安装中…' : '安装到技能库',
                        ),
                  ),
                ),
              ),
            )
          : null,
        fullOpen
          ? h(
              Overlay,
              null,
              h(
                'div',
                {
                  className: 'sh-modal-mask',
                  onClick: function () { setFullOpen(false); },
                  onKeyDown: function (e) { if (e.key === 'Escape') setFullOpen(false); },
                },
                h(
                  'div',
                  { className: 'sh-modal', onClick: function (e) { e.stopPropagation(); } },
                  h(
                    'div',
                    { className: 'sh-modal-h' },
                    h('span', { className: 'sh-modal-t' }, (detail && detail.mainRel) || 'SKILL.md'),
                    h(
                      'button',
                      { className: 'sh-btn', onClick: function () { setFullOpen(false); } },
                      '关闭',
                    ),
                  ),
                  h(
                    'div',
                    { className: 'sh-modal-b' },
                    fullLoading ? h('div', { className: 'sh-empty' }, '读取中…') : h('pre', { className: 'sh-full' }, fullText),
                  ),
                ),
              ),
            )
          : null,
        toast ? h('div', { className: 'sh-toast' }, toast) : null,
      );
    }

    // 专家头像条：在每轮助手回复的第一段之前，插一条「头像 + 名字」。
    // DSH 没有“助手消息头”槽位，所以用 shell.overlay 挂一个不可见组件，
    // 靠 MutationObserver 把节点插进 conversation.chat.flow（按 data-skhub 幂等）。
    // 归属来自 selection 历史 [{key, sinceTurn}]：第 T 轮显示 sinceTurn ≤ T 的最后一次选择。
    var expertStore = { sessionId: '', history: [], briefs: {}, listeners: [] };

    function publishExpert(next) {
      if (!next) return;
      if (next.sessionId !== undefined) expertStore.sessionId = next.sessionId;
      if (next.history) expertStore.history = next.history;
      if (next.briefs) expertStore.briefs = next.briefs;
      var ls = expertStore.listeners.slice();
      for (var i = 0; i < ls.length; i += 1) {
        try {
          ls[i]();
        } catch (error) {
          /* 单个订阅失败不影响其它 */
        }
      }
    }

    // 当前聊天区最大轮次 + 1：用来标记“从下一轮开始生效”。
    function nextTurnIndex() {
      var max = 0;
      var els = document.querySelectorAll('[data-chat-anchor-key]');
      for (var i = 0; i < els.length; i += 1) {
        var key = els[i].getAttribute('data-chat-anchor-key') || '';
        var m = /(?:assistant-step|turn-tail|turn-process)(\d+)/.exec(key);
        if (!m) continue;
        var n = parseInt(m[1], 10);
        if (n > max) max = n;
      }
      return max + 1;
    }

    function entryForTurn(history, turn) {
      var best = null;
      for (var i = 0; i < history.length; i += 1) {
        var e = history[i];
        if (!e || typeof e.sinceTurn !== 'number') continue;
        if (e.sinceTurn > turn) continue;
        if (!best || e.sinceTurn >= best.sinceTurn) best = e;
      }
      return best;
    }

    function AssistantHeader() {
      var state = React.useState(0);
      var tick = state[0];
      var setTick = state[1];

      React.useEffect(function () {
        function sync() {
          setTick(function (v) {
            return v + 1;
          });
        }
        expertStore.listeners.push(sync);
        return function () {
          var at = expertStore.listeners.indexOf(sync);
          if (at >= 0) expertStore.listeners.splice(at, 1);
        };
      }, []);

      React.useEffect(
        function () {
          var scheduled = 0;
          var lastSig = null;
          var lastSeenSig = null;
          var lastPageSig = null;
          var lastPostAt = 0;

          function makeHeader(brief, turn) {
            var hdr = document.createElement('div');
            hdr.className = 'sk-hdr';
            hdr.setAttribute('data-skhub', turn);
            hdr.setAttribute('data-skhub-key', brief.key);
            if (brief.hasAvatar) {
              var im = document.createElement('img');
              im.className = 'sk-hdr-ava';
              im.src = '/skillbox/avatar?key=' + encodeURIComponent(brief.key);
              im.alt = '';
              im.draggable = false;
              hdr.appendChild(im);
            } else {
              var ph = document.createElement('div');
              ph.className = 'sk-hdr-ph';
              ph.textContent = String(brief.title || '?').slice(0, 1);
              hdr.appendChild(ph);
            }
            var nm = document.createElement('span');
            nm.className = 'sk-hdr-name';
            nm.textContent = brief.title || '专家';
            hdr.appendChild(nm);
            if (brief.profession) {
              var pf = document.createElement('span');
              pf.className = 'sk-hdr-prof';
              pf.textContent = brief.profession;
              hdr.appendChild(pf);
            }
            return hdr;
          }

          function describe() {
            var nodes = document.querySelectorAll('.sk-hdr');
            var parts = [];
            for (var i = 0; i < nodes.length; i += 1) {
              parts.push(nodes[i].getAttribute('data-skhub') + '=' + nodes[i].getAttribute('data-skhub-key'));
            }
            return parts;
          }

          function postReport(parts, meta) {
            var pageRect = null;
            var bigImgs = [];
            try {
              var all = document.querySelectorAll('img');
              for (var ai = 0; ai < all.length && bigImgs.length < 6; ai += 1) {
                var rb = all[ai].getBoundingClientRect();
                if (rb.width > 120 || rb.height > 120) {
                  var pcls = all[ai].parentElement && all[ai].parentElement.className;
                  bigImgs.push({
                    w: Math.round(rb.width),
                    h: Math.round(rb.height),
                    nw: all[ai].naturalWidth,
                    src: String(all[ai].getAttribute('src') || '').slice(0, 80),
                    pc: String(pcls || '').slice(0, 60),
                  });
                }
              }
            } catch (error) {
              bigImgs = [];
            }
            try {
              var pg = document.querySelector('.sh-page');
              if (pg) {
                var r = pg.getBoundingClientRect();
                pageRect = {
                  w: Math.round(r.width),
                  h: Math.round(r.height),
                  rows: document.querySelectorAll('.sh-row').length,
                  nav: document.querySelectorAll('.sh-nav-i').length,
                  cols: (function () {
                    const rs = document.querySelectorAll('.sh-row');
                    if (!rs.length) return 0;
                    const top = rs[0].offsetTop;
                    let c = 0;
                    for (let i = 0; i < rs.length; i += 1) if (rs[i].offsetTop === top) c += 1;
                    return c;
                  })(),
                };
              }
            } catch (error) {
              pageRect = null;
            }
            try {
              fetch('/skillbox/report', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                  at: new Date().toISOString(),
                  event: 'headers',
                  count: parts.length,
                  history: expertStore.history,
                  hosts: meta ? meta.hosts : undefined,
                  briefs: Object.keys(expertStore.briefs).length,
                  sessionId: expertStore.sessionId,
                  seen: meta ? meta.seen : undefined,
                  slots: meta ? meta.slots : undefined,
                  noKey: meta ? meta.noKey : undefined,
                  page: pageRect,
                  imgs: bigImgs,
                  turns: parts.slice(0, 40),
                }),
              }).catch(function () {});
            } catch (error) {
              /* 上报失败不影响渲染 */
            }
          }

          function paint() {
            var hosts = document.querySelectorAll('[data-slot="conversation.chat.flow"]');
            var allTurns = [];
            var hostCount = hosts.length;
            var maxTurn = 0;
            for (var hi = 0; hi < hosts.length; hi += 1) {
              var kids = hosts[hi].children;
              var seen = {};
              for (var i = 0; i < kids.length; i += 1) {
                var el = kids[i];
                var flowKey = el.getAttribute && el.getAttribute('data-chat-anchor-key');
                if (!flowKey) continue;
                allTurns.push(String(flowKey).slice(0, 34));
                var m = /assistant-step(\d+):/.exec(flowKey);
                if (!m) continue;
                var turn = m[1];
                if (seen[turn]) continue;
                seen[turn] = 1;
                if (Number(turn) > maxTurn) maxTurn = Number(turn);
                var entry = entryForTurn(expertStore.history, Number(turn));
                var brief = entry && entry.key ? expertStore.briefs[entry.key] || null : null;
                var existing = hosts[hi].querySelector('[data-skhub="' + turn + '"]');
                if (!brief) {
                  if (existing) existing.parentNode.removeChild(existing);
                  continue;
                }
                if (existing && existing.getAttribute('data-skhub-key') !== brief.key) {
                  existing.parentNode.removeChild(existing);
                  existing = null;
                }
                if (!existing) {
                  el.parentNode.insertBefore(makeHeader(brief, turn), el);
                } else {
                  var nmEl = existing.querySelector('.sk-hdr-name');
                  if (nmEl) nmEl.textContent = brief.title || '专家';
                }
              }
            }
            var slots = [];
            var slotEls = document.querySelectorAll('[data-slot]');
            for (var si = 0; si < slotEls.length; si += 1) {
              var sn = slotEls[si].getAttribute('data-slot');
              if (slots.indexOf(sn) < 0) slots.push(sn);
            }
            var noKey = [];
            var hostEls = document.querySelectorAll('[data-slot="conversation.chat.flow"]');
            for (var hk = 0; hk < hostEls.length; hk += 1) {
              var ck = hostEls[hk].children;
              for (var ci = 0; ci < ck.length; ci += 1) {
                if (!ck[ci].getAttribute('data-chat-anchor-key')) {
                  noKey.push(String(ck[ci].className).slice(0, 40));
                }
              }
            }
            for (var rh = 0; rh < hosts.length; rh += 1) {
              var runEl = null;
              var rk = hosts[rh].children;
              for (var ri = 0; ri < rk.length; ri += 1) {
                if (!rk[ri].getAttribute('data-chat-anchor-key') && String(rk[ri].className).indexOf('running') >= 0) {
                  runEl = rk[ri];
                  break;
                }
              }
              if (!runEl) continue;
              var runTurn = String(maxTurn + 1);
              var runEntry = entryForTurn(expertStore.history, Number(runTurn));
              var runBrief = runEntry && runEntry.key ? expertStore.briefs[runEntry.key] || null : null;
              var runHdr = hosts[rh].querySelector('[data-skhub="' + runTurn + '"]');
              if (!runBrief) {
                if (runHdr) runHdr.parentNode.removeChild(runHdr);
                continue;
              }
              if (runHdr && runHdr.getAttribute('data-skhub-key') !== runBrief.key) {
                runHdr.parentNode.removeChild(runHdr);
                runHdr = null;
              }
              if (!runHdr) runEl.parentNode.insertBefore(makeHeader(runBrief, runTurn), runEl);
            }
            var parts = describe();
            var sig = parts.join('|');
            var seenSig = allTurns.join('|');
            var pageEl = document.querySelector('.sh-page');
            var pageSig = pageEl ? 'page:' + Math.round(pageEl.getBoundingClientRect().width) + 'x' + Math.round(pageEl.getBoundingClientRect().height) : 'nopage';
            var stale = Date.now() - lastPostAt > 8000;
            if (sig !== lastSig || seenSig !== lastSeenSig || pageSig !== lastPageSig || stale) {
              lastSig = sig;
              lastSeenSig = seenSig;
              lastPageSig = pageSig;
              lastPostAt = Date.now();
              postReport(parts, { hosts: hostCount, seen: allTurns.slice(0, 40), slots: slots.slice(0, 60), noKey: noKey.slice(0, 20) });
            }
          }

          function schedule() {
            if (scheduled) return;
            scheduled = setTimeout(function () {
              scheduled = 0;
              try {
                paint();
              } catch (error) {
                /* 容器还在挂载中，下一轮再说 */
              }
            }, 180);
          }

          paint();
          var beat = setInterval(schedule, 1500);
          var mo = new MutationObserver(schedule);
          mo.observe(document.body, { childList: true, subtree: true });
          return function () {
            mo.disconnect();
            clearInterval(beat);
            if (scheduled) clearTimeout(scheduled);
          };
        },
        [tick],
      );

      return null;
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        ctx.slots.inject('shell.overlay', function () {
          return ctx.slots.register({ name: 'shell.overlay', id: 'skillbox-header', order: 998 }, AssistantHeader);
        });
        ctx.slots.inject('sidebar.panellist', function () {
          return ctx.slots.register(
            { name: 'sidebar.panellist', id: 'skillbox', order: 20, label: '技能库' },
            SkillHubIcon,
          );
        });
        ctx.slots.inject('main', function () {
          return ctx.slots.register({ name: 'main', key: 'skillbox' }, SkillHubPage);
        });
        ctx.slots.inject('conversation.composer.dock', function () {
          return ctx.slots.register({ name: 'conversation.composer.dock', id: 'skillbox-expert', order: 2 }, ExpertChip);
        });
        // 排查用：存在 ~/.dsh/skillbox-autoselect.json {on:true} 时，加载后自动切到技能库面板。
        try {
          var autoTries = 0;
          var autoTimer = setInterval(function () {
            autoTries += 1;
            if (autoTries > 12) {
              clearInterval(autoTimer);
              return;
            }
            var layoutApi = null;
            try {
              layoutApi = ctx.get('layout');
            } catch (err0) {
              layoutApi = null;
            }
            fetch('/skillbox/autoselect')
              .then(function (r) {
                return r.json();
              })
              .then(function (j) {
                if (j && j.on && layoutApi && typeof layoutApi.selectPanel === 'function') {
                  clearInterval(autoTimer);
                  try {
                    layoutApi.selectPanel('skillbox');
                  } catch (err) {
                    /* ???? */
                  }
                }
              })
              .catch(function () {});
          }, 2000);
        } catch (error) {
          /* 自动跳转只用于自检 */
        }
      },
    };
  },
});

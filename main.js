var BUILD_VERSION = '20260608.19';
var strSyncingFs = 'Syncing FS...';
var strDone = 'Done.';
var strDeleting = 'Deleting...';
var strNoSave = 'Cannot find saved games to download';
var strNoData = 'Error: Game data not loaded!';
var strInit = 'Initializing...';
var strLoading = 'Loading';
var strDelConfirm = "This will DELETE your game data and saved games stored in browser cache. Type 'YES' to continue.";
var strTips = "Bundled data mode: the first run downloads game files from ./data/ into browser cache. Keep this page open until it says Done.";
var strBundledChecking = 'Checking bundled game data...';
var strBundledDownloading = 'Downloading bundled game data';
var strBundledCached = 'Bundled game data is ready.';
var strBundledFailed = 'Failed to install bundled game data. See JavaScript console.';
var strStarting = 'Starting game...';
var strReady = 'Ready.';
var strStartPrompt = 'Click Start Game to begin.';

var userLang = navigator.language || navigator.userLanguage;
if (userLang === 'zh-CN' || userLang.startsWith('zh-Hans') ) {
    strSyncingFs = '正在同步文件系统...';
    strDone = '完成。';
    strDeleting = '正在删除...';
    strNoSave = '无法找到可下载的游戏存档！';
    strNoData = '错误：游戏数据未加载。';
    strInit = '正在初始化...';
    strLoading = '正在加载';
    strDelConfirm = '此操作将删除浏览器缓存中的游戏数据和存档。请输入 "YES" 继续：';
    strTips = '内置数据模式：首次打开会从 ./data/ 自动下载游戏文件到浏览器缓存。显示“完成”前请不要关闭页面。';
    strBundledChecking = '正在检查内置游戏数据...';
    strBundledDownloading = '正在下载内置游戏数据';
    strBundledCached = '内置游戏数据已就绪。';
    strBundledFailed = '安装内置游戏数据失败，请查看浏览器控制台。';
    strStarting = '正在进入游戏...';
    strReady = '准备完成。';
    strStartPrompt = '点击“开始游戏”进入。';
} else if (userLang === 'zh-TW' || userLang.startsWith('zh-Hant') ) {
    strSyncingFs = '正在同步檔案系統...';
    strDone = '完成。';
    strDeleting = '正在刪除...';
    strNoSave = '無法找到可下載的遊戲記錄！';
    strNoData = '錯誤：遊戲資料尚未載入。';
    strInit = '正在初始化...';
    strLoading = '正在加載';
    strDelConfirm = '此操作將刪除瀏覽器快取中的遊戲資料和記錄。請輸入 "YES" 繼續：';
    strTips = '內建資料模式：首次開啟會從 ./data/ 自動下載遊戲檔案到瀏覽器快取。顯示「完成」前請勿關閉頁面。';
    strBundledChecking = '正在檢查內建遊戲資料...';
    strBundledDownloading = '正在下載內建遊戲資料';
    strBundledCached = '內建遊戲資料已就緒。';
    strBundledFailed = '安裝內建遊戲資料失敗，請查看瀏覽器主控台。';
    strStarting = '正在進入遊戲...';
    strReady = '準備完成。';
    strStartPrompt = '點擊「開始遊戲」進入。';
}

var statusElement = document.getElementById('status');
var progressElement = document.getElementById('progress');
var spinnerElement = document.getElementById('spinner');
var tipsElement;
var loadingElement = document.getElementById('loadingScreen');
var startButtonElement = document.getElementById('btnStartGame');
var installPromise = null;
var gameStarted = false;
var audioUnlocked = false;
var audioContexts = [];

(function installAudioContextUnlockHook() {
    var NativeAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!NativeAudioContext) return;
    function WrappedAudioContext() {
        var ctx = new (Function.prototype.bind.apply(NativeAudioContext, [null].concat(Array.prototype.slice.call(arguments))))();
        audioContexts.push(ctx);
        if (audioUnlocked) window.setTimeout(resumeAudioContexts, 0);
        return ctx;
    }
    WrappedAudioContext.prototype = NativeAudioContext.prototype;
    Object.setPrototypeOf && Object.setPrototypeOf(WrappedAudioContext, NativeAudioContext);

    window.AudioContext = WrappedAudioContext;
    window.webkitAudioContext = WrappedAudioContext;
})();

function isIOSAudioDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function resumeAudioContexts() {
    audioUnlocked = true;
    for (var i = 0; i < audioContexts.length; i++) {
        var ctx = audioContexts[i];
        try {
            if (ctx && ctx.state === 'suspended') ctx.resume();
            /*
             * After iOS backgrounds a page, a resume() alone sometimes leaves
             * the output graph idle until a node is started again.  Start a
             * one-sample silent source to kick the audio session without
             * adding audible sound.
             */
            if (ctx && ctx.state === 'running' && isIOSAudioDevice()) {
                var buffer = ctx.createBuffer(1, 1, 22050);
                var source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                source.start(0);
            }
        } catch (e) {}
    }
}

function unlockAudioForIOS() {
    audioUnlocked = true;
    resumeAudioContexts();
}


['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click'].forEach(function(type) {
    window.addEventListener(type, unlockAudioForIOS, {capture: true, passive: true});
});

['focus', 'pageshow'].forEach(function(type) {
    window.addEventListener(type, function() {
        if (!audioUnlocked) return;
        resumeAudioContexts();
        window.setTimeout(resumeAudioContexts, 250);
        window.setTimeout(resumeAudioContexts, 1000);
    });
});

document.addEventListener('visibilitychange', function() {
    if (!document.hidden && audioUnlocked) {
        resumeAudioContexts();
        window.setTimeout(resumeAudioContexts, 250);
        window.setTimeout(resumeAudioContexts, 1000);
    }
});

window.addEventListener('load', function () {
    tipsElement = document.getElementById('tips');
    if (tipsElement) tipsElement.textContent = strTips;
});

var Module = {
    preRun: [],
    postRun: [],
    print: function(text) { console.log(text); },
    printErr: function(text) { console.error(text); },
    locateFile: function(path) {
        return path === 'sdlpal.wasm' ? 'sdlpal.wasm?v=20260608.19' : path;
    },
    canvas: (function() {
        var canvas = document.getElementById('canvas');
        canvas.addEventListener('webglcontextlost', function(e) {
            alert('WebGL context lost. You will need to reload the page.');
            e.preventDefault();
        }, false);
        return canvas;
    })(),
    setStatus: function(text) {
        if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
        if (text === Module.setStatus.last.text) return;
        var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
        var now = Date.now();
        if (m && now - Module.setStatus.last.time < 30) return;
        Module.setStatus.last.time = now;
        Module.setStatus.last.text = text;
        if (m) {
            text = m[1];
            progressElement.value = parseInt(m[2]) * 100;
            progressElement.max = parseInt(m[4]) * 100;
            progressElement.hidden = false;
            spinnerElement.hidden = false;
        } else {
            progressElement.value = null;
            progressElement.max = null;
            progressElement.hidden = true;
            if (!text) spinnerElement.style.display = 'none';
        }
        statusElement.innerHTML = text;
    },
    totalDependencies: 0,
    monitorRunDependencies: function(left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    },
    onRuntimeInitialized:function() { onRuntimeInitialized(); }
};

function onRuntimeInitialized() {
    try { FS.mkdir('/data'); } catch (e) {}
    FS.mount(IDBFS, {}, '/data');
    Module.setStatus(strSyncingFs);
    spinnerElement.style.display = 'inline-block';
    FS.syncfs(true, function (err) {
        if (err) Module.printErr(err);
        installBundledDataIfNeeded(false).then(function() {
            showStartButton();
        }).catch(function(e) {
            Module.printErr(e && e.stack ? e.stack : e);
            Module.setStatus(strBundledFailed);
            spinnerElement.style.display = 'none';
        });
    });
}

function hideLoadingScreen() {
    if (loadingElement) loadingElement.classList.add('hidden');
}

function showStartButton() {
    Module.setStatus(strReady);
    spinnerElement.style.display = 'none';
    progressElement.hidden = true;
    if (startButtonElement) {
        startButtonElement.style.display = 'inline-block';
        startButtonElement.disabled = false;
        startButtonElement.focus();
    }
    if (tipsElement) tipsElement.textContent = strStartPrompt;
}

function mkdirp(path) {
    var parts = path.split('/').filter(Boolean);
    var cur = '';
    for (var i = 0; i < parts.length; i++) {
        cur += '/' + parts[i];
        try { FS.mkdir(cur); } catch (e) {}
    }
}

function fileExists(path) {
    try { return FS.stat(path).size >= 0; } catch (e) { return false; }
}

function readTextIfExists(path) {
    try { return FS.readFile(path, {encoding: 'utf8'}); } catch (e) { return null; }
}

function dataUrl(path, version) {
    var url = 'data/' + path.split('/').map(encodeURIComponent).join('/');
    return version ? url + '?v=' + encodeURIComponent(version) : url;
}

function syncfsPromise(populate) {
    return new Promise(function(resolve, reject) {
        FS.syncfs(!!populate, function(err) { err ? reject(err) : resolve(); });
    });
}

async function fetchArrayBufferWithProgress(url, label, startBytes, totalBytes) {
    var response = await fetch(url, {cache: 'no-store'});
    if (!response.ok) throw new Error('HTTP ' + response.status + ' for ' + url);

    var contentLength = parseInt(response.headers.get('content-length') || '0');
    if (!response.body || !contentLength) {
        return new Uint8Array(await response.arrayBuffer());
    }

    var reader = response.body.getReader();
    var received = 0;
    var chunks = [];
    while (true) {
        var r = await reader.read();
        if (r.done) break;
        chunks.push(r.value);
        received += r.value.length;
        if (totalBytes) {
            Module.setStatus(label + ' (' + (startBytes + received) + '/' + totalBytes + ')');
        }
    }
    var out = new Uint8Array(received);
    var offset = 0;
    for (var i = 0; i < chunks.length; i++) {
        out.set(chunks[i], offset);
        offset += chunks[i].length;
    }
    return out;
}

async function installBundledDataIfNeeded(force) {
    if (installPromise) return installPromise;
    installPromise = (async function() {
        spinnerElement.style.display = 'inline-block';
        Module.setStatus(strBundledChecking);

        var manifestResp = await fetch('data/manifest.json', {cache: 'no-cache'});
        if (!manifestResp.ok) throw new Error('Cannot fetch data/manifest.json');
        var manifest = await manifestResp.json();

        var currentVersion = readTextIfExists('/data/.bundle_version');
        if (!force && currentVersion === manifest.version && fileExists('/data/fbp.mkf')) {
            Module.setStatus(strBundledCached);
            spinnerElement.style.display = 'none';
            return true;
        }

        var doneBytes = 0;
        for (var i = 0; i < manifest.files.length; i++) {
            var f = manifest.files[i];
            var outPath = '/data/' + f.path.toLowerCase();
            var parent = outPath.substring(0, outPath.lastIndexOf('/'));
            if (parent) mkdirp(parent);

            Module.setStatus(strBundledDownloading + ': ' + f.path + ' (' + doneBytes + '/' + manifest.total_size + ')');
            var bytes = await fetchArrayBufferWithProgress(dataUrl(f.path, manifest.version), strBundledDownloading + ': ' + f.path, doneBytes, manifest.total_size);
            if (bytes.length !== f.size) throw new Error('Size mismatch for ' + f.path + ': got ' + bytes.length + ', expected ' + f.size);
            FS.writeFile(outPath, bytes, {encoding: 'binary'});
            doneBytes += bytes.length;
        }

        FS.writeFile('/data/.bundle_version', manifest.version, {encoding: 'utf8'});
        Module.setStatus(strSyncingFs);
        await syncfsPromise(false);
        Module.setStatus(strDone);
        spinnerElement.style.display = 'none';
        return true;
    })();
    try { return await installPromise; }
    finally { installPromise = null; }
}

function loadZip() {
    var fileBtn = document.getElementById('btnLoadZip');
    Module.setStatus(strLoading + ' ' + fileBtn.files[0].name + '...');
    spinnerElement.style.display = 'inline-block';

    var fileInput = document.getElementById('btnLoadZip');
    var zip = new JSZip();
    var file = fileInput.files[0];

    zip.loadAsync(file).then(function(z) {
        var promises = [];
        z.forEach(function(relativePath, zipEntry) {
            if (relativePath.includes('._')) {
                Module.print('ignoring file ' + relativePath);
                return;
            }
            if (zipEntry.dir) {
                mkdirp('/data/' + relativePath.toLowerCase());
            } else {
                promises.push(zipEntry.async('uint8array').then(function(arr) {
                    var outPath = '/data/' + relativePath.toLowerCase();
                    var parent = outPath.substring(0, outPath.lastIndexOf('/'));
                    if (parent) mkdirp(parent);
                    FS.writeFile(outPath, arr, {encoding: 'binary'});
                }));
            }
        });
        Promise.all(promises).then(function() {
            Module.setStatus(strSyncingFs);
            FS.syncfs(function (err) {
                if (err) Module.printErr(err);
                Module.setStatus(strDone);
                spinnerElement.style.display = 'none';
            });
        });
    });
}

function clearData() {
    if (window.prompt(strDelConfirm) === 'YES') {
        var doDelete = function(path) {
            Object.keys(FS.lookupPath(path).node.contents).forEach(function(element) {
                var full = path + '/' + element;
                var stat = FS.stat(full);
                if (stat.mode & 0040000) {
                    doDelete(full);
                    FS.rmdir(full);
                } else {
                    FS.unlink(full);
                }
            });
        };
        Module.setStatus(strDeleting);
        spinnerElement.style.display = 'inline-block';
        doDelete('/data');
        Module.setStatus(strSyncingFs);
        FS.syncfs(false, function (err) {
            if (err) Module.printErr(err);
            spinnerElement.style.display = 'none';
            Module.setStatus(strDone);
        });
    }
}

function downloadSaves() {
    var zip = new JSZip();
    var hasData = false;
    Object.keys(FS.lookupPath('/data').node.contents).forEach(function(element) {
        if (element.endsWith('.rpg')) {
            var array = FS.readFile('/data/' + element);
            zip.file(element, array);
            hasData = true;
        }
    });
    if (!hasData) {
        window.alert(strNoSave);
        return;
    }
    zip.generateAsync({type:'base64'}).then(function (base64) {
        window.location = 'data:application/zip;base64,' + base64;
    }, function (err) { Module.printErr(err); });
}

async function runGame() {
    if (gameStarted) return;
    gameStarted = true;
    var mainFunc = Module.cwrap('EMSCRIPTEN_main', 'number', ['number', 'number'], {async:true});
    try {
        await mainFunc(0, 0);
    } catch (e) {
        /*
         * Asyncify uses an internal "unwind" path when C code waits for
         * browser-side async work, e.g. the MP4 <video> intro.  Some browsers
         * may surface that path through global error/rejection handlers even
         * though it is not a real game error.
         */
        if (e === 'unwind' || (e && e.message === 'unwind')) return;
        Module.printErr(e && e.stack ? e.stack : e);
        Module.setStatus('Exception thrown, see JavaScript console');
        spinnerElement.style.display = 'none';
        throw e;
    }
}

function playIntroVideo(src) {
    return new Promise(function(resolve) {
        var canvas = Module.canvas || document.getElementById('canvas');
        var wrap = document.createElement('div');
        wrap.style.position = 'fixed';
        wrap.style.background = '#000';
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.justifyContent = 'center';
        wrap.style.zIndex = '999';
        wrap.style.overflow = 'hidden';

        function updateBounds() {
            if (canvas) {
                var rect = canvas.getBoundingClientRect();
                wrap.style.left = rect.left + 'px';
                wrap.style.top = rect.top + 'px';
                wrap.style.width = rect.width + 'px';
                wrap.style.height = rect.height + 'px';
            } else {
                wrap.style.left = '0';
                wrap.style.top = '0';
                wrap.style.width = '100vw';
                wrap.style.height = '100vh';
            }
        }

        var video = document.createElement('video');
        video.src = src;
        video.playsInline = true;
        video.autoplay = true;
        video.preload = 'auto';
        video.controls = false;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.background = '#000';
        video.style.imageRendering = 'pixelated';

        var done = false;
        function cleanup() {
            if (done) return;
            done = true;
            window.removeEventListener('resize', updateBounds);
            window.removeEventListener('keydown', skip);
            window.removeEventListener('keyup', skip);
            if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            resolve();
        }
        function skip(e) {
            if (e) e.preventDefault();
            cleanup();
        }

        video.addEventListener('ended', cleanup);
        video.addEventListener('error', function(e) {
            Module.printErr('Intro video failed: ' + src);
            cleanup();
        });
        wrap.addEventListener('click', skip);
        window.addEventListener('keydown', skip);
        window.addEventListener('keyup', skip);
        window.addEventListener('resize', updateBounds);

        wrap.appendChild(video);
        updateBounds();
        document.body.appendChild(wrap);

        var p = video.play();
        if (p && p.catch) p.catch(function(e) {
            Module.printErr('Intro autoplay failed, skipping: ' + src);
            cleanup();
        });
    });
}

async function playIntroSequence() {
    /*
     * Play MP4 intros before entering wasm.  This avoids blocking C with
     * Asyncify while SDL browser callbacks are active.
     */
    await playIntroVideo('data/1.mp4');
    await playIntroVideo('data/2.mp4');
}


var virtualControlsInitialized = false;
var isBattleActiveFunc = null;
var battlePollTimer = null;

function keyInfo(key) {
    var table = {
        'ArrowUp': [38, 'ArrowUp'], 'ArrowDown': [40, 'ArrowDown'],
        'ArrowLeft': [37, 'ArrowLeft'], 'ArrowRight': [39, 'ArrowRight'],
        'Enter': [13, 'Enter'], ' ': [32, 'Space'], 'Escape': [27, 'Escape'],
        'r': [82, 'KeyR'], 'a': [65, 'KeyA'], 'd': [68, 'KeyD'],
        'e': [69, 'KeyE'], 'w': [87, 'KeyW'], 'q': [81, 'KeyQ'],
        'f': [70, 'KeyF'], 's': [83, 'KeyS']
    };
    var v = table[key] || [0, ''];
    return {keyCode: v[0], which: v[0], code: v[1]};
}

function dispatchVirtualKey(key, type) {
    var info = keyInfo(key);
    var ev = new KeyboardEvent(type, {
        key: key,
        code: info.code,
        keyCode: info.keyCode,
        which: info.which,
        bubbles: true,
        cancelable: true
    });
    try { Object.defineProperty(ev, 'keyCode', {get: function(){ return info.keyCode; }}); } catch (e) {}
    try { Object.defineProperty(ev, 'which', {get: function(){ return info.which; }}); } catch (e) {}
    var canvas = Module.canvas || document.getElementById('canvas');
    if (canvas) canvas.dispatchEvent(ev);
    document.dispatchEvent(ev);
    window.dispatchEvent(ev);
}

function initVirtualControls() {
    if (virtualControlsInitialized) return;
    virtualControlsInitialized = true;
    var controls = document.getElementById('mobileControls');
    if (!controls) return;

    controls.querySelectorAll('[data-key]').forEach(function(btn) {
        var key = btn.getAttribute('data-key');
        var pressed = false;
        function down(e) {
            e.preventDefault();
            unlockAudioForIOS();
            if (pressed) return;
            pressed = true;
            btn.classList.add('pressed');
            dispatchVirtualKey(key, 'keydown');
        }
        function up(e) {
            if (e) e.preventDefault();
            if (!pressed) return;
            pressed = false;
            btn.classList.remove('pressed');
            dispatchVirtualKey(key, 'keyup');
        }
        btn.addEventListener('pointerdown', down);
        btn.addEventListener('pointerup', up);
        btn.addEventListener('pointercancel', up);
        btn.addEventListener('pointerleave', up);
        btn.addEventListener('touchstart', function(e){ e.preventDefault(); }, {passive:false});
        btn.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    });

    try {
        isBattleActiveFunc = Module.cwrap('EMSCRIPTEN_is_battle_active', 'number', []);
    } catch (e) {
        isBattleActiveFunc = null;
    }
    battlePollTimer = window.setInterval(updateBattleControls, 400);
    updateBattleControls();
}

function setVirtualControlsVisible(visible) {
    var controls = document.getElementById('mobileControls');
    if (!controls) return;
    initVirtualControls();
    controls.classList.toggle('active', !!visible);
}

function updateBattleControls() {
    var controls = document.getElementById('mobileControls');
    if (!controls || !isBattleActiveFunc || !gameStarted) return;
    var active = false;
    try { active = !!isBattleActiveFunc(); } catch (e) { active = false; }
    controls.classList.toggle('battle-active', active);
}

async function launch() {
    var checkFile = false;
    try {
        if (FS.stat('/data/fbp.mkf').size > 0) checkFile = true;
    } catch (e) {}
    if (!checkFile) {
        try {
            await installBundledDataIfNeeded(true);
            checkFile = FS.stat('/data/fbp.mkf').size > 0;
        } catch (e) {
            Module.printErr(e && e.stack ? e.stack : e);
            Module.setStatus(strNoData);
            return;
        }
    }
    if (!checkFile) {
        Module.setStatus(strNoData);
        return;
    }
    Module.setStatus(strStarting);
    spinnerElement.style.display = 'none';
    if (startButtonElement) startButtonElement.style.display = 'none';
    var deleteButton = document.getElementById('btnDeleteData');
    if (deleteButton) deleteButton.style.display = 'none';
    hideLoadingScreen();
    unlockAudioForIOS();
    if (isIOSAudioDevice()) {
        /*
         * iOS Safari is strict: the SDL WebAudio graph must be created in the
         * original tap/click gesture.  Playing the MP4 intro before/over the
         * game can steal or suspend the audio session on iPhone, so iOS skips
         * the JS intro and enters the game immediately.
         */
        setVirtualControlsVisible(true);
        runGame();
        window.setTimeout(resumeAudioContexts, 0);
        window.setTimeout(resumeAudioContexts, 300);
        window.setTimeout(resumeAudioContexts, 1000);
        return;
    }
    await playIntroSequence();
    unlockAudioForIOS();
    setVirtualControlsVisible(true);
    runGame();
    window.setTimeout(resumeAudioContexts, 0);
    window.setTimeout(resumeAudioContexts, 500);
}

Module.setStatus(strInit);
window.onerror = function(message, source, lineno, colno, error) {
    if (message === 'unwind' || error === 'unwind' || (error && error.message === 'unwind')) {
        return true;
    }
    Module.setStatus('Exception thrown, see JavaScript console');
    spinnerElement.style.display = 'none';
    Module.setStatus = function(text) {
        if (text) Module.printErr('[post-exception status] ' + text);
    };
};
window.onunhandledrejection = function(event) {
    var reason = event && event.reason;
    if (reason === 'unwind' || (reason && reason.message === 'unwind')) {
        event.preventDefault();
        return;
    }
    Module.printErr(reason && reason.stack ? reason.stack : reason);
    Module.setStatus('Exception thrown, see JavaScript console');
    spinnerElement.style.display = 'none';
};

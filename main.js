var BUILD_VERSION = '20260610.28';
var APP_TITLE = '真·仙剑奇侠传 ' + BUILD_VERSION;
function forceMediaTitle() {
    try {
        if ('mediaSession' in navigator && typeof MediaMetadata !== 'undefined') {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: APP_TITLE,
                artist: '真·仙剑奇侠传',
                album: 'Web Edition',
                artwork: [{ src: 'icon.png', sizes: '512x512', type: 'image/png' }]
            });
        }
    } catch (e) {}
}
function forceDocumentTitle() {
    try {
        document.title = APP_TITLE;
    } catch (e) {}
    forceMediaTitle();
}

function isMobileLike() {
    try {
        return /iphone|ipad|ipod|android|mobile/i.test(navigator.userAgent || '') || Math.min(window.innerWidth || 9999, window.innerHeight || 9999) < 700;
    } catch (e) { return false; }
}

function formatErrorForUser(e) {
    if (!e) return '';
    var text = '';
    if (typeof e === 'string') text = e;
    else if (e.stack) text = e.stack;
    else if (e.message) text = e.message;
    else text = String(e);
    text = text.replace(/https:\/\/krysof\.github\.io\/sdlpal-web\//g, '');
    return text;
}

function showErrorDetails(e, prefix) {
    if (!errorDetailsElement) errorDetailsElement = document.getElementById('errorDetails');
    if (!errorDetailsElement) return;
    var text = formatErrorForUser(e);
    if (!text) return;
    if (prefix) text = prefix + '\n' + text;
    errorDetailsElement.textContent = text;
    errorDetailsElement.style.display = 'block';
}

function clearErrorDetails() {
    if (!errorDetailsElement) errorDetailsElement = document.getElementById('errorDetails');
    if (!errorDetailsElement) return;
    errorDetailsElement.textContent = '';
    errorDetailsElement.style.display = 'none';
}
window.SDLPAL_forceTitle = forceDocumentTitle;
forceDocumentTitle();
window.setInterval(forceDocumentTitle, 1000);
['visibilitychange', 'pageshow', 'focus', 'load'].forEach(function(type) {
    window.addEventListener(type, forceDocumentTitle, true);
});
var strSyncingFs = 'Syncing FS...';
var strDone = 'Done.';
var strDeleting = 'Deleting...';
var strNoSave = 'Cannot find saved games to download';
var strImportNoSave = 'No save files found in ZIP.';
var strImportDone = 'Save files imported.';
var strNoData = 'Error: Game data not loaded!';
var strInit = 'Initializing...';
var strLoading = 'Loading';
var strDelConfirm = "This will CLEAR ALL game data, including saved games. This cannot be undone. Type 'YES' to continue.";
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
    strSyncingFs = '正在同步檔案系統...';
    strDone = '完成。';
    strDeleting = '正在刪除...';
    strNoSave = '無法找到可下載的遊戲記錄！';
    strImportNoSave = 'ZIP 內沒有找到記錄檔。';
    strImportDone = '記錄已上傳。';
    strNoData = '錯誤：遊戲資料尚未載入。';
    strInit = '正在初始化...';
    strLoading = '正在加載';
    strDelConfirm = '此操作會清除包含存檔在內的所有遊戲資料，且無法復原。請輸入 "YES" 繼續：';
    strTips = '內建資料模式：首次開啟會從 ./data/ 自動下載遊戲檔案到瀏覽器快取。顯示「完成」前請勿關閉頁面。';
    strBundledChecking = '正在檢查內建遊戲資料...';
    strBundledDownloading = '正在下載內建遊戲資料';
    strBundledCached = '內建遊戲資料已就緒。';
    strBundledFailed = '安裝內建遊戲資料失敗，請查看瀏覽器主控台。';
    strStarting = '正在進入遊戲...';
    strReady = '準備完成。';
    strStartPrompt = '點擊「開始遊戲」進入。';
} else if (userLang === 'zh-TW' || userLang.startsWith('zh-Hant') ) {
    strSyncingFs = '正在同步檔案系統...';
    strDone = '完成。';
    strDeleting = '正在刪除...';
    strNoSave = '無法找到可下載的遊戲記錄！';
    strImportNoSave = 'ZIP 內沒有找到記錄檔。';
    strImportDone = '記錄已上傳。';
    strNoData = '錯誤：遊戲資料尚未載入。';
    strInit = '正在初始化...';
    strLoading = '正在加載';
    strDelConfirm = '此操作會清除包含存檔在內的所有遊戲資料，且無法復原。請輸入 "YES" 繼續：';
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
var errorDetailsElement;
var loadingElement = document.getElementById('loadingScreen');
var startButtonElement = document.getElementById('btnStartGame');
var expMultiplierElement = document.getElementById('expMultiplier');
var expMultiplierValueElement = document.getElementById('expMultiplierValue');
var cashMultiplierElement = document.getElementById('cashMultiplier');
var cashMultiplierValueElement = document.getElementById('cashMultiplierValue');
var gameSpeedElement = document.getElementById('gameSpeed');
var gameSpeedValueElement = document.getElementById('gameSpeedValue');
var musicToggleElement = document.getElementById('btnToggleMusic');
var soundToggleElement = document.getElementById('btnToggleSound');
var voiceToggleElement = document.getElementById('btnToggleVoice');
var sceneInfoToggleElement = document.getElementById('btnToggleSceneInfo');
var crtToggleElement = document.getElementById('btnToggleCrt');
var installPromise = null;
var gameStarted = false;
var audioUnlocked = false;
var audioContexts = [];
var NativeAudioContextCtor = null;
var sharedAudioContext = null;
var audioKeepAliveSource = null;
var audioKeepAliveGain = null;
var jsBgmGain = null;
var jsBgmSource = null;
var htmlBgmAudio = null;
var htmlBgmSourceNode = null;
var htmlBgmGainNode = null;
var dialogVoiceDuckingActive = false;
var BGM_NORMAL_VOLUME = 0.9;
var BGM_DUCKED_VOLUME = 0.54;
var currentIntroVideo = null;
var htmlBgmUnlocked = false;
var jsBgmTrack = 0;
var jsBgmToken = 0;
var jsBgmBuffers = {};
var soundMuted = localStorage.getItem('sdlpal_sound_muted') === '1';
var voiceMuted = localStorage.getItem('sdlpal_voice_muted') === '1';
var musicMuted = soundMuted;
// Scene coordinate overlay is a temporary debug view. Always start hidden;
// older builds may have persisted it in localStorage, so clear that stale state.
try { localStorage.removeItem('sdlpal_scene_info_visible'); } catch (e) {}
var sceneInfoVisible = false;
window.SDLPAL_showSceneDebug = false;
var introInputBlockUntil = 0;
var clearKeyStateFunc = null;
var dialogVoiceAudio = null;
var dialogVoiceSource = null;
var dialogVoiceManifestPromise = null;
var dialogVoiceIds = null;
var dialogVoiceToken = 0;
var dialogVoiceQueue = [];
var dialogVoicePlaying = false;
var storyVideosPlayed = {};
var storyVideoPromise = null;
var sharedCutsceneVideoElement = null;

/*
 * Optional arcade/CRT output pipeline.  It is deliberately OFF by default:
 * the original SDL canvas keeps rendering normally, and this layer only copies
 * it to a second WebGL canvas when the user taps the CRT button.
 */
var crtEnabled = false;
var crtRenderer = null;
var crtConfig = {
    scaleMode: 'canvas',         // fixed: follow original canvas size; no aspect-ratio mode
    crt: true,
    bloom: true,
    tonemap: 'off',              // off | reinhard | aces | lottes
    bloomIntensity: 0.6,
    bloomThreshold: 0.75,
    maskStrength: 0.5,
    scanlineStrength: 0.2,
    inputWidth: 384,
    inputHeight: 224
};
window.SDLPAL_crtConfig = crtConfig;

function updateCrtButton() {
    var frame = document.getElementById('gameFrame');
    if (frame) frame.classList.toggle('crt-enabled', crtEnabled);
    if (crtToggleElement) {
        crtToggleElement.classList.toggle('off', !crtEnabled);
        crtToggleElement.classList.toggle('crt-on', crtEnabled);
        crtToggleElement.textContent = '畫';
        crtToggleElement.title = crtEnabled ? '關閉CRT畫面' : '啟用CRT畫面';
        crtToggleElement.setAttribute('aria-label', crtToggleElement.title);
    }
}

function setCrtScaleMode(mode) {
    /* Kept only for compatibility; CRT no longer has any aspect-ratio mode. */
    crtConfig.scaleMode = 'canvas';
    if (crtEnabled && crtRenderer) crtRenderer.resize(true);
}
window.setCrtScaleMode = setCrtScaleMode;

function toggleCrtMode() {
    crtEnabled = !crtEnabled;
    updateCrtButton();
    if (crtEnabled) startCrtRenderer();
}
window.toggleCrtMode = toggleCrtMode;

function computeCrtViewport(canvasW, canvasH, sourceW, sourceH) {
    /* No aspect-ratio mode: CRT output always uses the exact original canvas box. */
    return { x: 0, y: 0, w: Math.max(1, canvasW), h: Math.max(1, canvasH) };
}

function createShader(gl, type, source) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        throw new Error(gl.getShaderInfoLog(sh) || 'shader compile failed');
    }
    return sh;
}

function createProgram(gl, vs, fs) {
    var p = gl.createProgram();
    gl.attachShader(p, createShader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, createShader(gl, gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(p) || 'program link failed');
    }
    return p;
}

function createCrtRenderer() {
    var src = Module.canvas || document.getElementById('canvas');
    var out = document.getElementById('crtCanvas');
    if (!src || !out) return null;
    var gl = out.getContext('webgl2', { alpha: false, antialias: false, preserveDrawingBuffer: false });
    if (!gl) return null;

    var vs = `#version 300 es
precision highp float;
in vec2 aPos;
in vec2 aUv;
out vec2 vUv;
void main() {
    vUv = aUv;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;
    var fs = `#version 300 es
precision highp float;
uniform sampler2D uScene;
uniform vec2 uTexel;
uniform float uOutputHeight;
uniform int uCrt;
uniform int uBloom;
uniform int uTonemap;
uniform float uBloomIntensity;
uniform float uBloomThreshold;
uniform float uMaskStrength;
uniform float uScanlineStrength;
in vec2 vUv;
out vec4 fragColor;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }
vec3 sampleScene(vec2 uv) { return texture(uScene, clamp(uv, vec2(0.0), vec2(1.0))).rgb; }
vec3 brightSample(vec2 uv) {
    vec3 c = sampleScene(uv);
    float b = smoothstep(uBloomThreshold, 1.0, luma(c));
    return c * b;
}
vec3 tonemapReinhard(vec3 c) { return c / (1.0 + c); }
vec3 tonemapACES(vec3 x) {
    const float a = 2.51; const float b = 0.03; const float c = 2.43; const float d = 0.59; const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
vec3 tonemapLottes(vec3 x) {
    vec3 a = vec3(1.6); vec3 d = vec3(0.977); vec3 hdrMax = vec3(8.0); vec3 midIn = vec3(0.18); vec3 midOut = vec3(0.267);
    vec3 b = (-pow(midIn, a) + pow(hdrMax, a) * midOut) / ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);
    vec3 c = (pow(hdrMax, a * d) * pow(midIn, a) - pow(hdrMax, a) * pow(midIn, a * d) * midOut) / ((pow(hdrMax, a * d) - pow(midIn, a * d)) * midOut);
    return clamp(pow(x, a) / (pow(x, a * d) * b + c), 0.0, 1.0);
}

void main() {
    vec3 col = sampleScene(vUv);

    if (uBloom == 1) {
        float w0 = 0.227027;
        float w1 = 0.1945946;
        float w2 = 0.1216216;
        float w3 = 0.054054;
        float w4 = 0.016216;
        vec3 bloom = brightSample(vUv) * w0;
        bloom += (brightSample(vUv + vec2(1.0, 0.0) * uTexel * 2.0) + brightSample(vUv - vec2(1.0, 0.0) * uTexel * 2.0)) * w1 * 0.5;
        bloom += (brightSample(vUv + vec2(0.0, 1.0) * uTexel * 2.0) + brightSample(vUv - vec2(0.0, 1.0) * uTexel * 2.0)) * w1 * 0.5;
        bloom += (brightSample(vUv + vec2(2.0, 0.0) * uTexel * 2.0) + brightSample(vUv - vec2(2.0, 0.0) * uTexel * 2.0)) * w2 * 0.5;
        bloom += (brightSample(vUv + vec2(0.0, 2.0) * uTexel * 2.0) + brightSample(vUv - vec2(0.0, 2.0) * uTexel * 2.0)) * w2 * 0.5;
        bloom += (brightSample(vUv + vec2(3.0, 0.0) * uTexel * 2.0) + brightSample(vUv - vec2(3.0, 0.0) * uTexel * 2.0)) * w3 * 0.5;
        bloom += (brightSample(vUv + vec2(0.0, 3.0) * uTexel * 2.0) + brightSample(vUv - vec2(0.0, 3.0) * uTexel * 2.0)) * w3 * 0.5;
        bloom += (brightSample(vUv + vec2(4.0, 0.0) * uTexel * 2.0) + brightSample(vUv - vec2(4.0, 0.0) * uTexel * 2.0)) * w4 * 0.5;
        bloom += (brightSample(vUv + vec2(0.0, 4.0) * uTexel * 2.0) + brightSample(vUv - vec2(0.0, 4.0) * uTexel * 2.0)) * w4 * 0.5;
        col += bloom * uBloomIntensity;
    }

    if (uTonemap == 1) col = tonemapReinhard(col);
    else if (uTonemap == 2) col = tonemapACES(col);
    else if (uTonemap == 3) col = tonemapLottes(col);

    if (uCrt == 1) {
        float cell = max(1.0, floor(uOutputHeight / 224.0 * 0.5));
        float triad = mod(floor(gl_FragCoord.x / cell), 3.0);
        vec3 mask = vec3(1.0 - uMaskStrength);
        if (triad < 1.0) mask.r = 1.0;
        else if (triad < 2.0) mask.g = 1.0;
        else mask.b = 1.0;
        col *= mask;

        float row = mod(floor(gl_FragCoord.y / cell), 2.0);
        if (row < 1.0) col *= (1.0 - uScanlineStrength);

        float boost = 1.30 / ((1.0 - 2.0 * uMaskStrength / 3.0) * (1.0 - uScanlineStrength / 2.0));
        col *= boost;
    }

    fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}`;
    var program = createProgram(gl, vs, fs);
    var quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 0, 0,
         1, -1, 1, 0,
        -1,  1, 0, 1,
         1,  1, 1, 1
    ]), gl.STATIC_DRAW);

    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var loc = {
        aPos: gl.getAttribLocation(program, 'aPos'),
        aUv: gl.getAttribLocation(program, 'aUv'),
        uScene: gl.getUniformLocation(program, 'uScene'),
        uTexel: gl.getUniformLocation(program, 'uTexel'),
        uOutputHeight: gl.getUniformLocation(program, 'uOutputHeight'),
        uCrt: gl.getUniformLocation(program, 'uCrt'),
        uBloom: gl.getUniformLocation(program, 'uBloom'),
        uTonemap: gl.getUniformLocation(program, 'uTonemap'),
        uBloomIntensity: gl.getUniformLocation(program, 'uBloomIntensity'),
        uBloomThreshold: gl.getUniformLocation(program, 'uBloomThreshold'),
        uMaskStrength: gl.getUniformLocation(program, 'uMaskStrength'),
        uScanlineStrength: gl.getUniformLocation(program, 'uScanlineStrength')
    };

    var renderer = {
        source: src,
        canvas: out,
        gl: gl,
        running: false,
        resize: function(force) {
            var dpr = Math.max(1, window.devicePixelRatio || 1);
            var rect = this.source.getBoundingClientRect();
            var cssW = Math.max(1, rect.width || window.innerWidth || 1);
            var cssH = Math.max(1, rect.height || window.innerHeight || 1);
            var w = Math.max(1, Math.floor(cssW * dpr));
            var h = Math.max(1, Math.floor(cssH * dpr));
            out.style.left = Math.round(rect.left || 0) + 'px';
            out.style.top = Math.round(rect.top || 0) + 'px';
            out.style.width = cssW + 'px';
            out.style.height = cssH + 'px';
            if (force || out.width !== w || out.height !== h) {
                out.width = w;
                out.height = h;
            }
        },
        render: function() {
            if (!crtEnabled) { this.running = false; return; }
            this.running = true;
            this.resize(false);
            var sw = this.source.width || crtConfig.inputWidth;
            var sh = this.source.height || crtConfig.inputHeight;
            var logicalW = crtConfig.inputWidth || sw;
            var logicalH = crtConfig.inputHeight || sh;
            var vp = computeCrtViewport(out.width, out.height, logicalW, logicalH);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
            try {
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.source);
            } catch (e) {
                window.requestAnimationFrame(this.render.bind(this));
                return;
            }
            gl.disable(gl.BLEND);
            gl.disable(gl.DEPTH_TEST);
            gl.viewport(0, 0, out.width, out.height);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(vp.x, vp.y, vp.w, vp.h);
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, quad);
            gl.enableVertexAttribArray(loc.aPos);
            gl.vertexAttribPointer(loc.aPos, 2, gl.FLOAT, false, 16, 0);
            gl.enableVertexAttribArray(loc.aUv);
            gl.vertexAttribPointer(loc.aUv, 2, gl.FLOAT, false, 16, 8);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.uniform1i(loc.uScene, 0);
            gl.uniform2f(loc.uTexel, 1 / Math.max(1, sw), 1 / Math.max(1, sh));
            gl.uniform1f(loc.uOutputHeight, vp.h);
            gl.uniform1i(loc.uCrt, crtConfig.crt ? 1 : 0);
            gl.uniform1i(loc.uBloom, crtConfig.bloom ? 1 : 0);
            gl.uniform1i(loc.uTonemap, crtConfig.tonemap === 'reinhard' ? 1 : (crtConfig.tonemap === 'aces' ? 2 : (crtConfig.tonemap === 'lottes' ? 3 : 0)));
            gl.uniform1f(loc.uBloomIntensity, crtConfig.bloomIntensity);
            gl.uniform1f(loc.uBloomThreshold, crtConfig.bloomThreshold);
            gl.uniform1f(loc.uMaskStrength, crtConfig.maskStrength);
            gl.uniform1f(loc.uScanlineStrength, crtConfig.scanlineStrength);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            window.requestAnimationFrame(this.render.bind(this));
        }
    };
    return renderer;
}

function startCrtRenderer() {
    if (!crtRenderer) {
        try { crtRenderer = createCrtRenderer(); }
        catch (e) { Module.printErr('[crt] ' + (e && e.stack ? e.stack : e)); crtRenderer = null; }
    }
    if (!crtRenderer) {
        crtEnabled = false;
        updateCrtButton();
        window.alert('此瀏覽器不支援CRT畫面模式。');
        return;
    }
    if (!crtRenderer.running) window.requestAnimationFrame(crtRenderer.render.bind(crtRenderer));
}

updateCrtButton();

function clampExpMultiplier(value) {
    var n = parseInt(value, 10);
    if (!isFinite(n) || n < 1) n = 1;
    if (n > 50) n = 50;
    return n;
}

function clampCashMultiplier(value) {
    var n = parseInt(value, 10);
    if (!isFinite(n) || n < 1) n = 1;
    if (n > 100) n = 100;
    return n;
}

function clampGameSpeedMultiplier(value) {
    var n = parseInt(value, 10);
    if (!isFinite(n) || n < 1) n = 1;
    if (n > 5) n = 5;
    return n;
}

var expMultiplier = clampExpMultiplier(localStorage.getItem('sdlpal_exp_multiplier') || '5');
var cashMultiplier = clampCashMultiplier(localStorage.getItem('sdlpal_cash_multiplier') || '5');
var gameSpeedMultiplier = clampGameSpeedMultiplier(localStorage.getItem('sdlpal_game_speed_multiplier') || '1');
window.SDLPAL_expMultiplier = expMultiplier;
window.SDLPAL_cashMultiplier = cashMultiplier;
window.SDLPAL_gameSpeedMultiplier = gameSpeedMultiplier;
window.SDLPAL_battleTimingPressAt = 0;
window.SDLPAL_battleTimingLastPressAt = 0;
window.SDLPAL_battleTimingWindowStart = 0;
window.SDLPAL_battleTimingPressCount = 0;
window.SDLPAL_battleTimingBadWindow = 0;
var battleTimingLastDomEventAt = 0;

function nowForBattleTiming() {
    try { return performance.now(); } catch (e) { return Date.now(); }
}

window.SDLPAL_beginBattleTimingWindow = function(prePenaltyMs) {
    var now = nowForBattleTiming();
    var pre = Number(prePenaltyMs || 320);
    var last = Number(window.SDLPAL_battleTimingLastPressAt || 0);
    window.SDLPAL_battleTimingWindowStart = now;
    window.SDLPAL_battleTimingPressAt = 0;
    window.SDLPAL_battleTimingPressCount = 0;
    window.SDLPAL_battleTimingBadWindow = (last > 0 && now - last < pre) ? 1 : 0;
};

window.SDLPAL_markBattleTimingPress = function() {
    var now = nowForBattleTiming();
    window.SDLPAL_battleTimingLastPressAt = now;
    window.SDLPAL_battleTimingPressAt = now;
    if (Number(window.SDLPAL_battleTimingWindowStart || 0) > 0) {
        window.SDLPAL_battleTimingPressCount = Number(window.SDLPAL_battleTimingPressCount || 0) + 1;
    }
};

window.SDLPAL_clearBattleTimingPress = function() {
    window.SDLPAL_battleTimingPressAt = 0;
    window.SDLPAL_battleTimingWindowStart = 0;
    window.SDLPAL_battleTimingPressCount = 0;
    window.SDLPAL_battleTimingBadWindow = 0;
};

window.SDLPAL_consumeBattleTimingPress = function(windowMs) {
    var t = Number(window.SDLPAL_battleTimingPressAt || 0);
    var start = Number(window.SDLPAL_battleTimingWindowStart || 0);
    var ms = Number(windowMs || 220);
    var count = Number(window.SDLPAL_battleTimingPressCount || 0);
    var ok = !!(start > 0 && t >= start && t - start <= ms && count === 1 && !window.SDLPAL_battleTimingBadWindow);
    window.SDLPAL_clearBattleTimingPress();
    return ok ? 1 : 0;
};

function markBattleTimingFromEvent(e) {
    if (!gameStarted) return;
    if (e && e.type === 'keydown') {
        if (e.key !== ' ' && e.code !== 'Space' && e.keyCode !== 32) return;
        if (e.repeat) return;
    }
    var now = nowForBattleTiming();
    if (now - battleTimingLastDomEventAt < 45) return;
    battleTimingLastDomEventAt = now;
    window.SDLPAL_markBattleTimingPress();
}

['keydown', 'pointerdown', 'touchstart'].forEach(function(type) {
    window.addEventListener(type, markBattleTimingFromEvent, {capture: true, passive: true});
});

function updateMultiplierLabels() {
    if (expMultiplierElement) expMultiplierElement.value = String(expMultiplier);
    if (expMultiplierValueElement) expMultiplierValueElement.textContent = String(expMultiplier);
    if (cashMultiplierElement) cashMultiplierElement.value = String(cashMultiplier);
    if (cashMultiplierValueElement) cashMultiplierValueElement.textContent = String(cashMultiplier);
    if (gameSpeedElement) gameSpeedElement.value = String(gameSpeedMultiplier);
    if (gameSpeedValueElement) gameSpeedValueElement.textContent = String(gameSpeedMultiplier);
}

function setExpMultiplier(value) {
    expMultiplier = clampExpMultiplier(value);
    window.SDLPAL_expMultiplier = expMultiplier;
    localStorage.setItem('sdlpal_exp_multiplier', String(expMultiplier));
    updateMultiplierLabels();
}

function setCashMultiplier(value) {
    cashMultiplier = clampCashMultiplier(value);
    window.SDLPAL_cashMultiplier = cashMultiplier;
    localStorage.setItem('sdlpal_cash_multiplier', String(cashMultiplier));
    updateMultiplierLabels();
}

function setGameSpeedMultiplier(value) {
    gameSpeedMultiplier = clampGameSpeedMultiplier(value);
    window.SDLPAL_gameSpeedMultiplier = gameSpeedMultiplier;
    localStorage.setItem('sdlpal_game_speed_multiplier', String(gameSpeedMultiplier));
    updateMultiplierLabels();
}

if (expMultiplierElement) {
    expMultiplierElement.addEventListener('change', function() { setExpMultiplier(expMultiplierElement.value); });
    expMultiplierElement.addEventListener('input', function() { setExpMultiplier(expMultiplierElement.value); });
}
if (cashMultiplierElement) {
    cashMultiplierElement.addEventListener('change', function() { setCashMultiplier(cashMultiplierElement.value); });
    cashMultiplierElement.addEventListener('input', function() { setCashMultiplier(cashMultiplierElement.value); });
}
if (gameSpeedElement) {
    gameSpeedElement.addEventListener('change', function() { setGameSpeedMultiplier(gameSpeedElement.value); });
    gameSpeedElement.addEventListener('input', function() { setGameSpeedMultiplier(gameSpeedElement.value); });
}
updateMultiplierLabels();

(function installAudioContextUnlockHook() {
    NativeAudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!NativeAudioContextCtor) return;
    function WrappedAudioContext() {
        if (isIOSAudioDevice() && sharedAudioContext) {
            audioContexts.push(sharedAudioContext);
            if (audioUnlocked) window.setTimeout(resumeAudioContexts, 0);
            return sharedAudioContext;
        }
        var ctx = new (Function.prototype.bind.apply(NativeAudioContextCtor, [null].concat(Array.prototype.slice.call(arguments))))();
        audioContexts.push(ctx);
        if (isIOSAudioDevice() && !sharedAudioContext) sharedAudioContext = ctx;
        if (audioUnlocked) window.setTimeout(resumeAudioContexts, 0);
        return ctx;
    }
    WrappedAudioContext.prototype = NativeAudioContextCtor.prototype;
    Object.setPrototypeOf && Object.setPrototypeOf(WrappedAudioContext, NativeAudioContextCtor);

    window.AudioContext = WrappedAudioContext;
    window.webkitAudioContext = WrappedAudioContext;
})();

function isIOSAudioDevice() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function ensureSharedAudioContext() {
    if (!isIOSAudioDevice() || !NativeAudioContextCtor) return null;
    if (!sharedAudioContext) {
        try {
            sharedAudioContext = new NativeAudioContextCtor();
            audioContexts.push(sharedAudioContext);
        } catch (e) {
            sharedAudioContext = null;
        }
    }
    return sharedAudioContext;
}

function startAudioKeepAlive(ctx) {
    if (!ctx || audioKeepAliveSource) return;
    try {
        /*
         * iOS sometimes unlocks only the nodes that were started inside the
         * tap gesture. Keep one almost-silent oscillator alive from the Start
         * tap so SDL's ScriptProcessor stays on an active audio session even
         * after the MP4 <video> finishes.
         */
        audioKeepAliveGain = ctx.createGain();
        audioKeepAliveGain.gain.value = 0.00001;
        audioKeepAliveSource = ctx.createOscillator();
        audioKeepAliveSource.frequency.value = 20;
        audioKeepAliveSource.connect(audioKeepAliveGain);
        audioKeepAliveGain.connect(ctx.destination);
        audioKeepAliveSource.start(0);
    } catch (e) {
        audioKeepAliveSource = null;
        audioKeepAliveGain = null;
    }
}

function kickAudioContext(ctx) {
    if (!ctx || soundMuted) return;
    try {
        if (ctx.state === 'suspended') ctx.resume();
        startAudioKeepAlive(ctx);
        var buffer = ctx.createBuffer(1, 1, 22050);
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
    } catch (e) {}
}

function resumeAudioContexts() {
    audioUnlocked = true;
    ensureSharedAudioContext();
    if (soundMuted) {
        for (var i = 0; i < audioContexts.length; i++) {
            try { audioContexts[i] && audioContexts[i].suspend && audioContexts[i].suspend(); } catch (e) {}
        }
        return;
    }
    for (var i = 0; i < audioContexts.length; i++) {
        kickAudioContext(audioContexts[i]);
    }
}

function unlockAudioForIOS() {
    audioUnlocked = true;
    ensureSharedAudioContext();
    unlockHtmlBgmAudio();
    resumeAudioContexts();
}


function updateAudioToggleButtons() {
    if (soundToggleElement) {
        soundToggleElement.classList.toggle('off', soundMuted);
        soundToggleElement.textContent = soundMuted ? '🔇' : '🔊';
        soundToggleElement.title = soundMuted ? '啟用聲音' : '禁用聲音';
        soundToggleElement.setAttribute('aria-label', soundToggleElement.title);
    }
    if (voiceToggleElement) {
        voiceToggleElement.classList.toggle('off', voiceMuted || soundMuted);
        voiceToggleElement.textContent = voiceMuted || soundMuted ? '🗨️' : '🗣️';
        voiceToggleElement.title = voiceMuted ? '啟用語音' : '禁用語音';
        voiceToggleElement.setAttribute('aria-label', voiceToggleElement.title);
    }
}

function updateSceneInfoToggleButton() {
    window.SDLPAL_showSceneDebug = !!sceneInfoVisible;
    if (sceneInfoToggleElement) {
        sceneInfoToggleElement.classList.toggle('off', !sceneInfoVisible);
        sceneInfoToggleElement.title = sceneInfoVisible ? '隱藏場景資訊' : '顯示場景資訊';
        sceneInfoToggleElement.setAttribute('aria-label', sceneInfoToggleElement.title);
    }
}

function toggleSceneInfo() {
    sceneInfoVisible = !sceneInfoVisible;
    window.SDLPAL_showSceneDebug = sceneInfoVisible;
    try { localStorage.removeItem('sdlpal_scene_info_visible'); } catch (e) {}
    updateSceneInfoToggleButton();
}


function toggleVoiceMute() {
    voiceMuted = !voiceMuted;
    localStorage.setItem('sdlpal_voice_muted', voiceMuted ? '1' : '0');
    updateAudioToggleButtons();
    if (voiceMuted) stopDialogVoice();
}

function toggleMusicMute() {
    musicMuted = !musicMuted;
    localStorage.setItem('sdlpal_music_muted', musicMuted ? '1' : '0');
    updateAudioToggleButtons();
    if (musicMuted) {
        pauseHtmlBgmForBackground();
    } else {
        resumeHtmlBgmAfterForeground();
    }
}

function toggleSoundMute() {
    soundMuted = !soundMuted;
    musicMuted = soundMuted;
    localStorage.setItem('sdlpal_sound_muted', soundMuted ? '1' : '0');
    localStorage.setItem('sdlpal_music_muted', soundMuted ? '1' : '0');
    updateAudioToggleButtons();
    if (currentIntroVideo) {
        try {
            currentIntroVideo.muted = soundMuted;
            currentIntroVideo.volume = soundMuted ? 0 : 1.0;
        } catch (e) {}
    }
    if (soundMuted) {
        stopDialogVoice();
        pauseHtmlBgmForBackground();
        for (var i = 0; i < audioContexts.length; i++) {
            try { audioContexts[i] && audioContexts[i].suspend && audioContexts[i].suspend(); } catch (e) {}
        }
    } else {
        resumeAudioContexts();
        resumeHtmlBgmAfterForeground();
    }
}


updateAudioToggleButtons();
updateSceneInfoToggleButton();

function bgmUrlForTrack(track) {
    return 'data/bgm/' + String(track).padStart(3, '0') + '.m4a?v=' + encodeURIComponent(BUILD_VERSION);
}

function ensureHtmlBgmAudio() {
    if (!htmlBgmAudio) {
        htmlBgmAudio = document.createElement('audio');
        htmlBgmAudio.setAttribute('playsinline', '');
        htmlBgmAudio.setAttribute('webkit-playsinline', '');
        htmlBgmAudio.preload = 'auto';
        htmlBgmAudio.loop = true;
        htmlBgmAudio.volume = 0;
        htmlBgmAudio.muted = false;
        htmlBgmAudio.src = bgmUrlForTrack(4);
        document.body.appendChild(htmlBgmAudio);
    }
    return htmlBgmAudio;
}

function getTargetBgmVolume() {
    return dialogVoiceDuckingActive ? BGM_DUCKED_VOLUME : BGM_NORMAL_VOLUME;
}

function ensureHtmlBgmGain() {
    if (!isIOSAudioDevice()) return false;
    var a = ensureHtmlBgmAudio();
    if (!a || htmlBgmGainNode) return !!htmlBgmGainNode;
    var ctx = ensureSharedAudioContext();
    if (!ctx || !ctx.createMediaElementSource) return false;
    try {
        htmlBgmSourceNode = ctx.createMediaElementSource(a);
        htmlBgmGainNode = ctx.createGain();
        htmlBgmGainNode.gain.value = getTargetBgmVolume();
        htmlBgmSourceNode.connect(htmlBgmGainNode);
        htmlBgmGainNode.connect(ctx.destination);
        a.volume = 1.0;
        Module.print('[htmlbgm] WebAudio gain enabled');
        return true;
    } catch (e) {
        htmlBgmSourceNode = null;
        htmlBgmGainNode = null;
        Module.printErr('[htmlbgm] WebAudio gain failed: ' + (e && e.message ? e.message : e));
        return false;
    }
}

function applyHtmlBgmVolume() {
    var v = getTargetBgmVolume();
    try {
        if (htmlBgmGainNode) {
            var ctx = htmlBgmGainNode.context;
            if (htmlBgmGainNode.gain.setTargetAtTime && ctx) {
                htmlBgmGainNode.gain.setTargetAtTime(v, ctx.currentTime, 0.03);
            } else {
                htmlBgmGainNode.gain.value = v;
            }
            if (htmlBgmAudio) htmlBgmAudio.volume = 1.0;
        } else if (htmlBgmAudio) {
            htmlBgmAudio.volume = v;
        }
    } catch (e) {}
}

function unlockHtmlBgmAudio() {
    var a = ensureHtmlBgmAudio();
    if (!a || htmlBgmUnlocked) return;
    ensureHtmlBgmGain();
    try {
        if (htmlBgmGainNode) htmlBgmGainNode.gain.value = 0;
        else a.volume = 0;
        a.loop = true;
        var p = a.play();
        if (p && p.then) {
            p.then(function(){ htmlBgmUnlocked = true; Module.print('[htmlbgm] unlocked'); })
             .catch(function(e){ Module.printErr('[htmlbgm] unlock failed: ' + (e && e.message ? e.message : e)); });
        } else {
            htmlBgmUnlocked = true;
        }
    } catch (e) {
        Module.printErr('[htmlbgm] unlock exception: ' + (e && e.message ? e.message : e));
    }
}


function pauseHtmlBgmForBackground() {
    stopDialogVoice();
    if (htmlBgmAudio) {
        try { htmlBgmAudio.pause(); } catch (e) {}
    }
}

function resumeHtmlBgmAfterForeground() {
    if (soundMuted || musicMuted || !htmlBgmAudio || !jsBgmTrack) return;
    try {
        ensureHtmlBgmGain();
        htmlBgmAudio.muted = false;
        applyHtmlBgmVolume();
        var p = htmlBgmAudio.play();
        if (p && p.catch) p.catch(function(e) {
            Module.printErr('[htmlbgm] foreground resume failed: ' + (e && e.message ? e.message : e));
        });
    } catch (e) {}
}

function playHtmlBgm(track, loop) {
    var a = ensureHtmlBgmAudio();
    if (!a) return false;
    var n = Number(track) || 0;
    jsBgmTrack = n;
    if (n <= 0 || soundMuted || musicMuted) {
        try { a.pause(); } catch (e) {}
        return true;
    }
    var url = bgmUrlForTrack(n);
    try {
        a.loop = !!loop;
        ensureHtmlBgmGain();
        a.muted = false;
        applyHtmlBgmVolume();
        var sameTrack = a.src.indexOf('data/bgm/' + String(n).padStart(3, '0') + '.m4a') >= 0;
        if (!sameTrack) {
            a.src = url;
            a.load();
            try { a.currentTime = 0; } catch (e) {}
        }
        var p = a.play();
        if (p && p.catch) p.catch(function(e) {
            Module.printErr('[htmlbgm] play failed ' + n + ': ' + (e && e.message ? e.message : e));
        });
        Module.print('[htmlbgm] play ' + n + ' loop=' + (!!loop));
        return true;
    } catch (e) {
        Module.printErr('[htmlbgm] exception ' + n + ': ' + (e && e.message ? e.message : e));
        return false;
    }
}

async function playJsBgm(track, loop) {
    if (!isIOSAudioDevice()) return;
    if (playHtmlBgm(track, loop)) return;
    var n = Number(track) || 0;
    var token = ++jsBgmToken;
    if (jsBgmSource) {
        try { jsBgmSource.stop(0); } catch (e) {}
        try { jsBgmSource.disconnect(); } catch (e) {}
        jsBgmSource = null;
    }
    jsBgmTrack = n;
    if (n <= 0) return;
    var ctx = ensureSharedAudioContext();
    if (!ctx) return;
    try { if (ctx.state === 'suspended') await ctx.resume(); } catch (e) {}
    var key = String(n).padStart(3, '0');
    try {
        if (!jsBgmBuffers[key]) {
            var resp = await fetch(bgmUrlForTrack(n));
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            var arr = await resp.arrayBuffer();
            jsBgmBuffers[key] = await ctx.decodeAudioData(arr.slice(0));
        }
        if (token !== jsBgmToken || jsBgmTrack !== n) return;
        if (!jsBgmGain) {
            jsBgmGain = ctx.createGain();
            jsBgmGain.gain.value = 0.85;
            jsBgmGain.connect(ctx.destination);
        }
        var src = ctx.createBufferSource();
        src.buffer = jsBgmBuffers[key];
        src.loop = !!loop;
        src.connect(jsBgmGain);
        src.start(0);
        jsBgmSource = src;
        Module.print('[jsbgm] play ' + key + ' loop=' + (!!loop));
    } catch (e) {
        Module.printErr('[jsbgm] failed ' + key + ': ' + (e && e.message ? e.message : e));
    }
}


function voiceUrlForMsgId(msgId) {
    var id = Number(msgId) || 0;
    var sid = String(id).padStart(5, '0');
    return 'data/voice/' + sid.slice(0, 2) + '/' + sid + '.mp3?v=' + encodeURIComponent(BUILD_VERSION);
}


function normalizeDialogVoiceItem(item) {
    if (Array.isArray(item)) return item.map(function(x) { return Number(x) || 0; }).filter(Boolean);
    var n = Number(item) || 0;
    return n ? [n] : [];
}

function concatAudioBuffers(ctx, buffers) {
    var valid = buffers.filter(Boolean);
    if (!valid.length) return null;
    var sampleRate = valid[0].sampleRate || ctx.sampleRate;
    var channels = 1;
    valid.forEach(function(b) { channels = Math.max(channels, b.numberOfChannels || 1); });
    var total = valid.reduce(function(sum, b) { return sum + b.length; }, 0);
    var out = ctx.createBuffer(channels, total, sampleRate);
    var offset = 0;
    valid.forEach(function(b) {
        for (var ch = 0; ch < channels; ch++) {
            var srcCh = Math.min(ch, (b.numberOfChannels || 1) - 1);
            out.getChannelData(ch).set(b.getChannelData(srcCh), offset);
        }
        offset += b.length;
    });
    return out;
}

async function playDialogVoiceBufferList(ids, token) {
    var ctx = ensureSharedAudioContext();
    if (!ctx) throw new Error('no audio context');
    try { if (ctx.state === 'suspended') await ctx.resume(); } catch (e) {}
    var buffers = await Promise.all(ids.map(async function(id) {
        var resp = await fetch(voiceUrlForMsgId(id));
        if (!resp.ok) throw new Error('voice HTTP ' + resp.status + ' for ' + id);
        var arr = await resp.arrayBuffer();
        return await ctx.decodeAudioData(arr.slice(0));
    }));
    if (token !== dialogVoiceToken || soundMuted || voiceMuted) return;
    var merged = concatAudioBuffers(ctx, buffers);
    if (!merged) return;
    if (dialogVoiceSource) {
        try { dialogVoiceSource.stop(0); } catch (e) {}
        try { dialogVoiceSource.disconnect(); } catch (e) {}
        dialogVoiceSource = null;
    }
    var src = ctx.createBufferSource();
    src.buffer = merged;
    src.connect(ctx.destination);
    dialogVoiceSource = src;
    src.onended = function() {
        if (token !== dialogVoiceToken) return;
        dialogVoiceSource = null;
        dialogVoicePlaying = false;
        drainDialogVoiceQueue();
    };
    setDialogVoiceDucking(true);
    src.start(0);
}

function ensureDialogVoiceAudio() {
    if (!dialogVoiceAudio) {
        dialogVoiceAudio = document.createElement('audio');
        dialogVoiceAudio.setAttribute('playsinline', '');
        dialogVoiceAudio.setAttribute('webkit-playsinline', '');
        dialogVoiceAudio.preload = 'auto';
        dialogVoiceAudio.volume = 1.0;
        dialogVoiceAudio.muted = false;
        document.body.appendChild(dialogVoiceAudio);
    }
    return dialogVoiceAudio;
}

function setDialogVoiceDucking(active) {
    dialogVoiceDuckingActive = !!active;
    try {
        if (htmlBgmAudio && jsBgmTrack && !soundMuted && !musicMuted) {
            ensureHtmlBgmGain();
            applyHtmlBgmVolume();
        }
    } catch (e) {}
    try {
        if (jsBgmGain) jsBgmGain.gain.value = active ? BGM_DUCKED_VOLUME : 0.85;
    } catch (e) {}
}

function loadDialogVoiceManifest() {
    if (dialogVoiceIds) return Promise.resolve(dialogVoiceIds);
    if (!dialogVoiceManifestPromise) {
        dialogVoiceManifestPromise = fetch('data/voice/manifest.json?v=' + encodeURIComponent(BUILD_VERSION))
            .then(function(resp) {
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                return resp.json();
            })
            .then(function(manifest) {
                dialogVoiceIds = {};
                (manifest.ids || []).forEach(function(id) { dialogVoiceIds[String(id)] = true; });
                Module.print('[voice] loaded ' + (manifest.count || Object.keys(dialogVoiceIds).length) + ' dialog voices');
                return dialogVoiceIds;
            })
            .catch(function(e) {
                Module.printErr('[voice] manifest failed: ' + (e && e.message ? e.message : e));
                dialogVoiceIds = {};
                return dialogVoiceIds;
            });
    }
    return dialogVoiceManifestPromise;
}

function drainDialogVoiceQueue() {
    if (dialogVoicePlaying) return;
    if (soundMuted || voiceMuted) {
        dialogVoiceQueue = [];
        setDialogVoiceDucking(false);
        return;
    }
    var item = dialogVoiceQueue.shift();
    var requestedIds = normalizeDialogVoiceItem(item);
    if (!requestedIds.length) {
        setDialogVoiceDucking(false);
        return;
    }

    dialogVoicePlaying = true;
    var token = dialogVoiceToken;
    loadDialogVoiceManifest().then(function(availableIds) {
        if (token !== dialogVoiceToken || soundMuted || voiceMuted) {
            dialogVoicePlaying = false;
            dialogVoiceQueue = [];
            setDialogVoiceDucking(false);
            return;
        }
        var playableIds = requestedIds.filter(function(id) { return !!availableIds[String(id)]; });
        if (!playableIds.length) {
            dialogVoicePlaying = false;
            drainDialogVoiceQueue();
            return;
        }
        if (playableIds.length > 1) {
            Module.print('[voice] dialog block ' + playableIds.join(','));
            playDialogVoiceBufferList(playableIds, token).catch(function(e) {
                if (token === dialogVoiceToken) {
                    Module.printErr('[voice] block play failed ' + playableIds.join(',') + ': ' + (e && e.message ? e.message : e));
                    dialogVoicePlaying = false;
                    playableIds.reverse().forEach(function(id) { dialogVoiceQueue.unshift(id); });
                    drainDialogVoiceQueue();
                }
            });
            return;
        }
        var id = playableIds[0];
        var a = ensureDialogVoiceAudio();
        try { a.pause(); } catch (e) {}
        a.src = voiceUrlForMsgId(id);
        a.currentTime = 0;
        a.muted = false;
        a.volume = 1.0;
        setDialogVoiceDucking(true);
        a.onended = function() {
            if (token !== dialogVoiceToken) return;
            dialogVoicePlaying = false;
            drainDialogVoiceQueue();
        };
        a.onerror = function() {
            if (token !== dialogVoiceToken) return;
            dialogVoicePlaying = false;
            drainDialogVoiceQueue();
        };
        var p = a.play();
        if (p && p.catch) p.catch(function(e) {
            if (token === dialogVoiceToken) {
                Module.printErr('[voice] play failed ' + id + ': ' + (e && e.message ? e.message : e));
                dialogVoicePlaying = false;
                drainDialogVoiceQueue();
            }
        });
    });
}

function enqueueDialogVoice(item) {
    if (soundMuted || voiceMuted) return 0;
    dialogVoiceQueue.push(item);
    drainDialogVoiceQueue();
    return 1;
}

function ensureCutsceneVideoElement(src) {
    if (!sharedCutsceneVideoElement) {
        sharedCutsceneVideoElement = document.createElement('video');
        sharedCutsceneVideoElement.playsInline = true;
        sharedCutsceneVideoElement.setAttribute('playsinline', '');
        sharedCutsceneVideoElement.setAttribute('webkit-playsinline', '');
        sharedCutsceneVideoElement.title = APP_TITLE;
        sharedCutsceneVideoElement.setAttribute('aria-label', APP_TITLE);
        sharedCutsceneVideoElement.setAttribute('x-webkit-airplay', 'deny');
        sharedCutsceneVideoElement.preload = 'auto';
        sharedCutsceneVideoElement.controls = false;
    }
    if (src && sharedCutsceneVideoElement.getAttribute('data-src') !== src) {
        sharedCutsceneVideoElement.src = src;
        sharedCutsceneVideoElement.setAttribute('data-src', src);
    }
    return sharedCutsceneVideoElement;
}

function playStoryVideoOnce(key, src) {
    if (storyVideosPlayed[key]) return Promise.resolve(false);
    storyVideosPlayed[key] = true;
    if (storyVideoPromise) return storyVideoPromise;

    Module.print('[storyvideo] force play with audio ' + key + ' ' + src);
    try { stopDialogVoice(); } catch (e) {}
    try { pauseHtmlBgmForBackground(); } catch (e) {}

    storyVideoPromise = playIntroVideo(src, {forceTapPrompt: false}).then(function() {
        storyVideoPromise = null;
        try { resumeHtmlBgmAfterForeground(); } catch (e) {}
        try { clearGameInput(); } catch (e) {}
        return true;
    });
    return storyVideoPromise;
}

function playDialogVoice(msgId, faceId) {
    var id = Number(msgId) || 0;
    var face = Number(faceId) || 0;
    if (!id) return 0;
    if (face) Module.print('[voice] dialog msg ' + id + ' face ' + face);

    return enqueueDialogVoice(id);
}

function playDialogVoiceBlock(msgIds, faceId) {
    var face = Number(faceId) || 0;
    var ids = String(msgIds || '').split(',').map(function(x) { return Number(x) || 0; }).filter(Boolean);
    if (!ids.length) return 0;
    if (face) Module.print('[voice] dialog block face ' + face + ' msgs ' + ids.join(','));
    return enqueueDialogVoice(ids);
}

function stopDialogVoice() {
    dialogVoiceToken++;
    dialogVoiceQueue = [];
    dialogVoicePlaying = false;
    if (dialogVoiceSource) {
        try { dialogVoiceSource.stop(0); } catch (e) {}
        try { dialogVoiceSource.disconnect(); } catch (e) {}
        dialogVoiceSource = null;
    }
    if (dialogVoiceAudio) {
        try { dialogVoiceAudio.pause(); } catch (e) {}
        try { dialogVoiceAudio.currentTime = 0; } catch (e) {}
    }
    setDialogVoiceDucking(false);
}

window.SDLPAL_playBgm = function(track, loop) {
    if (playHtmlBgm(track, loop)) return 1;
    if (isIOSAudioDevice()) {
        playJsBgm(track, loop);
        return 1;
    }
    return 0;
};

function isIntroInputBlocked() {
    return Date.now() < introInputBlockUntil;
}

function blockIntroInputEvent(e) {
    if (!isIntroInputBlocked()) return;
    if (e && (e.type === 'keydown' || e.type === 'keyup' || e.type === 'keypress')) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    }
}

['keydown', 'keyup', 'keypress'].forEach(function(type) {
    window.addEventListener(type, blockIntroInputEvent, {capture: true, passive: false});
});

function clearGameInput() {
    try {
        if (!clearKeyStateFunc) {
            clearKeyStateFunc = Module.cwrap('EMSCRIPTEN_clear_key_state', null, []);
        }
        clearKeyStateFunc();
    } catch (e) {}
}


['touchstart', 'touchend', 'pointerdown', 'pointerup', 'click'].forEach(function(type) {
    window.addEventListener(type, unlockAudioForIOS, {capture: true, passive: true});
});

['focus', 'pageshow'].forEach(function(type) {
    window.addEventListener(type, function() {
        if (!audioUnlocked) return;
        resumeAudioContexts();
        resumeHtmlBgmAfterForeground();
        window.setTimeout(resumeAudioContexts, 250);
        window.setTimeout(resumeHtmlBgmAfterForeground, 250);
        window.setTimeout(resumeAudioContexts, 1000);
    });
});

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        pauseHtmlBgmForBackground();
        return;
    }
    if (!document.hidden && audioUnlocked) {
        resumeAudioContexts();
        resumeHtmlBgmAfterForeground();
        window.setTimeout(resumeAudioContexts, 250);
        window.setTimeout(resumeHtmlBgmAfterForeground, 250);
        window.setTimeout(resumeAudioContexts, 1000);
    }
});

window.addEventListener('pagehide', pauseHtmlBgmForBackground);
window.addEventListener('blur', pauseHtmlBgmForBackground);

window.addEventListener('load', function () {
    tipsElement = document.getElementById('tips');
    errorDetailsElement = document.getElementById('errorDetails');
    if (tipsElement) tipsElement.textContent = strTips;
});

var Module = {
    preRun: [],
    webglContextAttributes: { alpha: false, depth: true, stencil: true, antialias: false, preserveDrawingBuffer: true },
    postRun: [],
    print: function(text) { console.log(text); },
    printErr: function(text) { console.error(text); },
    setWindowTitle: function(text) {
        /* SDL/Emscripten may set window title to PAL95/SDLPal at runtime. */
        forceDocumentTitle();
    },
    locateFile: function(path) {
        return path === 'sdlpal.wasm' ? 'sdlpal.wasm?v=' + encodeURIComponent(BUILD_VERSION) : path;
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
Module.SDLPAL_playDialogVoice = playDialogVoice;
Module.SDLPAL_playDialogVoiceBlock = playDialogVoiceBlock;
Module.SDLPAL_stopDialogVoice = stopDialogVoice;
Module.SDLPAL_playStoryVideo = function(videoId) {
    var id = Number(videoId) || 0;
    if (id === 1) {
        return playStoryVideoOnce('xianlingdaoMedicine1', dataUrl('movie/01 仙灵岛求药 1.mp4', BUILD_VERSION));
    }
    if (id === 2) {
        return playStoryVideoOnce('xianlingdaoMedicine2', dataUrl('movie/02 仙灵岛求药 2.mp4', BUILD_VERSION));
    }
    if (id === 3) {
        return playStoryVideoOnce('xianlingdaoMedicine3', dataUrl('movie/03 仙灵岛求药 3.mp4', BUILD_VERSION));
    }
    if (id === 4) {
        return playStoryVideoOnce('xianlingdaoMedicine4', dataUrl('movie/04 仙灵岛求药 4.mp4', BUILD_VERSION));
    }
    if (id === 5) {
        return playStoryVideoOnce('jiuJianxianIntro', dataUrl('movie/05 酒剑仙.mp4', BUILD_VERSION));
    }
    return Promise.resolve(false);
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
            showErrorDetails(e, '具體錯誤：');
            spinnerElement.style.display = 'none';
        });
    });
}

function hideLoadingScreen() {
    if (loadingElement) loadingElement.classList.add('hidden');
}

function showStartButton() {
    clearErrorDetails();
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
        if (!manifestResp.ok) throw new Error('HTTP ' + manifestResp.status + ' for data/manifest.json');
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

function saveSlotChineseNumber(n) {
    var digits = ['', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    n = parseInt(n, 10) || 0;
    if (n <= 0) return '零';
    if (n < 10) return digits[n];
    if (n === 10) return '壹拾';
    if (n < 20) return '壹拾' + digits[n % 10];
    if (n < 100) return digits[Math.floor(n / 10)] + '拾' + (n % 10 ? digits[n % 10] : '');
    return '壹佰';
}

function readLe16(data, off) {
    return data && data.length >= off + 2 ? (data[off] | (data[off + 1] << 8)) : 0;
}

function isLikelyValidSaveData(data) {
    if (!data || data.length < 1024) return false;
    var times = readLe16(data, 0);
    return times > 0 && times <= 9999;
}

function readSaveTimesFromRpg(path) {
    try {
        var data = FS.readFile(path);
        if (!isLikelyValidSaveData(data)) return 0;
        return readLe16(data, 0);
    } catch (e) { return 0; }
}

function formatSaveMtime(path) {
    try {
        var st = FS.stat(path);
        var d = st && st.mtime ? new Date(st.mtime) : null;
        if (!d || isNaN(d.getTime())) return '--/-- --:--';
        function pad(n) { return String(n).padStart(2, '0'); }
        return pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    } catch (e) { return '--/-- --:--'; }
}

function getSaveExportEntries() {
    var entries = [];
    try {
        Object.keys(FS.lookupPath('/data').node.contents).forEach(function(element) {
            var m = element.match(/^(\d+)\.rpg$/i);
            if (!m) return;
            var slot = parseInt(m[1], 10);
            if (!slot) return;
            var path = '/data/' + element;
            var data;
            try { data = FS.readFile(path); } catch (e) { return; }
            if (!isLikelyValidSaveData(data)) return;
            var times = readLe16(data, 0);
            entries.push({
                slot: slot,
                name: element,
                path: path,
                times: times,
                timeText: formatSaveMtime(path)
            });
        });
    } catch (e) {}
    entries.sort(function(a, b) { return a.slot - b.slot; });
    return entries;
}

function exportSelectedSaves(slots) {
    var zip = new JSZip();
    var count = 0;
    slots.forEach(function(slot) {
        ['rpg', 'bmp'].forEach(function(ext) {
            var name = String(slot) + '.' + ext;
            var path = '/data/' + name;
            try {
                var array = FS.readFile(path);
                zip.file(name, array);
                if (ext === 'rpg') count++;
            } catch (e) {}
        });
    });
    if (count <= 0) {
        window.alert(strNoSave);
        return;
    }
    Module.setStatus('正在打包記錄...');
    zip.generateAsync({type:'blob'}).then(function(blob) {
        var a = document.createElement('a');
        var now = new Date();
        function pad(n) { return String(n).padStart(2, '0'); }
        a.download = 'pal-saves-' + now.getFullYear() + pad(now.getMonth() + 1) + pad(now.getDate()) + '-' + pad(now.getHours()) + pad(now.getMinutes()) + '.zip';
        a.href = URL.createObjectURL(blob);
        document.body.appendChild(a);
        a.click();
        window.setTimeout(function() {
            URL.revokeObjectURL(a.href);
            if (a.parentNode) a.parentNode.removeChild(a);
        }, 1000);
        Module.setStatus(strDone);
    }, function(err) { Module.printErr(err); });
}

function makeSaveManagerButton(text, primary, danger) {
    var b = document.createElement('button');
    b.textContent = text;
    b.style.border = '1px solid rgba(246,216,120,.45)';
    b.style.borderRadius = '999px';
    b.style.padding = '9px 14px';
    b.style.color = primary ? '#1a0906' : '#ffeec1';
    if (danger) {
        b.style.background = 'linear-gradient(180deg,#b9252d,#681116)';
        b.style.color = '#fff0c8';
    } else {
        b.style.background = primary ? 'linear-gradient(180deg,#f6d878,#b9852e)' : 'rgba(0,0,0,.42)';
    }
    b.style.fontWeight = '800';
    return b;
}

function getCheckedSaveManagerSlots(list) {
    return Array.prototype.slice.call(list.querySelectorAll('input[type=checkbox]:checked'))
        .map(function(cb) { return parseInt(cb.value, 10); })
        .filter(Boolean);
}

function deleteSelectedSaveSlots(slots) {
    if (!slots.length) {
        window.alert('請至少選擇一個記錄。');
        return false;
    }
    var names = [];
    slots.forEach(function(slot) {
        ['rpg', 'bmp'].forEach(function(ext) {
            var name = String(slot) + '.' + ext;
            if (saveFileExists(name)) names.push(name);
        });
    });
    if (!names.length) {
        window.alert(strNoSave);
        return false;
    }
    var shown = slots.map(function(slot) { return '文書' + saveSlotChineseNumber(slot); }).join('、');
    if (!window.confirm('將刪除以下記錄：\n' + shown + '\n\n此操作不可復原，是否繼續？')) {
        return false;
    }
    names.forEach(function(name) {
        try { FS.unlink('/data/' + name); } catch (e) {}
    });
    Module.setStatus(strSyncingFs);
    spinnerElement.style.display = 'inline-block';
    FS.syncfs(false, function(err) {
        if (err) Module.printErr(err);
        spinnerElement.style.display = 'none';
        Module.setStatus(strDone);
    });
    return true;
}

function openSaveManager() {
    var entries = getSaveExportEntries();

    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '120000';
    overlay.style.background = 'rgba(0,0,0,.68)';
    overlay.style.display = 'grid';
    overlay.style.placeItems = 'center';
    overlay.style.padding = '18px';
    overlay.style.boxSizing = 'border-box';

    var panel = document.createElement('div');
    panel.style.width = 'min(560px, calc(100vw - 28px))';
    panel.style.maxHeight = 'min(700px, calc(100vh - 40px))';
    panel.style.display = 'grid';
    panel.style.gridTemplateRows = 'auto 1fr auto';
    panel.style.border = '1px solid rgba(246,216,120,.48)';
    panel.style.borderRadius = '18px';
    panel.style.background = 'linear-gradient(180deg, rgba(50,21,17,.96), rgba(18,11,10,.96))';
    panel.style.boxShadow = '0 24px 80px rgba(0,0,0,.62)';
    panel.style.color = '#ffeec1';
    panel.style.overflow = 'hidden';

    var title = document.createElement('div');
    title.textContent = '存檔管理';
    title.style.padding = '16px 18px 12px';
    title.style.fontWeight = '900';
    title.style.fontSize = '18px';
    title.style.color = '#f6d878';

    var list = document.createElement('div');
    list.style.overflow = 'auto';
    list.style.padding = '4px 14px 10px';

    if (!entries.length) {
        var empty = document.createElement('div');
        empty.textContent = '目前沒有可管理的記錄。';
        empty.style.padding = '22px 8px';
        empty.style.color = 'rgba(255,238,193,.72)';
        empty.style.textAlign = 'center';
        list.appendChild(empty);
    } else {
        entries.forEach(function(e) {
            var label = document.createElement('label');
            label.style.display = 'grid';
            label.style.gridTemplateColumns = '26px 1fr';
            label.style.alignItems = 'center';
            label.style.gap = '8px';
            label.style.padding = '10px 8px';
            label.style.borderBottom = '1px solid rgba(246,216,120,.13)';
            label.style.fontSize = '15px';
            label.style.userSelect = 'none';

            var cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.value = String(e.slot);
            cb.style.width = '20px';
            cb.style.height = '20px';

            var text = document.createElement('div');
            text.innerHTML = '<b>文書' + saveSlotChineseNumber(e.slot) + '</b>' +
                '　<span style="color:#f6d878">次數 ' + e.times + '</span>' +
                '　<span style="color:rgba(255,238,193,.72)">' + e.timeText + '</span>';
            label.appendChild(cb);
            label.appendChild(text);
            list.appendChild(label);
        });
    }

    var buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.flexWrap = 'wrap';
    buttons.style.gap = '8px';
    buttons.style.justifyContent = 'flex-end';
    buttons.style.padding = '12px 14px 14px';
    buttons.style.borderTop = '1px solid rgba(246,216,120,.18)';

    var allBtn = makeSaveManagerButton('全選', false, false);
    var noneBtn = makeSaveManagerButton('全不選', false, false);
    var uploadBtn = makeSaveManagerButton('上傳', false, false);
    var deleteBtn = makeSaveManagerButton('刪除', false, true);
    var downloadBtn = makeSaveManagerButton('下載', true, false);
    var closeBtn = makeSaveManagerButton('關閉', false, false);

    allBtn.onclick = function() { list.querySelectorAll('input[type=checkbox]').forEach(function(cb) { cb.checked = true; }); };
    noneBtn.onclick = function() { list.querySelectorAll('input[type=checkbox]').forEach(function(cb) { cb.checked = false; }); };
    uploadBtn.onclick = function() {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        var input = document.getElementById('inputUploadSave');
        if (input) input.click();
    };
    deleteBtn.onclick = function() {
        var slots = getCheckedSaveManagerSlots(list);
        if (deleteSelectedSaveSlots(slots) && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    };
    downloadBtn.onclick = function() {
        var slots = getCheckedSaveManagerSlots(list);
        if (!slots.length) { window.alert('請至少選擇一個記錄。'); return; }
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        exportSelectedSaves(slots);
    };
    closeBtn.onclick = function() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); };
    overlay.onclick = function(e) { if (e.target === overlay) closeBtn.onclick(); };

    if (entries.length) {
        buttons.appendChild(allBtn);
        buttons.appendChild(noneBtn);
    }
    buttons.appendChild(uploadBtn);
    if (entries.length) {
        buttons.appendChild(deleteBtn);
        buttons.appendChild(downloadBtn);
    }
    buttons.appendChild(closeBtn);
    panel.appendChild(title);
    panel.appendChild(list);
    panel.appendChild(buttons);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
}

function downloadSaves() {
    openSaveManager();
}

function saveImportTargetName(name) {
    name = String(name || '').split('/').pop().toLowerCase();
    var m = name.match(/^(\d+)\.(rpg|prg|bmp)$/i);
    if (!m) return '';
    var slot = parseInt(m[1], 10);
    if (!slot || slot < 1 || slot > 100) return '';
    return String(slot) + '.' + (m[2].toLowerCase() === 'prg' ? 'rpg' : m[2].toLowerCase());
}

function saveFileExists(name) {
    try { FS.stat('/data/' + name); return true; } catch (e) { return false; }
}

function confirmOverwriteSaves(names) {
    var conflicts = names.filter(saveFileExists);
    if (!conflicts.length) return true;
    conflicts.sort(function(a, b) {
        return (parseInt(a, 10) || 0) - (parseInt(b, 10) || 0) || a.localeCompare(b);
    });
    var shown = conflicts.slice(0, 18).join(', ');
    if (conflicts.length > 18) shown += ' ...';
    return window.confirm('將覆蓋已有記錄：\n' + shown + '\n\n是否繼續？');
}

function importSaveFileEntries(entries) {
    var names = entries.map(function(e) { return e.name; });
    if (!confirmOverwriteSaves(names)) {
        spinnerElement.style.display = 'none';
        Module.setStatus('已取消上傳記錄');
        return Promise.resolve();
    }
    entries.forEach(function(e) {
        FS.writeFile('/data/' + e.name, e.data, {encoding: 'binary'});
    });
    Module.setStatus(strSyncingFs);
    return syncfsPromise(false).then(function() {
        spinnerElement.style.display = 'none';
        Module.setStatus(strImportDone + ' (' + entries.length + ')');
    });
}

function uploadSaves(file) {
    if (!file) return;
    Module.setStatus(strLoading + ' ' + file.name + '...');
    spinnerElement.style.display = 'inline-block';
    clearErrorDetails();

    var directName = saveImportTargetName(file.name);
    var lowerName = String(file.name || '').toLowerCase();
    if (directName && /\.(rpg|prg)$/i.test(lowerName)) {
        file.arrayBuffer().then(function(buf) {
            return importSaveFileEntries([{name: directName, data: new Uint8Array(buf)}]);
        }).catch(function(e) {
            Module.printErr(e && e.stack ? e.stack : e);
            showErrorDetails(e, '上傳記錄失敗：');
            Module.setStatus('上傳記錄失敗');
            spinnerElement.style.display = 'none';
        });
        return;
    }

    var zip = new JSZip();
    zip.loadAsync(file).then(function(z) {
        var promises = [];
        var seen = {};
        z.forEach(function(relativePath, zipEntry) {
            if (zipEntry.dir || relativePath.includes('._')) return;
            var target = saveImportTargetName(relativePath);
            if (!target) return;
            if (!/\.(rpg|prg|bmp)$/i.test(relativePath)) return;
            if (seen[target]) return;
            seen[target] = true;
            promises.push(zipEntry.async('uint8array').then(function(arr) {
                return {name: target, data: arr};
            }));
        });
        return Promise.all(promises).then(function(entries) {
            if (entries.length === 0) throw new Error(strImportNoSave);
            return importSaveFileEntries(entries);
        });
    }).catch(function(e) {
        Module.printErr(e && e.stack ? e.stack : e);
        showErrorDetails(e, '上傳記錄失敗：');
        Module.setStatus('上傳記錄失敗');
        spinnerElement.style.display = 'none';
    });
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
        showErrorDetails(e, '遊戲執行錯誤：');
        spinnerElement.style.display = 'none';
        throw e;
    }
}

function playIntroVideo(src, options) {
    options = options || {};
    return new Promise(function(resolve) {
        var canvas = Module.canvas || document.getElementById('canvas');
        var wrap = document.createElement('div');
        wrap.style.position = 'fixed';
        wrap.style.background = '#000';
        wrap.style.display = 'flex';
        wrap.style.alignItems = 'center';
        wrap.style.justifyContent = 'center';
        wrap.style.zIndex = options.zIndex || '99999';
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

        var useSharedVideoElement = !options.videoElement;
        var video = options.videoElement || ensureCutsceneVideoElement(src);
        if (video.parentNode) video.parentNode.removeChild(video);
        if (video.getAttribute('data-src') !== src) {
            video.src = src;
            video.setAttribute('data-src', src);
            try { video.load(); } catch (e) {}
        }
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.title = APP_TITLE;
        video.setAttribute('aria-label', APP_TITLE);
        video.setAttribute('x-webkit-airplay', 'deny');
        forceDocumentTitle();
        forceMediaTitle();
        video.autoplay = true;
        var forceMuted = !!options.forceMuted;
        if (forceMuted) {
            video.defaultMuted = true;
            video.setAttribute('muted', '');
        } else {
            video.defaultMuted = false;
            video.removeAttribute('muted');
        }
        video.muted = soundMuted || forceMuted;
        video.volume = (soundMuted || forceMuted) ? 0 : 1.0;
        video.preload = 'auto';
        video.controls = false;
        video.style.display = 'block';
        video.style.visibility = 'visible';
        video.style.position = 'static';
        video.style.left = 'auto';
        video.style.top = 'auto';
        video.style.transform = 'none';
        video.style.opacity = '1';
        video.style.pointerEvents = 'auto';
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'contain';
        video.style.background = '#000';
        video.style.imageRendering = 'pixelated';

        var needsTapToPlay = false;
        var tapPrompt = document.createElement('div');
        tapPrompt.textContent = '點擊播放動畫';
        tapPrompt.style.position = 'absolute';
        tapPrompt.style.left = '50%';
        tapPrompt.style.top = '50%';
        tapPrompt.style.transform = 'translate(-50%, -50%)';
        tapPrompt.style.padding = '14px 22px';
        tapPrompt.style.border = '1px solid rgba(246, 226, 161, .8)';
        tapPrompt.style.borderRadius = '999px';
        tapPrompt.style.background = 'rgba(0, 0, 0, .72)';
        tapPrompt.style.color = '#f6e2a1';
        tapPrompt.style.font = '700 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
        tapPrompt.style.letterSpacing = '.08em';
        tapPrompt.style.display = 'none';
        tapPrompt.style.zIndex = '2';

        var done = false;
        function onVideoError(e) {
            Module.printErr('Intro video failed: ' + src);
            cleanup();
        }
        function cleanup() {
            if (done) return;
            done = true;
            window.removeEventListener('resize', updateBounds);
            window.removeEventListener('keydown', skip, true);
            window.removeEventListener('keyup', skip, true);
            video.removeEventListener('ended', cleanup);
            video.removeEventListener('error', onVideoError);
            if (currentIntroVideo === video) currentIntroVideo = null;
            if (options.keepVideoElement || useSharedVideoElement) {
                try { video.pause(); } catch (e) {}
                video.style.position = 'fixed';
                video.style.left = '-4px';
                video.style.top = '-4px';
                video.style.width = '1px';
                video.style.height = '1px';
                video.style.opacity = '0';
                video.style.pointerEvents = 'none';
                if (video.parentNode) video.parentNode.removeChild(video);
                document.body.appendChild(video);
            }
            if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
            resolve();
        }
        function tryStartVideo() {
            needsTapToPlay = false;
            tapPrompt.style.display = 'none';
            try { if (video.currentTime > 0.05 || video.ended) video.currentTime = 0; } catch (e) {}
            try { video.style.visibility = 'visible'; video.style.opacity = '1'; video.style.display = 'block'; } catch (e) {}
            var p = video.play();
            if (p && p.catch) p.catch(function(e) {
                needsTapToPlay = true;
                tapPrompt.style.display = 'block';
                Module.printErr('Video autoplay failed, waiting for tap: ' + src + ' / ' + (e && e.message ? e.message : e));
            });
        }

        function skip(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
                if (e.stopImmediatePropagation) e.stopImmediatePropagation();
            }
            if (needsTapToPlay) {
                tryStartVideo();
                return;
            }
            if (options.unskippableUntilStarted) {
                return;
            }
            introInputBlockUntil = Date.now() + 900;
            cleanup();
        }

        video.addEventListener('ended', cleanup);
        video.addEventListener('error', onVideoError);
        wrap.addEventListener('click', skip);
        window.addEventListener('keydown', skip, true);
        window.addEventListener('keyup', skip, true);
        window.addEventListener('resize', updateBounds);

        wrap.appendChild(video);
        wrap.appendChild(tapPrompt);
        currentIntroVideo = video;
        updateBounds();
        document.body.appendChild(wrap);

        tryStartVideo();
    });
}

async function playIntroSequence() {
    /*
     * Play MP4 intros before entering wasm.  This avoids blocking C with
     * Asyncify while SDL browser callbacks are active.
     */
    await playIntroVideo(dataUrl('movie/00 Title.mp4', BUILD_VERSION));
}


var virtualControlsInitialized = false;
var isBattleActiveFunc = null;
var getPartyMemberCountFunc = null;
var setIntroPlayingFunc = null;
var playOpeningMenuMusicFunc = null;
var battlePollTimer = null;
var joystickActiveKey = null;

function keyInfo(key) {
    var table = {
        'ArrowUp': [38, 'ArrowUp'], 'ArrowDown': [40, 'ArrowDown'],
        'ArrowLeft': [37, 'ArrowLeft'], 'ArrowRight': [39, 'ArrowRight'],
        'Home': [36, 'Home'], 'PageUp': [33, 'PageUp'],
        'End': [35, 'End'], 'PageDown': [34, 'PageDown'],
        'Enter': [13, 'Enter'], ' ': [32, 'Space'], 'Escape': [27, 'Escape'],
        'r': [82, 'KeyR'], 'a': [65, 'KeyA'], 'd': [68, 'KeyD'],
        'e': [69, 'KeyE'], 'w': [87, 'KeyW'], 'q': [81, 'KeyQ'],
        'f': [70, 'KeyF'], 's': [83, 'KeyS'], 'c': [67, 'KeyC']
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

function setJoystickVisual(key, dx, dy) {
    var knob = document.getElementById('virtualJoystickKnob');
    var pad = document.getElementById('virtualJoystick');
    var max = 0;
    if (pad) max = Math.max(0, pad.clientWidth / 2 - 28);
    if (knob) {
        if (key && max > 0) {
            var len = Math.sqrt(dx * dx + dy * dy) || 1;
            var x = Math.max(-max, Math.min(max, dx / len * max * 0.62));
            var y = Math.max(-max, Math.min(max, dy / len * max * 0.62));
            knob.style.transform = 'translate(calc(-50% + ' + x.toFixed(1) + 'px), calc(-50% + ' + y.toFixed(1) + 'px))';
        } else {
            knob.style.transform = 'translate(-50%, -50%)';
        }
    }
    document.querySelectorAll('.vc-dir').forEach(function(el) {
        el.classList.toggle('active', !!key && el.getAttribute('data-joy-key') === key);
    });
}

function joystickKeyFromPoint(pad, clientX, clientY) {
    var rect = pad.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    var dx = clientX - cx;
    var dy = clientY - cy;
    var dead = Math.max(18, rect.width * 0.14);
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < dead) return {key: null, dx: dx, dy: dy};
    var angle = Math.atan2(dy, dx) * 180 / Math.PI;
    if (angle < 0) angle += 360;
    var dirs = ['ArrowRight', 'PageDown', 'ArrowDown', 'End', 'ArrowLeft', 'Home', 'ArrowUp', 'PageUp'];
    var idx = Math.round(angle / 45) % 8;
    return {key: dirs[idx], dx: dx, dy: dy};
}

function setJoystickKey(key, dx, dy) {
    if (key === joystickActiveKey) {
        setJoystickVisual(key, dx || 0, dy || 0);
        return;
    }
    if (joystickActiveKey) dispatchVirtualKey(joystickActiveKey, 'keyup');
    joystickActiveKey = key;
    if (joystickActiveKey) dispatchVirtualKey(joystickActiveKey, 'keydown');
    setJoystickVisual(joystickActiveKey, dx || 0, dy || 0);
}

function initVirtualJoystick(controls) {
    var pad = document.getElementById('virtualJoystick');
    if (!pad) return;
    var pointerId = null;
    function update(e) {
        var p = joystickKeyFromPoint(pad, e.clientX, e.clientY);
        setJoystickKey(p.key, p.dx, p.dy);
    }
    pad.addEventListener('pointerdown', function(e) {
        e.preventDefault();
        unlockAudioForIOS();
        pointerId = e.pointerId;
        try { pad.setPointerCapture(pointerId); } catch (_) {}
        update(e);
    });
    pad.addEventListener('pointermove', function(e) {
        if (pointerId !== e.pointerId) return;
        e.preventDefault();
        update(e);
    });
    function end(e) {
        if (pointerId !== null && e && e.pointerId !== pointerId) return;
        if (e) e.preventDefault();
        pointerId = null;
        setJoystickKey(null, 0, 0);
    }
    pad.addEventListener('pointerup', end);
    pad.addEventListener('pointercancel', end);
    pad.addEventListener('lostpointercapture', function(){ pointerId = null; setJoystickKey(null, 0, 0); });
    pad.addEventListener('contextmenu', function(e){ e.preventDefault(); });
}

function initVirtualControls() {
    if (virtualControlsInitialized) return;
    virtualControlsInitialized = true;
    var controls = document.getElementById('mobileControls');
    if (!controls) return;
    initVirtualJoystick(controls);

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
    try {
        getPartyMemberCountFunc = Module.cwrap('EMSCRIPTEN_get_party_member_count', 'number', []);
    } catch (e) {
        getPartyMemberCountFunc = null;
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
    var canSwitchParty = false;
    if (getPartyMemberCountFunc && !active) {
        try { canSwitchParty = getPartyMemberCountFunc() > 1; } catch (e) { canSwitchParty = false; }
    }
    controls.classList.toggle('party-switch-active', canSwitchParty);
}

function setIntroPlaying(playing) {
    try {
        if (!setIntroPlayingFunc) {
            setIntroPlayingFunc = Module.cwrap('EMSCRIPTEN_set_intro_playing', null, ['number']);
        }
        setIntroPlayingFunc(playing ? 1 : 0);
    } catch (e) {
        Module.printErr('setIntroPlaying failed: ' + (e && e.message ? e.message : e));
    }
}

function playOpeningMenuMusic() {
    try {
        if (!playOpeningMenuMusicFunc) {
            playOpeningMenuMusicFunc = Module.cwrap('EMSCRIPTEN_play_opening_menu_music', null, []);
        }
        playOpeningMenuMusicFunc();
        Module.print('[webaudio] opening menu MIDI requested after intro');
    } catch (e) {
        Module.printErr('playOpeningMenuMusic failed: ' + (e && e.message ? e.message : e));
    }
}

async function launch() {
    if (expMultiplierElement) setExpMultiplier(expMultiplierElement.value);
    if (cashMultiplierElement) setCashMultiplier(cashMultiplierElement.value);
    if (gameSpeedElement) setGameSpeedMultiplier(gameSpeedElement.value);
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
         * Create/unlock one shared AudioContext in the Start tap, then let the
         * MP4 intro play with its own audio.  After the videos, SDL reuses
         * that already-unlocked context instead of creating a locked one.
         */
        unlockAudioForIOS();
        window.setTimeout(resumeAudioContexts, 0);
        await playIntroSequence();
        introInputBlockUntil = Date.now() + 900;
        clearGameInput();
        unlockAudioForIOS();
        setVirtualControlsVisible(true);
        runGame();
        window.setTimeout(clearGameInput, 120);
        window.setTimeout(clearGameInput, 450);
        window.setTimeout(resumeAudioContexts, 0);
        window.setTimeout(resumeAudioContexts, 300);
        window.setTimeout(resumeAudioContexts, 1000);
        window.setTimeout(resumeAudioContexts, 2000);
        return;
    }
    await playIntroSequence();
    introInputBlockUntil = Date.now() + 900;
    clearGameInput();
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

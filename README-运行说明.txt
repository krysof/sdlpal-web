SDLPAL WebAssembly Web 版

运行方法：
1. 在本目录启动本地 HTTP 服务：
   python3 -m http.server 8000
2. 浏览器打开：
   http://localhost:8000/sdlpal.html
3. 点击“选择文件/Load ZIP”，上传 pal95-big5-data.zip。
4. 数据会缓存到浏览器 IndexedDB，之后可直接 Launch。

注意：
- 不建议直接双击 HTML；WASM 通常需要通过 HTTP 服务加载。
- 第一次上传数据 ZIP 会比较慢。
- 如需清除浏览器缓存数据，可点页面里的删除按钮。

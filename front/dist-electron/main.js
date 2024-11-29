import { app as n, BrowserWindow as i } from "electron";
import { fileURLToPath as a } from "node:url";
import o from "node:path";
const t = o.dirname(a(import.meta.url));
process.env.APP_ROOT = o.join(t, "..");
const s = process.env.VITE_DEV_SERVER_URL, m = o.join(process.env.APP_ROOT, "dist-electron"), r = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = s ? o.join(process.env.APP_ROOT, "public") : r;
let e = null;
function l() {
  e = new i({
    fullscreenable: !0,
    // Permite cambiar a pantalla completa
    fullscreen: !1,
    // No se inicia en verdadero modo pantalla completa
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: o.join(t, "preload.mjs")
    }
  }), e.maximize(), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), s ? e.loadURL(s) : e.loadFile(o.join(r, "index.html"));
}
n.on("window-all-closed", () => {
  process.platform !== "darwin" && (n.quit(), e = null);
});
n.on("activate", () => {
  i.getAllWindows().length === 0 && l();
});
n.whenReady().then(l);
export {
  m as MAIN_DIST,
  r as RENDERER_DIST,
  s as VITE_DEV_SERVER_URL
};

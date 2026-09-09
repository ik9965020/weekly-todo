:root {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", "Noto Sans JP", sans-serif;
  color: #202321;
  background: #f7f7f5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  --bg: #f7f7f5;
  --surface: #ffffff;
  --text: #202321;
  --muted: #858984;
  --line: #e7e8e4;
  --line-strong: #d9dcd6;
  --accent: #75877f;
  --accent-dark: #586b63;
  --accent-soft: #eef2f0;
  --danger: #b65f5f;
  --shadow: 0 1px 2px rgba(20, 28, 24, .035), 0 8px 24px rgba(20, 28, 24, .025);
}

* { box-sizing: border-box; }
html, body, #root { margin: 0; min-width: 320px; min-height: 100%; }
body { min-height: 100dvh; background: var(--bg); color: var(--text); }
button, input, select { font: inherit; }
button { -webkit-tap-highlight-color: transparent; }
button:focus-visible, input:focus-visible, select:focus-visible { outline: 2px solid #9aa9a2; outline-offset: 2px; }

.app-shell { min-height: 100dvh; padding: env(safe-area-inset-top) 0 calc(22px + env(safe-area-inset-bottom)); }
.app-main { width: min(100%, 760px); margin: 0 auto; padding: 10px 14px 32px; }
.top-tools { display: flex; justify-content: flex-end; min-height: 38px; align-items: center; margin-bottom: 6px; }
.manage-categories-btn {
  display: inline-flex; align-items: center; gap: 6px; min-height: 36px; padding: 7px 11px;
  border: 1px solid var(--line); border-radius: 12px; background: var(--surface); color: #535954;
  font-size: 13px; font-weight: 600; box-shadow: 0 1px 2px rgba(20, 28, 24, .025);
}
.manage-categories-btn:active { background: #f2f3f1; }

.scope-card {
  overflow: hidden; margin: 0 0 10px; border: 1px solid var(--line); border-radius: 17px;
  background: var(--surface); box-shadow: var(--shadow);
}
.scope-toggle {
  display: flex; width: 100%; min-height: 64px; align-items: center; justify-content: space-between; gap: 12px;
  padding: 11px 13px 11px 15px; border: 0; background: var(--surface); color: var(--text); text-align: left;
}
.scope-toggle:active { background: #fafbf9; }
.scope-copy { min-width: 0; display: grid; gap: 2px; }
.scope-title-line { display: flex; align-items: center; gap: 8px; }
.scope-title-line h2 { margin: 0; font-size: 17px; line-height: 1.2; letter-spacing: .01em; }
.scope-count {
  display: inline-grid; min-width: 20px; height: 20px; place-items: center; padding: 0 6px;
  border-radius: 999px; background: #f0f1ef; color: #777d78; font-size: 11px; font-weight: 650;
}
.scope-subtitle { color: var(--muted); font-size: 11px; line-height: 1.3; }
.scope-right { display: flex; align-items: center; gap: 5px; margin-left: auto; }
.collapse-icon { display: grid; width: 30px; height: 30px; place-items: center; color: #858b86; }
.scope-content { padding: 0 12px 12px; border-top: 1px solid #f1f2ef; }

.period-nav { display: flex; align-items: center; gap: 2px; color: #5e655f; }
.compact-period-nav { background: #f7f8f6; border-radius: 10px; padding: 1px; }
.compact-period-nav span { min-width: 50px; text-align: center; font-size: 11px; font-weight: 600; }
.nav-btn {
  display: grid; width: 30px; height: 30px; flex: 0 0 auto; place-items: center; border: 0; border-radius: 9px;
  background: transparent; color: #727973;
}
.nav-btn:active { background: #ecefeb; }
.nav-btn.large { width: 42px; height: 42px; border-radius: 13px; }
.reset-period { display: block; margin: 8px 0 5px auto; padding: 4px 7px; border: 0; background: transparent; color: var(--accent-dark); font-size: 11px; font-weight: 600; }

.week-switcher {
  display: grid; grid-template-columns: 42px minmax(0, 1fr) 42px; align-items: center; gap: 5px;
  margin: 10px 0 8px; padding: 5px; border: 1px solid var(--line); border-radius: 15px; background: #fafbf9;
}
.week-center { display: grid; gap: 1px; padding: 4px; border: 0; background: transparent; text-align: center; color: var(--text); }
.week-status { font-size: 13px; font-weight: 700; }
.week-range { color: var(--muted); font-size: 11px; }

.category-groups { display: grid; gap: 2px; }
.category-block { margin: 0; }
.category-heading {
  display: flex; min-height: 35px; align-items: center; justify-content: space-between; gap: 8px;
  padding: 1px 2px 1px 4px;
}
.category-title { display: flex; min-width: 0; align-items: center; gap: 7px; font-size: 13px; font-weight: 650; }
.category-dot { width: 8px; height: 8px; flex: 0 0 auto; border-radius: 50%; background: var(--category-color); }
.category-count { color: #a0a49f; font-size: 10px; font-weight: 550; }
.category-add-btn {
  display: grid; width: 32px; height: 32px; place-items: center; border: 0; border-radius: 10px;
  background: transparent; color: #7d857f;
}
.category-add-btn:active { background: #f0f2ef; }

.todo-list { overflow: hidden; margin-bottom: 2px; border: 1px solid var(--line); border-radius: 13px; background: var(--surface); }
.todo-row {
  display: flex; min-height: 48px; align-items: center; gap: 8px; padding: 5px 5px 5px 9px;
  border-bottom: 1px solid #eff0ed; transition: background .15s ease;
}
.todo-row:last-child { border-bottom: 0; }
.todo-row.is-complete { background: #fafbfa; }
.check-btn {
  display: grid; width: 26px; height: 26px; flex: 0 0 auto; place-items: center; padding: 0;
  border: 1.5px solid #8d9a94; border-radius: 50%; background: #fff; color: white;
}
.check-btn.is-checked { border-color: var(--accent); background: var(--accent); }
.todo-title { min-width: 0; flex: 1; font-size: 13px; line-height: 1.35; overflow-wrap: anywhere; }
.todo-title.is-complete { color: #9a9e9a; text-decoration: line-through; text-decoration-thickness: 1px; }
.meta-mark { display: inline-flex; align-items: center; gap: 2px; margin-left: 6px; color: #7e8a84; font-size: 10px; font-weight: 600; white-space: nowrap; }
.meta-mark.deadline { display: block; margin: 2px 0 0; color: #947a70; }
.row-actions { display: flex; flex: 0 0 auto; }
.row-action {
  display: grid; width: 34px; height: 34px; place-items: center; padding: 0; border: 0; border-radius: 10px;
  background: transparent; color: #929893;
}
.row-action:active { background: #f0f1ef; color: #5d6761; }
.row-action.delete:active { color: var(--danger); }
.empty-note { padding: 18px 8px 10px; color: var(--muted); text-align: center; font-size: 12px; }

.modal-backdrop {
  position: fixed; inset: 0; z-index: 30; display: grid; place-items: center; padding: 14px;
  background: rgba(27, 31, 29, .34); backdrop-filter: blur(2px); animation: fade-in .15s ease;
}
.modal-card {
  width: min(100%, 480px); max-height: min(88dvh, 680px); overflow: auto; padding: 17px;
  border: 1px solid var(--line); border-radius: 20px; background: var(--surface); box-shadow: 0 24px 70px rgba(28, 33, 30, .18);
  animation: modal-up .18s ease;
}
.modal-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 16px; }
.modal-heading h2 { margin: 0; font-size: 18px; }
.modal-heading p { margin: 3px 0 0; color: var(--muted); font-size: 11px; line-height: 1.45; }
.modal-close { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 11px; background: #f5f6f4; color: #767d77; }
.form-field { display: grid; gap: 6px; margin-bottom: 12px; color: #565c57; font-size: 12px; font-weight: 650; }
.form-field input, .form-field select, .category-edit-row input, .category-add-row input {
  width: 100%; min-width: 0; min-height: 44px; padding: 10px 11px; border: 1px solid var(--line-strong); border-radius: 11px;
  background: #fbfbfa; color: var(--text); font-size: 14px;
}
.form-check { display: flex; align-items: center; gap: 7px; min-height: 38px; color: #555c57; font-size: 13px; }
.form-check input { width: 17px; height: 17px; accent-color: var(--accent); }
.modal-actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
.btn { min-height: 41px; padding: 8px 13px; border: 1px solid transparent; border-radius: 11px; font-size: 13px; font-weight: 700; }
.btn.primary { border-color: var(--accent); background: var(--accent); color: white; }
.btn.secondary { border-color: var(--line); background: #f6f7f5; color: #555b56; }
.btn:disabled { opacity: .42; }
.btn.add { display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto; }

.category-edit-list { display: grid; gap: 4px; }
.category-edit-row { display: flex; align-items: center; gap: 7px; padding: 4px 0; }
.category-color { width: 11px; height: 11px; flex: 0 0 auto; border-radius: 50%; }
.category-edit-row input { min-height: 40px; flex: 1; }
.order-buttons { display: flex; gap: 1px; }
.order-buttons button { display: grid; width: 28px; height: 28px; place-items: center; border: 0; border-radius: 8px; background: #f5f6f4; color: #747b75; }
.order-buttons button:disabled { opacity: .25; }
.category-add-row { display: flex; gap: 7px; margin-top: 14px; padding-top: 13px; border-top: 1px solid var(--line); }
.category-add-row input { min-height: 41px; flex: 1; }
.toast-note {
  position: fixed; left: 50%; bottom: calc(16px + env(safe-area-inset-bottom)); z-index: 50; transform: translateX(-50%);
  padding: 9px 12px; border-radius: 999px; background: #4f5d56; color: white; font-size: 12px; box-shadow: 0 8px 28px rgba(0,0,0,.14);
}

@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes modal-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 520px) {
  .app-main { padding: 8px 10px 28px; }
  .top-tools { margin-bottom: 4px; }
  .scope-card { margin-bottom: 8px; border-radius: 15px; }
  .scope-toggle { min-height: 58px; padding: 9px 10px 9px 13px; }
  .scope-title-line h2 { font-size: 16px; }
  .scope-content { padding: 0 9px 9px; }
  .compact-period-nav span { min-width: 42px; font-size: 10px; }
  .compact-period-nav .nav-btn { width: 27px; height: 27px; }
  .category-heading { min-height: 32px; }
  .todo-row { min-height: 46px; }
  .row-action { width: 32px; height: 32px; }
  .modal-backdrop { align-items: end; padding: 8px; }
  .modal-card { width: 100%; max-height: 90dvh; border-radius: 20px 20px 14px 14px; }
}

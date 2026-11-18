import { mount } from "svelte";
// 共通の土台（tk-base.css）を、アプリの全体の CSS より先に読み込む
import "./tk-base.css";
import "./global.css";
import App from "./App.svelte";

const app = mount(App, {
  target: document.body,
});

export default app;

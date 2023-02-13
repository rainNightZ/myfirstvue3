import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueMarkdownEditor from "@kangc/v-md-editor";
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import hljs from 'highlight.js';
import vuepressTheme from "@kangc/v-md-editor/lib/theme/vuepress.js";
import "@kangc/v-md-editor/lib/theme/style/vuepress.css";
import Prism from "prismjs";
import App from './App.vue'
import router from './router'

import './assets/main.css'
VueMarkdownEditor.use(vuepressTheme, {
  Prism,
});
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App)
app.use(VueMarkdownEditor);
app.use(VMdPreview);

app.use(createPinia())
app.use(router)

app.mount('#app')

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import App2 from "./App2.vue";
import router from "./router";

import "./assets/main.css";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

// import { startListener } from "./design/PostMeaagae";

const app = createApp(App2);

app.use(createPinia());
app.use(router);
app.use(ElementPlus);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount("#app");

// startListener();

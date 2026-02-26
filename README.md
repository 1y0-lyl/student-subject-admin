# Student-subject-admin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

# Student-subject-admin-------课程管理系统 📚

这是一个学生选课与课程管理系统，有课程管理、选课退课、课程评价、课程分类管理等功能。

## 技术栈

- 前端框架：Vue 3
- 构建工具：Vite
- 路由管理：Vue Router
- HTTP 请求：Axios
- UI 组件：Element Plus
- 包管理：pnpm

## 核心功能

- 用户登录与注册
- 课程列表与详情展示
- 选课、退课功能
- 课程评价与评论区
- 用户个人信息详情
- 课程数据管理
- 课程分类管理

## 项目结构

- components -> 复用组件
  — pageContainer.vue # 内页面卡片
- views
  ─ channelEdit.vue # 频道编辑组件
  ─ channelSelect.vue # 频道选择组件
  ─ subjectComment.vue # 课程评价组件
  ─ subjectEdit.vue # 课程编辑组件
  ─ subjectList.vue # 课程列表组件
  — layoutContainer.vue #布局架子
  — loginPage.vue # 登录页
  ─ subjectChannel.vue # 课程频道页
  ─ subjectManage.vue # 课程管理页
  ─ subjectSelect.vue # 已选课列表页
  ─ userProfile.vue # 用户信息页
- router # 路由配置文件
- api # 接口请求封装
- App.vue # 应用入口组件

## 注意

由于接口是虚拟接口，所以启动的时候需要同时打开Apifox，而且内容会不匹配，部分功能也无法实现

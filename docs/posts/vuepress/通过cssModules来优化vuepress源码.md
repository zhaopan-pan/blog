---
sidebar: false
date: "2023-05-04"
excerpt: true
tag: 
 - vuepress
category: 
 - frontEnd
title: 
---

<div class='custom-article-excerpt'>
<Image src='https://v2.vuepress.vuejs.org/images/hero.png' width='100' height='100'/>
<h1 class='custom-article-name'>
通过cssModules来优化vuepress源码
</h1>
</div>

 <!-- more -->

## 背景

如你目前所见，就是最近在重写的[博客主题](https://github.com/zhaopan-pan/vuepress-theme-zp)，基于[vuepress2](https://v2.vuepress.vuejs.org/)的默认主题([theme-default](https://github.com/vuepress/vuepress-next/tree/main/ecosystem/theme-default))，原主题是知识文档库的风格，不满足[blog](https:zhaopanpan.com)的基础功能，所以就开始了魔改，在魔改的过程中少不了要研究源码，发现了一些`问题`的代码

## 问题 - 1
### 样式变量不能在组件中共享
项目使用的是`scss`作为样式预处理器，有单独的变量声明文件[_variables.scss](https://github.com/vuepress/vuepress-next/blob/main/ecosystem/theme-default/src/client/styles/_variables.scss)，这些变量主要在媒体查询时会用到
```scss
@import '@vuepress/plugin-palette/palette';

// responsive breakpoints
$MQNarrow: 959px !default;
$MQMobile: 719px !default;
$MQMobileNarrow: 419px !default;
```

但同时在组件[NavbarItems](https://github.com/vuepress/vuepress-next/blob/main/ecosystem/theme-default/src/client/components/NavbarItems.vue)代码中也看到了如下代码。**上面_variables.scss变量文件中已声明过的移动端响应宽度`719`**，而此处再次声明了一遍`，这样的写法一看就不太优雅，没有做到真正的常量共享(其实[Navbar](https://github.com/vuepress/vuepress-next/blob/main/ecosystem/theme-default/src/client/components/Navbar.vue)组件也是类似的情况，这里不在赘述)，后面如果有变动，就要改好几个地方，如果漏改，就可能出现bug，加大了维护难度。很显然作者也发现了，标记了todo。

```ts
// avoid overlapping of long title and long navbar links
onMounted(() => {
  // TODO: migrate to css var
  // refer to _variables.scss
  const MOBILE_DESKTOP_BREAKPOINT = 719

  const handleMobile = (): void => {
    if (window.innerWidth < MOBILE_DESKTOP_BREAKPOINT) {
      isMobile.value = true
    } else {
      isMobile.value = false
    }
  }
  handleMobile()
  window.addEventListener('resize', handleMobile, false)
  window.addEventListener('orientationchange', handleMobile, false)
})
```
###  解决方案
看到这里其实就比较清晰了，就是如何把scss变量和js打通的问题，让组件可以引用scss变量就行了，直接把scss变量文件`import`过来是不行的，构建工具无法识别。这里要用到[cssModules](https://github.com/css-modules/css-modules)，我们都知道cssModules是通过命名空间(随机串)的方式来解决css命名冲突的一种方案，适用示例如下

```css
/* style.css */
.header {
  color: red;
}
```
```jsx
import styles from './style.css';

<header className={styles.header}></header>

```
上面代码经过打包工具的编译，import的`styles`就是一个js对象了，里面包含了属性为header的className,这样就实现了在js中对css文件内容的获取。项目是用[vite](https://cn.vitejs.dev)进行构建，最终是否可行还是要看构建工具是否支持，通过查看文档知道，vite已经内置了[cssModules](https://cn.vitejs.dev/guide/features.html#css-modules)的支持，而且只要安装了`sass`，vite也支持了`scss`、`sass`的文件解析，以`.module.scss`为后缀，就可以结合`cssModules`来使用。那么说干就干，鉴于[_variables.scss](https://github.com/vuepress/vuepress-next/blob/main/ecosystem/theme-default/src/client/styles/_variables.scss)文件引用地方较多，我们把组件中需要用到的css变量单独放一个文件，叫`_variables.module.scss`,这里要用`:export`把变量抛出，不然会报错
```scss
@import '_variables';

:export {
  mobile: $MQMobile;
}

```

现在在组件中引入会报类型错误，因为是ts不能识别这种后缀的文件，在类型声明文件中补充类型就行
```ts
declare module '*.module.scss?module' {
  const cssVars: Record<string, string>
  export default cssVars
}
```
这时在组件中直接引入即可
```ts
import cssVars from '../styles/_variables.module.scss'

```
现在我们就可以通过`cssVars`来获取scss文件中的变量就可以了。改造完成后，重启项目，完美运行！经过重新构建启动，也跑了`test`，一切正常。
然后就提了pr，维护者很快就进行了review，当我以为事情快要结束时...

## 问题 - 2
### webpack环境下编译失败
项目的[check](https://github.com/vuepress/vuepress-next/actions/runs/4827419222/jobs/8600551762)阶段却报错了😭，奇了怪了，明明本地启动正常的。报错内容如下
```sh
- Cleaning temp
✔ Cleaning temp - done in 1ms
- Cleaning cache
✔ Cleaning cache - done in 1ms
- Initializing and preparing data
✔ Initializing and preparing data - done in 6.50s
- Compiling with webpack
{
  moduleIdentifier: 'javascript/esm|/home/runner/work/vuepress-next/vuepress-next/ecosystem/theme-default/lib/client/utils/updateDeviceStatus.js',
  moduleName: '../ecosystem/theme-default/lib/client/utils/updateDeviceStatus.js',
  loc: '8:32-46',
  message: "export 'default' (imported as 'cssVars') was not found in '../styles/_variables.module.scss' (module has no exports)",
  moduleId: null,
  moduleTrace: [
    {
      originIdentifier: 'javascript/esm|/home/runner/work/vuepress-next/vuepress-next/ecosystem/theme-default/lib/client/utils/index.js',
      originName: '../ecosystem/theme-default/lib/client/utils/index.js',
      moduleIdentifier: 'javascript/esm|/home/runner/work/vuepress-next/vuepress-next/ecosystem/theme-default/lib/client/utils/updateDeviceStatus.js',
      moduleName: '../ecosystem/theme-default/lib/client/utils/updateDeviceStatus.js',
      dependencies: [Array],
      originId: null,
      moduleId: null
    },
    ...
  ]
}

```

### 解决方案
看到报错信息`Compiling with webpack`，忽然明白了，原来是`webpack`编译时的问题，本地启动时每次都是`pnpm run docs:dev`，`vuepress`默认启动的工具是`vite`，如果要用`webpack`，要用`pnpm run docs:dev-webpack`，所以没发现这个问题，我大意了啊。
提取有用信息就是这句
```js
`export 'default' (imported as 'cssVars') was not found in '../styles/_variables.module.scss' (module has no exports)`
```
字面意思就是这个`_variables.module.scss`文件没有module导出，显然是webpack没有针对`cssModules`的文件做解析，webpack中`cssModules`的开关是`css-loader`控制的,这个就要看`css-loader`的配置了，webpack样式相关的配置在源码中的[handleModuleStyles](https://github.com/vuepress/vuepress-next/blob/main/packages/bundler-webpack/src/config/handleModuleStyles.ts)文件
```ts
// 101 line
const handleStyle = <T extends LoaderOptions = LoaderOptions>({
  lang,
  test,
  loaderName,
  loaderOptions,
}: {
  lang: string
  test: RegExp
  loaderName?: string
  loaderOptions?: T
}): void => {
  // 创建两个rules配置，一个默认的配置，一个是module配置
  const { modulesRule, normalRule } = createStyleRules({
    lang,
    test,
  })

  // 创建真实的rules
  applyStyleHandlers({
    rule: modulesRule,
    cssModules: true,
    loaderName,
    loaderOptions,
  })

  applyStyleHandlers({
    rule: normalRule,
    cssModules: false,
    loaderName,
    loaderOptions,
  })
}

handleStyle({
  lang: 'css',
  test: /\.css$/,
})
...
```

上面的代码就是在创建webpack配置文件中`module`下的那些`rule`,可以看到`modulesRule`的配置`cssModules`为`true`，说明`cssModules`是打开的，可为什么不生效的呢？来看`createStyleRules`方法
```ts
// 32 line
 const createStyleRules = ({
    lang,
    test,
  }: {
    lang: string
    test: RegExp
  }): {
    modulesRule: StyleRule
    normalRule: StyleRule
  } => {
    const baseRule = config.module.rule(lang).test(test)
    const modulesRule = baseRule.oneOf('modules').resourceQuery(/module/)
    const normalRule = baseRule.oneOf('normal')
    return {
      modulesRule,
      normalRule,
    }
 }
```
在创建`modulesRule`时，用到了webpack的[resourceQuery](https://www.webpackjs.com/configuration/module#ruleresourcequery)，这个api是给webpack在资源查询时添加匹配条件的，这里通过它给`modulesRule`添加了一个条件`/module/`，就是说如果我们要匹配上这个规则，就要在请求资源的url后面加上`?module`。验证一下，果然ok了，这里要注意类型文件也要同步修改。
```ts
// 使用方
import cssVars from '../styles/_variables.module.scss?module'

```
```ts
// shim.d.ts
declare module '*.module.scss?module'{
    ...
}
```

## 总结
在写blog主题过程中,对源码里不够优雅的变量使用做了一个小小优化，主要解决了两个问题：

1. js文件操作样式文件变量的问题，通过开启cssModules的方式来解决这个问题，打包工具vite、webpack也都是支持的
2. webpack的编译问题，通过vuepress的源码了解到，是因为webpack的config文件中，给使用cssModules功能的配置添加了条件，加上指定参数就可以了

解决完上述问题后，结合源码对css变量的使用做了进一步优化，封装成了`composables`方法，提高了代码的简洁、通用性，目前已经被`merged`，有兴趣的同学可以平移([不是好惹的的](https://www.thepaper.cn/newsDetail_forward_22941084))到这个[pr](https://github.com/vuepress/vuepress-next/pull/1322)。

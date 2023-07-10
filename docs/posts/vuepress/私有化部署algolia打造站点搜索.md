---
sidebar: false
date: "2023-07-10"
excerpt: true
tag: 
 - vuepress
category: 
 - backEnd
title:
---

<div class='custom-article-excerpt'>
<img src='https://dashboard.algolia.com/assets/auth/algolia-logo-light-2fc6ad36a48bf09ddd3136a97e71b523494ce964c348c150a628d29e94f15400.svg' height='30' style="margin: 20px 20px 20px 0;"/>
<h1 class='custom-article-name'>
如何用私有化部署algolia来打造属于自己的站点搜索呢🤔
</h1>
</div>

 <!-- more -->
<!-- https://www.algolia.com/developers/search-ui/ -->

## 前言
说起[algolia](!https://www.algolia.com/doc),可能大家会有点陌生，但如果你看过[vue](!https://cn.vuejs.org/)或[react](https://react.dev)的文档，那你大概率用过他们的搜索，以下图`vue`搜索为例:

<img src='https://s1.ax1x.com/2023/07/10/pCRNNQI.png' width='350'/>

从右下角那几个字可以看出vue的搜索服务是algolia提供的

> `Algolia`: 是一家美国的创业公司，通过SaaS（软件即服务）模式提供网络搜索产品。通过使用外部托管的搜索引擎为客户的网站提供网络搜索服务...
> 
> form -> [wikipedia](!https://zh.wikipedia.org/wiki/Algolia)

除了vue、react，基本上现代前端开源项目的文档搜索大多都是用的这个。

<img src='https://s1.ax1x.com/2023/07/10/pCRWC9I.jpg' width='350'/>

### 上车
<!-- https://docsearch.algolia.com/apply/ -->
已经有这么多大佬级框架都在用，而且`Algolia`提供一站式的服务，不仅帮提供app托管管理后台，还有爬虫管理后台方便配置。既然功能强大有好用，那咱也不能落后啊，赶紧安排上，于是按照[vuepress](!https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html)的教程就[申请](!https://docsearch.algolia.com/apply/)用上了，按理说一个幸福美满的故事就此开始了

### 事故
如果一直幸福美满下去到此也就结束了，没啥可总结的，但是，在一次配置未生效后，竟然手残的删除了账户，想着大不了重新申请一个就完了，可谁知道重新申请直接提示`已经把凭证发给我了`，但是那是老的啊，尝试用另一个邮箱申请也是同样提示，重新使用老邮箱注册账号竟然提示说`已经被拉进黑名单了！`shit`!

> 申请是指：你需要 提交你的网站 URL 来加入 DocSearch 项目。当你的索引成功创建后， DocSearch 团队会将 apiKey 和 indexName 发送到你的邮箱。接下来，你就可以配置该插件，在 VuePress 中启用 DocSearch 了。

> 注册是指： 注册algolia 提供的[应用管理后台](https://dashboard.algolia.com/apps)，用来做搜索应用的定制化配置

猜测是我的域名还存在他们的系统记录里，所以不能生成新的凭证，应该是一个域名下只能申请一次，那总不能换域名吧？  既然常规流程走不通，那就试试人工吧，发邮件说明问题后,得到的回复竟然是
```txt
The application you've requested help for is currently on a 'DocSearch' plan, which is a free product we offer. This doesn't include technical web support.
```
大意就是说他们提供的是免费产品，不包括技术支持，那合着意思就是不付费不给帮助了？话说回来，付费是不可能的，免费额度`10w/month`,个人玩玩绰绰有余了，根本到不了付费上限，现在的问题是，有没有其他官方提供的白嫖渠道呢😋

> `本地搜索`：其实在之也用过本地搜索，所谓本地搜索，就是根据页面在本地生成搜索索引，然后在用户访问站点时加载搜索索引文件，属于轻量级的搜索解决方案。

> `问题`：站点小页面少的情况下还勉强可以接受，页面比较多时，搜索索引文件也会变得非常大，它可能会拖慢页面的加载速度，体验属实不行
> form -> [vuepress-search](!https://v2.vuepress.vuejs.org/zh/reference/plugin/search.html)

## 另谋出路

目前老的邮箱是不能用了，用新的邮箱可以注册algolia，重新新建应用，之前正常的时候是官方提供爬虫收集索引，我直接配置应用和索引信息就行，问题是现在申请不过没有爬虫了，那就自己爬吧。
### run-your-own（私有化部署）

一番翻阅文档找到了[run-your-own](!https://docsearch.algolia.com/docs/legacy/run-your-own#create-a-new-configuration)，竟然支持自己爬，既然官方常规流程走不通，那就自己在服务器上玩吧，官方提供了镜像安装
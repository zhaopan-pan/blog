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
如何利用私有化部署algolia来打造属于自己的站点搜索呢🤔
</h1>
</div>

 <!-- more -->
<!-- https://www.algolia.com/developers/search-ui/ -->

## 前言
说起[algolia](!https://www.algolia.com/doc),可能大家会有点陌生，但如果你看过[vue](!https://cn.vuejs.org/)或[react](https://react.dev)的文档，那你大概率用过他们的搜索，以下图`vue`的搜索为例:

<img src='https://s1.ax1x.com/2023/07/10/pCRNNQI.png' width='350'/>

从右下角那几个字可以看出vue的搜索服务是algolia提供的

> `Algolia`: 是一家美国的创业公司，通过SaaS（软件即服务）模式提供网络搜索产品。通过使用外部托管的搜索引擎为客户的网站提供网络搜索服务...
> 
> form [wikipedia](!https://zh.wikipedia.org/wiki/Algolia)

除了vue、react，基本上现代开源项目的文档搜索大多都是用的这个。

## 上车
<!-- https://docsearch.algolia.com/apply/ -->
`Algolia`还提供一站式的服务，不仅帮忙托管爬虫，还提供管理后台方便配置
既然这么多大佬框架都在用，那咱也不能落后啊，赶紧安排上

> `本地搜索`：其实在之也用过本地搜索，所谓本地搜索，就是根据页面在本地生成搜索索引，然后在用户访问站点时加载搜索索引文件，属于轻量级的搜索解决方案。
> `问题`：站点小页面少的情况下还勉强可以接受，页面比较多时，搜索索引文件也会变得非常大，它可能会拖慢页面的加载速度，体验属实不行
> form [vuepress-search](!https://v2.vuepress.vuejs.org/zh/reference/plugin/search.html)
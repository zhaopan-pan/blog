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
如何跑algolia的爬虫来打造属于自己的站点搜索呢🤔
</h1>
</div>

 <!-- more -->
 
> 版本信息：
> 
> Algolia for JavaScript (4.8.5); Browser (lite); docsearch (3.5.0); docsearch-react (3.5.0); docsearch.js (3.5.0)


## 前言
说起[algolia](https://www.algolia.com/doc),可能大家会有点陌生，但如果你看过[vue](https://cn.vuejs.org/)或[react](https://react.dev)的文档，那你大概率用过他们的搜索，以下图`vue`搜索为例:

<img src='https://s1.ax1x.com/2023/07/11/pCWEjEV.png' width='500'/>

从右下角那几个字可以看出vue的搜索服务是algolia提供的

> `Algolia`: 是一家美国的创业公司，通过SaaS（软件即服务）模式提供网络搜索产品。通过使用外部托管的搜索引擎为客户的网站提供网络搜索服务...
> 
> form -> [wikipedia](https://zh.wikipedia.org/wiki/Algolia)

除了vue、react，基本上现代前端开源项目的文档搜索大多都是用的这个。

<img src='https://s1.ax1x.com/2023/07/11/pCWEvNT.jpg' width='500'/>

### 上车
<!-- https://docsearch.algolia.com/apply/ -->
已经有这么多大佬级框架都在用，而且`Algolia`提供一站式的服务，不仅帮提供app托管管理后台，还有爬虫管理后台方便配置。既然功能强大有好用，那咱也不能落后啊，赶紧安排上，于是按照[vuepress](https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html)的教程就[申请](https://docsearch.algolia.com/apply/)用上了，按理说一个幸福美满的故事就此开始了

### 事故
一直幸福美满下去到此也就结束了，没啥可总结的，但是，在一次配置未生效后，竟然手残的删除了账户，想着大不了重新申请一个就完了，可谁知道重新申请直接提示`已经把凭证发给我了`，但是那是老的啊，尝试用另一个邮箱申请也是同样提示，重新使用老邮箱注册账号竟然提示说`已经被拉进黑名单了！`shit`!

> 申请：你需要 提交你的网站 URL 来加入 DocSearch 项目。当你的索引成功创建后， DocSearch 团队会将 apiKey 和 indexName 发送到你的邮箱。接下来，你就可以配置该插件，在 VuePress 中启用 DocSearch 了。
> 
> 注册： 注册algolia 提供的[应用管理后台](https://dashboard.algolia.com/apps)，用来做搜索应用的定制化配置

猜测是我的域名还存在他们的系统记录里，所以不能生成新的凭证，应该是一个域名下只能申请一次，那总不能换域名吧？  既然常规流程走不通，那就试试人工吧，发邮件说明问题后,得到的回复竟然是
```txt
The application you've requested help for is currently on a 'DocSearch' plan, which is a free product we offer. This doesn't include technical web support.
```
大意就是说他们提供的是免费产品，不包括技术支持，那合着意思就是不付费不给帮助了？话说回来，付费是不可能的，免费额度`10w/month`,个人玩玩绰绰有余了，根本到不了付费上限，现在的问题是，有没有其他官方提供的白嫖渠道呢😋

> `本地搜索`：其实在之也用过本地搜索，所谓本地搜索，就是根据页面在本地生成搜索索引，然后在用户访问站点时加载搜索索引文件，属于轻量级的搜索解决方案。
> 
> `问题`：站点小页面少的情况下还勉强可以接受，页面比较多时，搜索索引文件也会变得非常大，它可能会拖慢页面的加载速度，体验属实不行
> form -> [vuepress-search](https://v2.vuepress.vuejs.org/zh/reference/plugin/search.html)

## 另谋出路

目前申请是不行了，感觉域名被锁定了，老的邮箱也不能用，那就看看有没有其他方式了挽救一下，老规矩，看官方文档，
一番翻阅文档找到了[run-your-own](https://docsearch.algolia.com/docs/legacy/run-your-own#create-a-new-configuration)，还真可以手动爬。

既然常规流程走不通，那就自己玩吧

### 创建algolia账号

老邮箱是不能用了，用新的邮箱注册algolia，重新建应用，然后创建索引，应用名称和索引名称自己定就行

<img src='https://s1.ax1x.com/2023/07/11/pCWEOH0.png' width='500'/>


### 配置爬虫环境

运行爬虫之前，需要先准备好一些配置文件

#### .env（环境变量）
首先在运行的根目录新建`.env`文件，需要将 Algolia 应用程序 ID 和管理 API 密钥设置为环境变量。

```sh
APPLICATION_ID=YOUR_APP_ID
API_KEY=YOUR_API_KEY
```

在概述页可以看到`API keys`入口，查看方式如下：
<br>
<img src='https://s1.ax1x.com/2023/07/11/pCW3T81.jpg' width='500'/>
<br>

打开后，复制红色框中的变量，爬虫需要对索引有写入权限，所以这里使用`Admin API Key`，而绿色框中的APIKey只有搜素权限，是前端用的，
[后面](#前端ui)会提到

<img src='https://s1.ax1x.com/2023/07/11/pCWJaDK.png' width='500'/>

#### config

启动的时候要传入[爬虫配置](https://docsearch.algolia.com/docs/legacy/config-file/)文件，里面需要配置站点相关的信息以及爬取内容的逻辑，我目前的配置如下，这个后面[搜索结果优化](#搜索结果优化)再细说具体字段

```js
{
    "index_name": "huanwu",
    "sitemap_urls": [
        "https://zhaopanpan.com/sitemap.xml"
    ],
    "start_urls": [
        {
            "url": "https://zhaopanpan.com/talks.html",
            "selectors_key": "talks",
            "tags": [
                "talks"
            ]
        },
        {
            "url": "https://zhaopanpan.com/about.html",
            "selectors_key": "about",
            "tags": [
                "about"
            ]
        },
        {
            "url": "https://zhaopanpan.com/posts/javascript",
            "page_rank": 1,
            "selectors_key": "javascript",
            "tags": [
                "javascript"
            ]
        },
        "https://zhaopanpan.com"
    ],
    "selectors": {
        "javascript": {
            "lvl0": {
                "selector": "",
                "default_value": "Javascript"
            },
            "lvl1": ".theme-container h1",
            "lvl2": ".theme-container h2",
            "lvl3": ".theme-container h3",
            "lvl4": ".theme-container h4",
            "lvl5": ".theme-container h5",
            "lvl6": ".theme-container h6",
            "content": ".theme-container p, .theme-container li"
        },
        "about": {
            "lvl0": {
                "selector": "",
                "default_value": "关于"
            },
            "lvl1": ".theme-container h1",
            "lvl2": ".theme-container h2",
            "lvl3": ".theme-container h3",
            "lvl4": ".theme-container h4",
            "lvl5": ".theme-container h5",
            "lvl6": ".theme-container h6",
            "content": ".theme-container p, .theme-container li"
        },
        "talks": {
            "lvl0": {
                "selector": "",
                "default_value": "技术分享"
            },
            "lvl1": ".theme-container h1",
            "lvl2": ".theme-container h2",
            "lvl3": ".theme-container h3",
            "lvl4": ".theme-container h4",
            "lvl5": ".theme-container h5",
            "lvl6": ".theme-container h6",
            "content": ".theme-container p, .theme-container li"
        },
        "default": {
            "lvl0": {
                "selector": "",
                "default_value": "文章"
            },
            "lvl1": ".theme-default-content h1",
            "lvl2": ".theme-default-content h2",
            "lvl3": ".theme-default-content h3",
            "lvl4": ".theme-default-content h4",
            "lvl5": ".theme-default-content h5",
            "lvl6": ".theme-default-content h6",
            "content": ".theme-default-content p, .theme-default-content li"
        }
    }
}

```
> `sitemap_urls` 这个字段很关键，爬虫主要通过`sitemap`来生成索引
> 
> 当时写成了`https: //zhaopanpan.com/sitemap.xml`多了个空格，硬是爬了个寂寞

### 运行爬虫

之前正常的时候是官方提供爬虫收集索引，我直接在前端结合相关UI库配置应用和索引信息就行，现在申请不过没有爬虫了，只能自己跑了。。。

官方提供了两种方式：

- 镜像运行(`推荐`)：依赖[docker](https://www.docker.com)和[jq](https://github.com/stedolan/jq/wiki/Installation)(json解析器)，好办
- 本地跑代码：先clone爬虫代码库到本地，需要配置项目运行环境，安装运行依赖，然后才能启动，略显麻烦，故pass

电脑本来就有docker，装了jq就可以跑了，运行以下命令：

```sh
docker run -it --env-file=.env -e "CONFIG=$(cat ./config.json | jq -r tostring)" algolia/docsearch-scraper
```

这时候如果配置无误，应该会看到类似下面爬取的内容信息

<img src='https://s1.ax1x.com/2023/07/11/pCWWo0U.png' width='100%'/>

`Nb hits:1006`说明此次爬取成功命中的索引数量，这时去Algolia管理后台看下，显然刚才爬取的索引都已经记录成功了，perfect！

<img src='https://s1.ax1x.com/2023/07/11/pCWhe2R.png' width='100%'/>

### 前端UI

到这一步说明爬虫已经就绪，如何在前端验证呢，最好能直接搜索一下，Algolia已经贴心准备了[playground](https://codesandbox.io/s/docsearchjs-v3-playground-z9oxj?file=/src/index.js)，准备好`appId、apiKey、indexName`三个变量，这里的`apiKey`就是上面环境变量截图的[绿色框](#env-环境变量)中的值，其他两个变量就不用说了，上面都有提过，配好后，随便搜个关键字，有结果说明已经成功了！很nice不是！🎉

<img src='https://s1.ax1x.com/2023/07/11/pCW4061.png' width='100%'/>

关于如何使用:
- 可以直接使用Algolia提供的[@docsearch/js](https://www.npmjs.com/package/@docsearch/js)，在前端直接调用，做UI渲染(此插件是React写的)。
- 本blog基于[vuepress2](https://v2.vuepress.vuejs.org/)，直接用了官方封装好的[@vuepress/plugin-docsearch@next](https://v2.vuepress.vuejs.org/zh/reference/plugin/docsearch.html#docsearch)插件，这里不在赘述。
- UI这块的生态还是比较丰富的，很多框架基于Algolia的`@docsearch/js`做了上层装，有web生态的包，也有移动端的，Algolia做了收集，可以去[search-ui](https://www.algolia.com/developers/search-ui/)看看。

## 搜索结果优化

其实到这一步功能已经可以用了，但是又怎能满足于现状呢？仔细看了下vue的搜索结果，都会根据该关键字所在目录，把上级标题显示出来，层次分明，一目了然，使用者很容易找到自己想要的信息，我也想要这样的效果

<img src='https://s1.ax1x.com/2023/07/11/pCWogtU.png' width='500'/>

这里就要说一下如何优化[config](#config)了，比较重要的字段如下：

### start_urls

`start_urls`可传入一个数组，里面包含可以抓取网站的地址

```json
{
  "start_urls": [
        {
            "url": "https://zhaopanpan.com/posts/javascript",
            "page_rank": 1,
            "selectors_key": "javascript",
            "tags": [
                "javascript"
            ]
        }
  ]
}
```
### selectors_key

如果我要对某个地址做特殊出来，我可以给他加个`selectors_key`，一个自定义的值(就好比我要操作dom的时候要给节点加一个`id`)，加了一个叫`javascript`的选择器之后，就可以在后面的`selectors`下统一分配
```json
{
  "start_urls": [
        {
            "url": "https://zhaopanpan.com/posts/javascript",
            "selectors_key": "javascript",
        }
    ],
  "selectors": {
      "javascript": {
          "lvl0": {
              "selector": "",
              "default_value": "Javascript"
          },
          "lvl1": ".theme-container h1",
          "lvl2": ".theme-container h2",
          "lvl3": ".theme-container h3",
          "lvl4": ".theme-container h4",
          "lvl5": ".theme-container h5",
          "lvl6": ".theme-container h6",
          "content": ".theme-container p, .theme-container li"
      },
  }
}

```



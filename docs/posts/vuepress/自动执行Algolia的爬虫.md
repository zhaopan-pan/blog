---
sidebar: false
date: "2023-07-14"
excerpt: false
tag: 
 - vuepress
category: 
 - frontEnd
title: 自动执行Algolia的爬虫
cover: https://picsum.photos/id/39/1000/400
---


## 前言

接上一篇[如何手动跑algolia的爬虫来打造属于自己的站点搜索呢](./如何手动跑algolia的爬虫来打造属于自己的站点搜索呢.md)，解决了站点搜索的爬虫问题，爬虫运行成功了，搜索也可以正常使用，但我运行方式是本地手动运行跑，`每次添加文章理论上都要更新索引，难不成每次手动爬一遍？`

## 思考

浪费时间，同时还占用了本机运算资源，长久看显然不可取

如何才能解放🙌🏻呢？结合自身需求，每次新文章都会在`master`上发布，那最好可以在分支push的时候能够执行爬虫

## Github Action

这里通过`github`的`action`来实现这个功能，首先要在根目录写个脚本

文件路径`.github/workflows/main.yml`

```sh
name: Algolia DocSearch

# master分支触发
on:
    push:
        branches:
            - 'master'

jobs:
    docsearch:
        runs-on: ubuntu-latest
        name: Algolia DocSearch
        steps:
            - uses: actions/checkout@v2
            - uses: darrenjennings/algolia-docsearch-action@master
              with:
                  algolia_api_key: ${{ secrets.ALGOLIA_API_KEY }}
                  algolia_application_id: ${{ secrets.ALGOLIA_APPLICATION_ID }}
                  # needs to be inside $GITHUB_WORKSPACE from actions/checkout step
                  file: 'config/crawler.json'

```


定义`jobs`执行爬虫

这部分的`action`有大佬已经封装好了`darrenjennings/algolia-docsearch-action@master`

调用的时候需要三个参数，前两个用过不多赘述

- `algolia_api_key`
- `algolia_application_id`
- `file`：爬虫配置文件，存放在项目根目录

参数要以变量的方式提前准备好，新建方式如下图

<img src='https://s1.ax1x.com/2023/07/14/pC43jte.png' width='100%'/>


这样提交后`github`就会去读取这个目录下的脚本配置，当`master`分支`push`的时候就会触发爬虫


触发成功如下图:

<img src='https://s1.ax1x.com/2023/07/14/pC48DAO.png' width='100%'/>


## 总结

通过编写自动化脚本，解决手动执行效率低下的问题，转移了运行环境后，还节约了本机软硬件运行资源，可谓一举两得

这都是`github`的[action](https://docs.github.com/zh/actions)的功劳，用好了，真的可以起到事半功倍的效果

## 未来

目前`blog`是在本地打包再上传的，虽然写了脚本直接`npm`执行，但每次有大概`20s`的耗时，后续看放在`github`执行，也是一个优化的方向

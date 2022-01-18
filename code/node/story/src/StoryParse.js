var Crawler = require("crawler");
const fileHelper = require('./txtFileHelper')
const path = require('path')
const async = require('async')

function StoryParse(options) {
    this.BASE = 'http://m.dingdianxs.la/'
    let {
        chapterPath,
        chapterPageCount,
        filePath,
        step
    } = options
    this.chapterPath = chapterPath
    this.chapterPageCount = chapterPageCount
    this.filePath = filePath
    this.step = step
    let chapterUrlList = this.getAllChapterUrl()
    this.chapterUrlList = chapterUrlList;
}

StoryParse.prototype.getCrawler = function (callback) {
    return new Crawler({
        maxConnections: 100,
        retries: 100,
        timeout: 1000000,
        // 这个回调每个爬取到的页面都会触发
        callback: function (error, res, done) {
            callback(error, res)
            done();
        }
    });
}

/**
 * 得到目录页目录跳转信息
 * @param {*} chapterUrl 
 * @param {*} callback 
 */
StoryParse.prototype.getChapter = function (chapterUrl, callback) {
    const c = this.getCrawler((error, res) => {
        if (error) {
            callback(null)
        } else {
            var $ = res.$;
            let chapter = this.parseChapter($)
            callback(chapter)
        }
    })
    c.queue(chapterUrl);
}

/**
 * 解析目录页dom
 * @param {*} $ 
 * @returns 
 */
StoryParse.prototype.parseChapter = function ($) {
    let res = []
    let children = $(".chapter")[1].children
    children.forEach(child => {
        if (child.children && child.children[0]) {
            let item = child.children[0]
            let resObj = {
                url: this.BASE + item.attribs['href'],
                name: item.children[0].data
            }
            res.push(resObj)
        }
    })
    return res
}

/**
 * 获得章节小说详细内容
 * @param {*} chapterDetailUrl 
 * @param {*} callback 
 */
StoryParse.prototype.getChapterDetail = function (chapters, callback) {
    if(chapters.length <= 0) return
    let allContent = ''
    let queueIndex = 0
    let c = this.getCrawler((error, res) => {
        if (error) {
            console.log(error);
            callback(null)
        } else {
            const $ = res.$;
            let detailRes = this.parseChapterDetail($, res.request.uri.href)
            allContent = allContent + detailRes.content
            if (detailRes.hasNextPage) {
                c.queue(detailRes.nextPageUrl);
            } else {
                queueIndex = queueIndex + 1
                if (queueIndex < chapters.length) {
                    c.queue(chapters[queueIndex].url);
                } else {
                    callback(allContent)
                }
            }
        }
    })

    c.queue(chapters[queueIndex].url);
}

/**
 * 解析详细内容
 * @param {*} $ 
 * @param {*} url 
 * @returns 
 */
StoryParse.prototype.parseChapterDetail = function ($, url) {
    let indexOf_ = url.indexOf('_'),
        pageIndex = 1

    if (indexOf_ > 0) {
        pageIndex = url.charAt(indexOf_ + 1)
    }

    let pre = url.replace(/\.html/, '')
    pre = pre.split('_')[0]
    let titleDiv = $('.nr_title')[0]
    let title = titleDiv && titleDiv.children[0] ? titleDiv.children[0].data : ''
    let content = $('#nr1')
    let contentStr = ''

    content[0].children && content[0].children.forEach((child, index) => {
        if (child.data) {
            if (index === 0 && pageIndex === 1) {
                contentStr = contentStr + '    ' + title + '\r\n'
            } else if (index > 1) {
                contentStr = contentStr + child.data + '\r\n'
            }
        }
    })

    // 判断是否有下一页按钮
    let hasNextPage = $('#pb_next')[0].children[0].data.trim() === '下一页'
    let nextPageUrl = ''
    if (hasNextPage) {
        pageIndex = parseInt(pageIndex) + 1
        nextPageUrl = `${pre}_${pageIndex}.html`
    }

    return {
        title,
        hasNextPage,
        nextPageUrl: nextPageUrl,
        content: contentStr,
        pageIndex: pageIndex

    }
}

StoryParse.prototype.getAllChapterUrl = function () {
    let chapterUrlList = []
    for (let index = 1; index <= this.chapterPageCount; index++) {
        chapterUrlList.push(`${this.BASE}${this.chapterPath}index_${index}.html`)
    }

    return chapterUrlList
}

/**
 * 构建获取章节列表的并行函数列表
 * @returns parallel
 */
StoryParse.prototype.getChapterParallel = function () {
    let that = this
    let parallel = {}
    for (let index = 0; index < this.chapterPageCount; index++) {
        parallel[index] = function (cb) {
            that.getChapter(that.chapterUrlList[index], (res) => {
                cb(null, res)
            })
        }
    }
    return parallel
}

/**
 * 构建获取章节内容的并行函数列表
 * @param {*} chapters 
 * @returns 
 */
StoryParse.prototype.getChapterDetailParallel = function (chapters, step = 10) {
    let that = this
    let parallel = {}

    for (let index = 0; index < chapters.length;) {
        let end = (index + step) < chapters.length ? (index + step) : chapters.length
        let list = chapters.slice(index, end)
       // console.log(list)
        parallel[index] = function (cb) {

            that.getChapterDetail(list, (res) => {
                cb(null, res)
            })
        }
        index = end
    }
    return parallel
}

StoryParse.prototype.run = function () {
    let start = new Date()
    console.log('开始...')
    const that = this

    let chapterParallel = this.getChapterParallel()

    const waterfallList = [
        // 获取所有章节
        function (done) {
            console.log('正在获取章节列表...')
            async.parallel(chapterParallel, function (err, result) {
                console.log('获取章节列表成功...')
                done(err, result) //将结果写入result
            });
        },
        function (result, done) {
            let chapters = []
            for (let key in result) {
                chapters = [...chapters, ...result[key]]
            }

            let contentParallel = that.getChapterDetailParallel(chapters, that.step)
            //  console.log(contentParallel)
            console.log('正在获取小说内容...')
            async.parallel(contentParallel, function (err, result) {
                console.log('获取小说内容成功...')
                done(err, result) //将结果写入result
            });

        },
    ];
    async.waterfall(waterfallList, (error, result) => {
        let storyContent = ''
        for (let key in result) {
            storyContent += result[key]
        }
        storyContent = storyContent.replace(/（本章未完，请点击下一页继续阅读）/g, '')
        this.writeFile(this.filePath, storyContent)
        let end = new Date()
        console.log('小说生成成功，总耗时:' + (end.getTime() - start.getTime()) )
    });
}

StoryParse.prototype.writeFile = function (filePath, str) {
    console.log('正在写入文档...')
    try {
        fileHelper.writeFile(filePath, str)
    } catch (e) {
        console.log('写入失败!')
        throw e
    }
    console.log('写入成功!')
}
module.exports = StoryParse
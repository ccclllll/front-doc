const StoryParse = require('./StoryParse')
const path = require('path')
function test() {
  let storyParse = new StoryParse({
      chapterPath: '60/60189/',
      chapterPageCount: 10,
      filePath: path.resolve(__dirname, './斩月.txt'),
      step: 5
  })
  storyParse.run()
}

test()

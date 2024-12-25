import fs from 'node:fs'
import https from 'node:https'
import path from 'node:path'

// 定义字体信息，包括字体名称、保存路径和远程字体文件路径
const fonts = [
  {
    font: 'arial-unicode-ms-bold',
    savePath: './public/fonts/arial-unicode-ms-bold',
    fontPath: 'https://static.arcgis.com/fonts/arial-unicode-ms-bold/',
  },
  {
    font: 'arial-unicode-ms-regular',
    savePath: './public/fonts/arial-unicode-ms-regular',
    fontPath: 'https://static.arcgis.com/fonts/arial-unicode-ms-regular/',
  },
]

// 下载单个文件的函数
function downloadFile(font, fileName, url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        // 如果状态码是 200，将响应流写入文件
        const fileStream = fs.createWriteStream(dest)
        response.pipe(fileStream)
        // 监听文件写入完成事件
        fileStream.on('finish', () => {
          fileStream.close()
          console.log(`Downloaded: ${font} ${fileName}`)
          resolve()
        })
      }
      else {
        // 如果状态码不是 200，下载失败
        // eslint-disable-next-line prefer-promise-reject-errors
        reject(`Failed to download ${fileName}. Status code: ${response.statusCode}`)
      }
    }).on('error', (err) => {
      // 网络请求发生错误
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(`Error downloading ${fileName}: ${err.message}`)
    })
  })
}

// 下载单个字体的所有文件
async function downloadFont({ font, savePath, fontPath }) {
  // 如果保存路径不存在，创建路径
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath, { recursive: true })
  }

  // 依次下载 256 个字体文件
  for (let i = 0; i < 256; i++) {
    const fileName = `${i * 256}-${(i + 1) * 256 - 1}.pbf`
    const url = fontPath + fileName
    const dest = path.join(savePath, fileName)

    try {
      // 下载文件并在下载完成后延迟 1 秒，避免被服务器限制或阻止
      await downloadFile(font, fileName, url, dest)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 延迟 1 秒
    }
    catch (error) {
      console.error(error) // 捕获并打印下载错误
    }
  }
}

// 主函数，管理多个字体的并行下载任务
async function main() {
  const tasks = fonts.map(font => downloadFont(font)) // 为每个字体创建下载任务
  await Promise.all(tasks) // 并行执行所有任务
}

// 执行主函数
main().then(() => {
  console.log('All fonts downloaded successfully')
})

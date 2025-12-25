import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

// Cesium 源资源路径
const cesiumSourceDir = path.join(projectRoot, 'node_modules/cesium/Build/Cesium')
// 目标目录
const targetDir = path.join(projectRoot, 'public/libs/cesium')

/**
 * 递归复制文件夹
 */
function copyDirectory(source, destination) {
  // 创建目标目录
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true })
  }

  const files = fs.readdirSync(source)

  files.forEach((file) => {
    const srcPath = path.join(source, file)
    const destPath = path.join(destination, file)
    const stat = fs.statSync(srcPath)

    if (stat.isDirectory()) {
      // 递归复制文件夹
      copyDirectory(srcPath, destPath)
    }
    else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath)
    }
  })
}

/**
 * 主函数
 */
function copyCesiumAssets() {
  const foldersToSync = ['Assets', 'ThirdParty', 'Widgets', 'Workers']

  try {
    console.log('开始复制 Cesium 资源文件...')
    console.log(`源目录: ${cesiumSourceDir}`)
    console.log(`目标目录: ${targetDir}`)
    console.log(`仅复制以下文件夹: ${foldersToSync.join(', ')}`)

    if (!fs.existsSync(cesiumSourceDir)) {
      throw new Error(`Cesium 源目录不存在: ${cesiumSourceDir}`)
    }

    // 清空目标目录
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true })
      console.log('已清空目标目录')
    }

    // 创建目标目录
    fs.mkdirSync(targetDir, { recursive: true })

    // 只复制指定的文件夹
    foldersToSync.forEach((folder) => {
      const srcPath = path.join(cesiumSourceDir, folder)
      const destPath = path.join(targetDir, folder)

      if (fs.existsSync(srcPath)) {
        console.log(`复制文件夹: ${folder}`)
        copyDirectory(srcPath, destPath)
      }
      else {
        console.warn(`警告: 文件夹不存在 - ${folder}`)
      }
    })

    console.log('✓ Cesium 资源文件复制完成！')
    process.exit(0)
  }
  catch (error) {
    console.error('✗ 复制过程中出现错误:', error.message)
    process.exit(1)
  }
}

copyCesiumAssets()

import { readFileSync } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import pico from 'picocolors'

const msgPath = path.resolve('.git/COMMIT_EDITMSG')
const msg = readFileSync(msgPath, 'utf-8').trim()

// eslint-disable-next-line max-len, regexp/no-unused-capturing-group
const commitRE = /^(revert: )?(init|feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.log()
  console.error(
    `  ${pico.white(pico.bgRed(' ERROR '))} ${pico.red(
      `提交消息格式无效。`,
    )}\n\n${
      pico.red(
        `  变更日志需要正确的提交消息格式。示例：\n\n`,
      )
    }    ${pico.green(`feat(compiler): add 'comments' option`)}\n`
    + `    ${pico.green(
      `fix(v-model): handle events on blur (close #28)`,
    )}\n\n${
      pico.red(`  有关更多详细信息，请参阅：docs/commit-convention.md。\n`)}`,
  )
  process.exit(1)
}

import conventionalChangelog from 'conventional-changelog'
import path from 'path'
import fs from 'fs'

import { BaseCommand } from '@adonisjs/core/build/standalone'

const mainTemplate = `
{{> header}}

{{#each commitGroups}}

{{#if title}}
### {{title}}

{{/if}}
{{#each commits}}
{{> commit root=@root}}
{{/each}}

{{/each}}
{{> footer}}
`

export default class GenerateReleaseNotes extends BaseCommand {
  public static commandName = 'generate:release_notes'

  public static description = ''

  public static settings = {
    loadApp: false,
    stayAlive: false,
  }

  public async run() {
    const filename = path.resolve(__dirname, '..', 'release', 'release-notes.md')

    fs.mkdirSync(path.dirname(filename), { recursive: true })
    const stream = fs.createWriteStream(filename)

    return new Promise<void>((resolve, reject) => {
      conventionalChangelog({
        releaseCount: 2,
        config: {
          writerOpts: {
            transform(commit) {
              if (typeof commit.hash === 'string') {
                commit.shortHash = commit.hash.substring(0, 7)
              }

              const groups: any = {
                feat: 'Feature',
                fix: 'Bug fixes',
                revert: 'Reverts',
                style: 'Styles',
                refactor: 'Code refactoring',
                test: 'Tests',
                build: 'Build system',
                ci: 'Continuous Integration',
              }

              if (!commit.type || !groups[commit.type]) {
                return false
              }

              commit.type = groups[commit.type]

              return commit
            },
            groupBy: 'type',
            commitGroupsSort: 'title',
            commitsSort: ['scope', 'subject'],
            noteGroupsSort: 'title',
            headerPartial: `## {{date}}`,
            commitPartial: '- {{ header }}  {{hash}} \n',
            mainTemplate,
          },
        },
      })
        .pipe(stream)
        .on('error', (err) => {
          this.logger.info(err.message)
          reject(err)
        })
        .on('close', () => {
          this.logger.info(`Generated release note at ${filename}`)
          resolve()
        })
    })
  }
}

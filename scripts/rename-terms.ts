import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

const termMappings = {
  'Gencast': 'Episode',
  'Gencasts': 'Episodes',
  'gencast': 'episode',
  'gencasts': 'episodes',
  'Show': 'Gencast',
  'Shows': 'Gencasts',
  'show': 'gencast',
  'shows': 'gencasts',
  'Topic': 'Source',
  'Topics': 'Sources',
  'topic': 'source',
  'topics': 'sources'
}

// Files to rename
const filesToRename = [
  { from: 'src/app/shows', to: 'src/app/gencasts' },
  { from: 'src/components/shows', to: 'src/components/gencasts' },
  { from: 'src/components/collections/ShowCollection.tsx', to: 'src/components/collections/GencastCollection.tsx' },
  { from: 'src/components/cards/show-card.tsx', to: 'src/components/cards/gencast-card.tsx' },
  { from: 'src/components/modals/show-detail.tsx', to: 'src/components/modals/gencast-detail.tsx' },
  { from: 'src/app/topics', to: 'src/app/sources' },
  { from: 'src/components/topics', to: 'src/components/sources' },
  { from: 'src/components/collections/TopicCollection.tsx', to: 'src/components/collections/SourceCollection.tsx' },
  { from: 'src/components/cards/topic-card.tsx', to: 'src/components/cards/source-card.tsx' },
  { from: 'src/components/modals/topic-detail.tsx', to: 'src/components/modals/source-detail.tsx' },
]

function replaceInFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  
  let content = fs.readFileSync(filePath, 'utf8')
  let modified = false

  for (const [from, to] of Object.entries(termMappings)) {
    const regex = new RegExp(from, 'g')
    if (content.match(regex)) {
      content = content.replace(regex, to)
      modified = true
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content)
    console.log(`Updated content in ${filePath}`)
  }
}

function processDirectory(dir: string) {
  const files = fs.readdirSync(dir)
  
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      // Skip node_modules and .git
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath)
      }
    } else if (file.match(/\.(ts|tsx|js|jsx|sql|md)$/)) {
      replaceInFile(fullPath)
    }
  }
}

// Main execution
console.log('Starting terminology transformation...')

// 1. Replace content in files
console.log('\nUpdating file contents...')
processDirectory('.')

// 2. Rename files and directories
console.log('\nRenaming files and directories...')
for (const { from, to } of filesToRename) {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to)
    console.log(`Renamed ${from} to ${to}`)
  }
}

console.log('\nTerminology transformation complete!')
console.log('\nNext steps:')
console.log('1. Review the changes in git diff')
console.log('2. Update database schema using Supabase migrations')
console.log('3. Test the application thoroughly')
console.log('4. Commit the changes')

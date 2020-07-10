import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'

const homeDirectory = path.join(process.cwd(), 'home')

export function getId() {
  // Get file names under /home
  const fileName = fs.readdirSync(homeDirectory)
  // Remove ".md" from file name to get id
  const id = fileName[0].replace(/\.md$/, '')

  // Read markdown file as string
  const fullPath = path.join(homeDirectory, fileName[0])
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  return {
    params : {
      ...matterResult.data, id}
  }
}


export function getAllPostIds() {
  const fileNames = fs.readdirSync(homeDirectory)

  return fileNames.map(fileName => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id) {
  const fullPath = path.join(homeDirectory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents)

  const processedContent = await remark()
  .use(html)
  .process(matterResult.content)
  const contentHtml = processedContent.toString()

  // Combine the data with the id
  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'
import { getRootPath } from '../utils'


const execAsync = promisify(exec)

export class TemplatesService {
  private templatesDir: string

  constructor() {
    this.templatesDir = path.join(getRootPath(), 'templates')
    this.ensureTemplatesDirExists()
  }

  private ensureTemplatesDirExists() {
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true })
    }
  }
  async isTemplateExists(templateName: string) {
    const templatePath = path.join(this.templatesDir, templateName)
    return fs.existsSync(templatePath)
  }

  async initializeBlogTemplate(templateName: string, templateUrl: string) {
    try {
      // Check if template already exists
      const templatePath = path.join(this.templatesDir, templateName)
      if (fs.existsSync(templatePath)) {
        return { success: true, message: 'Blog template already exists' }
      }

      // Add git submodule, use -f to force add paths ignored by gitignore
      await execAsync(
        `git submodule add -f ${templateUrl} templates/${templateName}`
      )

      return { success: true, message: 'Blog template added successfully' }
    } catch (error: any) {
      console.error('Failed to add blog template:', error)
      return { success: false, message: `Failed to add blog template: ${error.message}` }
    }
  }

  async updateBlogTemplate(templateName: string) {
    try {
      // Update submodule
      await execAsync(`git submodule update --remote templates/${templateName}`)
      return { success: true, message: 'Blog template updated successfully' }
    } catch (error: any) {
      console.error('Failed to update blog template:', error)
      return { success: false, message: `Failed to update blog template: ${error.message}` }
    }
  }
}

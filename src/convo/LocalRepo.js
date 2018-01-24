const fs = require('fs')
const path = require('path')
const debug = require('debug')('testmybot-LocalRepo')

const BaseRepo = require('./BaseRepo')

module.exports = class LocalRepo extends BaseRepo {
  constructor(convoDir) {
    this.convoDir = path.resolve(process.getCwd(), convoDir)
  }

  Validate () {
    return super.Validate().then(() => {
      fs.stat(this.convoDir, (err, stats) => {
        if (err) {
          throw new Error(`${this.convoDir} not available: ${err}`)
        }
        if (stats.isDirectory() && !stats.isSymbolicLink()) {
          fs.access(checkPath, fs.constants.W_OK, (err1) => {
            if (err) {
              throw new Error(`${this.convoDir} not writeable: ${err}`)
            } else {
              debug(`${this.convoDir} available and writeable`)
            }
          })
        } else {
          throw new Error(`${this.convoDir} not a regular directory`)
        }
      })
    })
  }
}

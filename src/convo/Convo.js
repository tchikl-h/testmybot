const _ = require('lodash')

const EOL = '\n'

class ConvoHeader {
  constructor (fromJson = {}) {
    this.locator = fromJson.locator
    this.name = fromJson.name
    this.description = fromJson.description
    this.filetype = fromJson.filetype || 'txt' // txt, yaml
  }
}

class Convo {
  constructor (fromJson = {}) {
    this.header = new ConvoHeader(fromJson.header)
    if (fromJson.conversation && _.isArray(fromJson.conversation)) {
      this.conversation = _.map(fromJson.conversation, (step) => new ConvoStep(step))
    } else {
      this.conversation = []
    }
  }

  static ParseTxt(header, content, repo) {
    return new Promise((resolve, reject) {
      var lines = content.split(EOL)

      var convo = {
        header: header,
        conversation: []
      }

      var currentLines = []
      var currentFrom = null
      var currentChannel = null
      lines.forEach((line) => {
        line = line.trim()
        if (!line) {
        } else if (line.startsWith('#')) {
          if (currentFrom && currentLines) {
            convo.conversation.push({
              from: currentFrom,
              channel: currentChannel,
              msg: parseMsg(currentLines)
            })
          } else if (!currentFrom && currentLines) {
            convo.name = currentLines[0]
            if (currentLines.length > 1) {
              convo.description = currentLines.slice(1).join(EOL)
            }
          }
          currentFrom = line.substr(1)
          currentChannel = null
          if (currentFrom.indexOf(' ') > 0) {
            currentChannel = currentFrom.substr(currentFrom.indexOf(' ') + 1).trim()
            currentFrom = currentFrom.substr(0, currentFrom.indexOf(' ')).trim()
          }
          currentLines = []
        } else {
          currentLines.push(line)
        }
      })
      if (currentFrom && currentLines) {
        convo.conversation.push({
          from: currentFrom,
          channel: currentChannel,
          msg: parseMsg(currentLines)
        })
      } else if (!currentFrom && currentLines) {
        convo.name = currentLines[0]
        if (currentLines.length > 1) {
          convo.description = currentLines.slice(1).join(EOL)
        }
      }

      if (convo.conversation.length === 0) {
        reject(new Error('empty conversation file ' + convofilename))
      } else {
        resolve(convo)
      }
      
      
      
    })
  }
}

class ConvoStep {
  constructor (fromJson = {}) {
    this.sender = fromJson.sender
    this.channel = fromJson.channel
    this.messageText = fromJson.messageText
    this.sourceData = fromJson.sourceData
  }
}

module.exports = {
  ConvoHeader,
  Convo,
  ConvoStep
}

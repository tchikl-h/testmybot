module.exports = class BaseRepo {
  constructor () {
  }
  Validate () {
    return Promise.resolve()
  }
  List() {
    throw new Error('not implemented')
  }
  Read(convoId) {
    throw new Error('not implemented')
  }
  Write(convo) {
    throw new Error('not implemented')
  }
}

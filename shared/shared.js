module.exports.EActionType = {
  DOC_CREATE: 'doc:create',
  DOC_DELETE: 'doc:delete',
  DOC_LOCK: 'doc:lock'
}
module.exports.ECollabActionType = {
  COLLAB_JOIN: 'COLLAB:JOIN',
  COLLAB_LEAVE: 'COLLAB:LEAVE',
  COLLAB_EDIT: 'COLLAB:EDIT',
}
module.exports.uuidv4 = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
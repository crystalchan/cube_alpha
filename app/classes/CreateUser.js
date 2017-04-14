let fb = require('../../config/firebaseConfig')
let client = require('../../config/faceConfig')
let writeFile = require('../singleFunction/writeFile')

class CreateUser {

  constructor({machineId, firstName, lastName, filePath, file} = {}){
    this._machineId = machineId
    this._userId = null
    this._filePath = filePath
    this._file = file

    this._userData = {
      profile : {
        firstName : firstName,
        lastName : lastName
      },
      settings : {
        location : 'Philadelphia'
      }
    }

  }

  performAction() {
    return new Promise(function (resolve, reject) {
      writeFile(this)
      .then(function () {
        return createPerson(this)
      })
      .then(function (obj) {
        return addToDatabase(obj)
      })
      .then(function () {
        resolve(null)
      })
      .catch(function (err) {
        reject(new Error(err))
      })
    })
  }
  
}

module.exports = CreateUser

let createPerson = function (obj) {
  let name = obj._userData.profile.firstName

  return new Promise (function (resolve, reject) {
    client.face.person.create(obj._machineId, name)
    .then(function(personInfo){
      obj._userId =  personInfo.personId
      return client.face.person.addFace(obj._machineId, personInfo.personId,{ path: obj._userFaceImg})
    })
    .then(function () {
      return client.face.personGroup.trainingStart(obj._machineId)
    })
    .then(function() {
      resolve(obj)
    })
    .catch(function(err){
      console.log(err)
      reject(new Error(err))
    })
  })
}

let addToDatabase = function (obj) {
  let updates = {}
  updates['/crystalCubes/'+obj._machineId+'/user/'+obj._userId] = obj._userData
  fb.database().ref().update(updates)
}




let Music = require('../app/classes/Music')
let News = require('../app/classes/News')
let Weather = require('../app/classes/Weather')
let CreateUser = require('../app/classes/CreateUser')
let GetUser = require('../app/classes/GetUser')
let MathAction = require('../app/classes/Math')
let todoslist = require('../app/classes/todolist')
let Twilio = require('../app/classes/Twilio')

class Action {
  constructor ({intent, data, userId, machineId}) {
    if(intent === 'news intent')
      return new News(data)

    else if(intent === 'weather intent')
      return new Weather(data)

    else if(intent === 'Create User')
      return new CreateUser(data)

    else if(intent === 'Get User')
      return new GetUser(data)

    else if(intent === 'music intent')
      return new Music(data)

    else if(intent === 'math intent')
      return new MathAction(data) 

    else if(intent === 'todolist intent')
      return new todoslist(userId, machineId)

    else if(intent === 'text intent')
      return new Twilio({data: data, userId: userId, machineId: machineId}) 
  }
}

module.exports = Action







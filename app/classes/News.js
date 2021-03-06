let request = require('superagent') 
let newsConfig = require('../../config/newsConfig')
let formStrings = require('../singleFunction/formString')
let moment = require('moment-timezone')

class News{
	constructor ({section}){
			this.date = new Date()
			this.Catalog = section || 'world'

			this.begindate = moment().tz('America/New_York').format('YYYYMMDD')
			this.fl = 'headline,lead_paragraph'
	}

	performAction() {
		let obj = this
		return new Promise(function (resolve,reject) {
			getNews(obj)
			.then(function (data) {
				return setResponse(obj, data)
			})
			.then(function (data) {
				resolve({response: data})
			})
			.catch(function (err) {
				reject(new Error(err))
			})

		})
	}
	
}
		
module.exports = News

let getNews = function(obj){

	return new Promise(function(resolve, reject){
		request
		.get(newsConfig.url)
		.query({'api-key': newsConfig.appId})
		.query({'q':obj.Catalog})
		.query({'begin_date': obj.begindate})
		.query({'fl': obj.fl})
		.end(function(err, res){
			(err || !res.ok)
				? reject(new Error(err))
      				: resolve(res)
    })
  })
}

let setResponse = function(obj,data){
	return Promise.resolve(function(){
			let objData = JSON.parse(data.text)
			objData = objData.response

			obj.Catalog = (obj.Catalog === 'world') ? 'The world' : obj.Catalog

			let out = {
				category: `In todays top news in ${obj.Catalog},`,
				paragraph: objData.docs[0].lead_paragraph
			}

			return formStrings(out)	
		}()
	)
}



const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser")
require('dotenv').config()

const configuration = new Configuration({
    organization: "org-houabAVEeb9uyWbxq82PacQT",
    apiKey: process.env.OPENAI_APIKEY,
});
const openai = new OpenAIApi(configuration);

// async function callApi(){
//     const response = await openai.createCompletion({
//         "model": "text-davinci-003",
//         "prompt": "Say this is a test",
//         "max_tokens": 7,
//         "temperature": 0,
//       }
//       )
//     console.log(response.data.choices[0].text)
// }



//create an express api that calls the above fn


const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 8000
app.post('/', async (req, res) => {
    const {message, currentModel} = req.body;
    //console.log(message)
    // console.log("current model is: ", currentModel)
    // console.log("Message is : ",message)
    
    try{
      const response = await openai.createCompletion({
        "model": `${currentModel}`,
        "prompt": `${message}`,
        "max_tokens": 100,
        "temperature": 0.5,
      })
      //console.log(response.data.choices[0].text)
      res.json({
        message: response.data.choices[0].text
      })
    }catch(err){
      console.log(err.message)
      res.json({
        message: "Model not found. Please Try a different Model"
      })
    }
    
})

app.get('/models', async (req, res) => {
  const response = await openai.listEngines()
  //console.log(response.data.data)
  res.json({
    models: response.data.data
  })
})

app.listen(port, () => console.log(`server running on port ${port}`))
const axios = require("axios");

async function getAIReply(prompt) {
  const apiKey =
    "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";
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
    },
    {
      headers: {
        Authorization: `Bearer `, //Informal Citation: Used AI to create the circle stylings
        apiKey, //Informal Citation: Used AI to create the circle stylings
        "Content-Type": "application/json", //Informal Citation: Used AI to create the circle stylings
      },
    }
  );
  return response.data.choices[0].message.content; //Informal Citation: Used AI to figure out how to access the OpenAI API and get a response
}

module.exports = getAIReply;

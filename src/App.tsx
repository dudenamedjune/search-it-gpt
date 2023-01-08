import type { Component } from 'solid-js';
import Search from './Search';
import { Configuration, OpenAIApi } from "openai";

import type {
  ISearchRepository
} from './Search'



const App: Component = () => {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  });

  const openAiClient = new OpenAIApi(configuration);
  const SearchRepository: ISearchRepository = {
    search: async (prompt) => {
      const response = await openAiClient.createCompletion({
        model: "text-davinci-003",
        temperature: 0.9,
        max_tokens: 800,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        prompt,
        stop: ["Human:", "AI:"],
      })
      const urlMatches = response.data.choices[0].text?.match(/\bhttps?:\/\/\S+/gi) || []; // Iterate over each URL to get their body HTML 
      urlMatches.forEach(async url => {
        try {
        } catch {
          console.log("error")
        }
      });
      console.log(response.data.choices[0].text?.split('\n'))

      return response;
    }
  }
  return (
    <div style={{
      display: "flex",
      "flex-direction": "column",
      margin: "3rem",
    }}>
      <div style={{
        height: "100%",
        width: "100%",
      }}>
        <div style={{ "text-align": "left" }}>
          <h1>Hi, I know this is different but if you talk to me like a human...</h1>
        </div>
        <div style={{ "text-align": "right" }}>
          <h1> bye Google.</h1>
        </div>
      </div>
      <Search client={SearchRepository} />

    </div>
  );
};

export default App;

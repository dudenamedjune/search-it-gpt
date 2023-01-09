import type { Component } from 'solid-js';
import Search from './Search';


import type {
  ISearchRepository
} from './Search'



const App: Component = () => {
  const SearchRepository: ISearchRepository = {
    search: async (prompt) => {
      const response = await fetch("/.netlify/functions/openAi", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      });
      return response.json();
    }
  }
  return (
    <div style={{
      display: "flex",
      "flex-direction": "column",
      margin: "3rem",
    }} >
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

    </div >
  );
};

export default App;

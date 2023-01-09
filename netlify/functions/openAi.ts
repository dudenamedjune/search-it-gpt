import { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { Configuration, OpenAIApi } from "openai";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
    const prompt = JSON.parse(event.body || "{}").prompt;
    console.log(prompt)
    const configuration = new Configuration({
        apiKey: process.env.VITE_OPEN_AI_API_KEY,
        // apiKey: "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"
    });
    const openAiClient = new OpenAIApi(configuration);
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
    console.log(response)
    return {
        statusCode: 200,
        body: JSON.stringify({ data: response.data }),
    };
};

export { handler };

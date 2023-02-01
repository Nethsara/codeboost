import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function fetchCodeCompletions(prompt: string) {
  console.log("generating");

  try {
    const response = await openai.createCompletion({
      model: process.env.model,
      prompt: prompt as openai.CreateCompletionRequestPrompt,
      max_tokens: parseInt(process.env.max_tokens),
      temperature: parseInt(process.env.temperature),
      stop: ["\n\n"],
    });

    const choices = await response.data.choices;
    if (Array.isArray(choices)) {
      const completions = Array<string>();
      for (let i = 0; i < choices.length; i++) {
        const completion = choices[i].text?.trimStart();
        if (completion === undefined) {
          continue;
        }
        if (completion?.trim() === "") {
          continue;
        }

        completions.push(completion);
      }
      return { completions };
    } else {
      throw new Error("Error");
    }
  } catch (err) {
    throw err;
  }
}

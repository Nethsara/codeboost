import { Configuration, OpenAIApi } from "openai";
export type FetchCodeCompletions = {
  completions: Array<string>;
};

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export function fetchCodeCompletions(
  prompt: string
): Promise<FetchCodeCompletions> {
  return new Promise((resolve, reject) => {
    const response = openai.createCompletion({
      model: process.env.model,
      prompt: prompt as openai.CreateCompletionRequestPrompt,
      max_tokens: parseInt(process.env.max_tokens),
      temperature: parseInt(process.env.temperature),
      stop: ["\n\n"],
    });

    return response
      .then((res) => res.data.choices)
      .then((choices) => {
        if (Array.isArray(choices)) {
          const completions = Array<string>();
          for (let i = 0; i < choices.length; i++) {
            const completion = choices[i].text?.trimStart();
            if (completion === undefined) continue;
            if (completion?.trim() === "") continue;

            completions.push(completion);
          }
          console.log(completions);
          resolve({ completions });
        } else {
          console.log(choices);
          throw new Error("Error");
        }
      })
      .catch((err) => reject(err));
  });
}

import * as vscode from "vscode";
// eslint-disable-next-line @typescript-eslint/naming-convention
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "apium-code.helloWorld",
    async () => {
      console.log(process.env.OPENAI_API_KEY);

      const editor = vscode.window.activeTextEditor;

      if (!editor) {
        vscode.window.showErrorMessage("No Editor Found!");
        return;
      }

      const text = editor.document.getText(editor.selection);
      const response = await openai.createCompletion({
        model: process.env.model,
        prompt: text,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        max_tokens: parseInt(process.env.max_tokens),
        temperature: parseInt(process.env.temperature),
      });
      console.log(response);

      const data = response.data.choices[0].text;
      console.log(data);
      editor.edit((edit) => {
        edit.replace(editor.selection, data);
      });
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

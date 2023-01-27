import * as vscode from "vscode";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.workspace.onDidChangeTextDocument(async (event) => {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
      let doc = editor.document;
      let text = doc.getText();
      let line = editor.selection.active.line;
      let language =
        editor.document.languageId === "plaintext"
          ? ""
          : editor.document.languageId;

      if (text.includes("??")) {
        let lineText = editor.document.lineAt(line).text.replace("??", "");

        console.log(lineText);
        const start = new vscode.Position(line, 0);
        const end = new vscode.Position(line, lineText.length + 2);
        const range = new vscode.Range(start, end);

        console.log(end);

        setTimeout(() => {
          vscode.window.setStatusBarMessage("Generating code, please wait...");
        }, 1000);

        const response = await openai.createCompletion({
          model: process.env.model,
          prompt: `${lineText} in ${language}`,
          max_tokens: parseInt(process.env.max_tokens),
          temperature: parseInt(process.env.temperature),
        });

        let code = response.data.choices[0].text.trimStart();
        code = code.replace("??", "");

        console.log(code);

        editor.edit((edit) => {
          edit.replace(range, code);
        });

        vscode.window.setStatusBarMessage("Code generated successfully!");
      }
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

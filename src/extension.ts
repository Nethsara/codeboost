import * as vscode from "vscode";
import { fetchCodeCompletions } from "./util/generateCode";
import CSConfig from "./config";


export async function activate(context: vscode.ExtensionContext) {
  console.log("I am running");

  const provider: vscode.CompletionItemProvider = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    provideInlineCompletionItems: async (document, position) => {
      const textBeforeCursor = document.getText();
      if (textBeforeCursor.trim() === "") {
        return { items: [] };
      }
      const currLineBeforeCursor = document.getText(
        new vscode.Range(position.with(undefined, 0), position)
      );

      // Check if user's state meets one of the trigger criteria
      if (
        CSConfig.SEARCH_PHARSE_END.includes(
          textBeforeCursor[textBeforeCursor.length - 1]
        ) ||
        currLineBeforeCursor.trim() === ""
      ) {
        let rs;
        setTimeout(() => {
          vscode.window.setStatusBarMessage("Generating code, please wait...");
        }, 1000);
        try {
          rs = await fetchCodeCompletions(textBeforeCursor);
        } catch (err) {
          if (err instanceof Error) {
            vscode.window.showErrorMessage(err.toString());
          }
          return { items: [] };
        }

        if (rs === null) {
          return { items: [] };
        }

        // Add the generated code to the inline suggestion list
        const items: any[] = [];
        console.log("Adding code snippets inline");

        for (let i = 0; i < rs.completions.length; i++) {
          console.log("adding", rs.completions[i]);

          items.push({
            insertText: rs.completions[i],
            range: new vscode.Range(
              position.translate(0, rs.completions.length),
              position
            ),
            trackingId: `snippet-${i}`,
          });
        }
        vscode.window.setStatusBarMessage("Code generated successfully!");

        return { items };
      }
      return { items: [] };
    },
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  vscode.languages.registerInlineCompletionItemProvider(
    { pattern: "**" },
    provider
  );

}

export function deactivate() {}

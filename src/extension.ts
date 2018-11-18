'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

   // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "FixConst" is now active!');
    // create a new word counter
    const controller = new FixConstController;
    context.subscriptions.push(controller);
}

// this method is called when your extension is deactivated
export function deactivate() {
}

class FixConstController {
    private _disposable: vscode.Disposable;

    constructor() {
        // subscribe to selection change and editor activation events
        const subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // create a combined disposable from both event subscriptions
        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    private _onEvent() {
        const cosnt = 'cosnt';
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const doc = editor.document;
        let text = doc.getText();
        let index = text.indexOf(cosnt);
        if (index < 0) {
            return;
        }
        const edit = new vscode.WorkspaceEdit();
        const range = new vscode.Range(doc.positionAt(index), doc.positionAt(index + cosnt.length));
        edit.replace(doc.uri, range, 'const');
        return vscode.workspace.applyEdit(edit);
    }

    public dispose() {
        this._disposable.dispose();
    }
}

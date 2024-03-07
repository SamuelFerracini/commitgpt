#!/usr/bin/env node
import { spawn } from "child_process";

import enquirer from "enquirer";
import ora from "ora";

import { ChatGPTClient } from "./client.js";
import { loadPromptMessageEnhancerTemplate } from "./config_storage.js";
import { getJiraIssueNumberFromBranch } from "./jiraIssueExtractor.js";

const spinner = ora();

const debug = (...args: unknown[]) => {
  if (process.env.DEBUG) {
    console.debug(...args);
  }
};

run()
  .then(() => {
    process.exit(0);
  })
  .catch((e: Error) => {
    console.log("Error: " + e.message, e.cause ?? "");
    process.exit(1);
  });

async function promptMessage() {
  try {
    const answer = await enquirer.prompt<{ message: string }>({
      type: "input",
      name: "message",
      message: "Write your commit message to be enhanced:",
    });

    return answer.message;
  } catch (e) {
    console.log("Aborted.");
    process.exit(1);
  }
}

async function run() {
  const message = await promptMessage();

  if (message.trim().length === 0) {
    console.log("No message provided");
    return;
  }

  const jiraIssueNumber = getJiraIssueNumberFromBranch();

  const api = new ChatGPTClient();

  const prompt = loadPromptMessageEnhancerTemplate()
    .replace("{{commitMessage}}", message)
    .replace("{{jiraIssueNumber}}", jiraIssueNumber);

  const choices = await getMessages(api, prompt);

  try {
    const answer = await enquirer.prompt<{ message: string }>({
      type: "select",
      name: "message",
      message: "Pick a message",
      choices,
    });

    const proc = spawn("pbcopy");
    proc.stdin.write(answer.message);
    proc.stdin.end();

    console.log("Commit message copied for your area");
  } catch (e) {
    console.log("Aborted.");
    console.log(e);
    process.exit(1);
  }
}

async function getMessages(api: ChatGPTClient, request: string) {
  spinner.start("Asking ChatGPT 🤖 for commit messages...");

  // send a message and wait for the response
  try {
    const response = await api.getAnswer(request);
    // find json array of strings in the response
    const messages = response.split("\n").filter((l) => l.length > 1);

    spinner.stop();

    debug("response: ", response);

    return messages;
  } catch (e) {
    spinner.stop();
    if (e.message === "Unauthorized") {
      return getMessages(api, request);
    } else {
      throw e;
    }
  }
}

#!/usr/bin/env node
import { execSync } from "child_process";

// Function to extract Jira issue number from branch name
function extractJiraIssueNumber(branchName: string) {
  const regex = /(?:^|\W)([A-Z]{1,10}-\d+)(?:$|\W)/g; // Jira issue number pattern
  const match = regex.exec(branchName);
  return match ? match[1] : null;
}

// Function to get the current branch name using Git command
function getCurrentBranchName() {
  try {
    const branchName = execSync("git rev-parse --abbrev-ref HEAD")
      .toString()
      .trim();
    return branchName;
  } catch (error) {
    console.error("Error occurred while getting current branch name:", error);
    return null;
  }
}

// Main function to extract Jira issue number from current branch name
export function getJiraIssueNumberFromBranch() {
  const branchName = getCurrentBranchName();

  if (!branchName) return;

  return extractJiraIssueNumber(branchName);
}

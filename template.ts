export const defaultPromptTemplate = [
  "suggest 10 commit messages based on the following diff:",
  "{{diff}}",
  "",
  "commit messages should:",
  " - follow conventional commits",
  " - message format should be: <type>[scope]: <description>",

  "",
  "examples:",
  " - fix(authentication): add password regex pattern",
  " - feat(storage): add new test cases",
].join("\n");

export const defaultMessageEnhancerTemplate = [
  "Enhance the following commit message related to the jira issue number {{jiraIssueNumber}} and give 10 outputs for the following commit message:",
  "{{commitMessage}}",
  "",
  "The commit messages should:",
  " - be grammatically correctly",
  " - be clear and effective",
  " - be short-medium size",
  " - follow the standard: JIRA_ISSUE_NUMBER: <description>",
  "",
  "If jira issue number is null, remove it ",
  "",
  "examples:",
  " - A20-5930: add password regex pattern",
  " - FN-80: create page for users to login in",
  " - RM-7: fix issue where users can't login in",
].join("\n");

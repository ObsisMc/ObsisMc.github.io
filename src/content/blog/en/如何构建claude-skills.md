---
categories: [AI-native Coding]
date: 2026-03-18 14:18:09.160000+00:00
draft: false
excerpt: Claude Skills is a mechanism for teaching Claude automated workflows through
  structured files (SKILL.md plus optional scripts, reference docs, and more). This
  article covers the file structure and design principles of a Skill, how to test
  trigger behavior and functionality, and how to distribute and share Skills with
  others.
fmContentType: blog-en
path_name: build-claude-skill
tags: [AI-native Coding]
title: How to Build Claude Skills
---

This article is a set of notes based on Claude's [The-Complete-Guide-to-Building-Skill-for-Claude](https://resources.anthropic.com/hubfs/The-Complete-Guide-to-Building-Skill-for-Claude.pdf).

## Fundamentals

A Skill is primarily composed of the following files and folders:
- SKILL.md (required): Instructions in Markdown with YAML frontmatter
- scripts/ (optional): Executable code (Python, Bash, etc.)
- references/ (optional): Documentation loaded as needed
- assets/ (optional): Templates, fonts, icons used in output


### Progressive Disclosure

- Layer 1 — YAML frontmatter: The YAML block at the top of SKILL.md describes the skill's name, description, and other metadata; Claude checks this first.
- Layer 2 — SKILL.md body: If Claude determines the first layer matches the current task, it reads the rest of SKILL.md.
- Layer 3 — Additional files: If needed, Claude reads other files such as those in references/ and assets/.

### Relationship Between MCP and Skills

![mcp_skill](/如何构建claude-skills/mcp_skill.png)

MCP provides the tools, while Skills tell the AI which tools to use to automate a workflow.

## Planning and design

How to design a Skill.

Start by thinking through:
- What task needs to be accomplished
- What steps the workflow involves
- What tools are required
- What domain knowledge or best practices are needed

### Skill File Structure

```text
your-skill-name/
├── SKILL.md # Required - main skill file
├── scripts/ # Optional - executable code
│ ├── process_data.py # Example
│ └── validate.sh # Example
├── references/ # Optional - documentation
│ ├── api-guide.md # Example
│ └── examples/ # Example
└── assets/ # Optional - templates, etc.
 └── report-template.md # Example
```

README.md must not be placed inside the skill folder.

### SKILL.md

Minimum required format:
```yaml
---
name: your-skill-name
description: What it does. Use when user asks to [specific
phrases].
---
```

Fields:
- name (required): kebab-case only; must match the folder name
- description (required):
    - What the skill does
    - When to trigger it
- compatibility (optional): Describes environment requirements, etc.
- metadata (optional): Describes the author and other metadata
    - ```yaml
        metadata:
            author: ProjectHub
            version: 1.0.0 mcp-server: projecthub 
      ```
- license (optional): Open-source license


**How to write the description**

Format: `[What it does] + [When to use it] + [Key capabilities]`

Some examples:

```text
# Good - specific and actionable
description: Analyzes Figma design files and generates
developer handoff documentation. Use when user uploads .fig
files, asks for "design specs", "component documentation", or
"design-to-code handoff".

# Bad - Missing triggers
description: Creates sophisticated multi-page documentation
systems.

```

You can refer to the following Skill examples for guidance:
- [Skill Creator](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) 
- [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design)
- [sentry](https://github.com/getsentry/sentry-for-ai/tree/main/skills)


## Testing and iteration

This section covers how to test and iterate on your Skills. It is recommended to use the [Skill Creator skill](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) to generate your own Skill.


There are three main areas to test:
- Trigger timing
- Functional behavior
- Performance

### Trigger Timing Tests

The goal is to observe whether the Skill triggers at the right time. Test cases fall into two categories: requests that should trigger the Skill, and requests that should not. Examples:

```text
Should trigger:
- "Help me set up a new ProjectHub workspace"
- "I need to create a project in ProjectHub"
- "Initialize a ProjectHub project for Q4 planning"
Should NOT trigger:
- "What's the weather in San Francisco?"
- "Help me write Python code"
- "Create a spreadsheet" (unless ProjectHub skill handles
sheets)
```

### Functional Tests

Verify that the Skill can complete its intended task. Key things to observe:
- Whether the output is correct
- Whether API calls succeed
- Error handling
- Coverage of edge cases

### Performance Tests

Non-functional metrics to evaluate, for example:

```text
Without skill:
- User provides instructions each time
- 15 back-and-forth messages
- 3 failed API calls requiring retry
- 12,000 tokens consumed

With skill:
- Automatic workflow execution
- 2 clarifying questions only
- 0 failed API calls
- 6,000 tokens consumed

```

A Skill still needs to be continuously iterated upon — fix and update the instructions for every failure until it reaches a high level of quality.


## Distribution and sharing

How to use others' Skills and share your own.

### The Manual Way

- Acquiring Skills:
    - Download the skill folder or archive from online sources such as GitHub
    - Write your own locally
- Using Skills:
    - Locally: place the Skill in `.claude/skills/` under the current project or user directory
    - Claude.ai: upload via Settings > Capabilities > Skills


### Automated: Plugin & Marketplace

**Getting and using Skills**

To use Skills via the Claude Code VS Code UI:
1. First add a Marketplace: `show command menu -> Manage plugins -> Marketplaces -> Add`
2. Then install plugins from that Marketplace: `Manage plugins -> Plugins` — search for or select the plugin you want and install it


**Sharing your own Skills**

Set up your own Marketplace to share your Skills with others.

The simplest approach is shown below. Keep the folder structure consistent — plugins are declared implicitly in `marketplace.json` (so there is no need to create a separate folder for each plugin). You can refer to [anthropics/skills](https://github.com/anthropics/skills) as a reference.

```txt

your-marketplace/                ← repository root
├── .claude-plugin/
│   └── marketplace.json         ← Marketplace definition (plugins declared here)
├── skills/                      ← all skills go here
│   └── hello/
│       └── SKILL.md
│   └── greet/
│       └── SKILL.md
├── .gitignore
└── README.md
```

The most important file is `marketplace.json`, whose format is as follows:
```json
{
  "name": "obsismc-marketplace", // your marketplace name
  "owner": {
    "name": "ObsisMc"
  },
  "metadata": {
    "description": "A collection of agent skills by ObsisMc, compatible with Claude Code and other Agent Skills-compatible tools."
  },
  "plugins": [
    {
      "name": "test-skills",  // your plugin name
      "source": "./",         // set the base path
      "strict": false,
      "description": "A collection of useful agent skills",
      "skills": [
        "./skills/hello",     // your skill paths
        "./skills/greet"    
      ]
    }
  ]
}
```
Once pushed to GitHub, others can use your Marketplace, and your skill names will follow the pattern `/test-skills:hello`.


### Other Tips

Writing the README: **Focus on what the Skill produces, not how it works**

✅ Good:
```text
"The ProjectHub skill enables teams to set up complete project
workspaces in seconds — including pages, databases, and
templates — instead of spending 30 minutes on manual setup."
```

❌ Bad:
```text
"The ProjectHub skill is a folder containing YAML frontmatter
and Markdown instructions that calls our MCP server tools."
```

Highlight the MCP + skills story:
```text
"Our MCP server gives Claude access to your Linear projects.
Our skills teach Claude your team's sprint planning workflow.
Together, they enable AI-powered project management."
```


## Patterns and troubleshooting

Refer to the original document when you encounter specific issues.
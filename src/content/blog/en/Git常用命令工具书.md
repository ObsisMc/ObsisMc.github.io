---
date: 2026-02-01 11:57:20
draft: false
excerpt: This article compiles the most commonly used Git commands for day-to-day development, covering branch management, remote pushing, interactive rebase for editing commit history, and submodule operations including adding, initializing, and updating — a handy quick-reference guide.
path_name: git-common-commands
tags:
- Git
title: Git Common Commands Reference
---

A collection of frequently used Git commands for quick reference.

## pull

#### Fetch a branch that doesn't exist locally
Fetch a remote branch that you don't have locally, associate it with a new local branch, and switch to it:

```shell
git fetch // fetch first
git checkout -b <new_local_branch> <remote_name>/<remote_branch>
```


## push

#### Link a branch and push
Push a local branch to a remote branch (automatically creating the remote branch if it doesn't exist), and set up tracking between them:
```shell
// when the local and remote branch names are the same
git push -u <remote_name> <branch>

```

## branch

#### Delete a branch

```shell
// delete a local branch
git branch -d <branch_name>

// force-delete a branch that hasn't been merged
git branch -D <branch_name>

// delete a remote branch
git push <remote_name> --delete <branch_name>
```

## rebase

#### Edit a specific commit in history

```shell
// 1. Find the commit_id you want to modify, then start an interactive rebase
git rebase -i <commit_id>^

// 2. Change "pick" to "edit" for the target commit, then save and exit
// 3. You are now paused at the target commit — make your changes, then stage them
// 4. Amend the commit
git commit --amend
// 5. Continue the rebase
git rebase --continue

```


## submodule

#### Add a submodule to a repository
```shell
// Add another remote repository as a submodule to the current repo (you can specify a local_path); the source code will be placed directly under local_path without an extra layer of the repo name
git submodule add <remote_repository_url> [<local_path>]

// A .gitmodules file and the specified path will appear — remember to commit them
git add .gitmodules <local_path>
git commit -m "Add submodule"
```

#### Initialize a submodule
```shell
// Initialize submodules at the same time as pulling the main repository
git pull --recurse-submodules

// If submodules were not pulled, initialize all submodules manually
git submodule update --init --recursive
```


#### Update a submodule
```shell
git submodule update --remote
```
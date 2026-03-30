---
date: 2026-02-01 11:57:20
draft: false
excerpt: This article compiles the most commonly used Git commands for day-to-day development, covering branch management, remote pushing, interactive rebase for editing commit history, and submodule operations including adding, initializing, and updating — a handy quick-reference guide.
path_name: git-common-commands
categories:
- Git
title: Git Common Commands Reference
---

A collection of frequently used Git commands for quick reference.

## pull

### Fetch a branch that doesn't exist locally
Fetch a remote branch that you don't have locally, associate it with a new local branch, and switch to it:

```shell
git fetch // fetch first

// full command
git checkout -b <new_local_branch> <remote_name>/<remote_branch>
// shorthand — when the local branch name matches the remote branch name
git checkout <remote_branch>
```


## push

### Link a branch and push
Push a local branch to a remote branch (automatically creating the remote branch if it doesn't exist), and set up tracking between them:
```shell
// when the local and remote branch names are the same
git push -u <remote_name> <branch>

```

## branch

### Delete a branch

```shell
// delete a local branch
git branch -d <branch_name>

// force-delete a branch that hasn't been merged
git branch -D <branch_name>

// delete a remote branch
git push <remote_name> --delete <branch_name>
```

## rebase

### Edit a specific commit in history

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

### Add a submodule to a repository
```shell
// Add another remote repository as a submodule to the current repo (you can specify a local_path); the source code will be placed directly under local_path without an extra layer of the repo name
git submodule add <remote_repository_url> [<local_path>]

// A .gitmodules file and the specified path will appear — remember to commit them
git add .gitmodules <local_path>
git commit -m "Add submodule"
```

### Fetch/Update a submodule

> ❗There are two important commit hashes to be aware of with submodules:
> - The submodule version recorded by the main project
> - The latest version on the submodule's own remote repository



`git pull` does not fetch or initialize submodules by default — you need to pass extra flags:
```shell
// Pull the submodule version recorded by the main project
git pull --recurse-submodules
```

More commonly, you'll update submodules manually:

```shell
// Update to the commit hash recorded by the main project
// skips submodules that havent been init
git submodule update

// Update to the commit hash recorded by the main project
// (initializes any uninitialized submodules before updating)
git submodule update --init

// Also update nested submodules
git submodule update --recursive

// Update to the latest remote version of each submodule,
// ignoring the hash recorded by the main project
git submodule update --remote
```

❗After updating a submodule (i.e., its hash in the main project has changed), always remember to commit that hash change in the main project.


#### Update a submodule
```shell
git submodule update --remote
```
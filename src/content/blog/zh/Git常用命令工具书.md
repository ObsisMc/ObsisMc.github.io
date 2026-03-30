---
date: 2026-02-01 11:57:20
draft: false
excerpt: 本文整理了 Git 日常开发中最常用的命令，涵盖分支管理、远程推送、交互式 rebase 修改历史提交，以及子模块的添加、初始化与更新操作，适合作为快速查阅的实用参考手册。
path_name: git-common-commands
categories:
- Git
title: Git常用命令工具书
---

记录一些常用的Git命令，方便查阅。

## pull

### 拉取本地没有的分支
从远程pull本地没有的分支，同时关联本地分支与远程分支，然后切换到该分支：

```shell
git fetch // 先fetch

// 完整命令
git checkout -b <new_local_branch> <remote_name>/<remote_branch>
// 简略命令，本地分支和远程的名字一致
git checkout <remote_branch>
```


## push

### 关联分支并推送
push 本地分支 到 远程分支（如果远程没有该分支则自动创建一个），且将本地分支与远程分支关联起来：
```shell
// 本地分支和远程分支名一样
git push -u <remote_name> <branch>

```

## branch

### 删除分支

```shell
// 删除本地分支
git branch -d <branch_name>

// 强制删除未merge的分支
git branch -D <branch_name>

// 删除远程分支
git push <remote_name> --delete <branch_name>
```

## rebase

### 修复历史中某个commit

```shell
// 1. 找到需要修改的commit_id，然后执行交互式rebase
git rebase -i <commit_id>^

// 2. 将需要修改的commit前的pick改为edit，保存退出
// 3. 现在在目标commit上，进行修改，然后add
// 4. amend
git commit --amend
// 5. 继续rebase
git rebase --continue

```


## submodule

### 给仓库添加子模块
```shell
// 将远程其他仓库作为子模块添加到当前仓库中（可以指定保存路径local_path），local_path下面就是源代码，不会再套一层仓库名
git submodule add <remote_repository_url> [<local_path>]

// 然后会出现 .gitmodules 文件和你指定的文件路径，记得提交
git add .gitmodules <local_path>
git commit -m "Add submodule"
```

### 拉取/更新 submodule

> ❗submodule有两个重要的commit hash
> - 主项目记录的submodule版本
> - submodule远程仓库本身的最新版本



Pull默认不拉取/不初始化子模块，需要添加参数才会拉取
```shell
// 拉取主项目记录的submodule
git pull --recurse-submodules
```

常用的还是手动更新，如下

```shell
// 以主项目记录的hash为准，更新到该commit
// 但是会跳过没初始化的submodule
git submodule update

// 以主项目记录的hash为准，更新到该commit
// 没初始化的submodule会被初始化并更新
git submodule update --init

// 同时更新嵌套的submodule
git submodule update --recursive

// 以子模块远程最新为准，忽略主项目记录的 hash
git submodule update --remote
```

❗每次更新子模块（submodule在主项目中的hash变了）后，一定记得要在主项目中commit这次commit hash的变化。
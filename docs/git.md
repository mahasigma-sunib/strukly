# Git

## Starting New Feature

You must create a new branch for each feature you work on. This helps keep your code organized and makes it easier to merge changes back into the master branch.

### 1. Create a New Branch

```sh
git branch BRANCH_NAME
```

This will create a new branch with the name `BRANCH_NAME`.
Created from the current active branch.

### 2. Switch Branches

```sh
git checkout BRANCH_NAME
```

This will switch to the branch with the name `BRANCH_NAME`.

### 3. Push Branch for The First Time

```sh
git push -u origin BRANCH_NAME
```

This will push the new branch to the remote repository.


## Merging Feature to master

Create a pull request to merge from your branch to master.

Wait for a review and merge.

After it is merged to master you may fast-forward your branch.

## Fast Forward Branch

After merging your branch to `master`, you can fast-forward your branch to the latest changes in `master`.

**(Make sure the active branch is your branch.)**

```sh
git fetch --all
git merge origin/master 
```

(This keeps your branch up-to-date with the latest changes in `master`.)

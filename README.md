## Development

Clone the repository!

```sh
git clone https://github.com/mahasigma-sunib/strukly.git
```

### Starting on a new feature

First create a separate branch

```sh
git branch <BRANCH_NAME>
```

Activate your new branch.

```sh
git checkout <BRANCH_NAME>
```

Then push the branch

```sh
git push -u origin <BRANCHNAME>
```

### Merging your feature

Create a pull request to merge from your branch to master.

Wait for a review and merge.

After it is merged to master you may fast-forward your branch. (Make sure the active branch is your branch.)

```sh
git fetch --all
git merge origin/master 
```

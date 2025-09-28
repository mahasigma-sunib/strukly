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

### Running the Backend

#### Docker

If you are not going to be working on the backend (you're working on the frontend and you just need the APIs to be up),
you can start the backend server using docker:

(make sure your active directory is in the project root and not strukly-backend)

```sh
docker compose up -d
```

If you're done you can just run:

```sh
docker compose down
```

#### Local run without Docker

If you are working on the backend and need live reload:

Ensure you have a postgres server running and set `strukly-backend/.env` environment variables.

```sh
cd strukly-backend
npm i
npx prisma generate
npx prisma migrate dev
```

Run the server in dev mode with live reload.

```sh
npm run dev
```

### Running the Frontend

```sh
cd strukly-frontend
```

```sh
npm i
```

```sh
npm run dev
```
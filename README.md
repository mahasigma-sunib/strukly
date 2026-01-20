# Koinku

The frontend is currently deployed to [koinku.my.id](https://koinku.my.id/)!

## Development

Clone the repository!

```sh
git clone https://github.com/mahasigma-sunib/strukly.git
```

### Running the Backend

#### Docker

If you are not going to be working on the backend (you're working on the frontend and you just need the APIs to be up),
you can start the backend server using docker:

(make sure your active directory is in the project root and not strukly-backend)


> [!IMPORTANT]  
> Make sure `.env` file is present.

```sh
docker compose up -d
```

If there were changes to the backend code, please run with `--build` flag.

To turn off the backend server:

```sh
docker compose down
```

#### Running The Backend Without Docker

If you are working on the backend and need live reload:

1. Ensure you have a postgres server running
2. Set `strukly-backend/.env` environment variables.

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

### Running The Frontend

Make sure `.env` file is present in `strukly-frontend/`.

```sh
cd strukly-frontend
```

```sh
npm i
```

```sh
npm run dev
```

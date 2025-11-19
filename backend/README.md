# Koi Backend

Backend service for the Koi budgeting app, built with FastAPI and SQLModel.

## Prerequisites

- Python 3.10+
- [uv](https://github.com/astral-sh/uv) (recommended for package management)

## Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    uv sync
    ```

## Running Locally

Start the development server:

```bash
uv run fastapi dev src/main.py
```

The API will be available at `http://localhost:8000`.
Interactive docs: `http://localhost:8000/docs`.

## Running Tests

To run the test suite:

```bash
PYTHONPATH=. uv run pytest
```

## Deployment

### Environment Variables

Set the following environment variables in your production environment:

- `DATABASE_URL`: Connection string for PostgreSQL (e.g., `postgresql://user:pass@host:5432/dbname`). If not set, defaults to SQLite.
- `SECRET_KEY`: Secret key for JWT signing. **Change this in production!**

### Production Server

Run using `fastapi run` (uses Gunicorn/Uvicorn under the hood):

```bash
uv run fastapi run src/main.py --port 8000
```

### Docker

1.  Build the image:
    ```bash
    docker build -t koi-backend .
    ```
2.  Run the container:
    ```bash
    docker run -p 8000:8000 -e DATABASE_URL=postgresql://... -e SECRET_KEY=... koi-backend
    ```

# Taste Finder

Taste Finder is a web application designed to recommend dishes based on how users are feeling. It features a friendly chef-themed frontend interface where users can input their mood, and a backend API that processes the input to suggest cuisines and recipes.

## Features

- **Mood-based Food Recommendation**: Users tell how they feel, and the app suggests a suitable dish.
- **Two-step Backend Process**: First recommends a cuisine, then provides a recipe for that cuisine.
- **Separation of Backend and Frontend**: FastAPI backend (Python) and static frontend (HTML/JS/CSS).

## File Structure

```
.
├── app/
│   ├── Taste_BackEnd/       # Backend (FastAPI)
│   │   ├── main.py
│   │   ├── core/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── routers/
│   │   └── utility/
│   └── Taste_FrontEnd/      # Frontend (Static Web)
│       ├── config.js        # Frontend config (set backend API URLs here)
│       ├── favicon.ico
│       ├── index.html       # Main web page
│       ├── script.js        # Frontend logic
│       └── style.css        # Styling
├── .env.sample             # Sample environment variables for backend
├── README.md
├── requirements.txt
├── pyproject.toml
├── uv.lock
└── .gitignore
```

## Getting Started

### 1. Backend (API)

The backend is a FastAPI application located in the `app/Taste_BackEnd/` directory.

#### **Setup**

1. Copy the sample environment file and edit as needed:

    ```bash
    cp app/Taste_BackEnd/.env.sample app/Taste_BackEnd/.env
    # Edit .env with your OpenAI API key and other settings
    ```

2. Install dependencies (recommended: use a virtual environment):

    ```bash
    pip install -r requirements.txt
    # or if using poetry:
    poetry install
    ```

#### **Run the API server**

Start the API server (default port: **8000**):

```bash
uvicorn app.Taste_BackEnd.main:app --host 0.0.0.0 --port 8000
```

The API will be available at: [http://localhost:8000](http://localhost:8000)

---

### 2. Frontend (Static Web)

The frontend is a static web app located in the `app/Taste_FrontEnd/` directory.

#### **Configuring Backend API Endpoints**

Before running the frontend, **edit `app/Taste_FrontEnd/config.js`** to set the correct backend API URLs:

```js
window.BACKEND_CUISINE_URL = "http://127.0.0.1:8000/cuisine/chat";
window.BACKEND_RECIPE_URL = "http://127.0.0.1:8000/recipe/chat";
```

Change the URLs as needed for your deployment environment.

#### **Development**

You can serve the frontend using any static file server. For example, using Python's built-in server:

```bash
cd app/Taste_FrontEnd
python3 -m http.server 9000
```

The frontend will be available at: [http://localhost:9000](http://localhost:9000)

## API Endpoints

### Cuisine Chat Endpoint (`/cuisine/chat`)

- **POST `/cuisine/chat`**
  - **Request Body:** JSON with `user_prompt` (string) describing how the user feels.
  - **Description:** Returns a recommended cuisine based on the user's mood.

### Recipe Chat Endpoint (`/recipe/chat`)

- **POST `/recipe/chat`**
  - **Request Body:** JSON with `user_prompt` (string) and `cuisine_name` (string).
  - **Description:** Returns a recipe for the specified cuisine and user prompt.

## Notes

- **API Documentation**: Once the backend is running, interactive API docs are available at [http://localhost:8000/docs](http://localhost:8000/docs)
- **Frontend Deployment**: The frontend is static and can be hosted on any web server. Remember to update `config.js` for the correct backend API URLs.
- **CORS**: Backend allows requests from the frontend URL specified in the `.env` file.

## License

[MIT](LICENSE) (or specify your license here)

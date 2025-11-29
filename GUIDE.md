# How to Run CampusCreator Locally

## Prerequisites
- Node.js installed (v16 or higher)
- A Google Gemini API Key

## 1. Backend Setup (The Brain)
The backend handles the AI connection securely.

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required tools (defined in package.json):
   ```bash
   npm install
   ```
3. Create your secret key file:
   - Create a file named `.env` inside the `backend` folder.
   - Add this line: `API_KEY=AIzaSy...` (Replace with your actual key).
4. Start the server:
   ```bash
   node server.js
   ```
   *You should see: "CampusCreator Backend running at http://localhost:3001"*

## 2. Frontend Setup (The Interface)
The frontend is the React website you interact with.

1. Open a **new** terminal window.
2. Navigate to the project root (outside backend):
   ```bash
   cd ..
   ```
3. Install React dependencies:
   ```bash
   npm install
   ```
4. Start the website:
   ```bash
   npm run dev
   ```
   *Open the link shown (usually http://localhost:5173) in your browser.*

## Troubleshooting
- **Failed to fetch / Backend Unavailable**: Make sure the backend terminal is still running and shows no errors.
- **API Errors**: Check your `.env` file in the backend folder and ensure the API key is valid.

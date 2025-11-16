// This file documents the environment setup for CosmosExplorer
// Instructions for adding environment variables:

/*

SETUP INSTRUCTIONS:

1. Create a NASA API Key:
   - Visit https://api.nasa.gov/
   - Fill out the form to get your free API key
   - You'll receive it via email

2. Add Environment Variables:

   For Vercel Deployment:
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add: NASA_API_KEY = your_api_key_here
   - Redeploy your project

   For Local Development:
   - Create a .env.local file in the project root
   - Add: NASA_API_KEY=your_api_key_here
   - The development server will automatically load it

3. Verify Configuration:
   - All API routes will check for NASA_API_KEY
   - If missing, they'll return a 400 error with a helpful message
   - Make sure to restart your development server after adding the .env.local file

ENVIRONMENT VARIABLES:

Required:
- NASA_API_KEY: String - Your NASA API key for accessing NASA's open APIs
  * APOD API for daily space images
  * Mars Rover Photos API for rover imagery
  * NEO API for asteroid tracking

*/

export const ENV_SETUP_COMPLETE = true

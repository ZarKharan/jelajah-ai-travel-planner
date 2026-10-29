# Jelajah — AI Travel Planner (v0.4)

A responsive Next.js travel planner for Indonesian destinations, using Gemini for itinerary generation and optional travel Q&A, with Leaflet maps.

## Features

- Indonesian city/destination autocomplete from a curated list.
- Gemini-generated itineraries for 1–5 days, personalized by travel pace, interests, travel time and budget.
- Separate day-by-day schedules; the AI can recommend different stops for each day.
- Leaflet map with street, satellite and terrain basemaps, location markers, a visual route line and avatar profile in marker popups.
- Collapsible desktop navigation and mobile drawer/navigation layout.
- Explore destinations, save a city list locally, export an itinerary as TXT, and filter stops by category.
- Optional travel Q&A endpoint that reuses the same Gemini API key; no additional API key is needed.
- User settings, a customizable two-gender avatar, a coin balance, avatar shop, visit check-ins and achievements.
- Profile, coins, owned items, settings and saved city names persist in browser localStorage on the same device.

## Requirements

- Node.js 20 or newer recommended.
- A Gemini API key from Google AI Studio.
- Internet access for Gemini requests, map tiles and public geocoding.

## Setup

1. Extract the project and open a terminal in the folder that contains `package.json`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your own key. Never share or commit `.env.local`.

   ```dotenv
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   GEMINI_MODEL=gemini-3.8-flash
   ```

   If that model is not available to your API key, use a model name currently listed as available in Google AI Studio.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000`.

## Important notes

- The avatar, achievements, coins, visited stops and saved city list are a local prototype. They are not tied to a real login and will not sync across devices.
- The shop and coins are demo game mechanics. Marking a stop as visited is self-reported.
- Geocoding uses the public Photon service and map tiles from OpenStreetMap, Esri and OpenTopoMap. Public services can rate-limit requests; for production, follow their usage policies or use a provider with an SLA.
- The map's line connects found markers in itinerary order as a visual guide; it is not a verified road route or navigation instruction.
- AI-generated prices, opening hours and recommendations may be incomplete or outdated. Verify important details with official sources before traveling.
- Itinerary generation may take several seconds depending on model latency and API availability.

## API routes

- `POST /api/itinerary` — creates a structured itinerary.
- `POST /api/assistant` — answers optional travel questions with the same Gemini API key.

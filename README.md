# Heartbeat: A Music Based Dating Application

Welcome to **Heartbeat**, a unique dating application that matches users based on their Music playlists. Using the power of AI, Heartbeat analyzes playlists to generate personality profiles based on the Big Five personality traits, helping you find your perfect match.

## Features

- **Spotify Integration**: Connect your Spotify account to generate your personalized playlist.
- **Personality Analysis**: Leverage the power of OpenAI to analyze playlists and generate personality profiles based on the Big Five personality traits (Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism).
- **Matchmaking**: Find potential matches with similar or complementary personalities.
- **Real-Time Chat**: Connect instantly with your matches through the in-app chat.


## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Ensure you have Node.js installed (v14.x or later recommended).
- **pnpm**: Install pnpm globally using `npm install -g pnpm`.
- **Spotify Developer Account**: You'll need to set up a Spotify Developer account to obtain API credentials.
- **OpenAI API Key**: Obtain your OpenAI API key for generating personality profiles.
- **Uploadthing account**: Obtain your Uploadthing env variables via setting account. used for uploading files to S3.
- **Pusher account**: Obtain your Pusher env variables via setting account. hosted websockets used for live chats.


## Installation

To set up the project locally, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/heartbeat.git
   cd heartbeat

2. **Set up env variables from .env.example in .env**:

3. **install packages**:
   ```bash
   pnpm i

4. **start project**:
   ```bash
   pnpm run dev

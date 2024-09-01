# Heartbeat: A Music Based Dating Application

Welcome to **Heartbeat**, a unique dating application that matches users based on their Music playlists. Using the power of AI, Heartbeat analyzes playlists to generate personality profiles based on the Big Five personality traits, helping you find your perfect match.

## Features

- **Spotify Integration**: Connect your Spotify account to generate your personalized playlist.
- **Personality Analysis**: Leverage the power of OpenAI to analyze playlists and generate personality profiles based on the Big Five personality traits (Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism).
- **Matchmaking**: Find potential matches with similar or complementary personalities.
- **Real-Time Chat**: Connect instantly with your matches through the in-app chat.

## Technology Stack

Heartbeat is built using the **T3 Stack** and our own unique additions. It is a modern and powerful stack that includes:

- **Next.js**: A powerful React framework that enables server-side rendering, static site generation, and client-side rendering, providing flexibility in building fast and scalable web applications.
- **TypeScript**: A superset of JavaScript that adds static typing, helping developers catch errors early in the development process and improving overall code quality and maintainability.
- **Tailwind CSS**: A utility-first CSS framework that allows for rapid styling of components with predefined classes, promoting consistency and reducing the need for custom CSS.
- **tRPC**: A framework for building typesafe APIs with TypeScript. tRPC allows you to define your API routes with full type safety, ensuring that your front end and back end are always in sync.
- **Prisma**: An Object-Relational Mapping (ORM) tool that simplifies database management and ensures type safety across your database operations. Prisma allows you to interact with your database using a TypeScript-friendly API.
- **NextAuth.js**: A complete authentication solution for Next.js applications. It supports multiple authentication providers and ensures secure handling of user sessions and authentication flows.
- **Shadcn**: A component library built on top of Tailwind CSS, providing a set of accessible and customizable UI components that seamlessly integrate with the Tailwind ecosystem, enhancing the visual and functional aspects of the application.


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

## How do I deploy this?
Follow t3 stack deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
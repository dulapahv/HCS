# EmojiPass Study

A research application for studying emoji-based passwords and their security characteristics compared to traditional text passwords.

- [EmojiPass Study](#emojipass-study)
  - [Description](#description)
  - [Installation](#installation)
    - [Install dependencies using pnpm](#install-dependencies-using-pnpm)
  - [Running the Application](#running-the-application)
  - [Using pnpm](#using-pnpm)
  - [How to Use](#how-to-use)
  - [Features](#features)
  - [Technologies Used](#technologies-used)

## Description

This project implements an experimental platform for comparing emoji-based passwords with traditional text passwords. It includes features for password creation, strength evaluation, and security testing through a simulated shoulder surfing experiment.

## Installation

To set up the project locally, follow these steps:

### Install dependencies using pnpm

```bash
pnpm install
```

## Running the Application

To start the development server:

## Using pnpm

```bash
pnpm dev
```

This will start the application on <http://localhost:5173> (or another port if 5173 is in use).

## How to Use

1. Home Page:

   - Navigate to the home page to start the experiment
   - Choose between emoji password or text password creation

2. Creating a Password:

   - Emoji Password: Use the emoji picker to select emojis for your password
   - Text Password: Type in a traditional text password
   - Both options will show you strength metrics and security analysis

3. Password Testing:

   - After creating your password, you'll be prompted to log in to verify it
   - Short-term memory test occurs immediately after creation
   - Long-term memory test occurs during a later session

4. Shoulder Surfing Experiment:

   - Participate in the security test by attempting to observe and recreate passwords
   - Follow the on-screen instructions for completing each phase

5. Results:

   - View your password strength metrics
   - See estimated time-to-crack and entropy values
   - Compare your emoji and text password performances

Project Structure

```bash
src/
  components/      # Reusable UI components
    EmojiDisplay.tsx
    EmojiPasswordInput.tsx
    EmojiPicker.tsx
    PasswordMetrics.tsx
    PasswordStrengthMeter.tsx
  pages/           # Application pages
    EmojiPasswordApp.tsx
    HomePage.tsx
    ShoulderSurfingExperiment.tsx
    TextPasswordApp.tsx
  utils/           # Utility functions
    emojiUtils.ts
    passwordUtils.ts
  App.tsx          # Main application component
  main.tsx         # Application entry point
```

## Features

- Emoji Password Creation: Create passwords using emojis
- Text Password Creation: Create traditional text passwords
- Password Strength Analysis: Calculation of password entropy and strength
- Security Metrics: Time-to-crack estimation and security analysis
- Shoulder Surfing Experiment: Simulated security testing against observation attacks

## Technologies Used

- React 19
- TypeScript
- Vite
- Tailwind CSS
- bcryptjs for password hashing
- React Router for navigation
- Vercel for deployment
- Twemoji for emoji rendering

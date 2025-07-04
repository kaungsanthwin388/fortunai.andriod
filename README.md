# FortunAI - AI-Powered Fortune Telling App

This is a React Native app built with Expo that combines traditional Chinese BaZi fortune telling with modern AI technology.

## Prerequisites

- Node.js (version 18 or higher)
- npm or yarn
- Expo CLI
- EAS CLI (for building)
- Android Studio (for local development)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Expo CLI and EAS CLI:
   ```bash
   npm install -g @expo/cli @expo/eas-cli
   ```

## Development

1. Start the development server:
   ```bash
   npx expo start
   ```

2. Run on Android:
   ```bash
   npx expo run:android
   ```

3. Run on iOS:
   ```bash
   npx expo run:ios
   ```

## Building for Google Play Store

### Step 1: Configure EAS Build

Make sure you're logged into your Expo account:
```bash
npx eas login
```

### Step 2: Build AAB for Google Play Store

For production build (AAB format):
```bash
npx eas build --platform android --profile production
```

For preview build (APK format):
```bash
npx eas build --platform android --profile preview
```

### Step 3: Submit to Google Play Store

After building, you can submit directly to Google Play Store:
```bash
npx eas submit --platform android
```

## Build Profiles

The app is configured with three build profiles in `eas.json`:

- **development**: For development builds with Expo Dev Client
- **preview**: For internal testing (APK format)
- **production**: For Google Play Store submission (AAB format)

## Environment Variables

Make sure to set up your environment variables:
- Supabase credentials
- DeepSeek API key
- Google OAuth credentials

## Troubleshooting

### Common Issues:

1. **React version conflicts**: 
   ```bash
   npm install react@19.0.0 react-dom@19.0.0
   ```

2. **TypeScript configuration**:
   Make sure `tsconfig.json` extends `@expo/tsconfig.base`

3. **Metro configuration**:
   The project includes custom Metro config to handle React duplicates

4. **Android signing**:
   EAS Build handles signing automatically for production builds

## Project Structure

- `/app` - Main application screens
- `/components` - Reusable React components
- `/lib` - Utility libraries (Supabase, BaZi calculator, AI integration)
- `/assets` - Images and fonts
- `/android` - Android-specific configuration

## Features

- BaZi fortune telling calculations
- AI-powered reading generation
- Daily personalized insights
- Relationship compatibility analysis
- User authentication with Supabase
- Subscription management

## Tech Stack

- React Native with Expo
- TypeScript
- Supabase (Backend & Auth)
- DeepSeek AI API
- React Navigation
- Linear Gradients

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
# PromptForge - Dynamic AI Prompt Generator

## Overview
PromptForge is a web-based application that helps users create robust, tool-specific prompts for various AI tools. The application features a cyberpunk dark neon UI and is designed to work for users of all technical levels.

## Features
- Dynamic questionnaire generation based on initial text input
- Multiple templates for different AI use cases (code generation, content creation, image generation, text-to-video)
- Tool-specific prompt construction
- Local storage for saving and reusing prompts
- Cyberpunk dark neon UI theme

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or pnpm

### Installation Steps
1. Clone the repository or extract the provided files
2. Navigate to the project directory
3. Install dependencies:
   ```
   pnpm install
   ```
4. Start the development server:
   ```
   pnpm run dev
   ```
5. Open your browser and navigate to `http://localhost:5173`

## Usage Guide

### Creating a New Prompt
1. Enter a brief description of what you want to create in the text area on the home page, or select a template directly
2. Fill out the dynamic questionnaire with details specific to your needs
3. Review the generated prompt and make any necessary adjustments
4. Copy the prompt to use with your preferred AI tool, or save it for future use

### Managing Saved Prompts
1. Navigate to the "Saved Prompts" page to view all your saved prompts
2. Click "View" to see the full prompt
3. Click "Delete" to remove a prompt from your saved list

## Project Structure
- `src/components/`: React components for the UI
- `src/context/`: Context providers for state management
- `src/data/`: Data files including questionnaire templates
- `src/pages/`: Page components for routing
- `src/types/`: TypeScript type definitions

## Customization
- To add new templates, edit the `questionnaireTemplates.ts` file in the `src/data/` directory
- To modify the UI theme, edit the CSS variables in `src/index.css`

## Technologies Used
- React
- TypeScript
- React Router
- Tailwind CSS
- Local Storage API

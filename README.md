# Collabberry Frontend

This repository contains the frontend code for the Collabberry project, a collaborative platform designed to enhance teamwork and productivity.

## Table of Contents
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

Follow the instructions below to set up and run the project locally.

## Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/collabberry/frontend.git
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

 3. Environment Variables

    Before running the application, set up the required environment variables. Create a `.env` file in the root directory and add the following:

    ### Development
    ```
    VITE_APP_BASE_URL=""
    VITE_NODE_ENV="development"
    VITE_APP_TEAM_POINTS_FACTORY_ADDRESS=
    VITE_APP_URL=
    VITE_APP_NETWORK="Arbitrum Sepolia"
    VITE_APP_BLOCK_EXPLORER="https://sepolia.arbiscan.io/tx"
    ```

    ### Production
    ```
    # VITE_APP_BASE_URL=
    # VITE_NODE_ENV="production"
    # VITE_APP_TEAM_POINTS_FACTORY_ADDRESS=
    # VITE_APP_URL=
    # VITE_APP_NETWORK="Arbitrum"
    # VITE_APP_BLOCK_EXPLORER="https://arbiscan.io/tx"
    ```

    Ensure the appropriate values are filled in for each variable before running the application.

  ## Usage

  Start the development server:
  ```bash
  npm run dev
  # or
  yarn dev
  ```
  The application will be available at `http://localhost:5173`.

  
  ---
  Happy coding!

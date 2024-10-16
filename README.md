# Feedback DApp

## Overview

This project is a decentralized application (DApp) for submitting and managing feedback using smart contracts on the Ethereum blockchain. The application allows users to submit feedback for different entities and view the submitted feedback.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Setting Up the Environment](#setting-up-the-environment)
- [Deploying the Smart Contract](#deploying-the-smart-contract)
- [Running the Application](#running-the-application)
- [Using the Application](#using-the-application)

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [npm](https://www.npmjs.com/get-npm) (Node package manager, comes with Node.js)
- [Metamask](https://metamask.io/) browser extension
- An IDE (e.g., [Visual Studio Code](https://code.visualstudio.com/))

## Getting Started

Follow these steps to set up the project locally:

1. **Clone the repository** to your local machine:
    ```bash
    git clone https://github.com/varunpareek690/Feedback-System.git
    cd Feedback-System
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

## Setting Up the Environment

1. **Create a `.env` file** in the root of the project and add your private key for deploying the smart contract:
> You can get the private key from Metamask


```env
   PRIVATE_KEY=your_private_key_here
```
   

## Deploying the Smart Contract

1. **Type this command on the terminal**:
    ```bash
    npx hardhat compile
    ```

2. **Deploy the smart contract**:
    ```bash
    npx hardhat run igntion/modules/Feedback_system.js --network sepolia
    ```


## Running the Application

1. **Navigate to the front-end folder**:
    ```bash
    cd front-end
    ```

2. **Start the React application**:
    ```bash
    npm run dev
    ```

3. **Open your browser** and go to `http://localhost:5173` to view the application.

## Using the Application

1. **Connect Metamask**: Make sure your Metamask wallet is connected to the appropriate network (e.g., Sepolia).

2. **List an Entity**: Use the "List Entity" form to add an entity before submitting feedback. (THIS IS ONLY OWNER)

3. **Submit Feedback**: Fill in the feedback form with the entity address, feedback text, and rating, then submit it.

4. **View Feedback**: After submitting feedback, it will be displayed on the application.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


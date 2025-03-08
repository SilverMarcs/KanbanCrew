# KanbanCrew

*KanbanCrew* is a project management tool designed to streamline task management and team collaboration. Built with modern web technologies, it offers features like product/sprint backlogs, user stories, sprints, and burndown charts to help teams stay organized and productive.

## Features

- *Product/Sprint Backlogs*: Organize and prioritize tasks efficiently.
- *User Stories*: Break down tasks into manageable user stories.
- *Sprints*: Plan and track progress over defined sprints.
- *Burndown Charts*: Visualize progress and remaining work.

## Technologies Used

- *Typescript*: For type-safe and scalable code.
- *NextJS*: For server-side rendering and optimized performance.
- *TailwindCSS*: For utility-first, responsive styling.
- *Firebase*: For real-time database and authentication.
- *ShadCN*: For pre-built, customizable UI components.

## Running locally

First, ensure node and/or npm are installed on your machine, then install dependencies:

```
npm install
```

### Firebase Setup

1. **Create Firebase Account**: Go to [Firebase Console](https://console.firebase.google.com/), sign in with Google, create a project

2. **Get Web Credentials**:
   - Go to Project Settings (gear icon)
   - Add Web App (click `</>` icon)
   - Copy values from the config object

3. **Get Server Credentials**:
   - In Project Settings > Service accounts
   - Click "Generate new private key"
   - Use `client_email` and `private_key` from the downloaded JSON

4. **Setup Environment File**:
   ```bash
   cp .env.example .env
   ```
   Then paste your Firebase values into the `.env` file

### Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

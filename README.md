# Course Review System

A privacy-safe portfolio edition of a six-person University of Auckland software project. The system helps students browse sample course information, compare difficulty, read and create reviews, discuss campus topics, save courses, and explore course locations.

- Live demo: https://zhzhg-dev.github.io/course-review-system/
- Portfolio repository: https://github.com/zhzhg-dev/course-review-system

## Public Demo Safety

The public GitHub Pages build is intentionally frontend-only:

- all content uses sample data;
- sign-in accepts fictional details for interface demonstration only;
- no password is stored;
- no form data is sent to a server;
- changes are saved only in the visitor's browser storage and can be cleared at any time.

This keeps the resume demo free to host, removes cold-start delays, and avoids exposing the original team's MongoDB Atlas, Render, or Firebase resources.

## Features

- Responsive landing page and application shell
- Course search and difficulty filtering
- Course detail, pass-rate, assignment, review, and helpful-vote views
- Browser-local demo sign-up and sign-in
- Saved-course profile management
- Discussion posts, replies, helpful votes, tags, and sorting
- Campus location page
- Profile editing and browser-local image preview
- Automated GitHub Pages deployment

## Technology

### Public portfolio build

- React 19
- Vite 7
- JavaScript and CSS
- Browser `localStorage`
- GitHub Actions and GitHub Pages

### Original team architecture

- React frontend
- Node.js and Express REST API
- MongoDB and Mongoose
- Vitest, Supertest, and `mongodb-memory-server`
- Docker for local MongoDB development
- Render, MongoDB Atlas, Firebase Storage, and GitHub Pages in the original course deployment

The `backend/` directory is retained to demonstrate the original full-stack architecture and automated API tests. It is not connected to the public portfolio site and should not be treated as production-ready without a separate security review and deployment configuration.

## My Contribution

Zihang (Grant) Zhang owned the course-related backend functionality in the team project. This included REST API work for course search, difficulty filtering, course sorting and detail retrieval, plus endpoint testing in Postman, database validation in MongoDB Compass, and frontend integration support.

For this public portfolio edition, Grant also:

- separated the demo from shared team cloud resources;
- replaced network-backed visitor interactions with browser-local sample data;
- added a clear privacy and attribution notice;
- updated the GitHub Pages configuration and deployment workflow;
- validated the production build and online interaction flow.

## Team Attribution

The original Course Review System was created by **Team Power Up**:

- Xiawen Lin
- Lingyu Meng
- Yixuan Sun
- Zihang Zhang
- Ju-Lin Ni
- Xiaoyu Li

This public portfolio copy was created with the team's permission. It remains a collaborative university project; the repository does not imply that one contributor built the entire original system.

## Run the Public Demo Locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Build the deployable frontend:

```bash
npm run build
```

The generated site is written to `frontend/dist`.

## Optional Original Backend

For local study of the original API, run MongoDB locally and follow the scripts in the root `package.json`. Never commit `.env` files or reuse credentials from the original team deployment.

Backend tests:

```bash
npm run test:backend
```

## Disclaimer

This is an educational portfolio demonstration. It is not an official University of Auckland service, and sample course information, reviews, pass rates, assignments, and locations must not be used for enrolment decisions.


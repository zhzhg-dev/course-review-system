# Testing & Deployment Notes

This project was tested with both automated backend tests and manual end-to-end checks through the frontend prototype.

## Local setup

1. Start MongoDB locally.

   If MongoDB is running through Docker Desktop:

   ```bash
   docker start mongodb
   ```

   If the container has a different name, start the MongoDB container shown in Docker Desktop instead.

2. Install dependencies from the project root:

   ```bash
   npm install
   ```

3. Seed local test data:

   ```bash
   npm run seed:courses
   npm run seed:discussion
   ```

   To seed all current course, review, and discussion data together:

   ```bash
   npm run seed:all
   ```

4. Start the backend.

   On Windows:

   ```bash
   npm run local:backend:windows
   ```

   On macOS/Linux:

   ```bash
   npm run local:backend:mac
   ```

5. Start the frontend:

   ```bash
   npm run dev:frontend
   ```

## Automated testing

The backend has automated tests using Vitest, Supertest, Mongoose, and mongodb-memory-server. The tests create an in-memory MongoDB database, seed known test data before each test, and then call the Express API routes without depending on the local or cloud database.

Run the backend automated tests from the project root:

```bash
npm run test:backend
```

The current backend test suite covers:

- user registration, duplicate email handling, login, and invalid login attempts
- course listing, course detail retrieval, course creation, duplicate course code rejection, search, and difficulty filtering
- discussion listing, tag filtering, multi-tag filtering, trending tag ordering, post creation, helpful votes, duplicate helpful vote blocking, and replies

These tests help check that the core API behaviour still works after code changes.

## Manual testing checklist

The following manual checks were used to verify the deployed prototype and the local development version:

- Register API
- Login API
- GET `/course`
- POST `/course`
- PUT `/course/:id`
- Search courses
- Difficulty filter
- Frontend courses page
- Course detail page
- Add to My Courses
- Remove from Profile
- Discussion page loads seeded posts
- Create a discussion post
- Add multiple tags to a discussion post
- Select one or more Trending Tags
- Confirm multi-tag filtering only shows posts containing all selected tags
- Add a reply to a discussion post
- Mark a post as Helpful
- Check map page loads University of Auckland campus locations

## Deployment data

For deployment, seed data can be uploaded to the cloud MongoDB database by setting `MONGO_URI` to the deployed MongoDB Atlas connection string and then running:

```bash
npm run seed:cloud
```

The deployed backend must use the same MongoDB database as the seeded data. The deployed frontend communicates with the deployed backend API, and the backend is responsible for reading from MongoDB.


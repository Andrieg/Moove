# Moove API Contract (legacy)

Base URL: https://api.moove.fit

## Auth
- POST /users/login (request magic link / token email)
- GET /users/me (current user)
- POST /users/register
- POST /users/member/register

Auth (passwordless via emailed link)

POST /users/login

Body: { email, client?, target?, brand? }

Response (success): { status: "SUCCESS", user: "<userId>" }

Response (fail): { status: "FAIL", error: "...", code?: 1001 }

Side effect: emails ${APP_URL}/auth?token=<JWT>

GET /users/me (protected; requires Bearer JWT)

Also note explicitly:

“JWT is delivered via emailed link as token query param; there is no verify endpoint.”

## Users
- GET /users/me
- GET /users/:id

## Content
- GET /videos
- GET /videos/:id
- GET /challenges

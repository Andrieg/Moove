# Moove API Contract (Legacy)

Base URL: https://api.moove.fit

Authentication uses JWT (Fastify JWT).  
All protected routes require the header:

Authorization: Bearer <token>

---

## Authentication (Passwordless Email Link)

### POST /users/login

Requests a login link via email.  
The server generates a JWT and emails a link of the form:

{APP_URL}/auth?token=<JWT>

(or {target}/auth?token=<JWT> when client=true)

Request Body:
{
  "email": "user@example.com",
  "client": true,
  "target": "https://your-app-domain",
  "brand": "optional-brand"
}

Success Response:
{
  "status": "SUCCESS",
  "user": "USER_ID"
}

Failure Responses:
{ "status": "FAIL", "error": "wrong", "code": 1001 }
{ "status": "FAIL", "error": "token" }

Important:
There is NO /auth/verify endpoint.
The JWT itself is delivered via the emailed link as the token query parameter.

---

## Users

POST /users/register  
Registers a coach/user.

POST /users/member/register  
Registers a member user.

GET /users/me (protected)  
Returns the currently authenticated user.

GET /users/:userID/trainers (protected)  
Returns trainers associated with a user.

---

## Videos

GET /videos  
Returns a list of videos.

GET /videos/:id  
Returns a video by ID.

---

## Challenges

GET /challenges  
Returns a list of challenges.

GET /challenges/:id  
Returns a challenge by ID.

---

## Content & Engagement

Note: Legacy routes include misspellings (challange) which must be preserved.

POST /content/view  
POST /content/join  
POST /content/challenge/join  
POST /content/view/time  
POST /content/view/end  
POST /content/challange/completed  
POST /content/challange/view  
POST /content/challange/view/end  
POST /content/favourite  

---

## Other Legacy Routes

Billing:
- /billing
- /billing/onboarding
- /billing/onboarding/refresh
- /billing/webhook
- /billing/membership
- /billing/checkout/session

Classrooms & Live:
- /classrooms
- /classrooms/:id
- /live
- /live/:id

Media:
- POST /media/avatar
- POST /media/video

Misc:
- /categories
- /locations
- /links
- /links/:id
- /landingpage
- /landingpage/:id
- /landingpage/brand/:id
- /members

---

## Notes

JWT expiry: 14 days  
JWT payload includes: email, id, brand  
Token verification uses request.jwtVerify()  
CORS allows .moove.fit and localhost ports

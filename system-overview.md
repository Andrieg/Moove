# Moove Fitness Platform – System Overview  
Version: 1.0  
Author: Marho

Moove is a multi-tenant fitness SaaS platform enabling coaches and fitness studios to manage content, subscriptions, members, branding, and digital experiences for their clients.

This document provides a unified overview of all Moove repositories so an AI-assisted coding tool can understand the entire system as a whole.

---

# 1. Architecture Summary

Moove consists of **four related repositories**:

1. **dashboard**  
   - Tech: React 17, Material-UI, Redux, Firebase messaging  
   - Users: Coaches / Studios  
   - Purpose: Manage content, members, live classes, challenges, branding, pricing, and subscriptions.

2. **client (frontEnd)**  
   - Tech: React 17 + TypeScript, Redux, Styled Components  
   - Users: Members / End Users  
   - Purpose: Consume content (workouts, challenges, programs), join memberships, book sessions, explore community.

3. **api**  
   - Tech: Fastify (Node.js + TypeScript), DynamoDB, S3, Stripe, SES  
   - Purpose: Core backend providing authentication, content APIs, billing, membership, notifications, and branding.

4. **coach-website**  
   - Tech: Next.js 12, React 17, Redux, MUI, Docker, Nginx  
   - Purpose: Multi-tenant landing pages for each coach/brand with custom subdomains, Stripe checkout, onboarding flows.
   - Bundles multiple services (landing page + client + reverse proxy).

All repos communicate through the **Moove API** located at:

```
https://api.moove.fit/
```

---

# 2. Roles & Responsibilities (Per Repo)

## 2.1 dashboard (Coach Portal)
- Passwordless magic-link login  
- Branding controls (logo, theme colors)  
- Video uploads (S3), class management, challenges  
- Member & subscription management  
- Messaging system (Firebase real-time chat + notifications)  
- Landing page editor  
- Live class scheduling  
- Reviews and ratings dashboards  
- Protected routes based on JWT

## 2.2 client / frontEnd (Member App)
- Authentication (JWT)  
- "For You" personalised feed  
- Explore & Discover content  
- Book classes / join challenges  
- Video player for workouts  
- Favourites  
- Community feed  
- Profile management  
- Subscription status checks (via API)  
- Atomic Design architecture

## 2.3 api (Backend)
- Authentication (magic link + JWT)  
- Multi-tenant brand system  
- Stripe Connect (coach payouts)  
- Subscriptions, billing, invoices  
- Video metadata, classroom management  
- Live class metadata  
- Challenge and program progression  
- View tracking & analytics  
- Payments, webhook handling  
- Landing page metadata  
- DynamoDB table-per-entity  
- Media uploads to S3  
- SES-based transactional emails  
- Argon2 password hashing  
- Dockerised deployment with Nginx reverse proxy

## 2.4 coach-website (Landing + Proxy)
- Next.js landing page dynamically themed by subdomain  
- Stripe checkout initiation  
- Membership information  
- Marketing site pages  
- Docker-compose orchestration  
- Nginx routing:
  - `/app/*` → client app  
  - `/` → landing page  

---

# 3. Cross-Service Dependencies

| Domain Area          | dashboard | client | api | coach-website |
|----------------------|----------|--------|-----|----------------|
| Auth                 | ✓        | ✓      | ✓   | ✓              |
| Stripe Billing       | ✓        | ✓      | ✓   | ✓              |
| Video Content        | ✓        | ✓      | ✓   |                |
| Challenges           | ✓        | ✓      | ✓   |                |
| Landing Pages        | ✓        |        | ✓   | ✓              |
| Messaging            | ✓        |        |     |                |
| Multi-Tenancy        | ✓        | ✓      | ✓   | ✓              |
| Branding             | ✓        | ✓      | ✓   | ✓              |

---

# 4. Core User Journeys

## 4.1 Member Onboarding
1. Visit: `brand.moove.fit`  
2. Select plan → Stripe checkout  
3. Stripe webhook creates subscription + member  
4. Member logs into client app  
5. Gains access to workouts & challenges  

## 4.2 Coach Onboarding
1. Register in dashboard  
2. Connect Stripe  
3. Set branding  
4. Upload videos/classes/challenges  
5. Publish landing page  

## 4.3 Content Consumption
1. Browse For You / Explore  
2. Select class/challenge  
3. Stream from S3 via signed URL  
4. Track progress  

## 4.4 Member Management
1. Coach views members  
2. Filters/segments  
3. Messages members  
4. Subscriptions sync with Stripe  

---

# 5. Essential Environment Variables

(Shortened for this example.)

---

# 6. Deployment Model

- Coach Website: Next.js + Client App via Nginx reverse proxy  
- API: Docker container behind Nginx  
- AWS: DynamoDB, S3, SES  

---

# 7. Known Technical Gaps / Modernisation Targets

- Move to monorepo  
- Update React 17 → React 18 / Next.js  
- Replace heavy Redux boilerplate  
- Consolidate styles  
- Standardise DynamoDB schema  

---

# 8. Rebuild Recommendations

- Use Turborepo or Nx  
- Shared packages: ui, types, utils, api-client  
- Prefer NestJS or modern Fastify for backend  

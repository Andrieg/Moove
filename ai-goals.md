# AI Rebuild Goals for the Moove Fitness Platform  
Version: 1.0

This document defines the expectations and scope for AI-assisted redevelopment of the Moove system.

---

# 1. Purpose

Recreate Moove as a **modern, stable, consolidated, and maintainable platform**, while preserving all core business flows and functionality.

Existing repos should be treated as the *source of truth for behaviour*.

---

# 2. Must-Preserve Features

## Member App
- JWT auth  
- Video playback  
- Challenges & programs  
- For You feed  
- Booking  
- Favourites  
- Subscription gating  

## Coach Dashboard
- Content upload  
- Member management  
- Branding  
- Stripe Connect  
- Landing page editor  
- Studio/team features  

## Backend
- Multi-tenancy  
- Stripe billing + payouts  
- S3 media storage  
- DynamoDB (or equivalent)  
- Magic link auth  
- Webhooks  

## Landing Page
- Subdomain-based branding  
- Subscription purchase flows  

---

# 3. Can Be Simplified

- Firebase messaging  
- Legacy Redux  
- MUI customisation  
- Nginx complexity  
- Internal duplication across repos  

---

# 4. Target Architecture

```
apps/
  dashboard/
  client/
  landing/

packages/
  ui/
  types/
  utils/
  api-client/
  auth/
```

Backend: NestJS or Fastify  
Frontend: React 18 / Next.js  
Design: Shared UI system (Tailwind or MUI)  

---

# 5. AI Delivery Expectations

The AI should:

1. Analyse all repos and extract:  
   - feature list  
   - API contract map  
   - DB schema  
   - UX flows  

2. Produce a multi-step rebuild plan  

3. Scaffold monorepo  

4. Migrate features incrementally  

5. Provide deployment instructions  

---

# 6. Out of Scope (Phase 1)

- Push notifications  
- Real-time chat  
- Social feed  
- In-app audio alerts  
- Full FFmpeg pipeline  

---

# 7. Definition of Done

A working monorepo containing:

- Rebuilt dashboard  
- Rebuilt client  
- Rebuilt landing  
- Modern backend  
- Multi-tenancy  
- Stripe billing working  
- Documentation + setup scripts  

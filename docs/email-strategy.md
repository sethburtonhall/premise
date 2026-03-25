# Premise Email Strategy

All emails are sent via [Loops](https://app.loops.so). Clerk webhooks fire events and update contact properties. Transactional emails are not used — everything runs through Loops automations (Loops).

---

## Contact Properties

| Property | Type | Set by | Values |
|---|---|---|---|
| `firstName` | string | Clerk `user.created` / `user.updated` webhook | — |
| `lastName` | string | Clerk `user.created` / `user.updated` webhook | — |
| `userId` | string | Clerk `user.created` / `user.updated` webhook | Clerk user ID |
| `userGroup` | string | Clerk subscription webhooks | `free`, `pro`, `past_due` |
| `hasGeneratedScope` | boolean | `/api/scope/save` route on successful save | `true` (never reset) |

---

## Loops Events

| Event | Fired from | When |
|---|---|---|
| `userSignedUp` | Clerk `user.created` webhook | New user signs up |
| `userUpgraded` | Clerk `subscription.created` / `subscription.active` webhook | User subscribes to Pro or recovers from past due |
| `paymentPastDue` | Clerk `subscription.pastDue` webhook | Payment fails |
| `freeLimitReached` | `/api/scope/save` route on 402 | Free user hits 2-scope limit |

---

## Loops (Automations)

### 1. Welcome Email
- **Trigger:** `userSignedUp`
- **Delay:** None
- **Audience filter:** None
- **Subject:** `Your first scope is one brief away`
- **Purpose:** Introduce Premise, direct to `/scope/new`, set tone

---

### 2. Re-engagement
- **Trigger:** `userSignedUp`
- **Delay:** 48 hours
- **Audience filter:** `hasGeneratedScope` is not `true`
- **Subject:** `Your first scope takes 30 seconds`
- **Purpose:** Nudge users who signed up but never generated a scope

---

### 3. Free Limit Upgrade Nudge
- **Trigger:** `freeLimitReached`
- **Delay:** 24 hours
- **Audience filter:** `userGroup` is `free`
- **Subject:** `Your Premise scopes are ready when you are`
- **Purpose:** Convert free users who hit the limit but didn't upgrade immediately

---

### 4. Welcome to Pro
- **Trigger:** `userUpgraded`
- **Delay:** None
- **Audience filter:** None
- **Subject:** `You're on Pro — here's what's unlocked`
- **Purpose:** Confirm upgrade, highlight PDF export, set expectations

---

### 5. Payment Past Due
- **Trigger:** `paymentPastDue`
- **Delay:** None
- **Audience filter:** None
- **Subject:** `Action needed — your Premise payment failed`
- **Purpose:** Direct user to update payment method before access is affected

---

## Clerk Webhook Setup

**Production endpoint:** `https://www.usepremise.app/api/webhooks/clerk`

**Subscribed events:**
- `user.created`
- `user.updated`
- `user.deleted`
- `subscription.created`
- `subscription.updated`
- `subscription.active`
- `subscription.pastDue`

**Signing secret:** `CLERK_WEBHOOK_SIGNING_SECRET` in Vercel production env vars

---

## Loops Admin Notification

Loops sends a built-in notification email to the account owner when a new contact is added to the audience. No custom Loop needed for this — it is handled natively by Loops.

---

## Potential Future Emails

| Email | Trigger | Notes |
|---|---|---|
| Cancellation win-back | `subscription.updated` with status `canceled` or `ended` | No code change needed — webhook already handles this event |
| First scope generated | After first successful save | Could fire a `firstScopeGenerated` Loops event from save route |

---

## Environment Variables

| Variable | Where |
|---|---|
| `LOOPS_API_KEY` | Vercel production |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Vercel production |

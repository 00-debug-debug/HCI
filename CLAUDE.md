# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Project

This is a zero-build static website served through XAMPP. No compilation or installation steps are required.

- **Access**: `http://localhost/HCI/index.html` (with XAMPP Apache running)
- **Entry point**: `index.html` (landing page with particle animation and AI chatbot button)
- **Authentication flow**: `selector-login.html` → `otp-email.html` or `otp-phone.html` → `validate-otp.html` → `mailbox-clean.html`

There are no package managers, build scripts, or test runners. Validate changes by opening the relevant HTML file in a browser via the XAMPP server.

## Test Credentials (Demo/Hardcoded)

- **OTP code**: `123456` (valid for both email and phone flows)
- **Google login**: `tagolimot.mia00@gmail.com` / `Isosceles21`

## Architecture

**Stack**: Vanilla HTML5 + CSS3 + JavaScript — no frameworks, no bundler, no backend.

All business logic lives in `assets/app.js` (~39KB). All styling lives in `assets/styles.css` (~39KB). The HTML files are page templates; JavaScript is loaded via a single `<script src="assets/app.js">` tag on each page.

**State management**: `localStorage` carries session data across page navigations (e.g., selected auth method, user email/phone).

**Page responsibilities**:
| File | Purpose |
|---|---|
| `index.html` | Hero landing with particle canvas and floating chatbot button |
| `selector-login.html` | Auth method picker (Email / Phone / Google) |
| `otp-email.html` | Email input before OTP send |
| `otp-phone.html` | Phone input with intl-tel-input (50+ countries, per-country validation) |
| `validate-otp.html` | 6-box OTP entry with auto-advance, shake-on-error |
| `google-login.html` | Google credential form (mocked OAuth) |
| `mailbox-clean.html` | Email dashboard: sidebar folders, compose, badge counts |
| `ai-chatbot.html` | Chat interface with bot reply simulation |

**`assets/app.js` internal structure**: Functions are grouped by page feature and attached via `DOMContentLoaded`. Key sections:
- Email validation (regex-based, real-time)
- Country-specific phone number pattern validation
- OTP input handling (auto-advance, paste detection, countdown resend timer)
- localStorage session read/write helpers
- Chatbot message rendering and mock reply logic

## Design System

- **Accent color**: `#22c55e` (neon green)
- **Theme**: Dark backgrounds with glassmorphism cards (`backdrop-filter: blur`)
- **Typography**: Inter (Google Fonts)
- **Animations**: CSS `transform`/`opacity` only (no JS animation loops except the landing page particle canvas)
- **Breakpoints**: 640px (mobile), 1024px (tablet/desktop)
- **Error feedback pattern**: shake animation class toggled on the input container + inline error message element

## HCI Principles Guiding UI Decisions

The project explicitly implements three Nielsen heuristics (documented in `HCI_PRINCIPLES.md`):
1. **Visibility of system status** — loading states, color-coded status messages, live badge counts
2. **Consistency and standards** — unified glassmorphism card design, button styles, and sidebar pattern across all pages
3. **Error prevention** — disabled submit until fields are valid, real-time OTP input validation, resend countdown timer

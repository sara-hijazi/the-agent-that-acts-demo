# The Agent That Acts — Interactive Portfolio Demo

## Purpose
Demonstrate AI that acts, not just answers, using a marketing company appointment agent. Entirely local, deterministic, static-hosting friendly; no accounts, network APIs, backend, database, analytics, or paid services.

## Source-of-truth journey
Home → natural-language request → understand intent and extract constraints → check local team availability → select a prepared slot → explicit human approval → execute locally → confirm → company calendar updated.

Arabic is the default, with centralized Arabic/English strings and RTL/LTR direction. Arabic uses neutral language without diacritics. Theme and language persist locally. Shared Home resets the active journey and preserves preferences and completed company records. Try Another Request starts a fresh request without reloading. The calendar starts empty on every page load; records are held only in memory and accumulate within the active demo session. Neither localStorage nor sessionStorage stores appointments. Home preserves completed records in this session, as approved, and creates no records.

## Agent behavior
An isolated deterministic parser recognizes booking/consultation intent, product launch, content strategy, campaign, marketing strategy, and general consultation; tomorrow, next week, named weekdays; morning, afternoon, evening in Arabic and English. Unsupported intent requests clarification rather than fabricating a booking. Missing constraints stay flexible. Dates use the user's local date and week starts Monday. The request captures a reference date once; availability and slot validation use that snapshot, including across midnight. A small generated local availability dataset supplies 45-minute slots on business days with morning, afternoon, and evening options. Matching dates and periods take priority; unavailable combinations transparently offer nearest alternatives.

## Screens
Home: agent plus sparkle identity, concise core message, interactive badge and Try the Agent. Only the execution supporting card remains; no secondary response card or line beneath the CTA.
Request: conversational prompt, supporting copy “وصف بسيط يكفي.” / “A simple description is enough.”, textarea and three examples. No contact information.
Understanding: structured intent/topic/date/time; purposeful 3.2-second understanding and availability sequence; up to three selectable slots.
Approval: title Ready to book, topic/date/time/45-minute summary, Confirm Booking and Back. No calendar mutation before confirmation. Badge: “بانتظار الموافقة” / “Awaiting approval”. No supporting sentence beneath the heading.
Execution: 3.2-second local sequence creating event, adding details, preparing confirmation, completion. Active orange, completed green. Only an approved action may complete.
Completion: heading, confirmed badge, appointment card and View Company Side; no supporting sentence beneath the heading.
Company: lightweight calendar plus original request, extracted context, approved slot and local confirmation status. Completed records visibly persist across journey resets for the active page session. One canonical completed-booking object (ID, original/extracted context, final slot, 45-minute duration, confirmation status and preparation status, alternative flag) drives completion, the current calendar record and its details. Requested preference and booked appointment are separately labeled; approved availability alternatives are explained explicitly. Earlier records in this session are labeled separately from the current booking.

## Transparency and access
Accessible Portfolio Demo Mode disclosure describes local simulation and original AI/automation architecture. No claims of live email or calendar delivery. Keyboard controls, visible focus, semantic labels, live status, reduced motion and responsive layouts. No booking form or full dashboard.

## Validation and delivery
Strict TypeScript, production build, focused deterministic engine/state checks, preference/reset checks, secret scan and git diff --check. No commit, push or deploy. Leave local Vite preview ready for Product Owner visual review.

# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Homebuyers (and, as the site grows, sellers/landlords) in Portugal looking for a real-estate agent, browsing Magda Leal's own property listings, contacting her, and evaluating whether to work with her. Secondary user: Magda Leal herself (or a single assistant using her credentials) using the backoffice to manage listings, photos, and incoming leads. No evidence of a multi-agent team — this is a solo-agent tool.

## Product Purpose

A personal marketing and lead-generation site for Magda Leal, an individual real-estate consultant affiliated with Keller Williams Portugal. It showcases her property listings, establishes her personal credibility, and converts visitor interest into contact-form leads she can follow up on. It also gives her (via the backoffice) self-service control over her own listings and leads without depending on Keller Williams' own tools or a developer for every update.

## Positioning

A civil-engineer-turned-real-estate-consultant angle: 10+ years in real estate plus two decades of civil engineering background, positioned as giving her a "technical eye" other agents lack — she evaluates construction quality and real condition/potential of a property, not just its presentation ("A minha formação em engenharia civil dá-me um olhar técnico pouco comum no mercado imobiliário"). Combined with Keller Williams Portugal's international network/reach but delivered with personal, high-touch service ("o alcance de uma rede internacional com o cuidado de um serviço verdadeiramente pessoal").

## Operating Context

- Portuguese-language site (Portugal, not Brazil), single agent's brand, not a multi-agency marketplace.
- Backend: Django + Django REST Framework API (SQLite), session+CSRF auth gated on `is_staff` for the backoffice.
- Frontend: React 19 + Vite + React Router + Tailwind CSS, served as a separate SPA from the API.
- Deployed via Docker Compose (Django/gunicorn + nginx) on a self-managed VPS, reusing an existing Let's Encrypt certificate; auto-deploy on push to the `deploy` branch via GitHub Actions. **This `deploy` branch is confirmed live in production.**
- A separate `main` branch holds an older, now-superseded server-rendered Django-templates version of the same site (not the current product; do not treat it as source of truth).
- Backoffice lets Magda: log in/out, create/edit/delete property listings (with photo upload/delete), set a listing status (Disponível / Brevemente / Reservado), and view/delete inbound leads from a dashboard.

## Capabilities and Constraints

- Property model: name, price, description, address, bedrooms, bathrooms, typology (free text), area, liquid_area, construction_date, status (available/coming_soon/reserved), multiple images. No sale-vs-rent field and no property category/type field.
- Public property search/filter: by name/address text, bedroom count, and max price.
- Lead capture: public contact form (name, email, phone, message) stored as a Lead, visible/deletable in the backoffice.
- **Buy vs. sell vs. rent**: footer nav shows "Comprar / Vender / Arrendar" as three labels, but all three currently link to the same `/imoveis` listing page — there is no real distinct sell-side or rental flow, and the backend has no field to model that distinction. The user has confirmed this is a **planned near-term goal** (site should genuinely support buy + sell, not just display placeholder links), not an intentional buy-only scope — future work should treat building this out as a real, expected extension rather than leaving it decorative.
- Site stats shown publicly: live count of properties, "years of experience" computed from a 2015 baseline, and a hardcoded "250 imóveis vendidos" (properties sold) figure — this number is not derived from data and should not be treated as dynamically verified.
- Single-role auth (`is_staff`) — no multi-user roles, no per-agent assignment, no signup flow.

## Brand Commitments

- Name: **Magda Leal**. Affiliated with **Keller Williams Portugal** (footer links to her KW profile / kwportugal.pt; Instagram/Facebook handle `magdalealconsultora`, LinkedIn `magdaleal`).
- Voice: first-person, warm, professional Portuguese copy centered on trust, technical credibility, and close personal follow-through ("do primeiro contacto à escritura").
- Real, named awards to preserve as-is (not to be treated as placeholder or paraphrased): 3× Top 10 Mega Teams, 3× Top 3 Income, 2× Ouro KW Abaco, 1× Prata KW Abaco, 9× Capper.

## Evidence on Hand

- Real bio/credentials copy on the Sobre (About) page, including a real photo asset (`/static/landingpage/FotoMagda.png`).
- Five real, attributed client testimonials (Rosário Sousa, Sílvia Fernandes, Silvana Curado, Catarina Cardoso, Carlos Silva) in `Testimonials.jsx` — genuine content, safe to keep/restyle but not to fabricate more of without new input.
- Live property listings and photos come from the backoffice-managed database (real, agent-entered content), not fixtures.
- No case studies, press mentions, or video content on hand beyond what's listed above — do not invent additional proof elements.

## Product Principles

1. Preserve the "engineer's eye + KW network + personal service" positioning in any new copy or feature — it is Magda's stated differentiator, not incidental.
2. Treat the backoffice as a first-class product surface, not an afterthought — Magda depends on it to self-serve listings/leads without a developer.
3. Don't let the buy/sell/rent nav promise more than the product delivers; either build the real distinction or don't advertise it as if it exists.
4. Real testimonials, awards, and bio content are genuine and specific — never dilute them into generic real-estate boilerplate.
5. The `deploy` branch is the single source of truth for current product state; `main` is legacy and should not inform new design or product decisions.

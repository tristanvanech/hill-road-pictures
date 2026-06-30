# Meta Pixel events — files to push

Six files that add per-button Meta Pixel tracking to the landing page and the
lead funnel. The Pixel base code (id `238424817398252`) is already in
`index.html`, so these only add the event calls on top of it. No other changes
are needed.

## Install

Copy the files under `src/` into the repo's `src/`, overwriting the four that
exist and adding the two new ones. Commit and push.

| File | Status | What it does |
|------|--------|--------------|
| `src/meta.ts` | NEW | `fbq` helper + a delegated click listener |
| `src/vite-env.d.ts` | NEW | Vite client types (repo was missing this; keeps `tsc` clean) |
| `src/main.tsx` | replace | Turns the click listener on |
| `src/App.tsx` | replace | Adds `data-meta-event` attributes to the CTAs |
| `src/InvestForm.tsx` | replace | Fires `InitiateCheckout`, `Lead`, and the chooser events |
| `src/ThankYou.tsx` | replace | Removes the old `Lead` fire (moved to submit) |

## Events these add

Custom events:

| Trigger | Event | Params |
|---------|-------|--------|
| Invest CTAs (hero, 4 tiers, footer, inline) | `ClickInvest` | `location`, plus `value` on tiers |
| Trailer buttons | `WatchTrailer` | `location` |
| Writer/founder videos | `WatchVideo` | `content_name: Writer Interview` |
| Form step 0: documents / webinar / call | `ChooseDocuments` / `ChooseWebinar` / `ChooseCall` | `interest` |
| Form step 0: "Learn more about this opportunity" | `LearnMoreFromForm` | — |

Standard events:

| Trigger | Event | Params |
|---------|-------|--------|
| Deck PDF download | `ViewContent` | `content_name: Investor Deck` |
| `/invest` form opens | `InitiateCheckout` | — |
| Form submitted | `Lead` | `value`, `currency: USD`, `accredited`, `interest` |

## One behavior change to know

`Lead` now fires on successful form submit (in `InvestForm.tsx`), not on the
thank-you page. Same event name, fires once per submission, no Meta config
change needed. The GA `generate_lead` event on the thank-you page is untouched.

## Adding a button later

Put `data-meta-event="Name"` (and optional `data-meta-*` params) on any element.
The listener handles the rest; no handler code needed.

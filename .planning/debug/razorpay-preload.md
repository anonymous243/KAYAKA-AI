# Razorpay Preload Warning Debug Session

## Symptom
Browser console shows: `The resource at “.../v2-entry-illustration40-9b4bccde.modern.js” preloaded with link preload was not used within a few seconds.`

## Hypothesis
The Razorpay checkout script (`checkout.js`) is loaded in `index.html`. Browsers like Chrome/Firefox see the script and Razopay's internal preloading logic triggers. Since the `Razorpay` object isn't called immediately (it's only used on the Subscription page), the browser warns that preloaded chunks are sitting idle.

## Resolution
Move the Razorpay script loading from a static tag in `index.html` to a dynamic loader that only runs when the user visits the Subscription page.

## Action Plan
1. Remove `<script src="https://checkout.razorpay.com/v1/checkout.js"></script>` from `index.html`.
2. Add a `loadScript` utility or a `useEffect` in `Subscription.jsx` to append the script to the DOM only when needed.

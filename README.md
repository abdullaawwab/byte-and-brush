# Byte & Brush Studio — V3 Full Deployable

## Included
- Public Byte & Brush website
- Real server-side AI chatbot
- Server-side enquiry inbox
- Secure owner login using Netlify Identity
- Owner-only dashboard
- Live price/delivery editor stored in Netlify Blobs
- Enquiry list with read/delete controls
- No API keys or owner passwords in browser code

## Deploy

Deploy this folder/repository to Netlify.

### 1. Enable Netlify Identity
In the Netlify site dashboard:
- Identity → Enable Identity
- Set registration to **Invite only**
- Add/invite the owner's email address

The owner email must exactly match the `ADMIN_EMAIL` environment variable.

### 2. Add environment variables
Netlify → Project configuration → Environment variables:

`ADMIN_EMAIL`
- The exact email address of the owner Identity account.

`OPENAI_API_KEY`
- Your OpenAI API key.

Optional:
`OPENAI_MODEL`
- Model name you want the chatbot to use. The default in `netlify/functions/chat.mjs` is `gpt-5-mini`.

Set sensitive variables in Netlify's UI/API, not in `netlify.toml`.

### 3. AI function
The public website calls:
`/.netlify/functions/chat`

The key stays server-side. Visitors do not see it.

### 4. Enquiries
The public form sends JSON to:
`/.netlify/functions/enquiry`

Enquiries are stored privately in Netlify Blobs.

The owner opens:
`/dashboard`

and signs in with the invited Identity account.

### 5. Price updates
The dashboard writes the current prices to the site-wide Netlify Blob store. The public site reads `/public-data` on load, so new prices are used by all visitors without rebuilding the website.

## Security notes
- Never put OPENAI_API_KEY in index.html.
- Keep Netlify Identity registration set to Invite only.
- Keep ADMIN_EMAIL exact and private.
- The dashboard and all owner APIs verify the authenticated Identity session server-side.
- Public visitors can submit enquiries but cannot read the inbox or change prices.
- The public pricing endpoint exposes only business pricing data, not owner data or enquiries.

## Local development
Use Netlify CLI so Functions, Identity-compatible routing, environment variables, and Blobs are emulated as closely as possible. A plain `file://` open of index.html cannot run the server-side features.

## First test checklist
1. Invite owner in Netlify Identity.
2. Set ADMIN_EMAIL.
3. Set OPENAI_API_KEY.
4. Deploy.
5. Open /dashboard and sign in.
6. Change Website price and save.
7. Open the public site in a new/incognito tab and verify the new price.
8. Submit an enquiry.
9. Return to /dashboard and verify it appears.
10. Test AI with pricing and general questions.

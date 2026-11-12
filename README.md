# Step by Step social sign-off

A review page for social media posts before they go out. Reviewers open the page, look through each
post and approve it, ask for changes or comment. Their answers go into ClickUp
(Marketing General › Social sign-off) and show under each post on the page.

- **Page:** published with GitHub Pages from this repo.
- **Sign-offs:** a public ClickUp form. Each post's buttons open it with the campaign, post and decision
  filled in. Ticking several posts approves them in one go.
- **Comments on the page:** every 10 minutes a GitHub Action reads the ClickUp list and rebuilds the page.
  It needs a ClickUp API token saved as the repository secret `CLICKUP_TOKEN`.
- **Password:** a light screen to keep casual visitors out, not real security. The posts are drafts of
  public posts. Change it in `config.js`.

Posts and images are exported here from the marketing team's social workspace; don't edit
`data/campaigns.json` or `media/` by hand.

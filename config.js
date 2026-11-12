// Review site settings.
window.REVIEW = {
  // Public ClickUp form that records sign-offs. Campaign, Posts and Decision are pre-filled from the link.
  formUrl: "https://forms.clickup.com/20597520/f/kmjrg-35812/NGAP1T2EC7XD24FHY2",
  // SHA-256 of the review password. This is a light gate, not real security: the posts become public anyway.
  // To change it: node -e "console.log(require('crypto').createHash('sha256').update('NEW PASSWORD').digest('hex'))"
  passwordHash: "ed9e5d06c737d9d770a2143cc66a30dc96b4ef8fa4fb1af0570ec2a177db69dc"
};

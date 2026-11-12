// Pull sign-offs from the ClickUp "Social sign-off" list into data/comments.json.
// Runs in GitHub Actions with the CLICKUP_TOKEN secret. Without a token it leaves the file alone.
// Output: { "<Campaign name>": { "<post ref>": [ {name, team, decision, comment, date, bulk} ] } }
import fs from "node:fs";

const LIST_ID = "901223603966";
const F = {
  campaign: "7d7aaf14-23e7-4893-a9a5-4c681f2540e4",
  posts: "ae177b24-2441-4529-bb46-8e03a1165259",
  decision: "7671437f-25d7-46c7-a5b6-53c3f2ca510a",
  team: "45f00305-755e-427a-8529-c8be7a12a351",
  comment: "1c87a0cb-cb4d-4975-9da1-52cf0e97cd0d",
  outcome: "16c4b463-cf2e-4601-a830-78088da94057", // Done / Not changing: set in ClickUp once a comment is dealt with
  reply: "6cd8cbb5-f798-43c8-aa34-bb877ff9a7b0"
};
const token = process.env.CLICKUP_TOKEN;
if (!token) { console.log("No CLICKUP_TOKEN set: keeping the existing comments file."); process.exit(0); }

const tasks = [];
for (let page = 0; page < 50; page++) {
  const r = await fetch(`https://api.clickup.com/api/v2/list/${LIST_ID}/task?include_closed=true&subtasks=false&page=${page}`, { headers: { Authorization: token } });
  if (!r.ok) { console.error("ClickUp said", r.status, await r.text()); process.exit(1); }
  const j = await r.json();
  tasks.push(...j.tasks);
  if (j.last_page !== false || !j.tasks.length) break;
}

const val = (t, id) => {
  const f = (t.custom_fields || []).find(x => x.id === id);
  if (!f || f.value == null || f.value === "") return "";
  if (f.type === "drop_down") {
    const o = (f.type_config.options || []).find(o => o.orderindex === Number(f.value) || o.id === f.value);
    return o ? o.name : "";
  }
  return String(f.value).trim();
};

const out = {};
for (const t of tasks) {
  const campaign = val(t, F.campaign);
  const refs = val(t, F.posts).split(/[,\s]+/).map(s => s.trim().toUpperCase()).filter(Boolean);
  if (!campaign || !refs.length) continue;
  const entry = {
    name: t.name, team: val(t, F.team), decision: val(t, F.decision) || "Comment only",
    comment: val(t, F.comment), date: Number(t.date_created), bulk: refs.length > 1,
    outcome: val(t, F.outcome), reply: val(t, F.reply)
  };
  for (const ref of refs) ((out[campaign] ||= {})[ref] ||= []).push(entry);
}
fs.writeFileSync("data/comments.json", JSON.stringify(out, null, 1));
console.log(`Synced ${tasks.length} sign-off(s).`);

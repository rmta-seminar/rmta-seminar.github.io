import { access, cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");

function parseSeminarContent(markdown) {
  const [aboutBlock = "", organizersBlock = "", talksBlock = ""] = markdown.split(/^## /m);
  const aboutLines = aboutBlock.split("\n").map((line) => line.trim());
  const organizersLines = organizersBlock.split("\n").map((line) => line.trim());
  const findValue = (label, fallback = "") => {
    const line = aboutLines.find((entry) => entry.startsWith(`${label}:`));
    return line ? line.slice(label.length + 1).trim() : fallback;
  };

  const organizers = organizersLines.filter((line) => line.startsWith("- ")).map((line) => {
    const [name = "", affiliation = "", website = ""] = line.slice(2).split(" | ");
    return { name: name.trim(), affiliation: affiliation.trim(), website: website.trim() };
  });

  const talks = talksBlock.split(/^### /m).slice(1).map((block) => {
    const lines = block.split("\n");
    const slug = lines.shift()?.trim() ?? "";
    const fields = {};
    let abstractStart = -1;
    lines.forEach((line, index) => {
      if (line.trim() === "Abstract:") {
        abstractStart = index + 1;
        return;
      }
      if (abstractStart !== -1) return;
      const separator = line.indexOf(":");
      if (separator > 0) fields[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
    });
    return {
      slug,
      date: fields.Date ?? "",
      start: fields.Start ?? "",
      end: fields.End ?? "",
      speaker: fields.Speaker ?? "",
      affiliation: fields.Affiliation ?? "",
      website: fields.Website ?? "",
      poster: fields.Poster ?? "",
      title: fields.Title ?? "",
      abstract: abstractStart < 0 ? "" : lines.slice(abstractStart).join("\n").trim(),
    };
  }).filter((talk) => talk.date && talk.start && talk.end && talk.speaker && talk.title);

  if (!talks.length) throw new Error("No valid talks were found in content/seminars.md");
  return {
    eyebrow: findValue("Eyebrow", "RMTA China"),
    heading: findValue("Heading", "Online Seminar"),
    introduction: findValue("Introduction"),
    scheduleNote: findValue("Schedule"),
    organizers,
    talks,
  };
}

const [markdown, template, styles, script] = await Promise.all([
  readFile(resolve(root, "content/seminars.md"), "utf8"),
  readFile(resolve(root, "src/template.html"), "utf8"),
  readFile(resolve(root, "src/styles.css"), "utf8"),
  readFile(resolve(root, "src/site.js"), "utf8"),
]);
const seminarContent = parseSeminarContent(markdown);
const missingPosters = [];
for (const talk of seminarContent.talks) {
  if (!talk.poster) continue;
  try {
    await access(resolve(root, "posters", talk.poster));
  } catch {
    missingPosters.push(`${talk.poster} (${talk.speaker})`);
  }
}
if (missingPosters.length) {
  throw new Error(`Poster file${missingPosters.length === 1 ? " is" : "s are"} missing from the posters folder:\n- ${missingPosters.join("\n- ")}`);
}
const content = JSON.stringify(seminarContent).replaceAll("</script", "<\\/script");
const html = template.replace("{{STYLES}}", styles).replace("{{CONTENT}}", content).replace("{{SCRIPT}}", script.replaceAll("</script", "<\\/script"));

await rm(output, { recursive: true, force: true });
await mkdir(resolve(output, "posters"), { recursive: true });
await Promise.all([
  writeFile(resolve(root, "index.html"), html),
  writeFile(resolve(output, "index.html"), html),
  cp(resolve(root, "logo.jpg"), resolve(output, "logo.jpg")),
  cp(resolve(root, "posters"), resolve(output, "posters"), { recursive: true }),
]);
console.log(`Built ${resolve(root, "index.html")}`);

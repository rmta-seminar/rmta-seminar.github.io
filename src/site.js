(() => {
  const content = window.SEMINAR_CONTENT;
  const site = document.getElementById("site");
  const state = { query: "", year: "All" };
  const escapeHtml = (value = "") => String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);
  const safeUrl = (url = "") => /^https?:\/\//i.test(url) ? escapeHtml(url) : "";
  const posterPath = (poster = "") => `posters/${encodeURIComponent(poster).replaceAll("%2F", "/")}`;
  const talkEnd = (talk) => new Date(`${talk.date}T${talk.end}:00+08:00`).getTime();
  const formatDate = (talk, short = false) => new Intl.DateTimeFormat("en-GB", short ? { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Shanghai" } : { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Shanghai" }).format(new Date(`${talk.date}T12:00:00+08:00`));

  function talkCard(talk, featured = false) {
    const abstract = talk.abstract.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const speaker = safeUrl(talk.website) ? `<a href="${safeUrl(talk.website)}" target="_blank" rel="noreferrer">${escapeHtml(talk.speaker)}</a>` : escapeHtml(talk.speaker);
    const posterLink = talk.poster
      ? `<button class="poster-link" type="button" data-poster="${escapeHtml(talk.slug)}" aria-label="View poster for ${escapeHtml(talk.title)}">View poster</button>`
      : "";
    return `<article class="talk-card${featured ? " featured" : ""}"><div class="talk-content"><p class="talk-date">${featured ? "Next talk · " : ""}${formatDate(talk, !featured)} · ${escapeHtml(talk.start)}–${escapeHtml(talk.end)} Beijing</p><h3>${escapeHtml(talk.title)}</h3><p class="speaker">${speaker} <span>— ${escapeHtml(talk.affiliation)}</span></p><div class="talk-links">${posterLink}<details><summary>Abstract <span aria-hidden="true">+</span></summary><div class="abstract">${abstract}</div></details></div></div></article>`;
  }

  function render() {
    if (window.MathJax?.typesetClear) window.MathJax.typesetClear([site]);
    const now = Date.now();
    const upcoming = content.talks.filter((talk) => talkEnd(talk) >= now).sort((a, b) => talkEnd(a) - talkEnd(b));
    const past = content.talks.filter((talk) => talkEnd(talk) < now).sort((a, b) => talkEnd(b) - talkEnd(a));
    const years = [...new Set(past.map((talk) => talk.date.slice(0, 4)))];
    const filteredPast = past.filter((talk) => (state.year === "All" || talk.date.startsWith(state.year)) && `${talk.speaker} ${talk.affiliation} ${talk.title} ${talk.abstract}`.toLowerCase().includes(state.query.toLowerCase()));

    site.innerHTML = `
      <header class="site-header">
        <a class="brand" href="#top"><img src="logo.jpg" alt="RMTA China"><span>RMTA China</span></a>
        <nav aria-label="Main navigation"><a href="#programme">Upcoming</a><a href="#archive">Past talks</a><a href="#organizers">Organizers</a></nav>
        <a class="join-link" href="mailto:rmta-seminar+subscribe@googlegroups.com">Join mailing list</a>
      </header>

      <section class="intro page-width" id="top">
        <p class="label">${escapeHtml(content.eyebrow)}</p>
        <h1>${escapeHtml(content.heading)}</h1>
        <h2>Random Matrix Theory &amp; Applications</h2>
        <p>${escapeHtml(content.introduction)}</p>
        <p class="schedule">${escapeHtml(content.scheduleNote)}</p>
      </section>

      <section class="section page-width" id="programme">
        <div class="section-header"><h2>Upcoming talks</h2></div>
        ${upcoming.length ? `<div class="talks">${upcoming.map((talk, index) => talkCard(talk, index === 0)).join("")}</div>` : `<p class="empty">New talks will be announced through the mailing list.</p>`}
      </section>

      <section class="section page-width" id="archive">
        <div class="section-header archive-header"><h2>Past talks</h2><label class="search"><span class="sr-only">Search past talks</span><input id="archive-search" value="${escapeHtml(state.query)}" placeholder="Search talks"></label></div>
        <div class="filters" aria-label="Filter talks by year">${["All", ...years].map((year) => `<button type="button" data-year="${year}" class="${state.year === year ? "active" : ""}">${year}</button>`).join("")}<span>${filteredPast.length} ${filteredPast.length === 1 ? "talk" : "talks"}</span></div>
        <div class="talks archive-list">${filteredPast.map((talk) => talkCard(talk)).join("")}</div>
        ${filteredPast.length ? "" : `<p class="empty">No matching talks.</p>`}
      </section>

      <section class="section page-width organizers" id="organizers">
        <h2>Organizers</h2>
        <ul>${content.organizers.map((organizer) => `<li><strong>${safeUrl(organizer.website) ? `<a href="${safeUrl(organizer.website)}" target="_blank" rel="noreferrer">${escapeHtml(organizer.name)}</a>` : escapeHtml(organizer.name)}</strong><span>${escapeHtml(organizer.affiliation)}</span></li>`).join("")}</ul>
        <p class="contact">Contact: <a href="mailto:rmta.seminar@gmail.com">rmta.seminar@gmail.com</a></p>
      </section>

      <footer class="page-width"><span>RMTA China</span><a href="#top">Back to top</a></footer>`;
    bind();
    if (window.MathJax?.typesetPromise) window.MathJax.typesetPromise([site]).catch(() => {});
  }

  function bind() {
    document.querySelectorAll("[data-year]").forEach((button) => button.addEventListener("click", () => { state.year = button.dataset.year; render(); location.hash = "archive"; }));
    document.getElementById("archive-search")?.addEventListener("input", (event) => { state.query = event.target.value; render(); const input = document.getElementById("archive-search"); input?.focus(); input?.setSelectionRange(state.query.length, state.query.length); });
    document.querySelectorAll("[data-poster]").forEach((button) => button.addEventListener("click", () => openPoster(content.talks.find((talk) => talk.slug === button.dataset.poster))));
  }

  function openPoster(talk) {
    if (!talk) return;
    const modal = document.createElement("div");
    modal.className = "poster-modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.innerHTML = `<button type="button" class="modal-close">Close</button><img src="${posterPath(talk.poster)}" alt="Poster for ${escapeHtml(talk.speaker)}'s talk">`;
    const close = () => { modal.remove(); document.body.classList.remove("modal-open"); document.removeEventListener("keydown", onKey); };
    const onKey = (event) => { if (event.key === "Escape") close(); };
    modal.addEventListener("mousedown", (event) => { if (event.target === modal) close(); });
    modal.querySelector("button").addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("modal-open");
    document.body.append(modal);
  }

  render();
})();

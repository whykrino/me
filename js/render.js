const Render = (function () {

    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => root.querySelectorAll(sel);

    function icon(type, name) {
        return `<i class="${type} ${name}"></i>`;
    }

    function buildNav(items) {
        $('#navMenu').innerHTML = items
            .map(i => `<a href="#${i.id}">${i.label}</a>`)
            .join('');
    }

    function buildInfo(info) {
        const paragraphs = info.paragraphs.map(p => `<p>${p}</p>`).join('');
        const contacts = info.contacts.items.map(c =>
            `<div class="contact-item">
                ${icon(c.type, c.icon)}
                <span>${c.text}</span>
            </div>`
        ).join('');

        return `
            <section class="card reveal" id="info">
                <div class="card-header">
                    ${icon('fas', info.icon)}
                    <h2>${info.title}</h2>
                </div>
                <div class="info-grid">
                    <div class="info-text">${paragraphs}</div>
                    <div class="info-contacts">
                        <h3>${info.contacts.title}</h3>
                        ${contacts}
                    </div>
                </div>
            </section>
        `;
    }

    function buildProjects(data) {
        const items = data.items.map(p => `
            <div class="project-item">
                <h3>${icon('fas', p.icon)} ${p.title}</h3>
                <div class="project-desc">${p.desc}</div>
                <div class="tech-tags">
                    ${p.tags.map(t => `<span>${t}</span>`).join('')}
                </div>
                <a href="${p.link.href}" class="project-link">
                    ${icon(p.link.type, p.link.icon)} ${p.link.text} →
                </a>
            </div>
        `).join('');

        return `
            <section class="card reveal" id="projects">
                <div class="card-header">
                    ${icon('fas', data.icon)}
                    <h2>${data.title}</h2>
                </div>
                <div class="projects-grid">${items}</div>
            </section>
        `;
    }

    function buildGames(data) {
        const items = data.items.map(g => {
            const meta = g.meta.map(m =>
                `<span>${icon('fas', m.icon)} ${m.text}</span>`
            ).join('');

            return `
                <div class="game-item">
                    <h3>${icon('fas', g.icon)} ${g.title}</h3>
                    <div class="game-meta">${meta}</div>
                    <div class="game-desc">${g.desc}</div>
                    <a href="${g.link.href}" class="game-link">
                        ${icon(g.link.type, g.link.icon)} ${g.link.text} →
                    </a>
                </div>
            `;
        }).join('');

        return `
            <section class="card reveal" id="games">
                <div class="card-header">
                    ${icon('fas', data.icon)}
                    <h2>${data.title}</h2>
                </div>
                <div class="games-grid">${items}</div>
            </section>
        `;
    }

    function buildFooter(text) {
        return `
            <div class="glow-line"></div>
            <footer class="footer">
                ${icon('fas', 'fa-crown')} ${text} ${icon('fas', 'fa-crown')}
            </footer>
        `;
    }

    function renderAll(data) {
        buildNav(data.nav);
        $('#resumeContainer').innerHTML =
            buildInfo(data.info) +
            buildProjects(data.projects) +
            buildGames(data.games) +
            buildFooter(data.footer);
    }

    return { renderAll, $, $$, icon };
})();
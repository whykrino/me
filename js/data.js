const SITE_DATA = {
    nav: [
        { id: 'info', label: 'Информация' },
        { id: 'projects', label: 'Проекты' },
        { id: 'games', label: 'Игры' }
    ],

    terminal: {
        user: 'krino@server',
        commands: [
            { cmd: 'ssh krino@dev.space', delay: 400, duration: 55 },
            { cmd: 'password: ********', delay: 550, duration: 40, muted: true },
            { cmd: 'welcome to krino.dev - portfolio', delay: 450, duration: 30, info: true },
            { cmd: 'loading modules...', delay: 300, duration: 45 },
            { cmd: 'mounting info - projects - games', delay: 350, duration: 40 },
            { cmd: 'starting render pipeline', delay: 350, duration: 35 },
            { cmd: 'status: ready', delay: 400, duration: 35, success: true }
        ]
    },

    info: {
        icon: 'fa-user-astronaut',
        title: 'информация',
        paragraphs: [
            'Привет! Я <span class="highlight">krino</span> - начинающий разработчик, который только открывает для себя мир цифровых продуктов, игр и интерактивных экспериментов. Специализируюсь на <strong>Unity, C#, JavaScript</strong> и веб-технологиях.',
            'Люблю решать сложные задачи, превращать идеи в прототипы и доводить их до полированных релизов. Верю, что хороший код - это баланс между элегантностью и производительностью.',
            'Открыт к интересным проектам, коллаборациям и геймджемам. Всегда рад новым вызовам.'
        ],
        contacts: {
            title: 'контакты',
            items: [
                { icon: 'fa-envelope', text: 'whykrino@gmail.com', type: 'fas' },
                { icon: 'fa-github', text: 'github.com/whykrino', type: 'fab' },
                { icon: 'fa-telegram', text: '@whykrino', type: 'fab' },
                { icon: 'fa-map-pin', text: 'Москва / Remote', type: 'fas' }
            ]
        }
    },

    projects: {
        icon: 'fa-code',
        title: 'проекты',
        items: [
            {
                icon: 'fa-cube',
                title: 'FAMI Project',
                desc: 'Команда энтузиастов, превращающая идеи в качественные игры на Unity. Мы уделяем внимание каждой детали геймплея, создавая проекты, которые находят отклик в сердцах игроков.',
                tags: ['Unity', 'C#', 'Game Design'],
                link: { href: '#', icon: 'fa-github', type: 'fab', text: 'Coming soon...' }
            },
            {
                icon: 'fa-palette',
                title: 'DESINGCORD',
                desc: 'Студия дизайна, рождённая в Discord и живущая творчеством. Мы создаём рисованные работы, которые говорят за себя: стильно, атмосферно и с любовью к деталям.',
                tags: ['Digital Art', 'Design', 'Branding'],
                link: { href: '#', icon: 'fa-external-link-alt', type: 'fas', text: 'Coming soon...' }
            },
            {
                icon: 'fa-circle-question',
                title: 'null',
                desc: 'null',
                tags: ['null'],
                link: { href: '#', icon: 'fa-link', type: 'fas', text: 'Coming soon...' }
            }
        ]
    },

    games: {
        icon: 'fa-gamepad',
        title: 'игры',
        items: [
            {
                icon: 'fa-skull',
                title: 'Curse Of Death',
                meta: [
                    { icon: 'fa-tag', text: 'Хоррор / Экшен' },
                    { icon: 'fa-calendar', text: '2023' }
                ],
                desc: 'Мрачный хоррор, где каждое проклятие приближает тебя к неизбежному. Сражаясь в одиночку с тьмой, ты должен разорвать смертельный круг, пока он не поглотил тебя целиком.',
                link: { href: '#', icon: 'fa-steam', type: 'fab', text: 'Coming soon...' }
            },
            {
                icon: 'fa-circle-question',
                title: 'null',
                meta: [
                    { icon: 'fa-tag', text: 'null' },
                    { icon: 'fa-calendar', text: 'null' }
                ],
                desc: 'null',
                link: { href: '#', icon: 'fa-steam', type: 'fab', text: 'Coming soon...' }
            },
            {
                icon: 'fa-circle-question',
                title: 'null',
                meta: [
                    { icon: 'fa-tag', text: 'null' },
                    { icon: 'fa-calendar', text: 'null' }
                ],
                desc: 'null',
                link: { href: '#', icon: 'fa-steam', type: 'fab', text: 'Coming soon...' }
            }
        ]
    },

    footer: 'krino - портфолио 2026'
};
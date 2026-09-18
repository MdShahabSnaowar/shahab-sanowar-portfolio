const lines = [
    { text: "$ git init && git add .", type: "command" },
    { text: "$ git present --portfolio=\"Shahab\"", type: "command" },
    { text: "⏳ compiling...", type: "compiling" },
    { text: "portfolio — online & ready", type: "url" }
];

const cli = document.getElementById("cli");
const hero = document.getElementById("hero");
const terminal = document.getElementById("terminal-lines");

let lineIndex = 0;

if (cli && hero && terminal) {
    cli.style.display = "flex";
    cli.classList.remove("hide");
    hero.classList.remove("visible");
    document.body.classList.add("intro-active");

    setTimeout(typeNextLine, 700);
}

function typeNextLine() {

    if (lineIndex >= lines.length) {
        setTimeout(finishIntro, 1200);
        return;
    }

    const item = lines[lineIndex];

    const line =
        document.createElement("div");

    line.className = "line";

    terminal.appendChild(line);

    requestAnimationFrame(() => {
        line.classList.add("show");
    });


    if (item.type === "command") {

        const prompt =
            document.createElement("span");

        prompt.className = "prompt";
        prompt.textContent = "$";


        const text =
            document.createElement("span");

        text.className = "typed-text";


        const cursor =
            document.createElement("span");

        cursor.className =
            "typing-cursor";


        line.append(
            prompt,
            document.createTextNode(" "),
            text,
            cursor
        );


        typeCharacters(
            item.text.substring(2),
            text,
            cursor,
            nextLine
        );

        return;
    }


    if (item.type === "compiling") {
        line.classList.add("compiling");
    }

    else if (item.type === "url") {
        line.classList.add("url");
    }


    const text =
        document.createElement("span");


    const cursor =
        document.createElement("span");

    cursor.className =
        "typing-cursor";


    line.append(
        text,
        cursor
    );


    typeCharacters(
        item.text,
        text,
        cursor,
        nextLine
    );
}


function nextLine() {

    lineIndex++;

    setTimeout(
        typeNextLine,
        lineIndex === 2
            ? 800
            : 500
    );
}


function typeCharacters(
    value,
    element,
    cursor,
    done
) {

    let i = 0;


    function tick() {

        if (i < value.length) {

            element.textContent +=
                value[i++];

            element.parentElement
                .appendChild(cursor);


            setTimeout(
                tick,
                getTypingSpeed()
            );

        }

        else {

            cursor.remove();

            done();
        }
    }


    tick();
}


function getTypingSpeed() {

    const speeds = [
        35,
        40,
        45,
        50,
        55
    ];


    return speeds[
        Math.floor(
            Math.random() *
            speeds.length
        )
    ];
}


function finishIntro() {

    if (!cli || !hero) {
        return;
    }


    document.body.classList.remove(
        "intro-active"
    );


    cli.classList.add(
        "hide"
    );


    setTimeout(() => {

        hero.classList.add(
            "visible"
        );

        document.body.classList.add(
            "home-active"
        );

    }, 250);


    setTimeout(() => {

        cli.style.display =
            "none";

    }, 900);
}


/* ==========================================================
   HERO ROLE TYPEWRITER
   ========================================================== */

/* ==========================================================
   ROLE TYPEWRITER — HERO + ABOUT
   Same animation on both pages
   ========================================================== */

const roleText =
    document.getElementById("role-text");

const aboutRoleText =
    document.getElementById("about-role-text");


const roles = [
    "Backend Developer",
    "Python Developer",
    "Django Developer",
    "REST API Developer",
    "Software Engineer"
];


let roleIndex = 0;
let roleCharIndex = 0;
let deletingRole = false;


function updateRoleText(text) {

    if (roleText) {
        roleText.textContent = text;
    }

    if (aboutRoleText) {
        aboutRoleText.textContent = text;
    }
}


function typeRole() {

    const currentRole =
        roles[roleIndex];


    /* ==========================================
       TYPING
       ========================================== */

    if (!deletingRole) {

        const text =
            currentRole.substring(
                0,
                roleCharIndex + 1
            );

        updateRoleText(text);

        roleCharIndex++;


        // Complete role
        if (
            roleCharIndex ===
            currentRole.length
        ) {

            setTimeout(() => {

                deletingRole = true;

                typeRole();

            }, 1400);

            return;
        }


        setTimeout(
            typeRole,
            90
        );

        return;
    }


    /* ==========================================
       DELETING
       ========================================== */

    const text =
        currentRole.substring(
            0,
            roleCharIndex - 1
        );

    updateRoleText(text);

    roleCharIndex--;


    // Role completely deleted
    if (roleCharIndex === 0) {

        deletingRole = false;

        roleIndex =
            (roleIndex + 1) %
            roles.length;


        setTimeout(
            typeRole,
            300
        );

        return;
    }


    setTimeout(
        typeRole,
        55
    );
}


/* ==========================================
   START
   ========================================== */

setTimeout(
    typeRole,
    1200
);


/* ==========================================================
   INDIVIDUAL STAR PARTICLES
   ========================================================== */
/* ==========================================================
   GLOBAL INDIVIDUAL STAR PARTICLES
   Hero + About + Skills + Projects + Journey + CTA + Testimonials
   ========================================================== */

(function initStarParticles() {

    const selectors = [
        ".hero-page .stars",
        ".about-page .about-particles",
        ".skills-page .skills-stars",
        ".featured-projects-page .projects-stars",
        ".journey-page .journey-stars",
        ".opportunity-page .opportunity-stars",
        ".testimonials-page .testimonials-stars"
    ];

    const random = (min, max) =>
        Math.random() * (max - min) + min;

    function ensureContainer(selector) {
        const existing = document.querySelector(selector);

        if (existing) {
            return existing;
        }

        if (selector === ".about-page .about-particles") {
            const page = document.querySelector(".about-page");

            if (!page) {
                return null;
            }

            const layer = document.createElement("div");

            layer.className = "about-particles";

            layer.setAttribute(
                "aria-hidden",
                "true"
            );

            page.prepend(layer);

            return layer;
        }

        if (selector === ".opportunity-page .opportunity-stars") {
            const page =
                document.querySelector(
                    ".opportunity-page"
                );

            if (!page) {
                return null;
            }

            const layer =
                document.createElement("div");

            layer.className =
                "opportunity-stars";

            layer.setAttribute(
                "aria-hidden",
                "true"
            );

            page.prepend(layer);

            return layer;
        }

        return null;
    }


    function createParticles(
        container,
        count,
        driftAmount = 10
    ) {

        if (!container) {
            return;
        }

        container
            .querySelectorAll(
                ".star-particle"
            )
            .forEach(
                star => star.remove()
            );


        const fragment =
            document.createDocumentFragment();


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const star =
                document.createElement(
                    "span"
                );


            star.className =
                "star-particle";


            star.setAttribute(
                "aria-hidden",
                "true"
            );


            const size =
                random(1.3, 3.0);


            const duration =
                random(4.5, 9.0);


            const delay =
                random(-9, 0);


            const minOpacity =
                random(0.18, 0.38);


            const maxOpacity =
                random(0.55, 0.9);


            const midOpacity =
                random(0.30, 0.58);


            const x1 =
                random(
                    -driftAmount,
                    driftAmount
                );


            const y1 =
                random(
                    -driftAmount,
                    driftAmount
                );


            const x2 =
                x1 +
                random(
                    -driftAmount,
                    driftAmount
                );


            const y2 =
                y1 +
                random(
                    -driftAmount,
                    driftAmount
                );


            const x3 =
                x2 +
                random(
                    -driftAmount,
                    driftAmount
                );


            const y3 =
                y2 +
                random(
                    -driftAmount,
                    driftAmount
                );


            const x4 =
                x3 +
                random(
                    -driftAmount,
                    driftAmount
                );


            const y4 =
                y3 +
                random(
                    -driftAmount,
                    driftAmount
                );


            star.style.setProperty(
                "--left",
                `${random(2, 98)}%`
            );


            star.style.setProperty(
                "--top",
                `${random(3, 97)}%`
            );


            star.style.setProperty(
                "--size",
                `${size.toFixed(2)}px`
            );


            star.style.setProperty(
                "--duration",
                `${duration.toFixed(2)}s`
            );


            star.style.setProperty(
                "--delay",
                `${delay.toFixed(2)}s`
            );


            star.style.setProperty(
                "--min-opacity",
                minOpacity.toFixed(2)
            );


            star.style.setProperty(
                "--mid-opacity",
                midOpacity.toFixed(2)
            );


            star.style.setProperty(
                "--max-opacity",
                maxOpacity.toFixed(2)
            );


            star.style.setProperty(
                "--x1",
                `${x1.toFixed(1)}px`
            );


            star.style.setProperty(
                "--y1",
                `${y1.toFixed(1)}px`
            );


            star.style.setProperty(
                "--x2",
                `${x2.toFixed(1)}px`
            );


            star.style.setProperty(
                "--y2",
                `${y2.toFixed(1)}px`
            );


            star.style.setProperty(
                "--x3",
                `${x3.toFixed(1)}px`
            );


            star.style.setProperty(
                "--y3",
                `${y3.toFixed(1)}px`
            );


            star.style.setProperty(
                "--x4",
                `${x4.toFixed(1)}px`
            );


            star.style.setProperty(
                "--y4",
                `${y4.toFixed(1)}px`
            );


            star.style.setProperty(
                "--star-color",
                Math.random() < 0.20
                    ? "#7efcff"
                    : "#ffffff"
            );


            fragment.appendChild(
                star
            );
        }


        container.appendChild(
            fragment
        );
    }


    function buildParticles() {

        const mobile =
            window.innerWidth <= 850;


        const configs = [

            [
                ".hero-page .stars",
                mobile ? 34 : 58,
                10
            ],

            [
                ".about-page .about-particles",
                mobile ? 22 : 38,
                8
            ],

            [
                ".skills-page .skills-stars",
                mobile ? 24 : 42,
                8
            ],

            [
                ".featured-projects-page .projects-stars",
                mobile ? 26 : 46,
                9
            ],

            [
                ".journey-page .journey-stars",
                mobile ? 24 : 42,
                8
            ],

            [
                ".opportunity-page .opportunity-stars",
                mobile ? 18 : 32,
                7
            ],

            [
                ".testimonials-page .testimonials-stars",
                mobile ? 26 : 46,
                9
            ]

        ];


        configs.forEach(
            ([selector, count, drift]) => {

                const container =
                    ensureContainer(
                        selector
                    );


                createParticles(
                    container,
                    count,
                    drift
                );

            }
        );
    }


    buildParticles();


    let lastMobile =
        window.innerWidth <= 850;


    window.addEventListener(
        "resize",
        () => {

            const mobile =
                window.innerWidth <= 850;


            if (
                mobile !==
                lastMobile
            ) {

                lastMobile =
                    mobile;


                buildParticles();
            }

        }
    );

})();


/* ==========================================================
   BACKEND TECH STACK — RELIABLE HOVER DETAILS
   ========================================================== */

(function initTechStackHover() {

    const icons =
        document.querySelectorAll(
            ".tech-orbit"
        );


    const card =
        document.querySelector(
            ".tech-details"
        );


    if (
        !icons.length ||
        !card
    ) {
        return;
    }


    const title =
        card.querySelector(
            ".tech-details-title"
        );


    const text =
        card.querySelector(
            ".tech-details-text"
        );


    const cardIcon =
        card.querySelector(
            ".tech-details-icon img"
        );


    const closeButton =
        card.querySelector(
            ".tech-details-close"
        );


    const details = {

        python: {
            name: "Python",

            text:
                "Backend programming language used for APIs, automation and application logic."
        },


        django: {
            name: "Django",

            text:
                "Python web framework for building secure, scalable and maintainable backend applications."
        },


        postgresql: {
            name: "PostgreSQL",

            text:
                "Reliable relational database for storing and managing application data."
        },


        redis: {
            name: "Redis",

            text:
                "Fast in-memory data store used for caching, sessions and background tasks."
        },


        docker: {
            name: "Docker",

            text:
                "Container platform used to package and run backend applications consistently."
        },


        git: {
            name: "Git",

            text:
                "Version control system used to manage source code and project history."
        }

    };


    function getKey(icon) {

        const titleValue =
            (
                icon.getAttribute(
                    "title"
                ) || ""
            ).toLowerCase();


        const image =
            icon.querySelector(
                "img"
            );


        const alt =
            (
                image?.getAttribute(
                    "alt"
                ) || ""
            ).toLowerCase();


        const value =
            `${titleValue} ${alt}`;


        if (
            value.includes(
                "python"
            )
        ) {
            return "python";
        }


        if (
            value.includes(
                "django"
            )
        ) {
            return "django";
        }


        if (
            value.includes(
                "postgres"
            )
        ) {
            return "postgresql";
        }


        if (
            value.includes(
                "redis"
            )
        ) {
            return "redis";
        }


        if (
            value.includes(
                "docker"
            )
        ) {
            return "docker";
        }


        if (
            value.includes(
                "git"
            )
        ) {
            return "git";
        }


        return null;
    }


    let activeIcon = null;

    let frame = null;

    let touchTimer = null;


    function positionCard() {

        if (!activeIcon) {
            return;
        }


        const visual =
            activeIcon.closest(
                ".profile-visual"
            );


        if (!visual) {
            return;
        }


        const iconRect =
            activeIcon.getBoundingClientRect();


        const visualRect =
            visual.getBoundingClientRect();


        const x =
            iconRect.left +
            iconRect.width / 2 -
            visualRect.left;


        const y =
            iconRect.top -
            visualRect.top -
            14;


        card.style.left =
            `${x}px`;


        card.style.top =
            `${y}px`;
    }


    function follow() {

        if (!activeIcon) {

            frame = null;

            return;
        }


        positionCard();


        frame =
            requestAnimationFrame(
                follow
            );
    }


    function show(
        icon,
        key
    ) {

        const data =
            details[key];


        if (!data) {
            return;
        }


        activeIcon =
            icon;


        title.textContent =
            data.name;


        text.textContent =
            data.text;


        const sourceImage =
            icon.querySelector(
                "img"
            );


        if (
            sourceImage &&
            cardIcon
        ) {

            cardIcon.src =
                sourceImage.src;


            cardIcon.alt =
                data.name;
        }


        card.classList.add(
            "is-open"
        );


        card.setAttribute(
            "aria-hidden",
            "false"
        );


        positionCard();


        if (frame) {

            cancelAnimationFrame(
                frame
            );
        }


        follow();
    }


    function hide() {

        activeIcon = null;


        if (frame) {

            cancelAnimationFrame(
                frame
            );

            frame = null;
        }


        card.classList.remove(
            "is-open"
        );


        card.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    icons.forEach(
        icon => {

            const key =
                getKey(icon);


            if (!key) {
                return;
            }


            icon.style.pointerEvents =
                "auto";


            icon.setAttribute(
                "tabindex",
                "0"
            );


            /*
             * Desktop:
             * Hover starts the tooltip.
             */

            icon.addEventListener(
                "pointerenter",
                event => {

                    if (
                        event.pointerType !==
                        "touch"
                    ) {

                        show(
                            icon,
                            key
                        );
                    }
                }
            );


            /*
             * Desktop:
             * Leaving the icon hides it.
             */

            icon.addEventListener(
                "pointerleave",
                event => {

                    if (
                        event.pointerType !==
                        "touch"
                    ) {

                        hide();
                    }
                }
            );


            /*
             * Mobile:
             * Tap the icon to show the
             * same tooltip for 2.2 seconds.
             */

            icon.addEventListener(
                "pointerdown",
                event => {

                    if (
                        event.pointerType !==
                        "touch"
                    ) {
                        return;
                    }


                    event.preventDefault();


                    show(
                        icon,
                        key
                    );


                    clearTimeout(
                        touchTimer
                    );


                    touchTimer =
                        setTimeout(
                            hide,
                            2200
                        );
                }
            );


            /*
             * Keyboard accessibility.
             */

            icon.addEventListener(
                "focus",
                () => {

                    show(
                        icon,
                        key
                    );
                }
            );


            icon.addEventListener(
                "blur",
                hide
            );

        }
    );


    /*
     * Existing close button is kept
     * for accessibility.
     */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                hide();
            }
        );
    }


    /*
     * Escape closes the tooltip.
     */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                hide();
            }
        }
    );


    /*
     * Keep the card correctly positioned
     * after resizing.
     */

    window.addEventListener(
        "resize",
        () => {

            if (activeIcon) {

                positionCard();
            }
        }
    );

})();


/* ==========================================================
   SKILLS PAGE — SCROLL REVEAL
   ========================================================== */

(function initSkillsSection() {

    const skillsPage =
        document.querySelector(".skills-page");

    if (!skillsPage) {
        return;
    }


    // ------------------------------------------------------
    // Reveal skills section when it enters viewport
    // ------------------------------------------------------

    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            skillsPage.classList.add(
                                "skills-visible"
                            );


                            observer.unobserve(
                                skillsPage
                            );
                        }

                    });

                },
                {
                    threshold: 0.16
                }
            );


        observer.observe(
            skillsPage
        );

    }

    else {

        // Browser fallback
        skillsPage.classList.add(
            "skills-visible"
        );
    }


    // ------------------------------------------------------
    // Keyboard accessibility
    // ------------------------------------------------------

    const cards =
        skillsPage.querySelectorAll(
            ".skill-card"
        );


    cards.forEach(card => {

        card.setAttribute(
            "tabindex",
            "0"
        );


        card.addEventListener(
            "focus",
            () => {

                card.classList.add(
                    "skill-focused"
                );

            }
        );


        card.addEventListener(
            "blur",
            () => {

                card.classList.remove(
                    "skill-focused"
                );

            }
        );

    });

})();


/* ==========================================================
   FEATURED PROJECTS — PROJECT SHOWCASE
   New functionality only
   Existing JavaScript remains untouched
   ========================================================== */
/* ==========================================================
   FEATURED PROJECTS — CINEMATIC HORIZONTAL SCROLL
   ========================================================== */

(function initFeaturedProjects() {

    const section =
        document.querySelector(
            ".featured-projects-page"
        );

    const track =
        document.getElementById(
            "projects-track"
        );

    const slides =
        document.querySelectorAll(
            ".project-slide"
        );

    const dots =
        document.querySelectorAll(
            ".project-dot"
        );

    const previousButton =
        document.getElementById(
            "project-prev"
        );

    const nextButton =
        document.getElementById(
            "project-next"
        );


    if (
        !section ||
        !track ||
        !slides.length
    ) {
        return;
    }


    let activeIndex = 0;

    let isLocked = false;

    let wheelAccumulator = 0;

    let touchStartX = 0;

    let touchStartY = 0;


    const SLIDE_DURATION = 850;

    const WHEEL_THRESHOLD = 55;


    /* ======================================================
       SET ACTIVE PROJECT
       ====================================================== */

    function setProject(
        index,
        direction = 0
    ) {

        if (
            index < 0 ||
            index >= slides.length ||
            index === activeIndex
        ) {
            return false;
        }


        const oldIndex =
            activeIndex;


        activeIndex =
            index;


        /*
         * Direction class
         */
        section.classList.remove(
            "project-next",
            "project-previous"
        );


        if (direction > 0) {

            section.classList.add(
                "project-next"
            );

        }
        else if (direction < 0) {

            section.classList.add(
                "project-previous"
            );

        }


        /*
         * Move complete horizontal track
         */
        track.style.transform =
            `translate3d(-${index * 100}vw, 0, 0)`;


        /*
         * Update slides
         */
        slides.forEach(
            (slide, slideIndex) => {

                slide.classList.toggle(
                    "active",
                    slideIndex === index
                );


                slide.classList.toggle(
                    "previous",
                    slideIndex < index
                );


                slide.setAttribute(
                    "aria-hidden",
                    slideIndex === index
                        ? "false"
                        : "true"
                );

            }
        );


        /*
         * Update progress indicators
         */
        dots.forEach(
            (dot, dotIndex) => {

                const isActive =
                    dotIndex === index;


                dot.classList.toggle(
                    "active",
                    isActive
                );


                dot.setAttribute(
                    "aria-current",
                    isActive
                        ? "true"
                        : "false"
                );

            }
        );


        /*
         * Reset direction class
         */
        setTimeout(
            () => {

                section.classList.remove(
                    "project-next",
                    "project-previous"
                );

            },
            SLIDE_DURATION
        );


        /*
         * Keep browser happy
         */
        void oldIndex;


        return true;
    }

    /* ======================================================
   EXPOSE PROJECT STATE SYNC
   Used by seamless 03 → 01 loop
   ====================================================== */

window.__syncProjectIndex = function (
    index,
    silent = false
) {

    if (silent) {
        activeIndex = index;
        return true;
    }

    return setProject(
        index,
        0
    );

};


    /* ======================================================
       NEXT PROJECT
       ====================================================== */
/* ======================================================
   NEXT PROJECT
   ====================================================== */

function nextProject() {

    /*
     * Project 03 par pahunchne ke baad
     * seamless forward loop handle karo.
     *
     * The auto-slide handler is defined later
     * in this file.
     */

    if (
        activeIndex >=
        slides.length - 1
    ) {

        if (
            typeof window.__seamlessProjectLoop ===
            "function"
        ) {

            return window.__seamlessProjectLoop();

        }

        return false;
    }


    return setProject(
        activeIndex + 1,
        1
    );
}


    /* ======================================================
       PREVIOUS PROJECT
       ====================================================== */

    function previousProject() {

        if (
            activeIndex <= 0
        ) {
            return false;
        }


        return setProject(
            activeIndex - 1,
            -1
        );
    }


    /* ======================================================
       CHECK WHETHER PROJECT SECTION IS VISIBLE
       ====================================================== */

    function isSectionActive() {

        const rect =
            section.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        /*
         * Section should occupy the viewport
         * before wheel hijacking starts.
         */
        return (
            rect.top <= 60 &&
            rect.top >= -60 &&
            rect.bottom >=
                viewportHeight * 0.6
        );
    }


    /* ======================================================
   WHEEL / MOUSE SCROLL
   ====================================================== */

window.addEventListener(
    "wheel",
    event => {

        if (
            !isSectionActive()
        ) {
            return;
        }


        /*
         * Ignore tiny trackpad movement.
         */
        if (
            Math.abs(event.deltaY) < 2
        ) {
            return;
        }


        /*
         * If project animation is running,
         * consume the wheel temporarily.
         */
        if (isLocked) {

            event.preventDefault();

            return;
        }


        /*
         * Accumulate wheel movement.
         */
        wheelAccumulator += event.deltaY;


        /*
         * Wait until enough wheel movement
         * is available to change project.
         */
        if (
            Math.abs(wheelAccumulator) <
            WHEEL_THRESHOLD
        ) {

            /*
             * We are still inside the project
             * navigation area, so prevent the
             * browser from moving the page.
             */
            event.preventDefault();

            return;
        }


        /*
         * Determine scroll direction.
         *
         * Positive  = scroll down
         * Negative  = scroll up
         */
        const direction =
            wheelAccumulator > 0
                ? 1
                : -1;


        /*
         * Reset accumulator before changing
         * project.
         */
        wheelAccumulator = 0;


        let changed = false;


        /*
         * Scroll DOWN
         */
        if (direction > 0) {

            changed =
                nextProject();
        }


        /*
         * Scroll UP
         */
        else {

            changed =
                previousProject();
        }


        /*
         * PROJECT CHANGED
         *
         * Only now prevent the browser's
         * normal page scrolling.
         */
        if (changed) {

            event.preventDefault();

            isLocked = true;


            setTimeout(
                () => {

                    isLocked = false;

                },
                SLIDE_DURATION
            );

        }


        /*
         * PROJECT DID NOT CHANGE
         *
         * This means:
         *
         * Project 03 + scroll down
         * OR
         * Project 01 + scroll up
         *
         * Do NOT call preventDefault().
         *
         * Browser will now continue normal
         * vertical page scrolling.
         */
        else {

            wheelAccumulator = 0;

            /*
             * IMPORTANT:
             * No event.preventDefault()
             * here.
             */
        }

    },
    {
        passive: false
    }
);


    /* ======================================================
       ARROW BUTTONS
       ====================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                if (isLocked) {
                    return;
                }


                if (
                    previousProject()
                ) {

                    isLocked = true;


                    setTimeout(
                        () => {

                            isLocked = false;

                        },
                        SLIDE_DURATION
                    );

                }

            }
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                if (isLocked) {
                    return;
                }


                if (
                    nextProject()
                ) {

                    isLocked = true;


                    setTimeout(
                        () => {

                            isLocked = false;

                        },
                        SLIDE_DURATION
                    );

                }

            }
        );

    }


    /* ======================================================
       DOT NAVIGATION
       ====================================================== */

    dots.forEach(
        (dot, dotIndex) => {

            dot.addEventListener(
                "click",
                () => {

                    if (
                        isLocked ||
                        dotIndex === activeIndex
                    ) {
                        return;
                    }

                    const direction =
                        dotIndex > activeIndex
                            ? 1
                            : -1;

                    if (
                        setProject(
                            dotIndex,
                            direction
                        )
                    ) {

                        isLocked = true;

                        setTimeout(
                            () => {

                                isLocked = false;

                            },
                            SLIDE_DURATION
                        );

                    }

                }
            );

        }
    );


    /* ======================================================
       TOUCH / MOBILE SWIPE
       ====================================================== */

    section.addEventListener(
        "touchstart",
        event => {

            const touch =
                event.changedTouches[0];


            touchStartX =
                touch.clientX;


            touchStartY =
                touch.clientY;

        },
        {
            passive: true
        }
    );


    section.addEventListener(
        "touchend",
        event => {

            if (isLocked) {
                return;
            }


            const touch =
                event.changedTouches[0];


            const deltaX =
                touch.clientX -
                touchStartX;


            const deltaY =
                touch.clientY -
                touchStartY;


            /*
             * Ignore normal vertical scrolling.
             */
            if (
                Math.abs(deltaX) < 60 ||
                Math.abs(deltaX) <=
                    Math.abs(deltaY)
            ) {
                return;
            }


            let changed = false;


            if (deltaX < 0) {

                changed =
                    nextProject();

            }
            else {

                changed =
                    previousProject();

            }


            if (changed) {

                isLocked = true;


                setTimeout(
                    () => {

                        isLocked = false;

                    },
                    SLIDE_DURATION
                );

            }

        },
        {
            passive: true
        }
    );


    /* ======================================================
       KEYBOARD
       ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !isSectionActive()
            ) {
                return;
            }


            if (
                event.key !==
                    "ArrowRight" &&
                event.key !==
                    "ArrowLeft"
            ) {
                return;
            }


            if (isLocked) {
                return;
            }


            event.preventDefault();


            let changed = false;


            if (
                event.key ===
                "ArrowRight"
            ) {

                changed =
                    nextProject();

            }
            else {

                changed =
                    previousProject();

            }


            if (changed) {

                isLocked = true;


                setTimeout(
                    () => {

                        isLocked = false;

                    },
                    SLIDE_DURATION
                );

            }

        }
    );


    /* ======================================================
       RESIZE
       ====================================================== */

    window.addEventListener(
        "resize",
        () => {

            track.style.transform =
                `translate3d(-${activeIndex * 100}vw, 0, 0)`;

        }
    );


    /* ======================================================
       INITIAL STATE
       ====================================================== */

    slides.forEach(
        (slide, index) => {

            slide.classList.toggle(
                "active",
                index === 0
            );


            slide.classList.toggle(
                "previous",
                false
            );


            slide.setAttribute(
                "aria-hidden",
                index === 0
                    ? "false"
                    : "true"
            );

        }
    );


    dots.forEach(
        (dot, index) => {

            dot.classList.toggle(
                "active",
                index === 0
            );


            dot.setAttribute(
                "aria-current",
                index === 0
                    ? "true"
                    : "false"
            );

        }
    );


    track.style.transform =
        "translate3d(0, 0, 0)";


})();


/* ==========================================================
   EXPERIENCE & EDUCATION — MY JOURNEY
   Scroll reveal + timeline progress + active item
   ========================================================== */

(function initJourneySection() {

    const section =
        document.querySelector(".journey-page");

    if (!section) {
        return;
    }


    const heading =
        section.querySelector(".journey-heading");

    const timeline =
        section.querySelector(".journey-timeline");

    const items =
        [...section.querySelectorAll(".journey-item")];

    const cards =
        [...section.querySelectorAll(".journey-card")];

    if (
        !timeline ||
        !items.length ||
        !cards.length
    ) {
        return;
    }


    /* ======================================================
       GIVE EVERY JOURNEY ITEM AN INDEX
       ====================================================== */

    items.forEach(
        (item, index) => {

            item.dataset.journeyIndex =
                String(index);

        }
    );


    /* ======================================================
       INITIAL STATE
       ====================================================== */

    if (heading) {

        heading.classList.remove(
            "journey-heading-visible"
        );

    }


    cards.forEach(
        card => {

            card.classList.remove(
                "journey-visible"
            );

        }
    );


    items.forEach(
        item => {

            item.classList.remove(
                "journey-active"
            );

        }
    );

    /* ======================================================
       HEADING REVEAL
       ====================================================== */

    if (
        heading &&
        "IntersectionObserver" in window
    ) {

        const headingObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            heading.classList.add(
                                "journey-heading-visible"
                            );


                            headingObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.05
                }
            );


        headingObserver.observe(
            heading
        );

    }
    else if (heading) {

        heading.classList.add(
            "journey-heading-visible"
        );

    }


    /* ======================================================
       CARD REVEAL
       
       Cards appear as the user scrolls down.
       Left cards come from left.
       Right cards come from right.
       ====================================================== */

    if (
        "IntersectionObserver" in window
    ) {

        const cardObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            const card =
                                entry.target;


                            const item =
                                card.closest(
                                    ".journey-item"
                                );


                            const index =
                                item
                                    ? Number(
                                        item.dataset.journeyIndex || 0
                                    )
                                    : 0;


                            /*
                             * Small stagger between cards.
                             */
                            setTimeout(
                                () => {

                                    card.classList.add(
                                        "journey-visible"
                                    );


                                    if (item) {

                                        item.classList.add(
                                            "journey-active"
                                        );

                                    }

                                },
                                index * 180
                            );


                            cardObserver.unobserve(
                                card
                            );

                        }
                    );

                },
                {
                    threshold: 0.18,

                    rootMargin:
                        "0px 0px -12% 0px"
                }
            );


        cards.forEach(
            card => {

                cardObserver.observe(
                    card
                );

            }
        );

    }
    else {

        cards.forEach(
            card => {

                card.classList.add(
                    "journey-visible"
                );

            }
        );

    }
    /* ======================================================
       SCROLL DRIVEN TIMELINE
       ====================================================== */

    let ticking = false;


    function updateJourneyProgress() {

        ticking = false;


        const rect =
            timeline.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        /*
         * Timeline starts glowing when it enters
         * the lower part of the viewport.
         */

        const start =
            viewportHeight * 0.78;


        /*
         * Timeline finishes when the lower
         * part has almost passed the viewport.
         */

        const end =
            -rect.height * 0.12;


        const travelled =
            start - rect.top;


        const total =
            start - end;


        const progress =
            Math.max(
                0,
                Math.min(
                    1,
                    travelled / total
                )
            );


        /*
         * CSS uses this variable to fill
         * the timeline progressively.
         */

        timeline.style.setProperty(
            "--journey-progress",
            `${(
                progress * 100
            ).toFixed(2)}%`
        );


        /* ==================================================
           FIND CURRENT TIMELINE ITEM
           ================================================== */

        let closestIndex = 0;

        let closestDistance =
            Infinity;


        const focusY =
            viewportHeight * 0.48;


        items.forEach(
            (item, index) => {

                const itemRect =
                    item.getBoundingClientRect();


                const itemCenter =
                    itemRect.top +
                    itemRect.height / 2;


                const distance =
                    Math.abs(
                        itemCenter - focusY
                    );


                if (
                    distance <
                    closestDistance
                ) {

                    closestDistance =
                        distance;


                    closestIndex =
                        index;

                }

            }
        );


        /* ==================================================
           UPDATE ACTIVE TIMELINE ITEM
           ================================================== */

        items.forEach(
            (item, index) => {

                const card =
                    item.querySelector(
                        ".journey-card"
                    );


                const isVisible =
                    card &&
                    card.classList.contains(
                        "journey-visible"
                    );


                item.classList.toggle(
                    "journey-active",
                    index === closestIndex &&
                    isVisible
                );

            }
        );

    }


    /* ======================================================
       REQUEST ANIMATION FRAME
       Prevents excessive scroll calculations.
       ====================================================== */

    function requestJourneyUpdate() {

        if (ticking) {
            return;
        }


        ticking = true;


        window.requestAnimationFrame(
            updateJourneyProgress
        );

    }


    /* ======================================================
       SCROLL EVENT
       ====================================================== */

    window.addEventListener(
        "scroll",
        requestJourneyUpdate,
        {
            passive: true
        }
    );


    /* ======================================================
       RESIZE EVENT
       ====================================================== */

    window.addEventListener(
        "resize",
        requestJourneyUpdate
    );


    /* ======================================================
       FIRST UPDATE
       ====================================================== */

    requestJourneyUpdate();


})();


/* ==========================================================
   OPEN TO OPPORTUNITIES / CONTACT
   Standalone CTA reveal
   ========================================================== */

(function initOpportunitySection() {

    const section =
        document.querySelector(
            ".opportunity-page"
        );

    const content =
        section
            ? section.querySelector(
                ".opportunity-content"
            )
            : null;

    if (!section || !content) {
        return;
    }

    let revealTimer;

    function revealOpportunity() {

        window.clearTimeout(revealTimer);

        section.classList.add(
            "opportunity-visible"
        );

    }


    if (!("IntersectionObserver" in window)) {
        revealOpportunity();
        return;
    }


    section.classList.add(
        "opportunity-ready"
    );

    revealTimer = window.setTimeout(
        revealOpportunity,
        1200
    );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        revealOpportunity();

                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -8% 0px"
            }
        );


    observer.observe(section);

})();


/* ==========================================================
   TESTIMONIALS
   Heading and staggered card reveal
   ========================================================== */

(function initTestimonialsSection() {

    const section =
        document.querySelector(
            ".testimonials-page"
        );

    const cards =
        section
            ? [...section.querySelectorAll(
                ".testimonial-card"
            )]
            : [];

    if (!section) {
        return;
    }

    let revealTimer;

    function revealTestimonials() {

        window.clearTimeout(revealTimer);

        section.classList.add(
            "testimonials-visible"
        );


        cards.forEach(
            (card, index) => {

                window.setTimeout(
                    () => {

                        card.classList.add(
                            "testimonial-visible"
                        );

                    },
                    130 + index * 120
                );

            }
        );

    }


    if (!("IntersectionObserver" in window)) {
        revealTestimonials();
        return;
    }


    section.classList.add(
        "testimonials-ready"
    );

    revealTimer = window.setTimeout(
        revealTestimonials,
        1200
    );

    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (!entry.isIntersecting) {
                            return;
                        }


                        revealTestimonials();

                        observer.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -8% 0px"
            }
        );


    observer.observe(section);

})();




/* ==========================================================
   FINAL CONTACT FORM — EMAIL SUBMISSION
   Sends:
   1. New enquiry email to Shahab
   2. Thank-you email to visitor
   ========================================================== */

(function initFinalContactForm() {

    const form = document.getElementById(
        "final-contact-form"
    );

    const status = document.getElementById(
        "final-contact-status"
    );

    if (!form || !status) {
        return;
    }

    const submitButton =
        form.querySelector(
            ".final-contact-submit"
        );

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            const name =
                form.elements["name"].value.trim();

            const email =
                form.elements["email"].value.trim();

            const service =
                form.elements["service"].value.trim();

            const message =
                form.elements["message"].value.trim();


            if (
    !name ||
    !email ||
    !service
) {
    status.textContent =
        "Please fill all required fields.";

    status.className =
        "final-contact-status error";

    return;
}


            /* --------------------------------------------------
               Disable button while sending
               -------------------------------------------------- */

            const originalButtonHTML =
                submitButton
                    ? submitButton.innerHTML
                    : "";

            if (submitButton) {
                submitButton.disabled = true;

                submitButton.innerHTML =
                    `<span aria-hidden="true">↗</span>
                     Sending...`;
            }


            status.textContent =
                "Sending your message...";

            status.className =
                "final-contact-status sending";


            try {

                const response =
                    await fetch(
                        "https://shahab-sanowar-portfolio-api.onrender.com/api/contact",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                service: service,
                                message: message
                            })
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok || !result.ok) {
                    throw new Error(
                        result.message ||
                        "Unable to send message."
                    );
                }


                /* --------------------------------------------------
                   SUCCESS
                   -------------------------------------------------- */

                status.textContent =
                    "Message sent successfully. Thank you!";

                status.className =
                    "final-contact-status success";


                form.reset();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                status.textContent =
                    "Unable to send your message right now. Please try again.";

                status.className =
                    "final-contact-status error";


            } finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        originalButtonHTML;
                }

            }

        }
    );

})();


/* ==========================================================
   PROJECTS — AUTO SLIDE + PROJECT DETAILS
   Seamless forward loop
   01 → 02 → 03 → 01
   ========================================================== */

(function initProjectAutoSlideAndDetails() {

    const section =
        document.querySelector(
            ".featured-projects-page"
        );

    const track =
        document.getElementById(
            "projects-track"
        );

    const slides =
        [...document.querySelectorAll(
            ".project-slide"
        )];

    const nextButton =
        document.getElementById(
            "project-next"
        );

    const detailsPage =
        document.getElementById(
            "project-details"
        );

    const detailsTitle =
        document.getElementById(
            "project-details-title"
        );

    const detailsCounter =
        document.getElementById(
            "project-details-counter"
        );

    const detailsCategory =
        document.getElementById(
            "project-details-category"
        );

    const detailsDescription =
        document.getElementById(
            "project-details-description"
        );

    const detailsImage =
        document.getElementById(
            "project-details-image"
        );

    const detailsStack =
        document.getElementById(
            "project-details-stack"
        );

    const detailsHighlights =
        document.getElementById(
            "project-details-highlights"
        );

    const detailsSource =
        document.getElementById(
            "project-details-source"
        );


    if (
        !section ||
        !track ||
        !slides.length ||
        !detailsPage
    ) {
        return;
    }


    /* ======================================================
       PROJECT DATA
       ====================================================== */

    const projectData = [

        {
            title:
                "AI Investment Platform",

            category:
                "BACKEND DEVELOPMENT",

            description:
                "A scalable AI-powered investment platform built to handle portfolio workflows, financial data, authentication and reliable backend operations.",

            image:
                "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1400&q=85",

            alt:
                "AI Investment Platform project preview",

            stack: [
                "Python",
                "Django",
                "DRF",
                "PostgreSQL",
                "Redis",
                "Celery"
            ],

            highlights: [
                ["Scalable APIs", "Architecture"],
                ["Secure", "Authentication"],
                ["Production", "Ready"]
            ]
        },


        {
            title:
                "Online Examination Platform",

            category:
                "BACKEND DEVELOPMENT",

            description:
                "A complete online examination platform designed for secure assessments, question management, automated evaluation and efficient backend workflows.",

            image:
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",

            alt:
                "Online Examination Platform project preview",

            stack: [
                "Python",
                "Django",
                "DRF",
                "PostgreSQL",
                "Redis",
                "Celery"
            ],

            highlights: [
                ["REST APIs", "Backend"],
                ["Automated", "Evaluation"],
                ["Secure", "Access"]
            ]
        },


        {
            title:
                "E-Commerce Platform",

            category:
                "BACKEND DEVELOPMENT",

            description:
                "A production-ready e-commerce backend focused on product management, user workflows, database operations and reliable REST API architecture.",

            image:
                "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1400&q=85",

            alt:
                "E-Commerce Platform project preview",

            stack: [
                "Python",
                "Django",
                "DRF",
                "PostgreSQL",
                "MySQL"
            ],

            highlights: [
                ["REST APIs", "Architecture"],
                ["Database", "Design"],
                ["Scalable", "Backend"]
            ]
        }

    ];


    /* ======================================================
       STATE
       ====================================================== */

    let detailsOpen = false;

    let currentDetailIndex = 0;

    let seamlessLoopRunning = false;

    const AUTO_SLIDE_MS = 2000;


    /* ======================================================
       ACTIVE PROJECT
       ====================================================== */

    function getActiveIndex() {

        const activeSlide =
            document.querySelector(
                ".project-slide.active"
            );

        const index =
            activeSlide
                ? Number(
                    activeSlide.dataset.projectIndex
                )
                : 0;

        return Number.isFinite(index)
            ? index
            : 0;
    }


    /* ======================================================
       PROJECT 01 CLONE
       ====================================================== */

    let firstProjectClone = null;


    if (track && slides.length) {

        firstProjectClone =
            slides[0].cloneNode(true);


        firstProjectClone.dataset.projectClone =
            "true";


        firstProjectClone.dataset.projectIndex =
            "0";


        firstProjectClone.setAttribute(
            "aria-hidden",
            "true"
        );


        /*
         * Clone starts inactive.
         */

        firstProjectClone.classList.remove(
            "active"
        );


        firstProjectClone.classList.remove(
            "previous"
        );


        track.appendChild(
            firstProjectClone
        );


        /*
         * 01 | 02 | 03 | 01-clone
         */

        track.style.width =
            `${(slides.length + 1) * 100}vw`;
    }


    /* ======================================================
       OPEN DETAILS
       ====================================================== */

    function openDetails(index) {

        const data =
            projectData[index];

        if (!data) {
            return;
        }


        currentDetailIndex =
            index;


        detailsTitle.textContent =
            data.title;


        detailsCounter.textContent =
            `${String(index + 1).padStart(2, "0")} / ${String(projectData.length).padStart(2, "0")}`;


        detailsCategory.textContent =
            data.category;


        detailsDescription.textContent =
            data.description;


        detailsImage.src =
            data.image;


        detailsImage.alt =
            data.alt;


        detailsStack.innerHTML =
            data.stack
                .map(
                    item =>
                        `<span>${item}</span>`
                )
                .join("");


        detailsHighlights.innerHTML =
            data.highlights
                .map(
                    ([title, label]) => `
                        <div class="project-details-highlight">
                            <strong>${title}</strong>
                            <span>${label}</span>
                        </div>
                    `
                )
                .join("");


        detailsPage.classList.add(
            "is-open"
        );


        detailsPage.setAttribute(
            "aria-hidden",
            "false"
        );


        document.documentElement.classList.add(
            "project-details-open"
        );


        document.body.classList.add(
            "project-details-open"
        );


        detailsOpen = true;


        const closeButton =
            detailsPage.querySelector(
                ".project-details-close"
            );


        if (closeButton) {

            setTimeout(
                () => {
                    closeButton.focus();
                },
                50
            );
        }
    }


    /* ======================================================
       CLOSE DETAILS
       ====================================================== */

    function closeDetails() {

        detailsPage.classList.remove(
            "is-open"
        );


        detailsPage.setAttribute(
            "aria-hidden",
            "true"
        );


        document.documentElement.classList.remove(
            "project-details-open"
        );


        document.body.classList.remove(
            "project-details-open"
        );


        detailsOpen = false;


        const activeSlide =
            slides[currentDetailIndex] ||
            document.querySelector(
                ".project-slide.active"
            );


        if (activeSlide) {

            setTimeout(
                () => {

                    activeSlide.focus({
                        preventScroll: true
                    });

                },
                30
            );
        }
    }


    /* ======================================================
       CLICK PROJECT
       ====================================================== */

    slides.forEach(
        (slide, index) => {

            slide.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            "a, button"
                        )
                    ) {
                        return;
                    }


                    openDetails(index);
                }
            );


            slide.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key !== "Enter" &&
                        event.key !== " "
                    ) {
                        return;
                    }


                    if (
                        event.target.closest(
                            "a, button"
                        )
                    ) {
                        return;
                    }


                    event.preventDefault();


                    openDetails(index);
                }
            );

        }
    );


    /* ======================================================
       CLONE PROJECT 01 CLICK
       ====================================================== */

    if (firstProjectClone) {

        firstProjectClone.addEventListener(
            "click",
            event => {

                if (
                    event.target.closest(
                        "a, button"
                    )
                ) {
                    return;
                }


                openDetails(0);
            }
        );

    }


    /* ======================================================
       VIEW PROJECT BUTTON
       ====================================================== */

    document
        .querySelectorAll(
            ".project-details-open"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();


                        const slide =
                            button.closest(
                                ".project-slide"
                            );


                        const index =
                            slide
                                ? Number(
                                    slide.dataset.projectIndex
                                )
                                : getActiveIndex();


                        openDetails(
                            Number.isFinite(index)
                                ? index
                                : 0
                        );

                    }
                );

            }
        );


    /* ======================================================
       CLOSE BUTTON + BACKDROP
       ====================================================== */

    detailsPage
        .querySelectorAll(
            "[data-project-details-close]"
        )
        .forEach(
            element => {

                element.addEventListener(
                    "click",
                    closeDetails
                );

            }
        );


    /* ======================================================
       ESCAPE
       ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !detailsOpen
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                closeDetails();

            }

        }
    );


    /* ======================================================
       SEAMLESS 03 → 01
       ====================================================== */

    function seamlessProjectLoop() {

        if (
            !firstProjectClone ||
            seamlessLoopRunning
        ) {
            return false;
        }


        seamlessLoopRunning = true;


        /*
         * Clone ko active karo.
         *
         * Isse image ke saath right-side
         * project information bhi visible rahega.
         */

        firstProjectClone.classList.add(
            "active"
        );


        firstProjectClone.classList.remove(
            "previous"
        );


        firstProjectClone.setAttribute(
            "aria-hidden",
            "false"
        );


        /*
         * FORWARD:
         *
         * 03 = -200vw
         * 01 clone = -300vw
         */

        track.style.transition =
            "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)";


        requestAnimationFrame(
            () => {

                track.style.transform =
                    "translate3d(-300vw, 0, 0)";

            }
        );


        /*
         * Animation complete.
         */

        setTimeout(
            () => {

                /*
 * Hide transition.
 */
track.style.transition =
    "none";

/*
 * IMPORTANT:
 * Real Project 01 ko physical reset
 * se PEHLE active karo.
 *
 * Isse reset ke waqt Project 01
 * opacity 0.35 se 1 tak blink/fade nahi karega.
 */
slides.forEach(
    (slide, index) => {

        slide.classList.toggle(
            "active",
            index === 0
        );

        slide.classList.remove(
            "previous"
        );

        slide.setAttribute(
            "aria-hidden",
            index === 0
                ? "false"
                : "true"
        );

    }
);

/*
 * Internal project index ko silently 0 par sync karo.
 *
 * IMPORTANT:
 * Yahan normal __syncProjectIndex(0)
 * use nahi karna, kyunki woh track ko
 * dobara visually move karega.
 */
if (
    typeof window.__syncProjectIndex ===
    "function"
) {
    window.__syncProjectIndex(
        0,
        true
    );
}

/*
 * Ab physical track ko real Project 01
 * par instantly reset karo.
 */
track.style.transform =
    "translate3d(0, 0, 0)";

/*
 * Clone OFF.
 */
firstProjectClone.classList.remove(
    "active"
);

firstProjectClone.setAttribute(
    "aria-hidden",
    "true"
);

/*
 * Update dots.
 */
document
    .querySelectorAll(
        ".project-dot"
    )
    .forEach(
        (dot, index) => {

            const active =
                index === 0;

            dot.classList.toggle(
                "active",
                active
            );

            dot.setAttribute(
                "aria-current",
                active
                    ? "true"
                    : "false"
            );

        }
    );


                /*
                 * Update dots.
                 */

                document
                    .querySelectorAll(
                        ".project-dot"
                    )
                    .forEach(
                        (dot, index) => {

                            const active =
                                index === 0;


                            dot.classList.toggle(
                                "active",
                                active
                            );


                            dot.setAttribute(
                                "aria-current",
                                active
                                    ? "true"
                                    : "false"
                            );

                        }
                    );


                /*
                 * Restore transition.
                 */

                requestAnimationFrame(
                    () => {

                        requestAnimationFrame(
                            () => {

                                track.style.transition =
                                    "transform 0.85s cubic-bezier(0.76, 0, 0.24, 1)";


                                seamlessLoopRunning =
                                    false;

                            }
                        );

                    }
                );

            },
            900
        );


        return true;
    }


    /* ======================================================
       AUTO SLIDE
       EVERY 2 SECONDS
       ====================================================== */

    setInterval(
        () => {

            if (
                detailsOpen ||
                document.hidden ||
                seamlessLoopRunning
            ) {
                return;
            }


            const rect =
                section.getBoundingClientRect();


            const sectionIsVisible =
                rect.top <=
                    window.innerHeight * 0.35 &&
                rect.bottom >=
                    window.innerHeight * 0.65;


            if (!sectionIsVisible) {
                return;
            }


            const activeIndex =
                getActiveIndex();


            /*
             * 03 → 01
             */

            if (
                activeIndex >=
                slides.length - 1
            ) {

                seamlessProjectLoop();

                return;
            }


            /*
             * 01 → 02
             * 02 → 03
             */

            if (nextButton) {

                nextButton.click();

            }

        },
        AUTO_SLIDE_MS
    );

})();
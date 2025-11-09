const experienceData = [
  {
    title: "Full Stack Developer Intern",
    company: "Nethram LLC",
    period: "2025",
    links: {
      live: "https://nethram.com",
    },
    bullets: [
      "Developed a two-part platform to mitigate human–wildlife conflict in Wayanad district, enabling data-driven preventive measures, community compensation, and real-time alerts.",
      "Contributed to the design of a WhatsApp bot in local languages, simplifying incident reporting for villagers across diverse age groups.",
      "Independently built an interactive geospatial visualization system with heatmaps, filters, and intuitive UX for non-technical authorities.",
      "Platform adopted across the entire Wayanad district, actively used by residents and government agencies to identify hotspots, deploy preventive measures, and manage high-risk cases.",
    ],
  },
  {
    title: "Team Lead",
    company: "Quickprep.ai",
    period: "2025",
    links: {
      github: "https://github.com/malik-l0l/Quickprep-ai",
    },
    bullets: [
      "Led end-to-end development of an AI-powered MCQ generation platform using Flask, Groq API (LLaMA 3.3 70B), and JSON schema validation for consistent PDF-to-MCQ conversion.",
      "Designed and implemented role-based dashboards (Teacher/Student) with quiz creation, review, and performance tracking features to enhance engagement and usability.",
      "Built data analytics modules for insights on scores, attempts, and difficulty levels, enabling data-driven teaching strategies and improved learning outcomes.",
    ],
  },
  {
    title: "Community Co-Lead",
    company: "Tinkerhub Foundation (GEC Kozhikode)",
    period: "2025",
    links: {
      linkedin: "https://www.linkedin.com/company/tinkerhub-geck-westhill",
      live: "https://tinkerhub.org/@saleem_malik",
    },
    bullets: [
      "Spearheaded the campus innovation community under TinkerHub Foundation, leading 10+ core members and 100+ active participants in fostering a maker and open-source culture at GEC Kozhikode.",
      "Organized and mentored multiple hands-on workshops, hackathons, and learning sprints on emerging technologies like AI, Web Development, and Git, impacting over 500 students across departments.",
      "Collaborated with regional TinkerHub chapters to launch community-driven projects and mentorship programs, bridging the gap between academia and real-world problem-solving through peer learning.",
    ],
  },

  {
    title: "Designer & Developer",
    company: "Slogam.ai (Tinkerhub Saaskool Program)",
    period: "2025",
    links: {
      live: "https://slogamai.vercel.app/",
    },
    bullets: [
      "Designed and developed Slogam.ai, an AI-powered slogan generation platform built during the Tinkerhub Saaskool program to help companies and ad agencies create engaging marketing slogans.",
      "Integrated Groq API with advanced prompt engineering to generate slogans from company details and automated creation of downloadable 4:3 poster templates with customizable gradients and branding.",
      "Deployed a production-ready, Vercel-hosted SaaS web app with a streamlined UI for social media content generation, reducing slogan ideation time and improving campaign engagement.",
    ],
  },
  {
    title: "Designer & Developer",
    company: "Tabletimes",
    period: "2025",
    links: {
      live: "https://tabletimes.vercel.app",
    },
    bullets: [
      "Developed Tabletimes, a mobile-first web application enabling real-time class schedule access via QR code, removing login and installation barriers.",
      "Built a responsive Flask backend with dynamic timetable rendering, real-time updates, and an integrated attendance calculator for academic tracking.",
      "Led end-to-end design using user research, prototyping, and usability testing to deliver a fast, intuitive, and low-friction user experience.",
    ],
  },
  {
    title: "Full Stack Developer",
    company: "Nestclub Accommodation Finder",
    period: "2024",
    links: {
      live: "https://nestclub.vercel.app",
    },
    bullets: [
      "Developed a Flask-based full-stack web application with MongoDB backend to help incoming students discover verified hostel accommodations near campus.",
      "Designed an intuitive, login-free interface displaying amenities, fee structures, and hostel images, enabling transparent comparison and informed decision-making.",
      "Deployed a reliable and accessible platform that guided hundreds of freshers to secure suitable hostels, improving onboarding experience and trust within the student community.",
    ],
  },
  {
    title: "Developer",
    company: "Bingo — Online Board Game",
    period: "2024",
    links: {
      github: "https://github.com/malik-l0l/mallu-bingo",
      live: "https://mallu-bingo.vercel.app/",
    },
    bullets: [
      "Created an interactive web application for the native board game Bingo using Python.",
      "Enhanced performance by optimizing game logic, ensuring fair play, and improving load times by 25%.",
      "Engineered a probability-based AI algorithm to simulate human-like gameplay, increasing engagement and replayability.",
    ],
  },
  {
    title: "Team Lead",
    company: "Records — College Records Management",
    period: "2024",
    links: {
      github: "https://github.com/malik-l0l/AKSHAR",
      linkedin: "https://www.linkedin.com/posts/saleem-malik-pv_innovation-techineducation-filemanagement-activity-7224324693229494272-qyAq?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAEFOLlYBsQfLCV7q24XC4lN7TchsteSmqJc",
    },
    bullets: [
      "Led a team of 5 to develop a custom records management system using Python and SQL, boosting staff productivity by 40%.",
      "Designed a keyword-based search and indexing system to digitize and organize 100,000+ physical records by locker, row, and bundle location.",
      "Reduced document retrieval time by over 90% by replacing manual searches with instant location tracking through a user-friendly interface.",
    ],
  },
];

// Function to create link HTML
function createLinkHTML(type, url) {
    const linkConfig = {
        github: {
            title: "GitHub Repository",
            label: "GitHub",
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
            </svg>`
        },
        linkedin: {
            title: "LinkedIn Post",
            label: "LinkedIn",
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="currentColor" />
            </svg>`
        },
        live: {
            title: "Live Project",
            label: "Live Site",
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`
        }
    };

    const config = linkConfig[type];
    return `
        <a href="${url}" target="_blank" class="experience-link" title="${config.title}">
            ${config.icon}
            <span class="experience-link-text">${config.label}</span>
        </a>
    `;
}

// Function to generate experience detail HTML
function generateExperienceHTML(experience) {
    let linksHTML = '';
    
    // Generate links only for available URLs
    if (experience.links) {
        const availableLinks = [];
        if (experience.links.github) availableLinks.push(createLinkHTML('github', experience.links.github));
        if (experience.links.linkedin) availableLinks.push(createLinkHTML('linkedin', experience.links.linkedin));
        if (experience.links.live) availableLinks.push(createLinkHTML('live', experience.links.live));
        
        if (availableLinks.length > 0) {
            linksHTML = `
                <div class="experience-links-wrapper">
                    <div class="experience-links">
                        ${availableLinks.join('')}
                    </div>
                    <div class="experience-period">${experience.period}</div>
                </div>
            `;
        }
    }

    // If no links, just show period
    if (!linksHTML && experience.period) {
        linksHTML = `<div class="experience-period">${experience.period}</div>`;
    }

    const bulletsHTML = experience.bullets.map(bullet => `<li>${bullet}</li>`).join('');

    return `
        <div class="experience-detail">
            <div class="experience-detail-header">
                <div class="experience-info">
                    <div class="experience-company">${experience.company}</div>
                    <div class="experience-title">${experience.title}</div>
                </div>
                ${linksHTML}
            </div>
            <ul class="experience-bullets">
                ${bulletsHTML}
            </ul>
        </div>
    `;
}

// Function to populate modal with experience data
function populateExperienceModal() {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;

    const experiencesHTML = experienceData.map(exp => generateExperienceHTML(exp)).join('');
    modalContent.innerHTML = experiencesHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    populateExperienceModal();
});

// If you need to update the experience list in the card as well
function updateExperienceCard() {
    const experienceList = document.querySelector('.experience-list');
    if (!experienceList) return;

    const cardItemsHTML = experienceData.map(exp => `
        <div class="experience-item">
            <div class="experience-position">${exp.company}</div>
            <div class="experience-date">${exp.period}</div>
        </div>
    `).join('');

    experienceList.innerHTML = cardItemsHTML;
}

// Call this function to update the card as well
document.addEventListener('DOMContentLoaded', function() {
    populateExperienceModal();
    updateExperienceCard();
});

// Function to create link HTML
function createLinkHTML(type, url) {
    const linkConfig = {
        github: {
            title: "GitHub Repository",
            label: "GitHub",
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" fill="currentColor" />
            </svg>`
        },
        linkedin: {
            title: "LinkedIn Post",
            label: "LinkedIn",
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" fill="currentColor" />
            </svg>`
        },
        live: {
            title: "Live Project",
            label: "Live Site",
            icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>`
        }
    };

    const config = linkConfig[type];
    return `
        <a href="${url}" target="_blank" class="experience-link" title="${config.title}">
            ${config.icon}
            <span class="experience-link-text">${config.label}</span>
        </a>
    `;
}

// Function to generate experience detail HTML
function generateExperienceHTML(experience) {
    let linksHTML = '';
    
    // Generate links only for available URLs
    if (experience.links) {
        const availableLinks = [];
        if (experience.links.github) availableLinks.push(createLinkHTML('github', experience.links.github));
        if (experience.links.linkedin) availableLinks.push(createLinkHTML('linkedin', experience.links.linkedin));
        if (experience.links.live) availableLinks.push(createLinkHTML('live', experience.links.live));
        
        if (availableLinks.length > 0) {
            linksHTML = `
                <div class="experience-links-wrapper">
                    <div class="experience-links">
                        ${availableLinks.join('')}
                    </div>
                    <div class="experience-period">${experience.period}</div>
                </div>
            `;
        }
    }

    // If no links, just show period
    if (!linksHTML && experience.period) {
        linksHTML = `<div class="experience-period">${experience.period}</div>`;
    }

    const bulletsHTML = experience.bullets.map(bullet => `<li>${bullet}</li>`).join('');

    return `
        <div class="experience-detail">
            <div class="experience-detail-header">
                <div class="experience-info">
                    <div class="experience-company">${experience.company}</div>
                    <div class="experience-title">${experience.title}</div>
                </div>
                ${linksHTML}
            </div>
            <ul class="experience-bullets">
                ${bulletsHTML}
            </ul>
        </div>
    `;
}

// Function to populate modal with experience data
function populateExperienceModal() {
    const modalContent = document.querySelector('.modal-content');
    if (!modalContent) return;

    const experiencesHTML = experienceData.map(exp => generateExperienceHTML(exp)).join('');
    modalContent.innerHTML = experiencesHTML;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    populateExperienceModal();
});

// If you need to update the experience list in the card as well
function updateExperienceCard() {
    const experienceList = document.querySelector('.experience-list');
    if (!experienceList) return;

    const cardItemsHTML = experienceData.map(exp => `
        <div class="experience-item">
            <div class="experience-position">${exp.company}</div>
            <div class="experience-date">${exp.period}</div>
        </div>
    `).join('');

    experienceList.innerHTML = cardItemsHTML;
}

// Call this function to update the card as well
document.addEventListener('DOMContentLoaded', function() {
    populateExperienceModal();
    updateExperienceCard();
});

// =======================================================================
// Experience Modal functionality
const experienceCard = document.getElementById("experienceCard");
const experienceModal = document.getElementById("experienceModal");
const modalClose = document.getElementById("modalClose");

experienceCard.addEventListener("click", function () {
  experienceModal.classList.add("active");
  document.body.style.overflow = "hidden";
});

modalClose.addEventListener("click", function () {
  experienceModal.classList.remove("active");
  document.body.style.overflow = "auto";
});

experienceModal.addEventListener("click", function (e) {
  if (e.target === experienceModal) {
    experienceModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

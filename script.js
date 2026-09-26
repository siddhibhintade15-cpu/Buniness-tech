/* =========================================================
   MY CAREER
   Main JavaScript
   Founder: Siddhi Bhintade
========================================================= */


/* =========================
   GLOBAL STATE
========================= */

let currentPage = "home";

let savedJobs =
    JSON.parse(localStorage.getItem("myCareerSavedJobs")) || [];

let connections =
    JSON.parse(localStorage.getItem("myCareerConnections")) || [];

let posts =
    JSON.parse(localStorage.getItem("myCareerPosts")) || [];

let jobs =
    JSON.parse(localStorage.getItem("myCareerJobs")) || [];


/* =========================
   PAGE NAVIGATION
========================= */

function showPage(pageId) {

    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        page.classList.remove("active-page");
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.classList.add("active-page");
    }

    currentPage = pageId;

    document.querySelectorAll(".nav-item").forEach(item => {

        item.classList.remove("active");

        if (item.dataset.page === pageId) {
            item.classList.add("active");
        }

    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    closeNotifications();
}


/* =========================
   THEME
========================= */

function toggleTheme() {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem("myCareerTheme", isDark ? "dark" : "light");

    const icon =
        document.getElementById("themeIcon");

    if (icon) {

        icon.className = isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";
    }
}


function loadTheme() {

    const savedTheme =
        localStorage.getItem("myCareerTheme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        const icon =
            document.getElementById("themeIcon");

        if (icon) {
            icon.className = "fa-solid fa-sun";
        }
    }
}


/* =========================
   NOTIFICATIONS
========================= */

function toggleNotifications() {

    const panel =
        document.getElementById("notificationPanel");

    panel.classList.toggle("show");
}


function closeNotifications() {

    const panel =
        document.getElementById("notificationPanel");

    if (panel) {
        panel.classList.remove("show");
    }
}


/* =========================
   GLOBAL SEARCH
========================= */

function globalSearch() {

    const input =
        document.getElementById("globalSearch");

    const value =
        input.value.trim().toLowerCase();

    if (!value) {
        return;
    }

    if (
        value.includes("job") ||
        value.includes("internship") ||
        value.includes("career")
    ) {

        showPage("jobs");

    } else if (
        value.includes("learn") ||
        value.includes("course") ||
        value.includes("skill")
    ) {

        showPage("learning");

    } else if (
        value.includes("ai") ||
        value.includes("guide")
    ) {

        showPage("ai");

    } else if (
        value.includes("profile") ||
        value.includes("siddhi")
    ) {

        showPage("profile");
    }
}


/* =========================
   TOAST
========================= */

let toastTimer;

function showToast(message) {

    const toast =
        document.getElementById("toast");

    const messageElement =
        document.getElementById("toastMessage");

    if (!toast || !messageElement) {
        return;
    }

    messageElement.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


/* =========================
   POST MODAL
========================= */

function openPostModal() {

    document
        .getElementById("postModal")
        .classList.add("show");

    setTimeout(() => {

        const textarea =
            document.getElementById("postText");

        if (textarea) {
            textarea.focus();
        }

    }, 100);
}


function createPost() {

    const textarea =
        document.getElementById("postText");

    const text =
        textarea.value.trim();

    if (!text) {

        showToast("Write something before posting.");

        return;
    }

    const newPost = {

        id: Date.now(),

        author: "Siddhi Bhintade",

        text: text,

        createdAt: new Date().toLocaleString()

    };

    posts.unshift(newPost);

    localStorage.setItem(
        "myCareerPosts",
        JSON.stringify(posts)
    );

    addPostToFeed(newPost);

    textarea.value = "";

    closeModal("postModal");

    showToast("Your post was published!");
}


function addPostToFeed(post) {

    const container =
        document.getElementById("feedContainer");

    if (!container) {
        return;
    }

    const article =
        document.createElement("article");

    article.className = "card post";

    article.innerHTML = `

        <div class="post-header">

            <div class="avatar">SB</div>

            <div class="post-author">

                <strong>${escapeHTML(post.author)}</strong>

                <span>Professional Network Member</span>

                <small>Just now • 🌐</small>

            </div>

            <button class="more-btn">
                <i class="fa-solid fa-ellipsis"></i>
            </button>

        </div>

        <div class="post-body">

            <p>${escapeHTML(post.text)}</p>

            <div class="hashtags">
                #MyCareer #Growth #Career
            </div>

        </div>

        <div class="post-reactions">

            <span>
                <i class="fa-solid fa-thumbs-up"></i>
                0 reactions
            </span>

            <span>0 comments</span>

        </div>

        <div class="post-buttons">

            <button onclick="likePost(this)">
                <i class="fa-regular fa-thumbs-up"></i>
                Like
            </button>

            <button>
                <i class="fa-regular fa-comment"></i>
                Comment
            </button>

            <button onclick="sharePost()">
                <i class="fa-solid fa-share"></i>
                Share
            </button>

            <button>
                <i class="fa-regular fa-paper-plane"></i>
                Send
            </button>

        </div>
    `;

    container.prepend(article);
}


/* =========================
   LIKE POST
========================= */

function likePost(button) {

    const icon =
        button.querySelector("i");

    if (!icon) {
        return;
    }

    if (icon.classList.contains("fa-regular")) {

        icon.classList.remove("fa-regular");

        icon.classList.add("fa-solid");

        button.style.color = "var(--primary)";

        showToast("Post liked!");

    } else {

        icon.classList.remove("fa-solid");

        icon.classList.add("fa-regular");

        button.style.color = "";
    }
}


/* =========================
   SHARE
========================= */

function sharePost() {

    if (navigator.share) {

        navigator.share({

            title: "My Career",

            text:
                "Check out this post on My Career."

        }).catch(() => {});

    } else {

        navigator.clipboard
            ?.writeText(window.location.href);

        showToast(
            "Post link copied to clipboard!"
        );
    }
}


/* =========================
   CONNECTIONS
========================= */

function connectPerson(button) {

    if (
        button.textContent
            .trim()
            .toLowerCase()
            .includes("pending")
    ) {

        button.textContent = "Connect";

        showToast("Connection request cancelled.");

        return;
    }

    button.textContent = "Pending";

    button.style.background =
        "rgba(10,102,194,0.1)";

    connections.push({
        id: Date.now()
    });

    localStorage.setItem(
        "myCareerConnections",
        JSON.stringify(connections)
    );

    showToast(
        "Connection request sent!"
    );
}


/* =========================
   JOB SEARCH
========================= */

function filterJobs() {

    const searchInput =
        document.getElementById("jobSearch");

    const locationInput =
        document.getElementById("locationSearch");

    if (!searchInput) {
        return;
    }

    const query =
        searchInput.value.toLowerCase().trim();

    const location =
        locationInput
            ? locationInput.value.toLowerCase().trim()
            : "";

    const cards =
        document.querySelectorAll(".job-card");

    let found = 0;

    cards.forEach(card => {

        const title =
            card.dataset.title?.toLowerCase() || "";

        const cardLocation =
            card.dataset.location?.toLowerCase() || "";

        const matchesTitle =
            !query ||
            title.includes(query);

        const matchesLocation =
            !location ||
            cardLocation.includes(location);

        if (matchesTitle && matchesLocation) {

            card.style.display = "flex";

            found++;

        } else {

            card.style.display = "none";
        }

    });

    if (found === 0) {

        showToast(
            "No matching jobs found."
        );

    }
}


/* =========================
   SAVE JOB
========================= */

function saveJob(button) {

    const icon =
        button.querySelector("i");

    if (!icon) {
        return;
    }

    const saved =
        icon.classList.contains("fa-solid");

    if (saved) {

        icon.classList.remove("fa-solid");

        icon.classList.add("fa-regular");

        showToast("Job removed from saved jobs.");

    } else {

        icon.classList.remove("fa-regular");

        icon.classList.add("fa-solid");

        savedJobs.push(Date.now());

        localStorage.setItem(
            "myCareerSavedJobs",
            JSON.stringify(savedJobs)
        );

        showToast("Job saved!");
    }
}


/* =========================
   APPLY JOB
========================= */

function applyJob(jobName) {

    const confirmed =
        confirm(
            `Apply for "${jobName}"?`
        );

    if (!confirmed) {
        return;
    }

    showToast(
        "Application submitted successfully!"
    );
}


/* =========================
   LEARNING
========================= */

function startCourse(courseName) {

    showToast(
        `Opening ${courseName}...`
    );
}


/* =========================
   AI CAREER GUIDE
========================= */

/*
    IMPORTANT:

    Do not put your OpenAI secret API key here.

    GitHub repositories are public or can become public.
    A real OpenAI integration should call YOUR backend.

    Example architecture:

    Browser
       ↓
    /api/career-guide
       ↓
    Your backend
       ↓
    OpenAI API

    This demo uses local AI-style responses until
    a backend is connected.
*/


const aiResponses = {

    roadmap:
        `
        A practical career roadmap for you:

        1. Strengthen programming fundamentals.
        2. Build 3-5 meaningful projects.
        3. Learn Git and GitHub.
        4. Improve SQL and DBMS.
        5. Learn one AI/ML workflow.
        6. Build a professional resume.
        7. Improve communication and interview skills.
        8. Apply consistently for internships.
        9. Document projects on GitHub.
        10. Practice aptitude and technical interviews.
        `,

    resume:
        `
        To improve your resume:

        • Keep it to 1 page for an early-career profile.
        • Start with a strong professional headline.
        • Mention measurable project outcomes.
        • Add GitHub and portfolio links.
        • Put relevant technical skills clearly.
        • Mention internship experience.
        • Avoid unnecessary personal information.
        • Customize the resume for each role.
        `,

    internship:
        `
        Internship preparation plan:

        Week 1:
        Strengthen your core technical concepts.

        Week 2:
        Build or polish one strong project.

        Week 3:
        Improve your resume and GitHub.

        Week 4:
        Practice aptitude and interviews.

        Every week:
        Apply to relevant opportunities and track applications.
        `,

    skills:
        `
        A useful skill combination for a CSBS student is:

        Technical:
        • Python / C++
        • JavaScript
        • SQL
        • DBMS
        • Git/GitHub
        • APIs

        Emerging:
        • AI
        • Generative AI
        • Data Analytics
        • Cloud fundamentals

        Professional:
        • Communication
        • Presentation
        • Problem solving
        • Business understanding
        `

};


function askAI(question) {

    addUserMessage(question);

    showTypingIndicator();

    setTimeout(() => {

        removeTypingIndicator();

        const response =
            generateAIResponse(question);

        addAIMessage(response);

    }, 800);
}


function generateAIResponse(question) {

    const q =
        question.toLowerCase();

    if (
        q.includes("roadmap") ||
        q.includes("career plan")
    ) {

        return aiResponses.roadmap;

    }

    if (
        q.includes("resume") ||
        q.includes("cv")
    ) {

        return aiResponses.resume;

    }

    if (
        q.includes("internship") ||
        q.includes("intern")
    ) {

        return aiResponses.internship;

    }

    if (
        q.includes("skill") ||
        q.includes("learn")
    ) {

        return aiResponses.skills;

    }

    if (
        q.includes("interview")
    ) {

        return `
        Start interview preparation with these areas:

        1. Tell me about yourself.
        2. Explain your projects.
        3. Revise OOP concepts.
        4. Revise DBMS and SQL.
        5. Practice DSA basics.
        6. Prepare internship-related questions.
        7. Practice behavioral questions.

        Most importantly, learn how to clearly explain what YOU
        personally contributed to every project.
        `;

    }

    return `
        That's a good career question.

        Based on your current profile, I suggest breaking the
        problem into three parts:

        1. Skills — What do you need to learn?
        2. Projects — What can you build to demonstrate it?
        3. Opportunities — Where can you apply those skills?

        Try asking me something specific like:
        "Create my career roadmap",
        "Improve my resume",
        or
        "What skills should I learn?"
        `;
}


function addUserMessage(text) {

    const container =
        document.getElementById("chatMessages");

    if (!container) {
        return;
    }

    const message =
        document.createElement("div");

    message.className =
        "message user-message";

    message.innerHTML = `

        <div class="message-bubble">
            ${escapeHTML(text)}
        </div>
    `;

    container.appendChild(message);

    scrollChat();
}


function addAIMessage(text) {

    const container =
        document.getElementById("chatMessages");

    if (!container) {
        return;
    }

    const message =
        document.createElement("div");

    message.className =
        "message ai-message";

    const formatted =
        escapeHTML(text)
            .replace(/\n/g, "<br>");

    message.innerHTML = `

        <div class="message-avatar">
            AI
        </div>

        <div class="message-bubble">
            ${formatted}
        </div>
    `;

    container.appendChild(message);

    scrollChat();
}


function sendAIMessage() {

    const input =
        document.getElementById("aiInput");

    if (!input) {
        return;
    }

    const question =
        input.value.trim();

    if (!question) {
        return;
    }

    input.value = "";

    askAI(question);
}


function handleAIKey(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        sendAIMessage();
    }
}


function showTypingIndicator() {

    const container =
        document.getElementById("chatMessages");

    if (!container) {
        return;
    }

    const typing =
        document.createElement("div");

    typing.id = "typingIndicator";

    typing.className =
        "message ai-message";

    typing.innerHTML = `

        <div class="message-avatar">
            AI
        </div>

        <div class="message-bubble">
            AI is thinking...
        </div>
    `;

    container.appendChild(typing);

    scrollChat();
}


function removeTypingIndicator() {

    document
        .getElementById("typingIndicator")
        ?.remove();
}


function scrollChat() {

    const container =
        document.getElementById("chatMessages");

    if (container) {

        container.scrollTop =
            container.scrollHeight;
    }
}


function clearChat() {

    const container =
        document.getElementById("chatMessages");

    if (!container) {
        return;
    }

    container.innerHTML = `

        <div class="message ai-message">

            <div class="message-avatar">
                AI
            </div>

            <div class="message-bubble">

                <p>
                    Chat cleared 👋
                </p>

                <p>
                    What career goal would you like
                    to work on next?
                </p>

            </div>

        </div>
    `;

    showToast("AI conversation cleared.");
}


/* =========================
   PROFILE EDITING
========================= */

function openEditProfile() {

    document
        .getElementById("profileModal")
        .classList.add("show");
}


function saveProfile() {

    const name =
        document.getElementById("editName").value.trim();

    const headline =
        document.getElementById("editHeadline").value.trim();

    const about =
        document.getElementById("editAbout").value.trim();

    if (!name) {

        showToast("Name cannot be empty.");

        return;
    }

    const mainName =
        document.querySelector(
            ".profile-main-info h1"
        );

    if (mainName) {
        mainName.textContent = name;
    }

    const mainHeadline =
        document.querySelector(
            ".profile-main-info h3"
        );

    if (mainHeadline) {
        mainHeadline.textContent = headline;
    }

    const aboutText =
        document.querySelector(
            ".profile-section p"
        );

    if (aboutText) {
        aboutText.textContent = about;
    }

    localStorage.setItem(
        "myCareerProfile",
        JSON.stringify({
            name,
            headline,
            about
        })
    );

    closeModal("profileModal");

    showToast(
        "Profile updated successfully!"
    );
}


function loadProfile() {

    const profile =
        JSON.parse(
            localStorage.getItem("myCareerProfile")
        );

    if (!profile) {
        return;
    }

    const mainName =
        document.querySelector(
            ".profile-main-info h1"
        );

    if (mainName) {
        mainName.textContent =
            profile.name;
    }

    const headline =
        document.querySelector(
            ".profile-main-info h3"
        );

    if (headline) {
        headline.textContent =
            profile.headline;
    }

}


/* =========================
   RESUME BUILDER
========================= */

function updateResumePreview() {

    const name =
        document.getElementById("resumeName").value;

    const headline =
        document.getElementById("resumeHeadline").value;

    const about =
        document.getElementById("resumeAbout").value;

    const skills =
        document.getElementById("resumeSkills").value;

    const experience =
        document.getElementById("resumeExperience").value;

    const preview =
        document.getElementById("resumePreview");

    if (!preview) {
        return;
    }

    preview.querySelector(".resume-top h1")
        .textContent = name;

    preview.querySelector(".resume-top p")
        .textContent = headline;

    document.getElementById(
        "previewAbout"
    ).textContent = about;

    document.getElementById(
        "previewSkills"
    ).textContent = skills;

    document.getElementById(
        "previewExperience"
    ).textContent = experience;

    showToast(
        "Resume preview updated!"
    );
}


function downloadResume() {

    updateResumePreview();

    const resume =
        document.getElementById("resumePreview");

    if (!resume) {
        return;
    }

    const printWindow =
        window.open(
            "",
            "_blank",
            "width=900,height=1000"
        );

    printWindow.document.write(`

        <html>

        <head>

            <title>Resume - Siddhi Bhintade</title>

            <style>

                body {
                    font-family: Arial, sans-serif;
                    padding: 50px;
                    color: #111827;
                }

                h1 {
                    font-size: 30px;
                }

                h3 {
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }

                p {
                    font-size: 13px;
                    line-height: 1.6;
                }

            </style>

        </head>

        <body>

            ${resume.innerHTML}

        </body>

        </html>

    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {

        printWindow.print();

    }, 500);
}


/* =========================
   ADMIN PANEL
========================= */

function adminTab(tab, button) {

    document
        .querySelectorAll(".admin-tabs button")
        .forEach(btn => {

            btn.classList.remove("active");

        });

    button.classList.add("active");

    const sections = [

        "adminOverview",
        "adminUsersPanel",
        "adminJobsPanel",
        "adminReportsPanel"

    ];

    sections.forEach(id => {

        document
            .getElementById(id)
            ?.classList.add("hidden");

    });

    if (tab === "overview") {

        document
            .getElementById("adminOverview")
            ?.classList.remove("hidden");

    }

    if (tab === "users") {

        document
            .getElementById("adminUsersPanel")
            ?.classList.remove("hidden");

    }

    if (tab === "jobs") {

        document
            .getElementById("adminJobsPanel")
            ?.classList.remove("hidden");

    }

    if (tab === "reports") {

        document
            .getElementById("adminReportsPanel")
            ?.classList.remove("hidden");

    }
}


/* =========================
   ADMIN JOB CREATION
========================= */

function openJobModal() {

    document
        .getElementById("jobModal")
        .classList.add("show");
}


function createJob() {

    const title =
        document
            .getElementById("newJobTitle")
            .value.trim();

    const company =
        document
            .getElementById("newJobCompany")
            .value.trim();

    const location =
        document
            .getElementById("newJobLocation")
            .value.trim();

    const type =
        document
            .getElementById("newJobType")
            .value;

    const description =
        document
            .getElementById("newJobDescription")
            .value.trim();

    if (
        !title ||
        !company ||
        !location
    ) {

        showToast(
            "Please complete the required fields."
        );

        return;
    }

    const job = {

        id: Date.now(),

        title,

        company,

        location,

        type,

        description

    };

    jobs.push(job);

    localStorage.setItem(
        "myCareerJobs",
        JSON.stringify(jobs)
    );

    addAdminJob(job);

    closeModal("jobModal");

    clearJobForm();

    showToast(
        "Job published successfully!"
    );
}


function addAdminJob(job) {

    const list =
        document.getElementById(
            "adminJobList"
        );

    if (!list) {
        return;
    }

    const element =
        document.createElement("div");

    element.className =
        "admin-job";

    element.innerHTML = `

        <div class="company-logo">
            ${escapeHTML(
                job.company.charAt(0)
            )}
        </div>

        <div>

            <strong>
                ${escapeHTML(job.title)}
            </strong>

            <small>
                ${escapeHTML(job.company)}
                •
                ${escapeHTML(job.location)}
            </small>

        </div>

        <button
            onclick="this.parentElement.remove(); showToast('Job removed')">

            <i class="fa-solid fa-trash"></i>

        </button>
    `;

    list.prepend(element);
}


function clearJobForm() {

    [
        "newJobTitle",
        "newJobCompany",
        "newJobLocation",
        "newJobDescription"

    ].forEach(id => {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = "";
        }

    });
}


/* =========================
   MODAL HELPERS
========================= */

function closeModal(id) {

    const modal =
        document.getElementById(id);

    if (modal) {

        modal.classList.remove("show");
    }
}


document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "modal-overlay"
            )
        ) {

            event.target.classList.remove(
                "show"
            );
        }

    }
);


/* =========================
   FILTER BUTTONS
========================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "filter"
            )
        ) {

            document
                .querySelectorAll(".filter")
                .forEach(button => {

                    button.classList.remove(
                        "active"
                    );

                });

            event.target.classList.add(
                "active"
            );

            const filter =
                event.target.textContent
                    .trim()
                    .toLowerCase();

            if (filter === "all") {

                document
                    .querySelectorAll(".job-card")
                    .forEach(card => {

                        card.style.display =
                            "flex";

                    });

                return;
            }

            document
                .querySelectorAll(".job-card")
                .forEach(card => {

                    const text =
                        card.textContent
                            .toLowerCase();

                    card.style.display =
                        text.includes(filter)
                            ? "flex"
                            : "none";

                });

        }

    }
);


/* =========================
   ESCAPE HTML
========================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        String(value);

    return div.innerHTML;
}


/* =========================
   LOAD SAVED DATA
========================= */

function loadSavedPosts() {

    if (!posts.length) {
        return;
    }

    posts
        .slice()
        .reverse()
        .forEach(post => {

            addPostToFeed(post);

        });
}


function loadAdminJobs() {

    if (!jobs.length) {
        return;
    }

    jobs.forEach(job => {

        addAdminJob(job);

    });
}


/* =========================
   KEYBOARD SHORTCUTS
========================= */

document.addEventListener(
    "keydown",
    function(event) {

        /* Ctrl + K */

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            const search =
                document.getElementById(
                    "globalSearch"
                );

            search?.focus();
        }

        /* Escape */

        if (event.key === "Escape") {

            closeNotifications();

            document
                .querySelectorAll(".modal-overlay")
                .forEach(modal => {

                    modal.classList.remove("show");

                });
        }

    }
);


/* =========================
   INITIALIZATION
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadTheme();

        loadProfile();

        loadSavedPosts();

        loadAdminJobs();

        showPage("home");

        console.log(
            "My Career loaded successfully."
        );

        console.log(
            "Founded by Siddhi Bhintade."
        );

    }
);

$(function () {
  console.log("Script loaded successfully.");

  // ---------- Greeting ----------
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  $("#greetingText").text(`${getTimeGreeting()}, my name is Matt Schultz! Welcome to my portfolio!`);

  // ---------- Theme toggle ----------
  const updateThemeButton = () => {
    const isDark = $("body").hasClass("dark");
    $("#themeToggle")
      .text(isDark ? "☀️" : "🌙")
      .toggleClass("btn-outline-light", isDark)
      .toggleClass("btn-outline-dark", !isDark);
  };
  $("#themeToggle").on("click", () => {
    $("body").toggleClass("dark");
    updateThemeButton();
  });

  // ---------- Resume download + counter ----------
  const resumeHref = "Matthew_Schultz_Resume.pdf";
  $("#downloadBtn").attr("href", resumeHref);

  let downloadCount = 0;
  const $counterP = $('<p class="small text-muted mb-0">Downloaded 0 times</p>');
  $("#downloadCounterContainer").append($counterP);

  $("#downloadBtn").on("click", (e) => {
    e.preventDefault();
    const a = document.createElement("a");
    a.href = resumeHref;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
    downloadCount++;
    $counterP.text(`Downloaded ${downloadCount} time${downloadCount !== 1 ? "s" : ""}`);
    setTimeout(() => alert("Your resume was downloaded successfully!"), 800);
  });

  // ---------- Dynamic Navigation ----------
  const navItems = [
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "customize", label: "Customize" }
  ];
  const $navMenu = $("#navMenu");
  navItems.forEach(item => {
    $navMenu.append(`<li class="nav-item"><a class="nav-link text-white fw-semibold" href="#${item.id}">${item.label}</a></li>`);
  });

  $navMenu.on("click", "a", function (e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top - 80 }, 450);
  });

  // ---------- Skills ----------
  let skills = ["HTML", "CSS", "JavaScript", "Python", "Bootstrap", "GitHub", "VS Code"];
  const $skillList = $("#skillList");
  const $newSkillInput = $("#newSkillInput");
  const $skillSearch = $("#skillSearch");

  const renderSkills = (filterFn = () => true) => {
    $skillList.empty();
    skills.forEach(skill => {
      if (!filterFn(skill)) return;
      const $li = $(`
        <li class="list-group-item d-flex justify-content-between align-items-center skill-item">
          <span class="skill-name">${skill}</span>
          <span class="edit-hint ms-2">(click to edit)</span>
          <button class="btn btn-sm text-danger delete-btn">🗑️</button>
        </li>
      `);
      $skillList.append($li.hide().fadeIn(200));
    });
  };

  const exists = s => skills.map(x => x.toLowerCase()).includes(s.toLowerCase());
  const addSkill = s => {
    if (!s.trim()) return alert("Please enter a skill.");
    if (exists(s)) return alert("That skill already exists.");
    skills.push(s.trim());
    renderSkills(applyFilter());
  };

  const updateSkill = (oldName, newName) => {
    if (!newName.trim()) return alert("Name cannot be empty.");
    if (exists(newName)) return alert("That skill already exists.");
    const i = skills.indexOf(oldName);
    skills[i] = newName.trim();
    renderSkills(applyFilter());
  };

  const removeSkill = name => {
    skills = skills.filter(s => s !== name);
    renderSkills(applyFilter());
  };

  const applyFilter = () => {
    const q = $skillSearch.val().toLowerCase();
    if (!q) return () => true;
    return s => s.toLowerCase().includes(q);
  };

  $("#skillForm").on("submit", e => { e.preventDefault(); addSkill($newSkillInput.val()); $newSkillInput.val(""); });
  $skillList.on("click", ".delete-btn", function () { removeSkill($(this).siblings(".skill-name").text()); });
  $skillList.on("click", ".skill-name", function () {
    const old = $(this).text();
    const n = prompt("Edit skill:", old);
    if (n !== null) updateSkill(old, n);
  });
  $skillSearch.on("input", () => renderSkills(applyFilter()));
  $newSkillInput.on("keydown", e => {
    if (e.key === "Enter") { e.preventDefault(); addSkill($newSkillInput.val()); $newSkillInput.val(""); }
    if (e.key === "Escape") { $newSkillInput.val(""); $skillSearch.val(""); renderSkills(); }
  });
  renderSkills();

  // ---------- Projects ----------
  const $projectList = $("#projectList");
  const today = new Date();
  let projects = [
    {
      title: "Portfolio Website",
      description: "Personal portfolio site built with HTML, CSS, Bootstrap, and JavaScript.",
      deadline: new Date("2025-12-12"),
      imageURL: "project-random1.jpg"
    },
    {
      title: "Weather Dashboard",
      description: "Responsive weather dashboard fetching live API data.",
      deadline: new Date("2025-11-15"),
      imageURL: "project-random2.jpg"
    },
    {
      title: "Task Tracker App",
      description: "Web app to manage and mark daily tasks with local storage.",
      deadline: new Date("2025-10-01"),
      imageURL: "project-random3.jpg"
    }
  ];

  const renderProjects = () => {
    console.log("🔧 Rendering projects...");
    $projectList.empty();
    $("#projects").css("display", "block");

    projects.forEach(p => {
      const status = p.deadline > today ? "Ongoing" : "Completed";
      const $col = $('<div class="col-md-6 col-lg-4"></div>');
      const $card = $(`
        <div class="card h-100 shadow-sm">
          <img src="${p.imageURL}" alt="${p.title}" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="card-text small text-muted">${p.description}</p>
            <p><strong>Deadline:</strong> ${p.deadline.toISOString().slice(0,10)}</p>
            <p><strong>Status:</strong> ${status}</p>
          </div>
        </div>
      `);
      $col.append($card.hide());
      $projectList.append($col);
      $card.css("display", "block").hide().fadeIn(400);

      const img = $card.find("img")[0];
      img.onerror = function () {
        console.warn(`⚠️ Image not found: ${p.imageURL}, using placeholder.`);
        this.src = "https://via.placeholder.com/400x200?text=Image+Unavailable";
      };
    });

    console.log("✅ Projects rendered:", projects.length);
  };

  $("#sortSelect").on("change", function () {
    const dir = $(this).val();
    projects.sort((a, b) => dir === "asc" ? a.deadline - b.deadline : b.deadline - a.deadline);
    renderProjects();
  });

  renderProjects();

  // ---------- Tables ----------
  const educationData = [
    ["Northern Arizona University", "B.S. Applied Computer Science", "2023–2027"],
    ["Florence High School", "High School Diploma", "2014–2018"]
  ];
  const experienceData = [
    ["Web Development Student", "NAU – CS212", "2025 (current)"],
    ["Frontend Practice", "Personal Projects", "Ongoing"]
  ];

  const buildTable = (id, headers, data) => {
    const $container = $("#" + id).empty();
    const $table = $('<table class="table table-striped align-middle"></table>');
    const $thead = $("<thead><tr></tr></thead>");
    headers.forEach(h => $thead.find("tr").append(`<th>${h}</th>`));
    const $tbody = $("<tbody></tbody>");
    data.forEach(r => {
      const $tr = $("<tr></tr>");
      r.forEach(c => $tr.append(`<td>${c}</td>`));
      $tbody.append($tr);
    });
    $table.append($thead).append($tbody);
    $container.append($table.hide().slideDown(200));
  };

  buildTable("educationTableContainer", ["Institution", "Program", "Dates"], educationData);
  buildTable("experienceTableContainer", ["Role", "Organization", "Dates"], experienceData);

  // ---------- Customization ----------
  $("#fontSizeRange").on("input", function () { $("body").css("font-size", $(this).val() + "px"); });
  $("#bgColorPicker").on("input", function () { $("body").css("background-color", $(this).val()); });

  $(".card").each(function (i, c) { setTimeout(() => $(c).addClass("visible"), 100 * i); });
  updateThemeButton();
});

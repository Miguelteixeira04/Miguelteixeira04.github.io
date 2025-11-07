const viewProjectsBtn   = document.querySelector('a[href="#projects"].btn-primary')
const observerOptions   = { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
const indicatorLinks    = document.querySelectorAll(".indicator-link")
const filterButtons     = document.querySelectorAll(".filter-btn")
const projectsGrid      = document.getElementById("projectsGrid")
const utadImage         = document.getElementById("utadImage")
const navToggle         = document.getElementById("navToggle")
const navMenu           = document.getElementById("navMenu")
const username          = "Miguelteixeira04"
const repoName          = "LEI"

const projectLanguages  = {
  "BartleZ": ["javascript", "html"],
  "Biblioteca LEI UTAD": ["csharp", "sql"],
  "Jogo Do Semáforo": ["python"],
  "Manuais SQL": ["sql"],
  "Robots(NetLogo)": ["netlogo"],
  "SightSync": ["javascript", "html"],
  "Space Invaders 3D": ["javascript", "html"],
  "To do List": ["cpp", "sql"],
  "Wavy Agregador Servidor": ["csharp"]
}

const folderIconPath = `
  M2 2.5A2.5 2.5 0 014.5 0h8.75a.75.75 0 01.75.75v12.5a.75.75 
  0 01-.75.75h-2.5a.75.75 0 110-1.5h1.75v-2h-8a1 1 0 
  00-.714 1.7.75.75 0 01-1.072 1.05A2.495 2.495 0 
  012 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 
  .208V2.5a1 1 0 011-1h8zM5 12.25v3.25a.25.25 
  0 00.4.2l1.45-1.087a.25.25 0 01.3 0L8.6 
  15.7a.25.25 0 00.4-.2v-3.25a.25.25 0 
  00-.25-.25h-3.5a.25.25 0 00-.25.25z
`

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active")
  })
})

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", e => {
    e.preventDefault()
    const target = document.querySelector(anchor.getAttribute("href"))
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  })
})

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"))
    button.classList.add("active")
    const filter = button.getAttribute("data-filter")
    const projectCards = document.querySelectorAll(".project-card")
    projectCards.forEach(card => {
      const languages = card.dataset.languages.split(",")
      if (filter === "all") {
        card.style.display = "block"
      } else if (filter === "html-js") {
        card.style.display = languages.some(lang => ["javascript", "html"].includes(lang)) ? "block" : "none"
      } else if (filter === "csharp-cpp") {
        card.style.display = languages.some(lang => ["csharp", "cpp"].includes(lang)) ? "block" : "none"
      } else if (filter === "other") {
        card.style.display = languages.every(lang => !["javascript", "html", "csharp", "cpp"].includes(lang)) ? "block" : "none"
      }
    })
  })
})

document.getElementById("brandLink").addEventListener("click", e => {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: "smooth" })
})

function setActiveIndicator(sectionId) {
  indicatorLinks.forEach(link => {
    if (link.dataset.section === sectionId) {
      link.classList.add("active")
      link.setAttribute("aria-current", "true")
    } else {
      link.classList.remove("active")
      link.removeAttribute("aria-current")
    }
  })
}

indicatorLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault()
    const targetId = link.getAttribute("href")
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  })
})

const indicatorObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActiveIndicator(entry.target.id)
  })
}, { root: null, threshold: 0.45 })

document.querySelectorAll("section").forEach(sec => indicatorObserver.observe(sec))

if (viewProjectsBtn) {
  viewProjectsBtn.innerHTML = 'Portfolio <i class="fa-solid fa-arrow-down download-icon" style="margin-left: 10px;"></i>'
  viewProjectsBtn.href = "#"
  viewProjectsBtn.addEventListener("click", e => {
    e.preventDefault()
    window.open("/Documents/PORTEFOLIO.pdf", "_blank")
  })
}

async function fetchGitHubRepos() {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents`)
    if (!response.ok) throw new Error(`GitHub API retornou erro ${response.status}`)
    const contents = await response.json()
    const projects = contents.filter(item => item.type === "dir")
    displayProjects(projects)
    updateStats(projects)
  } catch (error) {
    console.error("[v0] Erro ao carregar projetos:", error)
   projectsGrid.innerHTML = `
    <div class="error-message">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>Erro ao carregar projetos. Verifique se <strong>${username}/${repoName}</strong> é público e tente novamente.</p>
    </div>
  `
  }
}

function displayProjects(projects) {
  projectsGrid.innerHTML = ""
  projects.forEach(project => {
    const card = createProjectCard(project)
    projectsGrid.appendChild(card)
  })
}

function createProjectCard(project) {
  const card = document.createElement("div")
  card.className = "project-card"

  const projectName = formatProjectName(project.name)
  const languages = getProjectLanguages(projectName)
  card.dataset.languages = languages.join(",")

  const languageBadges = languages.map(lang => `
    <div class="project-language">
      <span class="language-dot" style="background-color: ${getLanguageColor(lang)}"></span>
      <span>${getLanguageDisplayName(lang)}</span>
    </div>
  `).join("")

  card.innerHTML = `
    <div class="project-header">
      <svg class="project-icon" viewBox="0 0 16 16" fill="currentColor">
        <path d="${folderIconPath.trim()}"></path>
      </svg>
      <h3 class="project-title">${projectName}</h3>
    </div>
    <div class="project-footer">
      <div class="project-languages-container">${languageBadges}</div>
      <div class="project-stars">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M2 3h12v1H2zM2 7h8v1H2zM2 11h12v1H2z"/>
        </svg>
        <span>Folder</span>
      </div>
    </div>
  `

  card.addEventListener("click", () => {
    window.open(`https://github.com/${username}/${repoName}/tree/main/${project.name}`, "_blank")
  })

  return card
}


function formatProjectName(name) {
  return name.replace(/[-_]/g, " ").split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function getProjectLanguages(projectName) {
  for (const [key, languages] of Object.entries(projectLanguages)) {
    if (projectName.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(projectName.toLowerCase())) {
      return languages
    }
  }
  return ["other"]
}

function getLanguageDisplayName(language) {
  const displayNames = {
    javascript: "JavaScript",
    html: "HTML/CSS",
    python: "Python",
    csharp: "C#",
    sql: "SQL",
    cpp: "C++",
    netlogo: "NetLogo",
    other: "Other"
  }
  return displayNames[language] || language.toUpperCase()
}

function getLanguageColor(language) {
  const colors = {
    javascript: "#f1e05a",
    python: "#3572A5",
    html: "#e34c26",
    css: "#563d7c",
    java: "#b07219",
    cpp: "#f34b7d",
    csharp: "#178600",
    sql: "#e38c00",
    netlogo: "#ff6375"
  }
  return colors[language.toLowerCase()] || "#8b949e"
}

function updateStats(projects) {
  const repoCount = document.getElementById("repoCount")
  const languageCount = document.getElementById("languageCount")
  if (repoCount && languageCount) {
    repoCount.textContent = projects.length
    const allLanguages = new Set()
    projects.forEach(project => {
      const projectName = formatProjectName(project.name)
      const languages = getProjectLanguages(projectName)
      languages.forEach(lang => {
        if (lang !== "other") allLanguages.add(lang)
      })
    })
    languageCount.textContent = allLanguages.size || 1
  }
}

if (utadImage) {
  const utadImages = ["/Photos/utad.jpg", "/Photos/utad2.jpg"]
  let current = 0
  setInterval(() => {
    current = (current + 1) % utadImages.length
    utadImage.style.opacity = "0"
    setTimeout(() => {
      utadImage.src = utadImages[current]
      utadImage.style.opacity = "1"
    }, 400)
  }, 5000)
}

fetchGitHubRepos()

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1"
      entry.target.style.transform = "translateY(0)"
    }
  })
}, observerOptions)

document.querySelectorAll("section").forEach(section => {
  section.style.opacity = "0"
  section.style.transform = "translateY(20px)"
  section.style.transition = "opacity 0.6s ease, transform 0.6s ease"
  observer.observe(section)
})

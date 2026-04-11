const caseStudies = [
  {
    title: "CVG Persona System",
    era: "2025-2026",
    focus: "Persona architecture",
    summary:
      "Built a multi-layer persona system spanning supporter roles, motivational archetypes, frontline partner needs, and generational overlays.",
    sections: [
      {
        label: "Challenge",
        text: "Teams needed something more durable than fictional personas: a comparative system grounded in research that could guide product and leadership decisions quickly."
      },
      {
        label: "Methods",
        text: "Comparative synthesis across MaxDiff studies, contrast analyses, sandbox segmentation, donor research, naming validation, and usability benchmark inputs."
      },
      {
        label: "Contribution",
        text: "Mapped 16 personas and translated them into KPI, UX risk, and feature prioritization tables so the framework could drive action instead of sitting in a slide deck."
      }
    ],
    tags: ["Mixed methods", "Personas", "Strategy"],
    filters: ["mixed", "personas", "strategy"],
    footnote: "Based on documented persona and executive-summary artifacts."
  },
  {
    title: "Causes Conversion Funnel Diagnosis",
    era: "2024-2025",
    focus: "Experience baseline",
    summary:
      "Framed a conversion-baseline study around a steep early drop-off problem and connected behavioral signals to experience quality, trust, and measurement governance.",
    sections: [
      {
        label: "Challenge",
        text: "The Causes journey showed a severe homepage abandonment problem, but the organization lacked a shared explanation of why users disengaged so early."
      },
      {
        label: "Methods",
        text: "Journey framing, analytics-informed diagnosis, research questions designed for scorecard outputs, and a measurement model aligned to doability, dependability, delight, and desire."
      },
      {
        label: "Contribution",
        text: "Created a baseline structure teams could use for prioritization, future benchmarking, and more credible product decisions before investing downstream."
      }
    ],
    tags: ["Mixed methods", "Funnel analysis", "Scorecards"],
    filters: ["mixed", "strategy"],
    footnote: "Based on a research brief and scorecard-oriented measurement framing."
  },
  {
    title: "Prospect Motivation MaxDiff Study",
    era: "2025",
    focus: "Quantitative preference modeling",
    summary:
      "Used MaxDiff to isolate what first-time supporters need before donating, revealing that clarity, control, and tangible proof matter more than emotional or social appeal.",
    sections: [
      {
        label: "Challenge",
        text: "First-time supporters were converting differently from repeat donors, and messaging assumptions were obscuring what actually motivates early trust."
      },
      {
        label: "Methods",
        text: "Best-worst scaling, segment comparison, hierarchical Bayesian estimation, and confidence-aware interpretation across prospect and donor groups."
      },
      {
        label: "Contribution",
        text: "Reframed onboarding and content strategy around transparency, autonomy, and specific impact evidence rather than generic emotional messaging."
      }
    ],
    tags: ["Quant", "MaxDiff", "Motivation"],
    filters: ["quant", "strategy"],
    footnote: "Based on quantitative MaxDiff research and segment comparison work."
  },
  {
    title: "Lifecycle Trust and Giving Impact Study",
    era: "2025",
    focus: "Trust-sensitive decisions",
    summary:
      "Designed a scenario-framed preference study to understand how supporters expect donations to be handled when a cause ends or can no longer proceed.",
    sections: [
      {
        label: "Challenge",
        text: "The platform needed defensible defaults for high-trust lifecycle moments before engineering encoded irreversible behaviors into the product."
      },
      {
        label: "Methods",
        text: "Scenario-based survey design with MaxDiff tradeoffs, communication preference capture, and sensitivity checks around higher donation amounts."
      },
      {
        label: "Contribution",
        text: "Defined a research path for safe automation, donor control expectations, and communication guardrails in moments where trust could break."
      }
    ],
    tags: ["Quant", "Trust", "Lifecycle"],
    filters: ["quant", "strategy"],
    footnote: "Based on a scenario-framed trust and preference research plan."
  },
  {
    title: "High-Impact Donor Persona Program",
    era: "2025",
    focus: "Persona-driven product strategy",
    summary:
      "Developed a research plan to refine high-impact donor personas, validate them with survey work, and connect them to profile tagging and roadmap decisions.",
    sections: [
      {
        label: "Challenge",
        text: "Supporter-platform planning needed sharper donor definitions and a way to connect qualitative insight to measurable platform behavior."
      },
      {
        label: "Methods",
        text: "Qual-to-quant persona refinement, documentation review, validation survey planning, user-story mapping, and analytics instrumentation thinking."
      },
      {
        label: "Contribution",
        text: "Moved personas from static artifacts toward an operational system teams could use during rollout, onboarding, and post-launch analysis."
      }
    ],
    tags: ["Personas", "Strategy", "Tracking"],
    filters: ["mixed", "personas", "strategy"],
    footnote: "Based on donor-persona refinement, validation, and tracking strategy work."
  },
  {
    title: "Persona Naming Survey",
    era: "2025",
    focus: "Measurement design",
    summary:
      "Applied ranking, Likert scoring, and segmentation analysis to evaluate persona-name options with a more disciplined and testable naming process.",
    sections: [
      {
        label: "Challenge",
        text: "Persona naming often defaults to intuition, but names shape stakeholder understanding and can introduce bias if they are poorly tested."
      },
      {
        label: "Methods",
        text: "Forced ranking, Likert ratings, randomization, and quantitative analysis including chi-square, factor analysis, and regression modeling."
      },
      {
        label: "Contribution",
        text: "Showed that even seemingly qualitative branding decisions can benefit from tighter experimental thinking and segmentation-aware interpretation."
      }
    ],
    tags: ["Quant", "Personas", "Survey design"],
    filters: ["quant", "personas"],
    footnote: "Based on quantitative naming validation and survey-method design."
  }
];

const grid = document.querySelector("#case-study-grid");
const template = document.querySelector("#case-study-template");
const filterButtons = Array.from(document.querySelectorAll("[data-filter]"));

function renderCaseStudies(activeFilter = "all") {
  grid.innerHTML = "";

  const visibleStudies =
    activeFilter === "all"
      ? caseStudies
      : caseStudies.filter((study) => study.filters.includes(activeFilter));

  visibleStudies.forEach((study, index) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".case-study-card");
    const era = fragment.querySelector(".case-study-era");
    const focus = fragment.querySelector(".case-study-focus");
    const title = fragment.querySelector(".case-study-title");
    const summary = fragment.querySelector(".case-study-summary");
    const sections = fragment.querySelector(".case-study-sections");
    const tags = fragment.querySelector(".case-study-tags");
    const footnote = fragment.querySelector(".case-study-footnote");

    era.textContent = study.era;
    focus.textContent = study.focus;
    title.textContent = study.title;
    summary.textContent = study.summary;
    footnote.textContent = study.footnote;

    study.sections.forEach((item) => {
      const block = document.createElement("div");
      const heading = document.createElement("strong");
      const copy = document.createElement("p");

      block.className = "case-study-section";
      heading.textContent = item.label;
      copy.textContent = item.text;

      block.appendChild(heading);
      block.appendChild(copy);
      sections.appendChild(block);
    });

    study.tags.forEach((tag) => {
      const pill = document.createElement("span");
      pill.className = "case-study-tag";
      pill.textContent = tag;
      tags.appendChild(pill);
    });

    card.style.transitionDelay = `${index * 70}ms`;
    grid.appendChild(fragment);
  });

  observeRevealCards();
}

function setActiveFilter(nextFilter) {
  filterButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === nextFilter);
  });

  renderCaseStudies(nextFilter);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16
  }
);

function observeRevealCards() {
  document.querySelectorAll(".reveal-card").forEach((card) => {
    revealObserver.observe(card);
  });
}

document.querySelectorAll(".reveal").forEach((section) => {
  revealObserver.observe(section);
});

renderCaseStudies();

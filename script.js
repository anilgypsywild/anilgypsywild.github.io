const caseStudies = [
  {
    title: "Multi-Segment Persona Architecture",
    era: "2025-2026",
    focus: "Segmentation strategy",
    summary:
      "Designed a layered persona system that connected behavioral roles, motivational segments, operational constraints, and decision-making implications.",
    sections: [
      {
        label: "Challenge",
        text: "A product organization needed sharper segmentation than static personas so teams could prioritize design, messaging, and measurement against real user differences."
      },
      {
        label: "Methods",
        text: "Synthesized quantitative preference studies, qualitative interviews, workflow observations, and benchmark inputs into a comparative decision framework."
      },
      {
        label: "Contribution",
        text: "Created a persona architecture tied to product priorities, UX risks, and measurement signals so segmentation could guide roadmap decisions."
      }
    ],
    tags: ["Mixed methods", "Segmentation", "Strategy"],
    filters: ["mixed", "personas", "strategy"],
    footnote: "Representative of client segmentation and strategy work; details anonymized."
  },
  {
    title: "Conversion Breakdown and Experience Baseline",
    era: "2024-2025",
    focus: "Journey diagnosis",
    summary:
      "Defined a behavioral and experience baseline for a multi-step conversion flow with high early abandonment and unclear root causes.",
    sections: [
      {
        label: "Challenge",
        text: "A digital journey was losing users early, but the team lacked a shared explanation for where trust, clarity, or interaction friction were breaking down."
      },
      {
        label: "Methods",
        text: "Behavioral analysis, experience framing, scorecard design, and research questions built to connect drop-off patterns to actionable UX diagnosis."
      },
      {
        label: "Contribution",
        text: "Established a reusable baseline for prioritization, benchmarking, and measuring whether future changes improved the experience."
      }
    ],
    tags: ["Mixed methods", "Journey analysis", "Benchmarking"],
    filters: ["mixed", "strategy"],
    footnote: "Representative of journey diagnosis and baseline measurement work; details anonymized."
  },
  {
    title: "Motivation Modeling for New Users",
    era: "2025",
    focus: "Quantitative preference modeling",
    summary:
      "Used quantitative preference research to identify which messages and experience attributes mattered most to new users making an initial commitment.",
    sections: [
      {
        label: "Challenge",
        text: "A team needed to know which value propositions and interface cues actually moved new users from consideration to action."
      },
      {
        label: "Methods",
        text: "Best-worst scaling, segment comparison, and utility-based interpretation of competing motivations and trust drivers."
      },
      {
        label: "Contribution",
        text: "Helped reframe messaging and experience strategy around the factors with the strongest influence on first-time action."
      }
    ],
    tags: ["Quant", "Preference modeling", "Messaging"],
    filters: ["quant", "strategy"],
    footnote: "Representative of quantitative messaging and preference work; details anonymized."
  },
  {
    title: "Trust-Preserving Lifecycle Decisions",
    era: "2025",
    focus: "Trust and policy design",
    summary:
      "Designed research to understand user expectations in moments where a platform needed to make sensitive default decisions on the user's behalf.",
    sections: [
      {
        label: "Challenge",
        text: "A product team needed defensible defaults for trust-sensitive scenarios before implementing irreversible behaviors."
      },
      {
        label: "Methods",
        text: "Scenario-based survey design, tradeoff measurement, communication preference capture, and sensitivity testing around higher-stakes decisions."
      },
      {
        label: "Contribution",
        text: "Produced a framework for safe defaults, user control, and communication guardrails in situations where trust could easily be damaged."
      }
    ],
    tags: ["Quant", "Trust", "Decision design"],
    filters: ["quant", "strategy"],
    footnote: "Representative of trust-sensitive product decision work; details anonymized."
  },
  {
    title: "High-Value User Strategy Program",
    era: "2025",
    focus: "Segmentation and roadmap alignment",
    summary:
      "Developed a research program to refine an important high-value segment, validate it quantitatively, and connect it to product onboarding and measurement.",
    sections: [
      {
        label: "Challenge",
        text: "The organization needed a sharper understanding of a strategically important segment and a practical way to connect insight to product behavior."
      },
      {
        label: "Methods",
        text: "Qual-to-quant segmentation refinement, survey planning, story mapping, and instrumentation planning."
      },
      {
        label: "Contribution",
        text: "Moved the work from persona storytelling into a usable operating model for onboarding, feature planning, and post-launch analysis."
      }
    ],
    tags: ["Mixed methods", "Segmentation", "Roadmap"],
    filters: ["mixed", "personas", "strategy"],
    footnote: "Representative of segment strategy and onboarding work; details anonymized."
  },
  {
    title: "Naming and Taxonomy Validation Study",
    era: "2025",
    focus: "Measurement design",
    summary:
      "Applied quantitative methods to validate labels and naming choices so teams could avoid intuition-only decisions in a high-stakes product language system.",
    sections: [
      {
        label: "Challenge",
        text: "Labels and names were shaping interpretation across teams and users, but the choices had not been tested rigorously."
      },
      {
        label: "Methods",
        text: "Forced ranking, Likert scoring, randomization, and segmentation-aware quantitative analysis."
      },
      {
        label: "Contribution",
        text: "Showed how structured measurement can reduce ambiguity and improve confidence in language and taxonomy decisions."
      }
    ],
    tags: ["Quant", "Taxonomy", "Survey design"],
    filters: ["quant", "personas"],
    footnote: "Representative of language, taxonomy, and validation work; details anonymized."
  },
  {
    title: "Simulation-Based UX Evaluation for Complex Workflows",
    era: "2019-2020",
    focus: "Predictive UX methods",
    summary:
      "Used cognitive modeling and simulated users to estimate task performance, compare workflow designs, and establish early UX KPIs when direct user access was constrained.",
    sections: [
      {
        label: "Challenge",
        text: "In startup and early-stage settings, participant access, domain expertise, and timeline pressure can make traditional usability studies hard to run at the right speed."
      },
      {
        label: "Methods",
        text: "Cognitive modeling, skilled-user performance simulation, prototype-based workflow comparison, and baseline KPI estimation for complex enterprise tasks."
      },
      {
        label: "Contribution",
        text: "Created a faster way to compare design alternatives, estimate performance ranges, and guide UX investment before large-scale user studies were feasible."
      }
    ],
    tags: ["Quant", "Predictive UX", "Workflow simulation"],
    filters: ["quant", "strategy"],
    footnote: "Representative of published simulation-based UX work and startup-stage evaluation methods."
  },
  {
    title: "Choice Modeling for High-Stakes Product Decisions",
    era: "2018-2022",
    focus: "Choice experiments and conjoint",
    summary:
      "Applied discrete choice methods, MaxDiff, and conjoint-style thinking to quantify tradeoffs, compare alternatives, and support decisions with explicit preference structure.",
    sections: [
      {
        label: "Challenge",
        text: "Teams often need to choose among competing alternatives where intuition is strong, but the underlying tradeoffs across attributes, cost, and perceived value are unclear."
      },
      {
        label: "Methods",
        text: "Choice experiments, attribute-based preference design, MaxDiff, experimental questionnaire design, and model-based interpretation of tradeoffs."
      },
      {
        label: "Contribution",
        text: "Helped turn ambiguous preference debates into structured evidence that teams could use for prioritization, candidate evaluation, and product strategy."
      }
    ],
    tags: ["Quant", "Choice modeling", "Prioritization"],
    filters: ["quant", "strategy"],
    footnote: "Representative of conjoint, MaxDiff, and stated-preference decision work."
  },
  {
    title: "Heuristic Evaluation and Interaction-Quality Forecasting",
    era: "2022",
    focus: "Expert review and quality signals",
    summary:
      "Combined heuristic evaluation with lightweight statistical forecasting to identify likely understandability and efficiency issues in specialized product workflows.",
    sections: [
      {
        label: "Challenge",
        text: "Complex tools for expert users often accumulate interaction traps that are hard to prioritize quickly without a common quality language and credible severity framing."
      },
      {
        label: "Methods",
        text: "Heuristic evaluation, interaction-pattern review, tenet-based issue grouping, and simple probabilistic framing to support bug-bash and remediation planning."
      },
      {
        label: "Contribution",
        text: "Connected design tenets like consistency, context-sensitivity, understandability, and efficiency to practical next-step recommendations for product teams."
      }
    ],
    tags: ["Mixed methods", "Heuristics", "Quality"],
    filters: ["mixed", "strategy"],
    footnote: "Representative of design-quality diagnostics for specialized tools; details anonymized."
  },
  {
    title: "Quantifying Distrust in AI-Assisted Reasoning Systems",
    era: "2021-2022",
    focus: "AI trust measurement",
    summary:
      "Designed a quantitative framework for measuring distrust in a reasoning platform, showing how user type and context influenced suspicion, satisfaction, and system acceptance.",
    sections: [
      {
        label: "Challenge",
        text: "As AI-assisted systems became more proactive, teams needed a defensible way to evaluate not only usefulness but also distrust, locus of control, and perceived system intent."
      },
      {
        label: "Methods",
        text: "Trust-scale design, Likert-based measurement, ordinal modeling, segmentation analysis, and interpretation of how user type and context shaped distrust responses."
      },
      {
        label: "Contribution",
        text: "Turned distrust from a vague concern into a measurable construct that could guide evaluation design, variable selection, and responsible product decision-making."
      }
    ],
    tags: ["Quant", "AI trust", "Measurement"],
    filters: ["quant", "strategy"],
    footnote: "Representative of Microsoft and Microsoft Research-adjacent AI evaluation work; details summarized for public use."
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

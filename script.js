// CURSOR
const cg = document.getElementById("cg"),
  cd = document.getElementById("cd");
document.addEventListener("mousemove", (e) => {
  cg.style.transform = `translate(${e.clientX - 190}px,${e.clientY - 190}px)`;
  cd.style.transform = `translate(${e.clientX - 5}px,${e.clientY - 5}px)`;
});

// NAV
window.addEventListener("scroll", () =>
  document.getElementById("nav").classList.toggle("scrolled", scrollY > 50),
);

// TICKER
const tkI = [
  "Manutenção Preventiva",
  "Manutenção Corretiva",
  "Calibração de Equipamentos",
  "Certificação de Instrumentais",
  "Planos Contratados",
  "Atendimento no Local",
  "Compliance ANVISA",
  "Relatório Técnico Completo",
  "Peças Originais",
  "Técnicos Qualificados",
];
const tk = document.getElementById("ticker");
[...tkI, ...tkI].forEach((t) => {
  const s = document.createElement("span");
  s.className = "ticker-item";
  s.innerHTML = `<span class="ticker-dot"></span>${t}`;
  tk.appendChild(s);
});

// PARTICLES
const pc = document.getElementById("particles");
for (let i = 0; i < 22; i++) {
  const p = document.createElement("div");
  p.className = "particle";
  const s = Math.random() * 6 + 2;
  p.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * 100}%;animation-duration:${Math.random() * 12 + 8}s;animation-delay:${Math.random() * 8}s;--drift:${(Math.random() - 0.5) * 80}px`;
  pc.appendChild(p);
}

// REVEAL
const ro = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (e.isIntersecting)
        setTimeout(
          () => e.target.classList.add("visible"),
          (+e.target.dataset.d || 0) * 80,
        );
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.dataset.d = i % 4;
  ro.observe(el);
});

// WHY INTERACTIVE
let wiActive = 0;
function wiSet(i) {
  wiActive = i;
  document
    .querySelectorAll(".wi-card")
    .forEach((c, j) => c.classList.toggle("active", j === i));
  document
    .querySelectorAll(".wi-dot")
    .forEach((d, j) => d.classList.toggle("on", j === i));
}
setInterval(() => wiSet(wiActive === 0 ? 1 : 0), 4200);

// ===== STATS COUNTER ANIMATION =====
const statDefs = [
  { id: "sv0", target: 3, suffix: "x", label: "Economia com preventiva" },
  { id: "sv1", target: 98, suffix: "%", label: "Equipamentos funcionando" },
  { id: "sv2", target: 24, suffix: "h", label: "Problema resolvido" },
];
let statsAnimated = false;
function animateCounter(el, target, suffix, duration) {
  duration = duration || 1800;
  let start = null;
  const step = function (ts) {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - prog, 3);
    const val = Math.round(ease * target);
    el.innerHTML =
      "<span>" + val + '</span><span class="stat-suffix">' + suffix + "</span>";
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function triggerStats() {
  if (statsAnimated) return;
  statsAnimated = true;
  statDefs.forEach(function (s, i) {
    setTimeout(function () {
      const el = document.getElementById(s.id);
      if (el) animateCounter(el, s.target, s.suffix);
    }, i * 300);
  });
}
const statsObs = new IntersectionObserver(
  function (es) {
    if (es[0].isIntersecting) triggerStats();
  },
  { threshold: 0.3 },
);
const statsWrap = document.querySelector(".why-stats-wrap");
if (statsWrap) statsObs.observe(statsWrap);
// SVC SLIDER
const track = document.getElementById("svcTrack");
if (track) {
  // Duplicate cards for infinite CSS scroll animation
  track.innerHTML += track.innerHTML;
}

let svcOffset = 0;
function svcSlide(dir) {
  const cardW = 322;
  track.style.animation = "none";
  svcOffset += dir * cardW;
  const maxScroll = -(track.scrollWidth / 2 - cardW);
  if (svcOffset > 0) svcOffset = 0;
  if (svcOffset < maxScroll) svcOffset = maxScroll;
  track.style.transform = "translateX(" + svcOffset + "px)";
  track.style.transition = "transform .4s cubic-bezier(.4,0,.2,1)";
}

// VALUES SHUFFLE
const vals = [
  {
    icon: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    title: "Inovação",
    desc: "Tecnologia de diagnóstico e ferramentas atualizadas para serviços mais precisos.",
    r: -3,
  },
  {
    icon: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
    title: "Humanização",
    desc: "Por trás de cada equipamento existe um profissional dedicado e pacientes que dependem dele.",
    r: 2,
  },
  {
    icon: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/>',
    title: "Ética",
    desc: "Transparência total nos diagnósticos, propostas e cobranças. Nunca recomendamos o desnecessário.",
    r: -2,
  },
  {
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    title: "Comprometimento",
    desc: "Prazos e qualidade não são promessas — são compromissos. Cumprimos o que acordamos.",
    r: 3,
  },
  {
    icon: '<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>',
    title: "Excelência",
    desc: "Padrão técnico elevado em cada serviço — da calibração à revisão completa.",
    r: -1,
  },
  {
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    title: "Crescimento Mútuo",
    desc: "Crescemos junto com nossos parceiros. Quando sua clínica evolui, a Bonvie evolui também.",
    r: 1,
  },
];
const va = document.getElementById("valArena");
vals.forEach((v) => {
  const c = document.createElement("div");
  c.className = "val-card";
  c.style.setProperty("--rr", v.r + "deg");
  c.innerHTML = `<div class="val-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2727c8" stroke-width="1.8">${v.icon}</svg></div><div class="val-title">${v.title}</div><div class="val-desc">${v.desc}</div>`;
  va.appendChild(c);
});
const vao = new IntersectionObserver(
  (e) => {
    if (e[0].isIntersecting) {
      const cards = [...va.querySelectorAll(".val-card")];
      [...Array(cards.length).keys()]
        .sort(() => Math.random() - 0.5)
        .forEach((oi, d) =>
          setTimeout(
            () => cards[oi].classList.add("shuffled-in"),
            d * 120 + 80,
          ),
        );
      setTimeout(
        () => document.getElementById("valQuote").classList.add("shuffled-in"),
        cards.length * 120 + 200,
      );
      vao.disconnect();
    }
  },
  { threshold: 0.15 },
);
vao.observe(va);

// PLANS
const po = new IntersectionObserver(
  (e) => {
    if (e[0].isIntersecting) {
      document.querySelectorAll(".plan-card.plan-hidden").forEach((c, i) =>
        setTimeout(() => {
          c.classList.remove("plan-hidden");
          c.classList.add("plan-visible");
        }, i * 180),
      );
      po.disconnect();
    }
  },
  { threshold: 0.15 },
);
const pg = document.querySelector(".plans-grid");
if (pg) po.observe(pg);

// WHATSAPP
let chatOpen = false;
function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById("wa-chat").classList.toggle("open", chatOpen);
  if (chatOpen) {
    document.getElementById("wa-notif").style.display = "none";
    setTimeout(() => document.getElementById("b1").classList.add("show"), 300);
    setTimeout(() => document.getElementById("b2").classList.add("show"), 700);
  }
}
document.addEventListener("click", (e) => {
  const c = document.getElementById("wa-chat"),
    f = document.getElementById("wa-fab");
  if (chatOpen && !c.contains(e.target) && !f.contains(e.target)) {
    chatOpen = false;
    c.classList.remove("open");
  }
});

// FORM
function submitForm() {
  const n = document.querySelector(".cform .form-input").value;
  window.open(
    `https://wa.me/5584921472566?text=${n ? "Olá!+Meu+nome+é+" + encodeURIComponent(n) + "+e+gostaria+de+falar+com+a+Bonvie." : "Olá!+Gostaria+de+falar+com+a+Bonvie."}`,
    "_blank",
  );
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute("href"));
    if (t) t.scrollIntoView({ behavior: "smooth" });
  });
});

// FAQ ACCORDION
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector(".faq-a");
  const isOpen = item.classList.contains("open");

  // Close all other faqs
  document.querySelectorAll(".faq-item").forEach((fi) => {
    fi.classList.remove("open");
    fi.querySelector(".faq-a").style.maxHeight = null;
  });

  // Toggle the clicked one
  if (!isOpen) {
    item.classList.add("open");
    answer.style.maxHeight = answer.scrollHeight + "px";
  }
}

// TIMELINE (Methodology Section)
let tlState = 0;
const tlTotal = 6;
function tlGo(dir) {
  const tTrack = document.getElementById("tlTrack");
  const pFill = document.getElementById("tlProg");
  const cText = document.getElementById("tlCounter");
  const dDots = document.getElementById("tlDots");
  if (!tTrack) return;

  if (dir !== undefined) {
    tlState += dir;
  }

  if (tlState < 0) tlState = 0;
  if (tlState >= tlTotal) tlState = 0; // Wrap around for auto-slide

  const stepW = tTrack.children[0].offsetWidth;
  tTrack.style.transform = `translateX(-${tlState * stepW}px)`;

  document.getElementById("tlPrev").disabled = tlState === 0;
  document.getElementById("tlNext").disabled = false; // Never disable to allow wrap around

  pFill.style.width = `${((tlState + 1) / tlTotal) * 100}%`;
  cText.innerHTML = `0${tlState + 1} / 0${tlTotal}`;

  // Highlight active dot
  if (dDots) {
    Array.from(dDots.children).forEach((d, i) => {
      d.classList.toggle("active", i === tlState);
    });
  }

  // Animate ring
  const rings = tTrack.querySelectorAll(".tl-ring");
  rings.forEach((r) => r.classList.remove("anim"));
  if (rings[tlState]) {
    rings[tlState].classList.add("anim");
  }
}

// Generate dots for timeline
const dotsContainer = document.getElementById("tlDots");
if (dotsContainer) {
  for (let i = 0; i < tlTotal; i++) {
    const dot = document.createElement("div");
    dot.className = "tl-dot" + (i === 0 ? " active" : "");
    dot.onclick = () => {
      tlState = i;
      tlGo();
    };
    dotsContainer.appendChild(dot);
  }
}

// Initial state and auto-slide
if (document.getElementById("tlTrack")) {
  tlGo(0);
  setInterval(() => {
    tlGo(1);
  }, 4000); // Slide every 4 seconds

  window.addEventListener("resize", () => {
    tlGo(0); // Update transform on resize
  });
}

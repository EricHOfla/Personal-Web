import jsPDF from "jspdf";
import { portfolioData } from "../data";

export const generateResumePDF = () => {
  const {
    profile, experiences, education, skills,
    projects, testimonials,
    certifications, languages,
  } = portfolioData;

  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const pageW = 612;
  const mL = 40;
  const contentW = pageW - mL * 2;
  let y = 56;

  const primary = [30, 41, 59];
  const accent  = [124, 58, 237];
  const text    = [51, 65, 85];
  const muted   = [100, 116, 139];

  const setFont = (style, size, color) => {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const wrap = (str, x, startY, maxW, lineH) => {
    const lines = doc.splitTextToSize(str || "", maxW);
    lines.forEach((l) => { doc.text(l, x, startY); startY += lineH; });
    return startY;
  };

  const hr = (yPos, color) => {
    doc.setDrawColor(...(color || [226, 232, 240]));
    doc.setLineWidth(0.75);
    doc.line(mL, yPos, mL + contentW, yPos);
    return yPos + 14;
  };

  const sectionHead = (title, yPos) => {
    if (yPos > 680) { doc.addPage(); yPos = 56; }
    yPos += 6;
    setFont("bold", 11, primary);
    doc.text(title, mL, yPos);
    yPos += 6;
    doc.setDrawColor(...accent);
    doc.setLineWidth(1);
    doc.line(mL, yPos, mL + contentW, yPos);
    return yPos + 14;
  };

  // ── HEADER ──────────────────────────────────────────────────────
  setFont("bold", 20, primary);
  doc.text(profile.fullName || "HABUMUGISHA Eric", pageW / 2, y, { align: "center" });
  y += 22;

  setFont("bold", 11, accent);
  doc.text(
    `${profile.title || "Software Engineer"} | ${profile.subtitle || "Full Stack Developer"}`,
    pageW / 2, y, { align: "center" }
  );
  y += 16;

  setFont("normal", 9, muted);
  const contactLine = [
    profile.location || "Kigali, Rwanda",
    profile.email,
    profile.phone ? `+250 ${profile.phone}` : null,
    "LinkedIn: Eric H Ofla",
    "GitHub: EricHOfla",
  ].filter(Boolean).join("  |  ");
  doc.text(contactLine, pageW / 2, y, { align: "center" });
  y += 20;

  y = hr(y);

  // ── PROFESSIONAL SUMMARY ────────────────────────────────────────
  y = sectionHead("PROFESSIONAL SUMMARY", y);
  const summaryText =
    "Passionate and results-driven Software Engineer with extensive experience in architecting " +
    "and delivering modern, scalable web and mobile applications. Proficient in React, Node.js, " +
    "Django, Laravel, Flutter, TypeScript, Tailwind CSS, and relational/NoSQL databases with a " +
    "strong focus on clean code, performance optimization, and intuitive user experiences.";
  setFont("normal", 8.5, text);
  y = wrap(summaryText, mL, y, contentW, 13);
  y += 8;

  // ── TECHNICAL SKILLS ────────────────────────────────────────────
  y = sectionHead("TECHNICAL SKILLS", y);

  const skillLines = [
    ["Frontend", "React, Next.js, Flutter, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS"],
    ["Backend & APIs", "Node.js, Express, Django, FastAPI, Laravel, REST APIs, GraphQL"],
    ["Databases & Cloud", "PostgreSQL, MySQL, SQLite, MongoDB, Redis, Docker, Vercel, AWS"],
    ["Tools & Practices", "Git, GitHub, CI/CD, Agile/Scrum, Webpack, Testing, UI/UX Prototyping"],
  ];
  const grouped = {};
  (skills || []).forEach((s) => {
    const cat = s.category || "Other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(s.skill_name || s.name);
  });
  Object.entries(grouped).forEach(([cat, items]) => {
    const exists = skillLines.find((l) =>
      l[0].toLowerCase().includes(cat.toLowerCase().split(" ")[0])
    );
    if (!exists) skillLines.push([cat, items.join(", ")]);
  });

  skillLines.forEach(([cat, vals]) => {
    if (y > 690) { doc.addPage(); y = 56; }
    setFont("bold", 8.5, text);
    const label = `${cat}: `;
    const lw = doc.getTextWidth(label);
    doc.text(label, mL, y);
    setFont("normal", 8.5, text);
    y = wrap(vals, mL + lw, y, contentW - lw, 13);
    y += 3;
  });
  y += 6;

  // ── WORK EXPERIENCE ─────────────────────────────────────────────
  y = sectionHead("WORK EXPERIENCE", y);
  (experiences || []).forEach((exp) => {
    if (y > 670) { doc.addPage(); y = 56; }
    setFont("bold", 9.5, primary);
    doc.text(`${exp.job_title || exp.title}  |  ${exp.company}`, mL, y);
    setFont("bold", 8.5, muted);
    doc.text(exp.time_period || exp.duration || "", mL + contentW, y, { align: "right" });
    y += 13;
    setFont("normal", 8.5, text);
    y = wrap(`• ${exp.description || ""}`, mL, y, contentW, 13);
    y += 8;
  });
  y += 4;

  // ── EDUCATION ───────────────────────────────────────────────────
  y = sectionHead("EDUCATION", y);
  const seenEdu = new Set();
  (education || [])
    .filter((edu) => {
      const key = `${edu.degree}|${edu.institution}`;
      if (seenEdu.has(key)) return false;
      seenEdu.add(key); return true;
    })
    .forEach((edu) => {
      if (y > 670) { doc.addPage(); y = 56; }
      setFont("bold", 9.5, primary);
      doc.text(edu.degree || "Degree", mL, y);
      setFont("bold", 8.5, muted);
      doc.text(edu.institution || "", mL + contentW, y, { align: "right" });
      y += 13;
      setFont("normal", 8.5, text);
      y = wrap(edu.description || "", mL, y, contentW, 13);
      y += 8;
    });
  y += 4;

  // ── CERTIFICATIONS ──────────────────────────────────────────────
  if (certifications && certifications.length) {
    y = sectionHead("CERTIFICATIONS", y);
    certifications.forEach((cert) => {
      if (y > 680) { doc.addPage(); y = 56; }
      setFont("bold", 9, primary);
      doc.text(cert.name || "", mL, y);
      setFont("normal", 8.5, muted);
      doc.text(`${cert.issuer || ""}  •  ${cert.year || ""}`, mL + contentW, y, { align: "right" });
      y += 13;
    });
    y += 6;
  }

  // ── FEATURED PROJECTS ───────────────────────────────────────────
  y = sectionHead("FEATURED PROJECTS", y);
  (projects || []).forEach((proj) => {
    if (y > 680) { doc.addPage(); y = 56; }
    setFont("bold", 8.5, text);
    const label = `${proj.title}: `;
    const lw = doc.getTextWidth(label);
    doc.text(label, mL, y);
    setFont("normal", 8.5, text);
    y = wrap(proj.description || "", mL + lw, y, contentW - lw, 13);
    y += 4;
  });
  y += 4;

  // ── LANGUAGES ───────────────────────────────────────────────────
  if (languages && languages.length) {
    y = sectionHead("LANGUAGES", y);
    const langLine = languages.map((l) => `${l.name} (${l.level})`).join("   |   ");
    setFont("normal", 8.5, text);
    doc.text(langLine, mL, y);
    y += 16;
  }

  // ── REFERENCES ──────────────────────────────────────────────────
  if (testimonials && testimonials.length) {
    y = sectionHead("REFERENCES", y);
    testimonials.forEach((ref) => {
      if (y > 680) { doc.addPage(); y = 56; }
      setFont("bold", 9, primary);
      doc.text(`${ref.name}`, mL, y);
      setFont("normal", 8.5, muted);
      doc.text(`${ref.role}${ref.company ? ", " + ref.company : ""}`, mL, y + 11);
      setFont("normal", 8, text);
      y = wrap(`"${ref.message}"`, mL, y + 22, contentW, 12);
      y += 8;
    });
  }

  // ── SAVE ────────────────────────────────────────────────────────
  doc.save(`${(profile.fullName || "Eric_H").replace(/\s+/g, "_")}_Resume.pdf`);
};
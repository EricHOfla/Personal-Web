import io
from collections import defaultdict

from django.http import HttpResponse  # type: ignore
from reportlab.lib.pagesizes import letter  # type: ignore
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)  # type: ignore
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle  # type: ignore
from reportlab.lib import colors  # type: ignore

from .models import UserProfile, Experience, Education, Skill, Project, SocialLink
from rest_framework.decorators import api_view, permission_classes  # type: ignore
from rest_framework.permissions import AllowAny  # type: ignore
from rest_framework.response import Response  # type: ignore


@api_view(['GET'])
@permission_classes([AllowAny])
def generate_resume_pdf(request):
    """
    Generate a dynamic PDF resume from the portfolio data.
    """
    try:
        profile = UserProfile.objects.first()
        experiences = Experience.objects.order_by('-id')
        education = Education.objects.order_by('-id')
        skills = Skill.objects.order_by('-proficiency_level')
        projects = Project.objects.filter(is_featured=True)[:5]
        social_links = SocialLink.objects.all()
    except Exception as e:
        return Response({"error": f"Failed to fetch data: {str(e)}"}, status=500)

    # -----------------------
    # PDF Setup
    # -----------------------
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=45,
        leftMargin=45,
        topMargin=40,
        bottomMargin=35,
    )

    elements = []
    styles = getSampleStyleSheet()

    # -----------------------
    # Custom Styles
    # -----------------------
    styles.add(ParagraphStyle(
        name="NameStyle",
        parent=styles["Heading1"],
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#111827"),  # dark gray
        alignment=1,  # center
        spaceAfter=4,
    ))

    styles.add(ParagraphStyle(
        name="TitleStyle",
        parent=styles["Normal"],
        fontSize=12,
        leading=14,
        textColor=colors.HexColor("#4F46E5"),  # indigo
        alignment=1,
        spaceAfter=10,
    ))

    styles.add(ParagraphStyle(
        name="ContactStyle",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#374151"),
        alignment=1,
        spaceAfter=4,
    ))

    styles.add(ParagraphStyle(
        name="SectionHeader",
        parent=styles["Heading2"],
        fontSize=11,
        leading=14,
        textColor=colors.HexColor("#111827"),
        spaceBefore=14,
        spaceAfter=6,
    ))

    styles.add(ParagraphStyle(
        name="BodyTextJustified",
        parent=styles["Normal"],
        fontSize=9.8,
        leading=13.5,
        alignment=4,  # justify
        textColor=colors.HexColor("#111827"),
    ))

    styles.add(ParagraphStyle(
        name="ItemTitle",
        parent=styles["Normal"],
        fontSize=10.5,
        leading=13,
        fontName="Helvetica-Bold",
        textColor=colors.HexColor("#111827"),
        spaceAfter=2,
    ))

    styles.add(ParagraphStyle(
        name="ItemMeta",
        parent=styles["Normal"],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor("#6B7280"),
        spaceAfter=4,
    ))

    styles.add(ParagraphStyle(
        name="SmallBullet",
        parent=styles["Normal"],
        fontSize=9.5,
        leading=13,
        leftIndent=12,
        bulletIndent=4,
        textColor=colors.HexColor("#111827"),
    ))

    def section_divider():
        """Small clean divider line."""
        t = Table([[""]], colWidths=[520], rowHeights=[1])
        t.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#E5E7EB")),
            ("LEFTPADDING", (0, 0), (-1, -1), 0),
            ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 0),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
        ]))
        return t

    def safe_text(value, fallback=""):
        return value if value else fallback

    def clickable_label(url, label):
        """Make clickable word (LinkedIn, GitHub...) not full URL."""
        if not url:
            return None
        return f'<a href="{url}" color="blue"><u>{label}</u></a>'

    # -----------------------
    # Header Content
    # -----------------------
    full_name = "HABUMUGISHA Eric"
    job_title = "Software Engineer"

    if profile:
        full_name = safe_text(profile.full_name, f"{safe_text(profile.first_name)} {safe_text(profile.last_name)}").strip() or full_name
        job_title = (
            profile.title
            or getattr(profile, "job_title", None)
            or getattr(profile, "qualification", None)
            or job_title
        )

    elements.append(Paragraph(full_name.upper(), styles["NameStyle"]))
    elements.append(Paragraph(job_title, styles["TitleStyle"]))

    # Contact info line (email | phone | location)
    contact_parts = []
    if profile:
        if profile.email:
            contact_parts.append(f'<a href="mailto:{profile.email}" color="blue"><u>{profile.email}</u></a>')
        if profile.phone:
            contact_parts.append(profile.phone)

        location = " ".join([safe_text(getattr(profile, "residence", "")), safe_text(getattr(profile, "address", ""))]).strip()
        if location:
            contact_parts.append(location)

    if contact_parts:
        elements.append(Paragraph(" | ".join(contact_parts), styles["ContactStyle"]))

    # Social links line (Portfolio | LinkedIn | GitHub)
    website_link = next((link.url for link in social_links if link.platform and ("web" in link.platform.lower() or "portfolio" in link.platform.lower())), None)
    linkedin_link = next((link.url for link in social_links if link.platform and "linkedin" in link.platform.lower()), None)
    github_link = next((link.url for link in social_links if link.platform and "github" in link.platform.lower()), None)

    social_parts = []
    p = clickable_label(website_link, "Portfolio")
    l = clickable_label(linkedin_link, "LinkedIn")
    g = clickable_label(github_link, "GitHub")

    if p:
        social_parts.append(p)
    if l:
        social_parts.append(l)
    if g:
        social_parts.append(g)

    if social_parts:
        elements.append(Paragraph(" | ".join(social_parts), styles["ContactStyle"]))

    elements.append(Spacer(1, 14))

    # -----------------------
    # Summary / About
    # -----------------------
    if profile and profile.bio:
        elements.append(Paragraph("Professional Summary", styles["SectionHeader"]))
        elements.append(section_divider())
        elements.append(Spacer(1, 6))
        elements.append(Paragraph(profile.bio, styles["BodyTextJustified"]))
        elements.append(Spacer(1, 8))

    # -----------------------
    # Experience
    # -----------------------
    if experiences.exists():
        elements.append(Paragraph("Professional Experience", styles["SectionHeader"]))
        elements.append(section_divider())
        elements.append(Spacer(1, 6))

        for exp in experiences:
            date_range = safe_text(exp.time_period)
            company_info = " | ".join([x for x in [safe_text(exp.company), safe_text(exp.location)] if x])

            header_data = [[
                Paragraph(safe_text(exp.job_title, "Job Title"), styles["ItemTitle"]),
                Paragraph(f"<para align=right>{date_range}</para>", styles["ItemMeta"]),
            ]]
            t_head = Table(header_data, colWidths=[360, 160])
            t_head.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]))
            elements.append(t_head)

            if company_info:
                elements.append(Paragraph(company_info, styles["ItemMeta"]))

            if exp.description:
                lines = [x.strip() for x in exp.description.split("\n") if x.strip()]
                if len(lines) > 1:
                    for line in lines:
                        elements.append(Paragraph(line, styles["SmallBullet"], bulletText="•"))
                else:
                    elements.append(Paragraph(exp.description, styles["BodyTextJustified"]))

            elements.append(Spacer(1, 10))

    # -----------------------
    # Education
    # -----------------------
    if education.exists():
        elements.append(Paragraph("Education", styles["SectionHeader"]))
        elements.append(section_divider())
        elements.append(Spacer(1, 6))

        for edu in education:
            date_range = safe_text(getattr(edu, "time_period", ""))
            degree_text = safe_text(getattr(edu, "degree", ""))

            header_data = [[
                Paragraph(safe_text(edu.institution, "Institution"), styles["ItemTitle"]),
                Paragraph(f"<para align=right>{date_range}</para>", styles["ItemMeta"]),
            ]]
            t_head = Table(header_data, colWidths=[360, 160])
            t_head.setStyle(TableStyle([
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]))
            elements.append(t_head)

            if degree_text:
                elements.append(Paragraph(degree_text, styles["BodyTextJustified"]))

            elements.append(Spacer(1, 8))

    # -----------------------
    # Skills (Grouped by Category) ✅ UPDATED
    # -----------------------
    if skills.exists():
        elements.append(Paragraph("Skills", styles["SectionHeader"]))
        elements.append(section_divider())
        elements.append(Spacer(1, 6))

        skills_by_category = defaultdict(list)

        for s in skills:
            category = (s.category or "Other Skills").strip()
            skills_by_category[category].append(s.skill_name)

        for category, skill_list in skills_by_category.items():
            skill_list = [x for x in skill_list if x]
            if not skill_list:
                continue

            elements.append(
                Paragraph(
                    f"<b>{category}</b>: {', '.join(skill_list)}",
                    styles["BodyTextJustified"]
                )
            )
            elements.append(Spacer(1, 4))

        elements.append(Spacer(1, 8))

    # -----------------------
    # Featured Projects
    # -----------------------
    if projects.exists():
        elements.append(Paragraph("Featured Projects", styles["SectionHeader"]))
        elements.append(section_divider())
        elements.append(Spacer(1, 6))

        for proj in projects:
            title = safe_text(proj.title, "Project")
            category = safe_text(getattr(proj, "category", ""))

            if category:
                elements.append(
                    Paragraph(
                        f"<b>{title}</b>  <font color='#6B7280'>({category})</font>",
                        styles["ItemTitle"]
                    )
                )
            else:
                elements.append(Paragraph(f"<b>{title}</b>", styles["ItemTitle"]))

            if proj.description:
                elements.append(Paragraph(proj.description, styles["BodyTextJustified"]))

            elements.append(Spacer(1, 6))

    # -----------------------
    # Build PDF
    # -----------------------
    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()

    filename = f"Resume_{full_name.replace(' ', '_')}.pdf"
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    response.write(pdf)
    return response

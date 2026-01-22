import io
import os
from django.http import HttpResponse # type: ignore
from reportlab.pdfgen import canvas # type: ignore
from reportlab.lib.pagesizes import letter # type: ignore
from reportlab.lib.units import inch # type: ignore
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle # type: ignore
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle # type: ignore
from reportlab.lib import colors # type: ignore
from .models import UserProfile, Experience, Education, Skill, Project, SocialLink, Service, FunFact
from rest_framework.decorators import api_view, permission_classes # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from django.conf import settings # type: ignore
from django.templatetags.static import static # type: ignore
from rest_framework.response import Response # type: ignore

@api_view(['GET'])
@permission_classes([AllowAny])
def generate_resume_pdf(request):
    """
    Generate a dynamic PDF resume from the portfolio data.
    """
    # Create the Fetching logic
    try:
        profile = UserProfile.objects.first()
        experiences = Experience.objects.order_by('-start_year')
        education = Education.objects.order_by('-year')
        skills = Skill.objects.order_by('-proficiency_level')
        projects = Project.objects.filter(is_featured=True)[:5] # Top 5 featured projects
        social_links = SocialLink.objects.all()
    except Exception as e:
        return Response({"error": f"Failed to fetch data: {str(e)}"}, status=500)

    # Standard buffer setup
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
    
    # Storage for PDF elements
    elements = []
    styles = getSampleStyleSheet()
    
    # --- Custom Styles ---
    # Header Name
    styles.add(ParagraphStyle(
        name='ResumeName',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#2e1065'), # Deep purple
        spaceAfter=6,
        alignment=1 # Center
    ))
    
    # Job Title
    styles.add(ParagraphStyle(
        name='ResumeTitle',
        parent=styles['Normal'],
        fontSize=14,
        textColor=colors.HexColor('#8b5cf6'), # Design purple
        spaceAfter=12,
        alignment=1 # Center
    ))
    
    # Contact Info
    styles.add(ParagraphStyle(
        name='ResumeContact',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.black,
        alignment=1 # Center
    ))
    
    # Section Header
    styles.add(ParagraphStyle(
        name='SectionHeader',
        parent=styles['Heading2'],
        fontSize=12,
        textColor=colors.HexColor('#2e1065'),
        borderPadding=(0, 0, 5, 0),
        borderWidth=0,
        spaceBefore=12,
        spaceAfter=6,
        textTransform='uppercase'
    ))
    
    # Line Under Section Header
    styles.add(ParagraphStyle(
        name='SectionLine',
        fontSize=1,
        leading=1,
        spaceBefore=0,
        spaceAfter=8,
        backColor=colors.HexColor('#e5e7eb'),
        textColor=colors.HexColor('#e5e7eb'),
    ))

    # Normal text justified
    styles.add(ParagraphStyle(
        name='JustifiedText',
        parent=styles['Normal'],
        alignment=4, # Justify
        leading=14,
        fontSize=10
    ))
    
    # Item Header (Job Title / School)
    styles.add(ParagraphStyle(
        name='ItemHeader',
        parent=styles['Normal'],
        fontSize=11,
        fontName='Helvetica-Bold',
        spaceBefore=6,
        spaceAfter=2
    ))
    
    # Item Subheader (Company / Date)
    styles.add(ParagraphStyle(
        name='ItemSubHeader',
        parent=styles['Normal'],
        fontSize=10,
        textColor=colors.gray,
        spaceAfter=4
    ))

    # --- Content Building ---

    # 1. Header Section
    full_name = "HABUMUGISHA Eric"
    job_title = "Software Engineer"
    
    if profile:
        full_name = profile.full_name or f"{profile.first_name} {profile.last_name}"
        job_title = profile.title or profile.job_title or profile.qualification or job_title
        
        # Add basic info to name
        elements.append(Paragraph(full_name.upper(), styles['ResumeName']))
        elements.append(Paragraph(job_title, styles['ResumeTitle']))
        
        # Contact Line
        contact_parts = []
        if profile.email: contact_parts.append(profile.email)
        if profile.phone: contact_parts.append(profile.phone)
        if profile.location or (profile.residence and profile.address): 
             contact_parts.append(profile.location or f"{profile.residence}, {profile.address}")
        
        # Add social links to contact line if space permits, or new line
        website_link = next((link.url for link in social_links if 'web' in (link.platform or '').lower() or 'portfol' in (link.platform or '').lower()), None)
        linkedin_link = next((link.url for link in social_links if 'linkedin' in (link.platform or '').lower()), None)
        github_link = next((link.url for link in social_links if 'github' in (link.platform or '').lower()), None)
        
        if website_link: contact_parts.append(website_link)
        
        contact_text = " | ".join(contact_parts)
        elements.append(Paragraph(contact_text, styles['ResumeContact']))
        
        # Second line of links if they exist
        social_parts = []
        if linkedin_link: social_parts.append(f"LinkedIn: {linkedin_link}")
        if github_link: social_parts.append(f"GitHub: {github_link}")
        
        if social_parts:
            elements.append(Paragraph(" | ".join(social_parts), styles['ResumeContact']))
            
        elements.append(Spacer(1, 20))

    # 2. About Me / Summary
    if profile and profile.about_me:
        elements.append(Paragraph("Professional Summary", styles['SectionHeader']))
        # Draw a line
        line_data = [['']]
        t = Table(line_data, colWidths=[530], rowHeights=[1])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e5e7eb')),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 5))
        
        elements.append(Paragraph(profile.about_me, styles['JustifiedText']))
        elements.append(Spacer(1, 10))

    # 3. Experience Section
    if experiences.count() > 0:
        elements.append(Paragraph("Professional Experience", styles['SectionHeader']))
        line_data = [['']]
        t = Table(line_data, colWidths=[530], rowHeights=[1])
        t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e5e7eb'))]))
        elements.append(t)
        elements.append(Spacer(1, 5))
        
        for exp in experiences:
            # Title row: Job Title left, Date right
            date_range = f"{exp.start_year or ''} - {exp.end_year if not exp.is_current else 'Present'}"
            company_info = f"{exp.company_name or ''} | {exp.location or ''}"
            
            # Using a table for the header line to justify left/right
            header_data = [[
                Paragraph(f"<b>{exp.title}</b>", styles['Normal']),
                Paragraph(f"<para align=right><b>{date_range}</b></para>", styles['Normal'])
            ]]
            t_head = Table(header_data, colWidths=[350, 180])
            t_head.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            elements.append(t_head)
            
            # Subheader: Company
            elements.append(Paragraph(f"<i>{company_info}</i>", styles['ItemSubHeader']))
            
            # Description
            if exp.description:
                elements.append(Paragraph(exp.description, styles['JustifiedText']))
            
            elements.append(Spacer(1, 10))

    # 4. Education
    if education.count() > 0:
        elements.append(Paragraph("Education", styles['SectionHeader']))
        line_data = [['']]
        t = Table(line_data, colWidths=[530], rowHeights=[1])
        t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e5e7eb'))]))
        elements.append(t)
        elements.append(Spacer(1, 5))
        
        for edu in education:
            header_data = [[
                Paragraph(f"<b>{edu.institution}</b>", styles['Normal']),
                Paragraph(f"<para align=right><b>{edu.year or ''}</b></para>", styles['Normal'])
            ]]
            t_head = Table(header_data, colWidths=[400, 130])
            t_head.setStyle(TableStyle([
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('LEFTPADDING', (0,0), (-1,-1), 0),
                ('RIGHTPADDING', (0,0), (-1,-1), 0),
            ]))
            elements.append(t_head)
            
            # Degree
            degree_text = edu.level
            if edu.level and edu.title: degree_text += f", {edu.title}"
            elif edu.title: degree_text = edu.title
            
            elements.append(Paragraph(degree_text, styles['JustifiedText']))
            elements.append(Spacer(1, 8))

    # 5. Skills
    if skills.count() > 0:
        elements.append(Paragraph("Technical Skills", styles['SectionHeader']))
        line_data = [['']]
        t = Table(line_data, colWidths=[530], rowHeights=[1])
        t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e5e7eb'))]))
        elements.append(t)
        elements.append(Spacer(1, 5))
        
        # Group skills by category if possible, otherwise simple list
        skill_txt = ", ".join([s.skill_name for s in skills])
        elements.append(Paragraph(skill_txt, styles['JustifiedText']))
        elements.append(Spacer(1, 10))

    # 6. Selected Projects (Optional)
    if projects.count() > 0:
        elements.append(Paragraph("Featured Projects", styles['SectionHeader']))
        line_data = [['']]
        t = Table(line_data, colWidths=[530], rowHeights=[1])
        t.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#e5e7eb'))]))
        elements.append(t)
        elements.append(Spacer(1, 5))
        
        for proj in projects:
            # Project Header
            proj_header = f"<b>{proj.title}</b>"
            if proj.category: proj_header += f" | <i>{proj.category}</i>"
            
            elements.append(Paragraph(proj_header, styles['Normal']))
            
            if proj.des:
                elements.append(Paragraph(proj.des, styles['JustifiedText']))
            elements.append(Spacer(1, 6))

    # Build PDF
    doc.build(elements)
    
    # Get the value of the BytesIO buffer and answer
    pdf = buffer.getvalue()
    buffer.close()
    
    # Define filename
    filename = f"Resume_{full_name.replace(' ', '_')}.pdf"
    
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    response.write(pdf)
    
    return response

# To register this view, add it to your urls.py:
# path('download-resume-pdf/', generate_resume_pdf, name='download-resume-pdf'),

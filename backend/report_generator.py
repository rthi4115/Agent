import os
import json
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_pdf_report(dest_path: str, resume_obj, job_match_obj=None, skill_gap_obj=None, career_plan_obj=None):
    """
    Generates a beautifully styled, professional PDF report summarizing
    the multi-agent analysis for CareerPilot AI.
    """
    doc = SimpleDocTemplate(
        dest_path,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom Brand Colors
    primary_color = colors.HexColor("#2563EB")   # Royal Blue
    secondary_color = colors.HexColor("#7C3AED") # Indigo
    text_color = colors.HexColor("#1F2937")      # Dark gray
    accent_color = colors.HexColor("#10B981")    # Success Green
    bg_light = colors.HexColor("#F3F4F6")        # Light gray background
    
    # Custom Styles (avoiding adding existing names)
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        spaceAfter=15
    )
    
    h1_style = ParagraphStyle(
        'DocH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=secondary_color,
        spaceBefore=15,
        spaceAfter=10,
        keepWithNext=True
    )
    
    h2_style = ParagraphStyle(
        'DocH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=14,
        textColor=primary_color,
        spaceBefore=10,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'DocBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=text_color,
        spaceAfter=8
    )

    bullet_style = ParagraphStyle(
        'DocBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    meta_style = ParagraphStyle(
        'DocMeta',
        parent=body_style,
        fontName='Helvetica-Oblique',
        textColor=colors.HexColor("#6B7280"),
        fontSize=9
    )

    story = []
    
    # Header Band / Title
    story.append(Paragraph("CareerPilot AI Coach", title_style))
    story.append(Paragraph(f"Comprehensive Multi-Agent Career Analysis & Roadmap Report", ParagraphStyle('Sub', parent=body_style, fontName='Helvetica-Bold', fontSize=12, textColor=colors.HexColor("#4B5563"))))
    story.append(Spacer(1, 10))
    story.append(Paragraph(f"Report Generated: {resume_obj.created_at.strftime('%Y-%m-%d %H:%M:%S') if resume_obj.created_at else 'Present'}", meta_style))
    story.append(Spacer(1, 15))
    
    # Resume Analysis Summary Page
    story.append(Paragraph("1. Resume Analysis & ATS Score", h1_style))
    
    # Score Widget Layout (using Table)
    score_pct = resume_obj.ats_score
    score_color = accent_color if score_pct >= 80 else (colors.HexColor("#F59E0B") if score_pct >= 50 else colors.HexColor("#EF4444"))
    
    score_data = [
        [
            Paragraph(f"<b>Overall ATS Score:</b> <font color='{score_color.hexval()}'>{score_pct}/100</font>", ParagraphStyle('Score', parent=body_style, fontSize=12, leading=16)),
            Paragraph(f"<b>Filename:</b> {resume_obj.filename}", body_style)
        ]
    ]
    score_table = Table(score_data, colWidths=[200, 320])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), bg_light),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
    ]))
    story.append(score_table)
    story.append(Spacer(1, 12))
    
    story.append(Paragraph("<b>Resume Executive Summary</b>", h2_style))
    story.append(Paragraph(resume_obj.summary or "No summary available.", body_style))
    
    # Missing sections
    if resume_obj.missing_sections:
        try:
            missing = json.loads(resume_obj.missing_sections)
            if missing:
                story.append(Paragraph("<b>Missing Elements / Suggested Sections to Add</b>", h2_style))
                for item in missing:
                    story.append(Paragraph(f"• {item}", bullet_style))
                story.append(Spacer(1, 10))
        except Exception:
            pass
            
    # Suggested improvements
    if resume_obj.suggested_improvements:
        try:
            improvs = json.loads(resume_obj.suggested_improvements)
            if improvs:
                story.append(Paragraph("<b>ATS & Readability Improvements</b>", h2_style))
                table_data = [[Paragraph("<b>Section</b>", body_style), Paragraph("<b>Issue Detected</b>", body_style), Paragraph("<b>Actionable Suggestion</b>", body_style)]]
                for imp in improvs:
                    sec = imp.get("section", "General") if isinstance(imp, dict) else "General"
                    iss = imp.get("issue", "") if isinstance(imp, dict) else str(imp)
                    sug = imp.get("suggestion", "") if isinstance(imp, dict) else ""
                    table_data.append([
                        Paragraph(f"<b>{sec}</b>", body_style),
                        Paragraph(iss, body_style),
                        Paragraph(sug, body_style)
                    ])
                imp_table = Table(table_data, colWidths=[110, 190, 220])
                imp_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#E5E7EB")),
                    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
                    ('VALIGN', (0,0), (-1,-1), 'TOP'),
                    ('PADDING', (0,0), (-1,-1), 6),
                ]))
                story.append(imp_table)
                story.append(Spacer(1, 15))
        except Exception:
            pass

    # Job Match Section
    if job_match_obj:
        story.append(PageBreak())
        story.append(Paragraph("2. Job Match Analysis", h1_style))
        
        match_data = [
            [
                Paragraph(f"<b>Target Position:</b> {job_match_obj.job_title or 'Target Role'}", body_style),
                Paragraph(f"<b>Job Match Score:</b> <font color='{accent_color.hexval()}'><b>{job_match_obj.match_percentage}%</b></font>", ParagraphStyle('Match', parent=body_style, fontSize=11))
            ]
        ]
        match_table = Table(match_data, colWidths=[260, 260])
        match_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), bg_light),
            ('PADDING', (0,0), (-1,-1), 8),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#E5E7EB")),
        ]))
        story.append(match_table)
        story.append(Spacer(1, 10))
        
        # Matched and missing skills
        try:
            m_skills = json.loads(job_match_obj.matched_skills) if job_match_obj.matched_skills else []
            miss_skills = json.loads(job_match_obj.missing_skills) if job_match_obj.missing_skills else []
            miss_kw = json.loads(job_match_obj.missing_keywords) if job_match_obj.missing_keywords else []
            
            story.append(Paragraph(f"<b>Skills Comparison:</b>", h2_style))
            skills_data = [
                [Paragraph("<b>Matched Skills</b>", body_style), Paragraph("<b>Missing Skills</b>", body_style)],
                [
                    Paragraph(", ".join(m_skills) if m_skills else "None aligned", body_style), 
                    Paragraph(", ".join(miss_skills) if miss_skills else "None missing", body_style)
                ]
            ]
            skills_table = Table(skills_data, colWidths=[260, 260])
            skills_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (0,0), colors.HexColor("#D1FAE5")), # light green
                ('BACKGROUND', (1,0), (1,0), colors.HexColor("#FEE2E2")), # light red
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#D1D5DB")),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('PADDING', (0,0), (-1,-1), 8),
            ]))
            story.append(skills_table)
            story.append(Spacer(1, 10))
            
            if miss_kw:
                story.append(Paragraph(f"<b>Missing Essential Keywords for ATS Filters:</b>", body_style))
                story.append(Paragraph(", ".join(miss_kw), ParagraphStyle('KW', parent=bullet_style, fontName='Helvetica-Bold', textColor=colors.HexColor("#B91C1C"))))
                story.append(Spacer(1, 10))

            if job_match_obj.suggestions:
                sugs = json.loads(job_match_obj.suggestions)
                if sugs:
                    story.append(Paragraph("<b>Resume Tailoring Suggestions</b>", h2_style))
                    for sug in sugs:
                        story.append(Paragraph(f"• {sug}", bullet_style))
        except Exception:
            pass

    # Skill Roadmap Section
    if skill_gap_obj:
        story.append(PageBreak())
        story.append(Paragraph("3. Learning Roadmap & Upskilling Plan", h1_style))
        try:
            roadmap = json.loads(skill_gap_obj.roadmap_json)
            
            for level in ['beginner', 'intermediate', 'advanced']:
                items = roadmap.get(level, [])
                if items:
                    story.append(Paragraph(f"<b>{level.capitalize()} Milestone</b>", h2_style))
                    for it in items:
                        topic = it.get("topic", "Technology Topic")
                        courses = it.get("courses", [])
                        docs = it.get("documentation", [])
                        practice = it.get("practice_ideas", [])
                        
                        story.append(Paragraph(f"<b>Topic: {topic}</b>", ParagraphStyle('TopHeader', parent=body_style, fontName='Helvetica-Bold', textColor=secondary_color)))
                        
                        if courses:
                            story.append(Paragraph(f"<i>Recommended Courses:</i> {', '.join(courses)}", bullet_style))
                        if docs:
                            story.append(Paragraph(f"<i>Documentation:</i> {', '.join(docs)}", bullet_style))
                        if practice:
                            story.append(Paragraph(f"<i>Practice:</i> {', '.join(practice)}", bullet_style))
                        story.append(Spacer(1, 6))
        except Exception:
            pass

    # Career Planner Section
    if career_plan_obj:
        story.append(Spacer(1, 15))
        story.append(Paragraph("4. Career Coach 30-90-180 Day Action Plan", h1_style))
        try:
            cplan = json.loads(career_plan_obj.plan_json)
            
            p30 = cplan.get("thirty_day_plan", [])
            p90 = cplan.get("ninety_day_plan", [])
            p180 = cplan.get("six_month_roadmap", [])
            
            if p30:
                story.append(Paragraph("<b>First 30 Days (Fundamentals & Baseline alignment)</b>", h2_style))
                for item in p30:
                    story.append(Paragraph(f"• {item}", bullet_style))
                story.append(Spacer(1, 8))
                
            if p90:
                story.append(Paragraph("<b>Days 31-90 (Portfolio projects & Profile Optimization)</b>", h2_style))
                for item in p90:
                    story.append(Paragraph(f"• {item}", bullet_style))
                story.append(Spacer(1, 8))
                
            if p180:
                story.append(Paragraph("<b>Months 3-6 (Job Applications, Networking & Technical Mocks)</b>", h2_style))
                for item in p180:
                    story.append(Paragraph(f"• {item}", bullet_style))
        except Exception:
            pass

    doc.build(story)

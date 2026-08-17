import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY

def build_resume_pdf(output_path):
    # Standard margins: 0.45 in (approx 32.4 pt)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=32,
        bottomMargin=28
    )

    styles = getSampleStyleSheet()

    # Custom styles
    name_style = ParagraphStyle(
        'ResumeName',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=20,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#111111')
    )

    contact_style = ParagraphStyle(
        'ResumeContact',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#222222')
    )

    section_heading_style = ParagraphStyle(
        'ResumeSection',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=12,
        spaceBefore=7,
        spaceAfter=3,
        textColor=colors.HexColor('#111111')
    )

    body_style = ParagraphStyle(
        'ResumeBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.2,
        alignment=TA_JUSTIFY,
        textColor=colors.HexColor('#222222')
    )

    project_title_style = ParagraphStyle(
        'ProjectTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=11.5,
        textColor=colors.HexColor('#111111')
    )

    project_tech_style = ParagraphStyle(
        'ProjectTech',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#333333')
    )

    bullet_style = ParagraphStyle(
        'ResumeBullet',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.3,
        leading=10.8,
        textColor=colors.HexColor('#222222'),
        leftIndent=12,
        firstLineIndent=-8,
        spaceAfter=2
    )

    edu_title_style = ParagraphStyle(
        'EduTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=11.5,
        textColor=colors.HexColor('#111111')
    )

    edu_school_style = ParagraphStyle(
        'EduSchool',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.8,
        leading=11.5,
        textColor=colors.HexColor('#222222')
    )

    edu_year_style = ParagraphStyle(
        'EduYear',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.8,
        leading=11.5,
        alignment=TA_LEFT,
        textColor=colors.HexColor('#222222')
    )

    def hr():
        # A horizontal line across the page
        t = Table([['']], colWidths=[540], rowHeights=[1])
        t.setStyle(TableStyle([
            ('LINEABOVE', (0,0), (-1,-1), 1, colors.HexColor('#111111')),
            ('TOPPADDING', (0,0), (-1,-1), 0),
            ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ]))
        return t

    story = []

    # 1. Header
    story.append(Paragraph("KUNAL TAMULI", name_style))
    story.append(Spacer(1, 2))
    
    contact_text = (
        "Bengaluru, Karnataka, India &nbsp;|&nbsp; +91-6900186472 &nbsp;|&nbsp; "
        "<font color='#004499'>thekunal0010@gmail.com</font> &nbsp;|&nbsp; "
        "<font color='#004499'>linkedin.com/in/thekunal0010</font> &nbsp;|&nbsp; "
        "<font color='#004499'>github.com/thekunal0010</font>"
    )
    story.append(Paragraph(contact_text, contact_style))
    story.append(Spacer(1, 4))

    # 2. Summary
    story.append(Paragraph("SUMMARY", section_heading_style))
    story.append(hr())
    story.append(Spacer(1, 3))
    summary_text = (
        "MCA candidate (2027) with hands-on experience building full-stack web applications and machine learning "
        "solutions using React, Next.js, Node.js, Python, Flask, and SQL/NoSQL databases. Experienced in designing REST APIs, "
        "implementing authentication and role-based access, integrating databases, and preprocessing data for ML workflows — "
        "with a track record of shipping complete, working applications rather than isolated exercises."
    )
    story.append(Paragraph(summary_text, body_style))
    story.append(Spacer(1, 4))

    # 3. Technical Skills
    story.append(Paragraph("TECHNICAL SKILLS", section_heading_style))
    story.append(hr())
    story.append(Spacer(1, 3))

    skills_data = [
        [Paragraph("<b>Languages:</b>", body_style), Paragraph("Java, Python, JavaScript, TypeScript, HTML, CSS", body_style)],
        [Paragraph("<b>Frontend:</b>", body_style), Paragraph("React.js, Next.js, Vite, Tailwind CSS", body_style)],
        [Paragraph("<b>Backend:</b>", body_style), Paragraph("Node.js, Express.js, Flask, Prisma ORM, REST APIs", body_style)],
        [Paragraph("<b>Databases:</b>", body_style), Paragraph("MongoDB, PostgreSQL, MySQL, SQLite, Oracle", body_style)],
        [Paragraph("<b>Machine Learning / Data:</b>", body_style), Paragraph("Pandas, NumPy, Scikit-learn, Matplotlib, Data Preprocessing, Feature Engineering, Classification, Regression, Clustering, Model Evaluation", body_style)],
        [Paragraph("<b>Cloud &amp; Tools:</b>", body_style), Paragraph("Git, GitHub, VS Code, AWS, Vercel, Jupyter Notebook", body_style)],
    ]
    skills_table = Table(skills_data, colWidths=[140, 400])
    skills_table.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 4))

    # 4. Projects
    story.append(Paragraph("PROJECTS", section_heading_style))
    story.append(hr())
    story.append(Spacer(1, 3))

    # Project 1
    p1_header = Paragraph("<b>Real Estate Management System</b> <font color='#444444' size='8'>| <i>Next.js 16, React 19, TypeScript, Prisma, SQLite, JWT</i></font>", project_title_style)
    story.append(p1_header)
    story.append(Spacer(1, 1))
    story.append(Paragraph("• Developed a full-stack real estate platform with role-based access for Customer and Lister users, built with Next.js 16, React 19, and TypeScript.", bullet_style))
    story.append(Paragraph("• Implemented listing management for listers (create, update, delete, image upload) and browsing/search for customers, with filters by city, property type, price range, bedrooms, and lister, plus a favorites feature.", bullet_style))
    story.append(Paragraph("• Engineered JWT-based authentication with HTTP-only cookies, bcryptjs password hashing, and a session/current-user endpoint to enforce role-based access control.", bullet_style))
    story.append(Paragraph("• Modeled the data layer with Prisma ORM over SQLite and built REST API routes to handle listings, favorites, and authentication.", bullet_style))
    story.append(Spacer(1, 3))

    # Project 2
    p2_header = Paragraph("<b>Event Management System (MERN Stack)</b> <font color='#444444' size='8'>| <i>React, Node.js, Express.js, MongoDB</i></font>", project_title_style)
    story.append(p2_header)
    story.append(Spacer(1, 1))
    story.append(Paragraph("• Developed a full-stack event management platform enabling users to discover, join, and track events through a personalized dashboard.", bullet_style))
    story.append(Paragraph("• Engineered RESTful backend services with Node.js and Express, and designed MongoDB schemas to support CRUD operations on event and user data.", bullet_style))
    story.append(Paragraph("• Implemented authentication and event-history tracking, integrating frontend and backend for a seamless user experience.", bullet_style))
    story.append(Spacer(1, 3))

    # Project 3
    p3_header = Paragraph("<b>NoteTube – Video Notes &amp; Summarization Platform</b> <font color='#444444' size='8'>| <i>React, Flask, MongoDB, JWT, bcrypt, REST API</i></font>", project_title_style)
    story.append(p3_header)
    story.append(Spacer(1, 1))
    story.append(Paragraph("• Built a full-stack web application that retrieves video transcripts and generates automated notes/summaries, using React for the frontend and a Flask/Python backend.", bullet_style))
    story.append(Paragraph("• Designed REST API endpoints connecting the frontend to backend services for transcript retrieval and note generation, and implemented JWT/bcrypt-based user authentication.", bullet_style))
    story.append(Paragraph("• Integrated MongoDB for persistent storage of user and application data, and configured environment variables for a modular, maintainable architecture.", bullet_style))
    story.append(Spacer(1, 3))

    # Project 4
    p4_header = Paragraph("<b>Decoding Academic Success – Sleep Pattern Research</b> <font color='#444444' size='8'>| <i>Python, Pandas, Scikit-learn, Matplotlib</i></font>", project_title_style)
    story.append(p4_header)
    story.append(Spacer(1, 1))
    story.append(Paragraph("• Conducted an academic research project analyzing student survey data to study the relationship between sleep patterns and academic performance.", bullet_style))
    story.append(Paragraph("• Performed data cleaning, preprocessing, exploratory data analysis, and feature engineering, then applied machine learning models with feature-importance analysis and evaluation.", bullet_style))
    story.append(Paragraph("• Visualized findings using Matplotlib to communicate key patterns and support the analysis conclusions.", bullet_style))
    story.append(Spacer(1, 4))

    # 5. Education
    story.append(Paragraph("EDUCATION", section_heading_style))
    story.append(hr())
    story.append(Spacer(1, 3))

    edu_data = [
        [
            Paragraph("<b>Master of Computer Applications (MCA)</b> &mdash; Jain University, Bengaluru", edu_school_style),
            Paragraph("2025 &ndash; 2027", edu_year_style)
        ],
        [
            Paragraph("<b>Bachelor of Computer Applications (BCA)</b> &mdash; Presidency College, Bengaluru", edu_school_style),
            Paragraph("2022 &ndash; 2025", edu_year_style)
        ]
    ]
    edu_table = Table(edu_data, colWidths=[450, 90])
    edu_table.setStyle(TableStyle([
        ('TOPPADDING', (0,0), (-1,-1), 1.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1.5),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('ALIGN', (1,0), (1,-1), 'RIGHT'),
    ]))
    story.append(edu_table)

    doc.build(story)
    print("Successfully built resume PDF at:", output_path)

if __name__ == '__main__':
    out_file = os.path.join(os.path.dirname(__file__), 'assets', 'kunal_tamuli_resume.pdf')
    build_resume_pdf(out_file)

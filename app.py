from flask import Flask, render_template, request, jsonify

import anthropic
import json
from dotenv import load_dotenv
import os
load_dotenv()

app = Flask(__name__)
#client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
api_key = os.getenv("ANTHROPIC_API_KEY")

if api_key:
    client = anthropic.Anthropic(api_key=api_key)
else:
    client = None


# ── helpers ──────────────────────────────────────────────────────────────────

def build_resume_prompt(data: dict) -> str:
    return f"""You are a professional resume writer. Generate a polished, ATS-friendly resume 
based on the student data below. Format it clearly with proper sections.

Student Data:
- Name: {data.get('name', '')}
- Email: {data.get('email', '')}
- Phone: {data.get('phone', '')}
- Location: {data.get('location', '')}
- Target Role: {data.get('target_role', '')}
- Education: {data.get('education', '')}
- Skills: {data.get('skills', '')}
- Projects: {data.get('projects', '')}
- Experience: {data.get('experience', '')}
- Achievements: {data.get('achievements', '')}
- LinkedIn: {data.get('linkedin', '')}
- GitHub: {data.get('github', '')}

Generate a complete, professional resume. Use clear section headers like:
CONTACT INFORMATION, OBJECTIVE, EDUCATION, SKILLS, PROJECTS, EXPERIENCE, ACHIEVEMENTS
Make it specific to the target role. Use strong action verbs. Keep it concise and impactful."""


def build_cover_letter_prompt(data: dict) -> str:
    return f"""You are an expert cover letter writer. Write a compelling, personalized cover letter
for a student applying for: {data.get('target_role', 'a job/internship')}

Student Info:
- Name: {data.get('name', '')}
- Education: {data.get('education', '')}
- Skills: {data.get('skills', '')}
- Projects: {data.get('projects', '')}
- Experience: {data.get('experience', '')}
- Achievements: {data.get('achievements', '')}

Write a 3-paragraph cover letter:
1. Opening: Express enthusiasm and mention the role
2. Middle: Highlight 2-3 key strengths with specific examples from their background
3. Closing: Call to action

Make it warm, confident, and specific. Avoid generic phrases."""


def build_portfolio_prompt(data: dict) -> str:
    return f"""You are a portfolio content strategist. Create a compelling portfolio summary 
for a student's personal website/portfolio.

Student Info:
- Name: {data.get('name', '')}
- Target Role: {data.get('target_role', '')}
- Education: {data.get('education', '')}
- Skills: {data.get('skills', '')}
- Projects: {data.get('projects', '')}
- Achievements: {data.get('achievements', '')}
- GitHub: {data.get('github', '')}
- LinkedIn: {data.get('linkedin', '')}

Generate:
1. **Hero Tagline** - A punchy 1-line personal brand statement
2. **About Me** - 3-4 sentences that are personal, specific, and compelling
3. **Skills Showcase** - Categorized skills with proficiency descriptions
4. **Project Highlights** - Each project with: title, description, tech stack, impact
5. **Call to Action** - A closing statement inviting collaboration

Make it stand out. Be specific, not generic."""

# ── routes ───────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.get_json()
        doc_type = data.get('type', 'resume')

        if doc_type == 'resume':
            prompt = build_resume_prompt(data)
        elif doc_type == 'cover_letter':
            prompt = build_cover_letter_prompt(data)
        elif doc_type == 'portfolio':
            prompt = build_portfolio_prompt(data)
        else:
            return jsonify({'error': 'Invalid type'}), 400
        
        if client is None:
            return jsonify({
                'success': False,
                'error': 'Demo Mode: Anthropic API key not configured.'
            })

        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=1500,
            messages=[{"role": "user", "content": prompt}]
        )

        result = message.content[0].text
        return jsonify({'success': True, 'content': result})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/improve', methods=['POST'])
def improve():
    """AI tips to improve the generated document."""
    if client is None:
        return jsonify({
            'success': False,
            'error': 'Demo Mode: Anthropic API key not configured.'
        })
    try:
        data = request.get_json()
        content = data.get('content', '')
        doc_type = data.get('type', 'resume')

        prompt = f"""Review this {doc_type} and give 5 specific, actionable improvement tips.
Be direct and practical. Format as a numbered list.

{doc_type.upper()}:
{content}"""

        message = client.messages.create(
            model="claude-opus-4-6",
            max_tokens=600,
            messages=[{"role": "user", "content": prompt}]
        )

        return jsonify({'success': True, 'tips': message.content[0].text})

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)

import { useState } from 'react'
import { Sparkles, Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GoogleGenerativeAI } from '@google/generative-ai'
import ResumePreview from '../components/ResumePreview'
import styles from './BuilderPage.module.css'

export interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  experience: { company: string; role: string; duration: string; description: string }[];
  education: { school: string; degree: string; year: string }[];
  skills: string;
}

export default function BuilderPage() {
  const navigate = useNavigate()
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '')
  const [isGenerating, setIsGenerating] = useState(false)
  const [template, setTemplate] = useState('modern')
  
  const [data, setData] = useState<ResumeData>({
    personal: { name: 'John Doe', title: 'Software Engineer', email: 'john@example.com', phone: '(555) 123-4567', location: 'New York, NY', summary: 'Passionate developer.' },
    experience: [{ company: 'Tech Corp', role: 'Frontend Developer', duration: '2021 - Present', description: 'Developed React applications.' }],
    education: [{ school: 'University of Tech', degree: 'BS Computer Science', year: '2020' }],
    skills: 'React, TypeScript, CSS, Node.js'
  })

  const handleChange = (section: keyof ResumeData, field: string, value: string, index?: number) => {
    setData(prev => {
      if (Array.isArray(prev[section]) && index !== undefined) {
        const newArr = [...(prev[section] as any[])]
        newArr[index] = { ...newArr[index], [field]: value }
        return { ...prev, [section]: newArr }
      }
      return {
        ...prev,
        [section]: section === 'skills' ? value : { ...(prev[section] as any), [field]: value }
      }
    })
  }

  const handleAIEnhance = async () => {
    if (!apiKey) {
      alert("Please enter a Gemini API Key first.")
      return
    }
    
    setIsGenerating(true)
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `
        Act as an expert resume writer. I am giving you raw resume data.
        Please enhance the summary and experience descriptions to be professional, impactful, and results-driven.
        Format the output as a JSON object with this EXACT structure (no markdown tags, just valid JSON):
        {
          "summary": "...",
          "experience": [
            { "description": "..." }
          ]
        }
        
        Raw Data:
        Summary: ${data.personal.summary}
        Experiences: ${JSON.stringify(data.experience)}
      `

      const result = await model.generateContent(prompt)
      let text = result.response.text()
      // Clean markdown formatting if present
      text = text.replace(/```json/g, '').replace(/```/g, '').trim()
      
      const enhanced = JSON.parse(text)
      
      setData(prev => {
        const newExp = prev.experience.map((exp, i) => ({
          ...exp,
          description: enhanced.experience[i]?.description || exp.description
        }))
        
        return {
          ...prev,
          personal: { ...prev.personal, summary: enhanced.summary || prev.personal.summary },
          experience: newExp
        }
      })
    } catch (error) {
      console.error(error)
      alert("Error generating content. Check your API key or see console.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className={styles.container}>
      <header className={`${styles.header} glass`}>
        <div className={styles.brand} onClick={() => navigate('/')}>
          <Sparkles className={styles.icon} /> ResumeAI Builder
        </div>
        <div className={styles.controls}>
          <select value={template} onChange={e => setTemplate(e.target.value)} className={styles.templateSelect}>
            <option value="classic">Classic</option>
            <option value="modern">Modern</option>
            <option value="corporate">Corporate</option>
            <option value="creative">Creative</option>
            <option value="minimal">Minimal</option>
            <option value="student">Student</option>
            <option value="dark">Dark Theme</option>
            <option value="hybrid">Hybrid Flex</option>
          </select>
          <input 
            type="password" 
            placeholder="Gemini API Key" 
            value={apiKey} 
            onChange={e => setApiKey(e.target.value)}
            className={styles.apiInput}
          />
          <button className="btn-primary" onClick={handleAIEnhance} disabled={isGenerating}>
            <Sparkles size={16} /> {isGenerating ? 'Enhancing...' : 'Enhance with AI'}
          </button>
          <button className="btn-secondary" onClick={handlePrint}>
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <div className={styles.editor}>
          <section className={styles.section}>
            <h2>Personal Info</h2>
            <input placeholder="Full Name" value={data.personal.name} onChange={e => handleChange('personal', 'name', e.target.value)} />
            <input placeholder="Job Title" value={data.personal.title} onChange={e => handleChange('personal', 'title', e.target.value)} />
            <input placeholder="Email" value={data.personal.email} onChange={e => handleChange('personal', 'email', e.target.value)} />
            <input placeholder="Phone" value={data.personal.phone} onChange={e => handleChange('personal', 'phone', e.target.value)} />
            <input placeholder="Location" value={data.personal.location} onChange={e => handleChange('personal', 'location', e.target.value)} />
            <textarea placeholder="Professional Summary" value={data.personal.summary} onChange={e => handleChange('personal', 'summary', e.target.value)} rows={4} />
          </section>

          <section className={styles.section}>
            <h2>Experience</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className={styles.card}>
                <input placeholder="Company" value={exp.company} onChange={e => handleChange('experience', 'company', e.target.value, i)} />
                <input placeholder="Role" value={exp.role} onChange={e => handleChange('experience', 'role', e.target.value, i)} />
                <input placeholder="Duration (e.g. 2021-2023)" value={exp.duration} onChange={e => handleChange('experience', 'duration', e.target.value, i)} />
                <textarea placeholder="Description" value={exp.description} onChange={e => handleChange('experience', 'description', e.target.value, i)} rows={3} />
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Education</h2>
            {data.education.map((edu, i) => (
              <div key={i} className={styles.card}>
                <input placeholder="School" value={edu.school} onChange={e => handleChange('education', 'school', e.target.value, i)} />
                <input placeholder="Degree" value={edu.degree} onChange={e => handleChange('education', 'degree', e.target.value, i)} />
                <input placeholder="Year" value={edu.year} onChange={e => handleChange('education', 'year', e.target.value, i)} />
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Skills</h2>
            <textarea placeholder="Comma separated skills" value={data.skills} onChange={e => handleChange('skills', '', e.target.value)} rows={3} />
          </section>
        </div>

        <div className={styles.previewWrapper}>
          <ResumePreview data={data} template={template} />
        </div>
      </div>
    </div>
  )
}

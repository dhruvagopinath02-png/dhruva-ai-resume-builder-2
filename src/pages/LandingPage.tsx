import { useNavigate } from 'react-router-dom'
import { Sparkles, FileText, Layout, Zap } from 'lucide-react'
import { signInWithGoogle } from '../firebase'
import styles from './LandingPage.module.css'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      await signInWithGoogle()
      navigate('/builder')
    } catch(err) {
      alert("Error signing in. Please check your Firebase configuration.")
    }
  }

  return (
    <div className={styles.container}>
      <nav className={`${styles.nav} glass`}>
        <div className={styles.logo}>
          <Sparkles className={styles.logoIcon} />
          <span>ResumeAI</span>
        </div>
        <button onClick={handleLogin} className="btn-primary">
          Sign in with Google
        </button>
      </nav>

      <main className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>✨ Internship Project</div>
          <h1 className={styles.title}>
            Craft Your Perfect Resume with <span className={styles.gradient}>AI Power</span>
          </h1>
          <p className={styles.subtitle}>
            Enter your details, and let our advanced AI engine write a polished, professional resume in seconds. Choose from 8 premium templates.
          </p>
          
          <div className={styles.actions}>
            <button onClick={handleLogin} className={`btn-primary ${styles.ctaBtn}`}>
              Get Started for Free
            </button>
            <button className={`btn-secondary ${styles.ctaBtn}`}>
              View Templates
            </button>
          </div>
        </div>

        <div className={styles.features}>
          <div className={styles.featureCard}>
            <Zap className={styles.featureIcon} />
            <h3>AI-Generated Content</h3>
            <p>Gemini AI refines your experience into impactful, results-driven bullet points.</p>
          </div>
          <div className={styles.featureCard}>
            <Layout className={styles.featureIcon} />
            <h3>8 Premium Templates</h3>
            <p>From Classic to Hybrid Flex, find the perfect design for your career path.</p>
          </div>
          <div className={styles.featureCard}>
            <FileText className={styles.featureIcon} />
            <h3>Instant PDF Export</h3>
            <p>Download a high-quality PDF ready for Applicant Tracking Systems (ATS).</p>
          </div>
        </div>
      </main>
    </div>
  )
}

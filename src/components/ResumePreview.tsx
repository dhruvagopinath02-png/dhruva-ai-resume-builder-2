import React from 'react'
import { ResumeData } from '../pages/BuilderPage'
import styles from './ResumePreview.module.css'

interface Props {
  data: ResumeData;
  template: string;
}

export default function ResumePreview({ data, template }: Props) {
  // We use bracket notation to get the specific template class from CSS modules
  const templateClass = styles[`template-${template}`] || styles['template-modern']

  return (
    <div className={`${styles.resumePaper} ${templateClass}`}>
      <header className={styles.rHeader}>
        <h1 className={styles.rName}>{data.personal.name}</h1>
        <h2 className={styles.rTitle}>{data.personal.title}</h2>
        <div className={styles.rContact}>
          <span>{data.personal.email}</span>
          {data.personal.phone && <span> &bull; {data.personal.phone}</span>}
          {data.personal.location && <span> &bull; {data.personal.location}</span>}
        </div>
        {data.personal.summary && (
          <p className={styles.rSummary}>{data.personal.summary}</p>
        )}
      </header>

      <div className={styles.rBody}>
        {data.experience.length > 0 && data.experience[0].company && (
          <section className={styles.rSection}>
            <h3 className={styles.rHeading}>Experience</h3>
            <div className={styles.rItems}>
              {data.experience.map((exp, i) => (
                <div key={i} className={styles.rItem}>
                  <div className={styles.rItemHeader}>
                    <span className={styles.rItemTitle}>{exp.role}</span>
                    <span className={styles.rItemDate}>{exp.duration}</span>
                  </div>
                  <div className={styles.rItemSub}>{exp.company}</div>
                  <p className={styles.rItemDesc}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.education.length > 0 && data.education[0].school && (
          <section className={styles.rSection}>
            <h3 className={styles.rHeading}>Education</h3>
            <div className={styles.rItems}>
              {data.education.map((edu, i) => (
                <div key={i} className={styles.rItem}>
                  <div className={styles.rItemHeader}>
                    <span className={styles.rItemTitle}>{edu.degree}</span>
                    <span className={styles.rItemDate}>{edu.year}</span>
                  </div>
                  <div className={styles.rItemSub}>{edu.school}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.skills && (
          <section className={`${styles.rSection} ${styles.rSkillsSection}`}>
            <h3 className={styles.rHeading}>Skills</h3>
            <p className={styles.rSkills}>{data.skills}</p>
          </section>
        )}
      </div>
    </div>
  )
}

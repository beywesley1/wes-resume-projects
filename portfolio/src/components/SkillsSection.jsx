import React from 'react';

function SkillsSection({ skillsWithProgress }) {
  return (
    <>
      {/* Skills Section with Progress Bars */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Expertise</p>
            <h2 className="section-title">Skills & Proficiency</h2>
          </div>

          <div className="skills-progress-grid">
            <div className="skill-progress-category">
              <h3>
                <span>☁️</span> Cloud Platforms
              </h3>
              {skillsWithProgress.cloud.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="skill-progress-category">
              <h3>
                <span>🏗️</span> Infrastructure as Code
              </h3>
              {skillsWithProgress.iac.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="skill-progress-category">
              <h3>
                <span>⚙️</span> Automation
              </h3>
              {skillsWithProgress.automation.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="skill-progress-category">
              <h3>
                <span>🖥️</span> Platforms
              </h3>
              {skillsWithProgress.platforms.map((skill, i) => (
                <div key={i} className="skill-progress-item">
                  <div className="skill-progress-header">
                    <span className="skill-progress-name">{skill.name}</span>
                    <span className="skill-progress-percent">{skill.level}%</span>
                  </div>
                  <div className="skill-progress-bar">
                    <div className="skill-progress-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default SkillsSection;

import React from 'react';

function CareerTimelineSection({ career, expandedCareerItems, setExpandedCareerItems }) {
  return (
    <>
      {/* Career Timeline Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Experience</p>
            <h2 className="section-title">Career Timeline</h2>
          </div>

          <div className="career-timeline">
            {career.map((job, i) => {
              const isExpanded = expandedCareerItems.includes(i);
              return (
                <div key={i} className="career-item">
                  <div className="career-marker">{job.icon}</div>
                  <div className="career-card">
                    {/* Clickable Header - Always Visible */}
                    <div
                      className="career-header-clickable"
                      onClick={() => {
                        setExpandedCareerItems((prev) =>
                          prev.includes(i) ? prev.filter((item) => item !== i) : [...prev, i]
                        );
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="career-header">
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                          <span
                            className="career-expand-arrow"
                            style={{
                              fontSize: '16px',
                              color: 'var(--accent-cyan)',
                              transition: 'transform 0.3s ease',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              marginTop: '4px',
                              flexShrink: 0,
                              animation: !isExpanded ? 'rgb-cycle 8s ease-in-out infinite' : 'none',
                            }}
                          >
                            ▶
                          </span>
                          <div style={{ flex: 1 }}>
                            <h3 className="career-title">{job.title}</h3>
                            <div className="career-company">{job.company}</div>
                            <div className="career-meta">
                              <span>📍 {job.location}</span>
                              <span>📅 {job.period}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {job.technologies && job.technologies.length > 0 && (
                        <div className="career-technologies">
                          {job.technologies.map((tech, k) => (
                            <span key={k} className="career-tech-tag">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Collapsible Details */}
                    <div
                      style={{
                        maxHeight: isExpanded ? '1000px' : '0',
                        overflow: 'hidden',
                        transition: 'max-height 0.4s ease-in-out',
                        opacity: isExpanded ? 1 : 0,
                      }}
                    >
                      <ul className="career-highlights" style={{ marginTop: '16px' }}>
                        {job.highlights.map((highlight, j) => (
                          <li key={j}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default CareerTimelineSection;

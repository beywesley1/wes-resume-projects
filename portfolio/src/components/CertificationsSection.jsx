import React from 'react';

function CertificationsSection({ CONFIG }) {
  return (
    <>
      {/* Certifications Section - Credly Badges */}
      <section className="section" style={{ paddingTop: '40px', paddingBottom: '40px' }}>
        <div className="container">
          <div className="section-header">
            <p className="section-label">// Verified Credentials</p>
            <h2 className="section-title">Certifications</h2>
          </div>

          {/* Certification Badge Cards with Local Images */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', justifyContent: 'center' }}>
            {[
              { name: 'AWS Solutions Architect Professional', img: '/badges/aws-certified-solutions-architect-professional.png' },
              { name: 'AWS SysOps Administrator Associate', img: '/badges/aws-certified-sysops-administrator-associate.png' },
              { name: 'AWS Solutions Architect Associate', img: '/badges/aws-certified-solutions-architect-associate.png' },
              { name: 'CompTIA Security+', img: '/badges/comptia-security-ce-certification.png' },
              { name: 'HashiCorp Terraform Associate', img: '/badges/hashicorp-certified-terraform-associate-002.png' },
            ].map((cert, index) => (
              <a
                key={index}
                href={`https://www.credly.com/users/${CONFIG.credlyUsername}/badges`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textDecoration: 'none',
                  padding: '20px',
                  background: 'var(--bg-card)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  transition: 'all 0.3s ease',
                  width: '160px',
                }}
                className="certification-badge"
              >
                <img
                  src={cert.img}
                  alt={cert.name}
                  style={{ width: '120px', height: '120px', objectFit: 'contain' }}
                />
                <span
                  style={{
                    marginTop: '12px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    lineHeight: '1.4',
                  }}
                >
                  {cert.name}
                </span>
              </a>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <a
              href={`https://www.credly.com/users/${CONFIG.credlyUsername}/badges`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'transparent',
                color: 'var(--accent-blue)',
                borderRadius: '8px',
                border: '1px solid var(--accent-blue)',
                textDecoration: 'none',
                fontWeight: '500',
                transition: 'all 0.3s ease',
              }}
            >
              <span>Verify on Credly</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default CertificationsSection;

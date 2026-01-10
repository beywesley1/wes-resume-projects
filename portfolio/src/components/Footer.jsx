import React from 'react';

function Footer({ IS_AZURE }) {
  return (
    <>
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-tech">
            <span className="footer-item">
              Built with React
              <span className="footer-icon footer-icon-react" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="12" rx="9" ry="3.9" />
                    <ellipse cx="12" cy="12" rx="3.9" ry="9" transform="rotate(60 12 12)" />
                    <ellipse cx="12" cy="12" rx="3.9" ry="9" transform="rotate(120 12 12)" />
                  </g>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                </svg>
              </span>
            </span>
            <span className="footer-separator">•</span>
            <span className="footer-item">
              Deployed with Terraform
              <span className="footer-icon footer-icon-terraform" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.44 0v7.575l6.56 3.787V3.787zm7.308 4.225v7.575l6.56 3.787V7.97zm7.29 3.745v7.574l6.56-3.787V3.787zM8.748 12.82v7.575l6.56 3.787v-7.575z" />
                </svg>
              </span>
            </span>
            <span className="footer-separator">•</span>
            <span className="footer-item">
              {IS_AZURE ? 'Hosted on Azure' : 'Hosted on AWS'}
              {IS_AZURE ? (
                <span className="footer-icon footer-icon-azure" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505v.014L13.23 2.7z" />
                  </svg>
                </span>
              ) : (
                <span className="footer-icon footer-icon-aws" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.5 14.5c2.4 1.6 5.1 2.3 7.7 2.3 2.6 0 5.1-.7 7.6-2.2" />
                      <path d="M18.9 14.6l1.7-.2-.8 1.5" />
                    </g>
                  </svg>
                </span>
              )}
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}

export default Footer;

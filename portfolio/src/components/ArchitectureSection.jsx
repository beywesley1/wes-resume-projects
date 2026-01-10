import React from 'react';

function ArchitectureSection() {
  return (
    <section className="section" style={{ paddingTop: '40px' }}>
      <div className="container">
        <div className="section-header">
          <p className="section-label">// Infrastructure as Code</p>
          <h2 className="section-title">How This Site is Built</h2>
        </div>

        <div className="architecture-container">
          {/* Infrastructure Diagram */}
          <div className="architecture-diagram" style={{ position: 'relative' }}>
            <h3>CI/CD Pipeline & Infrastructure</h3>

            {/* Top Row: VS Code → GitHub → Terraform → Cloudflare */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              {/* VS Code */}
              <div className="arch-node" style={{ borderColor: '#007ACC', minWidth: '100px' }}>
                <span className="arch-node-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#007ACC">
                    <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                  </svg>
                </span>
                <div className="arch-node-info">
                  <h4 style={{ fontSize: '11px' }}>VS Code</h4>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Development</span>
                </div>
              </div>

              <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>→</span>

              {/* GitHub */}
              <div className="arch-node" style={{ borderColor: '#6e5494', minWidth: '100px' }}>
                <span className="arch-node-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </span>
                <div className="arch-node-info">
                  <h4 style={{ fontSize: '11px' }}>GitHub</h4>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Change Control</span>
                </div>
              </div>

              <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>→</span>

              {/* Terraform */}
              <div className="arch-node" style={{ borderColor: '#7B42BC', minWidth: '100px' }}>
                <span className="arch-node-icon">
                  <svg width="24" height="24" viewBox="0 0 128 128" fill="#7B42BC">
                    <path d="M77.941 44.5v36.836L46.324 62.918V26.082zm0 0" />
                    <path d="M81.41 81.336l31.633-18.418V26.082L81.41 44.5zm0 0" />
                    <path d="M11.242 42.36L42.86 60.776V23.941L11.242 5.523zm0 0" />
                    <path d="M77.941 85.375L46.324 66.957v36.82l31.617 18.418zm0 0" />
                  </svg>
                </span>
                <div className="arch-node-info">
                  <h4 style={{ fontSize: '11px' }}>Terraform</h4>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Resource Mgmt (IaC)</span>
                </div>
              </div>

              <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>→</span>

              {/* Cloudflare */}
              <div className="arch-node" style={{ borderColor: '#F38020', minWidth: '100px' }}>
                <span className="arch-node-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="#F38020">
                    <path d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1582-.8984 2.5537-1.9336l.499-1.3086c.0215-.0576.0283-.1152.0147-.168-.5625-2.5254-2.8301-4.4062-5.5606-4.4062-2.499 0-4.6289 1.5898-5.4199 3.8086-.4844-.3594-1.0986-.5625-1.7696-.499-1.1953.1191-2.1484 1.0566-2.2891 2.2519-.0352.2871-.0205.5674.0283.8301C1.0273 12.3838 0 13.5918 0 15.0508c0 .1699.0137.3359.0352.499.0146.0918.0908.1602.1826.1602l15.7471.0059c.0283 0 .0566-.0059.0849-.0137.0566-.0205.1054-.0625.1269-.1192l.3321-.7314z" />
                  </svg>
                </span>
                <div className="arch-node-info">
                  <h4 style={{ fontSize: '11px' }}>Cloudflare</h4>
                  <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>DNS Routing</span>
                </div>
              </div>
            </div>

            {/* Connection lines using SVG - Fork style: vertical down then horizontal split */}
            {/* Arrows labeled A, B, C, D from left to right */}
            <svg viewBox="0 0 1000 60" style={{ width: '100%', height: '60px', display: 'block' }} preserveAspectRatio="none">
              {/* Terraform fork: vertical down, then horizontal split to AWS and Azure */}
              <line x1="580" y1="0" x2="580" y2="25" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="580" y1="25" x2="450" y2="25" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="580" y1="25" x2="800" y2="25" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              {/* Arrow A */}
              <line x1="450" y1="25" x2="450" y2="50" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#arrowGrey)" />
              {/* Arrow B */}
              <line x1="800" y1="25" x2="800" y2="50" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#arrowGrey)" />

              {/* Cloudflare fork: vertical down, then horizontal split to AWS and Azure */}
              <line x1="920" y1="0" x2="920" y2="25" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="920" y1="25" x2="620" y2="25" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <line x1="920" y1="25" x2="950" y2="25" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              {/* Arrow C */}
              <line x1="620" y1="25" x2="620" y2="50" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#arrowGrey)" />
              {/* Arrow D */}
              <line x1="950" y1="25" x2="950" y2="50" stroke="#888888" strokeWidth="1" vectorEffect="non-scaling-stroke" markerEnd="url(#arrowGrey)" />

              {/* Arrow markers */}
              <defs>
                <marker id="arrowGrey" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L0,6 L6,3 z" fill="#888888" />
                </marker>
              </defs>
            </svg>

            {/* Bottom Row: Entra SSO + AWS Box */}
            <div className="architecture-bottom-row" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '16px' }}>
              {/* Entra SSO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="arch-node" style={{ borderColor: '#00A4EF', minWidth: '110px' }}>
                  <span className="arch-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#00A4EF">
                      <path d="M5.483 21.3H24L14.025 4.013l-3.038 8.347 5.836 6.938L5.483 21.3zM13.23 2.7L6.105 8.677 0 19.253h5.505v.014L13.23 2.7z" />
                    </svg>
                  </span>
                  <div className="arch-node-info">
                    <h4 style={{ fontSize: '11px' }}>Entra SSO</h4>
                    <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>Identity Provider</span>
                  </div>
                </div>
                <span style={{ fontSize: '20px', color: 'var(--text-muted)' }}>→</span>
              </div>

              {/* AWS Container */}
              <div
                style={{
                  border: '2px solid #FF9900',
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'rgba(255, 153, 0, 0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid rgba(255, 153, 0, 0.3)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF9900">
                    <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103a6.4 6.4 0 0 0-.862.272 2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586z" />
                  </svg>
                  <span style={{ fontWeight: 'bold', color: '#FF9900', fontSize: '12px' }}>AWS</span>
                </div>

                {/* CloudFront */}
                <div className="arch-node" style={{ borderColor: '#8C4FFF', minWidth: '120px', marginBottom: '8px' }}>
                  <span className="arch-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#8C4FFF">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="#8C4FFF" strokeWidth="2" />
                      <circle cx="12" cy="12" r="4" fill="#8C4FFF" />
                      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#8C4FFF" strokeWidth="2" />
                    </svg>
                  </span>
                  <div className="arch-node-info">
                    <h4 style={{ fontSize: '10px' }}>CloudFront</h4>
                    <span style={{ fontSize: '7px', color: 'var(--text-muted)' }}>CDN, DDoS Protection</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: '16px', color: 'var(--text-muted)', margin: '4px 0' }}>↓</div>

                {/* S3 */}
                <div className="arch-node" style={{ borderColor: '#569A31', minWidth: '120px' }}>
                  <span className="arch-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#569A31">
                      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.5L18 8l-6 3.5L6 8l6-3.5zM5 9.5l6 3.5v6.5l-6-3.5V9.5zm14 0v6.5l-6 3.5v-6.5l6-3.5z" />
                    </svg>
                  </span>
                  <div className="arch-node-info">
                    <h4 style={{ fontSize: '10px' }}>S3</h4>
                    <span style={{ fontSize: '7px', color: 'var(--text-muted)' }}>Website Code (index.html)</span>
                  </div>
                </div>
              </div>

              {/* Azure Container */}
              <div
                style={{
                  border: '2px solid #0078D4',
                  borderRadius: '8px',
                  padding: '12px',
                  background: 'rgba(0, 120, 212, 0.05)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                    paddingBottom: '6px',
                    borderBottom: '1px solid rgba(0, 120, 212, 0.3)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#0078D4">
                    <path d="M13.05 4.24L6.56 18.05a.5.5 0 0 1-.47.31H2.85a.5.5 0 0 1-.44-.75l6.37-11.3a.5.5 0 0 0 0-.5L6.23 2.69a.5.5 0 0 1 .44-.75h4.19a.5.5 0 0 1 .44.26l1.75 3.04zM13.5 5.5l7.25 12.75a.5.5 0 0 1-.44.75H8.85a.5.5 0 0 1-.44-.75L13.5 5.5z" />
                  </svg>
                  <span style={{ fontWeight: 'bold', color: '#0078D4', fontSize: '12px' }}>Azure</span>
                </div>

                {/* Static Web App */}
                <div className="arch-node" style={{ borderColor: '#0078D4', minWidth: '120px' }}>
                  <span className="arch-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0078D4">
                      <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="#0078D4" strokeWidth="2" />
                      <path d="M7 8h10M7 12h10M7 16h6" stroke="#0078D4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="arch-node-info">
                    <h4 style={{ fontSize: '10px' }}>Static Web App</h4>
                    <span style={{ fontSize: '7px', color: 'var(--text-muted)' }}>azure.beyops.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terraform Code - Full main.tf */}
          <div className="architecture-code">
            <div className="architecture-code-header">
              <h3>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
                main.tf
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>Terraform • Multi-Cloud</span>
            </div>
            <div className="architecture-code-content" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              <pre className="code-highlighted">
                <span className="code-comment"># S3 bucket stores the React build files</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"aws_s3_bucket"</span> <span className="code-string">"website"</span> {'{\n'}
                {'  '}<span className="code-attr">bucket</span> = <span className="code-string">"beyops.com"</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># Block all public access - CloudFront handles delivery</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"aws_s3_bucket_public_access_block"</span> <span className="code-string">"website"</span> {'{\n'}
                {'  '}<span className="code-attr">bucket</span>                  = <span className="code-ref">aws_s3_bucket.website.id</span>{'\n'}
                {'  '}<span className="code-attr">block_public_acls</span>       = <span className="code-bool">true</span>{'\n'}
                {'  '}<span className="code-attr">block_public_policy</span>     = <span className="code-bool">true</span>{'\n'}
                {'  '}<span className="code-attr">ignore_public_acls</span>      = <span className="code-bool">true</span>{'\n'}
                {'  '}<span className="code-attr">restrict_public_buckets</span> = <span className="code-bool">true</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># OAC allows CloudFront to securely access private S3</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"aws_cloudfront_origin_access_control"</span> <span className="code-string">"website"</span> {'{\n'}
                {'  '}<span className="code-attr">name</span>                              = <span className="code-string">"beyops-oac"</span>{'\n'}
                {'  '}<span className="code-attr">origin_access_control_origin_type</span> = <span className="code-string">"s3"</span>{'\n'}
                {'  '}<span className="code-attr">signing_behavior</span>                  = <span className="code-string">"always"</span>{'\n'}
                {'  '}<span className="code-attr">signing_protocol</span>                  = <span className="code-string">"sigv4"</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># SSL certificate for HTTPS (must be in us-east-1)</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"aws_acm_certificate"</span> <span className="code-string">"website"</span> {'{\n'}
                {'  '}<span className="code-attr">provider</span>                  = <span className="code-ref">aws.us_east_1</span>{'\n'}
                {'  '}<span className="code-attr">domain_name</span>               = <span className="code-string">"beyops.com"</span>{'\n'}
                {'  '}<span className="code-attr">subject_alternative_names</span> = [<span className="code-string">"www.beyops.com"</span>]{'\n'}
                {'  '}<span className="code-attr">validation_method</span>         = <span className="code-string">"DNS"</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># CDN for global edge caching and SSL termination</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"aws_cloudfront_distribution"</span> <span className="code-string">"website"</span> {'{\n'}
                {'  '}<span className="code-attr">enabled</span>             = <span className="code-bool">true</span>{'\n'}
                {'  '}<span className="code-attr">default_root_object</span> = <span className="code-string">"index.html"</span>{'\n'}
                {'  '}<span className="code-attr">aliases</span>             = [<span className="code-string">"beyops.com"</span>, <span className="code-string">"www.beyops.com"</span>]{'\n\n'}
                {'  '}<span className="code-keyword">origin</span> {'{\n'}
                {'    '}<span className="code-attr">domain_name</span>              = <span className="code-ref">aws_s3_bucket.website.bucket_regional_domain_name</span>{'\n'}
                {'    '}<span className="code-attr">origin_access_control_id</span> = <span className="code-ref">aws_cloudfront_origin_access_control.website.id</span>{'\n'}
                {'  }\n\n'}
                {'  '}<span className="code-keyword">default_cache_behavior</span> {'{\n'}
                {'    '}<span className="code-attr">viewer_protocol_policy</span> = <span className="code-string">"redirect-to-https"</span>{'\n'}
                {'    '}<span className="code-attr">compress</span>               = <span className="code-bool">true</span>{'\n'}
                {'  }\n\n'}
                {'  '}<span className="code-comment"># SPA routing - serve index.html for all paths</span>{'\n'}
                {'  '}<span className="code-keyword">custom_error_response</span> {'{\n'}
                {'    '}<span className="code-attr">error_code</span>         = <span className="code-number">403</span>{'\n'}
                {'    '}<span className="code-attr">response_code</span>      = <span className="code-number">200</span>{'\n'}
                {'    '}<span className="code-attr">response_page_path</span> = <span className="code-string">"/index.html"</span>{'\n'}
                {'  }\n\n'}
                {'  '}<span className="code-keyword">viewer_certificate</span> {'{\n'}
                {'    '}<span className="code-attr">acm_certificate_arn</span> = <span className="code-ref">aws_acm_certificate.website.arn</span>{'\n'}
                {'    '}<span className="code-attr">ssl_support_method</span>  = <span className="code-string">"sni-only"</span>{'\n'}
                {'  }\n'}
                {'}\n\n'}
                <span className="code-comment"># DNS records point domain to CloudFront</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"cloudflare_record"</span> <span className="code-string">"apex"</span> {'{\n'}
                {'  '}<span className="code-attr">zone_id</span> = <span className="code-ref">var.cloudflare_zone_id</span>{'\n'}
                {'  '}<span className="code-attr">name</span>    = <span className="code-string">"@"</span>{'\n'}
                {'  '}<span className="code-attr">content</span> = <span className="code-ref">aws_cloudfront_distribution.website.domain_name</span>{'\n'}
                {'  '}<span className="code-attr">type</span>    = <span className="code-string">"CNAME"</span>{'\n'}
                {'  '}<span className="code-attr">proxied</span> = <span className="code-bool">false</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># ============================================</span>{'\n'}
                <span className="code-comment"># AZURE STATIC WEB APP (Multi-Cloud Mirror)</span>{'\n'}
                <span className="code-comment"># ============================================</span>{'\n\n'}
                <span className="code-comment"># Resource group for Azure resources</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"azurerm_resource_group"</span> <span className="code-string">"website"</span> {'{\n'}
                {'  '}<span className="code-attr">name</span>     = <span className="code-string">"rg-beyops-com"</span>{'\n'}
                {'  '}<span className="code-attr">location</span> = <span className="code-string">"eastus2"</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># Azure Static Web App - serverless hosting</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"azurerm_static_web_app"</span> <span className="code-string">"azure_site"</span> {'{\n'}
                {'  '}<span className="code-attr">name</span>                = <span className="code-string">"stapp-beyops-com"</span>{'\n'}
                {'  '}<span className="code-attr">resource_group_name</span> = <span className="code-ref">azurerm_resource_group.website.name</span>{'\n'}
                {'  '}<span className="code-attr">location</span>            = <span className="code-ref">azurerm_resource_group.website.location</span>{'\n'}
                {'  '}<span className="code-attr">sku_tier</span>            = <span className="code-string">"Free"</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># DNS record for Azure subdomain</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"cloudflare_record"</span> <span className="code-string">"azure_site"</span> {'{\n'}
                {'  '}<span className="code-attr">zone_id</span> = <span className="code-ref">var.cloudflare_zone_id</span>{'\n'}
                {'  '}<span className="code-attr">name</span>    = <span className="code-string">"azure"</span>{'\n'}
                {'  '}<span className="code-attr">content</span> = <span className="code-ref">azurerm_static_web_app.azure_site.default_host_name</span>{'\n'}
                {'  '}<span className="code-attr">type</span>    = <span className="code-string">"CNAME"</span>{'\n'}
                {'  '}<span className="code-attr">proxied</span> = <span className="code-bool">false</span>{'\n'}
                {'}\n\n'}
                <span className="code-comment"># Custom domain for Azure Static Web App</span>{'\n'}
                <span className="code-keyword">resource</span> <span className="code-string">"azurerm_static_web_app_custom_domain"</span> <span className="code-string">"azure_site"</span> {'{\n'}
                {'  '}<span className="code-attr">static_web_app_id</span> = <span className="code-ref">azurerm_static_web_app.azure_site.id</span>{'\n'}
                {'  '}<span className="code-attr">domain_name</span>       = <span className="code-string">"azure.beyops.com"</span>{'\n'}
                {'  '}<span className="code-attr">validation_type</span>   = <span className="code-string">"cname-delegation"</span>{'\n'}
                {'}'}
              </pre>
            </div>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="arch-features">
          <div className="arch-feature">
            <span className="arch-feature-icon">🔒</span>
            <div>
              <h4>SSL/TLS Encryption</h4>
              <p>ACM certificate with automatic renewal for HTTPS</p>
            </div>
          </div>
          <div className="arch-feature">
            <span className="arch-feature-icon">🌍</span>
            <div>
              <h4>Global CDN</h4>
              <p>CloudFront edge locations for low-latency delivery</p>
            </div>
          </div>
          <div className="arch-feature">
            <span className="arch-feature-icon">💰</span>
            <div>
              <h4>Cost Effective</h4>
              <p>~$1-5/month on AWS + $0/month for Azure Static Web App mirror (Free tier)</p>
            </div>
          </div>
          <div className="arch-feature">
            <span className="arch-feature-icon">🔄</span>
            <div>
              <h4>CI/CD Ready</h4>
              <p>GitHub Actions deploys on push to main branch</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ArchitectureSection;

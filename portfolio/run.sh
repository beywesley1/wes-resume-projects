#!/bin/bash
# ============================================================================
# DOCKER TERRAFORM RUNNER
# Run Terraform in a Docker container with AWS credentials
# ============================================================================

set -e

# Configuration
TERRAFORM_VERSION="1.7.0"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${PROJECT_DIR}/terraform"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check for required environment variables or AWS config
check_aws_credentials() {
    if [[ -n "$AWS_ACCESS_KEY_ID" && -n "$AWS_SECRET_ACCESS_KEY" ]]; then
        log_info "Using AWS credentials from environment variables"
        AWS_CREDS="-e AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY"
        [[ -n "$AWS_SESSION_TOKEN" ]] && AWS_CREDS="$AWS_CREDS -e AWS_SESSION_TOKEN"
        [[ -n "$AWS_REGION" ]] && AWS_CREDS="$AWS_CREDS -e AWS_REGION"
    elif [[ -f "$HOME/.aws/credentials" ]]; then
        log_info "Using AWS credentials from ~/.aws/credentials"
        AWS_CREDS="-v $HOME/.aws:/root/.aws:ro"
    else
        log_error "No AWS credentials found!"
        log_info "Either set AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY or configure ~/.aws/credentials"
        exit 1
    fi
}

# Run terraform command in Docker
run_terraform() {
    local working_dir="${1:-terraform}"
    shift
    local cmd="$@"
    
    docker run --rm -it \
        $AWS_CREDS \
        -v "${PROJECT_DIR}:/workspace" \
        -w "/workspace/${working_dir}" \
        hashicorp/terraform:${TERRAFORM_VERSION} \
        $cmd
}

# Main command handling
case "${1:-help}" in
    # NOTE: Bootstrap commands disabled - terraform/bootstrap directory does not exist
    # Uncomment when bootstrap infrastructure is created
    # bootstrap-init)
    #     log_info "Initializing bootstrap (state backend)..."
    #     check_aws_credentials
    #     run_terraform "terraform/bootstrap" init
    #     ;;
    # 
    # bootstrap-plan)
    #     log_info "Planning bootstrap infrastructure..."
    #     check_aws_credentials
    #     run_terraform "terraform/bootstrap" plan
    #     ;;
    # 
    # bootstrap-apply)
    #     log_info "Applying bootstrap infrastructure..."
    #     check_aws_credentials
    #     run_terraform "terraform/bootstrap" apply
    #     ;;
    
    init)
        log_info "Initializing main infrastructure..."
        check_aws_credentials
        run_terraform "terraform" init
        ;;
    
    plan)
        log_info "Planning main infrastructure..."
        check_aws_credentials
        run_terraform "terraform" plan
        ;;
    
    apply)
        log_info "Applying main infrastructure..."
        check_aws_credentials
        run_terraform "terraform" apply
        ;;
    
    destroy)
        log_warn "Destroying main infrastructure..."
        check_aws_credentials
        run_terraform "terraform" destroy
        ;;
    
    output)
        log_info "Getting outputs..."
        check_aws_credentials
        run_terraform "terraform" output
        ;;
    
    shell)
        log_info "Opening shell in Terraform container..."
        check_aws_credentials
        docker run --rm -it \
            $AWS_CREDS \
            -v "${PROJECT_DIR}:/workspace" \
            -w "/workspace/terraform" \
            --entrypoint /bin/sh \
            hashicorp/terraform:${TERRAFORM_VERSION}
        ;;
    
    build)
        log_info "Building React application..."
        docker run --rm \
            -v "${PROJECT_DIR}:/app" \
            -w "/app" \
            node:20-alpine \
            sh -c "npm install && npm run build"
        log_info "Build complete! Output in ./dist/"
        ;;
    
    deploy)
        log_info "Deploying to S3..."
        check_aws_credentials
        
        # Get bucket name and distribution ID from Terraform output
        BUCKET=$(run_terraform "terraform" output -raw s3_bucket_name 2>/dev/null)
        DIST_ID=$(run_terraform "terraform" output -raw cloudfront_distribution_id 2>/dev/null)
        
        if [[ -z "$BUCKET" ]]; then
            log_error "Could not get S3 bucket name. Run 'apply' first."
            exit 1
        fi
        
        log_info "Syncing to s3://${BUCKET}..."
        docker run --rm \
            $AWS_CREDS \
            -v "${PROJECT_DIR}/dist:/dist:ro" \
            amazon/aws-cli \
            s3 sync /dist s3://${BUCKET} --delete
        
        log_info "Invalidating CloudFront cache..."
        docker run --rm \
            $AWS_CREDS \
            amazon/aws-cli \
            cloudfront create-invalidation --distribution-id ${DIST_ID} --paths "/*"
        
        log_info "Deployment complete!"
        ;;
    
    help|*)
        echo ""
        echo "Portfolio Infrastructure Manager"
        echo "================================"
        echo ""
        echo "Usage: ./run.sh <command>"
        echo ""
        echo "Infrastructure Commands:"
        echo "  init              Initialize main Terraform"
        echo "  plan              Plan infrastructure changes"
        echo "  apply             Apply infrastructure changes"
        echo "  destroy           Destroy all infrastructure"
        echo "  output            Show Terraform outputs"
        echo ""
        echo "Development Commands:"
        echo "  build             Build React application"
        echo "  deploy            Deploy to S3 + invalidate CloudFront"
        echo "  shell             Open shell in Terraform container"
        echo ""
        echo "Prerequisites:"
        echo "  - Docker installed and running"
        echo "  - AWS credentials (env vars or ~/.aws/credentials)"
        echo "  - Domain registered and hosted zone in Route53"
        echo ""
        ;;
esac

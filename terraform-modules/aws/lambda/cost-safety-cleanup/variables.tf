# Module identity

variable "name" {
  type        = string
  description = "Base name for resources."
}

# Lambda runtime sizing

variable "lambda_timeout" {
  type        = number
  description = "Lambda timeout in seconds. Keep high because resource cleanup across many regions can take time."
  default     = 900
}

variable "lambda_memory_size" {
  type        = number
  description = "Lambda memory size in MB."
  default     = 512
}

# Schedule (EventBridge Scheduler)
# Note: scheduler timezone support (DST-safe) is controlled by schedule_timezone.

variable "schedule_expression" {
  type        = string
  description = "Schedule expression for EventBridge Scheduler (cron or rate)."
  default     = "cron(0 21 * * ? *)"
}

variable "schedule_timezone" {
  type        = string
  description = "Timezone for schedule evaluation (EventBridge Scheduler). Example: America/New_York."
  default     = "America/New_York"
}

# Guardrails / safety controls

variable "allowed_account_ids" {
  type        = list(string)
  description = "List of AWS account IDs this Lambda is allowed to run in. If empty, Lambda will refuse to run (safety guardrail)."
  default     = []
}

# Opt-out keep tag
# Anything tagged keep_tag_key=keep_tag_value is skipped (not deleted).

variable "keep_tag_key" {
  type        = string
  description = "Resources tagged with keep_tag_key=keep_tag_value will be skipped (protected from cleanup)."
  default     = "status"
}

variable "keep_tag_value" {
  type        = string
  description = "Resources tagged with keep_tag_key=keep_tag_value will be skipped (protected from cleanup)."
  default     = "keep"
}

# Execution mode

variable "dry_run" {
  type        = bool
  description = "If true, Lambda will only log what it would delete/terminate, without making changes."
  default     = true
}

# Region selection

variable "target_regions" {
  type        = list(string)
  description = "If non-empty, only these regions will be scanned. Otherwise all enabled regions are scanned."
  default     = []
}

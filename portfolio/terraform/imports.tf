# =============================================================================
# TERRAFORM IMPORT BLOCKS
# =============================================================================
# NOTE: The AWS Single-Account Access app is a Microsoft gallery app.
# The Application Registration is managed by Microsoft and cannot be imported.
# We only manage the Service Principal (Enterprise Application) via Terraform.
# 
# The import blocks have been removed since we're using a gallery app.
# Terraform will reference the existing app via data source instead.

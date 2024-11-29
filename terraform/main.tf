terraform {
  cloud {
    organization = "mdna"
    workspaces {
      name = "spotify-playlist-diff"
    }
  }

  required_providers {
    tfe = {
      source = "hashicorp/tfe"
      version = "0.60.1"
    }
  }
}

provider "tfe" {
}

provider "google" {
  project     = "spotify-playlist-diff"
  region      = "us-central1"
}

# Random ID for the workload_identity_pool_id
# will avoid errors due to GCP's 30-day hold on deleted pools
resource "random_string" "suffix" {
  length  = 4
  special = false
  upper   = false
}

locals {
  project = "spotify-playlist-diff"
  organization_name = "mdna"
  tfc_varset_name = "hcp-tf-${random_string.suffix.result}"
  workspace_id = "ws-uRvRyMFpt5mcKPpo"
}

variable "gcp_service_list" {
  description ="The list of apis necessary for the project"
  type = list(string)
  default = [
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
  ]
}

resource "google_project_service" "gcp_services" {
  for_each = toset(var.gcp_service_list)
  project = local.project
  service = each.key
}

variable "hcp_tf_role_list" {
  description = "Google Cloud roles required for the hcp-tf service account"
  type        = list(string)
  default = [
    "roles/owner",
    "roles/iam.workloadIdentityPoolAdmin",
  ]
}

# service account that HCP Terraform will impersonate
resource "google_service_account" "hcp_tf" {
  account_id   = "hcp-tf"
  display_name = "Service Account for HCP Terraform Dynamic Credentials"
}

resource "google_project_iam_member" "project_iam" {
  for_each = toset(var.hcp_tf_role_list)
  member  = "serviceAccount:${google_service_account.hcp_tf.email}"
  role    = each.value
  project = local.project
}

variable "cloud_build_role_list" {
  description = "Google Cloud roles required for the Cloud Build service account"
  type        = list(string)
  default = [
    "roles/cloudbuild.builds.builder",
    "roles/cloudbuild.builds.editor",
    "roles/cloudbuild.builds.viewer",
    "roles/run.admin",
    "roles/secretmanager.secretAccessor",
    "roles/iam.serviceAccountUser",
    "roles/cloudbuild.workerPoolUser",
    "roles/cloudbuild.connectionAdmin",

  ]
}

# service account for doing cloud build things
resource "google_service_account" "cloud_build" {
  account_id   = "cloud-build"
  display_name = "Service Account for HCP Terraform Dynamic Credentials"
}

resource "google_project_iam_member" "cloud_build_iam" {
  for_each = toset(var.cloud_build_role_list)
  member  = "serviceAccount:${google_service_account.cloud_build.email}"
  role    = each.value
  project = local.project
}

module "tfc_oidc" {
  source      = "GoogleCloudPlatform/tf-cloud-agents/google//modules/tfc-oidc"
  project_id  = local.project
  pool_id     = "hcp-tf-pool-${random_string.suffix.result}"
  provider_id = "hcp-tf-provider-${random_string.suffix.result}"
  sa_mapping = {
    (google_service_account.hcp_tf.account_id) = {
      sa_name   = google_service_account.hcp_tf.name
      sa_email  = google_service_account.hcp_tf.email
      attribute = "*"
    }
  }
  tfc_organization_name = "mdna"
  tfc_project_name = "Portfolio"
  tfc_workspace_name = local.project
}

# create a variable set to store the workload identity federation config for the 'hcp-tf' service account
resource "tfe_variable_set" "wip_variable_set" {
  name         = "${google_service_account.hcp_tf.account_id}-${local.project}"
  description  = "Workload identity federation configuration for ${google_service_account.hcp_tf.name}"
  organization = local.organization_name
}

resource "tfe_variable" "hcp_tf_provider_auth" {
  key             = "TFC_GCP_PROVIDER_AUTH"
  value           = "true"
  category        = "env"
  variable_set_id = tfe_variable_set.wip_variable_set.id
}
 
resource "tfe_variable" "hcp_tf_service_account_email" {
  sensitive       = true
  key             = "TFC_GCP_RUN_SERVICE_ACCOUNT_EMAIL"
  value           = google_service_account.hcp_tf.email
  category        = "env"
  variable_set_id = tfe_variable_set.wip_variable_set.id
}
 
resource "tfe_variable" "hcp_tf_provider_name" {
  sensitive       = true
  key             = "TFC_GCP_WORKLOAD_PROVIDER_NAME"
  value = module.tfc_oidc.provider_name
  category        = "env"
  variable_set_id = tfe_variable_set.wip_variable_set.id
}

# share the variable set with this HCP Terraform Workspace
resource "tfe_workspace_variable_set" "wip_workspace_variable_set" {
  variable_set_id = tfe_variable_set.wip_variable_set.id
  workspace_id    = "${local.workspace_id}"
}

# resource "google_cloud_run_v2_service" "default" {
#   name     = "cloudrun-service"
#   location = "us-central1"
#   # deletion_protection = false
#   ingress = "INGRESS_TRAFFIC_ALL"

#   template {
#     scaling {
#       max_instance_count = 1
#     }

#     # volumes {
#     #   name = "cloudsql"
#     #   cloud_sql_instance {
#     #     instances = [google_sql_database_instance.instance.connection_name]
#     #   }
#     # }

#     # containers {
#     #   image = "us-docker.pkg.dev/cloudrun/container/hello"

#     #   volume_mounts {
#     #     name = "cloudsql"
#     #     mount_path = "/cloudsql"
#     #   }
#     # }
#   }

#   traffic {
#     type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
#     percent = 100
#   }
# }

# resource "google_secret_manager_secret" "spotify-client-id" {
#   secret_id = "spotify-client-id"
#   replication {
#     auto {}
#   }
# }

# resource "google_secret_manager_secret_version" "secret-version-data" {
#   secret = google_secret_manager_secret.spotify-client-id.name
#   secret_data = "secret-data"
# }

# resource "google_secret_manager_secret_iam_member" "secret-access" {
#   secret_id = google_secret_manager_secret.spotify-client-id.id
#   role      = "roles/secretmanager.secretAccessor"
#   member    = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
#   depends_on = [google_secret_manager_secret.spotify-client-id]
# }

# resource "google_sql_database_instance" "instance" {
#   name             = "cloudrun-sql"
#   region           = "us-central1"
#   database_version = "MYSQL_5_7"
#   settings {
#     tier = "db-f1-micro"
#   }

#   deletion_protection  = true
# }
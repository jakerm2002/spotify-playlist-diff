// Create a secret containing the personal access token and grant permissions to the Service Agent
resource "google_secret_manager_secret" "github_token_secret" {
    project =  local.project
    secret_id = "github-token-secret"

    replication {
        auto {}
    }
}

resource "google_secret_manager_secret_version" "github_token_secret_version" {
    secret = google_secret_manager_secret.github_token_secret.id
    secret_data = var.GITHUB_TOKEN_SECRET
}

# data "google_iam_policy" "serviceagent_secretAccessor" {
#     binding {
#         role = "roles/secretmanager.secretAccessor"
#         members = ["serviceAccount:service-${local.project_number}@gcp-sa-cloudbuild.iam.gserviceaccount.com"]
#     }
# }

# resource "google_secret_manager_secret_iam_policy" "policy" {
#   project = google_secret_manager_secret.github_token_secret.project
#   secret_id = google_secret_manager_secret.github_token_secret.secret_id
#   policy_data = data.google_iam_policy.serviceagent_secretAccessor.policy_data
# }

resource "google_secret_manager_secret_iam_member" "cloud_build_secret_access" {
  project = google_secret_manager_secret.github_token_secret.project
  secret_id = google_secret_manager_secret.github_token_secret.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:service-${local.project_number}@gcp-sa-cloudbuild.iam.gserviceaccount.com"
}

// Create the GitHub connection
resource "google_cloudbuildv2_connection" "github_connection" {
    project = local.project
    location = "us-central1"
    name = "github"

    github_config {
        app_installation_id = 57775129
        authorizer_credential {
            oauth_token_secret_version = google_secret_manager_secret_version.github_token_secret_version.id
        }
    }
    # depends_on = [google_secret_manager_secret_iam_policy.policy]
}

resource "google_cloudbuildv2_repository" "repo" {
  project = local.project
  location = "us-central1"
  name = "spotify-playlist-diff"
  parent_connection = google_cloudbuildv2_connection.github_connection.name
  remote_uri = "https://github.com/jakerm2002/spotify-playlist-diff.git"
}

resource "google_cloudbuild_trigger" "github-trigger" {
  name        = "github-trigger"
  location    = "us-central1"

  github {
    owner = "jakerm2002"
    name  = "spotify-playlist-diff"
    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"
}
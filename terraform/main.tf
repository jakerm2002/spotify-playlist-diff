provider "google" {
  project     = "spotify-playlist-diff"
  region      = "us-central1"
}

resource "google_cloud_run_v2_service" "default" {
  name     = "cloudrun-service"
  location = "us-central1"
  deletion_protection = false
  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      max_instance_count = 1
    }

    # volumes {
    #   name = "cloudsql"
    #   cloud_sql_instance {
    #     instances = [google_sql_database_instance.instance.connection_name]
    #   }
    # }

    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      env {
        name = "SPOTIFY_CLIENT_ID"
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.spotify-client-id.secret_id
            version = "1"
          }
        }
      }
      env {
        name = "SECRET_ENV_VAR"
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.spotify-client-id.secret_id
            version = "1"
          }
        }
      }
      # volume_mounts {
      #   name = "cloudsql"
      #   mount_path = "/cloudsql"
      # }
    }
  }

  traffic {
    type = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
  depends_on = [google_secret_manager_secret_version.secret-version-data]
}

data "google_project" "project" {
}

resource "google_secret_manager_secret" "spotify-client-id" {
  secret_id = "spotify-client-id"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "secret-version-data" {
  secret = google_secret_manager_secret.spotify-client-id.name
  secret_data = "secret-data"
}

resource "google_secret_manager_secret_iam_member" "secret-access" {
  secret_id = google_secret_manager_secret.spotify-client-id.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${data.google_project.project.number}-compute@developer.gserviceaccount.com"
  depends_on = [google_secret_manager_secret.spotify-client-id]
}

# resource "google_sql_database_instance" "instance" {
#   name             = "cloudrun-sql"
#   region           = "us-central1"
#   database_version = "MYSQL_5_7"
#   settings {
#     tier = "db-f1-micro"
#   }

#   deletion_protection  = true
# }
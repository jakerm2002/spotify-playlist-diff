resource "random_id" "db_name_suffix" {
  byte_length = 4
}

# locals {
#   onprem = ["192.168.1.2", "192.168.2.3"]
# }

resource "google_sql_database_instance" "mysql" {
  name             = "spotify-playlist-diff-db-${random_id.db_name_suffix.hex}"
  database_version = "MYSQL_8_0"
  region           = "us-central1"

  settings {
    edition = "ENTERPRISE"
    tier = "db-custom-1-3840"
    disk_size = 10
    disk_autoresize = false

    ip_configuration {
      authorized_networks {
        name  = "All"
        value = "0.0.0.0/0"
      }
    }
  }
}

resource "google_sql_database" "database" {
  name     = "playlists"
  instance = google_sql_database_instance.mysql.name
}


resource "google_sql_user" "users" {
  name     = "express"
  instance = google_sql_database_instance.mysql.name
  password = var.EXPRESS_SQL_USER_PASSWORD
}
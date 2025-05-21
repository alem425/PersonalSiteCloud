#SERVICES NEEDED:
# 1. Azure Function App
# 2. Azure Cosmos DB
# 3. Azure Storage Account
# 4. Azure Resource Group
# 5. Azure App Service Plan
# 6. Azure Cosmos DB SQL API Database
# 7. Azure Cosmos DB SQL API Container
# 8 Azure Blob Storage

terraform {

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "= 3.116.0, <4.0"
    }
  }

}

provider "azurerm" {
  features {}
}

# Big OL' Resource Group
resource "azurerm_resource_group" "rg-personal_portfolio" {
  name     = "rg-personal_portfolio"
  location = "Canada Central"
}

# Azure Storage Account setup for Function App
resource "azurerm_storage_account" "personal_portfolio_func_blob_acct" {
  name                     = "straccntmysite"
  resource_group_name      = azurerm_resource_group.rg-personal_portfolio.name
  location                 = azurerm_resource_group.rg-personal_portfolio.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "StorageV2"
}
# Azure Function App setup
resource "azurerm_service_plan" "personal_portfolio_sp" {
  name                = "personal_portfolio_function_service_plan"
  resource_group_name = azurerm_resource_group.rg-personal_portfolio.name
  location            = azurerm_resource_group.rg-personal_portfolio.location
  sku_name            = "Y1"
  os_type             = "Linux"
}

resource "azurerm_linux_function_app" "func-personal-portfolio" {
  name                = "mysite-function-app"
  resource_group_name = azurerm_resource_group.rg-personal_portfolio.name
  location            = azurerm_resource_group.rg-personal_portfolio.location

  storage_account_name       = azurerm_storage_account.personal_portfolio_func_blob_acct.name
  storage_account_access_key = azurerm_storage_account.personal_portfolio_func_blob_acct.primary_access_key
  service_plan_id            = azurerm_service_plan.personal_portfolio_sp.id

  site_config {
    application_stack {
      python_version = "3.11"
    }
  }
}

# Cosmos DB Account setup
resource "azurerm_cosmosdb_account" "cosmos-personal-portfolio" {
  name                          = "portfolio-cosmosdb"
  location                      = azurerm_resource_group.rg-personal_portfolio.location
  resource_group_name           = azurerm_resource_group.rg-personal_portfolio.name
  offer_type                    = "Standard"
  kind                          = "GlobalDocumentDB"
  public_network_access_enabled = true

  consistency_policy {
    consistency_level       = "Session"
    max_interval_in_seconds = 5
    max_staleness_prefix    = 100
  }

  geo_location {
    location          = azurerm_resource_group.rg-personal_portfolio.location
    failover_priority = 0
  }
}

# Cosmos DB SQL API Database setup
resource "azurerm_cosmosdb_sql_database" "cosmos-personal-portfolio-db" {
  name                = "portfolio-db"
  resource_group_name = azurerm_resource_group.rg-personal_portfolio.name
  account_name        = azurerm_cosmosdb_account.cosmos-personal-portfolio.name
  throughput          = 400

  # depends_on = [azurerm_cosmosdb_account.cosmos-personal-portfolio]
}

# DB Container for Projects
resource "azurerm_cosmosdb_sql_container" "projects" {
  name                = "projects"
  resource_group_name = azurerm_resource_group.rg-personal_portfolio.name
  account_name        = azurerm_cosmosdb_account.cosmos-personal-portfolio.name
  database_name       = azurerm_cosmosdb_sql_database.cosmos-personal-portfolio-db.name

  partition_key_path    = "/projectsID"
  partition_key_version = 2

  # depends_on = [azurerm_cosmosdb_sql_database.cosmos-personal-portfolio-db]
}

# DB Container for my user info
resource "azurerm_cosmosdb_sql_container" "admin" {
  name                = "admin"
  resource_group_name = azurerm_resource_group.rg-personal_portfolio.name
  account_name        = azurerm_cosmosdb_account.cosmos-personal-portfolio.name
  database_name       = azurerm_cosmosdb_sql_database.cosmos-personal-portfolio-db.name

  partition_key_path    = "/adminID"
  partition_key_version = 2

  # depends_on = [azurerm_cosmosdb_sql_database.cosmos-personal-portfolio-db]
}

# Blob Storage setup
resource "azurerm_storage_container" "blob-Personal-Portfolio" {
  name                  = "portfolio-blob-storage"
  storage_account_name  = azurerm_storage_account.personal_portfolio_func_blob_acct.name
  container_access_type = "blob"
  # depends_on            = [azurerm_storage_account.Personal_Portfolio_FuncAcct]

}
terraform {

  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = ">= 3.0.0, < 4.0"
    }
  }
  
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg-Personal_Portfolio" {
  name = "personal_portfolio_group"
  location = "East US"
}

resource "azurerm_storage_account" "Personal_Portfolio_FuncAcct"{
  name = " straccnt-Personal_Portfolio"
  resource_group_name = azurerm_resource_group.rg-Personal_Portfolio.name
  location = azurerm_resource_group.rg-Personal_Portfolio.location
  account_tier = "Standard"
  account_replication
}
resource "azurerm_app_service_plan" "Personal_Portfolio_SP"{
  name = "personal_portfolio_function_service_plan"
  resource_group_name = azurerm_resource_group.rg-Personal_Portfolio.name
  location = azurerm_resource_group.rg-Personal_Portfolio.location
  os_type = "Linux"
  sku_name = "B1"
}

resource "azurerm_linux_function_app" "func-Personal-Portfolio"{
  name = "Personal-Portfolio-Function-App"
  resource_group_name = azurerm_resource_group.rg-Personal_Portfolio.name
  location = azurerm_resource_group.rg-Personal-Portfolio.location

  storage_account_name = azurerm_storage_account.Personal_Portfolio_FuncAcct.name
  storage_account_access_key = azurerm_storage_account.Personal_Portfolio_FuncAcct.primary_access_key
  service_plan_id = azurerm_app_service_plan.Personal_Portfolio_SP.id

  site_config {}
}

resource "azurerm_cosmosdb_account" "cosmos-Personal-Portfolio"{
  name = "Personal_PortfolioDB"
  location = azurerm_resource_group.rg_Personal_Portfolio
}
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-personal_portfolio"
    storage_account_name = "straccntportfolio"
    container_name       = "tfstate"
    key                  = "personal_portfolio.tfstate"
  }
}

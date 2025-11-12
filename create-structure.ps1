# PowerShell script to create billing-saas project folder structure and files

# Set the root directory
$rootDir = "billing-saasr"
New-Item -ItemType Directory -Path $rootDir -Force

# Create packages directory and its substructure
$packagesDir = "$rootDir\packages"
New-Item -ItemType Directory -Path $packagesDir -Force



# Mobile directory structure
$mobileDir = "$packagesDir\mobile"
New-Item -ItemType Directory -Path $mobileDir -Force
New-Item -ItemType Directory -Path "$mobileDir\src" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\components" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\components\common" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\components\invoices" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\components\customers" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\screens" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\screens\Auth" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\Auth\LoginScreen.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\Auth\RegisterScreen.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\DashboardScreen.tsx" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\screens\Invoices" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\Invoices\InvoiceListScreen.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\Invoices\InvoiceDetailScreen.tsx" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\screens\Customers" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\Customers\CustomerListScreen.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\screens\Customers\CustomerDetailScreen.tsx" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\navigation" -Force
New-Item -ItemType File -Path "$mobileDir\src\navigation\AppNavigator.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\navigation\AuthNavigator.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\navigation\MainNavigator.tsx" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\services" -Force
New-Item -ItemType File -Path "$mobileDir\src\services\apiClient.ts" -Force
New-Item -ItemType File -Path "$mobileDir\src\services\authService.ts" -Force
New-Item -ItemType File -Path "$mobileDir\src\services\invoiceService.ts" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\hooks" -Force
New-Item -ItemType File -Path "$mobileDir\src\hooks\useAuth.ts" -Force
New-Item -ItemType File -Path "$mobileDir\src\hooks\useInvoices.ts" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\contexts" -Force
New-Item -ItemType File -Path "$mobileDir\src\contexts\AuthContext.tsx" -Force
New-Item -ItemType File -Path "$mobileDir\src\contexts\ThemeContext.tsx" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\utils" -Force
New-Item -ItemType File -Path "$mobileDir\src\utils\formatters.ts" -Force
New-Item -ItemType File -Path "$mobileDir\src\utils\validators.ts" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\types" -Force
New-Item -ItemType File -Path "$mobileDir\src\types\index.ts" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\assets" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\assets\images" -Force
New-Item -ItemType Directory -Path "$mobileDir\src\assets\fonts" -Force
New-Item -ItemType Directory -Path "$mobileDir\tests" -Force
New-Item -ItemType File -Path "$mobileDir\app.json" -Force
New-Item -ItemType File -Path "$mobileDir\package.json" -Force
New-Item -ItemType File -Path "$mobileDir\tsconfig.json" -Force
New-Item -ItemType File -Path "$mobileDir\metro.config.js" -Force


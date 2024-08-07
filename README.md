To obtain the **Client_id**, **Tenant_id**, and **Secret_id** from Microsoft Azure, you need to create an App Registration in Azure Active Directory.
Here are the detailed steps to guide you through the process:

**Steps to Get Client_id, Tenant_id, and Secret_id:**
Log in to Azure Portal:

Go to the Azure Portal and log in with your Azure account.
Navigate to Azure Active Directory:

In the left-hand navigation pane, click on "Azure Active Directory".
Create a New App Registration:

In the Azure Active Directory page, select "App registrations" from the menu.
Click on the "New registration" button at the top.
Register the Application:

Name: Enter a name for your application.
Supported account types: Choose an option that fits your scenario (e.g., "Accounts in this organizational directory only").
Redirect URI (optional): You can leave this blank for now or provide a URI if you have a specific redirect URI.
Click on the "Register" button to create the application.

Get the Client_id (Application ID):

After registering the application, you will be taken to the application's overview page.
The Client_id (Application ID) will be displayed on this page. Copy and save it.
Get the Tenant_id:

The Tenant_id (Directory ID) is also displayed on the application's overview page. Copy and save it.
Create a Client Secret (Secret_id):

In the left-hand menu, select "Certificates & secrets".
Under "Client secrets", click on the "New client secret" button.
Provide a description for the secret and set an expiration period.
Click on "Add".
The secret value will be displayed only once, so copy and save it immediately. This is your Secret_id.

**Summary of Information:**
Client_id: Application (client) ID
Tenant_id: Directory (tenant) ID
Secret_id: The value of the client secret you created

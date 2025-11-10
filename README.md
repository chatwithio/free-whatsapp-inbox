# 📨 Free WhatsApp Inbox
A free and open-source inbox system to receive, view, and reply to WhatsApp messages using the 360dialog API.
---
## ✨ Features
- 🔐 Secure login with user authentication.
- 🟢 Direct connection with 360dialog WhatsApp API.
- 🧵 Conversations grouped by number.
- 📥 Real-time message display with automatic updates.
- ✍️ Send messages directly from the panel.
- 📂 Infinite scroll to progressively load old messages.
- 🔑 Token authentication (INBOX-SERVICES-TOKEN) per user.
- 📱 Responsive interface.
- 🔁 Webhook ready to receive templates.
---
## 📦 Requirements
- Node.js `>=18`
- Angular CLI `>=17`
- A [360dialog](https://www.360dialog.com/) account with a connected WhatsApp number
- Be registered at https://services.tochat.be and have your WhatsApp API Key configured in our system. [Quick Access](https://services.tochat.be/es/app/profile/integrations/whatsapp/edit)
---
## 🛠 Installation
### 1. Clone the repository
```bash
git clone https://github.com/chatwithio/free-whatsapp-inbox.git
cd free-whatsapp-inbox
```
### 2. Install dependencies
```bash
npm install
```
### 3. Configure environment variables
Configure the environment.ts file:
- Leave the backendBaseUrl as it comes by default.
### 4. Configure callback URL in 360Dialog
1. Access integrations > 360dialog > Whatsapp Inbox (https://services.tochat.be/es/app/profile/whatsapp-inbox-config)
2. Under the label "Set this url for your webhook in 360 Dialog" the URL appears. Copy it.
3. Run the following command in the terminal to change the 360Dialog callback URL:
```bash
curl --request POST \
  --url https://waba-v2.360dialog.io/v1/configs/webhook \
  --header 'Content-Type: application/json' \
  --header 'D360-Api-Key: YOUR_360_API_KEY' \
  --data '{"url": "THE_URL_COPIED_IN_THE_PREVIOUS_STEP"}'
```
### 🔐 Authentication
The application requires login to access the inbox:
1. Users must have an account at https://services.tochat.be
2. Login with the same credentials (email/password)
3. The system will automatically retrieve the user's WhatsApp inbox token
4. Only users with WhatsApp inbox configured can access
### 🖼 Change the logo
The logo is located in the `<header>` component, specifically in the following line:
```html
<img src="/assets/chatwith-logo-min.svg" alt="ChatWith Logo">
```
To customize it:
1. Replace the src attribute URL with your own logo (it can be an external URL or a local image).
2. If you use a local image, place it in the project's src/assets/ directory and use a relative path: 
```html
<img src="/assets/logo.svg" alt="Your Logo">
```
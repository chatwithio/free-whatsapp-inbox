# 📨 Free WhatsApp Inbox

Un sistema de bandeja de entrada gratuito y open-source para recibir, visualizar y responder mensajes de WhatsApp usando la API de 360dialog.

---

## ✨ Características

- 🟢 Conexión directa con la API de WhatsApp de 360dialog.
- 🧵 Conversaciones agrupadas por número.
- 📥 Visualización en tiempo real de mensajes con actualización automática.
- ✍️ Envío de mensajes directamente desde el panel.
- 📂 Infinite scroll para cargar mensajes antiguos de forma progresiva.
- 🔑 Autenticación por token (INBOX-SERVICES-TOKEN) por cada usuario.
- 📱 Interfaz responsive.
- 🔁 Webhook preparado para recibir plantillas.

---

## 📦 Requisitos

- Node.js `>=18`
- Angular CLI `>=17`
- Una cuenta de [360dialog](https://www.360dialog.com/) con un número de WhatsApp conectado
- Estar registrado en https://services.tochat.be y tener configurada tu WhatsApp API Key en nuestro sistema. [Acceso Rápido](https://services.tochat.be/es/app/profile/integrations/whatsapp/edit)

---

## 🛠 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/chatwithio/free-whatsapp-inbox.git
cd free-whatsapp-inbox
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Configurar archivo environment.ts:

- El backendBaseUrl lo dejamos como viene por defecto.
- Modificamos el inboxServicesToken, para ello: 
    1. Vamos a nuestra cuenta de https://services.tochat.be
    2. Accedemos a integraciones > 360dialog > Whatsapp Inbox (https://services.tochat.be/es/app/profile/whatsapp-inbox-config)
    3. Nos aparece nuestro token bajo la etiqueta: "Use this token in your inbox library". Lo copiamos.
    4. Lo pegamos en nuestro archivo environment.ts

### 4. Configurar callback URL en 360Dialog

1. Accedemos a integraciones > 360dialog > Whatsapp Inbox (https://services.tochat.be/es/app/profile/whatsapp-inbox-config)
2. Bajo la etiqueta "Set this url for your webhook in 360 Dialog" aparece la URL. La copiamos.
3. Ejecutamos el siguiente comando en la terminal para cambiar el callback URL de 360Dialog:
```bash
curl --request POST \
  --url https://waba-v2.360dialog.io/v1/configs/webhook \
  --header 'Content-Type: application/json' \
  --header 'D360-Api-Key: TU_API_KEY_DE_360' \
  --data '{"url": "LA_URL_COPIADA_EN_EL_PASO_ANTERIOR"}'
```

### 🖼 Cambiar el logo

El logo se encuentra en el componente `<header>`, concretamente en la siguiente línea:

```html
<img src="/assets/chatwith-logo-min.svg" alt="ChatWith Logo">
```

Para personalizarlo:

1. Sustituye la URL del atributo src por la de tu propio logo (puede ser una URL externa o una imagen local).
2. Si usas una imagen local, colócala en el directorio src/assets/ del proyecto y usa una ruta relativa: 

```html
<img src="/assets/logo.svg" alt="Tu Logo">
```




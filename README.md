# 📨 Free WhatsApp Inbox

Un sistema de bandeja de entrada gratuito y open-source para recibir, visualizar y responder mensajes de WhatsApp usando la API de 360dialog.

![Screenshot](https://raw.githubusercontent.com/chatwithio/free-whatsapp-inbox/refs/heads/main/public/Inbox_Whatsapp.png)
---

## ✨ Características

- 🟢 Conexión con la API de WhatsApp de 360dialog.
- 🧵 Conversaciones agrupadas por número.
- 📥 Visualización en tiempo real de mensajes.
- ✍️ Envío de mensajes directamente desde el panel.
- 🗂 Interfaz tipo chat sencilla y moderna.
- 📱 Vista responsive adaptada a móvil (WhatsApp style).
- 🔌 Backend en Symfony + almacenamiento en base de datos.
- 🔁 Webhook con reenvío a sistemas externos como Bloomreach.

---

## 🚀 Demo rápida

Puedes ver una demo funcionando en:  
🔗 [https://free-whatsapp-inbox.vercel.app](https://free-whatsapp-inbox.vercel.app)

---

## 📦 Requisitos

- Node.js `>=18`
- Angular CLI `>=17`
- Symfony `>=6` (opcional si conectas a tu propio backend)
- Base de datos MySQL o SQLite
- Una cuenta de [360dialog](https://www.360dialog.com/) con un número de WhatsApp conectado

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

### 3. Ejecutar el entorno local

```bash
ng serve
```

### 🖼 Cambiar el logo

El logo se encuentra en el componente `<header>`, concretamente en la siguiente línea:

```html
<img src="https://dstatic.w2m.com/assets/flowo/dist/flowo/logo/logo.svg" alt="Logo Flowo">
```

Para personalizarlo:

1. Sustituye la URL del atributo src por la de tu propio logo (puede ser una URL externa o una imagen local).
2. Si usas una imagen local, colócala en el directorio src/assets/ del proyecto y usa una ruta relativa: 

```html
<img src="assets/logo.svg" alt="Tu Logo">
```




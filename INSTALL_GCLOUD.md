# 📥 Instalación de Google Cloud SDK (gcloud CLI)

## ✅ Sí, se instala a nivel GLOBAL

Google Cloud SDK (`gcloud`) es una herramienta de línea de comandos que se instala a nivel del sistema operativo, **NO** como dependencia del proyecto.

---

## 🪟 Windows: Opciones de Instalación

### Opción 1: Instalador Oficial (Recomendado)

1. **Descarga el instalador**:
   - Ve a: https://cloud.google.com/sdk/docs/install
   - Descarga: **Google Cloud SDK Installer para Windows**

2. **Ejecuta el instalador**:
   - Sigue el asistente
   - Selecciona instalar todo (incluye `gcloud`, `gsutil`, `bq`)
   - Se instalará en: `C:\Program Files (x86)\Google\Cloud SDK\`

3. **Verifica instalación**:
   ```powershell
   gcloud --version
   ```

4. **Login**:
   ```powershell
   gcloud auth login
   ```

5. **Configurar proyecto**:
   ```powershell
   gcloud config set project cinexion8n
   ```

---

### Opción 2: Chocolatey (Si ya lo usas)

```powershell
choco install gcloudsdk
```

Luego:
```powershell
gcloud auth login
gcloud config set project cinexion8n
```

---

### Opción 3: Usar Cloud Shell (SIN instalar nada)

Si prefieres **NO instalar nada** en tu máquina, puedes usar **Google Cloud Shell** directamente desde el navegador:

1. Ve a: https://console.cloud.google.com/
2. Haz clic en el ícono **>_** (Cloud Shell) en la barra superior
3. Se abre un terminal en el navegador con `gcloud` pre-instalado
4. Sube tu código ahí o clona desde GitHub
5. Ejecuta el deploy desde Cloud Shell

**Ventaja**: No instalas nada localmente  
**Desventaja**: Tienes que subir/descargar archivos desde Cloud Shell

---

## 🚀 Después de Instalar

Una vez instalado, desde cualquier terminal/PowerShell puedes ejecutar:

```powershell
# Login (primera vez)
gcloud auth login

# Configurar proyecto
gcloud config set project cinexion8n

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Deploy del motor Python
cd financial_engine_py
gcloud run deploy financial-engine \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi
```

---

## ❓ ¿No quieres instalar gcloud?

Si prefieres **NO instalar nada**, puedes usar:

1. **Render.com** (gratis, sin instalación, desde navegador)
2. **Railway.app** (gratis inicialmente, sin instalación)
3. **Google Cloud Shell** (terminal en el navegador)

¿Quieres que te guíe con alguna de estas alternativas?


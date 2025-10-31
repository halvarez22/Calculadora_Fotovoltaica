# 🔍 Verificar si gcloud está Instalado

## Problema Detectado

El comando `gcloud` no se reconoce en PowerShell. Esto significa que:
- ✅ Te autenticaste en el navegador
- ❌ Pero `gcloud CLI` no está instalado localmente

---

## Opciones para Resolver

### Opción 1: Instalar Google Cloud SDK (Recomendado)

1. **Descarga el instalador**:
   - Ve a: https://cloud.google.com/sdk/docs/install#windows
   - Descarga: **GoogleCloudSDKInstaller.exe**

2. **Ejecuta el instalador**:
   - Sigue el asistente
   - Asegúrate de marcar "Add Cloud SDK tools to PATH"
   - Esto agregará `gcloud` al PATH de Windows

3. **Reinicia PowerShell** después de la instalación

4. **Verifica instalación**:
   ```powershell
   gcloud --version
   ```

5. **Login** (si no lo has hecho):
   ```powershell
   gcloud auth login
   ```

6. **Configura proyecto**:
   ```powershell
   gcloud config set project cinexion8n
   ```

---

### Opción 2: Usar Render.com (SIN Instalar Nada)

Si prefieres **NO instalar** Google Cloud SDK, puedes usar **Render.com** que es igual de fácil y no requiere instalación local:

1. Ve a: https://render.com
2. Crea cuenta (puedes usar GitHub para login rápido)
3. **New** → **Web Service**
4. Conecta tu repositorio GitHub (si está ahí) o sube el código
5. Configuración:
   - **Root Directory**: `financial_engine_py`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd src && python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Environment Variable**: `PYTHONPATH=/opt/render/project/src`
6. **Create Web Service**
7. Render te dará una URL automáticamente
8. Configura esa URL en Vercel como `VITE_PY_ENGINE_URL`

**Ventajas**:
- ✅ No necesitas instalar nada
- ✅ Deployment en 2 minutos
- ✅ Plan gratuito disponible

---

### Opción 3: Usar Google Cloud Shell (En el Navegador)

1. Ve a: https://console.cloud.google.com/
2. Haz clic en el ícono **>_** (Cloud Shell) arriba a la derecha
3. Se abre un terminal en el navegador
4. Ahí tienes `gcloud` preinstalado
5. Puedes clonar tu repo o subir archivos
6. Ejecuta el deploy desde ahí

---

## Mi Recomendación

**Si planeas usar Google Cloud frecuentemente**: 
→ Instala Google Cloud SDK (Opción 1)

**Si solo necesitas deployar este servicio ahora**:
→ Usa **Render.com** (Opción 2) - Más rápido, sin instalación

¿Cuál prefieres? Te guío paso a paso con la que elijas.


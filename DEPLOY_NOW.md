# 🚀 Deploy Ahora - Pasos Inmediatos

## ✅ Ya estás autenticado con gcloud!

Ahora sigue estos pasos en tu terminal PowerShell:

---

## Paso 1: Configurar el Proyecto

```powershell
gcloud config set project cinexion8n
```

---

## Paso 2: Habilitar APIs Necesarias

```powershell
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

Esto puede tardar 1-2 minutos.

---

## Paso 3: Deploy del Motor Python

```powershell
# Asegúrate de estar en la raíz del proyecto
cd C:\IA_Nubes\Foto_voltaic_Calculator

# Ve a la carpeta del motor Python
cd financial_engine_py

# Deploy a Cloud Run (esto toma 3-5 minutos)
gcloud run deploy financial-engine `
  --source . `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --memory 512Mi `
  --cpu 1 `
  --timeout 60s
```

**⏱️ Esto tomará 3-5 minutos.** Cloud Run construirá el Docker, subirá la imagen y la desplegará.

---

## Paso 4: Copiar la URL

Al final del deploy verás algo como:
```
Service URL: https://financial-engine-xxxxx-uc.a.run.app
```

**¡COPIA ESTA URL!** 🔗

---

## Paso 5: Configurar en Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto `Foto_voltaic_Calculator`
3. **Settings** → **Environment Variables**
4. Clic en **Add New**
5. Agrega:
   - **Key**: `VITE_PY_ENGINE_URL`
   - **Value**: `https://financial-engine-xxxxx-uc.a.run.app` (la URL que copiaste)
   - ✅ Production
   - ✅ Preview  
   - ✅ Development
6. Clic en **Save**
7. Ve a **Deployments** → selecciona el último → **⋯** → **Redeploy**

---

## Paso 6: ¡Verificar!

1. Abre tu app en Vercel
2. Sube un recibo CFE
3. Calcula financieros
4. Deberías ver el badge **🐍 Python** (indicando que usa el motor Python)

---

## 🆘 Si Algo Falla

### Error: "API not enabled"
Ejecuta de nuevo:
```powershell
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Error: "Permission denied"
Ejecuta:
```powershell
gcloud auth application-default login
```

### Ver logs del servicio
```powershell
gcloud run services logs read financial-engine --region us-central1 --limit 50
```

---

## ✅ ¡Listo!

Una vez completado, tu app estará funcionando en producción con el motor Python desplegado. 🎉


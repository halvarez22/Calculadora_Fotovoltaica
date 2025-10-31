# 🚀 Deployment Rápido - PASO A PASO

## ⚡ Opción Más Rápida: Google Cloud Run (5 minutos)

### Paso 1: Instalar Google Cloud SDK

Si no lo tienes:
```bash
# Windows: Descargar de https://cloud.google.com/sdk/docs/install
# O usar Chocolatey:
choco install gcloudsdk
```

### Paso 2: Login y Configurar Proyecto

```bash
# Login
gcloud auth login

# Configurar proyecto (ya tienes cinexion8n)
gcloud config set project cinexion8n
```

### Paso 3: Deploy Directo

```bash
# Desde la raíz del proyecto
cd financial_engine_py

# Deploy (esto construye y publica automáticamente)
gcloud run deploy financial-engine \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s
```

**⏱️ Esto toma ~3-5 minutos**

### Paso 4: Obtener URL

Al final del deploy, verás algo como:
```
Service URL: https://financial-engine-xxxxx-uc.a.run.app
```

**Copia esta URL** 🔗

### Paso 5: Configurar en Vercel

1. Ve a https://vercel.com
2. Selecciona tu proyecto `Foto_voltaic_Calculator`
3. Ve a **Settings** → **Environment Variables**
4. Crea nueva variable:
   - **Name**: `VITE_PY_ENGINE_URL`
   - **Value**: `https://financial-engine-xxxxx-uc.a.run.app` (la URL que copiaste)
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development
5. Haz clic en **Save**
6. Ve a **Deployments** y haz clic en **⋯** → **Redeploy** en el último deployment

**⏱️ Esto toma ~2-3 minutos**

### Paso 6: ¡Listo! 🎉

Abre tu app en Vercel y prueba:
1. Sube un recibo CFE
2. Calcula financieros
3. Deberías ver el badge **🐍 Python** (indicando que usa el motor Python)

---

## 🔍 Verificar que Funciona

Después del deploy, puedes probar el endpoint directamente:

```bash
curl https://financial-engine-xxxxx-uc.a.run.app/health
```

Deberías ver: `{"status":"ok"}`

---

## 🆘 Si Algo Fallara

### Fallback Automático
Si el motor Python no está disponible, la app automáticamente usa el motor TypeScript (fallback). **Nunca se romperá.**

### Logs del Servidor
Para ver logs del motor Python:
```bash
gcloud run services logs read financial-engine --region us-central1
```

### Logs de Vercel
En Vercel Dashboard → Deployments → selecciona deployment → Functions Logs

---

## 💰 Costo

**Google Cloud Run**: 
- **Gratis** hasta 2 millones de requests/mes
- **$0.40/millón** después
- **Sin cargo** por tiempo de inactividad

Para una app en desarrollo/prueba, **será completamente gratis**.

---

## ✅ Checklist

- [ ] Google Cloud SDK instalado y configurado
- [ ] Motor Python deployado a Cloud Run
- [ ] URL del servicio obtenida
- [ ] Variable `VITE_PY_ENGINE_URL` configurada en Vercel
- [ ] Frontend re-deployed en Vercel
- [ ] Prueba exitosa en producción

**¡Listo para producción!** 🚀


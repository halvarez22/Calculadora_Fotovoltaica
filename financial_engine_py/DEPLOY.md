# 🚀 Guía de Deployment del Motor Financiero Python

## Opción 1: Google Cloud Run (Recomendado)

### Prerequisitos
1. Tener cuenta en Google Cloud (ya tienes `cinexion8n`)
2. Tener instalado Google Cloud SDK (`gcloud`)
3. Tener Docker instalado

### Paso 1: Configurar proyecto en GCP

```bash
# Login a Google Cloud
gcloud auth login

# Configurar proyecto
gcloud config set project cinexion8n

# Habilitar APIs necesarias
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### Paso 2: Build y deploy

**Opción A: Usando Cloud Build (automático)**

```bash
# Desde la raíz del proyecto
cd financial_engine_py

# Build y deploy en un solo comando
gcloud run deploy financial-engine \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1
```

**Opción B: Build local con Docker**

```bash
# Build de la imagen
docker build -t financial-engine:latest .

# Tag para Google Container Registry
docker tag financial-engine:latest gcr.io/cinexion8n/financial-engine:latest

# Push a GCR
docker push gcr.io/cinexion8n/financial-engine:latest

# Deploy a Cloud Run
gcloud run deploy financial-engine \
  --image gcr.io/cinexion8n/financial-engine:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1
```

### Paso 3: Obtener URL del servicio

Después del deploy, Google Cloud te dará una URL tipo:
```
https://financial-engine-xxxxx-uc.a.run.app
```

### Paso 4: Configurar en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Variable**: `VITE_PY_ENGINE_URL`
   - **Value**: `https://financial-engine-xxxxx-uc.a.run.app` (la URL de Cloud Run)
   - **Environment**: Production, Preview, Development

4. Re-deploy la aplicación en Vercel

---

## Opción 2: Render.com (Más simple, gratis)

### Paso 1: Crear cuenta en Render.com

1. Ve a https://render.com
2. Conecta con GitHub (si tu código está en GitHub) o crea cuenta

### Paso 2: Crear nuevo Web Service

1. Dashboard → New → Web Service
2. Conecta tu repositorio
3. Configuración:
   - **Name**: `financial-engine`
   - **Region**: US East (o el más cercano)
   - **Branch**: `main`
   - **Root Directory**: `financial_engine_py`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd src && python -m uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Environment Variables**:
     - `PYTHONPATH=/opt/render/project/src`

### Paso 3: Obtener URL

Render te dará una URL tipo:
```
https://financial-engine.onrender.com
```

### Paso 4: Configurar en Vercel (igual que Cloud Run)

---

## Opción 3: Railway.app (Muy simple)

1. Ve a https://railway.app
2. New Project → Deploy from GitHub repo
3. Selecciona `financial_engine_py` como raíz
4. Railway detecta automáticamente Python y requirements.txt
5. Agrega variable de entorno: `PYTHONPATH=/app/src`
6. Railway te da una URL automáticamente
7. Configura en Vercel

---

## Verificación

Después del deploy, verifica que el servicio esté funcionando:

```bash
# Test del endpoint
curl https://tu-url-del-servicio.run.app/calculate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"kWp": 500, "performance_ratio": 0.82, "degradacion_solar_anual": 0.007, "opex_anual": 80000, "vida_proyecto_anos": 25, "modo": "CAPEX", "capex": 8000000}'
```

Deberías recibir una respuesta JSON con los KPIs.

---

## Troubleshooting

### Error: CORS blocked
- Verifica que `server.py` tenga CORS configurado para `allow_origins=["*"]` o específicamente tu dominio de Vercel

### Error: Module not found
- Verifica que `PYTHONPATH` esté configurado correctamente
- Verifica que todos los archivos de `src/` estén copiados en el Dockerfile

### Error: Timeout
- Aumenta el timeout en Cloud Run: `--timeout 60s`
- Aumenta memoria: `--memory 1Gi`


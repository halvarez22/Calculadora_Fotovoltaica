# ⚠️ Error de Facturación Detectado

## El Problema

Google Cloud Run requiere **facturación habilitada**, aunque tenga tier gratuito.

---

## 🔄 Opciones para Resolver

### Opción A: Habilitar Facturación en Google Cloud (Requiere tarjeta)

1. Ve a: https://console.cloud.google.com/billing
2. Crea una cuenta de facturación
3. Vincula una tarjeta de crédito
4. **⚠️ Importante**: Google da **$300 gratis por 3 meses**
5. Después del tier gratuito, Cloud Run tiene:
   - **2 millones de requests gratis/mes**
   - Solo pagas si superas ese límite
   - Para una app de prueba, será **gratis prácticamente siempre**

**Una vez hecho esto**, vuelve a ejecutar:
```powershell
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

---

### Opción B: Usar Render.com (SIN Facturación) ⭐ RECOMENDADO

**Ventajas**:
- ✅ NO requiere tarjeta de crédito
- ✅ NO requiere configurar facturación
- ✅ Plan gratuito disponible
- ✅ Más rápido de configurar (2 minutos)
- ✅ Deployment automático desde GitHub

**Pasos**:

1. **Crear cuenta en Render.com**:
   - Ve a: https://render.com
   - Click en **Get Started for Free**
   - Puedes usar GitHub para login rápido

2. **Nuevo Web Service**:
   - Dashboard → **New** → **Web Service**
   - **Connect GitHub** (o sube el código manualmente)
   - Si usas GitHub, selecciona tu repositorio

3. **Configuración**:
   - **Name**: `financial-engine`
   - **Region**: `Oregon (US West)` o el más cercano
   - **Branch**: `main` (o la rama que uses)
   - **Root Directory**: `financial_engine_py` ⚠️ IMPORTANTE
   - **Runtime**: `Python 3`
   - **Build Command**: 
     ```
     pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```
     cd src && python -m uvicorn server:app --host 0.0.0.0 --port $PORT
     ```
   - **Environment Variables**:
     - Click en **Add Environment Variable**
     - Key: `PYTHONPATH`
     - Value: `/opt/render/project/src`

4. **Deploy**:
   - Click en **Create Web Service**
   - Render construirá y desplegará automáticamente (2-3 minutos)

5. **Obtener URL**:
   - Al final del deploy verás: `https://financial-engine.onrender.com` (o similar)
   - **Copia esta URL** 🔗

6. **Configurar en Vercel**:
   - Ve a Vercel Dashboard
   - Settings → Environment Variables
   - Agrega: `VITE_PY_ENGINE_URL` = la URL de Render
   - Re-deploy

---

## 🎯 Mi Recomendación

**Para deployment rápido y sin complicaciones**: 
→ **Usa Render.com (Opción B)** 

Es más rápido, no requiere tarjeta, y funciona perfectamente para tu caso.

**Si planeas usar Google Cloud a largo plazo**:
→ Configura facturación (tendrás $300 gratis por 3 meses)

---

## ✅ ¿Qué Prefieres?

1. **Render.com** (2 minutos, sin tarjeta) ⭐
2. **Google Cloud** (configurar facturación, $300 gratis)

Te guío paso a paso con la que elijas.


# 📦 Guía Completa de Deployment

## Estado Actual

- ✅ **Frontend React/TypeScript**: En Vercel
- ⚠️ **Motor Python**: Solo local (localhost:8000)

## Objetivo

Publicar el motor Python para que el frontend en Vercel pueda usarlo.

---

## 🎯 Opción Recomendada: Google Cloud Run

Ya tienes cuenta en GCP (`cinexion8n`), así que es la opción más directa.

### Pasos Rápidos

1. **Preparar Docker** (ya está listo con `Dockerfile`)

2. **Deploy a Cloud Run**:
```bash
cd financial_engine_py
gcloud run deploy financial-engine \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi
```

3. **Obtener URL** (ejemplo: `https://financial-engine-xxxxx-uc.a.run.app`)

4. **Configurar en Vercel**:
   - Ve a tu proyecto en Vercel Dashboard
   - Settings → Environment Variables
   - Agrega: `VITE_PY_ENGINE_URL` = `https://financial-engine-xxxxx-uc.a.run.app`
   - Re-deploy

### Configuración CORS

El servidor ya está configurado para aceptar peticiones de cualquier origen (`allow_origins=["*"]`), así que no hay problema con CORS.

---

## 🔄 Fallback Automático

Si `VITE_PY_ENGINE_URL` no está configurado o el servidor Python no está disponible, la aplicación automáticamente usa el **motor TypeScript** como fallback. Esto garantiza que siempre funcione.

---

## 🧪 Probar en Producción

1. Deploy del motor Python (Cloud Run / Render / Railway)
2. Configurar `VITE_PY_ENGINE_URL` en Vercel
3. Re-deploy del frontend en Vercel
4. Abrir la app en Vercel
5. Subir un recibo CFE
6. Calcular financieros
7. Verificar que aparezca el badge "🐍 Python" (indicando que usa el motor Python)

---

## 📝 Checklist de Deployment

- [ ] Motor Python deployado y accesible (URL obtenida)
- [ ] Variable `VITE_PY_ENGINE_URL` configurada en Vercel
- [ ] Frontend re-deployed en Vercel
- [ ] Prueba de cálculo financiero exitosa
- [ ] Verificación de descarga Excel/PDF funcionando

---

## 💰 Costos Estimados

- **Google Cloud Run**: Gratis hasta 2 millones de requests/mes (más que suficiente)
- **Render.com**: Plan gratuito con sleep después de inactividad
- **Railway.app**: $5/mes para evitar sleep

Para producción, **Cloud Run es la mejor opción** (gratis y sin sleep).


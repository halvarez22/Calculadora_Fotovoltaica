# 🚀 Deploy en Render.com - Guía Paso a Paso

## ✅ Opción Recomendada: Render.com (Sin Facturación)

---

## Paso 1: Crear Cuenta

1. Ve a: https://render.com
2. Click en **Get Started for Free**
3. **Sign up with GitHub** (más rápido) o crea cuenta con email

---

## Paso 2: Nuevo Web Service

1. En el Dashboard, click en **New** → **Web Service**

---

## Paso 3: Conectar Repositorio

### Si tu código está en GitHub:
1. Click en **Connect GitHub**
2. Autoriza Render
3. Selecciona tu repositorio `Foto_voltaic_Calculator`

### Si NO está en GitHub:
1. Puedes subir el código manualmente
2. O conecta GitHub primero y luego sube

---

## Paso 4: Configuración del Servicio

Llena estos campos:

- **Name**: `financial-engine`
- **Region**: `Oregon (US West)` (o el más cercano a ti)
- **Branch**: `main` (o tu rama principal)
- **Root Directory**: `financial_engine_py` ⚠️ **MUY IMPORTANTE**

**Build Settings**:
- **Runtime**: `Python 3`
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  cd src && python -m uvicorn server:app --host 0.0.0.0 --port $PORT
  ```

**Environment Variables**:
- Click en **Add Environment Variable**
- **Key**: `PYTHONPATH`
- **Value**: `/opt/render/project/src`
- Click en **Add**

---

## Paso 5: Crear el Servicio

1. Revisa toda la configuración
2. Click en **Create Web Service**
3. Render comenzará a construir y desplegar (2-3 minutos)

---

## Paso 6: Obtener URL

Una vez que el deploy termine (verás un ✅ verde):

1. Verás una URL tipo: `https://financial-engine.onrender.com`
2. **COPIA ESTA URL COMPLETA** 🔗
3. Esta es la URL de tu motor Python

---

## Paso 7: Configurar en Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **Foto_voltaic_Calculator**
3. **Settings** → **Environment Variables**
4. Click en **Add New**
5. Agrega:
   - **Key**: `VITE_PY_ENGINE_URL`
   - **Value**: Pega la URL de Render (ej: `https://financial-engine.onrender.com`)
   - Marca: ✅ Production, ✅ Preview, ✅ Development
6. Click en **Save**
7. Ve a **Deployments** → selecciona el último → **⋯** → **Redeploy**

---

## Paso 8: ¡Probar!

1. Abre tu app en Vercel
2. Sube un recibo CFE
3. Calcula financieros
4. Deberías ver el badge **🐍 Python** ✅

---

## 💰 Costos

**Plan Gratuito de Render**:
- ✅ Gratis para siempre
- ⚠️ El servicio "duerme" después de 15 minutos de inactividad
- ⚠️ Primera petición después de dormir puede tardar ~30 segundos (cold start)
- Para producción, puedes actualizar a plan de pago ($7/mes) para evitar sleep

**Para desarrollo/prueba, el plan gratuito es perfecto.**

---

## ✅ Checklist

- [ ] Cuenta creada en Render.com
- [ ] Web Service creado
- [ ] Deploy completado
- [ ] URL del servicio copiada
- [ ] Variable `VITE_PY_ENGINE_URL` configurada en Vercel
- [ ] Frontend re-deployed en Vercel
- [ ] Prueba exitosa

---

## 🆘 Si Algo Falla

### Error: "Module not found"
- Verifica que `Root Directory` sea `financial_engine_py`
- Verifica que `PYTHONPATH` esté configurado correctamente

### El servicio no inicia
- Revisa los logs en Render Dashboard
- Verifica que `Start Command` esté correcto

### CORS errors
- El servidor ya está configurado para aceptar cualquier origen

---

**¡Listo! Esto debería funcionar perfectamente.** 🚀


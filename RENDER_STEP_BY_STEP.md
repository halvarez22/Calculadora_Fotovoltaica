# 🚀 Render.com - Guía Paso a Paso

## ✅ Pasos Detallados para Deploy

---

## 🔹 Paso 1: Crear Cuenta en Render

1. Ve a: **https://render.com**
2. Click en **Get Started for Free** (botón grande en el centro)
3. Elige una opción:
   - **"Sign up with GitHub"** ⭐ (Más rápido, recomiendo este)
   - O crea cuenta con email

---

## 🔹 Paso 2: Crear Nuevo Web Service

1. Una vez en el Dashboard, click en el botón azul **New +**
2. Selecciona **Web Service**

---

## 🔹 Paso 3: Conectar Repositorio

### Opción A: Si tu código está en GitHub ⭐

1. Click en **Connect GitHub** (o **Connect GitLab** si usas GitLab)
2. Autoriza Render.com
3. Busca tu repositorio `Foto_voltaic_Calculator` (o como se llame)
4. Selecciónalo

### Opción B: Si NO está en GitHub

Puedes:
- Subir el código manualmente en Render
- O crear un repo en GitHub primero (recomendado)

---

## 🔹 Paso 4: Configuración del Servicio

Llena estos campos **exactamente así**:

### Información Básica:
- **Name**: `financial-engine`
- **Region**: `Oregon (US West)` (o elige el más cercano a ti)

### Repositorio:
- **Branch**: `main` (o la rama que uses)
- **Root Directory**: `financial_engine_py` ⚠️ **MUY IMPORTANTE - Este debe ser exactamente así**

### Build Settings:
- **Runtime**: `Python 3`
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  cd src && python -m uvicorn server:app --host 0.0.0.0 --port $PORT
  ```

### Environment Variables:
1. Click en **Add Environment Variable**
2. **Key**: `PYTHONPATH`
3. **Value**: `/opt/render/project/src`
4. Click en **Add**

---

## 🔹 Paso 5: Plan (Gratis está bien)

- Selecciona **Free** (suficiente para pruebas)
- Para producción después puedes actualizar a **Starter** ($7/mes) para evitar sleep

---

## 🔹 Paso 6: Crear el Servicio

1. Revisa toda la configuración
2. Click en el botón azul **Create Web Service** (abajo a la derecha)
3. Render comenzará a construir automáticamente

**⏱️ Esto tomará 2-4 minutos**

Verás un log en tiempo real del proceso:
- Instalando dependencias
- Construyendo...
- Desplegando...

---

## 🔹 Paso 7: Obtener la URL

Una vez que veas **✅ Live** (en verde) arriba del todo:

1. La URL estará visible en la parte superior, tipo:
   ```
   https://financial-engine.onrender.com
   ```
2. **COPIA ESTA URL COMPLETA** 🔗
3. Esta es la URL de tu motor Python

---

## 🔹 Paso 8: Configurar en Vercel

1. Ve a: **https://vercel.com/dashboard**
2. Selecciona tu proyecto **Foto_voltaic_Calculator**
3. Ve a **Settings** (engranaje ⚙️ en la parte superior)
4. En el menú lateral, click en **Environment Variables**
5. Click en el botón **Add New**
6. Completa:
   - **Key**: `VITE_PY_ENGINE_URL`
   - **Value**: Pega la URL completa de Render (ej: `https://financial-engine.onrender.com`)
   - Marca los checkboxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
7. Click en **Save**

---

## 🔹 Paso 9: Re-deploy en Vercel

1. Ve a **Deployments** (en el menú lateral de Vercel)
2. Selecciona el último deployment
3. Click en los **⋯** (tres puntos)
4. Selecciona **Redeploy**
5. Confirma

**⏱️ Esto tomará 1-2 minutos**

---

## 🔹 Paso 10: ¡Probar!

1. Abre tu app en Vercel (la URL de tu proyecto)
2. Sube un recibo CFE (imagen o PDF)
3. Ve a la sección "Motor Financiero"
4. Click en **Calcular**
5. Deberías ver el badge **🐍 Python** (indicando que usa el motor Python)
6. Los KPIs deberían calcularse correctamente

---

## 🆘 Si Algo Falla

### El servicio no inicia en Render:
- Revisa los **Logs** en Render Dashboard (tab Logs)
- Verifica que `Root Directory` sea exactamente `financial_engine_py`
- Verifica que `Start Command` esté correcto

### Error: "Module not found":
- Verifica que `PYTHONPATH` esté configurado: `/opt/render/project/src`
- Verifica que `requirements.txt` tenga todas las dependencias

### Error 503 en Render:
- El servicio gratuito puede "dormir" después de 15 min de inactividad
- La primera petición después puede tardar ~30 segundos
- Esto es normal en el plan gratuito

### CORS errors:
- El servidor ya está configurado para aceptar cualquier origen
- Si persiste, verifica que la URL en Vercel sea exacta (con https://)

---

## ✅ Checklist Final

- [ ] Cuenta creada en Render.com
- [ ] Web Service creado y configurado
- [ ] Root Directory: `financial_engine_py` ✅
- [ ] Start Command correcto ✅
- [ ] PYTHONPATH configurado ✅
- [ ] Deploy completado (status: Live)
- [ ] URL del servicio copiada
- [ ] Variable `VITE_PY_ENGINE_URL` configurada en Vercel
- [ ] Frontend re-deployed en Vercel
- [ ] Prueba exitosa en producción ✅

---

## 🎉 ¡Listo!

Una vez completado, tu aplicación estará funcionando completamente en producción:
- ✅ Frontend en Vercel
- ✅ Motor Python en Render.com
- ✅ Todo integrado y funcionando

**¡Avísame cuando llegues a algún paso o si tienes alguna duda!** 🚀


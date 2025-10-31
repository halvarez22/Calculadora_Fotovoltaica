# 🚀 Pasos de Deploy - Ejecutar en Orden

## ✅ gcloud está funcionando!

Ahora ejecuta estos comandos **UNO POR UNO** en tu terminal:

---

## Paso 1: Login (si no lo has hecho)
```powershell
gcloud auth login
```
Esto abrirá el navegador. Ya te autenticaste antes, así que probablemente verás "Ya estás autenticado".

---

## Paso 2: Configurar el Proyecto
```powershell
gcloud config set project cinexion8n
```

---

## Paso 3: Habilitar APIs Necesarias
```powershell
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

**Esto puede tardar 1-2 minutos.** Espera a que termine.

---

## Paso 4: Ir a la Carpeta del Motor Python
```powershell
cd C:\IA_Nubes\Foto_voltaic_Calculator\financial_engine_py
```

---

## Paso 5: Deploy a Cloud Run
```powershell
gcloud run deploy financial-engine --source . --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --cpu 1 --timeout 60s
```

**⏱️ Esto tomará 3-5 minutos.** Cloud Run:
- Construirá el Docker automáticamente
- Subirá la imagen
- La desplegará en Cloud Run

---

## Paso 6: Copiar la URL del Servicio

Al final del deploy verás algo como:
```
Service URL: https://financial-engine-xxxxx-uc.a.run.app
```

**¡COPIA ESTA URL COMPLETA!** 🔗

---

## Paso 7: Configurar en Vercel

1. Ve a: https://vercel.com/dashboard
2. Selecciona tu proyecto **Foto_voltaic_Calculator**
3. **Settings** → **Environment Variables**
4. Clic en **Add New**
5. Agrega:
   - **Key**: `VITE_PY_ENGINE_URL`
   - **Value**: Pega la URL que copiaste (ej: `https://financial-engine-xxxxx-uc.a.run.app`)
   - Marca: ✅ Production, ✅ Preview, ✅ Development
6. Clic en **Save**
7. Ve a **Deployments** → selecciona el último deployment → **⋯** → **Redeploy**

---

## Paso 8: ¡Listo! 🎉

Abre tu app en Vercel y prueba:
1. Sube un recibo CFE
2. Calcula financieros
3. Deberías ver el badge **🐍 Python**

---

## ⚠️ Si algo falla

### "API not enabled"
Ejecuta de nuevo el Paso 3

### "Permission denied"
Ejecuta:
```powershell
gcloud auth application-default login
```

### Ver logs
```powershell
gcloud run services logs read financial-engine --region us-central1 --limit 50
```

---

## 📝 Ejecuta los comandos en orden

Copia y pega cada comando, espera a que termine antes de pasar al siguiente.

¡Vamos! 🚀


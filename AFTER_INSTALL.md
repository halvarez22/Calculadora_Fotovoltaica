# ✅ Después de Instalar Google Cloud SDK

## ❌ NO necesitas reiniciar la computadora

Solo necesitas **cerrar y volver a abrir PowerShell** para que el PATH se actualice.

---

## Pasos Rápidos

### 1. Cierra PowerShell Actual
- Cierra todas las ventanas de PowerShell abiertas

### 2. Abre PowerShell Nuevamente
- Abre una nueva ventana de PowerShell
- Esto permite que Windows cargue el PATH actualizado

### 3. Verifica Instalación
```powershell
gcloud --version
```

Deberías ver algo como:
```
Google Cloud SDK 450.0.0
bq 2.0.112
core 2024.01.26
gsutil 5.27
```

### 4. Login (si no lo hiciste antes)
```powershell
gcloud auth login
```

Esto abrirá tu navegador para autenticarte.

### 5. Configura el Proyecto
```powershell
gcloud config set project cinexion8n
```

### 6. Verifica que está configurado
```powershell
gcloud config get-value project
```

Debería mostrar: `cinexion8n`

---

## ⚠️ Si gcloud sigue sin funcionar

Si después de cerrar/abrir PowerShell `gcloud` aún no se reconoce:

### Opción 1: Agregar manualmente al PATH
1. Busca "Variables de entorno" en el menú de Windows
2. Edita la variable PATH del sistema
3. Agrega: `C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin`
4. Guarda y cierra/abre PowerShell de nuevo

### Opción 2: Reiniciar Windows
Solo si la opción 1 no funciona, reinicia Windows.

---

## ✅ Listo para Deploy

Una vez que `gcloud --version` funcione, puedes proceder con el deploy:

```powershell
# Habilitar APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# Deploy
cd financial_engine_py
gcloud run deploy financial-engine `
  --source . `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --memory 512Mi
```

---

## 🚀 En Resumen

- ✅ Cierra PowerShell
- ✅ Abre PowerShell nuevo  
- ✅ `gcloud --version` para verificar
- ❌ NO necesitas reiniciar Windows (solo el terminal)


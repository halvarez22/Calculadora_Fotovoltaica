# 📤 Subir Código a GitHub

## El Problema

Render dice: "Your service has not been deployed because the GitHub repository is empty."

Esto significa que necesitas subir tu código a GitHub.

---

## Paso 1: Verificar si tienes Git inicializado

Abre PowerShell en tu carpeta del proyecto:
```powershell
cd C:\IA_Nubes\Foto_voltaic_Calculator
git status
```

---

## Paso 2: Si NO tienes Git inicializado

```powershell
# Inicializar Git
git init

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "Initial commit: Motor financiero Python + Frontend React"
```

---

## Paso 3: Conectar con GitHub

```powershell
# Agregar el repositorio remoto (reemplaza con tu URL si es diferente)
git remote add origin https://github.com/halvarez22/CotizadorVoltaic.git

# Verificar
git remote -v
```

---

## Paso 4: Subir el código

```powershell
# Subir código (primera vez)
git push -u origin main
```

Si tu rama principal es `master` en lugar de `main`:
```powershell
git branch -M main
git push -u origin main
```

---

## Paso 5: Verificar en GitHub

1. Ve a: https://github.com/halvarez22/CotizadorVoltaic
2. Deberías ver todos tus archivos subidos

---

## Paso 6: Deploy Automático en Render

Una vez que el código esté en GitHub:
1. Ve de vuelta a Render Dashboard
2. Render debería detectar automáticamente el nuevo commit
3. O haz clic en **Manual Deploy** → **Deploy latest commit**

---

## ⚠️ Si tienes problemas con Git

### Error: "not a git repository"
Ejecuta `git init` primero

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/halvarez22/CotizadorVoltaic.git
```

### Error: "authentication failed"
1. GitHub ya no acepta contraseñas, necesitas un **Personal Access Token**
2. Ve a: https://github.com/settings/tokens
3. Generate new token → Classic
4. Selecciona: `repo` (todos los permisos de repos)
5. Copia el token
6. Cuando hagas `git push`, usa el token como contraseña

---

## ✅ Checklist

- [ ] Git inicializado (`git init`)
- [ ] Archivos agregados (`git add .`)
- [ ] Primer commit hecho
- [ ] Repositorio remoto conectado
- [ ] Código subido a GitHub
- [ ] Render detecta el nuevo código
- [ ] Deploy automático iniciado

---

**Una vez que subas el código a GitHub, Render automáticamente detectará el cambio y comenzará a desplegar.** 🚀


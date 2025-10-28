<div align="center">
  <h1>⚡ Calculadora Fotovoltaica Voltaic</h1>
  <p>Analizador inteligente de recibos CFE con IA de Gemini</p>
</div>

## 📋 Descripción

Calculadora Fotovoltaica Voltaic es una aplicación web que analiza recibos de la Comisión Federal de Electricidad (CFE) usando inteligencia artificial de Google Gemini. Extrae automáticamente información de consumo histórico, costos y detalles de facturación para ayudar en la planificación de instalaciones fotovoltaicas.

## ✨ Características

- 🤖 **Análisis con IA**: Usa Gemini 2.5 Flash para extraer datos de recibos CFE
- 📊 **Visualización de Datos**: Gráficos interactivos de consumo histórico
- 💾 **Persistencia de Datos**: Guarda análisis en Firebase Firestore
- 📱 **Diseño Responsivo**: Funciona en dispositivos móviles y desktop
- 🎨 **Tema Voltaic**: Diseño corporativo con efectos glassmorphism
- 📥 **Exportación de Datos**: Descarga información en formato Excel

## 🚀 Ejecutar Localmente

### Prerrequisitos
- Node.js (versión 18 o superior)
- API Key de Google Gemini
- Cuenta de Firebase (para persistencia de datos)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo-url>
cd Foto_voltaic_Calculator
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
   
   Crea un archivo `.env.local` en la raíz del proyecto:
```env
GEMINI_API_KEY=tu-api-key-de-gemini
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 🔥 Firebase Setup

Para que la persistencia de datos funcione, necesitas configurar Firebase:

1. Ve a [Firebase Console](https://console.firebase.google.com/project/calculadoravoltaic)
2. Crea una base de datos Firestore en modo prueba
3. Las credenciales ya están configuradas en `services/firebaseConfig.ts`

## 📦 Construcción para Producción

```bash
npm run build
```

Los archivos de producción estarán en la carpeta `dist/`

## 🚀 Desplegar en Vercel

### 1. Prepara tu repositorio GitHub

```bash
# Inicializar Git (si no está inicializado)
git init

# Agregar archivos
git add .

# Primer commit
git commit -m "Initial commit - Calculadora Fotovoltaica Voltaic"

# Agregar tu repositorio remoto
git remote add origin https://github.com/tu-usuario/tu-repo.git

# Push a GitHub
git push -u origin main
```

### 2. Configurar Vercel

1. Ve a [Vercel](https://vercel.com) e inicia sesión con GitHub
2. Importa tu repositorio
3. Agrega las variables de entorno:
   - `GEMINI_API_KEY`: Tu API key de Google Gemini
4. Deploy automático 🎉

### 3. Variables de Entorno en Vercel

En la configuración del proyecto en Vercel:
- **Variable**: `GEMINI_API_KEY`
- **Valor**: Tu API key de Gemini

## 🛠️ Tecnologías

- **React 19**: Framework UI
- **TypeScript**: Tipado estático
- **Vite**: Build tool
- **Tailwind CSS**: Estilos
- **Firebase Firestore**: Base de datos
- **Google Gemini AI**: Procesamiento de imágenes
- **Recharts**: Gráficos
- **XLSX**: Exportación a Excel

## 📱 Uso

1. Sube el **frente** de tu recibo CFE (imagen o PDF)
2. Sube el **reverso** de tu recibo CFE (imagen o PDF)
3. Haz clic en "Analizar Recibo"
4. Espera a que la IA procese los datos (barra de progreso)
5. Revisa el análisis con gráficos y detalles
6. Descarga los datos en Excel si lo necesitas
7. Consulta el historial de análisis en el botón de reloj

## 🎨 Paleta de Colores (Voltaic)

- **Amarillo Principal**: `#FFC107`
- **Azul Secundario**: `#0D47A1`
- **Fondo Oscuro**: `#0C1117`
- **Fondo Medio**: `#1C2734`

## 📄 Estructura del Proyecto

```
Foto_voltaic_Calculator/
├── components/          # Componentes React
│   ├── BillDisplay.tsx  # Visualización de datos
│   ├── ConsumptionChart.tsx  # Gráficos
│   ├── FileUpload.tsx  # Subida de archivos
│   └── ...
├── services/           # Servicios
│   ├── geminiService.ts  # API de Gemini
│   ├── firebaseConfig.ts  # Config de Firebase
│   └── historyService.ts  # Gestión de historial
├── public/             # Archivos estáticos
│   └── images/        # Logo de Voltaic
└── types.ts           # Tipos TypeScript
```

## 🔐 Seguridad

- Las variables de entorno NO se incluyen en el repositorio
- Datos de usuario almacenados en Firebase con sesión por navegador
- API keys configuradas en variables de entorno seguras

## 📝 Licencia

Powered By pai-b (Your Private Artificial Intelligence For Business) © Todos los derechos Reservados 2025

## 🤝 Contribuir

Este proyecto fue desarrollado para **Voltaic** - Soluciones Fotovoltaicas

---

**Nota**: Asegúrate de tener las credenciales de Firebase y Gemini configuradas antes de desplegar en producción.

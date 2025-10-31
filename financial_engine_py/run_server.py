#!/usr/bin/env python
"""Script para ejecutar el servidor FastAPI fácilmente."""
import sys
from pathlib import Path

# Verificar si estamos en un venv
venv_python = "venv" in sys.executable.lower() or ".venv" in sys.executable.lower()
if not venv_python:
    print("⚠️  ADVERTENCIA: No parece estar usando un venv activo.")
    print(f"   Python actual: {sys.executable}")
    print("   Activa el venv primero: .\\.venv\\Scripts\\activate.bat")
    print("   O ejecuta desde la raíz: ..\\..\\.venv\\Scripts\\python.exe run_server.py")
    sys.exit(1)

# Asegurar que el directorio src está en el path
project_root = Path(__file__).parent
src_dir = project_root / "src"
sys.path.insert(0, str(src_dir))

import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        app_dir=str(src_dir),
    )


# Motor Financiero (Python)

Módulo Python que reemplaza el Excel para cálculos financieros fotovoltaicos. Incluye modelos Pydantic, pipeline con Strategy (CAPEX/PPA), KPIs (VAN, TIR, Payback, ROI, LCOE) y tablas intermedias.

## Instalación rápida

```bash
python -m venv .venv
. .venv/Scripts/activate  # Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r financial_engine_py/requirements.txt
```

## Ejecutar el servidor API

**Método 1: Script batch (Windows - más fácil)**
```bash
# Desde la raíz del proyecto
start_py_server.bat
```

**Método 2: Desde la raíz con venv activado**
```bash
cd C:\IA_Nubes\Foto_voltaic_Calculator
.\.venv\Scripts\activate.bat
cd financial_engine_py\src
set PYTHONPATH=%CD%
python -m uvicorn server:app --reload --port 8000
```

**Método 3: Usando el script run_server.py**
```bash
cd C:\IA_Nubes\Foto_voltaic_Calculator
.\.venv\Scripts\activate.bat
.\.venv\Scripts\python.exe financial_engine_py\run_server.py
```

El servidor quedará en `http://localhost:8000`

## Ejemplo de uso

```bash
python financial_engine_py/examples/example_run.py
```

## Pruebas

```bash
cd financial_engine_py
pytest -q
```

## Estructura
- src/financial_engine/models.py: modelos de entrada/salida (Pydantic)
- src/financial_engine/pipeline.py: etapas del pipeline y estrategias
- src/financial_engine/engine.py: fachada `FinancialEngine`
- tests/: pruebas unitarias
- examples/: ejemplo mínimo

## Nota
Diseñado para ser invocado desde API o CLI y para integrarse con el front actual manteniendo TS como respaldo hasta lograr paridad.


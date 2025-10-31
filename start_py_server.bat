@echo off
REM Script para iniciar el servidor Python desde la raíz del proyecto
cd /d %~dp0
call .venv\Scripts\activate.bat
cd financial_engine_py\src
set PYTHONPATH=%CD%
python -m uvicorn server:app --reload --port 8000 --host 0.0.0.0
pause


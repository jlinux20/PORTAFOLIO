@echo off
setlocal
set DJANGO_SETTINGS_MODULE=backend.settings
call venv\Scripts\activate.bat
python -m django test backend.core
endlocal

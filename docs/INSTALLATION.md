# Instalación y Configuración

## Requisitos Previos

- Python 3.8 o superior
- Node.js y npm (opcional para herramientas frontend)
- Firebase CLI (para deploy y configuración Firebase)

## Configuración del Entorno Virtual y Django

1. Crear y activar el entorno virtual:

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. Instalar dependencias:

```bash
pip install django
```

3. Crear proyecto Django (ya incluido en este repositorio)

4. Ejecutar servidor Django:

```bash
python manage.py runserver
```

## Configuración Firebase

- Configurar Firebase con los archivos en la carpeta `firebase/`
- Ejecutar comandos Firebase CLI para deploy y desarrollo

## Ejecutar Frontend

- Abrir `index.html` en un navegador o usar servidor local para desarrollo

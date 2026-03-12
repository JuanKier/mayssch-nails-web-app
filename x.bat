@echo off
REM Script para crear estructura inicial del proyecto Mayssch Nails App

SET ROOT=mayssch-nails-app

REM Crear carpetas principales
mkdir %ROOT%
mkdir %ROOT%\backend
mkdir %ROOT%\backend\routes
mkdir %ROOT%\backend\models
mkdir %ROOT%\backend\services
mkdir %ROOT%\backend\db
mkdir %ROOT%\backend\tests
mkdir %ROOT%\frontend
mkdir %ROOT%\frontend\public
mkdir %ROOT%\frontend\src
mkdir %ROOT%\frontend\src\components
mkdir %ROOT%\frontend\src\pages
mkdir %ROOT%\frontend\src\services
mkdir %ROOT%\frontend\tests

REM Crear archivos backend
echo from flask import Flask > %ROOT%\backend\app.py
echo # appointment routes > %ROOT%\backend\routes\appointments.py
echo # user routes > %ROOT%\backend\routes\users.py
echo # appointment model > %ROOT%\backend\models\appointment.py
echo # user model > %ROOT%\backend\models\user.py
echo # calendar service > %ROOT%\backend\services\calendar_service.py
echo -- SQLite schema placeholder > %ROOT%\backend\db\schema.sql
echo # appointment tests > %ROOT%\backend\tests\test_appointments.py

REM Crear archivos frontend
echo import React from "react"; > %ROOT%\frontend\src\App.jsx
echo // Calendar component > %ROOT%\frontend\src\components\Calendar.jsx
echo // Appointment form component > %ROOT%\frontend\src\components\AppointmentForm.jsx
echo // Status badge component > %ROOT%\frontend\src\components\StatusBadge.jsx
echo // Dashboard page > %ROOT%\frontend\src\pages\Dashboard.jsx
echo // API service > %ROOT%\frontend\src\services\api.js
echo // Calendar tests > %ROOT%\frontend\tests\Calendar.test.js

REM Crear archivos raíz
echo # Nginx config placeholder > %ROOT%\nginx.conf
echo # Project documentation > %ROOT%\README.md

echo.
echo Proyecto creado exitosamente en %ROOT%
pause


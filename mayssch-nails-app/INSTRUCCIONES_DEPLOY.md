# Instrucciones para Compilar APK o Desplegar en GitHub

## 📱 Opción 1: Compilar APK para Android (Tablet)

### Requisitos:
- Android Studio instalado
- JDK (Java Development Kit)

### Pasos:

1. **Ejecutar el script de compilación:**
   ```bash
   cd mayssch-nails-app/frontend
   build-apk.bat
   ```

2. **O manualmente:**
   ```bash
   cd mayssch-nails-app/frontend
   npm run build
   npx cap sync
   npx cap open android
   ```

3. **En Android Studio:**
   - Abre el proyecto
   - Ve a `Build > Build Bundle(s) / APK(s) > Build APK(s)`
   - Espera a que termine
   - El APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Instalar en tablet:**
   - Copia el APK a tu tablet
   - Permite fuentes desconocidas en configuración
   - Instala la app

---

## 🌐 Opción 2: Desplegar en GitHub Pages

### Requisitos:
- Cuenta de GitHub
- Git instalado

### Pasos:

1. **Inicializar repositorio Git:**
   ```bash
   cd mayssch-nails-app/frontend
   git init
   git add .
   git commit -m "Initial commit - Mayssch Nails"
   ```

2. **Crear repositorio en GitHub:**
   - Ve a https://github.com/new
   - Crea un repositorio público (ej: `mayssch-nails`)
   - No inicialices con README

3. **Conectar y subir:**
   ```bash
   git remote add origin https://github.com/[TU-USUARIO]/mayssch-nails.git
   git branch -M main
   git push -u origin main
   ```

4. **Configurar GitHub Pages:**
   - Ve a Settings > Pages
   - En "Source", selecciona "main" branch
   - Guarda

5. **Desplegar:**
   ```bash
   npm run deploy
   ```

6. **Tu app estará en:**
   ```
   https://[tu-usuario].github.io/mayssch-nails
   ```

---

## 🚀 Recomendación

**Para tablet:** Usa la opción APK (Opción 1) para tener una app instalable.

**Para acceso rápido:** Usa GitHub Pages (Opción 2) para acceder desde cualquier navegador.

---

## 📝 Notas Importantes

- El backend Flask debe estar corriendo en el servidor (localhost:5000 o servidor remoto)
- Asegúrate de actualizar la URL de la API en `frontend/src/services/api.js` si usas un servidor remoto
- Para producción, considera usar un servidor con HTTPS

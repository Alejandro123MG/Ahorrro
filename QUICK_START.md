# 🚀 Quick Start - Ahorrro

## Inicio Rápido en 3 Pasos

### 1️⃣ Verificar Configuración
```bash
node test-server.js
```

**Resultado esperado:** Todos los checks en verde ✓

---

### 2️⃣ Iniciar el Servidor
```bash
npm start
```

**Verás:**
```
Servidor corriendo en puerto 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

---

### 3️⃣ Abrir la Aplicación

En tu navegador, visita:
```
http://localhost:5000
```

---

## 🎯 Primeros Pasos en la App

### 1. Registrarse
- Haz clic en "Regístrate aquí"
- Completa: nombre de usuario, email, contraseña
- Envía el formulario

### 2. Crear Primera Transacción
- Desde el dashboard, haz clic en "Nueva Transacción"
- Selecciona tipo (Ingreso o Gasto)
- Ingresa el monto
- Elige categoría (ej: "Salario", "Comida", "Transporte")
- Agrega descripción (opcional)
- Selecciona la fecha
- Guarda

### 3. Establecer Meta de Ahorro
- Ve a "Metas de Ahorro" en el menú
- Haz clic en "Nueva Meta"
- Nombre: ej. "Vacaciones"
- Monto objetivo: ej. 5000
- Monto actual: ej. 500 (opcional)
- Fecha límite: ej. 31/12/2025 (opcional)
- Guarda

### 4. Registrar Inversión
- Ve a "Inversiones" en el menú
- Haz clic en "Nueva Inversión"
- Nombre: ej. "Acciones Tech"
- Tipo: ej. "Acciones"
- Monto inicial: ej. 1000
- Valor actual: ej. 1200
- Fecha de inicio: selecciona fecha
- Guarda

### 5. Explorar Dashboard
- Vuelve al Dashboard
- Observa:
  - Balance total actualizado
  - Gráfico de gastos por categoría
  - Gráfico de ingresos vs gastos
  - Transacciones recientes
  - Progreso de tus metas

---

## 🔧 Solución de Problemas Comunes

### El servidor no inicia
```bash
# Verificar que el puerto 5000 esté libre
netstat -ano | findstr :5000

# Si está ocupado, cambiar PORT en .env
PORT=3000
```

### Error de conexión a MongoDB
1. Verifica tu cadena de conexión en `.env`
2. Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas
3. Verifica usuario y contraseña

### Página en blanco
1. Asegúrate de que el servidor esté corriendo
2. Verifica la consola del navegador (F12)
3. Limpia caché del navegador (Ctrl+Shift+R)

---

## 📱 Endpoints de API para Testing

### Registro
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"123456"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"123456"}'
```

### Crear Transacción (requiere token)
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"type":"income","amount":1000,"category":"Salario","date":"2025-10-15"}'
```

---

## 💡 Tips y Trucos

### Atajos de Teclado
- `F12` - Abrir Developer Tools
- `Ctrl+Shift+R` - Recargar sin caché
- `Ctrl+Shift+I` - Inspector de elementos

### Datos de Prueba
Usa estos datos para probar rápidamente:

**Usuario de prueba:**
- Email: demo@ahorrro.com
- Password: Demo123!

**Categorías sugeridas:**
- Ingresos: Salario, Freelance, Inversiones, Otros
- Gastos: Comida, Transporte, Entretenimiento, Servicios, Salud

**Tipos de inversión:**
- Acciones
- Bonos
- Criptomonedas
- Fondos de inversión
- Bienes raíces

### Mejores Prácticas
1. **Categorías consistentes:** Usa las mismas categorías para mejor análisis
2. **Descripciones claras:** Ayuda a recordar cada transacción
3. **Actualiza regularmente:** Mantén tus inversiones actualizadas
4. **Revisa tu dashboard:** Analiza tus finanzas semanalmente

---

## 🎨 Personalización

### Cambiar Tema
1. Ve a tu perfil (icono de usuario)
2. Selecciona "Configuración"
3. Elige "Claro" u "Oscuro"
4. Guarda

### Cambiar Idioma
1. Ve a "Configuración"
2. Selecciona idioma (Español/English)
3. Guarda

---

## 📊 Características Destacadas

### Dashboard
- ✅ Balance total en tiempo real
- ✅ Gráficos interactivos
- ✅ Progreso de metas visualizado
- ✅ Acceso rápido a todas las funciones

### Transacciones
- ✅ Filtros por tipo, categoría y fecha
- ✅ Creación rápida
- ✅ Edición y eliminación fácil

### Metas de Ahorro
- ✅ Barras de progreso visuales
- ✅ Cálculo automático de porcentaje
- ✅ Fechas límite opcionales

### Inversiones
- ✅ Cálculo automático de rendimiento
- ✅ Porcentaje de ganancia/pérdida
- ✅ Seguimiento de valor actual

---

## 🔐 Seguridad

Tu información está protegida:
- ✅ Contraseñas encriptadas
- ✅ Autenticación con tokens JWT
- ✅ Solo tú puedes ver tus datos
- ✅ Sesión segura

**Recuerda:**
- No compartas tu contraseña
- Cierra sesión en computadoras compartidas
- Usa contraseñas fuertes

---

## 📞 Recursos Adicionales

### Documentación
- `README.md` - Documentación completa
- `SETUP_GUIDE.md` - Guía de configuración
- `PROJECT_SUMMARY.md` - Resumen del proyecto

### Scripts Útiles
- `test-server.js` - Verificar configuración
- `npm start` - Iniciar servidor

---

## ✅ Checklist de Primer Uso

- [ ] Servidor iniciado correctamente
- [ ] Aplicación abierta en navegador
- [ ] Usuario registrado
- [ ] Primera transacción creada
- [ ] Primera meta de ahorro establecida
- [ ] Primera inversión registrada
- [ ] Dashboard explorado
- [ ] Preferencias configuradas

---

## 🎉 ¡Listo para Usar!

**Tu aplicación de gestión financiera personal está completamente configurada y lista para ayudarte a alcanzar tus metas financieras.**

### Próximos Pasos Recomendados:

1. **Semana 1:** Registra todas tus transacciones diarias
2. **Semana 2:** Establece 2-3 metas de ahorro
3. **Semana 3:** Registra tus inversiones actuales
4. **Semana 4:** Analiza tus gráficos y ajusta tu presupuesto

---

**¡Disfruta de Ahorrro y toma control de tus finanzas! 💰📊✨**

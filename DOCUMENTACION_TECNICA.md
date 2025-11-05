# Documentación Técnica - Ahorrro
## Sistema de Finanzas Personales

---

## Índice
1. [Arquitectura del Sistema](#arquitectura-del-sistema)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Modelos de Datos](#modelos-de-datos)
5. [API Endpoints](#api-endpoints)
6. [Funcionalidades Implementadas](#funcionalidades-implementadas)
7. [Flujos de Datos](#flujos-de-datos)

---

## Arquitectura del Sistema

### Arquitectura General
```
┌─────────────┐      HTTP/REST      ┌──────────────┐
│   Cliente   │ ←─────────────────→ │   Servidor   │
│  (Browser)  │      JSON           │  (Node.js)   │
└─────────────┘                     └──────────────┘
       │                                    │
       │                                    │
       ↓                                    ↓
┌─────────────┐                     ┌──────────────┐
│ HTML/CSS/JS │                     │   MongoDB    │
│ Bootstrap   │                     │   Database   │
│ Chart.js    │                     └──────────────┘
└─────────────┘
```

### Patrón de Diseño
**MVC (Model-View-Controller)**

- **Model:** Esquemas de Mongoose (User, Transaction, SavingGoal, Investment)
- **View:** HTML templates con Bootstrap
- **Controller:** Express.js controllers

---

## Tecnologías Utilizadas

### Backend
- **Runtime:** Node.js v18+
- **Framework:** Express.js v5.1.0
- **Base de Datos:** MongoDB (Mongoose v8.19.1)
- **Autenticación:** JWT (jsonwebtoken v9.0.2)
- **Seguridad:** bcryptjs v3.0.2
- **CORS:** cors v2.8.5
- **Variables de Entorno:** dotenv v17.2.3

### Frontend
- **HTML5 + CSS3**
- **JavaScript Vanilla (ES6+)**
- **Bootstrap 5.x**
- **Bootstrap Icons**
- **Chart.js** (gráficas)

### Herramientas de Desarrollo
- **nodemon** v3.1.10 (auto-reload en desarrollo)
- **npm** como gestor de paquetes

---

## Estructura del Proyecto

```
Ahorrro/
│
├── node_modules/           # Dependencias
│
├── public/                 # Frontend
│   ├── css/               # Estilos personalizados
│   ├── js/
│   │   ├── api.js        # Funciones de API
│   │   ├── auth.js       # Gestión de autenticación
│   │   └── app.js        # Lógica principal
│   └── views/
│       ├── login.html
│       ├── register.html
│       ├── dashboard.html
│       ├── transactions.html
│       ├── newTransaction.html
│       ├── savingGoals.html
│       ├── newSavingGoal.html
│       ├── investments.html
│       ├── newInvestment.html
│       ├── profile.html
│       └── settings.html
│
├── src/                    # Backend
│   ├── config/
│   │   └── database.js   # Configuración MongoDB
│   │
│   ├── controllers/       # Lógica de negocio
│   │   ├── auth.controller.js
│   │   ├── transaction.controller.js
│   │   ├── savingGoal.controller.js
│   │   └── investment.controller.js
│   │
│   ├── middleware/
│   │   └── auth.js       # Middleware de autenticación
│   │
│   ├── models/           # Esquemas de datos
│   │   ├── user.model.js
│   │   ├── transaction.model.js
│   │   ├── savingGoal.model.js
│   │   └── investment.model.js
│   │
│   ├── routes/           # Rutas de API
│   │   ├── auth.routes.js
│   │   ├── transaction.routes.js
│   │   ├── savingGoal.routes.js
│   │   └── investment.routes.js
│   │
│   └── index.js          # Punto de entrada
│
├── .env                   # Variables de entorno
├── .gitignore
├── package.json
├── SPRINT_4_INVERSIONES.md
├── SPRINT_5_DASHBOARD_REPORTES.md
├── GUIA_USUARIO.md
└── DOCUMENTACION_TECNICA.md
```

---

## Modelos de Datos

### User Schema
```javascript
{
  username: String (único, requerido),
  email: String (único, requerido),
  password: String (hasheado, requerido),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

### Transaction Schema
```javascript
{
  userId: ObjectId → User (requerido),
  type: String ['income', 'expense'] (requerido),
  amount: Number (≥0, requerido),
  category: String (requerido),
  description: String (opcional),
  date: Date (requerido),
  savingGoalId: ObjectId → SavingGoal (opcional),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

**Reglas de Negocio:**
- Solo `type: 'income'` puede tener `savingGoalId`
- `amount` debe ser positivo
- `savingGoalId` debe pertenecer al mismo usuario

### SavingGoal Schema
```javascript
{
  userId: ObjectId → User (requerido),
  name: String (requerido),
  targetAmount: Number (requerido),
  currentAmount: Number (≥0, default: 0),
  targetDate: Date (opcional),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

**Reglas de Negocio:**
- `currentAmount` se actualiza automáticamente con transacciones
- `currentAmount` se incrementa cuando se asigna ingreso
- `currentAmount` se decrementa cuando se retira

### Investment Schema
```javascript
{
  userId: ObjectId → User (requerido),
  name: String (requerido),
  type: String (requerido),
  initialAmount: Number (requerido),
  currentValue: Number (requerido),
  startDate: Date (requerido),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

**Cálculos Derivados:**
```javascript
performance = currentValue - initialAmount
performancePercent = (performance / initialAmount) × 100
```

---

## API Endpoints

### Autenticación

#### POST /api/auth/register
**Descripción:** Registrar nuevo usuario

**Body:**
```json
{
  "username": "usuario123",
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "_id": "...",
  "username": "usuario123",
  "email": "usuario@example.com"
}
```

#### POST /api/auth/login
**Descripción:** Iniciar sesión

**Body:**
```json
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "_id": "...",
  "username": "usuario123",
  "email": "usuario@example.com"
}
```

### Transacciones

#### GET /api/transactions
**Descripción:** Obtener todas las transacciones del usuario

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "type": "income",
    "amount": 1000,
    "category": "Salario",
    "description": "Pago mensual",
    "date": "2025-11-01",
    "savingGoalId": {
      "_id": "...",
      "name": "Vacaciones"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

#### POST /api/transactions
**Descripción:** Crear nueva transacción

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "type": "income",
  "amount": 500,
  "category": "Freelance",
  "description": "Proyecto web",
  "date": "2025-11-15",
  "savingGoalId": "64abc..." // opcional
}
```

**Response (201):**
```json
{
  "_id": "...",
  "userId": "...",
  "type": "income",
  "amount": 500,
  "category": "Freelance",
  "description": "Proyecto web",
  "date": "2025-11-15",
  "savingGoalId": "64abc...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### DELETE /api/transactions/:id
**Descripción:** Eliminar transacción

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Transaccion eliminada exitosamente"
}
```

### Metas de Ahorro

#### GET /api/saving-goals
**Descripción:** Obtener todas las metas del usuario

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
[
  {
    "_id": "...",
    "name": "Vacaciones",
    "targetAmount": 2000,
    "currentAmount": 500,
    "targetDate": "2025-12-31",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

#### POST /api/saving-goals
**Descripción:** Crear nueva meta

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Auto Nuevo",
  "targetAmount": 10000,
  "targetDate": "2026-06-30"
}
```

**Response (201):**
```json
{
  "_id": "...",
  "userId": "...",
  "name": "Auto Nuevo",
  "targetAmount": 10000,
  "currentAmount": 0,
  "targetDate": "2026-06-30",
  "createdAt": "...",
  "updatedAt": "..."
}
```

#### PUT /api/saving-goals/:id
**Descripción:** Actualizar meta (usado para retiros)

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "currentAmount": 300
}
```

### Inversiones

#### GET /api/investments
**Descripción:** Obtener todas las inversiones

#### POST /api/investments
**Descripción:** Crear nueva inversión

**Body:**
```json
{
  "name": "Acciones Apple",
  "type": "Acciones",
  "initialAmount": 5000,
  "currentValue": 5500,
  "startDate": "2025-11-01"
}
```

#### DELETE /api/investments/:id
**Descripción:** Eliminar inversión

---

## Funcionalidades Implementadas

### 1. Sistema de Autenticación
- ✅ Registro de usuarios
- ✅ Login con JWT
- ✅ Protección de rutas
- ✅ Hash de contraseñas (bcrypt)

### 2. Gestión de Transacciones
- ✅ Crear ingreso/gasto
- ✅ Asignar ingreso a meta
- ✅ Listar con populate de metas
- ✅ Eliminar con ajuste de metas
- ✅ Filtros (tipo, categoría, fechas)

### 3. Metas de Ahorro
- ✅ Crear meta con objetivo
- ✅ Alimentar con ingresos
- ✅ Retirar dinero
- ✅ Cálculo de progreso
- ✅ Visualización con barras

### 4. Inversiones
- ✅ Registrar inversión
- ✅ Cálculo de rendimiento
- ✅ Visualización de performance
- ✅ Suma total en dashboard

### 5. Dashboard y Reportes
- ✅ Resumen financiero completo
- ✅ Gráfica de gastos por categoría
- ✅ Gráfica ingresos vs gastos
- ✅ Transacciones recientes
- ✅ Progreso de metas
- ✅ Colores dinámicos según saldo

### 6. Validaciones
- ✅ Validación de fondos disponibles
- ✅ Notificaciones inteligentes
- ✅ Redirección a metas si hay dinero
- ✅ Prevención de gastos sin fondos

---

## Flujos de Datos

### Flujo: Crear Ingreso con Meta

```
1. Usuario llena formulario
   ↓
2. Frontend valida campos
   ↓
3. POST /api/transactions
   {type: 'income', amount: 500, savingGoalId: "..."}
   ↓
4. Backend valida:
   - Usuario autenticado ✓
   - Meta existe ✓
   - Meta pertenece al usuario ✓
   ↓
5. Backend actualiza:
   - Crea Transaction ✓
   - Incrementa SavingGoal.currentAmount ✓
   ↓
6. Response 201
   ↓
7. Frontend redirige a lista
   ↓
8. Dashboard se actualiza automáticamente
```

### Flujo: Validación de Gasto

```
1. Usuario intenta crear gasto de $500
   ↓
2. Frontend calcula disponible:
   - Obtiene todas las transacciones
   - Suma ingresos sin meta: $300
   - Suma gastos: $100
   - Disponible = $300 - $100 = $200
   ↓
3. $500 > $200 ❌
   ↓
4. Frontend verifica metas:
   - Suma currentAmount de metas: $1000
   ↓
5. Muestra confirmación:
   "No tienes suficiente ($200)"
   "Tienes $1000 en metas"
   "¿Ir a metas?"
   ↓
6a. Usuario acepta → Redirige a metas
6b. Usuario cancela → No crea gasto
```

### Flujo: Retiro de Meta

```
1. Usuario click "Retirar" en meta
   ↓
2. Prompt: "¿Cuánto retirar?"
   Input: $300
   ↓
3. Frontend valida:
   - Monto > 0 ✓
   - Monto ≤ currentAmount ✓
   ↓
4. PUT /api/saving-goals/:id
   {currentAmount: oldAmount - 300}
   ↓
5. POST /api/transactions
   {type: 'income', amount: 300, category: 'Retiro de Meta'}
   ↓
6. Backend procesa ambas operaciones
   ↓
7. Meta disminuye: -$300
8. Disponible aumenta: +$300
   ↓
9. Frontend muestra confirmación
10. Vista se recarga
```

---

## Seguridad

### Autenticación
- JWT con expiración
- Middleware de verificación en todas las rutas protegidas
- Verificación de propiedad de recursos

### Contraseñas
- Hashing con bcrypt (10 rounds)
- Nunca se almacenan en texto plano

### Validaciones
- Backend valida todos los inputs
- Frontend valida antes de enviar
- Mongoose schemas con validaciones

### CORS
- Configurado para permitir origen específico
- Headers autorizados definidos

---

## Variables de Entorno

```env
# .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ahorrro
JWT_SECRET=tu_secreto_super_seguro_aqui
```

---

## Instalación y Ejecución

### Requisitos
- Node.js v18+
- MongoDB v6+
- npm v8+

### Instalación
```bash
# Clonar proyecto
cd Ahorrro

# Instalar dependencias
npm install

# Configurar .env
cp .env.example .env
# Editar .env con tus valores

# Iniciar MongoDB (si es local)
mongod

# Iniciar servidor
npm start

# O en modo desarrollo
npm run dev
```

### Acceso
```
URL: http://localhost:5000
Frontend: Carga automáticamente index.html
API: http://localhost:5000/api/*
```

---

## Testing

### Pruebas Manuales Realizadas
- ✅ CRUD completo de transacciones
- ✅ CRUD completo de metas
- ✅ CRUD completo de inversiones
- ✅ Autenticación y autorización
- ✅ Cálculos matemáticos
- ✅ Validaciones de negocio
- ✅ Filtros de transacciones
- ✅ Actualización de dashboard

### Casos Edge Testeados
- ✅ Transacción sin meta
- ✅ Gasto mayor a disponible
- ✅ Retiro mayor al monto en meta
- ✅ Eliminación de meta con transacciones
- ✅ Fechas futuras/pasadas
- ✅ Montos negativos (bloqueados)
- ✅ Campos vacíos (validados)

---

## Optimizaciones

### Backend
- Índices en MongoDB (userId)
- Populate solo campos necesarios
- Validación con Mongoose schemas
- Middleware reutilizable

### Frontend
- Carga asíncrona de datos
- Actualización parcial del DOM
- Uso de eventos delegados
- Caché de datos en memoria durante sesión

---

## Mantenimiento

### Logs
Actualmente:
```javascript
console.log() en desarrollo
console.error() para errores
```

Recomendación futura: Winston o Morgan

### Backup
- MongoDB: dump regular
- Código: Git + GitHub

---

**Versión:** 1.0
**Última actualización:** Noviembre 2025
**Autor:** [Tu nombre]

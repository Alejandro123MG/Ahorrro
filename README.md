# Ahorrro - Aplicación de Gestión Financiera Personal

Una aplicación web completa para gestión financiera personal que permite a los usuarios controlar transacciones, establecer metas de ahorro, seguir inversiones y generar reportes visuales.

## Características Principales

- ✅ Autenticación de usuarios con JWT
- ✅ Gestión completa de transacciones (CRUD)
- ✅ Metas de ahorro con seguimiento de progreso
- ✅ Registro y análisis de inversiones
- ✅ Dashboard con gráficos interactivos
- ✅ Reportes visuales por categoría y periodo
- ✅ Configuración de preferencias (tema, idioma)

## Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Variables de entorno
- **cors** - Manejo de CORS

### Frontend
- **HTML5** - Estructura
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **Chart.js** - Gráficos y visualizaciones
- **Vanilla JavaScript** - Lógica del cliente

## Estructura del Proyecto

```
Ahorrro/
├── src/
│   ├── config/
│   │   └── database.js           # Configuración de MongoDB
│   ├── controllers/
│   │   ├── auth.controller.js     # Lógica de autenticación
│   │   ├── transaction.controller.js
│   │   ├── savingGoal.controller.js
│   │   └── investment.controller.js
│   ├── middleware/
│   │   └── auth.js               # Middleware de autenticación JWT
│   ├── models/
│   │   ├── user.model.js         # Modelo de usuario
│   │   ├── transaction.model.js
│   │   ├── savingGoal.model.js
│   │   └── investment.model.js
│   ├── routes/
│   │   ├── auth.routes.js        # Rutas de autenticación
│   │   ├── transaction.routes.js
│   │   ├── savingGoal.routes.js
│   │   └── investment.routes.js
│   └── index.js                  # Punto de entrada del servidor
├── public/
│   ├── css/
│   │   └── style.css             # Estilos personalizados
│   ├── js/
│   │   ├── api.js                # Funciones de API
│   │   ├── auth.js               # Gestión de autenticación
│   │   └── app.js                # Lógica principal del frontend
│   ├── views/                    # Vistas HTML
│   └── index.html                # Página principal
├── .env                          # Variables de entorno (no incluir en git)
├── .env.example                  # Plantilla de variables de entorno
├── .gitignore
├── package.json
└── README.md
```

## Instalación

### Requisitos Previos
- Node.js (v14 o superior)
- MongoDB Atlas (cuenta gratuita)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Ahorrro
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus propias credenciales:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<usuario>:<password>@cluster0.xxxxx.mongodb.net/ahorrro?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_super_segura_aqui
JWT_EXPIRE=7d
NODE_ENV=development
```

**Importante:**
- Reemplaza `<usuario>` y `<password>` con tus credenciales de MongoDB Atlas
- Cambia `JWT_SECRET` por una cadena aleatoria segura
- Asegúrate de agregar tu IP a la whitelist de MongoDB Atlas

4. **Configurar MongoDB Atlas**

- Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crea un nuevo cluster (gratuito)
- Configura un usuario de base de datos
- Obtén tu cadena de conexión
- Añade tu IP a la lista de IPs permitidas (o usa `0.0.0.0/0` para desarrollo)

## Uso

### Iniciar el servidor

**Modo producción:**
```bash
npm start
```

**Modo desarrollo (con nodemon):**
```bash
npm run dev
```

El servidor se iniciará en `http://localhost:5000`

### Acceder a la aplicación

Abre tu navegador y visita:
```
http://localhost:5000
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión (protegida)
- `GET /api/auth/profile` - Obtener perfil (protegida)
- `PUT /api/auth/profile` - Actualizar perfil (protegida)

### Transacciones
- `GET /api/transactions` - Listar todas (protegida)
- `GET /api/transactions/:id` - Obtener una (protegida)
- `POST /api/transactions` - Crear nueva (protegida)
- `PUT /api/transactions/:id` - Actualizar (protegida)
- `DELETE /api/transactions/:id` - Eliminar (protegida)

### Metas de Ahorro
- `GET /api/saving-goals` - Listar todas (protegida)
- `GET /api/saving-goals/:id` - Obtener una (protegida)
- `POST /api/saving-goals` - Crear nueva (protegida)
- `PUT /api/saving-goals/:id` - Actualizar (protegida)
- `DELETE /api/saving-goals/:id` - Eliminar (protegida)

### Inversiones
- `GET /api/investments` - Listar todas (protegida)
- `GET /api/investments/:id` - Obtener una (protegida)
- `POST /api/investments` - Crear nueva (protegida)
- `PUT /api/investments/:id` - Actualizar (protegida)
- `DELETE /api/investments/:id` - Eliminar (protegida)

**Nota:** Las rutas protegidas requieren el header `Authorization: Bearer <token>`

## Modelos de Datos

### User
```javascript
{
  username: String,
  email: String (único),
  password: String (encriptado),
  preferences: {
    theme: String,
    language: String
  }
}
```

### Transaction
```javascript
{
  userId: ObjectId,
  type: String ('income' | 'expense'),
  amount: Number,
  category: String,
  description: String,
  date: Date
}
```

### SavingGoal
```javascript
{
  userId: ObjectId,
  name: String,
  targetAmount: Number,
  currentAmount: Number,
  targetDate: Date
}
```

### Investment
```javascript
{
  userId: ObjectId,
  name: String,
  type: String,
  initialAmount: Number,
  currentValue: Number,
  startDate: Date
}
```

## Scripts Disponibles

- `npm start` - Inicia el servidor en modo producción
- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon (requiere instalación de nodemon)

## Seguridad

- Las contraseñas se encriptan con bcrypt antes de almacenarse
- Autenticación basada en JWT
- Las rutas protegidas requieren token válido
- CORS configurado para desarrollo
- Variables sensibles en archivo `.env` (no versionado)

## Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

ISC

## Autor

Tu nombre - [Tu email]

## Notas Adicionales

- Asegúrate de nunca subir el archivo `.env` a un repositorio público
- Para producción, considera usar variables de entorno del sistema o servicios como AWS Secrets Manager
- Cambia `JWT_SECRET` por una clave robusta y única en producción
- Configura adecuadamente las reglas de firewall en MongoDB Atlas para producción

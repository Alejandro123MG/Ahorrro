# Guía de Usuario - Ahorrro
## Aplicación de Finanzas Personales

---

## Tabla de Contenidos
1. [Introducción](#introducción)
2. [Dashboard](#dashboard)
3. [Transacciones](#transacciones)
4. [Metas de Ahorro](#metas-de-ahorro)
5. [Inversiones](#inversiones)
6. [Casos de Uso](#casos-de-uso)

---

## Introducción

**Ahorrro** es una aplicación web para gestionar tus finanzas personales de forma inteligente. Permite:
- 💰 Registrar ingresos y gastos
- 🎯 Crear metas de ahorro
- 📊 Ver reportes visuales
- 💹 Rastrear inversiones

---

## Dashboard

### Vista General
El dashboard muestra tu estado financiero completo en un solo lugar.

#### Resumen Financiero
```
┌─────────────────────────────────────┐
│  Metas de Ahorro    │ Ingreso Disp. │
│  Vacaciones: $500   │ $1,200        │
│  Auto: $300         │               │
│                                     │
│  Total Acumulado: $2,000            │
└─────────────────────────────────────┘
```

**Interpretación:**
- **Metas de Ahorro:** Dinero guardado para objetivos específicos
- **Ingreso Disponible:** Dinero que puedes gastar libremente
- **Total Acumulado:** Todo tu dinero (metas + disponible)

**Colores:**
- 🟢 Verde: Tienes dinero disponible
- 🟡 Amarillo: Balance en cero
- 🔴 Rojo: Gastos mayores a ingresos disponibles

---

## Transacciones

### Crear un Ingreso

#### Opción 1: Ingreso Disponible (para gastar)
```
1. Ir a "Transacciones" → "Nueva Transacción"
2. Seleccionar tipo: "Ingreso"
3. Ingresar monto: $1000
4. Categoría: "Salario"
5. Meta de Ahorro: "Ninguna"
6. Guardar
```

**Resultado:** +$1000 en ingreso disponible

#### Opción 2: Ingreso para Meta de Ahorro
```
1. Ir a "Transacciones" → "Nueva Transacción"
2. Seleccionar tipo: "Ingreso"
3. Ingresar monto: $500
4. Categoría: "Salario"
5. Meta de Ahorro: "Vacaciones"
6. Guardar
```

**Resultado:** +$500 en la meta "Vacaciones"

### Crear un Gasto

```
1. Ir a "Transacciones" → "Nueva Transacción"
2. Seleccionar tipo: "Gasto"
3. Ingresar monto: $200
4. Categoría: "Comida"
5. Guardar
```

**Validación Automática:**
- ✅ Si tienes dinero disponible: Se crea el gasto
- ❌ Si NO tienes dinero: Muestra mensaje de error
- 💡 Si tienes dinero en metas: Pregunta si quieres retirar

### Filtrar Transacciones

```
Filtros disponibles:
- Tipo: Ingreso, Gasto, Todos
- Categoría: Búsqueda por texto
- Fechas: Desde/Hasta
```

**Ejemplo:**
```
Ver solo gastos de "Comida" en enero:
- Tipo: Gasto
- Categoría: "comida"
- Desde: 01/01/2025
- Hasta: 31/01/2025
→ Click en "Aplicar"
```

---

## Metas de Ahorro

### Crear una Meta

```
1. Ir a "Metas de Ahorro" → "Nueva Meta"
2. Nombre: "Vacaciones"
3. Monto Objetivo: $2000
4. Fecha límite: 31/12/2025 (opcional)
5. Guardar
```

**Nota:** No necesitas ingresar monto inicial, se llena con transacciones.

### Alimentar una Meta

```
1. Ir a "Transacciones" → "Nueva Transacción"
2. Tipo: "Ingreso"
3. Monto: $500
4. Meta de Ahorro: "Vacaciones"
5. Guardar
```

**Resultado:** La meta aumenta automáticamente.

### Retirar de una Meta

```
1. Ir a "Metas de Ahorro"
2. Click en botón "Retirar" de la meta
3. Ingresar monto a retirar: $200
4. Confirmar
```

**Resultado:**
- Meta disminuye: $500 → $300
- Ingreso disponible aumenta: +$200

### Ejemplo Completo

**Estado inicial:** $0 en todo

**Paso 1: Crear meta**
```
Meta "Auto Nuevo"
Objetivo: $10,000
```

**Paso 2: Primer ahorro**
```
Ingreso de $1000 para "Auto Nuevo"
→ Meta: $1000 / $10,000 (10%)
```

**Paso 3: Segundo ahorro**
```
Ingreso de $500 para "Auto Nuevo"
→ Meta: $1500 / $10,000 (15%)
```

**Paso 4: Necesitas el dinero**
```
Retirar $300 de "Auto Nuevo"
→ Meta: $1200 / $10,000 (12%)
→ Disponible: +$300
```

---

## Inversiones

### Concepto
Las inversiones son para **rastrear dinero ya invertido** fuera de la aplicación.

**Ejemplo:** Compraste acciones por $5000 en tu broker → Registras en la app para tracking.

### Registrar una Inversión

```
1. Ir a "Inversiones" → "Nueva Inversión"
2. Nombre: "Acciones Tesla"
3. Tipo: "Acciones"
4. Monto Inicial: $5000
5. Valor Actual: $5000 (al inicio)
6. Fecha: 15/11/2025
7. Guardar
```

### Actualizar Valor

**Cuando el valor cambia:**
```
Opción A: Eliminar y recrear con nuevo valor
Opción B: Usar función de edición (si implementada)
```

**Ejemplo:**
```
Después de 1 mes, tus acciones valen $6000
→ Eliminas la inversión original
→ Creas nueva con Valor Actual: $6000
```

**Dashboard mostrará:**
```
Inversiones Totales: $6000
Rendimiento: +$1000 (+20%)
```

---

## Casos de Uso

### Caso 1: Ahorrar para Vacaciones

**Objetivo:** Ahorrar $2000 en 6 meses

```
Mes 1:
1. Crear meta "Vacaciones" con objetivo $2000
2. Registrar ingreso de salario: $3000 disponible
3. Asignar $500 a "Vacaciones"
4. Disponible: $2500, Meta: $500

Mes 2:
1. Asignar otros $500 a "Vacaciones"
2. Meta: $1000 / $2000 (50%)

Mes 3-4:
- Continuar asignando mensualmente

Mes 6:
- Meta alcanzada: $2000 / $2000 (100%)
- Retirar todo y usar para vacaciones
```

### Caso 2: Control de Gastos

**Objetivo:** Ver dónde gastas más dinero

```
1. Registrar todos los gastos del mes
   - Comida: $300
   - Transporte: $150
   - Entretenimiento: $200

2. Ir al Dashboard
3. Ver gráfica "Gastos por Categoría"
   - Comida: 46%
   - Entretenimiento: 31%
   - Transporte: 23%

4. Identificar: Gastas mucho en comida
5. Acción: Reducir presupuesto de comida
```

### Caso 3: Validación Antes de Comprar

**Escenario:** Quieres comprar algo de $500

```
1. Dashboard muestra:
   - Disponible: $300
   - Metas: $2000

2. Intentas crear gasto de $500
3. Sistema te avisa:
   "No tienes suficiente ($300)"
   "Tienes $2000 en metas"
   "¿Retirar de metas?"

4. Opciones:
   A) Cancelar compra
   B) Retirar $200 de meta
   C) Esperar a siguiente ingreso
```

### Caso 4: Rastreo de Inversiones

**Objetivo:** Monitorear portafolio de inversiones

```
Portafolio:
- Bitcoin: $3000 → $4000 (+$1000, +33%)
- Acciones: $5000 → $4500 (-$500, -10%)
- Bonos: $2000 → $2100 (+$100, +5%)

Dashboard muestra:
- Inversiones Totales: $10,600
- Rendimiento Total: +$600 (+6%)
```

---

## Consejos de Uso

### ✅ Mejores Prácticas

1. **Registra TODAS tus transacciones**
   - Cada ingreso, cada gasto
   - Mantén la app actualizada

2. **Crea metas realistas**
   - Objetivos alcanzables
   - Plazos razonables

3. **Revisa el dashboard diariamente**
   - Conoce tu estado financiero
   - Toma decisiones informadas

4. **Usa las categorías consistentemente**
   - "Comida", no "comida" o "Alimentos"
   - Facilita el análisis

5. **Aprovecha los filtros**
   - Analiza periodos específicos
   - Encuentra patrones de gasto

### ⚠️ Errores Comunes

❌ **No asignar categoría**
→ Dificulta el análisis posterior

❌ **Mezclar metas con disponible**
→ Usa el selector correctamente

❌ **No actualizar inversiones**
→ Rendimientos desactualizados

❌ **Gastar sin verificar disponible**
→ La app te ayuda, úsala

---

## Glosario

**Ingreso Disponible:** Dinero que no está asignado a metas y puedes gastar libremente.

**Meta de Ahorro:** Objetivo financiero con monto objetivo que se alimenta con ingresos.

**Total Acumulado:** Suma de todo tu dinero (metas + disponible).

**Balance Total:** Ingresos totales - Gastos totales (histórico).

**Rendimiento:** Ganancia o pérdida de una inversión.

---

## Soporte

Para dudas o problemas:
- Revisa esta guía
- Consulta los tooltips en la app
- Verifica que tienes conexión a internet

---

**Versión:** 1.0
**Última actualización:** Noviembre 2025

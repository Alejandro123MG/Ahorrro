/**
 * Script de prueba para verificar la configuración del servidor
 * Ejecutar con: node test-server.js
 */

require('dotenv').config();

console.log('=== VERIFICACIÓN DE CONFIGURACIÓN DEL SERVIDOR ===\n');

// 1. Verificar variables de entorno
console.log('1. Variables de Entorno:');
console.log('   PORT:', process.env.PORT || 'NO CONFIGURADO');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✓ Configurado' : '✗ NO CONFIGURADO');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✓ Configurado' : '✗ NO CONFIGURADO');
console.log('   JWT_EXPIRE:', process.env.JWT_EXPIRE || 'NO CONFIGURADO');
console.log('   NODE_ENV:', process.env.NODE_ENV || 'NO CONFIGURADO');
console.log('');

// 2. Verificar dependencias
console.log('2. Dependencias Instaladas:');
const dependencies = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'dotenv',
    'cors'
];

dependencies.forEach(dep => {
    try {
        require.resolve(dep);
        console.log(`   ✓ ${dep}`);
    } catch (e) {
        console.log(`   ✗ ${dep} - NO INSTALADO`);
    }
});
console.log('');

// 3. Verificar estructura de carpetas
console.log('3. Estructura de Carpetas:');
const fs = require('fs');
const path = require('path');

const folders = [
    'src',
    'src/config',
    'src/controllers',
    'src/middleware',
    'src/models',
    'src/routes',
    'public',
    'public/css',
    'public/js',
    'public/views'
];

folders.forEach(folder => {
    const exists = fs.existsSync(path.join(__dirname, folder));
    console.log(`   ${exists ? '✓' : '✗'} ${folder}`);
});
console.log('');

// 4. Verificar archivos críticos
console.log('4. Archivos Críticos:');
const files = [
    'src/index.js',
    'src/config/database.js',
    'package.json',
    '.env',
    '.gitignore'
];

files.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`   ${exists ? '✓' : '✗'} ${file}`);
});
console.log('');

// 5. Test de conexión a MongoDB (opcional)
console.log('5. Test de Conexión a MongoDB:');
if (process.env.MONGODB_URI) {
    const mongoose = require('mongoose');

    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log('   ✓ Conexión exitosa a MongoDB');
            mongoose.connection.close();
            console.log('\n=== CONFIGURACIÓN COMPLETA Y CORRECTA ===\n');
            process.exit(0);
        })
        .catch((error) => {
            console.log('   ✗ Error de conexión:', error.message);
            console.log('\n=== VERIFICAR CONFIGURACIÓN DE MONGODB ===\n');
            process.exit(1);
        });
} else {
    console.log('   ⚠ No se puede probar - MONGODB_URI no configurado');
    console.log('\n=== CONFIGURACIÓN INCOMPLETA ===\n');
}

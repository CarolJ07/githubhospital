const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/bioconect');

const db = mongoose.connection;

// Modelo de datos para áreas
const areaSchema = new mongoose.Schema({
    nombre: String
});
const Area = mongoose.model('Area', areaSchema);

// Modelo de datos para equipos
const equipoSchema = new mongoose.Schema({
    area: String,
    nombre: String
});
const Equipo = mongoose.model('Equipo', equipoSchema);

// Modelo de datos para detalles de equipos
const detalleSchema = new mongoose.Schema({
    area: String,
    equipo: String,
    modelo: String,
    numeroSerie: String,
    marca: String,
    fechaAdquisicion: String,
    vidaUtil: String,
    inicioOperaciones: String,
    ultimaCalibracion: String,
    responsable: String,
    comentarios: String
});
const Detalle = mongoose.model('Detalle', detalleSchema);

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, `${req.body.area}-${req.body.equipo}.jpg`);
    }
});
const upload = multer({ storage });

// Rutas de API para áreas
app.get('/api/areas', async (req, res) => {
    try {
        const areas = await Area.find();
        res.json(areas.map(area => area.nombre));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/areas', async (req, res) => {
    const area = new Area({
        nombre: req.body.nombre
    });
    try {
        const nuevaArea = await area.save();
        res.status(201).json(nuevaArea);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Rutas de API para equipos
app.get('/api/equipos/:area', async (req, res) => {
    try {
        const equipos = await Equipo.find({ area: req.params.area });
        res.json(equipos.map(equipo => equipo.nombre));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/equipos', async (req, res) => {
    const equipo = new Equipo({
        area: req.body.area,
        nombre: req.body.nombre
    });
    try {
        const nuevoEquipo = await equipo.save();
        res.status(201).json(nuevoEquipo);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

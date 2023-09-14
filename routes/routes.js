const express = require('express');
const { ObjectId } = require('mongodb');

const { MongoClient } = require('mongodb');
require('dotenv').config();
const router = express.Router();

const client = new MongoClient(process.env.MONGO_URI);
const db = client.db("EPS");

// Conexion MongoDb
async function connectDb() {
    try {
        await client.connect();
        console.log('DB Online');
    } catch (error) {
        console.log(error);
    }
}

connectDb();

const acudiente = db.collection("acudiente");
const consultorio = db.collection("consultorio");
const especialidad = db.collection("especialidad");
const estado_cita = db.collection("estado_cita");
const genero = db.collection("genero");
const medico = db.collection("medico");
const tipo_documento = db.collection("tipo_documento");
const usuario = db.collection("usuario");
const cita = db.collection("cita");

// EndPoints
// 1. Obtener todos los pacientes de manera alfabética.
router.get("/EndPoint_1", async (req, res) => {
    try {
        const result = await usuario.find().sort({usu_nombre: 1}).toArray();
        res.send(result);
    } catch (error) {
        console.log(error);
    }
});

// 2. Obtener las citas de una fecha en específico , donde se ordene los pacientes de manera alfabética.
router.get("/EndPoint_2/:fecha", async (req, res) => {
    try {
        const fechaEspecifica = req.params.fecha;

        const citas = await cita.find({ cit_fecha: fechaEspecifica }).toArray();

        const medicoIds = [...new Set(citas.map(cita => cita.cit_medico.toString()))];

        const medicos = await medico.find({ _id: { $in: medicoIds.map(id => new ObjectId(id)) } }).toArray();

        const medicoMap = new Map(medicos.map(medico => [medico._id.toString(), medico.med_nombreCompleto]));

        for (const cita of citas) {
            const nombreMedico = medicoMap.get(cita.cit_medico.toString());
            cita.nombreMedico = nombreMedico;
        }

        // Ordena las citas por el nombre del usuario
        citas.sort((a, b) => (a.cit_datosUsuario.usu_nombre > b.cit_datosUsuario.usu_nombre) ? 1 : -1);

        res.send(citas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// 3. Obtener todos los médicos de una especialidad en específico (por ejemplo, ‘Cardiología’).

router.get("/EndPoint_3/:especialidad", async (req, res) => {
    try {
        const especialidadMedico = req.params.especialidad;

        if (!/^[0-9a-fA-F]{24}$/.test(especialidadMedico)) {
            return res.status(400).json({ error: "Formato de especialidad incorrecto" });
        }

        const objectIdEspecialidad = new ObjectId(especialidadMedico);

        const medicos = await medico.find({ "med_especialidad": objectIdEspecialidad }).toArray();

        if (medicos.length === 0) {
            return res.status(404).json({ error: "No se encontraron médicos con esa especialidad" });
        }

        const medicosConEspecialidad = medicos.map((medico) => ({
            _id: medico._id,
            med_nombreCompleto: medico.med_nombreCompleto,
        }));

        res.send(medicosConEspecialidad);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener los médicos." });
    }
});

// 4. Encontrar la próxima cita para un paciente en específico (por ejemplo, el paciente con user_id 1).

router.get("/EndPoint_4/:usuario_id", async (req, res) => {
    try {
        // Declaración de la colección "usuario" para interactuar con ella en la base de datos.
        const usuario = db.collection("usuario"); // Mover la declaración aquí

        // Obtiene el valor del parámetro ":usuario_id" de la URL, que representa el ID único del paciente.
        const usuarioId = req.params.usuario_id;

        // Verifica si el formato del ID de usuario es válido utilizando una expresión regular.
        if (!/^[0-9a-fA-F]{24}$/.test(usuarioId)) {
            return res.status(400).json({ error: "Formato de ID de usuario incorrecto" });
        }

        // Convierte el ID de usuario en un objeto ObjectId que se utilizará para buscar en la base de datos.
        const objectIdUsuario = new ObjectId(usuarioId);

        // Obtiene la fecha actual en formato ISO (Fecha y hora en formato estándar internacional).
        const fechaActual = new Date().toISOString();

        // Busca en la colección "cita" la próxima cita programada para el paciente específico cuyo ID se proporcionó.
        const citaFutura = await cita.findOne({
            "cit_datosUsuario": objectIdUsuario,
            "cit_fecha": { $gte: fechaActual } // Busca citas con fecha mayor o igual a la fecha actual.
        });

        // Si no se encuentra ninguna cita futura para el paciente, devuelve un mensaje de error.
        if (!citaFutura) {
            return res.status(404).json({ mensaje: "No se encontraron citas futuras para este paciente." });
        }

        // Busca al paciente en la colección "usuario" utilizando el ID de usuario.
        const usuarioEncontrado = await usuario.findOne({ "_id": objectIdUsuario });

        // Prepara un objeto de resultado con detalles de la cita y la información del paciente.
        const resultado = {
            cit_fecha: citaFutura.cit_fecha,
            cit_datosUsuario: {
                usu_nombre: usuarioEncontrado.usu_nombre,
                usu_primer_apellido_usuar: usuarioEncontrado.usu_primer_apellido_usuar,
                usu_telefono: usuarioEncontrado.usu_telefono,
                usu_direccion: usuarioEncontrado.usu_direccion,
                usu_e_mail: usuarioEncontrado.usu_e_mail,
            }
        };

        // Envía el resultado como respuesta a la solicitud HTTP.
        res.send(resultado);
    } catch (error) {
        // En caso de un error durante la ejecución, se registra en la consola y se envía una respuesta de error al cliente.
        console.error(error);
        res.status(500).json({ error: "Error al obtener la próxima cita del paciente." });
    }
});



module.exports = router
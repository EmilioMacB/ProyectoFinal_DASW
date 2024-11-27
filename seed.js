const mongoose = require("mongoose");
const Exercise = require("./models/exercise.js");

// Conectar a MongoDB
mongoose.connect("mongodb+srv://admin:Chocolate20@cluster0.jljyt.mongodb.net/crud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Conectado a MongoDB"))
    .catch((error) => console.error("Error al conectar a MongoDB:", error));

// Lista de ejercicios ajustada a los valores del EventHandler
const exercises = [
    // Ejercicios de Pérdida de peso (peso)
    { name: "Polea hacia abajo con cable", category: "peso", level: "novato", reps: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/latzug.png", video: "https://youtu.be/CAwf7n6Luuc" },
    { name: "Superman", category: "peso", level: "novato", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/rueckenstrecken-liegend.png", video: "https://youtu.be/Ikq3OCFoP7c" },
    { name: "Remo con cable", category: "peso", level: "novato", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kabelzug.png", video: "https://youtu.be/GZbfZ033f74" },
    { name: "Banda de vuelo inverso", category: "peso", level: "novato", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/reverse-flys-fitnessbank.png", video: "https://youtu.be/38leTE2y1I8" },

    { name: "Remo con mancuerna", category: "peso", level: "intermedio", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kurzhantel.png", video: "https://youtu.be/6KNmHxw-SpE" },
    { name: "Dominadas asistidas", category: "peso", level: "intermedio", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/klimmzuege-maschine-unterstuetzt.png", video: "https://youtu.be/aP83vi_2Jhw" },

    { name: "Peso muerto convencional", category: "peso", level: "avanzado", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/deadlift-kreuzheben.png", video: "https://youtu.be/ytGaGIn3SjE" },
    { name: "Pull-ups cerrados", category: "peso", level: "avanzado", reps: "8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/klimmzuege-hammergriff.png", video: "https://youtu.be/BOKk34bxFDM" },

    // Ejercicios para Ganar Músculo (musculo)
    { name: "Press de pecho", category: "musculo", level: "novato", reps: "15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/brustpresse-flach.png", video: "https://youtu.be/VIDEO1" },
    { name: "Press de banca con mancuernas", category: "musculo", level: "novato", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2019/07/bankdruecken-kurzhantel-flachbank.png", video: "https://youtu.be/VIDEO2" },

    { name: "Press de banca con barra", category: "musculo", level: "intermedio", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png", video: "https://youtu.be/VIDEO4" },
    { name: "Fondos", category: "musculo", level: "intermedio", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-dips.png", video: "https://youtu.be/VIDEO5" },

    { name: "Push-ups explosivas con bola de ejercicio", category: "musculo", level: "avanzado", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/liegestuetze-gymnastikball.png", video: "https://youtu.be/VIDEO6" },
    { name: "Press inclinado con barra", category: "musculo", level: "avanzado", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-langhantel.png", video: "https://youtu.be/VIDEO9" },

    // Ejercicios para Mejorar la Condición Física (condicion)
    { name: "Curls de bíceps con mancuernas", category: "condicion", level: "novato", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2018/12/bizepscurls-800x448.png", video: "https://youtu.be/VIDEO7" },
    { name: "Extensión de tríceps", category: "condicion", level: "novato", reps: "12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/trizepsdruecken-kabelzug.png", video: "https://youtu.be/VIDEO8" },

    { name: "Curl de bíceps inclinado", category: "condicion", level: "avanzado", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bizepscurls-schraegbank-800x448.png", video: "https://youtu.be/VIDEO9" },
    { name: "Arnold press con mancuernas", category: "condicion", level: "avanzado", reps: "10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-press-2.png", video: "https://youtu.be/VIDEO10" },
];


// Función para poblar la base de datos
const seedExercises = async () => {
    try {
        await Exercise.deleteMany(); // Elimina ejercicios existentes
        await Exercise.insertMany(exercises);
        console.log("Ejercicios agregados con éxito");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error al agregar ejercicios:", error);
        mongoose.connection.close();
    }
};

seedExercises();

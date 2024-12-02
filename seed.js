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
    // Peso (Pérdida de peso)
    { name: "Polea hacia abajo con cable", category: "peso", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/latzug.png", video: "https://youtu.be/CAwf7n6Luuc" },
    { name: "Superman", category: "peso", level: "novato", reps: "4 sets de 12-16 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/rueckenstrecken-liegend.png", video: "https://youtu.be/Ikq3OCFoP7c" },
    { name: "Remo con cable", category: "peso", level: "intermedio", reps: "3 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kabelzug.png", video: "https://youtu.be/GZbfZ033f74" },
    { name: "Banda de vuelo inverso", category: "peso", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/reverse-flys-fitnessbank.png", video: "https://youtu.be/38leTE2y1I8" },
    { name: "Remo con mancuerna", category: "peso", level: "intermedio", reps: "3 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-kurzhantel.png", video: "https://youtu.be/6KNmHxw-SpE" },
    { name: "Dominadas asistidas", category: "peso", level: "intermedio", reps: "3 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/klimmzuege-maschine-unterstuetzt.png", video: "https://youtu.be/aP83vi_2Jhw" },
    { name: "Dominadas al cuello", category: "peso", level: "avanzado", reps: "4 sets de 6-10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/klimmzuege-nacken.png", video: "https://youtu.be/vau6Bx2cvSQ" },
    { name: "Peso muerto convencional", category: "peso", level: "avanzado", reps: "4 sets de 6-8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/deadlift-kreuzheben.png", video: "https://youtu.be/ytGaGIn3SjE" },

        // Musculo (Ganar músculo)
    { name: "Press de pecho", category: "musculo", level: "intermedio", reps: "4 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/brustpresse-flach.png", video: "https://youtu.be/xUm0BiZCWlQ" },
    { name: "Press de banca con mancuernas", category: "musculo", level: "intermedio", reps: "4 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2019/07/bankdruecken-kurzhantel-flachbank.png", video: "https://youtu.be/5n9TlaoRD58" },        { name: "Aperturas con mancuerna", category: "musculo", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2019/02/fliegende-flachbank-kurzhanteln-1.png", video: "https://youtu.be/QENKPHhQVi4" },
    { name: "Flexiones inclinadas", category: "musculo", level: "novato", reps: "3 sets de 12-16 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/negativ-liegestuetze.png", video: "https://youtu.be/WBmXffkfcXQ" },
    { name: "Press de banca con barra", category: "musculo", level: "intermedio", reps: "4 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png", video: "https://youtu.be/TDSXgCB6KfI" },        { name: "Aperturas con mancuernas en banco inclinado", category: "musculo", level: "intermedio", reps: "3 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/fliegende-schraegbank.png", video: "https://youtu.be/IMALXhhHRKM" },
    { name: "Fondos", category: "musculo", level: "intermedio", reps: "4 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-dips.png", video: "https://youtu.be/yN6Q1UI_xkE" },
    { name: "Press inclinado con mancuernas", category: "musculo", level: "intermedio", reps: "4 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bankdruecken-kurzhantel-schraeg.png", video: "https://youtu.be/Pf1nDoqx_1A" },
    { name: "Push-ups explosivas con bola de ejercicio", category: "musculo", level: "avanzado", reps: "4 sets de 6-8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/liegestuetze-gymnastikball.png", video: "https://youtu.be/yNkEaV5pGjA" },
    { name: "Press inclinado con barra", category: "musculo", level: "avanzado", reps: "4 sets de 6-8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/schraegbankdruecken-langhantel.png", video: "https://youtu.be/LfyQBUKR8SE" },
    { name: "Press de banca con barra pesada", category: "musculo", level: "avanzado", reps: "4 sets de 6 repeticiones", img: "https://training.fit/wp-content/uploads/2018/11/bankdruecken-flachbank-langhantel.png", video: "https://youtu.be/TDSXgCB6KfI" },
    { name: "Flexiones regulares", category: "musculo", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/liegestuetze.png", video: "https://www.youtube.com/watch?v=2ZSq1BRYwAI" },
    { name: "Press militar con barra", category: "musculo", level: "intermedio", reps: "4 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/schulterdruecken-langhantel.png", video: "https://youtu.be/E6osb0k8N_s" },
    { name: "Pull-overs", category: "musculo", level: "avanzado", reps: "4 sets de 8-12 repeticiones", img: "https://training.fit/wp-content/uploads/2019/05/ueberzuege-kurzhantel.png", video: "https://youtu.be/5YStMv6m2g8" },
    { name: "Remo invertido", category: "musculo", level: "intermedio", reps: "3 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-umgekehrt.png", video: "https://youtu.be/hXTc1mDnZCw" },
    { name: "Remo con barra", category: "musculo", level: "avanzado", reps: "4 sets de 6-8 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/rudern-langhantel.png", video: "https://youtu.be/kBWAon7ItDw" },
    
    
    // Condición (Mejorar condición física)
    { name: "Curls de bíceps con mancuernas", category: "condicion", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2018/12/bizepscurls-800x448.png", video: "https://youtu.be/ykJmrZ5v0Oo" },
    { name: "Extensión de tríceps", category: "condicion", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/trizepsdruecken-kabelzug.png", video: "https://youtu.be/AG01W61kwog" },
    { name: "Press militar con mancuernas", category: "condicion", level: "intermedio", reps: "4 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/schulterdruecken-kurzhanteln-800x448.png", video: "https://youtu.be/qEwKCR5JCog" },
    { name: "Elevaciones laterales con mancuernas", category: "condicion", level: "novato", reps: "3 sets de 12-15 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/seitenheben-kurzhanteln-800x448.png", video: "https://youtu.be/q9LhHrHShs4" },
    { name: "Curl de bíceps inclinado", category: "condicion", level: "intermedio", reps: "4 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/bizepscurls-schraegbank-800x448.png", video: "https://youtu.be/soxrZlIl35U" },
    { name: "Rompecraneos acostado", category: "condicion", level: "intermedio", reps: "4 sets de 10-12 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/stirndruecken-langhantel-800x448.png", video: "https://youtu.be/trVzEReByPg" },
    { name: "Fondos para tríceps", category: "condicion", level: "avanzado", reps: "4 sets de 8-10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/02/dips.png", video: "https://youtu.be/yN6Q1UI_xkE" },
    { name: "Arnold press con mancuernas", category: "condicion", level: "avanzado", reps: "4 sets de 8-10 repeticiones", img: "https://training.fit/wp-content/uploads/2020/03/arnold-press-2.png", video: "https://youtu.be/3ml7BH7mNwQ" }
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

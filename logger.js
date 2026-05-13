const { createWriteStream, mkdirSync } = require('fs');
const path = require('path');

// Crear carpeta logs/ si no existe
mkdirSync(path.join(__dirname, 'logs'), { recursive: true });

// Archivo append-only: flag 'a' nunca sobreescribe, solo agrega al final
const logStream = createWriteStream(
  path.join(__dirname, 'logs', 'app.log'),
  { flags: 'a' }
);

function buildEntry(level, data) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    ...data,
  }) + '\n';
}

const logger = {
  info: (data) => {
    const entry = buildEntry('INFO', data);
    logStream.write(entry);
    if (process.env.NODE_ENV !== 'production') process.stdout.write(entry);
  },
  warn: (data) => {
    const entry = buildEntry('WARN', data);
    logStream.write(entry);
    if (process.env.NODE_ENV !== 'production') process.stdout.write(entry);
  },
  error: (data) => {
    const entry = buildEntry('ERROR', data);
    logStream.write(entry);
    process.stderr.write(entry);
  },
};

module.exports = logger;

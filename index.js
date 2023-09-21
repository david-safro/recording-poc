const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('audio', (audioData) => {
        // Save the audio data to a file
        fs.writeFileSync('audio1.wav', Buffer.from(audioData, 'base64'));
        console.log('Audio saved');
    });

    socket.on('requestPlayback', () => {
        // Read the audio file and emit it for playback
        const audioBuffer = fs.readFileSync('audio.wav');
        socket.emit('playback', audioBuffer.toString('base64'));
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

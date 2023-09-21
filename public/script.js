document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const playButton = document.getElementById('playButton');
    const audioPlayer = document.getElementById('audioPlayer');

    let mediaRecorder;
    let audioChunks = [];

    startButton.addEventListener('click', () => {
        startButton.disabled = true;
        stopButton.disabled = false;
        playButton.disabled = true;
        audioChunks = [];

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    audioPlayer.src = URL.createObjectURL(audioBlob);
                    playButton.disabled = false;
                };
                mediaRecorder.start();
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    });

    stopButton.addEventListener('click', () => {
        startButton.disabled = false;
        stopButton.disabled = true;
        mediaRecorder.stop();
    });

    playButton.addEventListener('click', () => {
        audioPlayer.play();
    });
});

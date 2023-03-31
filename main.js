let peerConnection = new RTCPeerConnection();
let localStream;
let remoteStream;

const init = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
    });

    remoteStream = new MediaStream();

    document.getElementById('user-1').srcObject = localStream;
    document.getElementById('user-2').srcObject = remoteStream;

    localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (e) => {
        e.streams[0].getTracks().forEach((track) => {
            remoteStream.addTrack(track);
        });
    };
};

const createOffer = async () => {
    peerConnection.onicecandidate = async (e) => {
        if (e.candidate) {
            document.getElementById('offer-sdp').value = JSON.stringify(
                peerConnection.localDescription
            );
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
};

const createAnswer = async () => {
    let offer = JSON.parse(document.getElementById('offer-sdp').value);

    peerConnection.onicecandidate = async (e) => {
        if (e.candidate) {
            document.getElementById('answer-sdp').value = JSON.stringify(
                peerConnection.localDescription
            );
        }
    };

    await peerConnection.setRemoteDescription(offer);

    let answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
};

const addAnswer = async () => {
    let answer = JSON.parse(document.getElementById('answer-sdp').value);
    if (!answer) return alert('Retrieve answer from peer first');

    if (!peerConnection.currentRemoteDescription) {
        peerConnection.setRemoteDescription(answer);
        console.log(peerConnection);
    }
};

init();

document
    .getElementById('create-offer-button')
    .addEventListener('click', createOffer);

document
    .getElementById('create-answer-button')
    .addEventListener('click', createAnswer);

document.getElementById('add-answer').addEventListener('click', addAnswer);

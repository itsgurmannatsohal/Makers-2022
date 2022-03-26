const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const video = document.getElementById("video");
const video_out = document.getElementById("video-output");
const recordBtn = document.querySelector(".recordbtn");
const vendorUrl = window.URL || window.webkitURL;

var videoURL;
// Start webcam
(function () {
  navigator.getMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  navigator.getMedia(
    {
      video: true,
      audio: false,
    },
    function (stream) {
      video.srcObject = stream;
      console.log(video);
      video.play();
    },
    function (error) {
      // An error occured
    }
  );

  // Display in canvas
  video.addEventListener(
    "play",
    function () {
      draw(this, context, 400, 300);
    },
    false
  );

  function draw(video, context, width, height) {
    // console.log(width);
    // console.log(height);
    
    context.drawImage(video, 0, 0, width, height);
    setTimeout(() => draw(video, context, width, height), 10);
  }

  // The record button
  var videoStream = canvas.captureStream(30);
  var mediaRecorder = new MediaRecorder(videoStream);

  var chunks = [];
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };

  mediaRecorder.onstop = function (e) {
    var blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];
    videoURL = URL.createObjectURL(blob);
    console.log(videoURL);
    video_out.src = videoURL;
    console.log("onstop");
  };
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
    console.log("ondataavailable");
  };

  recordBtn.addEventListener("click", () => {
    console.log("recording start");
    mediaRecorder.start();
    setInterval(draw(video, context, 400, 300), 300);
    console.log("start");
    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  });
})();

document.addEventListener("DOMContentLoaded", () => {
    const video = document.getElementById("webcam");
  
    async function startWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
      } catch (err) {
        console.error("웹캠 접근 불가:", err);
        alert(`웹캠 접근이 거부되었습니다. 브라우저 권한을 확인하세요!\n에러 메시지: ${err.message}`);
      }
    }
  
    async function requestPermission() {
      return new Promise((resolve) => {
        chrome.tabs.create({ url: "camera_permission.html", active: true });
  
        const checkPermission = setInterval(() => {
          chrome.storage.local.get("cameraPermission", (result) => {
            if (result.cameraPermission === true) {
              clearInterval(checkPermission);
              chrome.storage.local.remove("cameraPermission"); // 권한 값 초기화
              resolve();
            }
          });
        }, 1000);
      });
    }
  
    const permissionButton = document.createElement("button");
    permissionButton.innerText = "📸 웹캠 활성화";
    permissionButton.style.padding = "10px";
    permissionButton.style.marginTop = "10px";
    permissionButton.style.fontSize = "16px";
  
    permissionButton.addEventListener("click", async () => {
      permissionButton.remove();
      await requestPermission(); // 새 탭에서 권한 요청 후 승인되면 실행
      await startWebcam();
    });
  
    document.body.appendChild(permissionButton);
  });
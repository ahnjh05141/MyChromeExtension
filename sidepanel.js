document.addEventListener("DOMContentLoaded", async () => {
    const tabsList = document.getElementById("tabs-list");

    console.log("🔹 프로그래머스 관련 열린 탭 목록 불러오기 시작");

    function updateUI() {
        // 기존 목록 초기화
        tabsList.innerHTML = "<li>탭 정보를 불러오는 중...</li>";

        // 저장된 프로그래머스 관련 탭 정보 가져오기
        chrome.storage.local.get("programmersTabs", (result) => {
            if (!result.programmersTabs || result.programmersTabs.length === 0) {
                console.log("❌ 프로그래머스 관련 열린 탭이 없음");
                tabsList.innerHTML = "<li>현재 프로그래머스 관련 열린 탭이 없습니다.</li>";
                return;
            }

            console.log("✅ 저장된 프로그래머스 탭 목록:", result.programmersTabs);

            // 리스트 초기화
            tabsList.innerHTML = "";

            // 모든 필터링된 탭 정보를 리스트로 추가
            result.programmersTabs.forEach(tab => {
                const li = document.createElement("li");
                li.textContent = tab.title || "제목 없음"; // 탭 제목이 없으면 "제목 없음" 표시
                tabsList.appendChild(li);
            });
        });
    }

    // UI 업데이트 실행
    updateUI();

    // storage 변경 감지하여 UI 자동 업데이트
    chrome.storage.onChanged.addListener(() => {
        console.log("🔄 저장된 데이터 변경 감지됨, UI 업데이트");
        updateUI();
    });
});
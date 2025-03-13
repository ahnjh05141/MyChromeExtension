// 특정 URL이 포함된 탭만 필터링하는 함수
async function updateFilteredTabs() {
    console.log("🔄 현재 창의 열린 탭을 다시 필터링 중...");

    chrome.tabs.query({ currentWindow: true }, async (tabs) => {
        if (!tabs || tabs.length === 0) {
            console.log("❌ 현재 창에 열린 탭이 없음");
            await chrome.storage.local.set({ programmersTabs: [] }); // 데이터 초기화
            return;
        }

        // 특정 URL이 포함된 탭만 필터링
        const filteredTabs = tabs.filter(tab => tab.url && tab.url.includes("https://school.programmers.co.kr"))
                                 .map(tab => ({ id: tab.id, title: tab.title }));

        console.log("🔹 필터링된 프로그래머스 관련 탭:", filteredTabs);

        // 필터링된 탭이 없을 경우에도 기존 데이터를 제거하도록 설정
        await chrome.storage.local.set({ programmersTabs: filteredTabs });
        console.log("✅ 저장 완료! 필터링된 탭 개수:", filteredTabs.length);
    });
}

// 사용자가 "사이드 패널에서 열기"를 클릭했을 때 실행
chrome.sidePanel.setOptions({
    enabled: true,
    path: "sidepanel.html"
});

// 확장 프로그램이 실행될 때 초기 필터링 적용
chrome.runtime.onInstalled.addListener(updateFilteredTabs);

// **탭이 업데이트(새로고침)되었을 때 다시 필터링 적용**
chrome.tabs.onUpdated.addListener(() => {
    console.log("🔄 탭 업데이트 감지됨 (새로고침 포함)");
    updateFilteredTabs();
});

// **탭이 닫혔을 때 다시 필터링 적용**
chrome.tabs.onRemoved.addListener(() => {
    console.log("❌ 탭이 닫힘, 목록 갱신");
    updateFilteredTabs();
});
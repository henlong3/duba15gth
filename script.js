// --- Gattahu System Variables ---
let gattahuCurrentLevel = 15; // 초기 레벨 2배 -> 15
let gattahuCurrentStage = 1;
let gattahuCurrentBetUnit = 0;
let gattahuTotalUnits = 15; // 시작 유닛 2배 -> 15
let gattahuWinStreak = 0; // 연속 승리 카운터 (0: 첫 베팅, 1: 첫 베팅 승리 후 다음 베팅)
let gattahuBetHistory = []; // 이전 상태를 저장할 배열 (이전 단계 버튼용)

// Gattahu System: 각 레벨 및 단계별 베팅 규칙 정의
const gattahuLevelMap = {
    // 레벨 번호도 2배로 조정 -> 원래 값으로
    3: { // 3
        1: { bet: 3, win: { type: 'goto', level: 6 }, lose: { type: 'gameOver' } }
    },
    4: { // 4
        1: { bet: 4, win: { type: 'goto', level: 8 }, lose: { type: 'gameOver' } }
    },
    5: { // 5
        1: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevel', units: [2, 4] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 3, win: { type: 'goto', level: 6 }, lose: { type: 'gameOver' } }
    },
    6: { // 6
        1: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevel', units: [2, 4] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 4, win: { type: 'goto', level: 8 }, lose: { type: 'gameOver' } }
    },
    7: { // 7
        1: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevel', units: [2, 4] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 5, win: { type: 'goto', level: 10 }, lose: { type: 'gameOver' } }
    },
    8: { // 8
        1: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevel', units: [2, 4] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 6, win: { type: 'goto', level: 12 }, lose: { type: 'gameOver' } }
    },
    9: { // 9
        1: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevel', units: [2, 4] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 7, win: { type: 'goto', level: 14 }, lose: { type: 'gameOver' } }
    },
    10: { // 10
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 7, win: { type: 'goto', level: 14 }, lose: { type: 'gameOver' } }
    },
    11: { // 11
        1: { bet: 2, win: { type: 'calcLevelSumCurrentLevel', units: [2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 7, win: { type: 'goto', level: 14 }, lose: { type: 'gameOver' } }
    },
    12: { // 12
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 7, win: { type: 'goto', level: 14 }, lose: { type: 'gameOver' } }
    },
    13: { // 13
        1: { bet: 2, win: { type: 'calcLevelSumCurrentLevel', units: [2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 7, win: { type: 'goto', level: 14 }, lose: { type: 'gameOver' } }
    },
    14: { // 14
        1: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevel', units: [2, 4] }, lose: { type: 'goto', stage: 2 } },
        2: { bet: 3, win: { type: 'goto', level: 15 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 5 }, lose: { type: 'gotoLevel', level: 6 } }
    },
    15: { // 15
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    16: { // 16
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    17: { // 17
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    18: { // 18
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    19: { // 19
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    20: { // 20
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    21: { // 21
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 6 }, lose: { type: 'calcLevelSubCurrentLevel', subtract: 9 } }
    },
    22: { // 22
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9, bet2: 3,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 3], subtract: 6 },
            lose: { type: 'specialLoseLevel22_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    23: { // 23
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9, bet2: 3,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 3], subtract: 6 },
            lose: { type: 'specialLoseLevel23_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    24: { // 24
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 6, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 6], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9, bet2: 3,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 3], subtract: 6 },
            lose: { type: 'specialLoseLevel24_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    25: { // 25
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 4], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 5, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 5], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9, bet2: 2,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 2], subtract: 6 },
            lose: { type: 'specialLoseLevel25_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    26: { // 26
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 3], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 4, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 4], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: {
            bet1: 9, bet2: 1,
            win: { type: 'calcLevelSumCurrentLevelSubtract', units: [9, 1], subtract: 6 },
            lose: { type: 'specialLoseLevel26_4' } // 1번째 패배, 2번째 패배 로직 분리
        }
    },
    27: { // 27
        1: { bet1: 1, bet2: 2, win: { type: 'calcLevelSumCurrentLevel', units: [1, 2] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 2], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 3, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 3], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 9, win: { type: 'goto', level: 30 }, lose: { type: 'gotoLevel', level: 12 } } // 단일 베팅
    },
    28: { // 28
        1: { bet1: 1, bet2: 1, win: { type: 'calcLevelSumCurrentLevel', units: [1, 1] }, lose: { type: 'goto', stage: 2 } },
        2: { bet1: 2, bet2: 1, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [2, 1], subtract: 1 }, lose: { type: 'goto', stage: 3 } },
        3: { bet1: 3, bet2: 2, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 2], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 8, win: { type: 'goto', level: 30 }, lose: { type: 'gotoLevel', level: 14 } } // 단일 베팅
    },
    29: { // 29
        1: { bet: 1, win: { type: 'goto', level: 30 }, lose: { type: 'goto', stage: 2 } }, // 단일 베팅
        2: { bet: 2, win: { type: 'goto', level: 30 }, lose: { type: 'goto', stage: 3 } }, // 단일 베팅
        3: { bet1: 3, bet2: 1, win: { type: 'calcLevelSumCurrentLevelSubtract', units: [3, 1], subtract: 3 }, lose: { type: 'goto', stage: 4 } },
        4: { bet: 7, win: { type: 'goto', level: 30 }, lose: { type: 'gotoLevel', level: 16 } } // 단일 베팅
    },
    30: { // 30
        1: { bet: 10, win: { type: 'gameWin' }, lose: { type: 'gameOver' } } // 예시: 레벨 30의 최종 베팅
    }
};

// Gattahu System: DOM 요소 가져오기
const gattahuCurrentLevelEl = document.getElementById('currentLevel');
const gattahuCurrentStageEl = document.getElementById('currentStage');
const gattahuCurrentBetUnitEl = document.getElementById('currentBetUnit');
const gattahuTotalUnitsEl = document.getElementById('totalUnits');
const gattahuMessageEl = document.getElementById('message');
const gattahuWinButton = document.getElementById('winButton');
const gattahuLoseButton = document.getElementById('loseButton');
const gattahuResetButton = document.getElementById('resetButton');
const gattahuUndoButton = document.getElementById('undoButton');

// Gattahu System: 게임 초기화 함수
function gattahuInitializeGame() {
    gattahuCurrentLevel = 15; // 시작 레벨 2배 -> 15
    gattahuCurrentStage = 1;
    gattahuTotalUnits = 15; // 시작 유닛 2배 -> 15
    gattahuWinStreak = 0; // 연속 승리 카운터 리셋
    gattahuBetHistory = []; // 기록 초기화
    gattahuUpdateDisplay(); // 화면 업데이트
    gattahuMessageEl.textContent = `게임 시작! 레벨 ${gattahuCurrentLevel}, ${gattahuCurrentStage}단계.`;
    gattahuMessageEl.classList.remove('win', 'lose'); // 메시지 클래스 초기화
    gattahuEnableButtons(); // 버튼 활성화
}

// Gattahu System: 디스플레이 업데이트 함수
function gattahuUpdateDisplay() {
    const levelData = gattahuLevelMap[gattahuCurrentLevel];
    if (levelData && levelData[gattahuCurrentStage]) {
        const stageData = levelData[gattahuCurrentStage];
        // winStreak 값에 따라 bet1 또는 bet2를 사용
        if (stageData.bet) { // 단일 베팅이 정의된 경우
            gattahuCurrentBetUnit = stageData.bet;
        } else if (stageData.bet1 && stageData.bet2) { // 2단계 베팅이 정의된 경우
            gattahuCurrentBetUnit = gattahuWinStreak === 0 ? stageData.bet1 : stageData.bet2;
        } else {
            gattahuCurrentBetUnit = 0; // 정의되지 않은 경우
        }
    } else {
        gattahuCurrentBetUnit = 0; // 정의되지 않은 레벨/단계 (새로운 레벨이 추가되어야 할 때 발생 가능)
    }

    gattahuCurrentLevelEl.textContent = gattahuCurrentLevel;
    gattahuCurrentStageEl.textContent = gattahuCurrentStage;
    gattahuCurrentBetUnitEl.textContent = gattahuCurrentBetUnit;
    gattahuTotalUnitsEl.textContent = gattahuTotalUnits;

    // 게임 승리 조건 확인
    if (gattahuTotalUnits >= 30) { // 승리 유닛 2배 -> 30
        gattahuGameWin("축하합니다! 총 유닛이 30에 도달하여 게임에 승리했습니다!");
        return; // 승리 시 추가 로직 실행 방지
    }
    // 게임 패배 조건 확인 (초기화 시점 제외)
    // totalUnits가 0 이하가 되면 게임 오버. 단, 초기 totalUnits가 30일 때는 예외.
    if (gattahuTotalUnits <= 0 && !(gattahuCurrentLevel === 30 && gattahuCurrentStage === 1 && gattahuTotalUnits === 30)) { // 초기 유닛도 2배로 고려 -> 원래 값으로
        gattahuGameOver("총 유닛이 0이거나 0 미만이 되어 게임에 패배했습니다.");
        return; // 패배 시 추가 로직 실행 방지
    }

    // 이전 단계 버튼 활성화/비활성화 상태 업데이트
    gattahuUndoButton.disabled = gattahuBetHistory.length === 0;
}

// Gattahu System: 게임 승리 처리 함수
function gattahuGameWin(msg) {
    gattahuMessageEl.textContent = msg;
    gattahuMessageEl.classList.remove('lose');
    gattahuMessageEl.classList.add('win'); // 승리 메시지 스타일 적용
    gattahuDisableButtons();
    gattahuCurrentLevelEl.textContent = "승리";
    gattahuCurrentStageEl.textContent = "승리";
    gattahuCurrentBetUnitEl.textContent = "0";
}

// Gattahu System: 게임 패배 처리 함수
function gattahuGameOver(msg) {
    gattahuMessageEl.textContent = msg;
    gattahuMessageEl.classList.remove('win');
    gattahuMessageEl.classList.add('lose'); // 패배 메시지 스타일 적용
    gattahuDisableButtons();
    gattahuCurrentLevelEl.textContent = "패배";
    gattahuCurrentStageEl.textContent = "패배";
    gattahuCurrentBetUnitEl.textContent = "0";
}

// Gattahu System: 버튼 비활성화 함수
function gattahuDisableButtons() {
    gattahuWinButton.disabled = true;
    gattahuLoseButton.disabled = true;
    gattahuUndoButton.disabled = true;
}

// Gattahu System: 버튼 활성화 함수
function gattahuEnableButtons() {
    gattahuWinButton.disabled = false;
    gattahuLoseButton.disabled = false;
    // 이전 단계 버튼은 기록이 있을 때만 활성화
    gattahuUndoButton.disabled = gattahuBetHistory.length === 0;
}

// Gattahu System: 현재 게임 상태 저장 (이전 단계 버튼용)
function gattahuSaveState() {
    gattahuBetHistory.push({
        level: gattahuCurrentLevel,
        stage: gattahuCurrentStage,
        totalUnits: gattahuTotalUnits,
        winStreak: gattahuWinStreak
    });
}

// Gattahu System: 승리 버튼 클릭 핸들러
function gattahuHandleWin() {
    gattahuSaveState(); // 현재 상태 저장

    const levelData = gattahuLevelMap[gattahuCurrentLevel];
    if (!levelData || !levelData[gattahuCurrentStage]) {
        gattahuMessageEl.textContent = "오류: 현재 레벨/단계 데이터가 정의되지 않았습니다.";
        gattahuGameOver("시스템 오류로 게임 종료.");
        return;
    }

    const stageData = levelData[gattahuCurrentStage];
    let unitsWon = gattahuCurrentBetUnit; // 기본적으로 현재 베팅 유닛만큼 획득

    // 총 유닛 증가
    gattahuTotalUnits += unitsWon;

    // 승리 로직 처리
    if (stageData.win.type === 'goto') {
        gattahuCurrentLevel = stageData.win.level;
        gattahuCurrentStage = 1;
        gattahuWinStreak = 0; // 레벨 이동 시 연속 승리 리셋
        gattahuMessageEl.textContent = `승리! 레벨 ${gattahuCurrentLevel}로 이동합니다.`;
    } else if (stageData.win.type === 'calcLevelSumCurrentLevel') {
        gattahuWinStreak++;
        if (gattahuWinStreak === 2) { // 2연승
            const sumOfBetUnits = stageData.win.units.reduce((sum, u) => sum + u, 0);
            gattahuCurrentLevel += sumOfBetUnits;
            gattahuCurrentStage = 1;
            gattahuWinStreak = 0; // 2연승 달성 후 연속 승리 리셋
            gattahuMessageEl.textContent = `2연승! 레벨 ${gattahuCurrentLevel}로 이동합니다.`;
        } else { // 1연승
            // stageData.bet2는 이미 2배로 조정되었으므로 그대로 사용
            gattahuMessageEl.textContent = `승리! 2번째 베팅(${stageData.bet2 || stageData.bet}유닛)을 시도합니다.`;
        }
    } else if (stageData.win.type === 'calcLevelSumCurrentLevelSubtract') {
        gattahuWinStreak++;
        if (gattahuWinStreak === 2 || (!stageData.bet1 && !stageData.bet2)) { // 2연승이거나 단일 베팅인데 해당 타입인 경우
            const sumOfBetUnits = stageData.win.units.reduce((sum, u) => sum + u, 0);
            gattahuCurrentLevel += sumOfBetUnits - stageData.win.subtract;
            gattahuCurrentStage = 1;
            gattahuWinStreak = 0;
            gattahuMessageEl.textContent = `승리! 레벨 ${gattahuCurrentLevel}로 이동합니다.`;
        } else { // 1연승
            // stageData.bet2는 이미 2배로 조정되었으므로 그대로 사용
            gattahuMessageEl.textContent = `승리! 2번째 베팅(${stageData.bet2 || stageData.bet}유닛)을 시도합니다.`;
        }
    } else if (stageData.win.type === 'gameWin') {
        gattahuGameWin("최종 목표 달성! 게임에 승리했습니다!");
        return;
    } else {
        gattahuMessageEl.textContent = "오류: 알 수 없는 승리 규칙입니다.";
        gattahuGameOver("시스템 오류로 게임 종료.");
        return;
    }

    gattahuUpdateDisplay();
}

// Gattahu System: 패배 버튼 클릭 핸들러
function gattahuHandleLose() {
    gattahuSaveState(); // 현재 상태 저장

    const levelData = gattahuLevelMap[gattahuCurrentLevel];
    if (!levelData || !levelData[gattahuCurrentStage]) {
        gattahuMessageEl.textContent = "오류: 현재 레벨/단계 데이터가 정의되지 않았습니다.";
        gattahuGameOver("시스템 오류로 게임 종료.");
        return;
    }

    const stageData = levelData[gattahuCurrentStage];
    let unitsLost = gattahuCurrentBetUnit; // 현재 베팅 유닛만큼 손실

    // 총 유닛 감소
    gattahuTotalUnits -= unitsLost;

    // 연속 승리 카운터 리셋
    gattahuWinStreak = 0;

    // 패배 로직 처리
    if (stageData.lose.type === 'gameOver') {
        gattahuGameOver("베팅 패배로 유닛이 소진되었습니다.");
    } else if (stageData.lose.type === 'goto') {
        gattahuCurrentStage = stageData.lose.stage;
        gattahuMessageEl.textContent = `패배! ${gattahuCurrentStage}단계로 이동합니다.`;
    } else if (stageData.lose.type === 'gotoLevel') {
        gattahuCurrentLevel = stageData.lose.level;
        gattahuCurrentStage = 1; // 레벨 이동 시 1단계로 리셋
        gattahuMessageEl.textContent = `패배! 레벨 ${gattahuCurrentLevel}로 이동합니다.`;
    } else if (stageData.lose.type === 'calcLevelSubCurrentLevel') {
        gattahuCurrentLevel -= stageData.lose.subtract;
        gattahuCurrentStage = 1; // 레벨 이동 시 1단계로 리셋
        gattahuMessageEl.textContent = `패배! 레벨 ${gattahuCurrentLevel}로 이동합니다.`;
    }
    // 레벨 44-52 (기존 22-26)의 4단계 특수 패배 로직
    else if (stageData.lose.type && stageData.lose.type.startsWith('specialLoseLevel')) {
        let nextLevel = gattahuCurrentLevel;
        // 패배한 베팅 유닛이 첫 번째 베팅 유닛(bet1)과 같으면 1번째 패배로 간주
        // 아니면 (대부분 2번째 베팅 유닛 bet2에서 패배한 경우) 2번째 패배로 간주
        if (unitsLost === (stageData.bet1)) { // bet1도 2배로 계산된 값과 비교 -> 원래 값으로
            nextLevel = gattahuCurrentLevel - 15; // 15 레벨 감소
            gattahuMessageEl.textContent = `패배! (1번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`;
        } else if (unitsLost === (stageData.bet2)) { // bet2도 2배로 계산된 값과 비교 -> 원래 값으로
            if (stageData.lose.type === 'specialLoseLevel25_4') { // 기존 25레벨
                nextLevel = gattahuCurrentLevel + 1; // 1 레벨 증가
                gattahuMessageEl.textContent = `패배! (2번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`;
            } else if (stageData.lose.type === 'specialLoseLevel26_4') { // 기존 26레벨
                nextLevel = gattahuCurrentLevel + 2; // 2 레벨 증가
                gattahuMessageEl.textContent = `패배! (2번째 베팅 실패) 레벨 ${nextLevel}로 이동합니다.`;
            } else { // 22, 23, 24의 4단계 2번째 베팅 패배 시 (2배된 레벨 기준 44, 46, 48) -> 원래 값으로
                nextLevel = gattahuCurrentLevel; // 현재 레벨 유지
                gattahuMessageEl.textContent = `패배! (2번째 베팅 실패) 현재 레벨 ${nextLevel}을 유지합니다.`;
            }
        } else {
            gattahuMessageEl.textContent = "오류: 알 수 없는 4단계 패배 규칙입니다.";
            gattahuGameOver("시스템 오류로 게임 종료.");
            return;
        }
        gattahuCurrentLevel = nextLevel;
        gattahuCurrentStage = 1; // 특수 패배 후 다음 레벨의 1단계로 이동
    }
    else {
        gattahuMessageEl.textContent = "알 수 없는 패배 규칙입니다.";
        gattahuGameOver("시스템 오류로 게임 종료.");
        return;
    }

    gattahuUpdateDisplay();
}

// Gattahu System: 리셋 버튼 클릭 핸들러 (사용자 정의 대화 상자 사용)
function gattahuHandleReset() {
    // 확인을 위한 사용자 정의 모달 (confirm() 대체)
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center;
        z-index: 1000;
    `;
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white; padding: 20px; border-radius: 10px; text-align: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3); max-width: 300px;
    `;
    modalContent.innerHTML = `
        <p style="color: #333; font-size: 1.1em; margin-bottom: 20px;">정말로 게임을 리셋하시겠습니까?</p>
        <button id="modalConfirmBtn" style="background-color: #27ae60; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">확인</button>
        <button id="modalCancelBtn" style="background-color: #c0392b; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">취소</button>
    `;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('modalConfirmBtn').onclick = () => {
        gattahuInitializeGame();
        document.body.removeChild(modal);
    };
    document.getElementById('modalCancelBtn').onclick = () => {
        document.body.removeChild(modal);
    };
}


// Gattahu System: 이전 단계 버튼 클릭 핸들러
function gattahuHandleUndo() {
    if (gattahuBetHistory.length > 0) {
        const prevState = gattahuBetHistory.pop(); // 가장 최근 상태 가져오기
        gattahuCurrentLevel = prevState.level;
        gattahuCurrentStage = prevState.stage;
        gattahuTotalUnits = prevState.totalUnits;
        gattahuWinStreak = prevState.winStreak;
        gattahuMessageEl.textContent = "이전 상태로 돌아갑니다.";
        gattahuMessageEl.classList.remove('win', 'lose'); // 메시지 클래스 초기화
        gattahuUpdateDisplay();
        gattahuEnableButtons(); // 이전 단계 후 버튼 활성화
    } else {
        gattahuMessageEl.textContent = "더 이상 돌아갈 이전 상태가 없습니다.";
        gattahuUndoButton.disabled = true; // 기록이 없으면 비활성화
    }
}

// Gattahu System: 이벤트 리스너 연결
document.addEventListener('DOMContentLoaded', () => {
    // 요소가 존재하는 경우에만 리스너 추가
    if (gattahuWinButton) gattahuWinButton.addEventListener('click', gattahuHandleWin);
    if (gattahuLoseButton) gattahuLoseButton.addEventListener('click', gattahuHandleLose);
    if (gattahuResetButton) gattahuResetButton.addEventListener('click', gattahuHandleReset);
    if (gattahuUndoButton) gattahuUndoButton.addEventListener('click', gattahuHandleUndo);
    gattahuInitializeGame(); // 페이지 로드 시 가따후 게임 초기화
});


// --- 악마의 바카라 예언자 시스템 변수 ---
let baccaratDice = [];
let baccaratResult = '';
let baccaratCount = 0;
let baccaratBankerCount = 0;
let baccaratPlayerCount = 0;
let baccaratTieCount = 0;
let baccaratConsecutiveBanker = 0;
let baccaratConsecutivePlayer = 0;
let baccaratConsecutiveTie = 0;
let baccaratLastResult = null;
let baccaratBankerBeforeTie = 0;
let baccaratPlayerBeforeTie = 0;
let baccaratHistory = [];

// 악마의 바카라 예언자: DOM 요소
const baccaratDiceEl = document.getElementById('baccaratDice');
const baccaratResultTextEl = document.getElementById('baccaratResultText');
const baccaratTotalCountEl = document.getElementById('baccaratTotalCount');
const baccaratBankerCountEl = document.getElementById('baccaratBankerCount');
const baccaratPlayerCountEl = document.getElementById('baccaratPlayerCount');
const baccaratTieCountEl = document.getElementById('baccaratTieCount');
const baccaratConsecutiveBankerEl = document.getElementById('baccaratConsecutiveBanker');
const baccaratConsecutivePlayerEl = document.getElementById('baccaratConsecutivePlayer');
const baccaratConsecutiveTieEl = document.getElementById('baccaratConsecutiveTie');
const baccaratRollDiceButton = document.getElementById('rollDiceButton');
const baccaratGoBackButton = document.getElementById('baccaratGoBackButton');
const baccaratResetButton = document.getElementById('baccaratResetButton');

// 악마의 바카라 예언자: 숫자가 홀수인지 확인하는 헬퍼 함수
function baccaratIsOdd(num) {
    return num % 2 === 1;
}

// 악마의 바카라 예언자: 숫자가 짝수인지 확인하는 헬퍼 함수
function baccaratIsEven(num) {
    return num % 2 === 0;
}

// 악마의 바카라 예언자: 디스플레이 업데이트 함수
function baccaratUpdateDisplay() {
    if (baccaratDiceEl) baccaratDiceEl.textContent = baccaratDice.length ? baccaratDice.join(', ') : '아직 예언되지 않음';
    if (baccaratResultTextEl) baccaratResultTextEl.textContent = baccaratResult;
    if (baccaratTotalCountEl) baccaratTotalCountEl.textContent = baccaratCount;
    if (baccaratBankerCountEl) baccaratBankerCountEl.textContent = baccaratBankerCount;
    if (baccaratPlayerCountEl) baccaratPlayerCountEl.textContent = baccaratPlayerCount;
    if (baccaratTieCountEl) baccaratTieCountEl.textContent = baccaratTieCount;
    if (baccaratConsecutiveBankerEl) baccaratConsecutiveBankerEl.textContent = baccaratConsecutiveBanker;
    if (baccaratConsecutivePlayerEl) baccaratConsecutivePlayerEl.textContent = baccaratConsecutivePlayer;
    if (baccaratConsecutiveTieEl) baccaratConsecutiveTieEl.textContent = baccaratConsecutiveTie;
    if (baccaratGoBackButton) baccaratGoBackButton.disabled = baccaratHistory.length === 0;
}

// 악마의 바카라 예언자: 현재 상태를 기록에 저장하는 함수
function baccaratSaveStateToHistory() {
    baccaratHistory.push({
        dice: [...baccaratDice], // 배열을 깊은 복사
        result: baccaratResult,
        count: baccaratCount,
        bankerCount: baccaratBankerCount,
        playerCount: baccaratPlayerCount,
        tieCount: baccaratTieCount,
        consecutiveBanker: baccaratConsecutiveBanker,
        consecutivePlayer: baccaratConsecutivePlayer,
        consecutiveTie: baccaratConsecutiveTie,
        lastResult: baccaratLastResult,
        bankerBeforeTie: baccaratBankerBeforeTie,
        playerBeforeTie: baccaratPlayerBeforeTie,
    });
}

// 악마의 바카라 예언자: 주사위를 굴리고 결과를 결정하는 함수
function baccaratRollDice() {
    // 새로운 주사위 굴림 전에 현재 상태를 기록에 저장
    baccaratSaveStateToHistory();

    // 1부터 6까지의 30개 무작위 주사위 굴림 생성
    const newDice = Array.from({ length: 30 }, () => Math.floor(Math.random() * 6) + 1);
    baccaratDice = newDice; // 전역 변수 업데이트

    // 홀수와 짝수 개수 세기
    const oddCount = newDice.filter(baccaratIsOdd).length;
    const evenCount = newDice.filter(baccaratIsEven).length;

    let currentResult = '';
    // 홀수/짝수 개수 비교를 기반으로 결과 결정
    if (oddCount > evenCount) {
        currentResult = 'BANKER';
    } else if (evenCount > oddCount) {
        currentResult = 'PLAYER';
    } else {
        currentResult = 'TIE';
    }
    baccaratResult = currentResult; // 전역 변수 업데이트

    // 총 개수 업데이트
    if (currentResult === 'BANKER') {
        baccaratBankerCount++;
    } else if (currentResult === 'PLAYER') {
        baccaratPlayerCount++;
    } else {
        baccaratTieCount++;
    }
    baccaratCount++;

    // --- 연속 개수 업데이트 로직 ---
    if (currentResult === 'TIE') {
        baccaratConsecutiveTie++;
        // 이전 결과가 TIE가 아니었다면, TIE 연속이 시작되기 전의 비-TIE 연속 개수를 저장
        if (baccaratLastResult !== 'TIE') {
            baccaratBankerBeforeTie = baccaratConsecutiveBanker;
            baccaratPlayerBeforeTie = baccaratConsecutivePlayer;
        }
    } else if (currentResult === 'BANKER') {
        baccaratConsecutiveTie = 0; // TIE 연속 끊김
        baccaratConsecutivePlayer = 0; // PLAYER 연속 끊김

        if (baccaratLastResult === 'BANKER') {
            baccaratConsecutiveBanker++;
        } else if (baccaratLastResult === 'TIE') {
            // TIE 연속에서 벗어나는 경우, TIE 시작 전의 BANKER 연속 개수에서 이어서 계산
            baccaratConsecutiveBanker = baccaratBankerBeforeTie + 1;
        } else { // lastResult가 PLAYER이거나 null인 경우
            baccaratConsecutiveBanker = 1;
        }
        baccaratBankerBeforeTie = 0;
        baccaratPlayerBeforeTie = 0;
    } else { // currentResult === 'PLAYER'
        baccaratConsecutiveTie = 0; // TIE 연속 끊김
        baccaratConsecutiveBanker = 0; // BANKER 연속 끊김

        if (baccaratLastResult === 'PLAYER') {
            baccaratConsecutivePlayer++;
        } else if (baccaratLastResult === 'TIE') {
            // TIE 연속에서 벗어나는 경우, TIE 시작 전의 PLAYER 연속 개수에서 이어서 계산
            baccaratConsecutivePlayer = baccaratPlayerBeforeTie + 1;
        } else { // lastResult가 BANKER이거나 null인 경우
            baccaratConsecutivePlayer = 1;
        }
        baccaratPlayerBeforeTie = 0;
        baccaratBankerBeforeTie = 0;
    }

    baccaratLastResult = currentResult; // 다음 굴림을 위해 현재 결과 저장
    baccaratUpdateDisplay(); // 모든 변경 후 디스플레이 업데이트
}

// 악마의 바카라 예언자: 이전 상태로 돌아가는 함수
function baccaratGoBack() {
    if (baccaratHistory.length > 0) {
        const previousState = baccaratHistory.pop(); // 마지막 상태 가져오기
        // 모든 전역 변수를 이전 상태로 복원
        baccaratDice = previousState.dice;
        baccaratResult = previousState.result;
        baccaratCount = previousState.count;
        baccaratBankerCount = previousState.bankerCount;
        baccaratPlayerCount = previousState.playerCount;
        baccaratTieCount = previousState.tieCount;
        baccaratConsecutiveBanker = previousState.consecutiveBanker;
        baccaratConsecutivePlayer = previousState.consecutivePlayer;
        baccaratConsecutiveTie = previousState.consecutiveTie;
        baccaratLastResult = previousState.lastResult;
        baccaratBankerBeforeTie = previousState.bankerBeforeTie;
        baccaratPlayerBeforeTie = previousState.playerBeforeTie;

        baccaratUpdateDisplay(); // 복원 후 디스플레이 업데이트
    }
}

// 악마의 바카라 예언자: 모든 게임 상태를 리셋하는 함수
function baccaratResetGame() {
    baccaratDice = [];
    baccaratResult = '';
    baccaratCount = 0;
    baccaratBankerCount = 0;
    baccaratPlayerCount = 0;
    baccaratTieCount = 0;
    baccaratConsecutiveBanker = 0;
    baccaratConsecutivePlayer = 0;
    baccaratConsecutiveTie = 0;
    baccaratLastResult = null;
    baccaratBankerBeforeTie = 0;
    baccaratPlayerBeforeTie = 0;
    baccaratHistory = []; // 리셋 시 기록 초기화
    baccaratUpdateDisplay(); // 리셋 후 디스플레이 업데이트
}

// 악마의 바카라 예언자: 이벤트 리스너 및 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (baccaratRollDiceButton) baccaratRollDiceButton.addEventListener('click', baccaratRollDice);
    if (baccaratGoBackButton) baccaratGoBackButton.addEventListener('click', baccaratGoBack);
    if (baccaratResetButton) baccaratResetButton.addEventListener('click', baccaratResetGame);
    baccaratUpdateDisplay(); // 악마의 바카라 예언자 초기 디스플레이 업데이트
});
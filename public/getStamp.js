window.onload = async function () {
    try {
        const db = await openDatabase();
        const db2 = await openDatabase2();
        const entries = await fetchAllEntries(db); // データベースの全エントリーを取得
        renderStamps(entries); // エントリーをレンダリング
        await displayCnt(db2);
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
};

const dbName = "ComiculCheckInDB";
const storeName = "CheckInDate";
const dbName2 = "ComiculStamp";
const storeName2 = "Count";
const dbName3 = "ComiculDate";
const storeName3 = "Date";
const dbName4 = "ComiculImgDB";
const storeName4 = "Img";

// IndexedDBに接続
function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "id" }); // keyPathを'id'に設定
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function openDatabase2() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName2, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName2, { keyPath: "id" }); // keyPathを'id'に設定
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function openDatabaseDate() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName3, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName3, { keyPath: "id" }); // keyPathを'id'に設定
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function checkIfIdExists(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(id);
        request.onsuccess = () => {
            resolve(request.result !== undefined);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function checkIfIdExists2(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName2], "readonly");
        const store = transaction.objectStore(storeName2);
        const request = store.get(id);
        request.onsuccess = () => {
            resolve(request.result !== undefined);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function checkIfDateExists(db, date) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName3], "readonly");
        const store = transaction.objectStore(storeName3);
        const request = store.getAll();
        request.onsuccess = () => {
            const exists = request.result.some((item) => item.date === date);
            resolve(exists);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function fetchAllEntries(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const request = objectStore.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function (event) {
            console.error(
                "データの取得に失敗しました:",
                event.target.errorCode,
            );
            reject(event.target.errorCode);
        };
    });
}

function renderStamps(entries) {
    const stampCard = document.getElementById("stampCard");
    const stampDivs = stampCard.querySelectorAll(".stamp"); // 既存の空セルを取得

    // 必要に応じてソート（例: id 順）
    const sortedEntries = entries.sort((a, b) => a.id.localeCompare(b.id));

    // スタンプを表示
    sortedEntries.forEach((entry, index) => {
        if (stampDivs[index] && entry.stamp) {
            // 画像を埋め込む
            stampDivs[index].innerHTML =
                `<img src="${entry.stamp}" alt="スタンプ">`;
        }
    });
}

async function displayCnt(db) {
    const cntField = document.getElementById("cnt");

    try {
        // データベース内に "cntReward" が存在するか確認
        const idExists = await checkIfIdExists2(db, "cntReward");

        // トランザクションを開始
        const transaction = db.transaction([storeName2], "readonly");
        const objectStore = transaction.objectStore(storeName2);

        // トランザクションが完了した後に結果を取得
        const request = objectStore.get("cntReward");

        // 非同期でデータ取得を待つ
        const result = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        if (idExists) {
            if (result) {
                cntField.innerHTML = `コンプリート回数：${result.count}`;
                if (result.count !== 0) {
                    setInterval(() => createStar(result.count), 100);
                }
            } else {
                throw new Error("cntRewardのデータが見つかりません。");
            }
        } else {
            // データが存在しない場合は新規保存
            await saveReward(db, 0);
            cntField.innerHTML = "コンプリート回数：0";
        }
    } catch (error) {
        console.error("displayCnt関数でエラーが発生しました:", error);
        cntField.innerHTML = "データが取得できませんでした。";
    }
}

const popupWrapper = document.getElementById("popup-wrapper");
const popupWrapper2 = document.getElementById("popup2-wrapper");
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
let count = 0;

document.getElementById("exchange").onclick = async function () {
    const db = await openDatabase();
    const db2 = await openDatabase2();
    const stamps = await countEntries(db);

    if (stamps >= 6) {
        count = await getCntStamp(db2);
        popupWrapper2.style.display = "block";
        if (!popupWrapper2.dataset.listenerAdded) {
            popupWrapper2.dataset.listenerAdded = true;

            popupWrapper2.addEventListener("click", (e) => {
                if (
                    e.target.id === "popup2-wrapper" ||
                    e.target.closest("#btn-no") // btn-noに近い要素をクリックした場合も検知
                ) {
                    popupWrapper2.style.display = "none";
                } else if (e.target.closest("#btn-yes")) {
                    doReloadWithCache(count, db2);
                    popupWrapper2.style.display = "none";
                }
            });
        }
    } else {
        popupWrapper.style.display = "block";

        // イベントリスナーを1度だけ登録
        if (!popupWrapper.dataset.listenerAdded) {
            popupWrapper.dataset.listenerAdded = true;

            popupWrapper.addEventListener("click", (e) => {
                if (e.target.id === "popup-wrapper") {
                    popupWrapper.style.display = "none";
                }
            });
        }
    }
};

function countEntries(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName], "readonly");
        const objectStore = transaction.objectStore(storeName);
        const countRequest = objectStore.count();

        countRequest.onsuccess = function () {
            resolve(countRequest.result);
            return countRequest.result;
        };

        countRequest.onerror = function (event) {
            reject(event.target.errorCode);
        };
    });
}

function doReloadWithCache(count, db2) {
    const messageElement = document.getElementById("check-message");
    if (messageElement) {
        messageElement.textContent = "コンプリート処理中です...";
    }
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = function () {
        count++;
        saveReward(db2, count);
        // キャッシュを利用してリロード
        location.reload();
    };

    request.onerror = function (event) {
        console.error("データベースの削除に失敗しました:", event.target.error);
        // エラーメッセージを画面に表示
        const messageElement = document.getElementById("check-message");
        if (messageElement) {
            messageElement.textContent =
                "コンプリート処理中にエラーが発生しました。もう一度お試しください。";
        }
    };

    request.onblocked = function () {
        console.warn(
            "データベースの削除がブロックされています。全てのタブを閉じてから再試行してください。",
        );
        // エラーメッセージを画面に表示
        const messageElement = document.getElementById("check-message");
        if (messageElement) {
            messageElement.textContent =
                "処理がブロックされています。全てのタブを閉じてから再試行してください。";
        }
    };
}

function saveReward(db, point) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName2], "readwrite");
        const store = transaction.objectStore(storeName2);
        const request = store.put({ id: "cntReward", count: point });
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

async function getCntStamp(db) {
    try {
        // トランザクションを開始
        const transaction = db.transaction([storeName2], "readonly");
        const objectStore = transaction.objectStore(storeName2);

        // トランザクションが完了した後に結果を取得
        const request = objectStore.get("cntReward");

        // 非同期でデータ取得を待つ
        const result = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        return result.count;
    } catch (error) {
        console.error("displayCnt関数でエラーが発生しました:", error);
        cntField.innerHTML = "データが取得できませんでした。";
    }
}

document.getElementById("checkin").onclick = async function () {
    const messageElement = document.getElementById("check-message");
    const todayId = getTodayDateString();

    const db = await openDatabaseDate();
    const idExists = await checkIfDateExists(db, todayId);
    const db2 = await openDatabase();
    const stamps = await countEntries(db2);

    if (idExists) {
        messageElement.textContent = "既にチェックイン済みです。";
    } else {
        if (stamps >= 6) {
            messageElement.textContent = "スタンプがいっぱいだよ～！";
        } else {
            window.location.href = "./read.html";
        }
    }
};

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 月は0から始まるので1を足す
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

const createStar = (cnt) => {
    const star = document.createElement("div");
    star.classList.add("stars");

    const left = Math.random() * (window.innerWidth * 0.9) +
        (window.innerWidth * 0.05);
    const duration = Math.random() * 5 + 3;

    star.style.left = `${left}px`;
    star.style.animationDuration = `${duration}s`;
    let color;
    switch (cnt) {
        case 1:
            color = "#ffffff";
            break;
        case 2:
            color = "#9A6229";
            break;
        case 3:
            color = "#c9caca";
            break;
        default:
            color = "#e6b422";
    }
    star.style.setProperty("--star-color", color);
    document.body.appendChild(star);

    // アニメーションが終わったら削除
    setTimeout(() => {
        star.remove();
    }, duration * 1000);
};

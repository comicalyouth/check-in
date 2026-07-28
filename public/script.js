const dbName = "ComiculCheckInDB";
const storeName = "CheckInDate";
const dbName3 = "ComiculDate";
const storeName3 = "Date";
const dbName4 = "ComiculImgDB";
const storeName4 = "Img";
const stampList = [
    "img/stamp1.png",
    "img/stamp2.png",
    "img/stamp3.png",
    "img/stamp4.png",
    "img/stamp5.png",
    "img/stamp6.png",
    "img/stamp7.png",
    "img/stamp8.png",
    "img/stamp9.png",
    "img/stamp10.png",
    "img/stamp11.png",
    "img/stamp12.png",
    "img/stamp13.png",
    "img/stamp14.png",
    "img/stamp15.png",
    "img/stamp16.png",
    "img/stamp17.png",
    "img/stamp18.png",
    "img/stamp19.png",
    "img/stamp20.png",
];

function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName, { keyPath: "id" });
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
            db.createObjectStore(storeName3, { keyPath: "id" });
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function openDatabaseImg() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName4, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName4, { keyPath: "id" });
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function saveClick(db) {
    return new Promise((resolve, reject) => {
        const stamp = stampList[Math.floor(Math.random() * stampList.length)];
        const transaction = db.transaction([storeName], "readwrite");
        const store = transaction.objectStore(storeName);
        const data = { id: getTodayDateString(), stamp: stamp };
        const request = store.put(data);
        request.onsuccess = () => {
            resolve({ stamp: stamp, result: request.result });
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function saveDate(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName3], "readwrite");
        const store = transaction.objectStore(storeName3);
        const data = { id: "Date", date: getTodayDateString() };
        const request = store.put(data);
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function saveImg(db, img, cnt) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName4], "readwrite");
        const store = transaction.objectStore(storeName4);
        const data = { id: img, cnt: cnt };
        const request = store.put(data);
        request.onsuccess = () => {
            resolve(request.result);
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

function checkIfIdExistsImg(db, id) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName4], "readonly");
        const store = transaction.objectStore(storeName4);
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

function openModal() {
    const name = document.getElementById("field-name").value;
    const age = document.querySelector('input[name="age"]:checked');
    const otherAge = document.getElementById("ageForm").value;
    const childCount = document.getElementById("childCountForm").value;
    const affiliation = document.querySelector(
        'input[name="affiliation"]:checked',
    );
    const gender = document.querySelector('input[name="gender"]:checked');
    const venue = document.querySelector('input[name="venue"]:checked');
    const otherVenue = document.getElementById("venueForm").value;
    const times = document.querySelector('input[name="time"]:checked');
    const subsequentTimes = document.getElementById("timesForm").value;
    const message = document.getElementById("field-message").value;
    const agreementCheckbox = document.getElementById("agreement-checkbox");

    const ageValue = age ? age.value : "未選択";
    const genderValue = gender ? gender.value : "未選択";
    const affiliationValue = affiliation ? affiliation.value : "未選択";
    const venueValue = venue ? venue.value : "未選択";
    const timesValue = times ? times.value : "未選択";

    if (
        !name || ageValue === "未選択" || affiliationValue === "未選択" ||
        venueValue === "未選択" || timesValue === "未選択"
    ) {
        errorModal();
        return;
    }

    if (ageValue === "その他" && !otherAge.trim()) {
        ageErrorModal();
        return;
    }

    if (venueValue === "その他" && !otherVenue.trim()) {
        venueErrorModal();
        return;
    }

    if (timesValue === "2回目以上" && !subsequentTimes.trim()) {
        timesErrorModal();
        return;
    }

    if (!agreementCheckbox.checked) {
        agreementErrorModal();
        return;
    }

    document.getElementById("confirmName").textContent = name;

    if (ageValue === "その他") {
        document.getElementById("confirmOtherAge").textContent = otherAge;
        document.getElementById("confirmAgeContent").style.display = "none";
        document.getElementById("confirmOtherAgeContent").style.display =
            "block";
    } else {
        document.getElementById("confirmAge").textContent = age.value;
        document.getElementById("confirmOtherAgeContent").style.display =
            "none";
        document.getElementById("confirmAgeContent").style.display = "block";
    }

    if (!childCount) {
        document.getElementById("confirmChildCountContent").style.display =
            "none";
    } else {
        document.getElementById("confirmChildCountContent").style.display =
            "block";
        document.getElementById("confirmChildCount").textContent = childCount;
    }

    document.getElementById("confirmAffiliation").textContent =
        affiliation.value;
    document.getElementById("confirmGender").textContent = genderValue;

    if (venueValue === "その他") {
        document.getElementById("confirmOtherVenue").textContent = otherVenue;
        document.getElementById("confirmVenueContent").style.display = "none";
        document.getElementById("confirmOtherVenueContent").style.display =
            "block";
    } else {
        document.getElementById("confirmVenue").textContent = venue.value;
        document.getElementById("confirmOtherVenueContent").style.display =
            "none";
        document.getElementById("confirmVenueContent").style.display = "block";
    }

    if (timesValue === "2回目以上") {
        document.getElementById("confirmSubsequentTimes").textContent =
            subsequentTimes;
        document.getElementById("confirmTimesContent").style.display = "none";
        document.getElementById("confirmSubsequentTimesContent").style.display =
            "block";
    } else {
        document.getElementById("confirmTimes").textContent = times.value;
        document.getElementById("confirmSubsequentTimesContent").style.display =
            "none";
        document.getElementById("confirmTimesContent").style.display = "block";
    }
    document.getElementById("confirmMessage").textContent = message;

    document.getElementById("confirmationModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("confirmationModal").style.display = "none";
}

function submitForm() {
    const name = document.getElementById("field-name").value;
    const age = document.querySelector('input[name="age"]:checked').value;
    const otherAge = document.getElementById("ageForm").value;
    const childCount = document.getElementById("childCountForm").value;
    const affiliation =
        document.querySelector('input[name="affiliation"]:checked').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const genderValue = gender ? gender.value : "未選択";
    const venue = document.querySelector('input[name="venue"]:checked').value;
    const otherVenue = document.getElementById("venueForm").value;
    const times = document.querySelector('input[name="time"]:checked').value;
    const subsequentTimes = document.getElementById("timesForm").value;
    const message = document.getElementById("field-message").value;
    const agreementCheckbox = document.getElementById("agreement-checkbox");

    const formData = new FormData();
    formData.append("entry.1654571786", name);
    formData.append("entry.714047486", age);
    if (age === "その他") {
        formData.append("entry.864932330", otherAge);
    }
    formData.append("entry.1246787910", childCount);
    formData.append("entry.698331776", affiliation);
    if (genderValue !== "未選択") {
        formData.append("entry.682017022", gender.value);
    }
    formData.append("entry.291128310", venue);
    if (venue === "その他") {
        formData.append("entry.210379980", otherVenue);
    }
    formData.append("entry.1293087498", times);
    if (times === "2回目以上") {
        formData.append("entry.1339972301", subsequentTimes);
    }
    formData.append("entry.1106892360", message);
    formData.append(
        "entry.1790208126",
        agreementCheckbox.checked ? "同意する" : "同意しない",
    );

    fetch(
        "https://docs.google.com/forms/u/0/d/e/1FAIpQLSeeWK01nT80BLZ7P-z5gRElv8lRuZzqBPCKshgtOGEt0OrZsQ/formResponse",
        {
            method: "POST",
            body: formData,
            mode: "no-cors",
        },
    ).then(() => {
        document.getElementById("field-name").value = "";
        document.querySelectorAll('input[name="age"]').forEach(
            (input) => (input.checked = false),
        );
        document.getElementById("ageForm").value = "";
        document.getElementById("other-age-input").styledisplay = "none";
        document.getElementById("childCountForm").value = "";
        document.querySelectorAll('input[name="affiliation"]').forEach(
            (input) => (input.checked = false),
        );
        document.querySelectorAll('input[name="gender"]').forEach(
            (input) => (input.checked = false),
        );
        document.querySelectorAll('input[name="venue"]').forEach(
            (input) => (input.checked = false),
        );
        document.getElementById("venueForm").value = "";
        document.getElementById("other-venue-input").style.display = "none";
        document.querySelectorAll('input[name="time"]').forEach(
            (input) => (input.checked = false),
        );
        document.getElementById("timesForm").value = "";
        document.getElementById("other-time-input").style.display = "none";
        document.getElementById("field-message").value = "";
        document.getElementById("agreement-checkbox").checked = false;

        document.getElementById("confirmationModal").style.display = "none";
        showThankYouModal();
    }).catch((error) => {
        console.error("送信エラー:", error);
    });
}

function showThankYouModal() {
    const thankYouModal = document.createElement("div");
    thankYouModal.id = "thankYouModal";
    thankYouModal.classList.add("modal");
    thankYouModal.style.display = "flex";

    thankYouModal.innerHTML = `
        <div class="modal-content">
            <h2>チェックイン完了！！</h2>
            <button id="check">スタンプ獲得</button>
        </div>
    `;

    document.body.appendChild(thankYouModal);

    document.getElementById("check").onclick = async function () {
        this.disabled = true;
        this.textContent = "処理中...";

        const thankYouModal = document.getElementById("thankYouModal");
        const todayId = getTodayDateString();

        let db, db2, db3;

        try {
            db = await openDatabase();
            db2 = await openDatabaseDate();
            db3 = await openDatabaseImg();
            const idExists = await checkIfIdExists(db, todayId);

            if (idExists) {
                console.warn("本日は既にスタンプを獲得済みです。");
            } else {
                const img = await saveClick(db);
                await saveDate(db2);
                const idExistsImg = await checkIfIdExistsImg(db3, img.stamp);
                if (idExistsImg) {
                    const transaction = db3.transaction(
                        [storeName4],
                        "readonly",
                    );
                    const objectStore = transaction.objectStore(storeName4);
                    const request = objectStore.get(img.stamp);

                    const result = await new Promise((resolve, reject) => {
                        request.onsuccess = () => resolve(request.result);
                        request.onerror = () => reject(request.error);
                    });

                    if (result) {
                        let cnt = result.cnt;
                        cnt++;
                        await saveImg(db3, img.stamp, cnt);
                    } else {
                        throw new Error("画像のデータが見つかりません。");
                    }
                } else {
                    const cnt = 1;
                    await saveImg(db3, img.stamp, cnt);
                }
            }

            if (thankYouModal) {
                thankYouModal.style.display = "none";
                thankYouModal.remove();
            }

            window.location.href = "./index.html";
            return;
        } catch (err) {
            console.error("スタンプ獲得処理に失敗しました:", err);

            this.disabled = false;
            this.textContent = "スタンプ獲得";
            alert("エラーが発生しました。もう一度お試しください。");
        } finally {
            if (db) db.close();
            if (db2) db2.close();
            if (db3) db3.close();
        }
    };
}

function errorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>必須項目を<br>全て入力して下さい</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function ageErrorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>「その他」を選択した場合<br>年齢を入力して下さい</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function venueErrorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>「その他」を選択した場合<br>開催地を入力して下さい</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function timesErrorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>「２回目以上」を選択した場合<br>回数を入力して下さい</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function agreementErrorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>同意事項にチェックを<br>入れてください</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function checkinErrorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>既にチェックイン済みです。</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function stampCntErrorModal() {
    const errorModal = document.createElement("div");
    errorModal.id = "errorModal";
    errorModal.classList.add("modal");
    errorModal.style.display = "flex";

    errorModal.innerHTML = `
        <div class="modal-content">
            <h2>スタンプがいっぱいだよ～！</h2>
            <button onclick="closeErrorModal()">閉じる</button>
        </div>
    `;

    document.body.appendChild(errorModal);
    window.addEventListener("click", (event) => {
        if (event.target === errorModal) {
            errorModal.style.display = "none";
        }
    });
}

function closeErrorModal() {
    const errorModal = document.getElementById("errorModal");
    if (errorModal) {
        errorModal.style.display = "none";
        errorModal.remove();
    }
}

document.querySelectorAll('input[name="venue"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        const otherInput = document.getElementById("other-venue-input");
        if (document.getElementById("venue-other").checked) {
            otherInput.style.display = "block";
        } else {
            otherInput.style.display = "none";
        }
    });
});

document.querySelectorAll('input[name="time"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        const otherInput = document.getElementById("other-time-input");
        if (document.getElementById("subsequent-times").checked) {
            otherInput.style.display = "block";
        } else {
            otherInput.style.display = "none";
        }
    });
});

document.querySelectorAll('input[name="age"]').forEach(function (radio) {
    radio.addEventListener("change", function () {
        const otherInput = document.getElementById("other-age-input");
        if (document.getElementById("age-other").checked) {
            otherInput.style.display = "block";
        } else {
            otherInput.style.display = "none";
        }
    });
});

document.getElementById("checkin").onclick = async function () {
    const todayId = getTodayDateString();

    const db = await openDatabaseDate();
    const idExists = await checkIfDateExists(db, todayId);
    const db2 = await openDatabase();
    const stamps = await countEntries(db2);
    if (idExists) {
        checkinErrorModal();
    } else {
        if (stamps >= 6) {
            stampCntErrorModal();
        } else {
            openModal();
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

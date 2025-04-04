window.onload = async function () {
    try {
        const db = await openDatabaseImg();
        const entries = await fetchAllEntries(db); // データベースの全エントリーを取得
        renderStamps(entries); // エントリーをレンダリング
        setupModal(entries);
        const stamps= await countEntries(db);
        if (stamps >= 20) {
            completeModal()
        }
    } catch (error) {
        console.error("エラーが発生しました:", error);
    }
}

const dbName4 = "ComiculImgDB";
const storeName4 = "Img";

function openDatabaseImg() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName4, 1);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(storeName4, { keyPath: 'id' }); // keyPathを'id'に設定
        };
        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
        request.onerror = (event) => {
            reject(event.target.error);
        };
    });
}

function fetchAllEntries(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName4], "readonly");
        const objectStore = transaction.objectStore(storeName4);
        const request = objectStore.getAll();

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function (event) {
            console.error("データの取得に失敗しました:", event.target.errorCode);
            reject(event.target.errorCode);
        };
    });
}

function renderStamps(entries) {
    const stampMap = {
        "stamp1": "img/stamp1.png",
        "stamp2": "img/stamp2.png",
        "stamp3": "img/stamp3.png",
        "stamp4": "img/stamp4.png",
        "stamp5": "img/stamp5.png",
        "stamp6": "img/stamp6.png",
        "stamp7": "img/stamp7.png",
        "stamp8": "img/stamp8.png",
        "stamp9": "img/stamp9.png",
        "stamp10": "img/stamp10.png",
        "stamp11": "img/stamp11.png",
        "stamp12": "img/stamp12.png",
        "stamp13": "img/stamp13.png",
        "stamp14": "img/stamp14.png",
        "stamp15": "img/stamp15.png",
        "stamp16": "img/stamp16.png",
        "stamp17": "img/stamp17.png",
        "stamp18": "img/stamp18.png",
        "stamp19": "img/stamp19.png",
        "stamp20": "img/stamp20.png"
    };

    for (const stampId in stampMap) {
        const stampElement = document.getElementById(stampId);
        if (!stampElement) continue;

        const entry = entries.find((entry) => entry.id === stampMap[stampId]);
        if (entry) {
            stampElement.innerHTML = `<img src="${stampMap[stampId]}" alt="スタンプ" class="stamp-image" data-id="${stampId}">`;
        } else {
            stampElement.innerHTML = `<img src="img/silhouette${stampId}.png" alt="スタンプ">`;
        }
    }
}

function setupModal(entries) {
    const modal = document.getElementById("stampModal");
    const modalContent = document.getElementById("stampModal-content");

    // スタンプIDごとの詳細情報をオブジェクトで管理
    const stampDetails = {
        stamp1: { name: "つかちゃん", image: "img/stamp1.png", text: "一緒に将棋しましょう"},
        stamp2: { name: "みーちゃん", image: "img/stamp2.png", text: ""},
        stamp3: { name: "寺井COD", image: "img/stamp3.png", text: "みんなのチャレンジを応援します！<br>気軽に声かけてね！"},
        stamp4: { name: "うえき先生", image: "img/stamp4.png", text: "皆さん、落語は聞いたことありますか？<br>一度聴いてみるとオモシロいですよ～♪<br>福井でも楽しめる落語会の情報ならお任せ！"},
        stamp5: { name: "やまにぃ", image: "img/stamp5.png", text: ""},
        stamp6: { name: "ふくっち", image: "img/stamp6.png", text: "プログラミングとXRマニアだよ♪<br>教えてほしい人、声かけてね<br>いろいろ創ろう！"},
        stamp7: { name: "くわっち", image: "img/stamp7.png", text: "アイマス大好きくわっちだよ～！！<br>ゲームも食べることも大好きで、ノリで作っちゃうこともあるよ♪<br>～制作仲間大募集～"},
        stamp8: { name: "たけちゃん", image: "img/stamp8.png", text: "クレーンゲーム一撃！"},
        stamp9: { name: "たけD", image: "img/stamp9.png", text: ""},
        stamp10: { name: "げんくん", image: "img/stamp10.png", text: ""},
        stamp11: { name: "くぅさん", image: "img/stamp11.png", text: "エルパでやりたいことがあったら実現します！！"},
        stamp12: { name: "まきちゃん", image: "img/stamp12.png", text: "おしゃべり会を定期敵に開催します！<br>お話ししましょう♫"},
        stamp13: { name: "ゆうや", image: "img/stamp13.png", text: ""},
        stamp14: { name: "りょうくん", image: "img/stamp14.png", text: ""},
        stamp15: { name: "大川晴菜", image: "img/stamp15.png", text: ""},
        stamp16: { name: "ちーちゃん", image: "img/stamp16.png", text: ""},
        stamp17: { name: "つっきー", image: "img/stamp17.png", text: ""},
        stamp18: { name: "たけちゃん", image: "img/stamp18.png", text: ""},
        stamp19: { name: "きょうか", image: "img/stamp19.png", text: "気軽に話しかけてね！<br>インスタフォローよろしくね♪<br>食べるの遅いです"},
        stamp20: { name: "Tomosaki", image: "img/stamp20.png", text: "写真をいっぱい撮って<br>福井を探求しよう！！！！！"}
    };

    // スタンプ画像にクリックイベントを追加
    document.addEventListener("click", (event) => {
        if (event.target.classList.contains("stamp-image")) {
            const stampId = event.target.getAttribute("data-id");

            // スタンプIDに応じた情報を取得
            const details = stampDetails[stampId];
            const entry = entries.find((entry) => entry.id === details.image);
            if (details) {
                modalContent.innerHTML = `
                    <h2>${details.name}</h2>
                    <img src="${details.image}" alt="${details.name}">
                    <div id="textContent">
                        <p>${details.text}</p>
                    </div>
                    <p>獲得回数: ${entry ? entry.cnt : 0}回</p>
                    <button id="close-modal">閉じる</button>
                `;

                // モーダルを表示
                modal.style.display = "flex";

                // 新しい「閉じる」ボタンを再設定
                document.getElementById("close-modal").addEventListener("click", () => {
                    modal.style.display = "none";
                });
            }
        }
    });

    // モーダルの外側をクリックして閉じる
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

function countEntries(db) {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction([storeName4], "readonly");
        const objectStore = transaction.objectStore(storeName4);
        const countRequest = objectStore.count();

        countRequest.onsuccess = function() {
            resolve(countRequest.result);
            return countRequest.result
        };

        countRequest.onerror = function(event) {
            reject(event.target.errorCode);
        };
    });
}

function completeModal() {
    const completeModal = document.createElement("div");
    completeModal.id = "completeModal";
    completeModal.classList.add("modal");
    completeModal.style.display = "flex";

    completeModal.innerHTML = `
        <div id="completeModal-content" class="modal-content">
            <h2>コンプリートおめでとう！！</h2>
            <div id="textContent">
                <p>すごすぎる！！<br>もうこみかるマスターだね！！</p>
            </div>
            <button id="close-modal">閉じる</button>
        </div>
    `;

    document.body.appendChild(completeModal);
    document.getElementById("close-modal").addEventListener("click", () => {
        completeModal.style.display = "none";
    });
    window.addEventListener("click", (event) => {
        if (event.target === completeModal) {
            completeModal.style.display = "none";
        }
    });
}
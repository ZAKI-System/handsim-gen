// hand sim gen

// Page load
document.addEventListener("DOMContentLoaded", () => {
    const o1 = document.getElementById("hs-o1");
    const o2 = document.getElementById("hs-o2");
    const button = document.getElementById("hs-run");
    const optMix = document.getElementById("hs-opt-mix");
    const optDup = document.getElementById("hs-opt-dup");
    const listButton = document.getElementById("hs-list-button");
    const listContainer = document.getElementById("hs-list-container");
    const listLeftUl = document.getElementById("hs-list-left");
    const listRightUl = document.getElementById("hs-list-right");

    //TODO: check HTML

    // var
    /** @type {string[]} */
    const leftList = [];
    /** @type {string[]} */
    const rightList = [];

    const downloadList = async (fileName) => {
        return await fetch(fileName + ".txt")
        .then((res) => {
            if (res.ok) {
                return res.text();
            } else {
                throw new Error(res.statusText);
            }
        })
        .then((val) => {
            return val.replace(/\r/g, "").split("\n");
        });
    };

    /**
     * 生成
     * @param {string[]} list 単語リスト
     * @param {string?} prevWord 前に決定した単語
     * @returns {string} 生成した単語
     */
    const generate = (list, prevWord) => {
        let cnt = 0;
        let word = "";
        do {
            cnt++;
            word = list[Math.floor(Math.random() * list.length)];
        } while (cnt < 10 && word == prevWord);
        return word;
    };

    // auto-run
    (function() {
        downloadList("left")
        .then((list) => {
            list.forEach((v) => {
                if (v.trim() == "") return;
                leftList.push(v.trim());
                const li = document.createElement("li");
                li.textContent = v.trim();
                listLeftUl.appendChild(li);
            });
        })
        .catch((err) => {
            console.error(err);
        });
        downloadList("right")
        .then((list) => {
            list.forEach((v) => {
                if (v.trim() == "") return;
                rightList.push(v.trim());
                const li = document.createElement("li");
                li.textContent = v.trim();
                listRightUl.appendChild(li);
            });
        })
        .catch((err) => {
            console.error(err);
        });
    })();

    // 生成
    button.addEventListener("click", () => {
        //TODO: if empty return/error
        const leftListLocal = (optMix.checked) ? leftList.concat(rightList) : leftList;
        const rightListLocal = (optMix.checked) ? rightList.concat(leftList) : rightList;
        const leftWord = generate(leftListLocal, null);
        const rightWord = generate(rightListLocal, (optDup.checked) ? null : leftWord);
        o1.textContent = leftWord;
        o2.textContent = rightWord;
    });

    // 開閉
    listButton.addEventListener("click", () => {
        if (getComputedStyle(listContainer).display == "none") {
            listContainer.style.display = "flex";
        } else {
            listContainer.style.display = "none";
        }
    });
});

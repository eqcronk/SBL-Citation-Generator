/* ==========================================
   SBL 2nd Edition Citation Engine
   ========================================== */
window.generateSBLCitation = function () {
    // 1. COLLECT AUTHORS (Fixed Fields)
    let authors = [];
    let first1 = document.getElementById("sbl-first-name")?.value.trim();
    let last1 = document.getElementById("sbl-last-name")?.value.trim();
    if (first1 && last1) authors.push({ first: first1, last: last1 });

    let first2 = document.getElementById("sbl-author2-first")?.value.trim();
    let last2 = document.getElementById("sbl-author2-last")?.value.trim();
    if (first2 && last2) authors.push({ first: first2, last: last2 });

    let first3 = document.getElementById("sbl-author3-first")?.value.trim();
    let last3 = document.getElementById("sbl-author3-last")?.value.trim();
    if (first3 && last3) authors.push({ first: first3, last: last3 });

    let fourOrMore = document.getElementById("sbl-four-or-more")?.checked;

    // 2. CONCATENATE AUTHOR STRING (SBL Rules: Last, First for Author 1, First Last for others)
    let authorStr = "";
    if (authors.length > 0) {
        if (fourOrMore) {
            authorStr = `${authors[0].last}, ${authors[0].first}, et al.`;
        } else if (authors.length === 1) {
            authorStr = `${authors[0].last}, ${authors[0].first}.`;
        } else if (authors.length === 2) {
            authorStr = `${authors[0].last}, ${authors[0].first}, and ${authors[1].first} ${authors[1].last}.`;
        } else if (authors.length === 3) {
            authorStr = `${authors[0].last}, ${authors[0].first}, ${authors[1].first} ${authors[1].last}, and ${authors[2].first} ${authors[2].last}.`;
        }
    }


    // 3. COLLECT DYNAMIC CONTRIBUTORS (Loops through matching class arrays)
    function getContributors(roleClass) {
        let list = [];
        let firstInputs = document.querySelectorAll(`.sbl-${roleClass}-first`);
        let lastInputs = document.querySelectorAll(`.sbl-${roleClass}-last`);
        
        // Grab the static first row text field values
        let baseFirst = document.querySelector(`[placeholder*="${roleClass === 'editor' ? 'Thomas' : roleClass === 'translator' ? 'Peter' : 'David'}"]`)?.value.trim();
        let baseLast = document.querySelector(`[placeholder*="${roleClass === 'editor' ? 'Williams' : roleClass === 'translator' ? 'Heinegg' : 'Tombs'}"]`)?.value.trim();
        if (baseFirst && baseLast) list.push(`${baseFirst} ${baseLast}`);

        // Grab any added dynamic text input row fields
        firstInputs.forEach((input, index) => {
            let f = input.value.trim();
            let l = lastInputs[index]?.value.trim();
            if (f && l) list.push(`${f} ${l}`);
        });

        if (list.length === 0) return "";
        if (list.length === 1) return list[0];
        if (list.length === 2) return `${list[0]} and ${list[1]}`;
        return list.slice(0, -1).join(", ") + ", and " + list[list.length - 1];
    }

    let edStr = getContributors("editor");
    let transStr = getContributors("translator");
    let compStr = getContributors("compiler");
    let edType = document.getElementById("sbl-ed-type")?.value;

    // 4. COLLECT CORE BOOK META DATA
    let title = document.getElementById("sbl-title")?.value.trim() || "[Title]";
    let city = document.getElementById("sbl-city")?.value.trim() || "[City]";
    let publisher = document.getElementById("sbl-publisher")?.value.trim() || "[Publisher]";
    let year = document.getElementById("sbl-year")?.value.trim() || "[Year]";

    // 5. ASSEMBLE BIBLIOGRAPHY CITATION PARTS
    let citation = "";

    // SBL Primary Editor Rule (No standard author present)
    if (authorStr === "" && edStr !== "" && edType === "primary") {
        let edLabel = document.querySelectorAll(".sbl-editor-first").length > 0 || edStr.includes("and") ? "eds." : "ed.";
        // Invert the first editor's name for bibliography style
        let edParts = edStr.split(" ");
        if (edParts.length > 1) {
            let firstEdLast = edParts.pop();
            let firstEdRest = edParts.join(" ");
            citation += `${firstEdLast}, ${firstEdRest}, ${edLabel} `;
        } else {
            citation += `${edStr}, ${edLabel} `;
        }
    } else {
        if (authorStr) citation += authorStr + " ";
    }

    // Append Book Title
    citation += `<em>${title}</em>.`;

    // Append Secondary Contributors (SBL Rules: Edited by / Translated by)
    if (edStr && (authorStr || edType === "secondary")) {
        citation += ` Edited by ${edStr}.`;
    }
    if (transStr) {
        citation += ` Translated by ${transStr}.`;
    }
    if (compStr) {
        citation += ` Compiled by ${compStr}.`;
    }

    // Append Publication Imprint
    citation += ` ${city}: ${publisher}, ${year}.`;

    // 6. OUTPUT TO DISPLAY CONTAINER
    let outputBox = document.getElementById("sbl-citation-output");
    if (outputBox) {
        outputBox.innerHTML = citation;
    } else {
        console.log("SBL Result:", citation);
    }
};

/* ==========================================
   SBL Citation Generator
   Logic Engine
   ========================================== */

(function () {

    "use strict";


    /* ==========================================
       HELPER FUNCTIONS
       ========================================== */

    function getValue(id) {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    }

    function getChecked(id) {
        const element = document.getElementById(id);
        return element ? element.checked : false;
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function invertName(fullName) {

        if (!fullName) {
            return "";
        }

        const parts = fullName.trim().split(/\s+/);

        if (parts.length > 1) {

            const last = parts.pop();

            return `${last}, ${parts.join(" ")}`;

        }

        return fullName;
    }


    /* ==========================================
       DOM REFERENCES
       ========================================== */

    const typeSelect = document.getElementById("sbl-type");

    const stepOne = document.getElementById("sbl-step-1");
    const stepTwo = document.getElementById("sbl-step-2");

    const continueButton = document.getElementById("sbl-btn-continue");
    const backButton = document.getElementById("sbl-btn-back");


    /* ==========================================
       WIZARD NAVIGATION
       ========================================== */

    continueButton.addEventListener("click", function () {

        stepOne.style.display = "none";
        stepTwo.style.display = "block";

        applyFormLayoutRules();

    });


    backButton.addEventListener("click", function () {

        stepTwo.style.display = "none";
        stepOne.style.display = "block";

    });


    /* ==========================================
       CONTRIBUTOR TOGGLES
       ========================================== */

    document
        .getElementById("sbl-has-editor")
        .addEventListener("change", handleContributorToggles);

    document
        .getElementById("sbl-has-translator")
        .addEventListener("change", handleContributorToggles);

    document
        .getElementById("sbl-has-compiler")
        .addEventListener("change", handleContributorToggles);


    function handleContributorToggles() {

        document.getElementById("row-editor").style.display =
            getChecked("sbl-has-editor") ? "flex" : "none";

        document.getElementById("row-translator").style.display =
            getChecked("sbl-has-translator") ? "block" : "none";

        document.getElementById("row-compiler").style.display =
            getChecked("sbl-has-compiler") ? "block" : "none";

        generateSBLCitation();

    }


    /* ==========================================
       SOURCE TYPE LAYOUT
       ========================================== */

    function applyFormLayoutRules() {

        const type = typeSelect.value;

        const lblTitle = document.getElementById("lbl-title");
        const txtTitle = document.getElementById("sbl-title");

        const lblPages = document.getElementById("lbl-pages");

        const grpInnerTitle =
            document.getElementById("grp-inner-title");

        const grpContributors =
            document.getElementById("grp-contributors");

        const rowMainTitle =
            document.getElementById("row-main-title");

        const grpSubtitle =
            document.getElementById("grp-subtitle");

        const rowJournalMeta =
            document.getElementById("row-journal-meta");

        const rowBookSeriesMeta =
            document.getElementById("row-book-series-meta");

        const rowImprint =
            document.getElementById("row-imprint");

        const grpRangeField =
            document.getElementById("grp-range-field");

        const grpVolDistinctTitle =
            document.getElementById("grp-vol-distinct-title");

        const lblSerialLegend =
            document.getElementById("lbl-serial-legend");


        /* ==========================================
           WHOLE BOOK
           ========================================== */

        if (type === "book") {

            lblTitle.textContent = "Book Title";

            txtTitle.placeholder =
                "e.g. Reading John";

            lblPages.textContent =
                "Pages Cited";

            grpInnerTitle.style.display =
                "none";

            grpContributors.style.display =
                "block";

            rowMainTitle.style.display =
                "flex";

            grpSubtitle.style.display =
                "block";

            rowJournalMeta.style.display =
                "none";

            rowBookSeriesMeta.style.display =
                "block";

            rowImprint.style.display =
                "flex";

            /*
             * A whole book does not need
             * a full page range.
             */
            grpRangeField.style.display =
                "none";

            grpVolDistinctTitle.style.display =
                "block";

            lblSerialLegend.textContent =
                "Volume & Series Info";
        }


        /* ==========================================
           CHAPTER / ESSAY
           ========================================== */

        else if (type === "chapter") {

            lblTitle.textContent =
                "Overarching Book Title";

            txtTitle.placeholder =
                "e.g. Approaches to New Testament Study";

            lblPages.textContent =
                "Pages Cited";

            grpInnerTitle.style.display =
                "block";

            document.getElementById(
                "lbl-inner-title"
            ).textContent =
                "Chapter / Essay Title";

            document.getElementById(
                "sbl-inner-title"
            ).placeholder =
                "e.g. Canonical Criticism";

            grpContributors.style.display =
                "block";

            rowMainTitle.style.display =
                "flex";

            grpSubtitle.style.display =
                "block";

            rowJournalMeta.style.display =
                "none";

            rowBookSeriesMeta.style.display =
                "block";

            rowImprint.style.display =
                "flex";

            /*
             * Chapters need their complete
             * page range for the bibliography.
             */
            grpRangeField.style.display =
                "block";

            grpVolDistinctTitle.style.display =
                "block";

            lblSerialLegend.textContent =
                "Volume & Series Info";
        }


        /* ==========================================
           JOURNAL ARTICLE
           ========================================== */

        else if (type === "article") {

            lblTitle.textContent =
                "Article";

            lblPages.textContent =
                "Pages Cited";

            grpInnerTitle.style.display =
                "block";

            document.getElementById(
                "lbl-inner-title"
            ).textContent =
                "Article Title";

            document.getElementById(
                "sbl-inner-title"
            ).placeholder =
                "e.g. John Chrysostom on the Gaze";

            grpContributors.style.display =
                "none";

            rowMainTitle.style.display =
                "none";

            grpSubtitle.style.display =
                "none";

            rowJournalMeta.style.display =
                "flex";

            rowBookSeriesMeta.style.display =
                "none";

            rowImprint.style.display =
                "none";

            /*
             * Articles need their complete
             * page range for the bibliography.
             */
            grpRangeField.style.display =
                "block";

            grpVolDistinctTitle.style.display =
                "none";

            lblSerialLegend.textContent =
                "Journal Specifications";
        }


        generateSBLCitation();

    }


    /* ==========================================
       LISTEN FOR INPUT
       ========================================== */

    const inputFields = [
        "sbl-first-name",
        "sbl-last-name",
        "sbl-ed-name",
        "sbl-ed-type",
        "sbl-trans-name",
        "sbl-comp-name",
        "sbl-title",
        "sbl-subtitle",
        "sbl-short-title",
        "sbl-inner-title",
        "sbl-journal",
        "sbl-volume",
        "sbl-issue",
        "sbl-edition",
        "sbl-vol-num",
        "sbl-total-vols",
        "sbl-series-title",
        "sbl-series-num",
        "sbl-vol-title",
        "sbl-city",
        "sbl-publisher",
        "sbl-year",
        "sbl-pages",
        "sbl-range",
        "sbl-url"
    ];


    inputFields.forEach(function (id) {

        const element =
            document.getElementById(id);

        if (element) {

            element.addEventListener(
                "input",
                generateSBLCitation
            );

            element.addEventListener(
                "change",
                generateSBLCitation
            );

        }

    });


    /* ==========================================
       CITATION GENERATOR
       ========================================== */

    function generateSBLCitation() {

        const type =
            typeSelect.value;


        /* ==========================================
           AUTHOR
           ========================================== */

        const firstName =
            getValue("sbl-first-name");

        const lastName =
            getValue("sbl-last-name");

        const edName =
            getValue("sbl-ed-name");

        const edType =
            document.getElementById("sbl-ed-type").value;


        let noteAuthor =
            firstName && lastName
                ? `${firstName} ${lastName}`
                : (firstName || lastName || "[Author]");


        let bibliographyAuthor =
            firstName && lastName
                ? `${lastName}, ${firstName}`
                : (firstName || lastName || "[Author]");


        let shortAuthor =
            lastName || firstName || "[Author]";


        /*
         * Whole book with an editor as the
         * primary contributor and no author.
         */
        if (
            type === "book" &&
            getChecked("sbl-has-editor") &&
            edType === "primary" &&
            !firstName &&
            !lastName
        ) {

            noteAuthor =
                edName
                    ? `${edName}, ed.`
                    : "[Editor], ed.";

            bibliographyAuthor =
                edName
                    ? `${invertName(edName)}, ed.`
                    : "[Editor], ed.";

            shortAuthor =
                edName
                    ? edName.split(/\s+/).pop()
                    : "[Editor]";

        }


        /* ==========================================
           TITLES
           ========================================== */

        const mainTitle =
            getValue("sbl-title");

        const subtitle =
            getValue("sbl-subtitle");

        const shortTitle =
            getValue("sbl-short-title");


        let fullTitleText =
            mainTitle || "[Title]";


        if (
            subtitle &&
            type !== "article"
        ) {

            fullTitleText +=
                `: ${subtitle}`;

        }


        const italicTitle =
            `<i>${escapeHtml(fullTitleText)}</i>`;


        const italicShortTitle =
            shortTitle
                ? `<i>${escapeHtml(shortTitle)}</i>`
                : (
                    mainTitle
                        ? `<i>${escapeHtml(mainTitle)}</i>`
                        : "[Short Title]"
                );


        /* ==========================================
           COMMON FIELDS
           ========================================== */

        const year =
            getValue("sbl-year") || "[Year]";

        const pages =
            getValue("sbl-pages") || "[Page]";

        const url =
            getValue("sbl-url");


        const electronicAccess =
            url
                ? `, ${escapeHtml(url)}`
                : "";


        let noteOutput = "";
        let subnoteOutput = "";
        let bibliographyOutput = "";


        /* ==========================================
           WHOLE BOOK
           ========================================== */

        if (type === "book") {

            const city =
                getValue("sbl-city") || "[City]";

            const publisher =
                getValue("sbl-publisher") || "[Publisher]";

            const edition =
                getValue("sbl-edition");

            const volumeNumber =
                getValue("sbl-vol-num");

            const totalVolumes =
                getValue("sbl-total-vols");

            const seriesTitle =
                getValue("sbl-series-title");

            const seriesNumber =
                getValue("sbl-series-num");

            const volumeTitle =
                getValue("sbl-vol-title");


            /* Edition */

            const editionNote =
                edition
                    ? `, ${escapeHtml(edition)}`
                    : "";

            const editionBib =
                edition
                    ? `. ${escapeHtml(edition)}`
                    : "";


            /* Volume */

            let volumeSeriesNote = "";
            let volumeSeriesBib = "";


            if (volumeNumber) {

                const volumeText =
                    volumeTitle
                        ? `Vol. ${escapeHtml(volumeNumber)}: <i>${escapeHtml(volumeTitle)}</i>`
                        : `Vol. ${escapeHtml(volumeNumber)}`;

                volumeSeriesNote +=
                    `, ${volumeText}`;

                volumeSeriesBib +=
                    `. ${volumeText}`;

            }


            /* Series */

            if (seriesTitle) {

                const seriesText =
                    seriesNumber
                        ? `${escapeHtml(seriesTitle)} ${escapeHtml(seriesNumber)}`
                        : escapeHtml(seriesTitle);

                volumeSeriesNote +=
                    `, ${seriesText}`;

                volumeSeriesBib +=
                    `. ${seriesText}`;

            }


            /* Total volumes */

            if (
                totalVolumes &&
                !volumeNumber
            ) {

                volumeSeriesNote +=
                    `, ${escapeHtml(totalVolumes)}`;

                volumeSeriesBib +=
                    `. ${escapeHtml(totalVolumes)}`;

            }


            /* Contributors */

            let roleNote = "";
            let roleBib = "";


            if (
                getChecked("sbl-has-editor") &&
                edType === "secondary" &&
                edName
            ) {

                roleNote +=
                    `, ed. ${escapeHtml(edName)}`;

                roleBib +=
                    `, ed. ${escapeHtml(edName)}`;

            }


            const translator =
                getValue("sbl-trans-name");

            if (
                getChecked("sbl-has-translator") &&
                translator
            ) {

                roleNote +=
                    `, trans. ${escapeHtml(translator)}`;

                roleBib +=
                    `, trans. ${escapeHtml(translator)}`;

            }


            const compiler =
                getValue("sbl-comp-name");

            if (
                getChecked("sbl-has-compiler") &&
                compiler
            ) {

                roleNote +=
                    `, comp. ${escapeHtml(compiler)}`;

                roleBib +=
                    `, comp. ${escapeHtml(compiler)}`;

            }


            if (roleBib) {
                roleBib = `.${roleBib}`;
            }


            /* First footnote */

            noteOutput =
                `${noteAuthor}, ${italicTitle}${roleNote}${editionNote}${volumeSeriesNote} (${escapeHtml(city)}: ${escapeHtml(publisher)}, ${escapeHtml(year)}), ${escapeHtml(pages)}${electronicAccess}.`;


            /* Short footnote */

            subnoteOutput =
                `${escapeHtml(shortAuthor)}, ${italicShortTitle}, ${escapeHtml(pages)}.`;


            /* Bibliography */

            bibliographyOutput =
                `${bibliographyAuthor}. ${italicTitle}${roleBib}${editionBib}${volumeSeriesBib}. ${escapeHtml(city)}: ${escapeHtml(publisher)}, ${escapeHtml(year)}${electronicAccess}.`;

        }


        /* ==========================================
           CHAPTER / ESSAY
           ========================================== */

        else if (type === "chapter") {

            const innerTitle =
                getValue("sbl-inner-title") ||
                "[Chapter Title]";

            const city =
                getValue("sbl-city") ||
                "[City]";

            const publisher =
                getValue("sbl-publisher") ||
                "[Publisher]";

            const pageRange =
                getValue("sbl-range") ||
                "[Page Range]";

            const seriesTitle =
                getValue("sbl-series-title");

            const seriesNumber =
                getValue("sbl-series-num");


            /* Series */

            let seriesNote = "";
            let seriesBib = "";


            if (seriesTitle) {

                const seriesText =
                    seriesNumber
                        ? `${escapeHtml(seriesTitle)} ${escapeHtml(seriesNumber)}`
                        : escapeHtml(seriesTitle);

                seriesNote =
                    `, ${seriesText}`;

                seriesBib =
                    `. ${seriesText}`;

            }


            /* Editor */

            let editorNote = "";
            let editorBib = "";


            if (
                getChecked("sbl-has-editor") &&
                edName
            ) {

                editorNote =
                    `, ed. ${escapeHtml(edName)}`;

                editorBib =
                    `. Edited by ${escapeHtml(edName)}`;

            }


            const escapedInnerTitle =
                escapeHtml(innerTitle);


            /* First footnote */

            noteOutput =
                `${noteAuthor}, “${escapedInnerTitle},” in ${italicTitle}${editorNote}${seriesNote} (${escapeHtml(city)}: ${escapeHtml(publisher)}, ${escapeHtml(year)}), ${escapeHtml(pages)}${electronicAccess}.`;


            /* Short footnote */

            subnoteOutput =
                `${escapeHtml(shortAuthor)}, “${escapedInnerTitle},” ${escapeHtml(pages)}.`;


            /* Bibliography */

            bibliographyOutput =
                `${bibliographyAuthor}. “${escapedInnerTitle}.” Pages ${escapeHtml(pageRange)} in ${italicTitle}${editorBib}${seriesBib}. ${escapeHtml(city)}: ${escapeHtml(publisher)}, ${escapeHtml(year)}${electronicAccess}.`;

        }


        /* ==========================================
           JOURNAL ARTICLE
           ========================================== */

        else if (type === "article") {

            const articleTitle =
                getValue("sbl-inner-title") ||
                "[Article Title]";

            const journal =
                getValue("sbl-journal") ||
                "[Journal Title/Abbreviation]";

            const volume =
                getValue("sbl-volume") ||
                "[Volume]";

            const issue =
                getValue("sbl-issue");

            const pageRange =
                getValue("sbl-range") ||
                "[Page Range]";


            const italicJournal =
                `<i>${escapeHtml(journal)}</i>`;


            const volumeIssue =
                issue
                    ? `${escapeHtml(volume)}, no. ${escapeHtml(issue)}`
                    : escapeHtml(volume);


            const escapedArticleTitle =
                escapeHtml(articleTitle);


            const articleShortTitle =
                shortTitle
                    ? `"${escapeHtml(shortTitle)}"`
                    : `"${escapedArticleTitle}"`;


            /* First footnote */

            noteOutput =
                `${noteAuthor}, “${escapedArticleTitle},” ${italicJournal} ${volumeIssue} (${escapeHtml(year)}): ${escapeHtml(pages)}${electronicAccess}.`;


            /* Short footnote */

            subnoteOutput =
                `${escapeHtml(shortAuthor)}, ${articleShortTitle}, ${escapeHtml(pages)}.`;


            /* Bibliography */

            bibliographyOutput =
                `${bibliographyAuthor}. “${escapedArticleTitle}.” ${italicJournal} ${volumeIssue} (${escapeHtml(year)}): ${escapeHtml(pageRange)}${electronicAccess}.`;

        }


        /* ==========================================
           DISPLAY RESULTS
           ========================================== */

        document.getElementById(
            "sbl-noteOutput"
        ).innerHTML = noteOutput;


        document.getElementById(
            "sbl-subnoteOutput"
        ).innerHTML = subnoteOutput;


        document.getElementById(
            "sbl-bibOutput"
        ).innerHTML = bibliographyOutput;

    }


    /* ==========================================
       COPY BUTTON
       ========================================== */

    window.copyCitation = function (
        elementId,
        button
    ) {

        const element =
            document.getElementById(elementId);

        if (!element) {
            return;
        }


        const textToCopy =
            element.innerText;


        /*
         * Modern clipboard API
         */
        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            navigator.clipboard
                .writeText(textToCopy)
                .then(function () {

                    showCopied(button);

                })
                .catch(function () {

                    fallbackCopy(textToCopy, button);

                });

        }

        /*
         * Fallback for environments where
         * navigator.clipboard isn't available.
         */
        else {

            fallbackCopy(
                textToCopy,
                button
            );

        }

    };


    function fallbackCopy(
        text,
        button
    ) {

        const textarea =
            document.createElement("textarea");

        textarea.value = text;

        textarea.style.position =
            "fixed";

        textarea.style.left =
            "-9999px";

        document.body.appendChild(
            textarea
        );

        textarea.select();

        try {

            document.execCommand("copy");

            showCopied(button);

        }

        catch (error) {

            console.error(
                "Unable to copy citation.",
                error
            );

        }

        document.body.removeChild(
            textarea
        );

    }


    function showCopied(button) {

        const originalText =
            button.textContent;


        button.textContent =
            "Copied!";

        button.style.background =
            "#10b981";

        button.style.borderColor =
            "#10b981";

        button.style.color =
            "#ffffff";


        setTimeout(function () {

            button.textContent =
                originalText;

            button.style.background =
                "#ffffff";

            button.style.borderColor =
                "#cbd5e1";

            button.style.color =
                "#475569";

        }, 1200);

    }


    /* ==========================================
       INITIALIZE
       ========================================== */

    applyFormLayoutRules();

})();

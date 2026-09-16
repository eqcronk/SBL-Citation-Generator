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
            .replace(/'/g, "'");
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

    /**
     * Helper to set up dynamic "Add Another" rows
     */
    function setupDynamicRows(buttonId, containerId, role) {
        const button = document.getElementById(buttonId);
        const container = document.getElementById(containerId);

        if (button && container) {
            button.addEventListener('click', function() {
                // Create a dynamic row container
                const row = document.createElement('div');
                row.className = 'sbl-row sbl-name-row';
                row.style.marginTop = '10px';

                // Inject internal layout with dynamic labeling
                row.innerHTML = `
                    <div class="sbl-form-group sbl-col">
                        <label>Additional ${role} First Name(s)</label>
                        <input type="text" class="sbl-${role.toLowerCase()}-first">
                    </div>
                    <div class="sbl-form-group sbl-col">
                        <label>Additional ${role} Last Name</label>
                        <input type="text" class="sbl-${role.toLowerCase()}-last">
                    </div>
                    <button type="button" class="sbl-btn-remove" style="margin-top: 24px; color: red; background: none; border: none; cursor: pointer; font-size: 16px;">✕</button>
                `;

                // Add deletion listener to the removal button
                row.querySelector('.sbl-btn-remove').addEventListener('click', function() {
                    row.remove();
                    if (typeof generateSBLCitation === "function") {
                        generateSBLCitation();
                    }
                });

                container.appendChild(row);

                // Add real-time event triggers for rendering engine updates if present
                row.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', function() {
                        if (typeof generateSBLCitation === "function") {
                            generateSBLCitation();
                        }
                    });
                });
            });
        }
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
       DYNAMIC INITIALIZATION & LISTENERS
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

    // Set up dynamic repeating sections
    setupDynamicRows('btn-add-author', 'sbl-authors-container', 'Author');
    setupDynamicRows('btn-add-editor', 'sbl-editors-container', 'Editor');
    setupDynamicRows('btn-add-translator', 'sbl-translators-container', 'Translator');
    setupDynamicRows('btn-add-compiler', 'sbl-compilers-container', 'Compiler');


    function handleContributorToggles() {

        // Changed target displays to "block" to preserve the updated flex design rows
        document.getElementById("row-editor").style.display =
            getChecked("sbl-has-editor") ? "block" : "none";

        document.getElementById("row-translator").style.display =
            getChecked("sbl-has-translator") ? "block" : "none";

        document.getElementById("row-compiler").style.display =
            getChecked("sbl-has-compiler") ? "block" : "none";

        if (typeof generateSBLCitation === "function") {
            generateSBLCitation();
        }

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

lblPages.textContent ="Pages Cited";grpInnerTitle.style.display ="block";document.getElementById("lbl-inner-title").textContent ="Article Title";document.getElementById("sbl-inner-title").placeholder ="e.g. John Chrysostom on the Gaze";grpContributors.style.display ="none";rowMainTitle.style.display ="none";grpSubtitle.style.display ="none";rowJournalMeta.style.display ="flex";rowBookSeriesMeta.style.display ="none";rowImprint.style.display ="none";/** Articles need their complete* page range.*/if (grpRangeField) grpRangeField.style.display = "block";}}})();

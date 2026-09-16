/* ==========================================
   SBL Citation Generator
   Logic Engine
   ========================================== */

(function () {

    "use strict";

    // Safe placeholder to prevent crashes if your rendering engine isn't ready
    window.generateSBLCitation = window.generateSBLCitation || function() {
        console.log("SBL Citation updated.");
    };

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

    /**
     * Helper to set up dynamic "Add Another" rows safely for Contributors
     */
    function setupDynamicRows(buttonId, containerId, role) {
        const button = document.getElementById(buttonId);
        const container = document.getElementById(containerId);

        if (button && container) {
            button.addEventListener('click', function() {
                // Determine current row number count
                const currentRows = container.querySelectorAll('.sbl-name-row').length + 1;
                
                // Create a dynamic row container
                const row = document.createElement('div');
                row.className = 'sbl-row sbl-name-row';
                row.style.marginTop = '10px';

                // Inject internal layout with dynamic indexing
                row.innerHTML = `
                    <div class="sbl-form-group sbl-col">
                        <label>Additional ${role} ${currentRows} First Name(s)</label>
                        <input type="text" class="sbl-${role.toLowerCase()}-first">
                    </div>
                    <div class="sbl-form-group sbl-col">
                        <label>Additional ${role} ${currentRows} Last Name</label>
                        <input type="text" class="sbl-${role.toLowerCase()}-last">
                    </div>
                    <button type="button" class="sbl-btn-remove" style="margin-top: 24px; color: red; background: none; border: none; cursor: pointer; font-size: 16px;">✕</button>
                `;

                // Add deletion listener to the removal button
                row.querySelector('.sbl-btn-remove').addEventListener('click', function() {
                    row.remove();
                    if (typeof window.generateSBLCitation === "function") {
                        window.generateSBLCitation();
                    }
                });

                container.appendChild(row);

                // Add real-time event triggers for rendering engine updates
                row.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', function() {
                        if (typeof window.generateSBLCitation === "function") {
                            window.generateSBLCitation();
                        }
                    });
                });
            });
        }
    }

    /* ==========================================
       CONTRIBUTOR TOGGLES
       ========================================== */

    function handleContributorToggles() {
        const rowEd = document.getElementById("row-editor");
        const rowTrans = document.getElementById("row-translator");
        const rowComp = document.getElementById("row-compiler");

        // Force explicit display states to safely toggle your HTML items
        if (rowEd) rowEd.style.display = getChecked("sbl-has-editor") ? "block" : "none";
        if (rowTrans) rowTrans.style.display = getChecked("sbl-has-translator") ? "block" : "none";
        if (rowComp) rowComp.style.display = getChecked("sbl-has-compiler") ? "block" : "none";

        if (typeof window.generateSBLCitation === "function") {
            window.generateSBLCitation();
        }
    }

    /* ==========================================
       SOURCE TYPE LAYOUT
       ========================================== */

    function applyFormLayoutRules() {
        const typeSelect = document.getElementById("sbl-type");
        if (!typeSelect) return;

        const type = typeSelect.value;

        const lblTitle = document.getElementById("lbl-title");
        const txtTitle = document.getElementById("sbl-title");
        const lblPages = document.getElementById("lbl-pages");
        const grpInnerTitle = document.getElementById("grp-inner-title");
        const grpContributors = document.getElementById("grp-contributors");
        const rowMainTitle = document.getElementById("row-main-title");
        const grpSubtitle = document.getElementById("grp-subtitle");
        const rowJournalMeta = document.getElementById("row-journal-meta");
        const rowBookSeriesMeta = document.getElementById("row-book-series-meta");
        const rowImprint = document.getElementById("row-imprint");
        const grpRangeField = document.getElementById("grp-range-field");
        const grpVolDistinctTitle = document.getElementById("grp-vol-distinct-title");
        const lblSerialLegend = document.getElementById("lbl-serial-legend");

        if (type === "book") {
            if (lblTitle) lblTitle.textContent = "Book Title";
            if (txtTitle) txtTitle.placeholder = "e.g. Reading John";
            if (lblPages) lblPages.textContent = "Pages Cited";
            if (grpInnerTitle) grpInnerTitle.style.display = "none";
            if (grpContributors) grpContributors.style.display = "block";
            if (rowMainTitle) rowMainTitle.style.display = "flex";
            if (grpSubtitle) grpSubtitle.style.display = "block";
            if (rowJournalMeta) rowJournalMeta.style.display = "none";
            if (rowBookSeriesMeta) rowBookSeriesMeta.style.display = "block";
            if (rowImprint) rowImprint.style.display = "flex";
            if (grpRangeField) grpRangeField.style.display = "none";
            if (grpVolDistinctTitle) grpVolDistinctTitle.style.display = "block";
            if (lblSerialLegend) lblSerialLegend.textContent = "Volume & Series Info";
        }
        else if (type === "chapter") {
            if (lblTitle) lblTitle.textContent = "Overarching Book Title";
            if (txtTitle) txtTitle.placeholder = "e.g. Approaches to New Testament Study";
            if (lblPages) lblPages.textContent = "Pages Cited";
            if (grpInnerTitle) grpInnerTitle.style.display = "block";
            
            const lblInner = document.getElementById("lbl-inner-title");
            const txtInner = document.getElementById("sbl-inner-title");
            if (lblInner) lblInner.textContent = "Chapter / Essay Title";
            if (txtInner) txtInner.placeholder = "e.g. Canonical Criticism";

            if (grpContributors) grpContributors.style.display = "block";
            if (rowMainTitle) rowMainTitle.style.display = "flex";
            if (grpSubtitle) grpSubtitle.style.display = "block";
            if (rowJournalMeta) rowJournalMeta.style.display = "none";
            if (rowBookSeriesMeta) rowBookSeriesMeta.style.display = "block";
            if (rowImprint) rowImprint.style.display = "flex";
            if (grpRangeField) grpRangeField.style.display = "block";
            if (grpVolDistinctTitle) grpVolDistinctTitle.style.display = "block";
            if (lblSerialLegend) lblSerialLegend.textContent = "Volume & Series Info";
        }
        else if (type === "article") {
            if (lblTitle) lblTitle.textContent = "Article";
            if (lblPages) lblPages.textContent = "Pages Cited";
            if (grpInnerTitle) grpInnerTitle.style.display = "block";

            const lblInner = document.getElementById("lbl-inner-title");
            const txtInner = document.getElementById("sbl-inner-title");
            if (lblInner) lblInner.textContent = "Article Title";
            if (txtInner) txtInner.placeholder = "e.g. John Chrysostom on the Gaze";

            if (grpContributors) grpContributors.style.display = "none";
            if (rowMainTitle) rowMainTitle.style.display = "none";
            if (grpSubtitle) grpSubtitle.style.display = "none";
            if (rowJournalMeta) rowJournalMeta.style.display = "flex";
            if (rowBookSeriesMeta) rowBookSeriesMeta.style.display = "none";
            if (rowImprint) rowImprint.style.display = "none";
            if (grpRangeField) grpRangeField.style.display = "block";
        }
    }

    /* ==========================================
       INITIALIZE ON DOM LOAD
       ========================================== */
    document.addEventListener("DOMContentLoaded", function () {

        const stepOne = document.getElementById("sbl-step-1");
        const stepTwo = document.getElementById("sbl-step-2");
        const continueButton = document.getElementById("sbl-btn-continue");
        const backButton = document.getElementById("sbl-btn-back");

        /* Wizard Navigation */
        if (continueButton && stepOne && stepTwo) {
            continueButton.addEventListener("click", function () {
                stepOne.style.display = "none";
                stepTwo.style.display = "block";
                applyFormLayoutRules();
            });
        }

        if (backButton && stepOne && stepTwo) {
            backButton.addEventListener("click", function () {
                stepTwo.style.display = "none";
                stepOne.style.display = "block";
            });
        }

        /* Contributor Checkbox Toggles */
        const cbEditor = document.getElementById("sbl-has-editor");
        const cbTranslator = document.getElementById("sbl-has-translator");
        const cbCompiler = document.getElementById("sbl-has-compiler");

        if (cbEditor) cbEditor.addEventListener("change", handleContributorToggles);
        if (cbTranslator) cbTranslator.addEventListener("change", handleContributorToggles);
        if (cbCompiler) cbCompiler.addEventListener("change", handleContributorToggles);

        /* Dynamic Repeating Sections Hooked to Contributors Only */
        setupDynamicRows('btn-add-editor', 'sbl-editors-container', 'Editor');
        setupDynamicRows('btn-add-translator', 'sbl-translators-container', 'Translator');
        setupDynamicRows('btn-add-compiler', 'sbl-compilers-container', 'Compiler');

        /* Real-time Rendering Listeners for All Form Fields */
        const inputs = document.querySelectorAll('#sbl-step-2 input, #sbl-step-2 select');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (typeof window.generateSBLCitation === "function") {
                    window.generateSBLCitation();
                }
            });
        });

        // Initialize state view configurations
        handleContributorToggles();
    });

})();

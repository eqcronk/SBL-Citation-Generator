/* ==========================================
   SBL Citation Generator Logic Engine
   ========================================== */
(function() {
    const fields = [
        'sbl-type', 'sbl-first-name', 'sbl-last-name', 'sbl-has-editor', 'sbl-has-translator', 'sbl-has-compiler',
        'sbl-ed-name', 'sbl-ed-type', 'sbl-trans-name', 'sbl-comp-name', 'sbl-title', 'sbl-subtitle', 'sbl-short-title',
        'sbl-journal', 'sbl-volume', 'sbl-issue', 'sbl-edition', 'sbl-vol-num', 'sbl-total-vols', 
        'sbl-series-title', 'sbl-series-num', 'sbl-vol-title', 'sbl-city', 'sbl-publisher', 'sbl-year', 'sbl-pages', 'sbl-range', 'sbl-url'
    ];
    
    // Setup wizard navigation step changes
    document.getElementById('sbl-btn-continue').addEventListener('click', function() {
        document.getElementById('sbl-step-1').style.display = 'none';
        document.getElementById('sbl-step-2').style.display = 'block';
        applyFormLayoutRules();
    });

    document.getElementById('sbl-btn-back').addEventListener('click', function() {
        document.getElementById('sbl-step-2').style.display = 'none';
        document.getElementById('sbl-step-1').style.display = 'block';
    });

    fields.forEach(id => {
        const el = document.getElementById(id);
        if(el && id !== 'sbl-type') {
            if(['sbl-has-editor', 'sbl-has-translator', 'sbl-has-compiler'].includes(id)) el.addEventListener('change', handleCheckboxToggles);
            else el.addEventListener('input', generateSBLCitation);
        }
    });

    function handleCheckboxToggles() {
        document.getElementById('row-editor').style.display = document.getElementById('sbl-has-editor').checked ? 'flex' : 'none';
        document.getElementById('row-translator').style.display = document.getElementById('sbl-has-translator').checked ? 'block' : 'none';
        document.getElementById('row-compiler').style.display = document.getElementById('sbl-has-compiler').checked ? 'block' : 'none';
        generateSBLCitation();
    }

    function applyFormLayoutRules() {
        const type = document.getElementById('sbl-type').value;
        const lblTitle = document.getElementById('lbl-title');
        const txtTitle = document.getElementById('sbl-title');
        const lblPages = document.getElementById('lbl-pages');
        
        const grpInnerTitle = document.getElementById('grp-inner-title');
        const grpContributors = document.getElementById('grp-contributors');
        const rowMainTitle = document.getElementById('row-main-title');
        const grpSubtitle = document.getElementById('grp-subtitle');
        const rowJournalMeta = document.getElementById('row-journal-meta');
        const rowBookSeriesMeta = document.getElementById('row-book-series-meta');
        const rowImprint = document.getElementById('row-imprint');
        const grpRangeField = document.getElementById('grp-range-field');
        const grpVolDistinctTitle = document.getElementById('grp-vol-distinct-title');
        const lblSerialLegend = document.getElementById('lbl-serial-legend');

        if(type === 'book') {
            lblTitle.textContent = "Book Title";
            txtTitle.placeholder = "e.g. Reading John";
            lblPages.textContent = "Page(s) Cited (For Note)";
            grpInnerTitle.style.display = 'none';
            grpContributors.style.display = 'block';
            rowMainTitle.style.display = 'flex';
            grpSubtitle.style.display = 'block';
            rowJournalMeta.style.display = 'none';
            rowBookSeriesMeta.style.display = 'block';
            rowImprint.style.display = 'flex';
            grpRangeField.style.display = 'none';
            grpVolDistinctTitle.style.display = 'block';
            lblSerialLegend.textContent = "Volume & Series Info";
        } else if (type === 'chapter') {
            lblTitle.textContent = "Overarching Book Title";
            txtTitle.placeholder = "e.g. Approaches to New Testament Study";
            lblPages.textContent = "Specific Page Cited (For Note)";
            grpInnerTitle.style.display = 'block';
            document.getElementById('lbl-inner-title').textContent = "Chapter / Essay Title";
            document.getElementById('sbl-inner-title').placeholder = "e.g. Canonical Criticism";
            grpContributors.style.display = 'block';
            rowMainTitle.style.display = 'flex';
            grpSubtitle.style.display = 'block';
            rowJournalMeta.style.display = 'none';
            rowBookSeriesMeta.style.display = 'block';
            rowImprint.style.display = 'flex';
            grpRangeField.style.display = 'block';
            grpVolDistinctTitle.style.display = 'block';
            lblSerialLegend.textContent = "Volume & Series Info";
        } else if (type === 'article') {
            lblTitle.textContent = "N/A";
            lblPages.textContent = "Specific Page Cited (For Note)";
            grpInnerTitle.style.display = 'block';
            document.getElementById('lbl-inner-title').textContent = "Article Title";
            document.getElementById('sbl-inner-title').placeholder = "e.g. John Chrysostom on the Gaze";
            grpContributors.style.display = 'none';
            rowMainTitle.style.display = 'none';
            grpSubtitle.style.display = 'none';
            rowJournalMeta.style.display = 'flex';
            rowBookSeriesMeta.style.display = 'none';
            rowImprint.style.display = 'none';
            grpRangeField.style.display = 'block';
            grpVolDistinctTitle.style.display = 'none';
            lblSerialLegend.textContent = "Journal Specifications";
        }
        generateSBLCitation();
    }

    function helperInvertName(fullName) {
        if(!fullName) return "";
        const parts = fullName.trim().split(/\s+/);
        if(parts.length > 1) { const last = parts.pop(); return `${last}, ${parts.join(" ")}`; }
        return fullName;
    }

    function generateSBLCitation() {
        const type = document.getElementById('sbl-type').value;
        const firstName = document.getElementById('sbl-first-name').value.trim();
        const lastName = document.getElementById('sbl-last-name').value.trim();
        const mainTitle = document.getElementById('sbl-title').value.trim();
        const subTitle = document.getElementById('sbl-subtitle').value.trim();
        const shortTitle = document.getElementById('sbl-short-title').value.trim();
        const year = document.getElementById('sbl-year').value.trim();
        const pages = document.getElementById('sbl-pages').value.trim();
        const urlField = document.getElementById('sbl-url').value.trim();

        const hasEd = document.getElementById('sbl-has-editor').checked;
        const hasTrans = document.getElementById('sbl-has-translator').checked;
        const hasComp = document.getElementById('sbl-has-compiler').checked;
        const edName = document.getElementById('sbl-ed-name').value.trim();
        const edType = document.getElementById('sbl-ed-type').value;
        const transName = document.getElementById('sbl-trans-name').value.trim();
        const compName = document.getElementById('sbl-comp-name').value.trim();

        let noteAuth = (firstName && lastName) ? `${firstName} ${lastName}` : (lastName || firstName || "[Author]");
        let bibAuth = (firstName && lastName) ? `${lastName}, ${firstName}` : (lastName || firstName || "[Author]");
        let subAuth = lastName || firstName || "[Author]";

        if(type === 'book' && hasEd && edType === 'primary' && !firstName && !lastName) {
            noteAuth = edName ? `${edName}, ed.` : "[Editor], ed.";
            bibAuth = edName ? `${helperInvertName(edName)}, ed.` : "[Editor], ed.";
            subAuth = edName ? edName.split(/\s+/).pop() : "[Editor]";
        }

        let fullTitleText = mainTitle || "[Title]";
        if(subTitle && type !== 'article') fullTitleText += `: ${subTitle}`;
        
        let itTitle = `<i>${fullTitleText}</i>`;
        let itShortTitle = shortTitle ? `<i>${shortTitle}</i>` : (mainTitle ? `<i>${mainTitle}</i>` : "[Short Title]");

        const y = year || "[Year]";
        const pg = pages || "[Page]";
        const electronAccess = urlField ? `, ${urlField}` : "";

        let noteOutput = "";
        let subnoteOutput = "";
        let bibOutput = "";

        if (type === 'book') {
            const city = document.getElementById('sbl-city').value.trim() || "[City]";
            const publisher = document.getElementById('sbl-publisher').value.trim() || "[Publisher]";
            const edition = document.getElementById('sbl-edition').value.trim();
            const volNum = document.getElementById('sbl-vol-num').value.trim();
            const totalVols = document.getElementById('sbl-total-vols').value.trim();
            const seriesTitle = document.getElementById('sbl-series-title').value.trim();
            const seriesNum = document.getElementById('sbl-series-num').value.trim();
            const volDistinctTitle = document.getElementById('sbl-vol-title').value.trim();

            let edStrNote = edition ? `, ${edition}` : "";
            let edStrBib = edition ? `. ${edition}` : "";
            let volSeriesStrNote = ""; let volSeriesStrBib = "";

            if(volNum) {
                let vText = volDistinctTitle ? `Vol. ${volNum}: <i>${volDistinctTitle}</i>` : `Vol. ${volNum}`;
                volSeriesStrNote += `, ${vText}`; volSeriesStrBib += `. ${vText}`;
            }
            if(seriesTitle) {
                let sText = seriesNum ? `${seriesTitle} ${seriesNum}` : seriesTitle;
                volSeriesStrNote += `, ${sText}`; volSeriesStrBib += `. ${sText}`;
            }
            if(totalVols && !volNum) { volSeriesStrNote += `, ${totalVols}`; volSeriesStrBib += `. ${totalVols}`; }

            let roleNote = ""; let roleBib = "";
if(hasEd && edType === 'secondary' && edName) { roleNote += , ed. ${edName}; roleBib += , ed. ${edName}; }if(hasTrans && transName) { roleNote += , trans. ${transName}; roleBib += , trans. ${transName}; }if(hasComp && compName) { roleNote += , comp. ${compName}; roleBib += , comp. ${compName}; }if(roleBib) roleBib = .${roleBib};noteOutput = ${noteAuth}, ${itTitle}${roleNote}${edStrNote}${volSeriesStrNote} (${city}: ${publisher}, ${y}), ${pg}${electronAccess}.;subnoteOutput = ${subAuth}, ${itShortTitle}, ${pg}.;bibOutput = ${bibAuthor}. ${itTitle}${roleBib}${edStrBib}${volSeriesStrBib}. ${city}: ${publisher}, ${y}${electronAccess}.;} else if (type === 'chapter') {const innerTitle = document.getElementById('sbl-inner-title').value.trim() || "[Chapter Title]";const city = document.getElementById('sbl-city').value.trim() || "[City]";const publisher = document.getElementById('sbl-publisher').value.trim() || "[Publisher]";const chRange = document.getElementById('sbl-range').value.trim() || "[Page Range]";const seriesTitle = document.getElementById('sbl-series-title').value.trim();const seriesNum = document.getElementById('sbl-series-num').value.trim();let sText = seriesTitle ? (seriesNum ? , ${seriesTitle} ${seriesNum} : , ${seriesTitle}) : "";let sTextBib = seriesTitle ? (seriesNum ? . ${seriesTitle} ${seriesNum} : . ${seriesTitle}) : "";let chEdStrNote = (hasEd && edName) ? , ed. ${edName} : "";let chEdStrBib = (hasEd && edName) ? . Edited by ${edName} : "";noteOutput = ${noteAuth}, “${innerTitle},” in ${itTitle}${chEdStrNote}${sText} (${city}: ${publisher}, ${y}), ${pg}${electronAccess}.;subnoteOutput = ${subAuth}, “${innerTitle},” ${pg}.;bibOutput = ${bibAuthor}. “${innerTitle}.” Pages ${chRange} in ${itTitle}${chEdStrBib}${sTextBib}. ${city}: ${publisher}, ${y}${electronAccess}.;} else if (type === 'article') {const innerTitle = document.getElementById('sbl-inner-title').value.trim() || "[Article Title]";const journal = document.getElementById('sbl-journal').value.trim() || "[Journal Title/Abbreviation]";const volume = document.getElementById('sbl-volume').value.trim() || "[volume]";const issue = document.getElementById('sbl-issue').value.trim();const range = document.getElementById('sbl-range').value.trim() || "[Page Range]";const itJournal = <i>${journal}</i>;const volIssue = issue ? ${volume}, no. ${issue} : volume;const artShortTitle = shortTitle ? "${shortTitle}" : "${innerTitle}";noteOutput = ${noteAuth}, “${innerTitle},” ${itJournal} ${volIssue} (${y}): ${pg}${electronAccess}.;subnoteOutput = ${subAuth}, artShortTitle, ${pg}.;bibOutput = ${bibAuthor}. “${innerTitle}.” ${itJournal} ${volIssue} (${y}): ${range}${electronAccess}.;}document.getElementById('sbl-noteOutput').innerHTML = noteOutput;document.getElementById('sbl-subnoteOutput').innerHTML = subnoteOutput;document.getElementById('sbl-bibOutput').innerHTML = bibOutput;}window.copyCitation = function(elementId, btn) {const textToCopy = document.getElementById(elementId).innerText;navigator.clipboard.writeText(textToCopy).then(() => {const originalText = btn.textContent;btn.textContent = "Copied!"; btn.style.background = "#10b981"; btn.style.borderColor = "#10b981"; btn.style.color = "#ffffff";setTimeout(() => { btn.textContent = originalText; btn.style.background = "#ffffff"; btn.style.borderColor = "#cbd5e1"; btn.style.color = "#475569"; }, 1200);});}})();

// hub-tools.js
function analyzePassword() {
    const password = document.getElementById('passwordInput').value;
    const resultBox = document.getElementById('passwordResult');
    if (!password) { resultBox.innerHTML = "Please enter a password."; return; }
    let score = 0;
    let feedback = [];
    if (password.length >= 8) score++; else feedback.push("Make it at least 8 characters long.");
    if (/\d/.test(password)) score++; else feedback.push("Add at least one number.");
    if (/[A-Z]/.test(password)) score++; else feedback.push("Add an uppercase letter.");
    if (/[^A-Za-z0-9]/.test(password)) score++; else feedback.push("Add a special character (!@#$).");
    const commonSA = ['springbok', 'southafrica', 'capitec', 'fnb', 'absa', 'sassa', 'bafana', 'admin', 'password'];
    if (commonSA.some(word => password.toLowerCase().includes(word))) {
        score = 0;
        feedback.push("⚠️ Contains a common South African word or brand! Highly guessable.");
    }
    let status = "";
    if (score <= 2) status = '<span style="color:var(--rose);font-weight:700;">Weak</span>';
    else if (score === 3) status = '<span style="color:var(--amber);font-weight:700;">Medium</span>';
    else status = '<span style="color:var(--mint);font-weight:700;">Strong. Good job.</span>';
    resultBox.innerHTML = status + '<br>' + (feedback.length > 0 ? feedback.join('<br>') : 'This is a solid password.');
}

function analyzeURL() {
    const url = document.getElementById('urlInput').value.toLowerCase().trim();
    const resultBox = document.getElementById('urlResult');
    if (!url) { resultBox.innerHTML = "Please enter a URL."; return; }
    let warnings = [];
    if (/^(http|https):\/\/(\d{1,3}\.){3}\d{1,3}/.test(url)) warnings.push("Uses an IP address instead of a domain name.");
    const badTLDs = ['.xyz', '.top', '.tk', '.ml', '.ga', '.cf', '.gq'];
    if (badTLDs.some(tld => url.endsWith(tld))) warnings.push("Uses a suspicious domain extension.");
    const parts = url.split('.');
    if (parts.length > 4) warnings.push("Too many subdomains (used to hide the real website).");
    const banks = ['fnb', 'absa', 'capitec', 'standardbank', 'nedbank'];
    banks.forEach(bank => {
        if (url.includes(bank) && !url.includes(bank + '.co.za')) {
            warnings.push('Mentions ' + bank.toUpperCase() + ' but does not use the official .co.za domain.');
        }
    });
    if (warnings.length > 0) {
        resultBox.innerHTML = '<span style="color:var(--rose);font-weight:700;">⚠️ Potential phishing threat:</span><ul>' + warnings.map(w => '<li>' + w + '</li>').join('') + '</ul>';
    } else {
        resultBox.innerHTML = '<span style="color:var(--mint);font-weight:700;">✅ No obvious phishing signs. Still be cautious.</span>';
    }
}

function analyzePhish() {
    const text = document.getElementById('phishInput').value.toLowerCase();
    const resultBox = document.getElementById('phishResult');
    if (!text) { resultBox.innerHTML = "Please paste a message to scan."; return; }
    let warnings = [];
    let linksFound = [];
    const urgencyWords = ['urgent', 'immediately', 'suspended', '24 hours', 'act now', 'verify', 'click here'];
    urgencyWords.forEach(word => { if (text.includes(word)) warnings.push('Uses urgency: "' + word + '"'); });
    const sensitiveWords = ['otp', 'pin', 'password', 'id number', 'banking details'];
    sensitiveWords.forEach(word => { if (text.includes(word)) warnings.push('Asks for sensitive data: "' + word + '"'); });
    if (text.includes('sassa')) warnings.push("Mentions SASSA — a common grant-scam target.");
    if (text.includes('sars')) warnings.push("Mentions SARS — a common refund-scam target.");
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(urlRegex);
    if (matches) {
        matches.forEach(link => linksFound.push(link));
        warnings.push('Contains ' + linksFound.length + ' link(s). Always check URLs before clicking.');
    }
    if (warnings.length > 0) {
        let html = '<span style="color:var(--rose);font-weight:700;">⚠️ Suspicious message detected:</span><ul>';
        warnings.forEach(w => html += '<li>' + w + '</li>');
        html += '</ul>';
        if (linksFound.length > 0) html += '<p style="margin-top:10px;font-size:.82rem;font-family:\'JetBrains Mono\',monospace;color:var(--ink-3);">Links found:<br>' + linksFound.map(escapeHtml).join('<br>') + '</p>';
        resultBox.innerHTML = html;
    } else {
        resultBox.innerHTML = '<span style="color:var(--mint);font-weight:700;">✅ No obvious phishing signs.</span>';
    }
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[character];
    });
}
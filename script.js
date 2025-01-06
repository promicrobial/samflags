const flags = [    { bit: 1, hex: '0x1', description: 'template having multiple segments in sequencing' },    { bit: 2, hex: '0x2', description: 'each segment properly aligned according to the aligner' },    { bit: 4, hex: '0x4', description: 'segment unmapped' },    { bit: 8, hex: '0x8', description: 'next segment in the template unmapped' },    { bit: 16, hex: '0x10', description: 'SEQ being reverse complemented' },    { bit: 32, hex: '0x20', description: 'SEQ of the next segment in the template being reverse complemented' },    { bit: 64, hex: '0x40', description: 'the first segment in the template' },    { bit: 128, hex: '0x80', description: 'the last segment in the template' },    { bit: 256, hex: '0x100', description: 'secondary alignment' },    { bit: 512, hex: '0x200', description: 'not passing filters, such as platform/vendor quality controls' },    { bit: 1024, hex: '0x400', description: 'PCR or optical duplicate' },    { bit: 2048, hex: '0x800', description: 'supplementary alignment' }];

// Populate reference table
const referenceTableBody = document.getElementById('referenceTableBody');
flags.forEach(flag => {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${flag.bit}</td>
        <td>${flag.hex}</td>
        <td>${flag.description}</td>
    `;
    referenceTableBody.appendChild(row);
});

// Handle flag analysis
function analyzeSAMFlag(flagNumber) {
    const num = parseInt(flagNumber);
    if (isNaN(num)) return [];
    return flags.filter(f => (num & f.bit) !== 0);
}

function updateResults() {
    const flagNumber = document.getElementById('flagInput').value;
    const resultsDiv = document.getElementById('results');
    
    if (!flagNumber) {
        resultsDiv.innerHTML = '';
        return;
    }

    const activeFlags = analyzeSAMFlag(flagNumber);
    const totalFlags = activeFlags.reduce((sum, flag) => sum + flag.bit, 0);
    
    let html = `<div class="results-box">`;
    html += `<p class="results-title">Flags active in ${flagNumber}:</p>`;
    
    if (totalFlags !== parseInt(flagNumber)) {
        html += `<p class="warning">Warning: Flag combination (${totalFlags}) doesn't match input number</p>`;
    }

    if (activeFlags.length > 0) {
        html += `<table class="reference-table">
            <thead>
                <tr>
                    <th>Bit</th>
                    <th>Hex</th>
                    <th>Description</th>
                </tr>
            </thead>
            <tbody>`;
        
        activeFlags.forEach(flag => {
            html += `<tr>
                <td>${flag.bit}</td>
                <td>${flag.hex}</td>
                <td>${flag.description}</td>
            </tr>`;
        });
        
        html += `</tbody></table>`;
    } else {
        html += `<p>No flags active</p>`;
    }
    
    html += `</div>`;
    resultsDiv.innerHTML = html;
}

document.getElementById('flagInput').addEventListener('input', updateResults);

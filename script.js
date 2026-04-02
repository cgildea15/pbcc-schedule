/**
 * PBCC | Outdoor Facilities Scheduler
 * Logic: Firebase Real-Time Sync & CSV Export
 */

// 1. HELPER: Function to add more date rows in the form
window.addDateRow = function() {
    const container = document.getElementById('dateListContainer');
    if (!container) return;

    const newRow = document.createElement('div');
    newRow.className = 'date-row';
    newRow.innerHTML = `
        <select class="date-type">
            <option value="required">Required OFF</option>
            <option value="requested">Requested OFF</option>
        </select>
        <input type="date" class="date-start">
        <span class="to-label">to</span>
        <input type="date" class="date-end">
    `;
    container.appendChild(newRow);
};

// 2. ACTION: Add Employee to Firebase
document.getElementById('addEmployee').addEventListener('click', async () => {
    // Check if Firebase is ready
    if (!window.db) {
        alert("Database is still connecting. Please wait 2 seconds and try again.");
        return;
    }

    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        alert("First Name is required.");
        return;
    }

    // Capture date requests
    const dateEntries = [];
    document.querySelectorAll('.date-row').forEach(row => {
        const start = row.querySelector('.date-start').value;
        if (start) {
            dateEntries.push({
                type: row.querySelector('.date-type').value,
                start: start,
                end: row.querySelector('.date-end').value || start
            });
        }
    });

    const employeeData = {
        name: `${firstName} ${document.getElementById('lastInitial').value}.`.trim(),
        datesOff: dateEntries,
        target: document.getElementById('targetValue').value || "N/A",
        hours: `${document.getElementById('shiftStart').value} - ${document.getElementById('shiftEnd').value}`,
        createdAt: new Date()
    };

    try {
        await addDoc(collection(window.db, "employees"), employeeData);
        
        // Reset form
        document.getElementById('scheduleForm').reset();
        document.getElementById('dateListContainer').innerHTML = `
            <div class="date-row">
                <select class="date-type">
                    <option value="required">Required OFF</option>
                    <option value="requested">Requested OFF</option>
                </select>
                <input type="date" class="date-start">
                <span class="to-label">to</span>
                <input type="date" class="date-end">
            </div>
        `;
        
        alert("Success! Employee added to PBCC Cloud.");
    } catch (e) {
        console.error("Firebase Error:", e);
        alert("Error saving: " + e.message);
    }
});

// 3. SYNC: Real-time listener to build the table
async function syncTable() {
    if (!window.db) {
        setTimeout(syncTable, 1000); // Retry in 1s if DB isn't ready
        return;
    }

    const { collection, onSnapshot, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const q = query(collection(window.db, "employees"), orderBy("createdAt", "asc"));
    
    onSnapshot(q, (snapshot) => {
        const tbody = document.querySelector('#scheduleTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const emp = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${emp.name}</td>
                <td>${emp.hours}</td>
                <td>${emp.hours}</td>
                <td>${emp.hours}</td>
                <td>${emp.hours}</td>
                <td>${emp.hours}</td>
                <td>OFF</td>
                <td>OFF</td>
            `;
            tbody.appendChild(row);
        });
    });
}

window.onload = syncTable;

// 4. EXPORT: Generate CSV
document.getElementById('exportBtn').addEventListener('click', () => {
    let csv = "Employee,Mon,Tue,Wed,Thu,Fri,Sat,Sun\n";
    const tableRows = document.querySelectorAll("#scheduleTable tbody tr");
    
    if (tableRows.length === 0) {
        alert("No data to export.");
        return;
    }

    tableRows.forEach(tr => {
        const rowData = Array.from(tr.cells).map(td => td.innerText);
        csv += rowData.join(",") + "\n";
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PBCC_Outdoor_Schedule.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

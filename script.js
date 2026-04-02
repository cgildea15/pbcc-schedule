// 1. Function to add date rows
window.addDateRow = function() {
    const container = document.getElementById('dateListContainer');
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

// 2. Function to Save to Firebase
async function saveEmployee() {
    if (!window.db) {
        alert("Connecting to database... please try again in 3 seconds.");
        return;
    }

    const { collection, addDoc } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    
    const firstName = document.getElementById('firstName').value.trim();
    if (!firstName) {
        alert("First Name is required.");
        return;
    }

    const employeeData = {
        name: `${firstName} ${document.getElementById('lastInitial').value}.`.trim(),
        hours: `${document.getElementById('shiftStart').value} - ${document.getElementById('shiftEnd').value}`,
        createdAt: new Date()
    };

    try {
        await addDoc(collection(window.db, "employees"), employeeData);
        alert("Success! " + firstName + " added to the list.");
        document.getElementById('scheduleForm').reset();
    } catch (e) {
        console.error(e);
        alert("Error: " + e.message);
    }
}

// 3. Attach the click event
document.getElementById('addEmployee').addEventListener('click', saveEmployee);

// 4. Load the Table
async function loadTable() {
    if (!window.db) { setTimeout(loadTable, 1000); return; }
    const { collection, onSnapshot, query, orderBy } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js");
    const q = query(collection(window.db, "employees"), orderBy("createdAt", "asc"));
    
    onSnapshot(q, (snapshot) => {
        const tbody = document.querySelector('#scheduleTable tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        snapshot.forEach((doc) => {
            const emp = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `<td>${emp.name}</td><td>${emp.hours}</td><td>${emp.hours}</td><td>${emp.hours}</td><td>${emp.hours}</td><td>${emp.hours}</td><td>OFF</td><td>OFF</td>`;
            tbody.appendChild(row);
        });
    });
}
window.onload = loadTable;

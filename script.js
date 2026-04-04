// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// 2. UI HELPERS
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

// 3. SAVE TO FIREBASE
async function saveEmployee() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastInitial = document.getElementById('lastInitial').value.trim();
    
    if (!firstName) {
        alert("Please enter at least a first name.");
        return;
    }

    const employeeData = {
        name: `${firstName} ${lastInitial}.`.trim(),
        target: `${document.getElementById('targetValue').value} ${document.getElementById('targetType').value}`,
        shiftTime: `${document.getElementById('shiftStart').value} - ${document.getElementById('shiftEnd').value}`,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    try {
        await db.collection("employees").add(employeeData);
        alert("Employee data synced to Palm Beach CC Portal!");
        document.getElementById('scheduleForm').reset();
        document.getElementById('dateListContainer').innerHTML = '';
    } catch (error) {
        console.error("Firebase Error:", error);
        alert("Sync Error: " + error.message);
    }
}

// 4. LOAD TABLE IN REAL-TIME
function loadTable() {
    db.collection("employees").orderBy("createdAt", "asc")
    .onSnapshot((snapshot) => {
        const tbody = document.querySelector('#scheduleTable tbody');
        tbody.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const emp = doc.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${emp.name}</strong></td>
                <td>${emp.target}</td>
                <td>${emp.shiftTime}</td>
                <td>${emp.shiftTime}</td>
                <td>${emp.shiftTime}</td>
                <td>${emp.shiftTime}</td>
                <td>${emp.shiftTime}</td>
                <td style="color: #999;">OFF</td>
                <td style="color: #999;">OFF</td>
            `;
            tbody.appendChild(row);
        });
    });
}

// Event Listeners
document.getElementById('addEmployee').addEventListener('click', saveEmployee);
window.onload = loadTable;

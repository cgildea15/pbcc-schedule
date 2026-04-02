// 1. Data & Localization Setup
const labels = {
    en: {
        off: "OFF",
        exportSuccess: "CSV Generated"
    }
};

let employees = [];

// 2. Add Date Row Function (for the "+ Add Date" button)
function addDateRow() {
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
}

// 3. Submission Logic (The "Add to Schedule" button)
document.getElementById('addEmployee').addEventListener('click', () => {
    const firstName = document.getElementById('firstName').value;
    
    // Validation: Only First Name is strictly mandatory
    if (!firstName) {
        alert("Employee First Name is required to generate a schedule.");
        return;
    }

    const dateEntries = [];
    document.querySelectorAll('.date-row').forEach(row => {
        const start = row.querySelector('.date-start').value;
        const end = row.querySelector('.date-end').value;
        
        if (start) { 
            dateEntries.push({
                type: row.querySelector('.date-type').value,
                start: start,
                end: end || start 
            });
        }
    });

    const employee = {
        name: `${firstName} ${document.getElementById('lastInitial').value}.`.trim(),
        datesOff: dateEntries,
        target: document.getElementById('targetValue').value || "Not Specified",
        hours: `${document.getElementById('shiftStart').value} - ${document.getElementById('shiftEnd').value}`
    };

    employees.push(employee);
    updateTable();
    
    // Optional: Clear the form for the next employee
    document.getElementById('scheduleForm').reset();
    // Keep only one date row after reset
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
});

// 4. Update the Table Display
function updateTable() {
    const tbody = document.querySelector('#scheduleTable tbody');
    tbody.innerHTML = '';

    employees.forEach(emp => {
        const row = document.createElement('tr');
        
        // This version puts the hours in every day as a placeholder.
        // In the next step, we'll make it smarter to detect which day is "OFF" based on the dates.
        row.innerHTML = `
            <td>${emp.name}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${emp.hours}</td>
            <td>${labels.en.off}</td>
            <td>${labels.en.off}</td>
        `;
        tbody.appendChild(row);
    });
}

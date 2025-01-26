const sheetId = '1gbm-F37RlE0U5RGOBW7fe1F8nNiJmm1ARXSHvB6fMKM'; // Replace with your Google Sheet ID
const sheetName = 'Club master'; // Replace with your sheet name
const apiKey = 'AIzaSyBXZNep9v961K0wO6TwuC8dAOLQphS3xJg'; // Replace with your API key

let contacts = []; // To hold the fetched contacts

async function fetchContacts() {
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`);
    const data = await response.json();
    contacts = data.values.slice(1); // Assuming the first row is the header
}

// Function to filter names and show suggestions
function filterTable() {
    const filter = document.getElementById('filter').value.toLowerCase();
    const suggestions = document.getElementById('suggestions');
    suggestions.innerHTML = ''; // Clear previous suggestions

    if (filter) {
        const matches = contacts.filter(row => row[1].toLowerCase().includes(filter)); // Search in the second column

        if (matches.length > 0) {
            suggestions.style.display = 'block'; // Show suggestions
            matches.forEach(row => {
                const div = document.createElement('div');
                div.innerText = row[1]; // Display the name from the second column
                div.className = 'suggestion-item';
                div.onclick = () => displayContactDetails(row);
                suggestions.appendChild(div);
            });
        } else {
            suggestions.style.display = 'none'; // Hide suggestions if no match
        }
    } else {
        suggestions.style.display = 'none'; // Hide suggestions if input is empty
    }
}

// Function to display selected contact details
function displayContactDetails(row) {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = ''; // Clear existing details

    // Assuming corresponding details are in columns 2, 3, 4, 5
    const contactsDetails = [
        { label: "Name", value: row[17] }, // Adjust indices as needed
        { label: "Number", value: `<a href="tel:${row[18]}">${row[18]}</a>` }, // Make phone number clickable
        { label: "Address", value: row[19] },
        { label: "Email", value: `<a href="mailto:${row[20]}">${row[20]}</a>` } // Make email clickable
    ];

    contactsDetails.forEach(contact => {
        const tr = document.createElement('tr');
        const labelTd = document.createElement('td');
        const valueTd = document.createElement('td');

        labelTd.innerText = contact.label;

        // Use innerHTML to render the anchor tags
        valueTd.innerHTML = contact.value; 

        tr.appendChild(labelTd);
        tr.appendChild(valueTd);
        tableBody.appendChild(tr);
    });

    document.getElementById('suggestions').style.display = 'none'; // Hide suggestions after selection

    // Set the input to the value from column 1
    document.getElementById('filter').value = row[1]; 
}


// Fetch contacts when the page loads
window.onload = fetchContacts;
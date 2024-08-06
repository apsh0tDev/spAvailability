const SUPABASE_URL = 'https://dtnqmriondeygsolflxb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0bnFtcmlvbmRleWdzb2xmbHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg1NzM1MTUsImV4cCI6MjAzNDE0OTUxNX0.5KH62vJTu2RGJSvS-uLLJyunhbvKMzrus0GrGipPGic'

// Initialize Supabase client
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Function to fetch and display data
async function fetchAndDisplayData() {
    const { data, error } = await _supabase
        .from('sportsbooks')
        .select("*")
        .order('name', { ascending: true }); 

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Clear existing rows

    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td class="${item.available ? 'green' : 'red'}" >${item.available ? 'Available' : 'Unavailable'}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to handle real-time changes
function subscribeToChanges() {
    const channel = _supabase
        .channel('public:sportsbooks')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'sportsbooks' }, payload => {
            console.log('Change received!', payload);
            fetchAndDisplayData(); // Refresh the table on any change
        })
        .subscribe();
}

// Function to format the current time in New York timezone
function updateNYTime() {
    // Get the current date and time
    const now = new Date();

    // Create a formatter for New York time
    const options = {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'long', // Optional: adds the day of the week
        hour12: true // Optional: for 12-hour format
    };

    // Format the date
    const nyTime = new Intl.DateTimeFormat('en-US', options).format(now);

    // Update the content of the date-container element
    document.getElementById('ny-time').textContent = `${nyTime}`;
}

// Call the function once to display the time
updateNYTime();

// Optionally, update the time every second
setInterval(updateNYTime, 1000);


// Initial fetch and display
fetchAndDisplayData();

// Subscribe to real-time changes
subscribeToChanges();


const ctx = document.querySelector('.activity-chart');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        datasets: [{
            label: 'Time',
            data: [3, 1.4, 2.5, 4, 3, 2, 4],
            backgroundColor: '#1e293b',
            borderWidth: 3,
            borderRadius: 6,
            hoverBackgroundColor: '#60a5fa'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                border: {
                    display: true
                },
                grid: {
                    display: true,
                    color: '#1e293b'
                }
            },
            y: {
                ticks: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeInOutQuad',
        }
    }
});

window.addEventListener("load", () => {
document.body.classList.add("loaded");
});

// =================================================================
// 🚀 AI AUTO-SEARCH FOR RELATED VIDEOS (YOUTUBE DATA API)
// =================================================================

// Your provided YouTube Data API Key
const YOUTUBE_API_KEY = 'AIzaSyC8dC0zUnZ0zPu7H4iVulFwHFXHHqCwBMs';

// CORRECTION: Broadened default search query to guarantee results
const DEFAULT_SEARCH_QUERY = 'volunteer training'; 
const MAX_RESULTS = 2; 

// Array of random, relevant modifiers to ensure search results change
const RANDOM_MODIFIERS = ['guide', 'tips', 'tutorial', 'workshop', 'webinar', 'latest', 'expert'];

/**
 * Fetches video results from the YouTube Data API based on the provided query.
 * @param {string} query - The search term provided by the user or the default.
 */
async function fetchRelatedVideos(query) {
    let finalQuery = query; // Use the query passed from handleSearch, which might be null
    
    // LOGIC: If 'query' is null (meaning it's the initial page load), we use the randomized default.
    if (!query) {
        const randomIndex = Math.floor(Math.random() * RANDOM_MODIFIERS.length);
        const randomModifier = RANDOM_MODIFIERS[randomIndex];
        // Combine the broad default query with a random modifier
        finalQuery = `${DEFAULT_SEARCH_QUERY} ${randomModifier}`;
    }

    // Using '&order=date' alongside the dynamic query for maximum changeability
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(finalQuery)}&type=video&maxResults=${MAX_RESULTS}&order=date&key=${YOUTUBE_API_KEY}`;
    
    const container = document.getElementById('dynamic-resource-list');
    container.innerHTML = '<p style="text-align: center; color: #3498db; padding: 20px;">Searching for resources...</p>';
    
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            const errorData = await response.json();
            console.error("YouTube API Failure Details:", errorData);
            throw new Error(`YouTube API error: ${response.status} - ${errorData.error.message || response.statusText}`);
        }
        const data = await response.json();
        renderVideos(data.items);
    } catch (error) {
        console.error("❌ Failed to fetch YouTube videos.", error);
        container.innerHTML = 
            '<p style="color: red; text-align: center; padding: 20px;">⚠️ **Error loading resources.** Please check the console or try a simpler search term.</p>';
    }
}

/**
 * Event listener function to handle the search button click.
 */
function handleSearch() {
    const inputElement = document.getElementById('resource-search-input');
    // Get the value from the search box
    const userQuery = inputElement.value.trim();
    
    // When the user searches, we do NOT use the random modifier.
    // Pass the userQuery (which might be an empty string if they click without typing)
    fetchRelatedVideos(userQuery);
}


/**
 * Renders the fetched video results into the dashboard container.
 * @param {Array} videos - The list of video items from the API.
 */
function renderVideos(videos) {
    const container = document.getElementById('dynamic-resource-list');
    if (!container) return;
    
    container.innerHTML = ''; 

    if (videos.length === 0) {
        // If no videos are found, fall back to a simple, high-traffic query for the next load
        container.innerHTML = '<p style="text-align: center; color: #777; padding: 20px;">No specific videos found. Try a different search, or reload for general topics.</p>';
        return;
    }

    videos.forEach(video => {
        const videoId = video.id.videoId;
        const title = video.snippet.title;
        const channelName = video.snippet.channelTitle;
        // Truncate and clean up the description
        let description = video.snippet.description.replace(/\n/g, ' ').substring(0, 100).trim();
        if (video.snippet.description.length > 100) {
            description += '...';
        }

        const thumbnailUrl = video.snippet.thumbnails.medium.url;
        const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        // Build the HTML structure for each video resource
        const resourceHTML = `
            <img src="${thumbnailUrl}" alt="${title}" style="width: 100%; border-radius: 8px; margin-top: 15px;">
            <div class="audio" style="display: flex; align-items: center; margin-top: 10px;">
                <i class='bx bx-video' style="font-size: 20px; color: #e74c3c;"></i>
                <a href="${videoUrl}" target="_blank" title="${title}" style="margin-left: 8px; font-weight: bold;">Video: ${title}</a>
            </div>
            <p style="margin: 5px 0 10px 0; font-size: 0.9em; color: #555;">${description}</p>
            <div class="listen" style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <div class="author" style="display: flex; align-items: center;">
                    <div style="margin-left: 10px;">
                        <p style="font-weight: 600; font-size: 0.85em;">Channel: ${channelName}</p>
                    </div>
                </div>
                <a href="${videoUrl}" target="_blank" style="text-decoration: none;">
                    <button style="background: #3498db; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                        Watch<i class='bx bx-right-arrow-alt' style="margin-left: 5px;"></i>
                    </button>
                </a>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        `;

        container.insertAdjacentHTML('beforeend', resourceHTML);
    });
}

// =================================================================
// 📊 CHART.JS IMPLEMENTATION (This remains the same)
// =================================================================

function initializeActivityChart() {
    const ctx = document.querySelector('.activity-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours',
                    data: [2, 5, 3, 6, 4, 0, 0],
                    backgroundColor: [
                        'rgba(52, 152, 219, 0.5)',
                        'rgba(46, 204, 113, 0.5)',
                        'rgba(241, 196, 15, 0.5)',
                        'rgba(52, 152, 219, 0.5)',
                        'rgba(46, 204, 113, 0.5)',
                        'rgba(231, 76, 60, 0.5)',
                        'rgba(231, 76, 60, 0.5)'
                    ],
                    borderColor: [
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(241, 196, 15, 1)',
                        'rgba(52, 152, 219, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(231, 76, 60, 1)',
                        'rgba(231, 76, 60, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Weekly Activity'
                    }
                }
            }
        });
    }
}


// Call functions when the page loads
window.onload = function() {
    // 1. Initial load: Fetch videos automatically using the dynamic/randomized query (pass null)
    fetchRelatedVideos(null); 
    
    // 2. Set up the event listener for the search button
    document.getElementById('resource-search-button').addEventListener('click', handleSearch);

    initializeActivityChart(); 
};

/**
 * Handles showing the certificate image in a modal.
 * @param {string} imageUrl - The URL of the certificate image.
 */
function showCertificate(imageUrl) {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    
    modalImage.src = imageUrl;
    modal.style.display = "block";
}

// Function to attach event listeners to the "View Certificate" buttons
function initializeCertificateListeners() {
    const viewButtons = document.querySelectorAll('.certificates-hidden button');
    const modal = document.getElementById('image-modal');
    const closeButton = document.getElementById('modal-close');

    viewButtons.forEach(button => {
        const imageUrl = button.getAttribute('data-image-url');
        button.addEventListener('click', () => {
            showCertificate(imageUrl);
        });
    });

    // Close the modal when the user clicks on (x)
    closeButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Close the modal when the user clicks anywhere outside of the image
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
}

// Add this function call to your existing window.onload function:
// window.onload = function() { ... initializeCertificateListeners(); ... };
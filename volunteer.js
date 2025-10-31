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
    let finalQuery = query;

    // LOGIC: If 'query' is null (meaning it's the initial page load), use the randomized default.
    if (!query) {
        const randomIndex = Math.floor(Math.random() * RANDOM_MODIFIERS.length);
        const randomModifier = RANDOM_MODIFIERS[randomIndex];
        // Combine the broad default query with a random modifier
        finalQuery = `${DEFAULT_SEARCH_QUERY} ${randomModifier}`;
    }

    // Using '&order=date' alongside the dynamic query for maximum changeability
    const API_URL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(finalQuery)}&type=video&maxResults=${MAX_RESULTS}&order=date&key=${YOUTUBE_API_KEY}`;

    const container = document.getElementById('dynamic-resource-list');
    if (container) {
        container.innerHTML = '<p style="text-align: center; color: #3498db; padding: 20px;">Searching for resources...</p>';
    }

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
        if (container) {
            container.innerHTML =
                '<p style="color: red; text-align: center; padding: 20px;">⚠️ **Error loading resources.** Please check the console or try a simpler search term.</p>';
        }
    }
}

/**
 * Event listener function to handle the search button click.
 */
function handleSearch() {
    const inputElement = document.getElementById('resource-search-input');
    // Get the value from the search box
    const userQuery = inputElement.value.trim();

    // Pass the userQuery
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
            <div class="resource-item">
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
            </div>
        `;

        container.insertAdjacentHTML('beforeend', resourceHTML);
    });
}


// =================================================================
// 💬 CHATBOX INTERACTIVITY (INTEGRATED)
// =================================================================

function initializeChatbox() {
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');

    if (!chatContainer || !messageInput || !sendButton) {
        console.warn("Chat elements not found. Skipping chat initialization.");
        return;
    }

    const sendMessage = () => {
        const messageText = messageInput.value.trim();
        if (messageText === '') return;

        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMessage = document.createElement('div');
        newMessage.classList.add('message', 'volunteer'); // Assuming the user is a 'volunteer'
        newMessage.innerHTML = `
            ${messageText}
            <span class="time">${timeString}</span>
        `;

        chatContainer.appendChild(newMessage);
        messageInput.value = '';
        // Scroll to the bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Simulate an automatic 'PwD' reply
        setTimeout(simulateReply, 1000);
    };

    const simulateReply = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const replyText = "Thanks for your message! A volunteer will follow up shortly.";

        const replyMessage = document.createElement('div');
        replyMessage.classList.add('message', 'pwd');
        replyMessage.innerHTML = `
            ${replyText}
            <span class="time">${timeString}</span>
        `;

        chatContainer.appendChild(replyMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    };

    // Event listeners
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendMessage();
        }
    });
}


// =================================================================
// 📊 CHART.JS IMPLEMENTATION
// =================================================================

function initializeActivityChart() {
    const ctx = document.querySelector('.activity-chart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                // Corrected to use full day labels for clarity
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours',
                    // Sample data
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
                            color: '#e0e0e0' // Lightened grid color for better visibility
                        }
                    },
                    y: {
                        ticks: {
                            display: false
                        },
                        // Added min/max for better scale consistency
                        min: 0,
                        max: 5
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
    }
}


// =================================================================
// 🖼️ CERTIFICATE MODAL
// =================================================================

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

    if (closeButton && modal) {
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
}


// =================================================================
// ⚙️ INITIALIZATION
// =================================================================

// Function to handle body class for fade-in effect
window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

// Main initialization function called when the window loads
window.onload = function() {
    // Initialize the Activity Chart
    initializeActivityChart();

    // Initialize Certificate Modal Listeners
    initializeCertificateListeners();

    // Initialize the Chatbox Interactivity
    initializeChatbox();

    // 1. Initial load: Fetch videos automatically using the dynamic/randomized query (pass null)
    fetchRelatedVideos(null);

    // 2. Set up the event listener for the resource search button
    const searchButton = document.getElementById('resource-search-button');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }
};
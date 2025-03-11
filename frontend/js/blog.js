document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    // Get DOM elements
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const tagButtons = document.querySelectorAll('.tag');
    const blogPosts = document.querySelectorAll('.blog-post, .featured-post');
    const loadMoreBtn = document.getElementById('load-more');
    const newsletterForm = document.getElementById('newsletter-form');

    // Initialize state
    let currentPage = 1;
    const postsPerPage = 6;
    let filteredPosts = Array.from(blogPosts);

    // Filter posts based on search, category, and tags
    function filterPosts() {
        const searchQuery = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedTag = document.querySelector('.tag.active').dataset.tag;

        filteredPosts = Array.from(blogPosts).filter(post => {
            const title = post.querySelector('h3').textContent.toLowerCase();
            const excerpt = post.querySelector('.excerpt').textContent.toLowerCase();
            const category = post.dataset.category;
            const tags = post.dataset.tags ? post.dataset.tags.split(',') : [];

            const matchesSearch = title.includes(searchQuery) || excerpt.includes(searchQuery);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;
            const matchesTag = selectedTag === 'all' || tags.includes(selectedTag);

            return matchesSearch && matchesCategory && matchesTag;
        });

        // Sort posts
        const sortBy = sortFilter.value;
        filteredPosts.sort((a, b) => {
            const dateA = new Date(a.querySelector('.date').textContent);
            const dateB = new Date(b.querySelector('.date').textContent);

            if (sortBy === 'newest') {
                return dateB - dateA;
            } else if (sortBy === 'oldest') {
                return dateA - dateB;
            } else if (sortBy === 'popular') {
                // For demo purposes, using read time as popularity metric
                const readTimeA = parseInt(a.querySelector('.read-time').textContent);
                const readTimeB = parseInt(b.querySelector('.read-time').textContent);
                return readTimeB - readTimeA;
            }
        });

        // Reset pagination
        currentPage = 1;
        displayPosts();
    }

    // Display posts with pagination
    function displayPosts() {
        const startIndex = 0;
        const endIndex = currentPage * postsPerPage;
        const postsToShow = filteredPosts.slice(startIndex, endIndex);

        // Hide all posts first
        blogPosts.forEach(post => {
            post.style.display = 'none';
        });

        // Show filtered posts with animation
        postsToShow.forEach((post, index) => {
            post.style.display = 'block';
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Show/hide load more button
        loadMoreBtn.style.display = endIndex >= filteredPosts.length ? 'none' : 'block';
    }

    // Event listeners
    searchInput.addEventListener('input', filterPosts);
    categoryFilter.addEventListener('change', filterPosts);
    sortFilter.addEventListener('change', filterPosts);

    tagButtons.forEach(button => {
        button.addEventListener('click', function() {
            tagButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            filterPosts();
        });
    });

    loadMoreBtn.addEventListener('click', function() {
        currentPage++;
        displayPosts();
    });

    // Newsletter subscription
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simulate API call
        setTimeout(() => {
            alert(`Thank you for subscribing with ${email}!`);
            this.reset();
        }, 1000);
    });

    // Initialize hover effects
    blogPosts.forEach(post => {
        const image = post.querySelector('img');
        if (image) {
            image.addEventListener('load', function() {
                this.style.opacity = '1';
            });
        }
    });

    // Initialize display
    filterPosts();
});

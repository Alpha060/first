document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    // Get DOM elements
    const categoryCards = document.querySelectorAll('.category-card');
    const discussionCategory = document.getElementById('discussion-category');
    const discussionTitle = document.getElementById('discussion-title');
    const discussionContent = document.getElementById('discussion-content');
    const postButton = document.getElementById('post-discussion');
    const previewButton = document.getElementById('preview-btn');
    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');
    const editPostButton = document.getElementById('edit-post');
    const confirmPostButton = document.getElementById('confirm-post');
    const closeModal = document.querySelector('.close-modal');
    const searchThreads = document.getElementById('search-threads');
    const filterCategory = document.getElementById('filter-category');
    const sortThreads = document.getElementById('sort-threads');
    const forumThreads = document.getElementById('forum-threads');
    const editorToolbar = document.querySelector('.editor-toolbar');

    // Rich text editor functionality
    editorToolbar.addEventListener('click', function(e) {
        const button = e.target.closest('button');
        if (!button) return;

        const command = button.dataset.command;
        if (command === 'link') {
            const url = prompt('Enter the URL:');
            if (url) {
                document.execCommand('createLink', false, url);
            }
        } else {
            document.execCommand(command, false, null);
        }
    });

    // Handle category selection
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            discussionCategory.value = category;
            window.scrollTo({
                top: document.querySelector('.new-discussion').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });

    // Preview functionality
    function openPreviewModal() {
        previewModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        previewContent.innerHTML = discussionContent.innerHTML;
    }

    function closePreviewModal() {
        previewModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    previewButton.addEventListener('click', openPreviewModal);
    closeModal.addEventListener('click', closePreviewModal);
    editPostButton.addEventListener('click', closePreviewModal);

    // Post discussion
    function createDiscussionThread(title, content, category) {
        const thread = document.createElement('div');
        thread.classList.add('forum-thread');
        thread.dataset.category = category;

        const now = new Date();
        thread.innerHTML = `
            <h3>${title}</h3>
            <div class="content">${content}</div>
            <div class="thread-meta">
                <span class="thread-category">${category}</span>
                <span class="thread-date">${now.toLocaleDateString()}</span>
            </div>
            <div class="reply-box">
                <input type="text" class="reply-input" placeholder="Write a reply...">
                <button class="reply-btn">Reply</button>
            </div>
            <div class="replies"></div>
        `;

        // Handle replies
        const replyBtn = thread.querySelector('.reply-btn');
        const replyInput = thread.querySelector('.reply-input');
        const repliesDiv = thread.querySelector('.replies');

        replyBtn.addEventListener('click', function() {
            if (replyInput.value.trim() !== '') {
                const reply = document.createElement('div');
                reply.classList.add('reply');
                reply.innerHTML = `
                    <p>${replyInput.value}</p>
                    <small>Just now</small>
                `;
                repliesDiv.appendChild(reply);
                replyInput.value = '';
            }
        });

        return thread;
    }

    confirmPostButton.addEventListener('click', function() {
        if (discussionTitle.value.trim() && discussionContent.innerHTML.trim() && discussionCategory.value) {
            const thread = createDiscussionThread(
                discussionTitle.value,
                discussionContent.innerHTML,
                discussionCategory.value
            );
            forumThreads.insertBefore(thread, forumThreads.firstChild);
            
            // Reset form
            discussionTitle.value = '';
            discussionContent.innerHTML = '';
            discussionCategory.value = '';
            
            closePreviewModal();
        }
    });

    // Search and filter functionality
    function filterThreads() {
        const searchTerm = searchThreads.value.toLowerCase();
        const selectedCategory = filterCategory.value;
        const sortBy = sortThreads.value;

        const threads = Array.from(forumThreads.children);

        threads.forEach(thread => {
            const title = thread.querySelector('h3').textContent.toLowerCase();
            const category = thread.dataset.category;
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            thread.style.display = matchesSearch && matchesCategory ? 'block' : 'none';
        });

        // Sort threads
        const sortedThreads = threads.sort((a, b) => {
            if (sortBy === 'newest') {
                return new Date(b.querySelector('.thread-date').textContent) - 
                       new Date(a.querySelector('.thread-date').textContent);
            } else if (sortBy === 'active') {
                return b.querySelectorAll('.reply').length - 
                       a.querySelectorAll('.reply').length;
            } else if (sortBy === 'replies') {
                return b.querySelectorAll('.reply').length - 
                       a.querySelectorAll('.reply').length;
            }
        });

        // Reorder threads
        sortedThreads.forEach(thread => {
            forumThreads.appendChild(thread);
        });
    }

    searchThreads.addEventListener('input', filterThreads);
    filterCategory.addEventListener('change', filterThreads);
    sortThreads.addEventListener('change', filterThreads);

    // Add some sample threads
    const sampleThreads = [
        {
            title: 'Getting Started with Machine Learning',
            content: 'What are the best resources for beginners in ML?',
            category: 'ai',
            date: '2025-03-15'
        },
        {
            title: 'Web Development Best Practices',
            content: 'Let\'s discuss modern web development practices.',
            category: 'programming',
            date: '2025-03-14'
        },
        {
            title: 'Cybersecurity Tips',
            content: 'Share your best cybersecurity practices.',
            category: 'cybersecurity',
            date: '2025-03-13'
        }
    ];

    sampleThreads.forEach(thread => {
        const threadElement = createDiscussionThread(
            thread.title,
            thread.content,
            thread.category
        );
        forumThreads.appendChild(threadElement);
    });
});

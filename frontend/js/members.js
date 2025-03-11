document.addEventListener('DOMContentLoaded', function() {
    // Hide loading screen
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    // Get DOM elements
    const memberSearch = document.getElementById('member-search');
    const roleFilter = document.getElementById('role-filter');
    const memberCards = document.querySelectorAll('.member-card');
    const modal = document.getElementById('contact-modal');
    const closeModal = document.querySelector('.close-modal');
    const contactForm = document.getElementById('contact-form');

    // Filter members based on search and role
    function filterMembers() {
        const searchTerm = memberSearch.value.toLowerCase();
        const selectedRole = roleFilter.value;

        memberCards.forEach(card => {
            const name = card.querySelector('h3').textContent.toLowerCase();
            const role = card.dataset.role;
            const skills = Array.from(card.querySelectorAll('.member-skills span'))
                .map(span => span.textContent.toLowerCase());

            const matchesSearch = name.includes(searchTerm) || 
                                skills.some(skill => skill.includes(searchTerm));
            const matchesRole = selectedRole === 'all' || role === selectedRole;

            if (matchesSearch && matchesRole) {
                card.style.display = 'block';
                // Add fade-in animation
                card.style.opacity = '0';
                setTimeout(() => {
                    card.style.opacity = '1';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Event listeners for filters
    memberSearch.addEventListener('input', filterMembers);
    roleFilter.addEventListener('change', filterMembers);

    // Handle contact modal
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModalHandler() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Add click handlers for contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const memberName = this.closest('.member-card').querySelector('h3').textContent;
            modal.querySelector('h2').textContent = `Contact ${memberName}`;
            openModal();
        });
    });

    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModalHandler();
        }
    });

    // Handle contact form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData.entries());
        
        // Here you would typically send the data to a server
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Message sent successfully!');
        closeModalHandler();
        this.reset();
    });

    // Add hover effects for member cards
    memberCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Initialize loading animation for member images
    document.querySelectorAll('.member-image img').forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}); 
    // ===== JS Toggle (Hamburger/Sidebar) =====
        const hamburger = document.getElementById('hamburgerBtn');
        const sidebar = document.getElementById('sidebarMenu');
        const closeBtn = document.getElementById('closeBtn');

        if (hamburger && sidebar && closeBtn) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                sidebar.classList.toggle('active');
            });

            closeBtn.addEventListener('click', () => {
                hamburger.classList.remove('active');
                sidebar.classList.remove('active');
            });
        }

        // ===== JS for View More/Less Reviews =====
        document.addEventListener('DOMContentLoaded', function () {
            const viewMoreBtn = document.getElementById('view-more-btn');
            const viewLessBtn = document.getElementById('view-less-btn');
            const hiddenReviews = document.querySelectorAll('.review-card.hidden');

            function showAllTestimonials() {
                hiddenReviews.forEach((card, index) => {
                    card.style.display = 'flex';
                    // Apply transition properties after display: flex is set
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50 + (index * 100));
                });


                if (viewMoreBtn) viewMoreBtn.style.display = 'none';
                if (viewLessBtn) viewLessBtn.style.display = 'inline-block';
            }

            function hideExtraTestimonials() {
                // Animate out first
                hiddenReviews.forEach((card) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                });

                // Set display: none after animation
                setTimeout(() => {
                    hiddenReviews.forEach((card) => {
                        card.style.display = 'none';
                    });
                }, 500);

                if (viewMoreBtn) viewMoreBtn.style.display = 'inline-block';
                if (viewLessBtn) viewLessBtn.style.display = 'none';
            }

            // Attach click listeners
            if (viewMoreBtn) {
                viewMoreBtn.addEventListener('click', showAllTestimonials);
            }

            if (viewLessBtn) {
                viewLessBtn.addEventListener('click', hideExtraTestimonials);
            }
        });
    
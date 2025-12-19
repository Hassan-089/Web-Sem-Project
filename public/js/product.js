document.addEventListener('DOMContentLoaded', () => {
    console.log("Product page loaded.");

    // Add to Cart Animation/Feedback
    const cartButtons = document.querySelectorAll('.add-to-cart-btn');
    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.innerText = "Added!";
            btn.style.backgroundColor = "#2ecc71";
            setTimeout(() => {
                btn.innerText = "Add to Cart";
                btn.style.backgroundColor = "";
            }, 2000);
        });
    });
});
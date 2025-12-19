//================Checkout Page JS================//
        const form = document.getElementById('checkoutForm');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const terms = document.getElementById('terms');
    const cardRadio = document.getElementById('card');
    const cardFields = document.getElementById('cardFields');

    terms.addEventListener('change', () => {
      placeOrderBtn.disabled = !terms.checked;
    });

    document.querySelectorAll('input[name="payment"]').forEach(radio => {
      radio.addEventListener('change', () => {
        if (cardRadio.checked) {
          cardFields.classList.remove('d-none');
        } else {
          cardFields.classList.add('d-none');
        }
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      const fields = {
        fullname: v => v.trim().length >= 3,
        email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        phone: v => /^\d{10,}$/.test(v),
        address: v => v.trim() !== '',
        city: v => v.trim() !== '',
        postal: v => /^\d{4,6}$/.test(v),
        country: v => v !== ''
      };

      for (const [id, check] of Object.entries(fields)) {
        const input = document.getElementById(id);
        if (!check(input.value)) {
          input.classList.add('is-invalid');
          input.classList.remove('is-valid');
          valid = false;
        } else {
          input.classList.remove('is-invalid');
          input.classList.add('is-valid');
        }
      }

      const payment = document.querySelector('input[name="payment"]:checked');
      if (!payment) {
        valid = false;
        document.querySelector('input[name="payment"]').classList.add('is-invalid');
      }

      if (cardRadio.checked) {
        const cardChecks = {
          cardName: v => v.trim() !== '',
          cardNumber: v => /^\d{16}$/.test(v),
          expiry: v => v.trim() !== '',
          cvv: v => /^\d{3}$/.test(v)
        };
        for (const [id, check] of Object.entries(cardChecks)) {
          const input = document.getElementById(id);
          if (!check(input.value)) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            valid = false;
          } else {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
          }
        }
      }

      if (!terms.checked) {
        terms.classList.add('is-invalid');
        valid = false;
      } else {
        terms.classList.remove('is-invalid');
      }

      if (!valid) {
        const firstInvalid = document.querySelector('.is-invalid');
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('Form submitted successfully!');
        form.reset();
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
        cardFields.classList.add('d-none');
        placeOrderBtn.disabled = true;
      }
    });
        

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            sidebar.classList.toggle('active');
        });

        closeBtn.addEventListener('click', () => {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
        });
        
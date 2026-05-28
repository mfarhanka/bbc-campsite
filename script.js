document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Ambil data dari borang
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const date = document.getElementById('date').value;
    const slot = document.getElementById('slot').value;

    // Nombor WhatsApp BBC Campsite (tukar ke nombor sebenar pemilik)
    const adminPhoneNumber = "60175927576"; 

    // Bina teks mesej format WhatsApp
    const message = `Salam BBC Campsite, saya ingin menyemak slot/membuat tempahan:%0A%0A` +
                    `*Nama:* ${encodeURIComponent(name)}%0A` +
                    `*No. Telefon:* ${encodeURIComponent(phone)}%0A` +
                    `*Tarikh Pilihan:* ${encodeURIComponent(date)}%0A` +
                    `*Slot Pakej:* ${encodeURIComponent(slot)}%0A%0A` +
                    `Mohon sahkan ketersediaan tarikh ini. Terima kasih!`;

    // Buka WhatsApp link
    window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
});
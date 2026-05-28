const bookingForm = document.getElementById('bookingForm');
const campsiteInput = document.getElementById('campsite');
const dateInput = document.getElementById('date');
const slotInput = document.getElementById('slot');
const selectionSummary = document.getElementById('selectionSummary');
const availabilityModal = document.getElementById('availabilityModal');
const availabilityTitle = document.getElementById('availabilityTitle');
const availabilitySubtitle = document.getElementById('availabilitySubtitle');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const calendarDays = document.getElementById('calendarDays');
const openAvailabilityModalButton = document.getElementById('openAvailabilityModal');
const campsiteButtons = document.querySelectorAll('.btn-select-campsite');
const campsiteCards = document.querySelectorAll('[data-campsite-card]');

const today = new Date();
today.setHours(0, 0, 0, 0);

const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatDateDisplay = (date) => date.toLocaleDateString('ms-MY', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
});

const buildBlockedDates = (offsets) => {
    const blockedDates = new Set();

    offsets.forEach((offset) => {
        const blockedDate = new Date(today);
        blockedDate.setDate(today.getDate() + offset);
        blockedDates.add(formatDateKey(blockedDate));
    });

    return blockedDates;
};

const campsiteAvailability = {
    'Riverside Base': buildBlockedDates([1, 5, 9, 13, 20, 27, 35, 42]),
    'Hillview Terrace': buildBlockedDates([3, 7, 11, 18, 24, 31, 39, 46]),
    'Orchard Corner': buildBlockedDates([2, 6, 14, 17, 22, 29, 37, 44])
};

let selectedCampsite = '';
let selectedDateKey = '';
let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

const updateSelectionSummary = () => {
    if (!selectedCampsite && !selectedDateKey) {
        selectionSummary.textContent = 'Belum ada campsite atau tarikh dipilih.';
        return;
    }

    if (selectedCampsite && !selectedDateKey) {
        selectionSummary.textContent = `${selectedCampsite} dipilih. Sila pilih tarikh dalam kalendar kekosongan.`;
        return;
    }

    const chosenDate = new Date(`${selectedDateKey}T00:00:00`);
    selectionSummary.textContent = `${selectedCampsite} tersedia pada ${formatDateDisplay(chosenDate)}.`;
};

const syncSelectedCampsite = () => {
    campsiteInput.value = selectedCampsite;
    openAvailabilityModalButton.disabled = !selectedCampsite;

    campsiteCards.forEach((card) => {
        const button = card.querySelector('.btn-select-campsite');
        const isSelected = button.dataset.campsite === selectedCampsite;
        card.classList.toggle('is-selected', isSelected);
        button.textContent = isSelected ? 'Campsite Dipilih' : 'Pilih & Semak Kekosongan';
    });

    updateSelectionSummary();
};

const selectDate = (dateKey) => {
    selectedDateKey = dateKey;
    const selectedDate = new Date(`${dateKey}T00:00:00`);
    dateInput.value = formatDateDisplay(selectedDate);
    updateSelectionSummary();
    renderCalendar();
    closeAvailabilityModal();
};

function renderCalendar() {
    calendarDays.innerHTML = '';
    calendarMonthLabel.textContent = currentMonth.toLocaleDateString('ms-MY', {
        month: 'long',
        year: 'numeric'
    });

    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startWeekday = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();
    const blockedDates = campsiteAvailability[selectedCampsite] || new Set();

    for (let index = 0; index < startWeekday; index += 1) {
        const spacer = document.createElement('span');
        spacer.className = 'calendar-spacer';
        calendarDays.appendChild(spacer);
    }

    for (let day = 1; day <= totalDays; day += 1) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateKey = formatDateKey(date);
        const isPast = date < today;
        const isBlocked = blockedDates.has(dateKey);
        const isSelected = selectedDateKey === dateKey;
        const dayButton = document.createElement('button');

        dayButton.type = 'button';
        dayButton.className = 'calendar-day';
        dayButton.textContent = String(day);
        dayButton.disabled = isPast || isBlocked || !selectedCampsite;

        if (isPast || isBlocked) {
            dayButton.classList.add('is-unavailable');
        } else {
            dayButton.classList.add('is-available');
        }

        if (isSelected) {
            dayButton.classList.add('is-selected');
        }

        dayButton.addEventListener('click', () => {
            if (!dayButton.disabled) {
                selectDate(dateKey);
            }
        });

        calendarDays.appendChild(dayButton);
    }
}

function openAvailabilityModal() {
    availabilityModal.classList.add('is-open');
    availabilityModal.setAttribute('aria-hidden', 'false');
    availabilityTitle.textContent = selectedCampsite || 'Pilih Campsite Dahulu';
    availabilitySubtitle.textContent = selectedCampsite
        ? `Tarikh aktif di bawah menunjukkan kekosongan semasa untuk ${selectedCampsite}.`
        : 'Pilih salah satu campsite untuk semak kekosongan semasa.';
    renderCalendar();
}

function closeAvailabilityModal() {
    availabilityModal.classList.remove('is-open');
    availabilityModal.setAttribute('aria-hidden', 'true');
}

campsiteButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const nextCampsite = button.dataset.campsite;

        if (selectedCampsite !== nextCampsite) {
            selectedDateKey = '';
            dateInput.value = '';
        }

        selectedCampsite = nextCampsite;
        syncSelectedCampsite();
        openAvailabilityModal();
    });
});

openAvailabilityModalButton.addEventListener('click', openAvailabilityModal);
document.getElementById('closeAvailabilityModal').addEventListener('click', closeAvailabilityModal);
document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    renderCalendar();
});
document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    renderCalendar();
});
availabilityModal.addEventListener('click', (event) => {
    if (event.target === availabilityModal) {
        closeAvailabilityModal();
    }
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && availabilityModal.classList.contains('is-open')) {
        closeAvailabilityModal();
    }
});

bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const campsite = campsiteInput.value;
    const date = dateInput.value;
    const slot = slotInput.value;

    const adminPhoneNumber = '60175927576';

    const message = `Salam BBC Campsite, saya ingin menyemak slot/membuat tempahan:%0A%0A` +
                    `*Nama:* ${encodeURIComponent(name)}%0A` +
                    `*No. Telefon:* ${encodeURIComponent(phone)}%0A` +
                    `*Campsite:* ${encodeURIComponent(campsite)}%0A` +
                    `*Tarikh Pilihan:* ${encodeURIComponent(date)}%0A` +
                    `*Slot Pakej:* ${encodeURIComponent(slot)}%0A%0A` +
                    `Mohon sahkan ketersediaan tarikh ini. Terima kasih!`;

    window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
});

syncSelectedCampsite();
renderCalendar();
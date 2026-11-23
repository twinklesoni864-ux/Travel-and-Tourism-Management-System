const packages = [
  {
    id: "jaipur-heritage",
    title: "Jaipur & Jodhpur Royal Trail",
    category: "Heritage",
    duration: "5 Days / 4 Nights",
    rating: "4.9 ★",
    price: 24500,
    description: "Courtyard havelis, stepwells, hilltop forts, and guided old-city craft walks.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "manali-valley",
    title: "Manali & Solang Alpine Escape",
    category: "Mountains",
    duration: "6 Days / 5 Nights",
    rating: "4.8 ★",
    price: 27800,
    description: "Pine forests, crisp mountain air, river viewpoints, and scenic valley drives.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: "goa-coast",
    title: "South Goa Cove & Sunset Retreat",
    category: "Coastal",
    duration: "4 Days / 3 Nights",
    rating: "4.9 ★",
    price: 19500,
    description: "Quiet palm beaches, coastal seafood kitchens, and unhurried resort stays.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80"
  },
  {
    
    id: "udaipur-lake",
    title: "Udaipur Lakes & Palace Escape",
    category: "Heritage",
    duration: "4 Days / 3 Nights",
    rating: "4.8 ★",
    price: 21000,
    description: "Evening boat rides on Lake Pichola, lakeside dining, and art studio visits.",
    image:"https://images.unsplash.com/photo-1662883935445-2f8da42271af?auto=format&fit=crop&w=900&q=80"
  }
];

const bookings = [
  {
    code: "NV-1041",
    guest: "Rohan Deshmukh",
    packageTitle: "Jaipur & Jodhpur Royal Trail",
    date: "2026-12-15",
    guests: 2,
    total: 49000,
    status: "Confirmed"
  },
  {
    code: "NV-1042",
    guest: "Meera Krishnan",
    packageTitle: "South Goa Cove & Sunset Retreat",
    date: "2026-12-18",
    guests: 3,
    total: 58500,
    status: "Confirmed"
  },
  {
    code: "NV-1043",
    guest: "Kabir Malhotra",
    packageTitle: "Manali & Solang Alpine Escape",
    date: "2026-12-22",
    guests: 2,
    total: 55600,
    status: "Pending"
  }
];

let selectedCategory = "All";
let searchTerm = "";

const packagesGrid = document.getElementById("packagesGrid");
const bookingsBody = document.getElementById("bookingsBody");
const summaryStrip = document.getElementById("summaryStrip");
const packageSelect = document.getElementById("packageSelect");
const modal = document.getElementById("bookingModal");
const createBookingForm = document.getElementById("createBookingForm");
const farePreview = document.getElementById("farePreview");

function formatINR(num) {
  return "₹" + Number(num || 0).toLocaleString("en-IN");
}

function renderPackages() {
  const list = packages.filter((pkg) => {
    const matchCat = selectedCategory === "All" || pkg.category === selectedCategory;
    const matchText =
      !searchTerm ||
      pkg.title.toLowerCase().includes(searchTerm) ||
      pkg.category.toLowerCase().includes(searchTerm) ||
      pkg.description.toLowerCase().includes(searchTerm);
    return matchCat && matchText;
  });

  if (!list.length) {
    packagesGrid.innerHTML = `<p style="color: var(--ink-muted);">No matching tour packages found. Try clearing your search.</p>`;
    return;
  }

  packagesGrid.innerHTML = list
    .map(
      (pkg) => `
      <article class="dest-card">
        <img class="dest-img" src="${pkg.image}" alt="${pkg.title}" loading="lazy" />
        <div class="dest-body">
          <div>
            <div class="dest-meta">
              <span>${pkg.category} · ${pkg.duration}</span>
              <span>${pkg.rating}</span>
            </div>
            <h3 class="dest-title">${pkg.title}</h3>
            <p class="dest-desc">${pkg.description}</p>
          </div>
          <div class="dest-foot">
            <div class="dest-price">${formatINR(pkg.price)} <span>/ person</span></div>
            <button type="button" class="btn-dark" data-book-pkg="${pkg.id}">Book Trip</button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderSummary() {
  const totalBookings = bookings.length;
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const revenue = bookings.reduce((sum, b) => sum + b.total, 0);

  summaryStrip.innerHTML = `
    <div class="mini-stat">
      <small>Bookings</small>
      <strong>${totalBookings} Active</strong>
    </div>
    <div class="mini-stat">
      <small>Confirmed</small>
      <strong>${confirmed} / ${totalBookings}</strong>
    </div>
    <div class="mini-stat">
      <small>Total Value</small>
      <strong>${formatINR(revenue)}</strong>
    </div>
  `;
}

function renderBookings() {
  renderSummary();

  if (!bookings.length) {
    bookingsBody.innerHTML = `<tr><td colspan="8">No bookings yet. Click "+ Book a Trip" to create one.</td></tr>`;
    return;
  }

  bookingsBody.innerHTML = bookings
    .map(
      (b) => `
      <tr>
        <td><strong>${b.code}</strong></td>
        <td>${b.guest}</td>
        <td>${b.packageTitle}</td>
        <td>${b.date}</td>
        <td>${b.guests}</td>
        <td><strong>${formatINR(b.total)}</strong></td>
        <td><span class="badge ${b.status}">${b.status}</span></td>
        <td>
          <button type="button" class="action-link" data-toggle="${b.code}">Toggle Status</button>
          <button type="button" class="action-link" data-delete="${b.code}">Remove</button>
        </td>
      </tr>
    `
    )
    .join("");
}

function populateSelect(preselectId = "") {
  packageSelect.innerHTML = packages
    .map(
      (p) => `
      <option value="${p.id}" ${p.id === preselectId ? "selected" : ""}>
        ${p.title} (${formatINR(p.price)}/person)
      </option>
    `
    )
    .join("");
  updateFarePreview();
}

function updateFarePreview() {
  const pkg = packages.find((p) => p.id === packageSelect.value) || packages[0];
  const guests = Math.max(1, Number(document.getElementById("modalGuests").value || 1));
  farePreview.textContent = formatINR(pkg.price * guests);
}

function openModal(pkgId = "", dateVal = "", guestsVal = "") {
  populateSelect(pkgId);
  if (dateVal) document.getElementById("modalDate").value = dateVal;
  if (guestsVal) document.getElementById("modalGuests").value = guestsVal;
  updateFarePreview();
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
}

// Category pills
document.getElementById("categoryPills").addEventListener("click", (e) => {
  const pill = e.target.closest(".pill");
  if (!pill) return;
  selectedCategory = pill.dataset.cat;
  document.querySelectorAll("#categoryPills .pill").forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");
  renderPackages();
});

// Hero search
document.getElementById("heroSearchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  searchTerm = document.getElementById("destInput").value.trim().toLowerCase();
  selectedCategory = "All";
  document.querySelectorAll("#categoryPills .pill").forEach((p) => {
    p.classList.toggle("active", p.dataset.cat === "All");
  });
  renderPackages();
  document.getElementById("destinations").scrollIntoView({ behavior: "smooth" });
});

// Book button on cards
packagesGrid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-book-pkg]");
  if (!btn) return;
  openModal(
    btn.dataset.bookPkg,
    document.getElementById("dateInput").value,
    document.getElementById("guestsInput").value
  );
});

// Table actions
bookingsBody.addEventListener("click", (e) => {
  const toggleBtn = e.target.closest("[data-toggle]");
  const delBtn = e.target.closest("[data-delete]");

  if (toggleBtn) {
    const item = bookings.find((b) => b.code === toggleBtn.dataset.toggle);
    if (item) {
      item.status = item.status === "Confirmed" ? "Pending" : "Confirmed";
      renderBookings();
    }
  }

  if (delBtn) {
    const idx = bookings.findIndex((b) => b.code === delBtn.dataset.delete);
    if (idx !== -1) {
      bookings.splice(idx, 1);
      renderBookings();
    }
  }
});

// Modal listeners
document.getElementById("openModalTop").addEventListener("click", () => openModal());
document.getElementById("closeModalBtn").addEventListener("click", closeModal);
document.getElementById("cancelModalBtn").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

packageSelect.addEventListener("change", updateFarePreview);
document.getElementById("modalGuests").addEventListener("input", updateFarePreview);

createBookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(createBookingForm);
  const pkg = packages.find((p) => p.id === fd.get("packageId")) || packages[0];
  const guests = Math.max(1, Number(fd.get("guests")));

  bookings.unshift({
    code: `NV-${Math.floor(1044 + Math.random() * 890)}`,
    guest: fd.get("guestName").trim(),
    packageTitle: pkg.title,
    date: fd.get("travelDate"),
    guests,
    total: pkg.price * guests,
    status: "Confirmed"
  });

  createBookingForm.reset();
  document.getElementById("modalDate").value = "2026-12-15";
  document.getElementById("modalGuests").value = "2";
  closeModal();
  renderBookings();
});

// Initial render
populateSelect();
renderPackages();
renderBookings();
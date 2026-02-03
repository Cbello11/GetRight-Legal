const photoInput = document.getElementById("photo-input");
const photoGrid = document.getElementById("photo-grid");
const generateButton = document.getElementById("generate");
const loadDemoButton = document.getElementById("load-demo");
const reviewCard = document.getElementById("review-card");
const approveButton = document.getElementById("approve");
const regenerateButton = document.getElementById("regenerate");
const statusPill = document.getElementById("status-pill");
const approvalMessage = document.getElementById("approval-message");

const reviewTitle = document.getElementById("review-title");
const reviewPrice = document.getElementById("review-price");
const reviewKeywords = document.getElementById("review-keywords");
const reviewDescription = document.getElementById("review-description");
const reviewSpecifics = document.getElementById("review-specifics");

const state = {
  photos: [],
  listing: null,
};

const demoListing = {
  title: "Mildred's of Hawaii Vintage Maxi Dress Orange Floral Print Size 12",
  price: "$68.00",
  keywords: "vintage hawaiian dress, orange floral, long sleeve maxi",
  description:
    "Make a statement in this vintage Mildred's of Hawaii maxi dress featuring bold orange, red, and white floral swirls. The long sleeves and flowing silhouette deliver true island-inspired style, while the zip front adds easy wear. Perfect for collectors of vintage Hawaiian apparel or standout resort looks.\n\nMeasurements (approx): please add your own for best fit.\nCondition: Pre-owned with light wear consistent with age; see photos for details.",
  specifics: {
    Brand: "Mildred's of Hawaii",
    Size: "12",
    Color: "Orange / Red / White",
    Style: "Maxi",
    Sleeve: "Long Sleeve",
    Occasion: "Casual / Resort / Vintage",
  },
};

function setStatus(message, tone = "ready") {
  statusPill.textContent = message;
  statusPill.dataset.tone = tone;
}

function renderPhotos() {
  photoGrid.innerHTML = "";
  state.photos.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = reader.result;
      img.alt = file.name;
      const caption = document.createElement("figcaption");
      caption.textContent = file.name;
      figure.appendChild(img);
      figure.appendChild(caption);
      photoGrid.appendChild(figure);
    };
    reader.readAsDataURL(file);
  });
}

function populateReview(listing) {
  reviewTitle.value = listing.title || "";
  reviewPrice.value = listing.price || "";
  reviewKeywords.value = listing.keywords || "";
  reviewDescription.value = listing.description || "";
  reviewSpecifics.innerHTML = "";
  if (listing.specifics) {
    Object.entries(listing.specifics).forEach(([key, value]) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${key}:</strong> ${value}`;
      reviewSpecifics.appendChild(li);
    });
  }
  reviewCard.hidden = false;
  approvalMessage.hidden = true;
}

function collectPayload() {
  return {
    brand: document.getElementById("brand").value.trim(),
    size: document.getElementById("size").value.trim(),
    category: document.getElementById("category").value.trim(),
    condition: document.getElementById("condition").value,
    notes: document.getElementById("notes").value.trim(),
  };
}

async function generateListing() {
  setStatus("Generating…", "loading");
  approvalMessage.hidden = true;

  const formData = new FormData();
  const payload = collectPayload();
  Object.entries(payload).forEach(([key, value]) => formData.append(key, value));
  state.photos.forEach((file) => formData.append("photos", file));

  try {
    const response = await fetch("/api/listings/generate", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Unable to generate listing.");
    }

    const listing = await response.json();
    state.listing = listing;
    populateReview(listing);
    setStatus("Draft ready", "ready");
  } catch (error) {
    setStatus("Needs setup", "warning");
    approvalMessage.hidden = false;
    approvalMessage.textContent =
      "Connect the backend endpoint at /api/listings/generate to enable live listing creation, or load a demo listing.";
  }
}

async function saveDraftToEbay() {
  if (!state.listing) {
    return;
  }

  setStatus("Saving draft…", "loading");
  approvalMessage.hidden = true;

  const payload = {
    title: reviewTitle.value.trim(),
    price: reviewPrice.value.trim(),
    keywords: reviewKeywords.value.trim(),
    description: reviewDescription.value.trim(),
    specifics: Array.from(reviewSpecifics.querySelectorAll("li")).map((item) =>
      item.textContent.trim()
    ),
  };

  try {
    const response = await fetch("/api/listings/save-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Unable to approve listing.");
    }

    const result = await response.json();
    approvalMessage.hidden = false;
    approvalMessage.textContent =
      result.message || "Draft saved to eBay. You can finalize and publish it there.";
    setStatus("Draft saved", "ready");
  } catch (error) {
    approvalMessage.hidden = false;
    approvalMessage.textContent =
      "Draft save failed. Connect the backend endpoint at /api/listings/save-draft to save in eBay.";
    setStatus("Needs setup", "warning");
  }
}

photoInput.addEventListener("change", (event) => {
  state.photos = Array.from(event.target.files || []);
  renderPhotos();
});

generateButton.addEventListener("click", () => {
  if (!state.photos.length) {
    approvalMessage.hidden = false;
    approvalMessage.textContent = "Please upload at least one photo before generating.";
    return;
  }
  generateListing();
});

loadDemoButton.addEventListener("click", () => {
  state.listing = demoListing;
  populateReview(demoListing);
  setStatus("Demo ready", "ready");
});

approveButton.addEventListener("click", saveDraftToEbay);
regenerateButton.addEventListener("click", generateListing);

// form start

const statedata = {
  Gujarat: ["surat", "bhavnagar"],
  Maharashtra: ["mumbai", "pune"],
  Rajasthan: ["jesalmer", "jaipur"],
};

const state = document.getElementById("state");
const district = document.getElementById("district");

state.addEventListener("change", function () {
  const statevalue = this.value;
  console.log(statevalue);
  district.innerHTML = '<option value="">Select District</option>';
  if (statevalue && statedata[statevalue]) {
    statedata[statevalue].forEach((element) => {
      const opt = document.createElement("option");
      opt.value = element.toLowerCase();
      opt.textContent = element;
      district.appendChild(opt);
    });
  }
});

// form end

// grid start

let data = [];
let filteredData = [];
let currentPage = 1;
let rowsPerPage = 8;
let currentSort = { column: null, order: "asc" };
let isEditMode = false;
let editRecordNo = null;

async function loadData() {
  try {
    // Example API (you should replace this with your API endpoint)
    let response = await fetch("home/getall");
    let result = await response.json();

    // Map API response into table structure
    data = result.map((u, i) => ({
      recordNo: u.recordNo,
      fname: u.fname || "",
      lname: u.lname || "",
      phone: u.phone || "",
      email: u.email || "",
      address: u.address || "",
      state: u.state || "",
      district: u.district || "",
      city: u.city || "",
      zip: u.zip || "",
    }));

    filteredData = [...data];
    displayTable();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function displayTable() {
  const tableBody = document.querySelector("#datatable tbody");
  tableBody.innerHTML = "";

  let start = (currentPage - 1) * rowsPerPage;
  let end = start + rowsPerPage;
  let paginatedData = filteredData.slice(start, end);

  paginatedData.forEach((row, idx) => {
    let tr = document.createElement("tr");
    tr.innerHTML = `
    <td><button class="action-btn" data-recordno="${row.recordNo}">✏️</button></td>
    <td>${row.fname}</td>
    <td>${row.lname}</td>
    <td>${row.phone}</td>
    <td>${row.email}</td>
    <td>${row.address}</td>
    <td>${row.state}</td>
    <td>${row.district}</td>
    <td>${row.city}</td>
    <td>${row.zip}</td>
  `;
    tableBody.appendChild(tr);
  });

  document.getElementById("pageInfo").innerText = `${start + 1}-${Math.min(
    end,
    filteredData.length
  )} of ${filteredData.length}`;

  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      const recordNo = parseInt(this.getAttribute("data-recordno"));
      const row = filteredData.find((r) => r.recordNo === recordNo);
      if (row) fillForm(row);
    });
  });
}

// Search filter
document.getElementById("searchInput").addEventListener("input", function () {
  const searchText = this.value.toLowerCase();
  filteredData = data.filter((row) => {
    // Only check visible fields (exclude recordNo)
    return [
      row.fname,
      row.lname,
      row.phone,
      row.email,
      row.address,
      row.state,
      row.district,
      row.city,
      row.zip,
    ]
      .map((val) => val.toString().toLowerCase())
      .some((val) => val.includes(searchText));
  });
  currentPage = 1;
  displayTable();
});

// Sorting
document.querySelectorAll("th[data-column]").forEach((th) => {
  th.addEventListener("click", function () {
    const column = this.getAttribute("data-column");
    document
      .querySelectorAll("th")
      .forEach((h) => h.classList.remove("sort-asc", "sort-desc"));

    if (currentSort.column === column && currentSort.order === "asc") {
      currentSort.order = "desc";
    } else {
      currentSort.order = "asc";
    }
    currentSort.column = column;

    filteredData.sort((a, b) => {
      let valA = a[column].toString().toLowerCase();
      let valB = b[column].toString().toLowerCase();
      if (valA < valB) return currentSort.order === "asc" ? -1 : 1;
      if (valA > valB) return currentSort.order === "asc" ? 1 : -1;
      return 0;
    });

    this.classList.add(currentSort.order === "asc" ? "sort-asc" : "sort-desc");
    displayTable();
  });
});

// Pagination controls
document.getElementById("rowsPerPage").addEventListener("change", function () {
  rowsPerPage = parseInt(this.value);
  currentPage = 1;
  displayTable();
});

document.getElementById("prevBtn").addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    displayTable();
  }
});

document.getElementById("nextBtn").addEventListener("click", function () {
  if (currentPage * rowsPerPage < filteredData.length) {
    currentPage++;
    displayTable();
  }
});

function fillForm(row) {
  document.getElementById("fname").value = row.fname || "";
  document.getElementById("lname").value = row.lname || "";
  document.querySelector('input[name="phone"]').value = row.phone || "";
  document.getElementById("email").value = row.email || "";
  document.getElementById("address").value = row.address || "";
  document.getElementById("state").value = row.state || "";

  document.getElementById("state").dispatchEvent(new Event("change"));

  document.getElementById("district").value = row.district || "";
  document.getElementById("city").value = row.city || "";
  document.getElementById("zip").value = row.zip || "";

  // Set edit mode and record number
  isEditMode = true;
  editRecordNo = row.recordNo;
}

// Phone input: allow only digits, format after input
const phoneInput = document.querySelector('input[name="phone"]');
phoneInput.addEventListener("input", function (e) {
  // Remove non-digits
  let digits = this.value.replace(/\D/g, "");
  // Limit to 10 digits
  if (digits.length > 10) digits = digits.slice(0, 10);
  // Format if 10 digits
  if (digits.length === 10) {
    this.value = `(${digits.slice(0, 3)})-${digits.slice(3, 6)}-${digits.slice(
      6,
      10
    )}`;
  } else {
    this.value = digits;
  }
});

const zipInput = document.getElementById("zip");
zipInput.addEventListener("input", function () {
  let digits = this.value.replace(/\D/g, "");
  if (digits.length > 6) digits = digits.slice(0, 6);
  this.value = digits;
});

// Popup message function
function showPopupMessage(msg, type = "success") {
  let popup = document.getElementById("popup-message");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "popup-message";
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.padding = "12px 24px";
    popup.style.background = type === "success" ? "#4caf50" : "#f44336";
    popup.style.color = "#fff";
    popup.style.borderRadius = "6px";
    popup.style.zIndex = "9999";
    popup.style.fontSize = "16px";
    document.body.appendChild(popup);
  }
  popup.textContent = msg;
  popup.style.display = "block";
  setTimeout(() => {
    popup.style.display = "none";
  }, 2500);
}

// Form validation on submit
document
  .getElementById("formdetails")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    // Clear previous errors
    ["phone", "email", "zip"].forEach((field) => {
      document.getElementById("error-" + field).textContent = "";
    });

    // Get form values
    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const phoneInput = document.querySelector('input[name="phone"]');
    const phoneRaw = phoneInput.value.replace(/\D/g, "");
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const state = document.getElementById("state").value;
    const district = document.getElementById("district").value;
    const city = document.getElementById("city")
      ? document.getElementById("city").value
      : "";
    const zip = document.getElementById("zip")
      ? document.getElementById("zip").value
      : "";

    let hasError = false;

    // Phone validation
    if (phoneRaw.length !== 10) {
      document.getElementById("error-phone").textContent =
        "Phone number must be 10 digits.";
      hasError = true;
    }

    // Email validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      document.getElementById("error-email").textContent =
        "Email must be valid and contain '@' and '.'.";
      hasError = true;
    }

    // Zip validation
    const zipRaw = zip.replace(/\D/g, "");
    if (zipRaw.length !== 6) {
      document.getElementById("error-zip").textContent =
        "Zip code must be 6 digits.";
      hasError = true;
    }

    if (hasError) return;

    // Format phone
    const phone = `(${phoneRaw.slice(0, 3)})-${phoneRaw.slice(
      3,
      6
    )}-${phoneRaw.slice(6, 10)}`;

    // Prepare payload
    const payload = {
      fname,
      lname,
      phone,
      email,
      address,
      state,
      district,
      city,
      zip,
    };

    let apiUrl = "home/submit";
    if (isEditMode && editRecordNo !== null) {
      apiUrl = "home/update";
      payload.isEdit = true;
      payload.recordNo = editRecordNo;
    } else {
      payload.isEdit = false;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        showPopupMessage("Record submitted successfully!", "success");
        isEditMode = false;
        editRecordNo = null;
        this.reset();
        loadData(); // Reload data to reflect changes
      } else {
        showPopupMessage("Failed to submit record.", "error");
        loadData(); // Reload data to reflect changes
      }
    } catch (err) {
      showPopupMessage("Error submitting record.", "error");
      console.error(err);
    }
  });

loadData();

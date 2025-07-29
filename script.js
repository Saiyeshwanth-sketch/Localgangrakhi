// Initialize EmailJS
emailjs.init("F_3Ss3kxhTAf4Vvxe");

const products = [
  {
    name: "Crimson Rose Rakhi",
    price: 40,
    images: ["https://i.ibb.co/6J8LkK3L/Untitled-2.jpg", "https://i.ibb.co/6cMbxCRq/IMG-20250726-WA0005-2.jpg"]
  },
  {
    name: "Round Radiance Rakhi",
    price: 29,
    images: ["https://i.ibb.co/MyJGcdvb/Untitled-1.png", "https://i.ibb.co/C33Wx31C/PXL-20250719-141726150.jpg"]
  },
  {
    name: "Subhadra Rakhi for Krishna",
    price: 35,
    images: ["https://i.ibb.co/7JCLq3NZ/Untitled.png", "https://i.ibb.co/GvD10bPX/IMG-20250719-183903112-HDR-2.jpg"]
  },
  {
    name: "Mayur Rakhi",
    price: 49,
    images: ["https://i.ibb.co/7xRhBnfw/Untitled-3.png", "https://i.ibb.co/k2RDXmkP/IMG-20250719-194159554-HDR.jpg"]
  },
  {
    name: "Morpankh Rakhi",
    price: 60,
    images: ["https://i.ibb.co/1YwnLq49/Untitled-1-4.jpg", "https://i.ibb.co/PZB17wbx/IMG-20250714-WA0059.jpg"]
  },
  {
    name: "Golden Petal Rakhi",
    price: 49,
    images: ["https://i.ibb.co/3mbWpc5t/Untitled.jpg", "https://i.ibb.co/zV1P9yzJ/IMG-20250719-194010737-HDR.jpg"]
  },
  {
    name: "Golden Heart Rakhi",
    price: 69,
    images: ["https://i.ibb.co/XfCq0xs6/Untitled-1.jpg", "https://i.ibb.co/27bPD7mq/IMG-20250714-WA0043.jpg"]
  },
  {
    name: "Golden Om Charm Rakhi",
    price: 60,
    images: ["https://i.ibb.co/N623mj3F/Untitled-1-3.jpg", "https://i.ibb.co/JW09xL71/IMG-20250714-WA0078.jpg"]
  },
  {
    name: "Big Bro Rakhi",
    price: 0,
    images: ["https://i.ibb.co/PvBVWKDc/Untitled-2.jpg", "https://i.ibb.co/ksSGrhs5/IMG-20250719-192946382-HDR.jpg"]
  },
  {
    name: "Telugu Brother Rakhi",
    price: 45,
    images: ["https://i.ibb.co/9k5Bn7T3/IMG-20250714-WA0007-1.jpg", "https://i.ibb.co/Y7JxZn9h/Untitled-1-5.jpg"]
  },
  {
    name: "Swastik Rakhi",
    price: 49,
    images: ["https://i.ibb.co/qYYrBn5P/IMG-20250714-WA0019.jpg", "https://i.ibb.co/yF05FMjG/IMG-20250719-184934776-HDR.jpg"]
  },
  {
    name: "Stone-Studded Bro Rakhi",
    price: 45,
    images: ["https://i.ibb.co/WNDwnFF7/IMG-20250719-195324622-HDR.jpg", "https://i.ibb.co/TDQFMkX9/IMG-20250719-195255349.jpg"]
  }
];

const cart = {};

function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach((product, index) => {
    const card = document.createElement("div");
    card.className = "product";

    let currentImgIndex = 0;

    const img = document.createElement("img");
    img.src = product.images[currentImgIndex];
    img.alt = product.name;
    img.onclick = () => showFullImage(product.images[currentImgIndex]);

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = ">";
    toggleBtn.className = "toggle-btn";
    toggleBtn.onclick = () => {
      currentImgIndex = (currentImgIndex + 1) % product.images.length;
      img.src = product.images[currentImgIndex];
    };

    card.innerHTML += `
      <h3>${product.name}</h3>
      <p>₹${product.price}</p>
      <div class="controls">
        <button onclick="updateQty(${index}, -1)">-</button>
        <span id="qty-${index}">0</span>
        <button onclick="updateQty(${index}, 1)">+</button>
      </div>
    `;

    card.prepend(toggleBtn);
    card.prepend(img);
    container.appendChild(card);
  });
}

function updateQty(index, delta) {
  const product = products[index];
  if (!cart[product.name]) {
    cart[product.name] = { quantity: 0, price: product.price };
  }
  cart[product.name].quantity += delta;
  if (cart[product.name].quantity < 0) cart[product.name].quantity = 0;
  document.getElementById(`qty-${index}`).innerText = cart[product.name].quantity;
  updateCartDisplay();
}

function updateCartDisplay() {
  const items = [];
  let total = 0;
  for (const name in cart) {
    const item = cart[name];
    if (item.quantity > 0) {
      items.push(`${name} × ${item.quantity} = ₹${item.price * item.quantity}`);
      total += item.price * item.quantity;
    }
  }
  document.getElementById("orderItems").value = items.join("\n");
  document.getElementById("orderTotal").value = `₹${total}`;
}

function showFullImage(url) {
  document.getElementById("imageModal").style.display = "block";
  document.getElementById("fullImg").src = url;
}

document.querySelector(".close").onclick = () => {
  document.getElementById("imageModal").style.display = "none";
};

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const form = this;

  // Prepare order summary and total
  const orderSummary = Object.entries(cart)
    .filter(([_, item]) => item.quantity > 0)
    .map(([name, item]) =>
      `${name} - ₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}`
    ).join('\n');

  const totalAmount = Object.values(cart)
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  // Set values in hidden form fields
  document.getElementById("orderItems").value = orderSummary;
  document.getElementById("orderTotal").value = `₹${totalAmount}`;

  // Send email via EmailJS
  emailjs.sendForm('service_9hm9wee', 'template_ga2ypz9', form)
    .then(() => {
      document.getElementById("formStatus").textContent = "Order sent successfully!";
      form.reset();
      for (const key in cart) delete cart[key];
      updateCartDisplay();
    })
    .catch(error => {
      console.error(error);
      document.getElementById("formStatus").textContent = "Failed to send order. Try again.";
    });
});

renderProducts();

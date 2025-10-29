document.addEventListener("DOMContentLoaded", () => {
  // Ambil target dari localStorage (jika ada) atau set default
  const target = JSON.parse(localStorage.getItem("nutritionTarget")) || {
    calories: 2050,
    protein: 150,
    carbs: 200,
    fat: 65,
  };

  // Simpan konsumsi pengguna
  let consumed = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const meals = [
    {
      name: "Nasi Goreng Sehat",
      calories: 450,
      protein: 20,
      carbs: 60,
      fat: 15,
      category: "lunch",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
      recipe:
        "Gunakan nasi merah, minyak zaitun, dan banyak sayuran. Tambahkan telur atau ayam tanpa kulit.",
    },
    {
      name: "Oatmeal Pisang",
      calories: 320,
      protein: 12,
      carbs: 50,
      fat: 8,
      category: "breakfast",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
      recipe:
        "Campurkan oatmeal, susu rendah lemak, dan pisang. Bisa ditambahkan madu untuk rasa manis alami.",
    },
    {
      name: "Tumis Brokoli Ayam",
      calories: 380,
      protein: 35,
      carbs: 20,
      fat: 12,
      category: "dinner",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
      recipe:
        "Gunakan dada ayam tanpa kulit dan tumis dengan brokoli, bawang putih, dan sedikit minyak zaitun.",
    },
    {
      name: "Kacang Almond",
      calories: 150,
      protein: 6,
      carbs: 5,
      fat: 12,
      category: "snacks",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=880",
      recipe:
        "Segenggam kacang almond panggang, tinggi lemak sehat dan protein.",
    },
  ];

  const container = document.getElementById("mealsContainer");
  const modal = document.getElementById("recipeModal");
  const modalContent = document.getElementById("recipeContent");

  const totalCaloriesEl = document.getElementById("totalCalories");
  const totalProteinEl = document.getElementById("totalProtein");
  const totalCarbsEl = document.getElementById("totalCarbs");
  const totalFatEl = document.getElementById("totalFat");

  // Bagian progress bar
  const updateDailyProgress = () => {
    totalCaloriesEl.textContent = target.calories;
    totalProteinEl.textContent = target.protein;
    totalCarbsEl.textContent = target.carbs;
    totalFatEl.textContent = target.fat;

    const consumedEl = document.querySelector(
      ".text-2xl.font-bold.text-primary"
    );
    const remainingEl = document.querySelector(".text-sm.text-gray-500");

    consumedEl.textContent = `${consumed.calories} / ${target.calories} kcal`;
    remainingEl.textContent = `${Math.max(
      0,
      target.calories - consumed.calories
    )} kcal remaining`;

    // Update progress bar width
    const progressPercent = Math.min(
      100,
      (consumed.calories / target.calories) * 100
    );
    document.querySelector(
      ".bg-primary.h-2.rounded-full"
    ).style.width = `${progressPercent}%`;
  };

  // Render meal cards
  function renderMeals(filter = "all") {
    container.innerHTML = "";
    const filtered =
      filter === "all" ? meals : meals.filter((m) => m.category === filter);

    filtered.forEach((meal) => {
      const mealCard = document.createElement("div");
      mealCard.className =
        "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer";
      mealCard.innerHTML = `
                <img src="${meal.image}" alt="${meal.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${meal.name}</h3>
                    <p class="text-sm text-gray-600 mb-4">${meal.calories} kcal • ${meal.protein}g protein • ${meal.carbs}g carbs • ${meal.fat}g fat</p>
                    <div class="flex gap-2">
                        <button class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">View Recipe</button>
                        <button class="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors">Add</button>
                    </div>
                </div>
            `;
      const [viewBtn, addBtn] = mealCard.querySelectorAll("button");
      viewBtn.addEventListener("click", () => showRecipe(meal));
      addBtn.addEventListener("click", () => addMeal(meal));
      container.appendChild(mealCard);
    });
  }

  // Show recipe modal
  function showRecipe(meal) {
    modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-4 text-gray-800">${meal.name}</h2>
            <img src="${meal.image}" class="w-full h-56 object-cover rounded-xl mb-4">
            <p class="text-gray-700 mb-2"><strong>Calories:</strong> ${meal.calories} kcal</p>
            <p class="text-gray-700 mb-2"><strong>Protein:</strong> ${meal.protein} g</p>
            <p class="text-gray-700 mb-2"><strong>Carbs:</strong> ${meal.carbs} g</p>
            <p class="text-gray-700 mb-4"><strong>Fat:</strong> ${meal.fat} g</p>
            <p class="text-gray-700">${meal.recipe}</p>
            <button id="closeModal" class="mt-6 w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-dark">Close</button>
        `;
    modal.classList.remove("hidden");
    document.getElementById("closeModal").addEventListener("click", () => {
      modal.classList.add("hidden");
    });
  }

  // Add meal to plan
  function addMeal(meal) {
    consumed.calories += meal.calories;
    consumed.protein += meal.protein;
    consumed.carbs += meal.carbs;
    consumed.fat += meal.fat;
    updateDailyProgress();
  }

  // Filter buttons
  document.querySelectorAll(".meal-filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".meal-filter")
        .forEach((b) => b.classList.remove("bg-primary", "text-white"));
      btn.classList.add("bg-primary", "text-white");
      renderMeals(btn.dataset.category);
    });
  });

  // Click outside modal to close
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });

  // Initial setup
  updateDailyProgress();
  renderMeals();
});

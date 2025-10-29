// Global state management
const appState = {
    currentPage: 'home',
    userData: {
        gender: '',
        age: '',
        height: '',
        weight: '',
        activityLevel: '',
        bmi: 0,
        goal: '',
        dailyCalories: 0,
        macros: { protein: 0, carbs: 0, fat: 0 },
        gymExperience: false
    },
    meals: [],
    workouts: [],
    progress: {
        weight: [],
        calories: [],
        workouts: 0,
        streak: 0
    }
};

// Page navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        appState.currentPage = pageId;
        
        // Initialize page-specific functionality
        initializePage(pageId);
        
        // Smooth scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize page-specific functionality
function initializePage(pageId) {
    switch(pageId) {
        case 'bmi':
            initializeBMIPage();
            break;
        case 'goals':
            initializeGoalsPage();
            break;
        case 'meals':
            initializeMealsPage();
            break;
        case 'workouts':
            initializeWorkoutsPage();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
        case 'health':
            initializeHealthHub();
            break;
        case 'community':
            initializeCommunity();
            break;
    }
}

// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    menu.classList.toggle('hidden');
}

// BMI Calculator Functions
function initializeBMIPage() {
    const form = document.getElementById('bmiForm');
    if (form) {
        form.addEventListener('submit', calculateBMI);
    }
}

function calculateBMI(e) {
    e.preventDefault();
    
    const height = parseFloat(document.getElementById('height').value) / 100; // Convert to meters
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const gender = document.getElementById('gender').value;
    const activityLevel = document.getElementById('activityLevel').value;
    
    // Calculate BMI
    const bmi = weight / (height * height);
    
    // Store user data
    appState.userData = {
        ...appState.userData,
        height: height * 100,
        weight: weight,
        age: age,
        gender: gender,
        activityLevel: activityLevel,
        bmi: bmi
    };
    
    // Display BMI result
    displayBMIResult(bmi);
    
    // Show continue button
    document.getElementById('continueToGoals').classList.remove('hidden');
}

function displayBMIResult(bmi) {
    const resultDiv = document.getElementById('bmiResult');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiMessage = document.getElementById('bmiMessage');
    
    bmiValue.textContent = bmi.toFixed(1);
    
    let category, message, color;
    if (bmi < 18.5) {
        category = 'Underweight';
        message = 'You may need to gain some weight for optimal health.';
        color = 'text-blue-600';
    } else if (bmi < 25) {
        category = 'Normal Weight';
        message = 'Great! You\'re in the healthy weight range.';
        color = 'text-green-600';
    } else if (bmi < 30) {
        category = 'Overweight';
        message = 'Consider a balanced diet and regular exercise.';
        color = 'text-yellow-600';
    } else {
        category = 'Obese';
        message = 'Consult with a healthcare provider for a personalized plan.';
        color = 'text-red-600';
    }
    
    bmiCategory.textContent = category;
    bmiCategory.className = `text-2xl font-bold ${color}`;
    bmiMessage.textContent = message;
    
    // Animate the result
    resultDiv.classList.remove('hidden');
    resultDiv.classList.add('animate-slide-up');
    
    // Update BMI meter
    updateBMIMeter(bmi);
}

function updateBMIMeter(bmi) {
    const meter = document.getElementById('bmiMeter');
    if (!meter) return;
    
    const percentage = Math.min((bmi / 40) * 100, 100);
    meter.style.width = `${percentage}%`;
    
    // Change color based on BMI
    if (bmi < 18.5) {
        meter.className = 'h-4 bg-blue-500 rounded-full transition-all duration-1000';
    } else if (bmi < 25) {
        meter.className = 'h-4 bg-green-500 rounded-full transition-all duration-1000';
    } else if (bmi < 30) {
        meter.className = 'h-4 bg-yellow-500 rounded-full transition-all duration-1000';
    } else {
        meter.className = 'h-4 bg-red-500 rounded-full transition-all duration-1000';
    }
}

// Goals Page Functions
function initializeGoalsPage() {
    const goalCards = document.querySelectorAll('.goal-card');
    goalCards.forEach(card => {
        card.addEventListener('click', function() {
            selectGoal(this.dataset.goal);
        });
    });
    
    const gymCheckbox = document.getElementById('gymExperience');
    if (gymCheckbox) {
        gymCheckbox.addEventListener('change', toggleProteinRecommendation);
    }
}

function selectGoal(goal) {
    // Remove previous selection
    document.querySelectorAll('.goal-card').forEach(card => {
        card.classList.remove('ring-4', 'ring-primary', 'bg-primary/10');
    });
    
    // Add selection to clicked card
    const selectedCard = document.querySelector(`[data-goal="${goal}"]`);
    selectedCard.classList.add('ring-4', 'ring-primary', 'bg-primary/10');
    
    // Store goal
    appState.userData.goal = goal;
    
    // Calculate daily calories and macros
    calculateNutritionPlan(goal);
    
    // Show results
    showGoalResults(goal);
}

function calculateNutritionPlan(goal) {
    const { weight, height, age, gender, activityLevel } = appState.userData;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Activity multiplier
    const activityMultipliers = {
        'sedentary': 1.2,
        'light': 1.375,
        'moderate': 1.55,
        'active': 1.725,
        'very-active': 1.9
    };
    
    const tdee = bmr * activityMultipliers[activityLevel];
    
    // Adjust calories based on goal
    let dailyCalories;
    switch(goal) {
        case 'cutting':
            dailyCalories = tdee - 500; // 500 calorie deficit
            break;
        case 'bulking':
            dailyCalories = tdee + 500; // 500 calorie surplus
            break;
        case 'maintenance':
            dailyCalories = tdee;
            break;
        default:
            dailyCalories = tdee;
    }
    
    // Calculate macros (40% protein, 40% carbs, 20% fat for cutting, adjusted for others)
    let proteinRatio, carbRatio, fatRatio;
    switch(goal) {
        case 'cutting':
            proteinRatio = 0.4; carbRatio = 0.4; fatRatio = 0.2;
            break;
        case 'bulking':
            proteinRatio = 0.3; carbRatio = 0.5; fatRatio = 0.2;
            break;
        default:
            proteinRatio = 0.3; carbRatio = 0.45; fatRatio = 0.25;
    }
    
    const macros = {
        protein: Math.round((dailyCalories * proteinRatio) / 4), // 4 calories per gram
        carbs: Math.round((dailyCalories * carbRatio) / 4),
        fat: Math.round((dailyCalories * fatRatio) / 9) // 9 calories per gram
    };
    
    appState.userData.dailyCalories = Math.round(dailyCalories);
    appState.userData.macros = macros;
}

function showGoalResults(goal) {
    const resultsDiv = document.getElementById('goalResults');
    const caloriesDisplay = document.getElementById('dailyCalories');
    const proteinDisplay = document.getElementById('proteinGrams');
    const carbsDisplay = document.getElementById('carbsGrams');
    const fatDisplay = document.getElementById('fatGrams');
    
    caloriesDisplay.textContent = appState.userData.dailyCalories;
    proteinDisplay.textContent = appState.userData.macros.protein;
    carbsDisplay.textContent = appState.userData.macros.carbs;
    fatDisplay.textContent = appState.userData.macros.fat;
    
    // Create pie chart
    createMacroChart();
    
    // Show results
    resultsDiv.classList.remove('hidden');
    resultsDiv.classList.add('animate-slide-up');
    
    // Show continue button
    document.getElementById('continueToMeals').classList.remove('hidden');
}

function createMacroChart() {
    const ctx = document.getElementById('macroChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Protein', 'Carbs', 'Fat'],
            datasets: [{
                data: [
                    appState.userData.macros.protein * 4,
                    appState.userData.macros.carbs * 4,
                    appState.userData.macros.fat * 9
                ],
                backgroundColor: ['#619FA3', '#8AB5B8', '#B8D4D6'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function toggleProteinRecommendation() {
    const checkbox = document.getElementById('gymExperience');
    const recommendation = document.getElementById('proteinRecommendation');
    
    appState.userData.gymExperience = checkbox.checked;
    
    if (checkbox.checked) {
        recommendation.classList.remove('hidden');
    } else {
        recommendation.classList.add('hidden');
    }
}

// Meal Planner Functions
function initializeMealsPage() {
    loadMeals();
    setupMealFilters();
}

function loadMeals() {
    // Sample Indonesian meal data
    appState.meals = [
        {
            id: 1,
            name: 'Nasi Merah dengan Ayam Bakar',
            category: 'lunch',
            calories: 450,
            protein: 35,
            carbs: 45,
            fat: 12,
            image: 'https://picsum.photos/seed/nasimerah/300/200.jpg',
            ingredients: ['Nasi merah 150g', 'Ayam bakar 100g', 'Sayur lodeh', 'Sambal'],
            instructions: 'Bakar ayam hingga matang, sajikan dengan nasi merah dan sayuran'
        },
        {
            id: 2,
            name: 'Tempe Tahu Bacem',
            category: 'dinner',
            calories: 380,
            protein: 25,
            carbs: 30,
            fat: 18,
            image: 'https://picsum.photos/seed/tempe/300/200.jpg',
            ingredients: ['Tempe 100g', 'Tahu 100g', 'Kecap manis', 'Gula merah'],
            instructions: 'Kukus tempe dan tahu, kemudian bacem dengan bumbu'
        },
        {
            id: 3,
            name: 'Smoothie Bowl Pisang',
            category: 'breakfast',
            calories: 320,
            protein: 12,
            carbs: 55,
            fat: 8,
            image: 'https://picsum.photos/seed/smoothie/300/200.jpg',
            ingredients: ['Pisang 2 buah', 'Yogurt Greek', 'Granola', 'Madu'],
            instructions: 'Blender pisang dengan yogurt, topping dengan granola'
        },
        {
            id: 4,
            name: 'Gado-Gado',
            category: 'lunch',
            calories: 420,
            protein: 18,
            carbs: 50,
            fat: 15,
            image: 'https://picsum.photos/seed/gadogado/300/200.jpg',
            ingredients: ['Sayuran campur', 'Tahu', 'Telur', 'Bumbu kacang'],
            instructions: 'Kukus sayuran, siram dengan bumbu kacang'
        },
        {
            id: 5,
            name: 'Soto Ayam',
            category: 'dinner',
            calories: 350,
            protein: 28,
            carbs: 25,
            fat: 14,
            image: 'https://picsum.photos/seed/soto/300/200.jpg',
            ingredients: ['Ayam 100g', 'Mie soun', 'Sayuran', 'Kuah soto'],
            instructions: 'Rebus ayam dengan bumbu, sajikan dengan mie dan sayuran'
        },
        {
            id: 6,
            name: 'Bubur Kacang Hijau',
            category: 'snacks',
            calories: 180,
            protein: 8,
            carbs: 35,
            fat: 2,
            image: 'https://picsum.photos/seed/bubur/300/200.jpg',
            ingredients: ['Kacang hijau 100g', 'Santan', 'Gula merah'],
            instructions: 'Rebus kacang hijau hingga empuk, tambah santan dan gula'
        }
    ];
    
    displayMeals('all');
}

function setupMealFilters() {
    const filterButtons = document.querySelectorAll('.meal-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
            
            // Add active class to clicked button
            this.classList.remove('bg-gray-200', 'text-gray-700');
            this.classList.add('bg-primary', 'text-white');
            
            // Filter meals
            displayMeals(this.dataset.category);
        });
    });
}

function displayMeals(category) {
    const container = document.getElementById('mealsContainer');
    if (!container) return;
    
    const filteredMeals = category === 'all' 
        ? appState.meals 
        : appState.meals.filter(meal => meal.category === category);
    
    container.innerHTML = filteredMeals.map(meal => `
        <div class="neumorphic rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            <img src="${meal.image}" alt="${meal.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${meal.name}</h3>
                <div class="flex justify-between text-sm text-gray-600 mb-4">
                    <span>${meal.calories} kcal</span>
                    <span>P: ${meal.protein}g</span>
                    <span>C: ${meal.carbs}g</span>
                    <span>F: ${meal.fat}g</span>
                </div>
                <button onclick="showMealRecipe(${meal.id})" class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    View Recipe
                </button>
            </div>
        </div>
    `).join('');
    
    updateMealSummary();
}

function showMealRecipe(mealId) {
    const meal = appState.meals.find(m => m.id === mealId);
    if (!meal) return;
    
    const modal = document.getElementById('recipeModal');
    const modalContent = document.getElementById('recipeContent');
    
    modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-gray-800">${meal.name}</h3>
            <button onclick="closeRecipeModal()" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <img src="${meal.image}" alt="${meal.name}" class="w-full h-48 object-cover rounded-lg mb-4">
        <div class="grid grid-cols-4 gap-4 mb-6">
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">${meal.calories}</div>
                <div class="text-sm text-gray-600">Calories</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">${meal.protein}g</div>
                <div class="text-sm text-gray-600">Protein</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">${meal.carbs}g</div>
                <div class="text-sm text-gray-600">Carbs</div>
            </div>
            <div class="text-center">
                <div class="text-2xl font-bold text-primary">${meal.fat}g</div>
                <div class="text-sm text-gray-600">Fat</div>
            </div>
        </div>
        <div class="mb-6">
            <h4 class="font-semibold text-lg mb-2">Ingredients:</h4>
            <ul class="list-disc list-inside text-gray-600">
                ${meal.ingredients.map(ing => `<li>${ing}</li>`).join('')}
            </ul>
        </div>
        <div>
            <h4 class="font-semibold text-lg mb-2">Instructions:</h4>
            <p class="text-gray-600">${meal.instructions}</p>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeRecipeModal() {
    document.getElementById('recipeModal').classList.add('hidden');
}

function updateMealSummary() {
    const totalCalories = document.getElementById('totalCalories');
    const totalProtein = document.getElementById('totalProtein');
    const totalCarbs = document.getElementById('totalCarbs');
    const totalFat = document.getElementById('totalFat');
    
    if (totalCalories) {
        totalCalories.textContent = appState.userData.dailyCalories;
        totalProtein.textContent = appState.userData.macros.protein;
        totalCarbs.textContent = appState.userData.macros.carbs;
        totalFat.textContent = appState.userData.macros.fat;
    }
}

// Workout Planner Functions
function initializeWorkoutsPage() {
    loadWorkouts();
    setupWorkoutFilters();
}

function loadWorkouts() {
    // Sample workout data
    appState.workouts = [
        {
            id: 1,
            name: 'Push Day - Upper Body',
            type: 'gym',
            difficulty: 'intermediate',
            duration: 45,
            calories: 300,
            goal: 'bulking',
            image: 'https://picsum.photos/seed/pushday/300/200.jpg',
            exercises: ['Bench Press 4x8', 'Shoulder Press 3x10', 'Triceps Pushdown 3x12', 'Cable Fly 3x15']
        },
        {
            id: 2,
            name: 'Pull Day - Back & Biceps',
            type: 'gym',
            difficulty: 'intermediate',
            duration: 45,
            calories: 280,
            goal: 'bulking',
            image: 'https://picsum.photos/seed/pullday/300/200.jpg',
            exercises: ['Pull-ups 3x8', 'Bent Over Row 4x10', 'Bicep Curls 3x12', 'Face Pulls 3x15']
        },
        {
            id: 3,
            name: 'Leg Day - Lower Body',
            type: 'gym',
            difficulty: 'advanced',
            duration: 60,
            calories: 400,
            goal: 'bulking',
            image: 'https://picsum.photos/seed/legday/300/200.jpg',
            exercises: ['Squats 4x8', 'Leg Press 3x12', 'Romanian Deadlift 3x10', 'Calf Raises 4x15']
        },
        {
            id: 4,
            name: 'HIIT Cardio',
            type: 'home',
            difficulty: 'beginner',
            duration: 20,
            calories: 200,
            goal: 'cutting',
            image: 'https://picsum.photos/seed/hiit/300/200.jpg',
            exercises: ['Jumping Jacks 30s', 'Burpees 30s', 'Mountain Climbers 30s', 'Rest 30s - Repeat 4x']
        },
        {
            id: 5,
            name: 'Yoga Flow',
            type: 'home',
            difficulty: 'beginner',
            duration: 30,
            calories: 120,
            goal: 'maintenance',
            image: 'https://picsum.photos/seed/yoga/300/200.jpg',
            exercises: ['Sun Salutation 5x', 'Warrior Poses', 'Tree Pose', 'Final Relaxation']
        },
        {
            id: 6,
            name: 'Home Circuit',
            type: 'home',
            difficulty: 'intermediate',
            duration: 25,
            calories: 180,
            goal: 'cutting',
            image: 'https://picsum.photos/seed/circuit/300/200.jpg',
            exercises: ['Push-ups 15', 'Bodyweight Squats 20', 'Plank 30s', 'Lunges 10 each - Repeat 3x']
        }
    ];
    
    displayWorkouts('all');
}

function setupWorkoutFilters() {
    const filterButtons = document.querySelectorAll('.workout-filter');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('bg-primary', 'text-white'));
            filterButtons.forEach(btn => btn.classList.add('bg-gray-200', 'text-gray-700'));
            
            // Add active class to clicked button
            this.classList.remove('bg-gray-200', 'text-gray-700');
            this.classList.add('bg-primary', 'text-white');
            
            // Filter workouts
            displayWorkouts(this.dataset.filter);
        });
    });
}

function displayWorkouts(filter) {
    const container = document.getElementById('workoutsContainer');
    if (!container) return;
    
    let filteredWorkouts = appState.workouts;
    
    // Apply filters based on user experience and goal
    if (appState.userData.gymExperience) {
        filteredWorkouts = filteredWorkouts.filter(w => w.type === 'gym');
    } else {
        filteredWorkouts = filteredWorkouts.filter(w => w.type === 'home');
    }
    
    if (filter !== 'all') {
        filteredWorkouts = filteredWorkouts.filter(w => 
            w.goal === filter || w.difficulty === filter || w.type === filter
        );
    }
    
    container.innerHTML = filteredWorkouts.map(workout => `
        <div class="neumorphic rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            <img src="${workout.image}" alt="${workout.name}" class="w-full h-48 object-cover">
            <div class="p-6">
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${workout.name}</h3>
                <div class="flex justify-between text-sm text-gray-600 mb-4">
                    <span>${workout.duration} min</span>
                    <span>${workout.calories} kcal</span>
                    <span class="capitalize">${workout.difficulty}</span>
                </div>
                <button onclick="startWorkout(${workout.id})" class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    Start Workout
                </button>
            </div>
        </div>
    `).join('');
    
    updateWorkoutProgress();
}

function startWorkout(workoutId) {
    const workout = appState.workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    const modal = document.getElementById('workoutModal');
    const modalContent = document.getElementById('workoutContent');
    
    modalContent.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <h3 class="text-2xl font-bold text-gray-800">${workout.name}</h3>
            <button onclick="closeWorkoutModal()" class="text-gray-500 hover:text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
        <div class="text-center mb-6">
            <div class="text-4xl font-bold text-primary mb-2" id="workoutTimer">00:00</div>
            <div class="text-gray-600">Duration: ${workout.duration} minutes</div>
        </div>
        <div class="mb-6">
            <h4 class="font-semibold text-lg mb-4">Exercises:</h4>
            <div class="space-y-3">
                ${workout.exercises.map((exercise, index) => `
                    <div class="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input type="checkbox" id="exercise-${index}" class="mr-3 w-5 h-5 text-primary">
                        <label for="exercise-${index}" class="flex-1 text-gray-700">${exercise}</label>
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="flex gap-4">
            <button onclick="startWorkoutTimer(${workout.duration})" class="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Start Timer
            </button>
            <button onclick="completeWorkout(${workoutId})" class="flex-1 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors">
                Complete Workout
            </button>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

function closeWorkoutModal() {
    document.getElementById('workoutModal').classList.add('hidden');
    if (workoutTimer) {
        clearInterval(workoutTimer);
    }
}

let workoutTimer;
function startWorkoutTimer(duration) {
    let timeLeft = duration * 60; // Convert to seconds
    const timerDisplay = document.getElementById('workoutTimer');
    
    if (workoutTimer) {
        clearInterval(workoutTimer);
    }
    
    workoutTimer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(workoutTimer);
            timerDisplay.textContent = 'Complete!';
        }
        
        timeLeft--;
    }, 1000);
}

function completeWorkout(workoutId) {
    const workout = appState.workouts.find(w => w.id === workoutId);
    if (!workout) return;
    
    // Update progress
    appState.progress.workouts++;
    appState.progress.calories.push({
        date: new Date().toISOString(),
        calories: workout.calories,
        type: 'workout'
    });
    
    closeWorkoutModal();
    
    // Show success message
    showNotification('Workout completed! Great job! 🎉');
}

function updateWorkoutProgress() {
    const progressElement = document.getElementById('workoutProgress');
    if (progressElement) {
        progressElement.textContent = `${appState.progress.workouts}/5 workouts completed`;
    }
}

// Dashboard Functions
function initializeDashboard() {
    updateDashboardStats();
    createProgressCharts();
}

function updateDashboardStats() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const streakElement = document.getElementById('streakCount');
    const bmiElement = document.getElementById('currentBMI');
    
    if (welcomeMessage) {
        welcomeMessage.textContent = 'Welcome back!';
    }
    
    if (streakElement) {
        streakElement.textContent = appState.progress.streak;
    }
    
    if (bmiElement) {
        bmiElement.textContent = appState.userData.bmi.toFixed(1);
    }
}

function createProgressCharts() {
    // BMI Trend Chart
    const bmiCtx = document.getElementById('bmiChart');
    if (bmiCtx) {
        new Chart(bmiCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'BMI Trend',
                    data: [28.5, 28.2, 27.8, 27.3],
                    borderColor: '#619FA3',
                    backgroundColor: 'rgba(97, 159, 163, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Calorie Chart
    const calorieCtx = document.getElementById('calorieChart');
    if (calorieCtx) {
        new Chart(calorieCtx, {
            type: 'bar',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Calories Consumed',
                    data: [2050, 1980, 2100, 1950, 2000, 2200, 2050],
                    backgroundColor: '#619FA3'
                }, {
                    label: 'Calories Burned',
                    data: [2200, 2100, 2300, 2000, 2150, 2400, 2200],
                    backgroundColor: '#8AB5B8'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Health Hub Functions
function initializeHealthHub() {
    loadHealthArticles();
    setupSearch();
}

function loadHealthArticles() {
    const articles = [
        {
            id: 1,
            title: 'Understanding Macronutrients',
            category: 'nutrition',
            description: 'Learn about proteins, carbs, and fats for optimal health.',
            image: 'https://picsum.photos/seed/macros/400/250.jpg',
            readTime: '5 min'
        },
        {
            id: 2,
            title: 'Beginner\'s Guide to Meal Prep',
            category: 'nutrition',
            description: 'Save time and eat healthy with these meal prep tips.',
            image: 'https://picsum.photos/seed/mealprep/400/250.jpg',
            readTime: '7 min'
        },
        {
            id: 3,
            title: 'Home Workouts for Beginners',
            category: 'workout',
            description: 'Effective exercises you can do at home with no equipment.',
            image: 'https://picsum.photos/seed/homeworkout/400/250.jpg',
            readTime: '6 min'
        },
        {
            id: 4,
            title: 'Mindful Eating Practices',
            category: 'mind',
            description: 'Develop a healthier relationship with food through mindfulness.',
            image: 'https://picsum.photos/seed/mindful/400/250.jpg',
            readTime: '4 min'
        },
        {
            id: 5,
            title: 'Sleep and Weight Management',
            category: 'lifestyle',
            description: 'How quality sleep affects your fitness journey.',
            image: 'https://picsum.photos/seed/sleep/400/250.jpg',
            readTime: '8 min'
        },
        {
            id: 6,
            title: 'Hydration for Performance',
            category: 'nutrition',
            description: 'Why water is crucial for your fitness goals.',
            image: 'https://picsum.photos/seed/hydration/400/250.jpg',
            readTime: '3 min'
        }
    ];
    
    displayArticles(articles);
}

function displayArticles(articles) {
    const container = document.getElementById('articlesContainer');
    if (!container) return;
    
    container.innerHTML = articles.map(article => `
        <div class="neumorphic rounded-2xl overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
            <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-primary font-medium capitalize">${article.category}</span>
                    <span class="text-sm text-gray-500">${article.readTime} read</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${article.title}</h3>
                <p class="text-gray-600 mb-4">${article.description}</p>
                <button class="text-primary font-medium hover:text-primary-dark transition-colors">
                    Read more →
                </button>
            </div>
        </div>
    `).join('');
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            // Implement search functionality
            console.log('Searching for:', query);
        });
    }
}

// Community Functions
function initializeCommunity() {
    loadInfluencers();
    loadChallenges();
}

function loadInfluencers() {
    const influencers = [
        {
            id: 1,
            name: 'Sarah Fitness',
            specialty: 'Weight Loss',
            followers: '125K',
            image: 'https://picsum.photos/seed/sarah/200/200.jpg',
            verified: true
        },
        {
            id: 2,
            name: 'Mike Nutrition',
            specialty: 'Healthy Eating',
            followers: '89K',
            image: 'https://picsum.photos/seed/mike/200/200.jpg',
            verified: true
        },
        {
            id: 3,
            name: 'Lisa Yoga',
            specialty: 'Mindfulness',
            followers: '67K',
            image: 'https://picsum.photos/seed/lisa/200/200.jpg',
            verified: false
        },
        {
            id: 4,
            name: 'John Strength',
            specialty: 'Muscle Building',
            followers: '103K',
            image: 'https://picsum.photos/seed/john/200/200.jpg',
            verified: true
        }
    ];
    
    displayInfluencers(influencers);
}

function displayInfluencers(influencers) {
    const container = document.getElementById('influencersContainer');
    if (!container) return;
    
    container.innerHTML = influencers.map(influencer => `
        <div class="neumorphic p-6 rounded-2xl text-center hover:transform hover:scale-105 transition-all duration-300">
            <div class="relative inline-block mb-4">
                <img src="${influencer.image}" alt="${influencer.name}" class="w-24 h-24 rounded-full mx-auto">
                ${influencer.verified ? '<div class="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center"><span class="text-white text-xs">✓</span></div>' : ''}
            </div>
            <h3 class="text-lg font-semibold text-gray-800">${influencer.name}</h3>
            <p class="text-sm text-gray-600 mb-2">${influencer.specialty}</p>
            <p class="text-sm text-primary font-medium">${influencer.followers} followers</p>
            <button class="mt-4 w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                Follow
            </button>
        </div>
    `).join('');
}

function loadChallenges() {
    const testimonials = [
        {
            name: 'Andi K.',
            text: 'I lost 3kg with the cutting plan!',
            avatar: 'https://picsum.photos/seed/andi/60/60.jpg'
        },
        {
            name: 'Maya S.',
            text: 'The meal plans changed my life!',
            avatar: 'https://picsum.photos/seed/maya/60/60.jpg'
        },
        {
            name: 'Budi R.',
            text: 'Finally achieved my fitness goals!',
            avatar: 'https://picsum.photos/seed/budi/60/60.jpg'
        }
    ];
    
    displayTestimonials(testimonials);
}

function displayTestimonials(testimonials) {
    const container = document.getElementById('testimonialsContainer');
    if (!container) return;
    
    container.innerHTML = testimonials.map(testimonial => `
        <div class="neumorphic p-6 rounded-2xl">
            <div class="flex items-center mb-4">
                <img src="${testimonial.avatar}" alt="${testimonial.name}" class="w-12 h-12 rounded-full mr-4">
                <div>
                    <h4 class="font-semibold text-gray-800">${testimonial.name}</h4>
                    <div class="flex text-yellow-400">
                        ★★★★★
                    </div>
                </div>
            </div>
            <p class="text-gray-600">"${testimonial.text}"</p>
        </div>
    `).join('');
}

// Utility Functions
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});

// Export functions for global access
window.showPage = showPage;
window.toggleMobileMenu = toggleMobileMenu;
window.calculateBMI = calculateBMI;
window.selectGoal = selectGoal;
window.showMealRecipe = showMealRecipe;
window.closeRecipeModal = closeRecipeModal;
window.startWorkout = startWorkout;
window.closeWorkoutModal = closeWorkoutModal;
window.startWorkoutTimer = startWorkoutTimer;
window.completeWorkout = completeWorkout;
window.toggleProteinRecommendation = toggleProteinRecommendation;
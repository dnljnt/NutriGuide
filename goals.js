document.addEventListener('DOMContentLoaded', () => {
    const goalCards = document.querySelectorAll('.goal-card');
    const goalResults = document.getElementById('goalResults');
    const dailyCalories = document.getElementById('dailyCalories');
    const proteinGrams = document.getElementById('proteinGrams');
    const carbsGrams = document.getElementById('carbsGrams');
    const fatGrams = document.getElementById('fatGrams');
    const gymExperience = document.getElementById('gymExperience');
    const proteinRecommendation = document.getElementById('proteinRecommendation');
    const continueToMeals = document.getElementById('continueToMeals');
    const bmiInfo = document.getElementById('bmiInfo');

    let chart;

    // Ambil data BMI dari localStorage
    const userBMI = JSON.parse(localStorage.getItem('userBMI'));
    let baseCalories = 2200; // default

    if (userBMI) {
        bmiInfo.innerHTML = `
            <p class="font-semibold text-gray-800">Your BMI: <strong>${userBMI.bmi}</strong></p>
            <p>Category: <strong>${userBMI.category}</strong></p>
            <p class="text-gray-600">${userBMI.message}</p>
        `;
        bmiInfo.classList.remove('hidden');

        switch (userBMI.category) {
            case "Underweight": baseCalories = 2500; break;
            case "Normal": baseCalories = 2200; break;
            case "Overweight": baseCalories = 2000; break;
            case "Obese": baseCalories = 1800; break;
        }
    }

    function calculateMacros(totalCalories, ratios) {
        const proteinCalories = totalCalories * ratios.protein;
        const carbCalories = totalCalories * ratios.carbs;
        const fatCalories = totalCalories * ratios.fat;
        return {
            protein: Math.round(proteinCalories / 4),
            carbs: Math.round(carbCalories / 4),
            fat: Math.round(fatCalories / 9)
        };
    }

    goalCards.forEach(card => {
        card.addEventListener('click', () => {
            const goal = card.dataset.goal;
            let totalCalories = baseCalories;
            let ratios;

            switch (goal) {
                case 'cutting':
                    ratios = { protein: 0.35, carbs: 0.40, fat: 0.25 };
                    break;
                case 'bulking':
                    ratios = { protein: 0.30, carbs: 0.50, fat: 0.20 };
                    break;
                case 'maintenance':
                    ratios = { protein: 0.30, carbs: 0.45, fat: 0.25 };
                    break;
            }

            const macros = calculateMacros(totalCalories, ratios);

            dailyCalories.textContent = totalCalories.toLocaleString();
            proteinGrams.textContent = macros.protein;
            carbsGrams.textContent = macros.carbs;
            fatGrams.textContent = macros.fat;

            goalResults.classList.remove('hidden');
            continueToMeals.classList.remove('hidden');
            proteinRecommendation.classList.add('hidden');
            goalResults.scrollIntoView({ behavior: 'smooth' });

            const ctx = document.getElementById('macroChart').getContext('2d');
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Protein', 'Carbs', 'Fat'],
                    datasets: [{
                        data: [macros.protein * 4, macros.carbs * 4, macros.fat * 9],
                        backgroundColor: ['#3B82F6', '#22C55E', '#EAB308'],
                        borderWidth: 2,
                    }]
                },
                options: {
                    plugins: { legend: { display: true, position: 'bottom' } },
                    cutout: '65%'
                }
            });
        });
    });

    gymExperience.addEventListener('change', () => {
        if (gymExperience.checked) proteinRecommendation.classList.remove('hidden');
        else proteinRecommendation.classList.add('hidden');
    });
});

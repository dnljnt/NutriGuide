document.addEventListener('DOMContentLoaded', () => {
    const bmiForm = document.getElementById('bmiForm');
    const bmiResult = document.getElementById('bmiResult');
    const bmiValue = document.getElementById('bmiValue');
    const bmiCategory = document.getElementById('bmiCategory');
    const bmiMessage = document.getElementById('bmiMessage');
    const bmiMeter = document.getElementById('bmiMeter');
    const continueToGoals = document.getElementById('continueToGoals');

    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const height = parseFloat(document.getElementById('height').value) / 100;
        const weight = parseFloat(document.getElementById('weight').value);

        if (!height || !weight) {
            alert("Please enter valid height and weight.");
            return;
        }

        const bmi = (weight / (height * height)).toFixed(1);
        let category = "";
        let message = "";
        let color = "";
        let meterWidth = 0;

        if (bmi < 18.5) {
            category = "Underweight";
            message = "You are below the normal weight range.";
            color = "bg-blue-500";
            meterWidth = (bmi / 35) * 100;
        } else if (bmi < 25) {
            category = "Normal";
            message = "You have a healthy body weight. Keep it up!";
            color = "bg-green-500";
            meterWidth = (bmi / 35) * 100;
        } else if (bmi < 30) {
            category = "Overweight";
            message = "You are slightly above the normal range. Try more physical activity.";
            color = "bg-yellow-500";
            meterWidth = (bmi / 35) * 100;
        } else {
            category = "Obese";
            message = "Your BMI indicates obesity. Consider a balanced diet and regular exercise.";
            color = "bg-red-500";
            meterWidth = 100;
        }

        // Tampilkan hasil
        bmiValue.textContent = bmi;
        bmiCategory.textContent = category;
        bmiMessage.textContent = message;

        bmiMeter.className = `h-full rounded-full transition-all duration-1000 ${color}`;
        bmiMeter.style.width = `${meterWidth}%`;

        bmiResult.classList.remove('hidden');
        continueToGoals.classList.remove('hidden');
        bmiResult.scrollIntoView({ behavior: "smooth" });

        // Simpan ke localStorage
        localStorage.setItem('userBMI', JSON.stringify({ bmi, category, message }));
    });
});

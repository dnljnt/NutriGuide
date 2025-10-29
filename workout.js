
document.addEventListener("DOMContentLoaded", () => {
    const workouts = [
        {
            name: "Full Body Beginner",
            type: "beginner",
            goal: "cutting",
            location: "home",
            duration: "30 min",
            calories: 200,
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470",
            description: "A simple full-body workout for beginners. No equipment needed!",
            exercises: [
                "Bodyweight Squats – 3x15",
                "Push Ups – 3x10",
                "Plank – 3x30s",
                "Lunges – 3x12 each leg"
            ]
        },
        {
            name: "Upper Body Strength",
            type: "intermediate",
            goal: "bulking",
            location: "gym",
            duration: "45 min",
            calories: 350,
            image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
            description: "Focus on building muscle mass and strength in upper body.",
            exercises: [
                "Bench Press – 4x10",
                "Pull Ups – 3x8",
                "Shoulder Press – 3x10",
                "Bicep Curls – 3x12"
            ]
        },
        {
            name: "HIIT Fat Burner",
            type: "intermediate",
            goal: "cutting",
            location: "home",
            duration: "25 min",
            calories: 300,
            image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba",
            description: "High-intensity cardio workout to burn fat fast.",
            exercises: [
                "Jumping Jacks – 1 min",
                "Burpees – 3x15",
                "Mountain Climbers – 3x30s",
                "High Knees – 3x40s"
            ]
        }
    ];

    const container = document.getElementById("workoutsContainer");
    const modal = document.getElementById("workoutModal");
    const modalContent = document.getElementById("workoutContent");

    // Render workouts
    function renderWorkouts(filter = "all") {
        container.innerHTML = "";

        const filtered = filter === "all" 
            ? workouts 
            : workouts.filter(w => 
                w.goal === filter ||
                w.type === filter ||
                w.location === filter
              );

        if (filtered.length === 0) {
            container.innerHTML = `<p class="text-center text-gray-500 col-span-full">No workouts found for "${filter}"</p>`;
            return;
        }

        filtered.forEach(workout => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer";
            card.innerHTML = `
                <img src="${workout.image}" alt="${workout.name}" class="w-full h-48 object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2 text-gray-800">${workout.name}</h3>
                    <p class="text-gray-600 mb-2">${workout.duration} • ${workout.calories} kcal</p>
                    <p class="text-gray-500 text-sm mb-4">${workout.description}</p>
                    <button class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition">View Details</button>
                </div>
            `;
            card.querySelector("button").addEventListener("click", () => showWorkout(workout));
            container.appendChild(card);
        });
    }

    // Show modal details
    function showWorkout(workout) {
        modalContent.innerHTML = `
            <h2 class="text-2xl font-bold mb-2 text-gray-800">${workout.name}</h2>
            <img src="${workout.image}" class="w-full h-56 object-cover rounded-xl mb-4">
            <p class="text-gray-600 mb-2"><strong>Duration:</strong> ${workout.duration}</p>
            <p class="text-gray-600 mb-2"><strong>Calories:</strong> ${workout.calories} kcal</p>
            <p class="text-gray-700 mb-4">${workout.description}</p>
            <h3 class="font-semibold text-lg mb-2 text-gray-800">Exercises</h3>
            <ul class="list-disc list-inside text-gray-700 mb-6">
                ${workout.exercises.map(ex => `<li>${ex}</li>`).join("")}
            </ul>
            <button id="closeModal" class="w-full bg-primary text-white py-3 rounded-xl hover:bg-primary-dark">Close</button>
        `;
        modal.classList.remove("hidden");
        document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
    }

    // Filter buttons
    document.querySelectorAll(".workout-filter").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".workout-filter").forEach(b => b.classList.remove("bg-primary", "text-white"));
            btn.classList.add("bg-primary", "text-white");
            renderWorkouts(btn.dataset.filter);
        });
    });

    // Click outside modal to close
    modal.addEventListener("click", e => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    renderWorkouts();
});
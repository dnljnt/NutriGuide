
document.addEventListener("DOMContentLoaded", () => {
    const influencers = [
        {
            name: "Sarah Fit",
            field: "Certified Nutritionist",
            followers: "120K",
            image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
            quote: "Healthy eating is not about restriction — it's about balance."
        },
        {
            name: "Yoga with Raka",
            field: "Yoga Instructor",
            followers: "85K",
            image: "https://images.unsplash.com/photo-1552058544-f2b08422138a",
            quote: "Breathe. Move. Nourish your body and mind every day."
        },
        {
            name: "Chef Dina",
            field: "Healthy Food Creator",
            followers: "102K",
            image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f",
            quote: "Local ingredients, global flavors — healthy can be delicious!"
        },
        {
            name: "Coach Andra",
            field: "Fitness Coach",
            followers: "140K",
            image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1",
            quote: "Discipline builds results — even small daily progress matters."
        }
    ];

    const testimonials = [
        {
            name: "Rina A.",
            text: "NutriGuide helped me lose 5kg and improve my energy levels. The community support is amazing!",
            avatar: "https://picsum.photos/seed/tes1/60/60.jpg"
        },
        {
            name: "Budi P.",
            text: "I learned so much from the weekly live sessions. It’s like having a personal coach every day!",
            avatar: "https://picsum.photos/seed/tes2/60/60.jpg"
        },
        {
            name: "Lina M.",
            text: "The meal plans fit perfectly with Indonesian flavors. Super easy to follow!",
            avatar: "https://picsum.photos/seed/tes3/60/60.jpg"
        }
    ];

    const influencerContainer = document.getElementById("influencersContainer");
    const testimonialContainer = document.getElementById("testimonialsContainer");

    // Render influencers
    influencers.forEach(i => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1";
        card.innerHTML = `
            <img src="${i.image}" alt="${i.name}" class="w-full h-56 object-cover">
            <div class="p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-800 mb-1">${i.name}</h3>
                <p class="text-sm text-gray-500 mb-2">${i.field}</p>
                <p class="text-sm text-gray-400 mb-4">${i.followers} followers</p>
                <blockquote class="italic text-gray-600 text-sm mb-4">"${i.quote}"</blockquote>
                <button class="bg-primary text-white py-2 px-4 rounded-full font-semibold hover:bg-primary-dark transition">Follow</button>
            </div>
        `;
        influencerContainer.appendChild(card);
    });

    // Render testimonials
    testimonials.forEach(t => {
        const card = document.createElement("div");
        card.className = "bg-gray-50 p-4 rounded-xl flex space-x-3 hover:bg-gray-100 transition";
        card.innerHTML = `
            <img src="${t.avatar}" alt="${t.name}" class="w-10 h-10 rounded-full">
            <div>
                <h4 class="font-semibold text-gray-800 text-sm">${t.name}</h4>
                <p class="text-gray-600 text-sm">${t.text}</p>
            </div>
        `;
        testimonialContainer.appendChild(card);
    });
});
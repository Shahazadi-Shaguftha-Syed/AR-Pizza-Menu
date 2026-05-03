const dishData = [
  {
    id: "pizza-1",
    dish_name: "Margherita Pizza",
    marker_pattern_url: "assets/dish-markers/pattern-pizza.patt",
    model_url: "assets/pizza/scene.gltf",
    ingredients: [
      "Tomato Sauce",
      "Mozzarella Cheese",
      "Fresh Basil",
      "Olive Oil"
    ],
    model_geometry: {
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 0.05, y: 0.05, z: 0.05 }
    },
    price: 12.99
  }
];

async function fetchDishes() {
  try {
    const snap = await firebase.firestore().collection("dishes").get();
    if (snap.empty) {
      console.log("No dishes found in Firebase, using fallback data.");
      return dishData;
    }
    return snap.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Firebase error:", error);
    return dishData;
  }
}

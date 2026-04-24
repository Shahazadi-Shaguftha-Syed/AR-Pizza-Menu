AFRAME.registerComponent("create-markers", {
  
  init: async function() {
    var mainScene = document.querySelector("#main-scene");

    // Get the dishes collection
    var dishes = await this.getDishes();
   
    dishes.map(dish => {
      var marker = document.createElement("a-marker");   
      marker.setAttribute("id", dish.id);
      marker.setAttribute("type", "pattern");
      marker.setAttribute("url", dish.marker_pattern_url);
      marker.setAttribute("cursor", {
        rayOrigin: "mouse"
      });

      // Set the markerhandler component
      marker.setAttribute("markerhandler", {});
      mainScene.appendChild(marker);

      // Adding 3D model to scene
      var model = document.createElement("a-entity");    
      model.setAttribute("id", `model-${dish.id}`);
      model.setAttribute("position", dish.model_geometry.position);
      model.setAttribute("rotation", dish.model_geometry.rotation);
      model.setAttribute("scale", dish.model_geometry.scale);
      model.setAttribute("gltf-model", `url(${dish.model_url})`);
      model.setAttribute("gesture-handler", {});
      model.setAttribute("visible", false);
      marker.appendChild(model);

      // Glass Container for Details
      var mainPlane = document.createElement("a-plane");
      mainPlane.setAttribute("id", `main-plane-${dish.id}`);
      mainPlane.setAttribute("position", { x: 2.1, y: 0, z: 0 }); 
      mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 }); 
      mainPlane.setAttribute("width", 2.2);
      mainPlane.setAttribute("height", 2.5);
      mainPlane.setAttribute("material", {
        color: "#ffffff",
        opacity: 0.2,
        transparent: true,
        shader: "flat"
      });
      mainPlane.setAttribute("visible", false);
      marker.appendChild(mainPlane);


      // Dish title background
      var titlePlane = document.createElement("a-plane");
      titlePlane.setAttribute("id", `title-plane-${dish.id}`);
      titlePlane.setAttribute("position", { x: 0, y: 1.1, z: 0.05 }); // Moved up
      titlePlane.setAttribute("width", 2.3);
      titlePlane.setAttribute("height", 0.4);
      titlePlane.setAttribute("material", { color: "#ff4d4d" });
      mainPlane.appendChild(titlePlane);

      // Dish title
      var dishTitle = document.createElement("a-entity");
      dishTitle.setAttribute("id", `dish-title-${dish.id}`);
      dishTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
      dishTitle.setAttribute("text", {
        font: "exo2bold",
        color: "white",
        width: 2.2,
        align: "center",
        value: dish.dish_name.toUpperCase()
      });
      titlePlane.appendChild(dishTitle);

      // Ingredients List
      var ingredients = document.createElement("a-entity");
      ingredients.setAttribute("id", `ingredients-${dish.id}`);
      ingredients.setAttribute("position", { x: 0.1, y: 0, z: 0.1 });
      ingredients.setAttribute("text", {
        font: "dejavu",
        color: "white",
        width: 1.8,
        align: "left",
        value: `INGREDIENTS:\n\n${dish.ingredients.join("\n")}`
      });
      mainPlane.appendChild(ingredients);

      // Price
      var price = document.createElement("a-entity");
      price.setAttribute("id", `price-${dish.id}`);
      price.setAttribute("position", { x: 0.1, y: -0.7, z: 0.1 });
      price.setAttribute("text", {
        font: "exo2bold",
        color: "white",
        width: 2.5,
        align: "left",
        value: `$${dish.price || "10.00"}`
      });
      mainPlane.appendChild(price);
    });
  },

  getDishes: async function() {
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
});


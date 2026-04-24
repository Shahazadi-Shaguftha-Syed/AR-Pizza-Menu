AFRAME.registerComponent("markerhandler", {
  init: async function () {
    // Get the dishes collection
    var dishes = await this.getDishes();

    // markerFound event
    this.el.addEventListener("markerFound", () => {
      var markerId = this.el.id;      
      this.handleMarkerFound(dishes, markerId);
    });

    // markerLost event
    this.el.addEventListener("markerLost", () => {
      this.handleMarkerLost();
    });
  },

  handleMarkerFound: function (dishes, markerId) {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "flex";

    var ratingButton = document.getElementById("rating-button");
    var orderButtton = document.getElementById("order-button");

    // Handling Click Events
    ratingButton.onclick = () => {
      Swal.fire({
        title: 'Rate this Dish',
        html: `
          <div class="rating-stars">
            <span class="star" data-value="5">★</span>
            <span class="star" data-value="4">★</span>
            <span class="star" data-value="3">★</span>
            <span class="star" data-value="2">★</span>
            <span class="star" data-value="1">★</span>
          </div>
          <p class="rating-desc">How was your Margherita Pizza experience?</p>
        `,
        showConfirmButton: false,
        background: '#1e1e1e',
        color: '#fff',
        didOpen: () => {
          const stars = document.querySelectorAll('.star');
          stars.forEach(star => {
            star.addEventListener('click', (e) => {
              const val = e.target.getAttribute('data-value');
              Swal.fire({
                icon: 'success',
                title: 'Thank you!',
                text: `You rated this dish ${val} stars!`,
                background: '#1e1e1e',
                color: '#fff',
                timer: 2000,
                showConfirmButton: false
              });
            });
          });
        }
      });
    };

    orderButtton.onclick = () => {
      Swal.fire({
        icon: 'success',
        title: 'Order Placed!',
        text: 'Your pizza is being prepared in the kitchen.',
        background: '#1e1e1e',
        color: '#fff',
        timer: 3000,
        showConfirmButton: false
      });
    };

    // Changing Model scale and visibility
    var dish = dishes.filter(dish => dish.id === markerId)[0];

    var model = document.querySelector(`#model-${dish.id}`);
    model.setAttribute("position", dish.model_geometry.position);
    model.setAttribute("rotation", dish.model_geometry.rotation);
    model.setAttribute("scale", dish.model_geometry.scale);
    model.setAttribute("visible", true);

    var mainPlane = document.querySelector(`#main-plane-${dish.id}`);
    mainPlane.setAttribute("visible", true);
  },

  handleMarkerLost: function () {
    // Changing button div visibility
    var buttonDiv = document.getElementById("button-div");
    buttonDiv.style.display = "none";
  },

  getDishes: async function () {
    try {
      const snap = await firebase.firestore().collection("dishes").get();
      if (snap.empty) {
        return dishData;
      }
      return snap.docs.map(doc => doc.data());
    } catch (error) {
      console.error("Firebase error in handler:", error);
      return dishData;
    }
  }
});


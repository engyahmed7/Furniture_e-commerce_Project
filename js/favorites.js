import { fetchData } from "../js/fetchData.js";
import auth from "./auth.js";

function findProductById(id, ...productArrays) {
  for (const products of productArrays) {
    const foundProduct = products.find((product) => product.id === id);
    if (foundProduct) {
      return foundProduct;
    }
  }
  return null;
}

export async function addedToFavourite(prodId) {
  if (!auth("/pages/signinSignup.html")) {
    return;
  }
  try {
    const id = parseInt(prodId);

    const data = await fetchData();
    //   const featuredProducts = data.featuredProduct;
    //   const fetchedProducts =  data.products;

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const isFavorite = favorites.some((product) => product.id === id);

    if (isFavorite) {
      favorites = favorites.filter((product) => product.id !== id);
    } else {
      //   const favProductForData = featuredProducts.find((product) => product.id === id);
      //   const favProductForFetchedData = fetchedProducts.find((product) => product.id === id);
      let product = findProductById(
        id,
        data.featuredProduct,
        data.products,
        data["new-arrivals"],
        data["best-seller"],
        data["most-view"],
        data["discounts"]
      );
      //   if (favProductForData) {
      //       favorites.push(favProductForData);
      //   } else if (favProductForFetchedData) {
      //       favorites.push(favProductForFetchedData);
      //   } else {
      //       console.log('Product not found');
      //       return;
      //   }

      if (product) {
        favorites.push(product);
      } else {
        console.log("Product not found");
        return;
      }
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));

    const icon = document.querySelector(`.addToFav[data-id="${id}"]`);
    if (icon) {
      if (isFavorite) {
        icon.classList.remove("fav-btn-active");
        displayFav();
      } else {
        icon.classList.add("fav-btn-active");
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function getFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  return favorites;
}

export function displayFav() {
  if (!auth("/pages/signinSignup.html")) {
    return;
  }
  const favoritesProd = getFavorites();
  let result = "";
  const favProducts = document.getElementById("favItems");
  if (favoritesProd.length === 0) {
    result += `<h1 class="text-center mt-5">No Favorite Items</h1>`;
  }
  favoritesProd.forEach((product) => {
    const isFavorite = favoritesProd.some(
      (favorite) => favorite.id === product.id
    );
    const favIconClass = isFavorite ? "fav-btn-active" : "";

    result += `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card card-home h-100">
                    <img src="../images/${product.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${product.productName}</h5>
                        <p class="card-text">${product.price}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
                            <i class="fa-solid fa-heart-circle-plus addToFav ${favIconClass}" aria-hidden="true" data-id="${product.id}"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
  });

  favProducts.innerHTML = result;
}

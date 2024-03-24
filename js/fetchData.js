import { displayProducts, initializeCarousel } from "./carousel.js";

export async function fetchData() {
  const response = await fetch("../data/data.json");
  const data = await response.json();
  return data;
}

export async function fetchAndDisplayProducts() {
  try {
    const fetchedData = await fetchData();
    displayProducts(fetchedData.featuredProduct);
    initializeCarousel();
  } catch (error) {
    console.error("Error fetching or displaying products:", error);
  }
}

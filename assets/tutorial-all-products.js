class AllProducts extends HTMLElement {
  index = 0;
  constructor() {
    super();
    //definitions
    this.loadMoreButton = this.querySelector("button");
    this.productsPerRow = Number(this.dataset.productsPerRow);
    this.remainingProducts = this.dataset.remainingProducts.split(",");
    this.grid = this.querySelector(".grid");
    //end of definitions
    this.loadMoreButton.addEventListener(
      "click",
      this.loadMoreProducts.bind(this)
    );
  }
  async loadMoreProducts() {
    this.loadMoreButton.setAttribute("disabled", "true"); //prevent multiple clicks
    const productsToLoad = this.remainingProducts.slice(
      this.index,
      this.index + this.productsPerRow
    );

    //fetch products...
    const products = await Promise.all(
      productsToLoad.map(async (productHandle) => {
        const response = await fetch(
          `/products/${productHandle}?sections=card-product`
        );
        const data = await response.json();
        //console.log("data: ", data);
        return data["card-product"];
      })
    );
    //render products...
    products.forEach((product) => {
      this.grid.innerHTML += product;
    });

    //update index
    this.index += this.productsPerRow;

    //hide button if no more products to load
    if (this.index >= this.remainingProducts.length) {
      this.loadMoreButton.remove();
    } else {
      this.loadMoreButton.removeAttribute("disabled");
    }
  }
}
customElements.define("all-products", AllProducts);

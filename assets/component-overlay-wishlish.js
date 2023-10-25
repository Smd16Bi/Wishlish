document.addEventListener("DOMContentLoaded", function () {
  class WishItem {
    constructor(container, obj) {
      this.container = container;
      this.obj = obj;
      this.item = document.createElement("div");
      this.title = document.createElement("h2");
      this.img = document.createElement("img");
      this.wrap = document.createElement("a");
      this.remove = document.createElement("button");

      this.wrap.href = this.obj.link;
      this.title.innerHTML = `<span>${this.obj.title}</spna>`;
      this.img.src = this.obj.featured_image;
      this.remove.innerHTML = "Remove";
      this.remove.setAttribute("data-id-product", this.obj.id);


      this.remove.addEventListener("click", this.delete.bind(this))

      this.item.classList.add("wishlish-item");
      this.title.classList.add("wishlish-item__title");
      this.wrap.classList.add("wishlish-item__image");
      this.remove.classList.add("wishlish-item__remove");

      this.wrap.append(this.img);
      this.item.append(this.wrap);
      this.title.append(this.remove);
      this.item.append(this.title);

      this.container.append(this.item);
    }

    delete(event) {
      const currentId = this.remove.getAttribute("data-id-product");
      const localObj = wishlistApp.getLocalStore();
      const removeItem = localObj.filter(el => Number(el.id) !== Number(currentId));
      wishlistApp.setLocalStore(removeItem);
      wishlistApp.renderItem();
      wishlistApp.productSnippet?.classList.remove("is-added");
    }
  }


  class Wishlist {
    static counterItem = 0;
    constructor(container) {
      this.container = container;
      this.iconClose = this.container.querySelector(".icon-close");
      this.header = this.container.querySelector(".wishlish-header");
      this.empty = this.container.querySelector(".wishlish-empty");
      this.main = this.container.querySelector(".wishlish-main");
      this.footer = this.container.querySelector(".wishlish-footer");
      this.overlay = this.container.querySelector(".wishlish-overlay");

      this.iconHeaderSnippet = document.querySelector(".header--wishlist-snipet");
      this.productSnippet = document.querySelector(".form-wishlist");
      this.iconSnippet = document.querySelectorAll(".wishlist-icon-btn");

      this.checkIsEmpty();
      this.createLocalStore();

      this.iconHeaderSnippet.addEventListener("click", this.open.bind(this));
      this.iconClose.addEventListener("click", this.close.bind(this));
      this.overlay.addEventListener("click", this.close.bind(this));


      if (this.productSnippet) {
        this.checkIsAdded();
        this.productSnippet.querySelector(".btn-wishlist").addEventListener("click", this.changeItem.bind(this));
      }

      if (this.iconSnippet.length != 0) {
        this.iconSnippet.forEach((btn, index) => {
          this.checkIsAdded(btn)
          btn.addEventListener("click", this.changeItem.bind(this));
        })
      }

      this.renderItem();
    }


    open() {
      this.container.classList.add("is-active");
      document.body.classList.add("overflow-hidden");
    }

    close() {
      this.container.classList.remove("is-active");
      document.body.classList.remove("overflow-hidden");
    }

    changeItem(event) {
      const target = event.target;
      const isIconSnipet = target.classList.contains("_wishlist-icon-btn");
      const currentIconWishlist = isIconSnipet ? target : this.productSnippet;

      const jsonObj = JSON.parse(
        isIconSnipet
          ? target.querySelector("[data-json-product]").innerHTML
          : this.productSnippet.querySelector("#product-wishlish").innerHTML
      );

      const { featured_image, title, id, link } = jsonObj;
      const item = {
        featured_image,
        title,
        id,
        link
      }

      const localObj = this.getLocalStore();
      const isAdd = localObj.some(el => Number(el.id) === Number(id));
      if (!isAdd) {
        const newItem = [...localObj, item];
        this.setLocalStore(newItem);
        this.open();
      } else {
        const removeItem = localObj.filter(el => Number(el.id) !== Number(id));
        this.setLocalStore(removeItem);
      };

      currentIconWishlist.classList.toggle("is-added", !isAdd);

      this.checkIsEmpty();
      this.renderItem();
    }

    checkIsEmpty() {
      Wishlist.counterItem = this.getLocalStore()?.length;
      const isEmpty = Wishlist.counterItem === 0 ? false : true;
      this.empty.classList.toggle("is-hide", isEmpty);
      this.main.classList.toggle("is-hide", !isEmpty);
      this.footer.classList.toggle("is-hide", !isEmpty);
      this.iconHeaderSnippet?.classList.toggle("is-fill", isEmpty)
    }


    checkIsAdded(btn) {
      const isIconSnipet = btn ? true : false;
      const currentIconWishlist = isIconSnipet ? btn : this.productSnippet;
      const { id } = JSON.parse(
        isIconSnipet
          ? btn.querySelector("[data-json-product]").innerHTML
          : this.productSnippet.querySelector("#product-wishlish").innerHTML
      );

      const currentLocal = this.getLocalStore();
      const isAdd = currentLocal.some(el => Number(el.id) === Number(id));
      currentIconWishlist.classList.toggle("is-added", isAdd);
    }


    createLocalStore() {
      if (localStorage.getItem("wislistapp")) return;
      localStorage.setItem("wislistapp", '[]')
    }

    getLocalStore() {
      if (!localStorage.getItem("wislistapp")) return;
      return JSON.parse(localStorage.getItem("wislistapp"));
    }

    setLocalStore(value) {
      if (!localStorage.getItem("wislistapp")) return;
      localStorage.setItem("wislistapp", JSON.stringify(value));
    }

    renderItem() {
      if (!localStorage.getItem("wislistapp")) return;
      const currentLocal = this.getLocalStore();
      const bodyApp = this.container.querySelector(".wishlish-main");
      bodyApp.innerHTML = "";
      for (const item of currentLocal) {
        let newItem = new WishItem(bodyApp, item);
      }

      this.checkIsEmpty();
    }

  }
  const appWish = document.querySelector(".wishlish");
  const wishlistApp = new Wishlist(appWish);
  window.wishlistApp = wishlistApp;


})
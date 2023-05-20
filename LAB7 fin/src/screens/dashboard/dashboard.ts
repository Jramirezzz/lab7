import { Product } from "../../types/product";
import Firebase from "../../utils/firebase";
import { appState, addObserver, dispatch } from "../../store";
import { navigate } from "../../store/actions";
import { setUserCredentials } from "../../store/actions";
import { Screens } from "../../types/navigation";

const formData: Omit<Product, "id"> = {
  name: "",
  price: 0,
  createdAt: "",
};

export default class main extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    addObserver(this);
  }

  connectedCallback() {
    this.render();
  }

  validateLogin(){
    console.log(appState.user);
    if(appState.user !== ''){
      Firebase.addProduct(formData);
    } else {
      dispatch(navigate(Screens.REGISTER));
    }
    
  }

  logOut(){
    if(appState.user !== null || ''){
      dispatch(setUserCredentials(''))
    }
    
  }
  
  changeName(e: any) {
    formData.name = e?.target?.value;
  }

  changePrice(e: any) {
    formData.price = Number(e?.target?.value);
  }

  async render() {

    const logout = this.ownerDocument.createElement("button");
    logout.innerText = "Log Out";
    logout.addEventListener("click", this.logOut)
    logout.addEventListener("click", ()=>{
        dispatch(navigate(Screens.REGISTER))
    })
    this.shadowRoot?.appendChild(logout);

    const text = this.ownerDocument.createElement("h1");
    text.innerText = "Añadir";
    this.shadowRoot?.appendChild(text);

    const Name = this.ownerDocument.createElement("input");
    Name.placeholder = "producto";
    Name.addEventListener("change", this.changeName);
    this.shadowRoot?.appendChild(Name);

    const Price = this.ownerDocument.createElement("input");
    Price.placeholder = "prices";
    Price.addEventListener("change", this.changePrice);
    this.shadowRoot?.appendChild(Price);

    const boton = this.ownerDocument.createElement("button");
    boton.innerText = "New Products";
    boton.addEventListener("click", this.validateLogin)
    this.shadowRoot?.appendChild(boton);

    const productsList = this.ownerDocument.createElement("section");
    this.shadowRoot?.appendChild(productsList);
    
    Firebase.getProductsListener((products) => {
      const oldOnesIds: String[] = [];
      productsList.childNodes.forEach((i) => {
        if (i instanceof HTMLElement) oldOnesIds.push(i.dataset.pid || "");
      });
      const newOnes = products.filter((prod) => !oldOnesIds.includes(prod.id));

      newOnes.forEach((a: Product) => {
        const container = this.ownerDocument.createElement("section");
        container.setAttribute("data-pid", a.id);
        const name = this.ownerDocument.createElement("h3");
        name.innerText = a.name;
        container.appendChild(name);

        const prices = this.ownerDocument.createElement("h3");
        prices.innerText = String(a.price);
        container.appendChild(prices);

        productsList.prepend(container);
      });

    });
  }
}

customElements.define("my-dashboard", Dashboard);

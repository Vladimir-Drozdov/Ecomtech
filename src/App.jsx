import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const BASE = import.meta.env.BASE_URL;
  //Получаем продукты через fetch запрос
  useEffect(() => {
    fetch(BASE + "/products.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Ошибка загрузки товаров", err));
  }, []);
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(normalizedSearch)
  );

  
  // Закрытие модалки по Esc
  useEffect(() => {
    if (!selectedProduct) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSelectedProduct(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [selectedProduct]);

  // Закрытие модалки по клику вне окна
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal")) {
      setSelectedProduct(null);
    }
  };
  return (
    <div className="App">
      <h1>Магазин гаджетов</h1>

      <input
        type="text"
        placeholder="Поиск товара"
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => setSelectedProduct(product)}
          >
            <div className="product-image">
              <img src={BASE + product.image} alt={product.title} />
            </div>
            <h2>{product.title}</h2>
            <div className="product-footer">
              <p>{product.price} &#8381;</p>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <button className="close-button" onClick={() => setSelectedProduct(null)}>&#10005;</button>
            <div className="modal-image">
              <img src={BASE + selectedProduct.image} alt={selectedProduct.title} />
            </div>
            <h2>{selectedProduct.title}</h2>
            <p className="modal-description">{selectedProduct.description}</p>
            <p className="modal-price">{selectedProduct.price} ₽</p>
            <button className="buy-button">Купить</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

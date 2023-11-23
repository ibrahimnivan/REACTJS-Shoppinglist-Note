import { useState } from "react";

const groceryItems = [
  {
    id: 1,
    name: "ground coffee",
    quantity: 2,
    checked: true,
  },
  {
    id: 2,
    name: "granulated sugar",
    quantity: 5,
    checked: false,
  },
  {
    id: 3,
    name: "mineral water",
    quantity: 3,
    checked: false,
  },
];

export default function App() {
  const [items, setItems] = useState(groceryItems);

  function handleAddItem(newItem) { // sebuah fg yg dijalankan untuk custom event onAddItem saat onSubmit
    setItems([...items, newItem]); // melakukan immutability
  }

  function handleDeleteItem(id) {
      setItems((items) => items.filter((item) => item.id !== id)) //dijalankan ketika tombol x di item diClick
  }

  function handleToggleItem(id) { // mengenerate semua items, item.id yg diclick (onChange) akan dibikin object yg sama tp dirubah nilai checkednya
    setItems((items) => items.map((item) => (item.id === id ? {...item, checked: !item.checked } :  item)));
  }

  function handleClearItems() {
    setItems([]);
  }

  return (
    <>
      <div className="app">
        <Header />
        <Form onAddItem={handleAddItem} />
        <GroceryList items={items} onDeleteItem={handleDeleteItem} onToggleItem={handleToggleItem} onClearItems={handleClearItems} />
        <Footer items={items} />
      </div>
    </>
  );
}

function Header() {
  return <h1>My shopping list 📝</h1>;
}

function Form({onAddItem}) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) { //fg yg dijalankan saat submit
    e.preventDefault();
    
    if(!name) return; // guard clause // kl kosong ngga ngelakuin apapun

    const newItem = { name, quantity, checked: false, id: Date.now()}; // name, quantity property & value namanya sama // ini setiap ada submit  // akan ditaro di List belanja
    onAddItem(newItem); // nweItem dimasukan ke event

    setName(''); // setelah submit jd kosong lagi
    setQuantity(1) // setelah submit jadi 1 lagi
  }


  const quantityNum = [...Array(20)].map((_, i) => ( //sumber index yg akan dipake sbg value option
    <option value={i + 1} key={i + 1} >
      {i + 1}
    </option>
  ));

  return ( //onSubmit bisa pake Enter onClick ngga bisa
            //e = object event berisi informasi tentang pepristiwa
    <form className="add-form" onSubmit={handleSubmit}> 
      <h3>What are we shopping for today?</h3>
      <div>
        <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {quantityNum}
        </select>
        <input type="text" placeholder="name of the item..." value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button>Add</button>
    </form>
  );
}

function GroceryList({items, onDeleteItem, onToggleItem, onClearItems}) {
  const [sortBy, setSortBy] = useState('input'); // state ngga perlu di App karna ngga diperluin komponen lain

  let sortedItems;

  switch(sortBy) {
    case 'name' :
      sortedItems = items.slice().sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'checked' :
      sortedItems = items.slice().sort((a, b) => a.checked - b.checked); // a = false
      break;
    default :
      sortedItems = items;
      break;
  }


  return (
    <>
      <div className="list">
        <ul>
          {sortedItems.map((item) => (
            <Item item={item} key={item.id} onDeleteItem={onDeleteItem} onToggleItem={onToggleItem} />
          ))}
        </ul>
      </div>
      <div className="actions">
        <label htmlFor="" id="sortby">Sort By</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}> 
          <option value="input">Input order</option>
          <option value="name">Name of item</option>
          <option value="checked">Checklist</option>
        </select>
        <button onClick={onClearItems}>Clean Up</button>
      </div>
    </>
  );
}

function Item({item, onDeleteItem, onToggleItem}) {
  return (
    <li key={item.id}>
      {/* checked = attribut bawaan dari input */}
      <input type="checkbox" checked={item.checked} onChange={() => onToggleItem(item.id)} />
      {/* kasih style jika itme.checked = true */}
      <span style={item.checked ? { textDecoration: "line-through" } : {}}> 
        {item.quantity} {item.name}
      </span>
      {/* trigger untuk menghapus item */}
      <button onClick={() => onDeleteItem(item.id)}>&times;</button> 
    </li>
  );
}

function Footer({ items }) {
  if(items.length === 0) return <footer className="stats">Shopping list is still empty</footer>;


  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;
  const percentage = Math.round((checkedItems / totalItems) * 100)

  return <footer className="stats">{totalItems} item on the shopping list, {checkedItems} items have been bought ({percentage}%)</footer>;
}


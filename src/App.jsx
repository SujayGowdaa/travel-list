/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function App() {
  const [item, setItem] = useState([]);

  const getNewItem = (item) => {
    setItem((p) => [...p, item]);
  };

  const removeItem = (id) => {
    setItem(item.filter((item) => item.id !== id));
    console.log(id);
  };

  const packItem = (id) => {
    console.log(id, 'packed');
    setItem((prevState) =>
      prevState.map((item) => {
        return item.id === id
          ? {
              ...item,
              packed: !item.packed,
            }
          : item;
      })
    );
  };

  return (
    <div className='app'>
      <Logo />
      <Form onGet={getNewItem} />
      <PackingList
        items={item}
        setItem={setItem}
        onRemove={removeItem}
        packItem={packItem}
      />
      <Stats item={item} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Far Away 💼</h1>;
}

function Form({ onGet }) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description) {
      return alert('Please enter item');
    } else {
      const newItem = {
        description,
        quantity,
        packed: false,
        id: Date.now(),
      };
      onGet(newItem);
      setDescription('');
      setQuantity(1);
    }
  }

  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need for your trip? 🙂</h3>
      <select
        name=''
        id=''
        value={quantity}
        onChange={(e) => setQuantity(+e.target.value)}
      >
        {Array.from({ length: 10 }, (_, i) => {
          return (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          );
        })}
      </select>
      <input
        type='text'
        placeholder='Add item...'
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <button>➕</button>
    </form>
  );
}

function PackingList({ items, setItem, onRemove, packItem }) {
  const [sort, setSort] = useState('input');

  let sortedItem;

  switch (sort) {
    case 'description':
      sortedItem = items
        .slice()
        .sort((a, b) => a.description.localeCompare(b.description));
      break;
    case 'packed':
      sortedItem = items
        .slice()
        .sort((a, b) => Number(a.packed) - Number(b.packed));
      break;

    default:
      sortedItem = items;
      break;
  }

  return (
    <div className='list'>
      <ul>
        {sortedItem.map((item) => {
          return (
            <Item
              onRemove={onRemove}
              key={item.id}
              item={item}
              packItem={packItem}
            />
          );
        })}
      </ul>
      <div className='actions'>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value='input'>Sort by input order</option>
          <option value='description'>Sort by description</option>
          <option value='packed'>Sort by packed status</option>
        </select>
        <button
          onClick={() => {
            let confirmed = window.confirm(
              '😱 Are you sure you want to delete all the items in the list? 😨'
            );
            confirmed && setItem([]);
          }}
        >
          Clear List
        </button>
      </div>
    </div>
  );
}

function Item({ item, onRemove, packItem }) {
  return (
    <li key={item.key}>
      <input
        type='checkbox'
        value={item.packed}
        onChange={() => packItem(item.id)}
      />
      <span style={item.packed ? { textDecoration: 'line-through' } : {}}>
        {`${item.quantity} `}
        {item.description}
      </span>
      <button onClick={() => onRemove(item.id)}>❌</button>
    </li>
  );
}

function Stats({ item }) {
  if (item.length === 0) {
    return (
      <footer className='stats'>
        Start adding some items to your packing list ⏩
      </footer>
    );
  }
  const numOfItems = item.length;
  const itemPacked = item.filter((i) => i.packed).length;
  const packPercentage = Math.floor((itemPacked / numOfItems) * 100);

  return (
    <footer className='stats'>
      {packPercentage === 100
        ? `🧳 You got everything ready to go ✈️`
        : `🧳 You have ${numOfItems} items on your list, and you have packed
      ${itemPacked} Item, (${packPercentage}%) of your items packed`}
    </footer>
  );
}

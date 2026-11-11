'use strict';

const products = [
  {id:1,name:'Fresh Red Tomatoes',category:'Vegetables',price:45,unit:'500g',emoji:'🍅',badge:'FARM FRESH',image:'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80'},
  {id:2,name:'Green Broccoli',category:'Vegetables',price:85,unit:'1 pc',emoji:'🥦',badge:'FRESH PICK',image:'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=600&q=80'},
  {id:3,name:'Sweet Red Apples',category:'Fruits',price:180,unit:'1 kg',emoji:'🍎',badge:'POPULAR',image:'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80'},
  {id:4,name:'Ripe Yellow Bananas',category:'Fruits',price:60,unit:'1 dozen',emoji:'🍌',badge:'BEST VALUE',image:'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=600&q=80'},
  {id:5,name:'Farm Fresh Milk',category:'Dairy & Eggs',price:95,unit:'1 litre',emoji:'🥛',badge:'DAILY ESSENTIAL',image:'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=600&q=80'},
  {id:6,name:'Farm Eggs',category:'Dairy & Eggs',price:145,unit:'12 pcs',emoji:'🥚',badge:'FRESH STOCK',image:'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=600&q=80'},
  {id:7,name:'Whole Wheat Bread',category:'Bakery',price:75,unit:'1 loaf',emoji:'🍞',badge:'BAKERY FRESH',image:'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'},
  {id:8,name:'Premium Basmati Rice',category:'Pantry',price:165,unit:'1 kg',emoji:'🍚',badge:'PANTRY PICK',image:'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80'},
  {id:9,name:'Fresh Chicken Breast',category:'Meat & Fish',price:260,unit:'500g',emoji:'🍗',badge:'CHILLED FRESH',image:'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=600&q=80'},
  {id:10,name:'Fresh Atlantic Salmon',category:'Meat & Fish',price:550,unit:'500g',emoji:'🐟',badge:'QUALITY PICK',image:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80'},
  {id:11,name:'Creamy Avocado',category:'Fruits',price:120,unit:'1 pc',emoji:'🥑',badge:'NUTRIENT RICH',image:'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80'},
  {id:12,name:'Orange Juice',category:'Beverages',price:130,unit:'1 litre',emoji:'🧃',badge:'REFRESHING',image:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=80'}
];
const categories = [
  {name:'Vegetables',emoji:'🥬',count:'2 fresh picks'}, {name:'Fruits',emoji:'🍊',count:'3 fresh picks'},
  {name:'Dairy & Eggs',emoji:'🥛',count:'2 essentials'}, {name:'Meat & Fish',emoji:'🐟',count:'2 fresh picks'},
  {name:'Bakery',emoji:'🥐',count:'1 bakery pick'}, {name:'Pantry',emoji:'🌾',count:'1 pantry pick'},
  {name:'Beverages',emoji:'🧃',count:'1 refreshing pick'}
];
const $ = (selector) => document.querySelector(selector);
const money = (amount) => `৳${Number(amount).toLocaleString('en-BD')}`;
let activeCategory = 'All';
let cart = loadCart();
let toastTimer;

function loadCart(){
  try {
    const saved = JSON.parse(localStorage.getItem('dailyShopCart') || '[]');
    if (!Array.isArray(saved)) return [];
    return saved.filter(item => products.some(p => p.id === item.id) && Number.isInteger(item.qty) && item.qty > 0)
      .map(item => ({id:item.id, qty:Math.min(item.qty,99)}));
  } catch { return []; }
}
function saveCart(){
  try { localStorage.setItem('dailyShopCart', JSON.stringify(cart)); }
  catch { showToast('Your browser could not save the basket on this device.'); }
}
function showToast(message){
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
function renderCategories(){
  $('#categoryGrid').innerHTML = categories.map((cat,index) => `
    <button class="category-card" data-category="${cat.name}" style="animation:cardIn .4s ${index*45}ms both">
      <span class="category-emoji">${cat.emoji}</span><b>${cat.name}</b><small>${cat.count}</small>
    </button>`).join('');
  $('#categoryGrid').addEventListener('click', event => {
    const card = event.target.closest('[data-category]'); if (!card) return;
    setCategory(card.dataset.category); $('#products').scrollIntoView({behavior:'smooth'});
  });
}
function renderFilters(){
  const names = ['All', ...categories.map(c => c.name)];
  $('#filterRow').innerHTML = names.map(name => `<button class="filter-chip ${activeCategory===name?'active':''}" data-filter="${name}">${name}</button>`).join('');
}
function setCategory(category){ activeCategory=category; renderFilters(); renderProducts(); }
function getVisibleProducts(){
  const term = $('#searchInput').value.trim().toLowerCase();
  let list = products.filter(p => (activeCategory==='All' || p.category===activeCategory) && `${p.name} ${p.category}`.toLowerCase().includes(term));
  const sort = $('#sortSelect').value;
  if(sort==='low') list.sort((a,b)=>a.price-b.price);
  if(sort==='high') list.sort((a,b)=>b.price-a.price);
  if(sort==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
  return list;
}
function renderProducts(){
  const list=getVisibleProducts();
  $('#productGrid').innerHTML=list.map((p,index)=>`
    <article class="product-card" style="animation-delay:${Math.min(index*45,250)}ms">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='block'"><span class="product-emoji" style="display:none">${p.emoji}</span><span class="product-badge">${p.badge}</span></div>
      <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><div class="product-meta">${p.unit} · Fresh selection</div><div class="product-bottom"><div class="product-price">${money(p.price)} <small>/ ${p.unit}</small></div><button class="add-button" data-add="${p.id}" aria-label="Add ${p.name} to basket">+</button></div></div>
    </article>`).join('');
  $('#emptyState').classList.toggle('hidden',list.length!==0);
}
function cartCount(){return cart.reduce((sum,item)=>sum+item.qty,0);}
function cartSubtotal(){return cart.reduce((sum,item)=>{const p=products.find(product=>product.id===item.id);return sum+(p?p.price*item.qty:0);},0);}
function deliveryCost(){return cartSubtotal()===0 || cartSubtotal()>=1500 ? 0 : 60;}
function addToCart(id){
  const existing=cart.find(item=>item.id===id);
  if(existing){if(existing.qty>=99){showToast('Maximum quantity reached.');return;}existing.qty++;}
  else cart.push({id,qty:1});
  saveCart();renderCart();const product=products.find(p=>p.id===id);showToast(`${product.name} added to your basket.`);
}
function updateQuantity(id,delta){
  const item=cart.find(row=>row.id===id);if(!item)return;
  item.qty+=delta;if(item.qty<=0)cart=cart.filter(row=>row.id!==id);if(item.qty>99)item.qty=99;
  saveCart();renderCart();
}
function removeItem(id){cart=cart.filter(row=>row.id!==id);saveCart();renderCart();showToast('Item removed from basket.');}
function renderCart(){
  const count=cartCount(),subtotal=cartSubtotal(),delivery=deliveryCost();
  $('#cartCount').textContent=count;$('#drawerCount').textContent=`(${count})`;
  $('#cartItems').innerHTML=cart.map(item=>{const p=products.find(row=>row.id===item.id);return `<div class="cart-line"><div class="cart-thumb"><img src="${p.image}" alt="" onerror="this.outerHTML='<span>${p.emoji}</span>'"></div><div><h4>${p.name}</h4><small>${money(p.price)} / ${p.unit}</small><div class="quantity-control"><button data-qty="${p.id}" data-delta="-1" aria-label="Decrease ${p.name}">−</button><span>${item.qty}</span><button data-qty="${p.id}" data-delta="1" aria-label="Increase ${p.name}">+</button></div><button class="remove-item" data-remove="${p.id}">Remove</button></div><div class="line-price">${money(p.price*item.qty)}</div></div>`;}).join('');
  $('#cartEmpty').classList.toggle('hidden',count!==0);$('#cartSummary').classList.toggle('hidden',count===0);
  $('#cartSubtotal').textContent=money(subtotal);$('#deliveryFee').textContent=delivery===0?'Free':money(delivery);$('#cartTotal').textContent=money(subtotal+delivery);$('#checkoutTotal').textContent=money(subtotal+delivery);
}
function openCart(){ $('#overlay').classList.add('show');$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');document.body.style.overflow='hidden'; }
function closeCart(){ $('#overlay').classList.remove('show');$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');if(!$('#checkoutModal').classList.contains('show'))document.body.style.overflow=''; }
function openCheckout(){if(!cart.length){showToast('Your basket is empty.');return;}closeCart();$('#checkoutModal').classList.add('show');document.body.style.overflow='hidden';$('#checkoutForm').classList.remove('hidden');$('#orderSuccess').classList.add('hidden');}
function closeCheckout(){ $('#checkoutModal').classList.remove('show');document.body.style.overflow=''; }

$('#filterRow').addEventListener('click',event=>{const chip=event.target.closest('[data-filter]');if(chip)setCategory(chip.dataset.filter);});
$('#productGrid').addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(button)addToCart(Number(button.dataset.add));});
$('#cartItems').addEventListener('click',event=>{const qty=event.target.closest('[data-qty]');const remove=event.target.closest('[data-remove]');if(qty)updateQuantity(Number(qty.dataset.qty),Number(qty.dataset.delta));if(remove)removeItem(Number(remove.dataset.remove));});
$('#searchInput').addEventListener('input',renderProducts);$('#sortSelect').addEventListener('change',renderProducts);
$('#clearFilters').addEventListener('click',()=>{activeCategory='All';$('#searchInput').value='';$('#sortSelect').value='featured';renderFilters();renderProducts();});
$('#focusSearch').addEventListener('click',()=>{$('#products').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('#searchInput').focus(),450);});
$('#openCart').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);$('#overlay').addEventListener('click',closeCart);
$('#startShopping').addEventListener('click',()=>{closeCart();$('#products').scrollIntoView({behavior:'smooth'});});
$('#checkoutButton').addEventListener('click',openCheckout);$('#closeCheckout').addEventListener('click',closeCheckout);
$('#checkoutModal').addEventListener('click',event=>{if(event.target===$('#checkoutModal'))closeCheckout();});
$('#checkoutForm').addEventListener('submit',async event=>{
  event.preventDefault();if(!cart.length){showToast('Your basket is empty.');closeCheckout();return;}
  const form=event.currentTarget;if(!form.reportValidity())return;
  const data=new FormData(form), button=form.querySelector('.place-order');
  const paymentMap={'Cash on Delivery':'cod','bKash':'bkash','Nagad':'nagad','Rocket':'rocket','Card':'card'};
  button.disabled=true;button.textContent='Processing…';
  try {
    const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.get('name'),phone:data.get('phone'),address:data.get('address'),district:data.get('district'),note:data.get('note'),payment:paymentMap[data.get('payment')],items:cart.map(i=>({id:i.id,qty:i.qty}))})});
    const result=await response.json();if(!response.ok)throw new Error(result.error||'Could not place order.');
    if(result.redirectUrl){window.location.assign(result.redirectUrl);return;}
    $('#successMessage').textContent=`Thank you, ${data.get('name')}. Your order #${result.order.order_number} has been received. Total: ${money(result.order.total)}. Payment: Cash on delivery.`;
    form.classList.add('hidden');$('#orderSuccess').classList.remove('hidden');cart=[];saveCart();renderCart();form.reset();
  } catch(error) { showToast(error.message); }
  finally { button.disabled=false;button.innerHTML='Place order <span>→</span>'; }
});
$('#finishOrder').addEventListener('click',closeCheckout);
$('#newsletterForm').addEventListener('submit',event=>{event.preventDefault();const email=$('#newsletterEmail').value.trim();if(!email)return;fetch('/api/newsletter',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})}).then(r=>r.json()).then(d=>$('#newsletterMessage').textContent=d.message||d.error).catch(()=>$('#newsletterMessage').textContent='Could not subscribe right now.');event.currentTarget.reset();});
$('#menuToggle').addEventListener('click',()=>{$('.desktop-nav').classList.toggle('open');});
$('.desktop-nav').addEventListener('click',event=>{if(event.target.closest('a'))$('.desktop-nav').classList.remove('open');});
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeCart();closeCheckout();$('.desktop-nav').classList.remove('open');}});
$('#year').textContent=new Date().getFullYear();
renderCategories();renderFilters();renderProducts();renderCart();

// Load authoritative catalogue from PostgreSQL when served by Daily Shop backend.
(async()=>{if(location.protocol==='file:')return;try{const r=await fetch('/api/products');if(!r.ok)return;const d=await r.json();if(!Array.isArray(d.products)||!d.products.length)return;products.splice(0,products.length,...d.products.map(p=>({id:Number(p.id),name:p.name,category:p.category,price:Number(p.price),unit:p.unit,emoji:p.emoji||'🛒',badge:p.badge||'FRESH PICK',image:p.image_url||'',stock:Number(p.stock)})));cart=cart.filter(i=>products.some(p=>p.id===i.id));saveCart();renderCategories();renderFilters();renderProducts();renderCart();}catch(e){console.warn('Catalogue API unavailable; preview products remain active.',e.message)}})();

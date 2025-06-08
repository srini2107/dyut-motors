'use client';
import { useParams } from 'next/navigation';
import ProductCard from '../../component/ProductCard';
import cardStyles from '../../component/ProductCard.module.css';
import pageStyles from './CategoryPage.module.css';

const productsByCategory = {
  propellers: [
    { id: 'p1', name: 'Carbon Fiber Propeller', price: 2500, image: '/img2.jpg', description: 'Lightweight, high-strength propeller.' },
    { id: 'p2', name: 'Carbon Fiber Propeller', price: 2500, image: '/img3.jpg', description: 'Lightweight, high-strength propeller.' },
    { id: 'p3', name: 'Carbon Fiber Propeller', price: 2500, image: '/img4.jpg', description: 'Lightweight, high-strength propeller.' },
    { id: 'p4', name: 'Carbon Fiber Propeller', price: 2500, image: '/img5.jpg', description: 'Lightweight, high-strength propeller.' },
  ],
  motors: [
    { id: 'm1', name: 'High Torque Motor', price: 7800, image: '/img6.jpg', description: 'Powerful brushless motor.' },
    { id: 'm2', name: 'High Torque Motor', price: 7800, image: '/img6.jpg', description: 'Powerful brushless motor.' },
    { id: 'm3', name: 'High Torque Motor', price: 7800, image: '/img6.jpg', description: 'Powerful brushless motor.' },
    { id: 'm4', name: 'High Torque Motor', price: 7800, image: '/img6.jpg', description: 'Powerful brushless motor.' },
  ],
  avionics: [
    { id: 'a1', name: 'Flight Controller', price: 5000, image: '/img8.jpg', description: 'Advanced avionics for drones.' },
    { id: 'a2', name: 'Flight Controller', price: 5000, image: '/img8.jpg', description: 'Advanced avionics for drones.' },
    { id: 'a3', name: 'Flight Controller', price: 5000, image: '/img8.jpg', description: 'Advanced avionics for drones.' },
    { id: 'a4', name: 'Flight Controller', price: 5000, image: '/img8.jpg', description: 'Advanced avionics for drones.' },
  ],
};

export default function CategoryPage() {
  const params = useParams();
  const { category } = params;
  const products = productsByCategory[category] || [];

  return (
    <main className={pageStyles.main}>
      <div className={pageStyles.wrapper}>
        <h1 className={pageStyles.heading}>
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </h1>
        <div className={cardStyles.container}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} category={category} />
          ))}
        </div>
      </div>
    </main>
  );
}
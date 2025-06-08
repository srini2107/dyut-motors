'use client';

import { useParams } from 'next/navigation';
import ProductDetails from '../../../component/ProductDetails';

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

export default function ProductDetailsPage() {
    const params = useParams();
    const { category, productId } = params;

    const product = (productsByCategory[category] || []).find(p => p.id === productId);

    return <ProductDetails product={product} />;
}
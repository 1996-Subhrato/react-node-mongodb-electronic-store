import React from 'react';
import { Award, Truck, ShieldCheck, BrainCircuit } from 'lucide-react';
import './ValueProp.css';

const ValueProp = () => {
    const props = [
        {
            icon: <ShieldCheck size={32} />,
            title: 'Genuine Products Guaranteed',
            desc: 'Every product is 100% authentic, sourced directly from official brand distributors.'
        },
        {
            icon: <Truck size={32} />,
            title: 'Fast & Secure Delivery',
            desc: 'Insured shipping with real-time tracking — delivered to your door in 2–5 days.'
        },
        {
            icon: <Award size={32} />,
            title: 'Official Brand Partners',
            desc: 'Authorized reseller for Apple, Samsung, Sony, and 50+ top tech brands.'
        },
        {
            icon: <BrainCircuit size={32} />,
            title: 'AI Product Advisor',
            desc: 'Get personalized tech recommendations powered by our advanced AI assistant.'
        }
    ];

    return (
        <section className="value-prop-landing">
            <div className="container prop-grid">
                {props.map((prop, index) => (
                    <div key={index} className="prop-card glass">
                        <div className="prop-icon">
                            {prop.icon}
                        </div>
                        <h3>{prop.title}</h3>
                        <p>{prop.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ValueProp;

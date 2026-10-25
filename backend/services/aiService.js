import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config({ override: true });

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Category Fallback Data for Electronics
 */
const CATEGORY_TECH_DATA = {
    'Mobiles': {
        features: 'High-refresh-rate displays, flagship multi-camera systems, all-day battery life, and 5G connectivity.',
        specs: 'High-performance processor, fast charging, water resistance, and secure biometric authentication.',
        ecosystem: 'Compatible with standard Qi wireless chargers, USB-C cables, and modern smartwatch ecosystems.'
    },
    'Laptops': {
        features: 'High-resolution retina display, all-day battery endurance, quiet thermal management, and precision trackpad.',
        specs: 'Multi-core high efficiency architecture, fast NVMe SSD storage, and unified memory.',
        ecosystem: 'Supports external 4K/6K monitors, Thunderbolt accessories, and USB-C Power Delivery.'
    },
    'Headphones': {
        features: 'Industry-leading Active Noise Cancellation (ANC), ambient sound pass-through, and hi-res audio streaming.',
        specs: 'Long battery life with quick charging, multi-point Bluetooth pairing, and low-latency audio drivers.',
        ecosystem: 'Works with iOS, Android, macOS, and Windows via Bluetooth and 3.5mm audio jacks.'
    },
    'Smart Watches': {
        features: 'Always-On display, continuous heart rate & SpO2 tracking, workout detection, and GPS routing.',
        specs: 'Water resistant to 50m, fast magnetic charging, and daily battery management.',
        ecosystem: 'Syncs health metrics with smartphone health apps and delivers wrist notifications.'
    },
    'Accessories': {
        features: 'Ergonomic design, multi-device connectivity, long battery lifespan, and durable build quality.',
        specs: 'Precision tracking sensors, programmable buttons, and cross-platform compatibility.',
        ecosystem: 'Connects seamlessly via Bluetooth Low Energy and USB wireless dongles.'
    }
};

/**
 * Contextual AI Response Generator for Specific Product
 */
export const getProductAIResponse = async (product, question) => {
    // 1. Check for Real AI
    if (openai) {
        try {
            const systemPrompt = `
                You are a Senior Electronics Specialist and Tech Advisor at "TechZone".
                You are providing advice specifically about ${product.name} (Category: ${product.category_name}).
                
                Product Description: ${product.description || 'Premium consumer electronics device.'}
                ${product.health_benefits ? `Key Hardware Features: ${product.health_benefits}` : ''}
                ${product.nutrition_info ? `Technical Specifications: ${product.nutrition_info}` : ''}
                ${product.recommended_intake ? `OS & Connectivity: ${product.recommended_intake}` : ''}
                ${product.ai_context_notes ? `Additional Context: ${product.ai_context_notes}` : ''}
                
                RULES:
                1. ONLY answer questions related to this electronic device, its features, specs, performance, battery life, or comparisons.
                2. If the user asks an unrelated question, politely redirect them to ask about ${product.name}.
                3. Keep answers concise, factual, and user-friendly.
                4. Use bullet points for readability.
            `;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                temperature: 0.7,
                max_tokens: 350
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI Error, falling back to Mock:', error.message);
        }
    }

    // 2. Mock Fallback Logic for Electronics
    console.log('🤖 Mock Electronics AI Active for:', product.name);
    
    const catData = CATEGORY_TECH_DATA[product.category_name] || {
        features: 'Modern tech capabilities and durable design.',
        specs: 'High efficiency hardware and reliable performance.',
        ecosystem: 'Standard multi-device compatibility.'
    };

    const sanitize = (val) => (!val || val === 'null' || val === 'undefined' ? null : val);

    const features = sanitize(product.health_benefits) || catData.features;
    const specs = sanitize(product.nutrition_info) || catData.specs;
    const connectivity = sanitize(product.recommended_intake) || catData.ecosystem;
    const notes = sanitize(product.ai_context_notes) || product.description;

    const q = question.toLowerCase();

    if (q.includes('feature') || q.includes('highlight') || q.includes('what are') || q.includes('benefit') || q.includes('why')) {
        let resp = `Here are the standout features of the **${product.name}**:\n\n`;
        resp += `• **Hardware Highlights**: ${features}\n`;
        resp += `• **Overview**: ${product.description || notes}\n`;
        if (specs) resp += `• **Technical Profile**: ${specs}`;
        return resp;
    } else if (q.includes('battery') || q.includes('power') || q.includes('charge') || q.includes('backup') || q.includes('life')) {
        return `**Battery & Power for ${product.name}**:\n\n• **Specification**: ${specs}\n• **Charging & Support**: ${connectivity}\n• **Usage**: Optimized for all-day reliability under active workloads.`;
    } else if (q.includes('compatib') || q.includes('os') || q.includes('connect') || q.includes('bluetooth') || q.includes('port')) {
        return `**Compatibility & Connectivity for ${product.name}**:\n\n• **OS & Ports**: ${connectivity}\n• **Ecosystem**: Integrates seamlessly with your existing setup and devices.`;
    } else if (q.includes('compare') || q.includes('similar') || q.includes('versus') || q.includes('vs') || q.includes('worth')) {
        return `**Why choose the ${product.name}?**\n\n• **Core Advantage**: ${features}\n• **Hardware**: ${specs}\n• **Verdict**: At ₹${product.price?.toLocaleString('en-IN') || product.price}, it stands out in the ${product.category_name} category for build quality and performance.`;
    } else {
        return `I am your TechZone AI Specialist for the **${product.name}** (${product.category_name}).\n\n• **Description**: ${product.description || 'Premium electronics device'}\n• **Key Features**: ${features}\n• **Specs**: ${specs}\n\nAsk me about battery life, device compatibility, camera/performance specs, or comparisons!`;
    }
};

/**
 * General Storewide AI Shopping Advisor
 */
export const getGeneralAIResponse = async (question, products) => {
    // 1. Check for Real AI
    if (openai) {
        try {
            const productContext = products.map(p => 
                `- ${p.name} (Category: ${p.category_name}, Price: ₹${p.price}, Features: ${p.health_benefits || p.description})`
            ).join('\n');

            const systemPrompt = `
                You are the Senior Shopping Advisor at "TechZone" Electronics Store.
                Help customers find the best laptops, smartphones, headphones, smartwatches, and accessories from our inventory.
                
                AVAILABLE PRODUCTS IN OUR STORE:
                ${productContext}

                RULES:
                1. Provide helpful, objective buying guidance based on the user's needs or budget.
                2. ALWAYS recommend specific products from the available store catalog above.
                3. Use concise markdown with bullet points.
                4. Tone: Friendly, knowledgeable, and professional.
            `;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: question }
                ],
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('OpenAI General Error, falling back to Mock:', error.message);
        }
    }

    // 2. Mock Fallback for General Electronics Queries
    const q = question.toLowerCase();

    const findMatches = (keywords) => {
        return products.filter(p => {
            const text = `${p.name} ${p.health_benefits} ${p.description} ${p.category_name}`.toLowerCase();
            return keywords.some(k => text.includes(k));
        });
    };

    if (q.includes('phone') || q.includes('mobile') || q.includes('camera') || q.includes('smartphone')) {
        const matches = findMatches(['iphone', 'samsung', 'galaxy', 'mobile']);
        let resp = "For smartphones, we carry industry-leading flagship models:\n\n";
        matches.forEach(p => {
            resp += `• **${p.name}** (₹${p.price?.toLocaleString('en-IN')}) — ${p.health_benefits || p.description}\n`;
        });
        resp += "\nAre you looking for an iOS device or a flagship Android with an S Pen?";
        return resp;
    } else if (q.includes('laptop') || q.includes('macbook') || q.includes('coding') || q.includes('work') || q.includes('student')) {
        const matches = findMatches(['laptop', 'macbook']);
        let resp = "For productivity, development, and portable computing, here are our top laptops:\n\n";
        matches.forEach(p => {
            resp += `• **${p.name}** (₹${p.price?.toLocaleString('en-IN')}) — ${p.description}\n`;
        });
        resp += "\nWould you like more details on battery life or port connectivity?";
        return resp;
    } else if (q.includes('headphone') || q.includes('audio') || q.includes('music') || q.includes('noise') || q.includes('earphone')) {
        const matches = findMatches(['sony', 'headphone', 'audio']);
        let resp = "Looking for premium sound and noise cancellation? Check out:\n\n";
        matches.forEach(p => {
            resp += `• **${p.name}** (₹${p.price?.toLocaleString('en-IN')}) — Industry-leading Active Noise Cancelling (ANC).\n`;
        });
        return resp;
    } else if (q.includes('watch') || q.includes('fitness') || q.includes('wearable') || q.includes('tracking')) {
        const matches = findMatches(['watch', 'apple watch']);
        let resp = "For fitness and smart wrist notifications, we recommend:\n\n";
        matches.forEach(p => {
            resp += `• **${p.name}** (₹${p.price?.toLocaleString('en-IN')}) — Advanced health sensors and GPS tracking.\n`;
        });
        return resp;
    } else if (q.includes('mouse') || q.includes('accessory') || q.includes('keyboard')) {
        const matches = findMatches(['logitech', 'mouse', 'accessory']);
        let resp = "For workspace productivity accessories:\n\n";
        matches.forEach(p => {
            resp += `• **${p.name}** (₹${p.price?.toLocaleString('en-IN')}) — High-precision tracking and quiet clicks.\n`;
        });
        return resp;
    } else if (q.includes('budget') || q.includes('cheap') || q.includes('under') || q.includes('price') || q.includes('15000') || q.includes('5000')) {
        const affordable = products.slice().sort((a, b) => a.price - b.price);
        let resp = "Here are some of our best value electronics:\n\n";
        affordable.slice(0, 3).forEach(p => {
            resp += `• **${p.name}** — ₹${p.price?.toLocaleString('en-IN')}\n`;
        });
        resp += "\nTell me your target budget, and I'll find the best device for you!";
        return resp;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
        return "Hello! Welcome to **TechZone AI Assistant**. I can help you choose the best smartphones, laptops, noise-cancelling headphones, smartwatches, and accessories. What gadget are you looking for today?";
    } else {
        return `Welcome to TechZone! We have ${products.length} premium electronic devices across Mobiles, Laptops, Headphones, Smart Watches, and Accessories. Tell me your budget or desired features, and I'll recommend the ideal match!`;
    }
};

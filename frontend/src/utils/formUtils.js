/**
 * Prevents numeric inputs from changing value when scrolled over while focused.
 * Usage: <input type="number" onWheel={disableNumberInputScroll} />
 */
export const disableNumberInputScroll = (e) => {
    // Blur the element to stop the scroll interaction
    e.target.blur();
    
    // Optional: Re-focus after a tiny delay if you want to keep the cursor active
    // but typically blur is sufficient and safer for "mistake prevention"
};

/**
 * Alternative approach: prevent default without blurring.
 * Requires { passive: false } if using native event listeners.
 */
export const handleNumberScrollPrevention = (e) => {
    e.preventDefault();
};

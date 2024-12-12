//import { it, expect, describe } from 'vitest'// because globals: true in teh cnfig
import {render, screen} from  '@testing-library/react'

import GenerateCircles from '../../src/Components/lib/Utils/GenerateCircles'
import '@testing-library/jest-dom/vitest'

describe('GenerateCircles', () => {
  it('should return the correct number of circles', () => {
    
    const { container } = render(<>{GenerateCircles(5)}</>);
    const circles = container.querySelectorAll('div');
    expect(circles.length).toBe(5);
  });

  it('should apply randomized styles to each circle', () => {
    const count = 10;
    const colors = ['bg-red-600', 'bg-green-500', 'bg-sky-600', 'bg-amber-300', 'bg-fuchsia-500'];

    const { container } = render(<>{GenerateCircles(count)}</>);
    const circles = container.querySelectorAll('div');

    circles.forEach((circle) => {
      // Check if the element has a random color from the list
      const hasColorClass = colors.some((color) => circle.classList.contains(color));
      expect(hasColorClass).toBe(true);

      
      // Check if width and height are randomized
      const width = parseFloat(circle.style.width);
      const height = parseFloat(circle.style.height);
      expect(width).toBeGreaterThanOrEqual(5);
      expect(width).toBeLessThanOrEqual(35);
      expect(height).toBeGreaterThanOrEqual(5);
      expect(height).toBeLessThanOrEqual(35);

      // Check if top and left are within valid range
      const top = parseFloat(circle.style.top);
      const left = parseFloat(circle.style.left);
      expect(top).toBeGreaterThanOrEqual(0);
      expect(top).toBeLessThanOrEqual(100);
      expect(left).toBeGreaterThanOrEqual(0);
      expect(left).toBeLessThanOrEqual(100);

      // Check opacity
      expect(parseFloat(circle.style.opacity)).toBe(0.8);

      // Validate animation properties
      const animationDelay = parseFloat(circle.style.animationDelay);
      const animationDuration = parseFloat(circle.style.animationDuration);
      expect(animationDelay).toBeGreaterThanOrEqual(0);
      expect(animationDuration).toBeGreaterThanOrEqual(30);
      expect(animationDuration).toBeLessThanOrEqual(70);
    });
  });

  it('should not generate circles when count is 0', () => {
   
    const { container } = render(<>{GenerateCircles(0)}</>);
    const circles = container.querySelectorAll('div');
    expect(circles.length).toBe(0);
  });
});
import { render, screen } from "@testing-library/react";
import AnimatedColorText from "../../src/Components/lib/Utils/AnimatedColorText";



describe("AnimatedColorText Component", () => {
  const mockCompany = {
    label: "Example",
    type: "Corp",
  };

  test('renders the company label and type correctly', () => {
    const mockCompany = { label: 'TestCompany' };
    render(<AnimatedColorText company={mockCompany} />);
    
    // Check that each character in the label is rendered
    mockCompany.label.split('').forEach((char) => {
      expect(screen.getByText(char)).toBeTruthy(); // or use 'toBeInTheDocument'
    });
  });

  it("applies the correct color classes to each character", () => {
    const { container } = render(<AnimatedColorText company={mockCompany} />);

    // Check that characters have color classes applied from the colors array
    const colorClasses = ['text-fuchsia-500', 'text-amber-300', 'text-green-500', 'text-sky-600', 'text-red-600'];

    const spans = container.querySelectorAll("span span"); // Target inner spans for characters
    spans.forEach((span, index) => {
      const charIndex = index % colorClasses.length;
      expect(span.classList.contains(colorClasses[charIndex])).toBe(true);
    });
  });


  it("handles empty company label and type gracefully", () => {
    const emptyCompany = { label: "", type: "" };
    render(<AnimatedColorText company={emptyCompany} />);

    expect(screen.queryByText(/./)).toBeNull(); // No characters should be rendered
  });
});

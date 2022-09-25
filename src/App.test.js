import { render, screen } from "@testing-library/react";
import App from "./App";

it("renders without crashing", () => {
	render(<App />);
	const loginText = screen.getByText(/log in/i);
	expect(loginText).toBeInTheDocument();
});

import { redirect } from "next/navigation";
import { vi } from "vitest";

import HomePage from "../page";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("HomePage", () => {
  it("redirects to /exercise1", () => {
    HomePage();

    expect(redirect).toHaveBeenCalledTimes(1); 
    expect(redirect).toHaveBeenCalledWith("/exercise1"); 
  });
});
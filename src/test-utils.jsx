import React from "react";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { FormProvider } from "./context/FormContext";

export function renderWithProviders(ui, { route = "/step-1" } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <FormProvider>{ui}</FormProvider>
    </MemoryRouter>
  );
}

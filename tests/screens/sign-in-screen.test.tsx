import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import Login from "../../src/app/sign-in";

jest.mock("../../src/contexts/AuthContext", () => {
  return {
    useAuth: () => ({
      login: jest.fn(),
      register: jest.fn(),
    }),
  };
});

describe("Login Screen", () => {
  it("Renders all login fields", () => {
    const { getByPlaceholderText, getByText } = render(<Login />);

    expect(getByPlaceholderText("Digite seu email")).toBeTruthy();
    expect(getByPlaceholderText("Digite sua senha")).toBeTruthy();

    expect(getByText("Entrar")).toBeTruthy();
  });

  it("Allow to switch to registration", () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    fireEvent.press(getByText("Não tem uma conta? Cadastre-se"));
    expect(getByText("Cadastrar")).toBeTruthy();
    expect(getByPlaceholderText("Nome de usuário")).toBeTruthy();
  });

  it("With invalid inputs", () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText("Digite seu email");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const loginButton = getByText("Entrar");

    fireEvent.changeText(emailInput, "email");
    fireEvent.changeText(passwordInput, "12");
    fireEvent.press(loginButton);

    expect(getByText("Email inválido")).toBeTruthy();
    expect(getByText("Senha incorreta")).toBeTruthy();
  });

  it("With valid inputs", async () => {
    const { getByText, getByPlaceholderText, queryByText } = render(<Login />);
    const emailInput = getByPlaceholderText("Digite seu email");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const loginButton = getByText("Entrar");

    fireEvent.changeText(emailInput, "email@email");
    fireEvent.changeText(passwordInput, "123456");
    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(queryByText("Email inválido")).toBeNull();
    expect(queryByText("Senha incorreta")).toBeNull();
  });

  it("mostra o ActivityIndicator ao clicar no botão", async () => {
    const { getByText, getByTestId, getByPlaceholderText } = render(<Login />);
    const emailInput = getByPlaceholderText("Digite seu email");
    const passwordInput = getByPlaceholderText("Digite sua senha");
    const loginButton = getByText("Entrar");

    fireEvent.changeText(emailInput, "email@email");
    fireEvent.changeText(passwordInput, "123456");
    act(() => {
      fireEvent.press(loginButton);
    });
    await waitFor(async () => {
      expect(getByTestId("loading-indicator")).toBeTruthy();
    });
  });
});

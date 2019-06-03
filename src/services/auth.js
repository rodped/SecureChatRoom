import api from "./api";

export const TOKEN_KEY = "accessToken";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const login = (accessToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
};
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};
export const getUsername = async e => {
  const accessToken = {
    'headers': {
      'x-access-token': getToken()
    }
  }
  const result = await api.get("http://localhost:8080/api/test/user", accessToken);
  return result.data.user.username;
}
export const getRole = async e => {
  const accessToken = {
    'headers': {
      'x-access-token': getToken()
    }
  }
  const result = await api.get("http://localhost:8080/api/test/user", accessToken);
  const name = result.data.user.roles.map(role => { return role.name })
  console.log("role: " + name)
  return name;
}
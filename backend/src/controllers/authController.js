import { env } from "../config/env.js";
import * as authService from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: env.cookieSecure,
  sameSite: "none",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.cookie("token", result.token, cookieOptions);
    res.json({ success: true, data: result.user });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getCurrentUser(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export function logout(req, res) {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("token");
  res.json({ success: true, data: true });
}

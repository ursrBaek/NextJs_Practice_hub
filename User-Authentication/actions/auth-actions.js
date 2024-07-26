"use server";

import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const errors = {};

  if (!email.includes("@")) {
    errors.email = "유효한 이메일 주소를 입력해 주세요.";
  }

  if (password.trim().length < 8) {
    errors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  const hashedPassword = hashUserPassword(password);
  try {
    createUser(email, hashedPassword);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return {
        errors: {
          email: "입력하신 계정이 이미 존재합니다.",
        },
      };
    }

    throw error;
  }

  redirect("/training");
}

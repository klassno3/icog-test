import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    await prisma.users.findMany();
    const { name, email, password } = await request.json();

    // Check if the email already exists
    const existingUser = await prisma.users.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return NextResponse.json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: unknown) {
    return NextResponse.json({ message: error }, { status: 600 });
  }
}

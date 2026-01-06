'use server'

import { z } from 'zod'
import { prisma } from '@/lib/db'
import { hash, compare } from 'bcryptjs'
import { createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function signup(prevState: any, formData: FormData) {
  const result = signupSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password, name } = result.data

  const existingUser = await prisma.user.findUnique({
    where: { email },
  })

  if (existingUser) {
    return {
      errors: {
        email: ['User with this email already exists'],
      },
    }
  }

  const hashedPassword = await hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  await createSession(user.id)
  
  // Redirect to onboarding to create business profile
  redirect('/onboarding')
}

export async function login(prevState: any, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData))

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user || !user.password) {
    return {
      message: 'Invalid email or password',
    }
  }

  const passwordMatch = await compare(password, user.password)

  if (!passwordMatch) {
    return {
      message: 'Invalid email or password',
    }
  }

  await createSession(user.id)
  
  // Check if user has a business
  const business = await prisma.business.findUnique({
    where: { userId: user.id },
  })
  
  if (!business) {
    redirect('/onboarding')
  }

  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { verifySession } from '@/lib/session'

export default async function StripeReturnPage() {
  const session = await verifySession()

  const business = await prisma.business.findUnique({
    where: { userId: session.userId },
  })

  if (!business || !business.stripeConnectAccountId) {
    redirect('/dashboard')
    // return null; // unreachable
  }

  // Check if onboarding is actually complete
  const account = await stripe.accounts.retrieve(business.stripeConnectAccountId)

  if (account.details_submitted) {
    await prisma.business.update({
      where: { id: business.id },
      data: { stripeOnboardingComplete: true },
    })
  }

  redirect('/dashboard')
}

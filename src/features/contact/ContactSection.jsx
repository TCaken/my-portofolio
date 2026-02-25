import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Mail } from 'lucide-react'
import { contactFormSchema } from './schema'
import { Button } from '@/components/ui/button'
import { Input, Textarea } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Use your Formspree form ID from https://formspree.io/ → Your Forms → form endpoint
const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID || ''
const FORMSPREE_ENDPOINT = FORMSPREE_FORM_ID
  ? `https://formspree.io/f/${FORMSPREE_FORM_ID}`
  : ''

async function submitToFormspree(data) {
  if (!FORMSPREE_ENDPOINT) throw new Error('Formspree form ID not configured. Add VITE_FORMSPREE_FORM_ID to .env')
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

/**
 * Contact form with React Hook Form, Zod validation, and Formspree via TanStack Mutation.
 * Semantic form and ARIA for MX.
 */
export function ContactSection() {
  const mutation = useMutation({
    mutationFn: submitToFormspree,
    onSuccess: () => {
      reset()
    },
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { email: '', message: '' },
  })

  return (
    <section
      id="contact"
      role="region"
      aria-labelledby="contact-heading"
      className="scroll-mt-20"
    >
      <h2
        id="contact-heading"
        className="mb-8 flex items-center gap-3 text-2xl font-bold text-white"
      >
        <Mail className="h-7 w-7 shrink-0" aria-hidden />
        Get in Touch
      </h2>

      <Card className="max-w-md border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader>
          <CardTitle id="contact-form-title" className="text-lg text-white">
            Send a message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            noValidate
            aria-labelledby="contact-form-title"
            aria-describedby={mutation.isError ? 'form-error' : undefined}
          >
            {mutation.isError && (
              <p
                id="form-error"
                role="alert"
                className="mb-4 text-sm text-red-300"
              >
                {mutation.error?.message ?? 'Something went wrong. Please try again.'}
              </p>
            )}
            {mutation.isSuccess && (
              <p role="status" className="mb-4 text-sm text-emerald-300">
                Message sent successfully. I&apos;ll get back to you soon.
              </p>
            )}

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-1.5 block text-sm font-medium text-white/90"
                >
                  Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1 text-sm text-red-300">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-medium text-white/90"
                >
                  Message
                </label>
                <Textarea
                  id="contact-message"
                  placeholder="Your message..."
                  rows={4}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  {...register('message')}
                />
                {errors.message && (
                  <p id="message-error" role="alert" className="mt-1 text-sm text-red-300">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={mutation.isPending}
              className="mt-6 w-full"
              aria-busy={mutation.isPending}
            >
              {mutation.isPending ? 'Sending…' : 'Send message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

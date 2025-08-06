import NewsletterForm from '@/components/newsletter-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <NewsletterForm />
      </div>
    </main>
  )
}

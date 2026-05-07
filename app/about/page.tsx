import type { Metadata } from 'next'
import { Users, Target, Award, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'من نحن',
  description: 'تعرف على منصة TIX للتجارة الإلكترونية في مصر',
}

export default function AboutPage() {
  const cards = [
    { icon: Target, title: 'رؤيتنا', desc: 'أن نكون المنصة الأولى للتسوق الإلكتروني في مصر.' },
    { icon: Award, title: 'مهمتنا', desc: 'توفير منتجات عالية الجودة بأسعار تنافسية مع خدمة توصيل ممتازة.' },
    { icon: Users, title: 'فريقنا', desc: 'فريق شاب ومتحمس يعمل لتحسين تجربة التسوق الإلكتروني يومياً.' },
    { icon: Globe, title: 'تغطيتنا', desc: 'نوصل لجميع محافظات مصر خلال 2-5 أيام عمل.' },
  ]

  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main>
        {/* Hero Banner */}
        <section className="bg-gradient-to-l from-dark to-dark-light text-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-4">من نحن</h1>
            <p className="text-xl text-gray-200">
              TIX هي منصة تجارة إلكترونية مصرية تهدف إلى تقديم أفضل تجربة تسوق عبر الإنترنت لعملائنا في جميع أنحاء مصر.
            </p>
          </div>
        </section>

        {/* Cards */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cards.map((item) => (
              <div key={item.title} className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-shadow text-center">
                <item.icon className="w-12 h-12 text-dark mx-auto mb-4" />
                <h3 className="text-xl font-bold text-black mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

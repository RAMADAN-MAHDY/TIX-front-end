import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'سياسة الخصوصية' }

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <main className="container mx-auto px-4 py-12">
        <div className="mb-12 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 text-black">سياسة الخصوصية</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-4">
            <p className="text-gray-700 leading-relaxed">نحن في TIX نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
            <h3 className="text-black font-bold text-xl">1. البيانات التي نجمعها</h3>
            <p className="text-gray-700 leading-relaxed">نجمع البيانات اللازمة لمعالجة طلباتك: الاسم، البريد الإلكتروني، رقم الهاتف، عنوان التوصيل.</p>
            <h3 className="text-black font-bold text-xl">2. استخدام البيانات</h3>
            <p className="text-gray-700 leading-relaxed">تُستخدم بياناتك لمعالجة الطلبات وتحسين تجربة التسوق. لا نشارك بياناتك مع أطراف ثالثة إلا لأغراض التوصيل والدفع.</p>
            <h3 className="text-black font-bold text-xl">3. أمان البيانات</h3>
            <p className="text-gray-700 leading-relaxed">نستخدم تقنيات تشفير متقدمة لحماية بياناتك المالية والشخصية.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

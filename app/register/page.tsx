'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus } from 'lucide-react'
import { toast } from 'react-toastify'
import { useAuth } from '@/context/AuthContext'

const registerSchema = z.object({
  name: z.string().min(3, 'الاسم يجب أن يكون 3 أحرف على الأقل'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  phone: z.string().min(10, 'رقم الهاتف غير صحيح').regex(/^[0-9]+$/, 'أرقام فقط'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { register: authRegister } = useAuth()
  const router = useRouter()

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authRegister(data.name, data.email, data.phone, data.password)
      toast.success('تم إنشاء الحساب بنجاح')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message || 'فشل إنشاء الحساب')
    }
  }

  const fields = [
    { name: 'name' as const, label: 'الاسم الكامل', icon: User, type: 'text', placeholder: 'محمد أحمد', dir: 'rtl' },
    { name: 'email' as const, label: 'البريد الإلكتروني', icon: Mail, type: 'email', placeholder: 'email@example.com', dir: 'ltr' },
    { name: 'phone' as const, label: 'رقم الهاتف', icon: Phone, type: 'tel', placeholder: '01xxxxxxxxx', dir: 'ltr' },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-bg" dir="rtl">
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-dark rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <span className="text-white font-bold text-2xl">TIX</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">إنشاء حساب جديد</h1>
          <p className="text-center text-text-muted mb-8">سجل الآن وتمتع بمميزات حصرية</p>

          <div className="bg-white rounded-lg border border-border p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {fields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold mb-2">{field.label}</label>
                <div className="relative">
                  <input
                    type={field.type}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className="input-field text-sm pr-4 pl-10 focus:border-dark focus:shadow-none"
                    dir={field.dir}
                  />
                  <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                </div>
                {errors[field.name] && (
                  <p className="text-error text-xs mt-1">{errors[field.name]?.message}</p>
                )}
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  placeholder="••••••••"
                  className="input-field text-sm pr-10 pl-10 focus:border-dark focus:shadow-none"
                  dir="ltr"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-faint hover:text-text transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  placeholder="••••••••"
                  className="input-field text-sm pr-4 pl-10 focus:border-dark focus:shadow-none"
                  dir="ltr"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-faint" />
              </div>
              {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 rounded-lg bg-dark text-white hover:bg-dark-light transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isSubmitting ? (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  إنشاء الحساب
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            لديك حساب بالفعل؟{' '}
            <Link href="/login" className="text-dark hover:underline font-semibold">
              تسجيل الدخول
            </Link>
          </p>
          </div>
        </div>
      </main>
    </div>
  )
}

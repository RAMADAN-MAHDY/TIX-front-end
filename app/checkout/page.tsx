"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronDown,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { formatCurrency } from "@/utils/helpers";
import type { ShippingCity, PaymentMethod, CartSummary } from "@/utils/Types/common";
import { Button } from "@/components/ui/button";

export default function CheckoutPage() {
  const router = useRouter();
  const { state: authState } = useAuth();
  const { state: cartState, refreshCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<string | number>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ 
    fullName: authState.user?.name || "", 
    email: authState.user?.email || "",
    city: "",
    address: "", 
    phone: "", 
    order_note: "" 
  });
  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedCity || !formData.address || !formData.phone || !formData.fullName || !formData.city) {
        toast.error("يرجى إكمال جميع البيانات المطلوبة");
        return;
      }
    }
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // City dropdown
  const [cities, setCities] = useState<ShippingCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<ShippingCity | null>(null);
  const [cityOpen, setCityOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const cityRef = useRef<HTMLDivElement>(null);

  // Summary & payment methods
  const [summary, setSummary] = useState<CartSummary | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Auth redirect
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      window.location.href = "/login?redirect=/checkout";
    }
  }, [authState.isLoading, authState.isAuthenticated]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, pmRes, citiesRes] = await Promise.all([
          api.get("/summary"),
          api.get("/payment-methods"),
          api.get("/shipping/cities"),
        ]);

        if (summaryRes.data.status) setSummary(summaryRes.data.data);
        if (pmRes.data.status && Array.isArray(pmRes.data.data)) {
          setPaymentMethods(pmRes.data.data);
          if (pmRes.data.data.length > 0) setPaymentMethod(pmRes.data.data[0].id);
        }
        if (citiesRes.data.status) {
          setCities(Array.isArray(citiesRes.data.data) ? citiesRes.data.data : []);
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      }
    };
    fetchData();
  }, [authState.isAuthenticated]);

  // Click outside to close city dropdown
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleCitySelect = async (city: ShippingCity) => {
    setSelectedCity(city);
    setCityOpen(false);
    setCitySearch("");
    try {
      const fd = new FormData();
      fd.append("vsoft_city_id", String(city.id));
      const res = await api.post("/summary", fd);
      if (res.data.status) setSummary(res.data.data);
    } catch (error) {
      console.error("Error updating summary:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCity || !formData.address.trim() || !formData.phone.trim() || !formData.fullName.trim() || !formData.city.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", formData.fullName);
      fd.append("email", formData.email);
      fd.append("phone", formData.phone);
      fd.append("vsoft_city_id", String(selectedCity.id));
      fd.append("city", formData.city);
      fd.append("shipping_address", formData.address);
      fd.append("payment_method_id", String(paymentMethod));
      if (formData.order_note) fd.append("order_note", formData.order_note);

      const checkoutRes = await api.post("/checkout", fd);
      if (checkoutRes.data.status) {
        toast.success("تم إرسال طلبك بنجاح!");
        const orderData = checkoutRes.data.data;
        if (orderData.payment_url) {
          window.location.href = orderData.payment_url;
        } else {
          setTimeout(() => router.push("/account/orders"), 1500);
        }
      } else {
        toast.error(checkoutRes.data.message || "خطأ في إتمام الطلب");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "حدث خطأ في إتمام الطلب");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCities = cities.filter((c) =>
    c.name.toLowerCase().includes(citySearch.toLowerCase()),
  );

  if (authState.isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 flex justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background" dir="rtl">
      <main className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold">الدفع والتسليم</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mr-2 transition-colors duration-300 ${
                        step <= currentStep ? 'bg-[#000]' : 'bg-gray-300'
                      }`}>
                        {step < currentStep ? <CheckCircle className="w-6 h-6" /> : step}
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${step <= currentStep ? 'text-black' : 'text-gray-400'}`}>
                          {step === 1 && 'بيانات الشحن'}
                          {step === 2 && 'طريقة الدفع'}
                          {step === 3 && 'مراجعة الطلب'}
                        </p>
                      </div>
                      {step < 3 && (
                        <div className={`h-1 flex-1 mr-2 ${step < currentStep ? 'bg-[#000]' : 'bg-gray-300'}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Shipping Info */}
              {currentStep === 1 && (
                <div className="bg-white rounded-lg border border-border p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-6 text-black">بيانات الشحن</h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-black">الاسم الكامل *</label>
                        <input 
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="أدخل اسمك الكامل"
                          className="w-full h-12 px-3 border border-border rounded-lg text-sm outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-black">البريد الإلكتروني *</label>
                        <input 
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="w-full h-12 px-3 border border-border rounded-lg text-sm outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">رقم الهاتف *</label>
                      <input 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+20 1XX XXX XXXX"
                        className="w-full h-12 px-3 border border-border rounded-lg text-sm outline-none focus:border-black"
                        dir="ltr"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div ref={cityRef} className="relative">
                        <label className="block text-sm font-semibold mb-2 text-black">المحافظة *</label>
                        <button
                          type="button"
                          className="w-full h-12 flex items-center justify-between px-3 border border-border rounded-lg text-sm bg-white"
                          onClick={() => setCityOpen(!cityOpen)}
                        >
                          <span className={selectedCity ? "text-black" : "text-gray-400"}>
                            {selectedCity ? selectedCity.name : "اختر المحافظة"}
                          </span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        
                        {cityOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                            <div className="p-2 border-b border-border">
                              <div className="relative">
                                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={citySearch}
                                  onChange={(e) => setCitySearch(e.target.value)}
                                  placeholder="ابحث عن المحافظة..."
                                  className="w-full h-10 border border-border rounded text-sm outline-none"
                                  autoFocus
                                />
                              </div>
                            </div>
                            <div className="max-h-52 overflow-y-auto">
                              {filteredCities.map((city) => (
                                <button
                                  key={city.id}
                                  type="button"
                                  className={`w-full text-right px-4 py-2.5 text-sm hover:bg-gray-50 flex justify-between items-center ${
                                    selectedCity?.id === city.id ? "bg-gray-50 font-bold" : ""
                                  }`}
                                  onClick={() => handleCitySelect(city)}
                                >
                                  <span>{city.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {formatCurrency(city.price)}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2 text-black">المدينة *</label>
                        <input 
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          placeholder="أدخل المدينة"
                          className="w-full h-12 px-3 border border-border rounded-lg text-sm outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2 text-black">العنوان *</label>
                      <input 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="أدخل العنوان بالتفصيل (الشارع والرقم والبناء)"
                        className="w-full h-12 px-3 border border-border rounded-lg text-sm outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={handleNextStep}
                    className="w-full bg-black text-white hover:bg-black/90 h-12 mt-6 font-semibold rounded-lg"
                  >
                    التالي: اختر طريقة الدفع
                  </Button>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {currentStep === 2 && (
                <div className="bg-white rounded-lg border border-border p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-6 text-black">طريقة الدفع</h2>

                  <div className="space-y-3 mb-6">
                    {paymentMethods.map((method) => (
                      <label 
                        key={method.id}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-black transition-colors"
                        style={{ borderColor: paymentMethod === method.id ? 'black' : '' }}
                      >
                        <input 
                          type="radio" 
                          name="payment" 
                          className="w-4 h-4 text-black accent-black" 
                          onChange={() => setPaymentMethod(method.id)}
                          checked={paymentMethod === method.id}
                        />
                        <div className="mr-4">
                          <p className="font-semibold">{method.name}</p>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePreviousStep}
                      variant="outline"
                      className="flex-1 h-12 font-semibold rounded-lg"
                    >
                      السابق
                    </Button>
                    <Button 
                      onClick={handleNextStep}
                      className="flex-1 bg-black text-white hover:bg-black/90 h-12 font-semibold rounded-lg"
                    >
                      التالي: مراجعة الطلب
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Order Review */}
              {currentStep === 3 && (
                <div className="bg-white rounded-lg border border-border p-6 mb-6">
                  <h2 className="text-2xl font-bold mb-6 text-black">مراجعة الطلب</h2>

                  <div className="space-y-6 mb-6">
                    <div>
                      <h3 className="font-semibold mb-2">عنوان الشحن</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {formData.fullName} • {formData.phone}<br/>
                        {formData.address}, {formData.city}, {selectedCity?.name}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">طريقة الدفع</h3>
                      <p className="text-sm text-muted-foreground">
                        {paymentMethods.find(m => m.id === paymentMethod)?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={handlePreviousStep}
                      variant="outline"
                      className="flex-1 h-12 font-semibold rounded-lg"
                    >
                      السابق
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 bg-black text-white hover:bg-black/90 h-12 font-semibold rounded-lg"
                    >
                      {isSubmitting ? "جاري المعالجة..." : "تأكيد الطلب"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-lg font-bold mb-4">ملخص الطلب</h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-border text-black">
                  {cartState.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </span>
                      <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {cartState.items.length === 0 && (
                    <p className="text-xs text-gray-400">لا توجد منتجات في السلة</p>
                  )}
                </div>

                {summary && (
                  <div className="space-y-4 text-black">
                    <div className="space-y-3 mb-4 pb-4 border-b border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">السعر الفرعي</span>
                        <span className="font-semibold">{formatCurrency(summary.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">التوصيل</span>
                        <span className="font-semibold">
                          {summary.shipping_zone ? formatCurrency(summary.shipping_zone.price) : "—"}
                        </span>
                      </div>
                      {summary.discount > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">الخصم</span>
                          <span className="font-semibold text-green-600">-{formatCurrency(summary.discount)}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between mb-4 pb-4 border-b border-border items-center">
                      <span className="font-bold">الإجمالي</span>
                      <span className="text-2xl font-bold">{formatCurrency(summary.total)}</span>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                      سيتم تسليم طلبك خلال 1-3 أيام عمل
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

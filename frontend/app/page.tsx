import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">🚗 AutoHub</div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/services" className="text-gray-700 hover:text-blue-600 transition">
                Каталог
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition">
                О проекте
              </Link>
              <Link href="/business" className="text-gray-700 hover:text-blue-600 transition">
                Для бизнеса
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Войти
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Регистрация
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Найдите лучший автосервис
            <br />
            <span className="text-blue-600">в вашем городе</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Честные отзывы, рейтинги и цены от реальных клиентов.
            <br />
            Более 1500 проверенных автосервисов по всей России.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-4 p-2 bg-white rounded-xl shadow-lg">
              <input
                type="text"
                placeholder="Выберите город..."
                className="flex-1 px-6 py-4 border-0 focus:outline-none text-lg"
              />
              <input
                type="text"
                placeholder="Что нужно сделать?"
                className="flex-1 px-6 py-4 border-0 focus:outline-none text-lg"
              />
              <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                Найти
              </button>
            </div>
          </div>

          {/* Popular Cities */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="text-gray-600">Популярные города:</span>
            {['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Новосибирск'].map((city) => (
              <button
                key={city}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">1,500+</div>
              <div className="text-gray-600">Автосервисов</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Отзывов</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Городов</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">12,000+</div>
              <div className="text-gray-600">Пользователей</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
          Как это работает?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-xl font-semibold mb-2">1. Найдите</h3>
            <p className="text-gray-600">
              Используйте фильтры для поиска подходящего автосервиса в вашем городе
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ⭐
            </div>
            <h3 className="text-xl font-semibold mb-2">2. Сравните</h3>
            <p className="text-gray-600">
              Читайте отзывы, сравнивайте рейтинги и цены на услуги
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              ✅
            </div>
            <h3 className="text-xl font-semibold mb-2">3. Выберите</h3>
            <p className="text-gray-600">
              Позвоните или запишитесь онлайн в лучший автосервис
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold text-blue-400 mb-4">🚗 AutoHub</div>
          <p className="text-gray-400 mb-4">
            Агрегатор автосервисов России
          </p>
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/about" className="hover:text-white transition">О проекте</Link>
            <Link href="/contacts" className="hover:text-white transition">Контакты</Link>
            <Link href="/privacy" className="hover:text-white transition">Политика конфиденциальности</Link>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            © 2025 AutoHub. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  )
}

/**
 * Email Service
 *
 * This is a basic email service implementation.
 * For production, configure SMTP settings in .env file:
 *
 * EMAIL_HOST=smtp.gmail.com
 * EMAIL_PORT=587
 * EMAIL_USER=your-email@gmail.com
 * EMAIL_PASSWORD=your-app-password
 * EMAIL_FROM=AutoHub <noreply@autohub.ru>
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send email
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Email (dev mode):')
      console.log('To:', options.to)
      console.log('Subject:', options.subject)
      console.log('Body:', options.html)
      return true
    }

    // For production, implement actual email sending with nodemailer
    // Example implementation:
    /*
    const nodemailer = require('nodemailer')

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })
    */

    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, firstName: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Добро пожаловать в AutoHub!</h1>
      <p>Привет, ${firstName}!</p>
      <p>Спасибо за регистрацию на платформе AutoHub - вашем помощнике в поиске автосервисов.</p>
      <p>Теперь вы можете:</p>
      <ul>
        <li>Находить и сравнивать автосервисы в вашем городе</li>
        <li>Читать и оставлять отзывы</li>
        <li>Добавлять автосервисы в избранное</li>
      </ul>
      <p>Если у вас есть вопросы, свяжитесь с нами по адресу support@autohub.ru</p>
      <p>С уважением,<br>Команда AutoHub</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Добро пожаловать в AutoHub!',
    html,
  })
}

/**
 * Send service approved email
 */
export async function sendServiceApprovedEmail(
  email: string,
  serviceName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981;">Ваш автосервис одобрен!</h1>
      <p>Поздравляем!</p>
      <p>Ваш автосервис "${serviceName}" прошел модерацию и опубликован на платформе AutoHub.</p>
      <p>Теперь пользователи могут найти ваш автосервис в каталоге и оставить отзывы.</p>
      <p>Рекомендации:</p>
      <ul>
        <li>Регулярно обновляйте информацию об автосервисе</li>
        <li>Отвечайте на отзывы клиентов</li>
        <li>Добавьте качественные фотографии</li>
        <li>Актуализируйте прайс-лист</li>
      </ul>
      <p>С уважением,<br>Команда AutoHub</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Ваш автосервис одобрен - AutoHub',
    html,
  })
}

/**
 * Send review approved email
 */
export async function sendReviewApprovedEmail(
  email: string,
  firstName: string,
  serviceName: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #10b981;">Ваш отзыв опубликован!</h1>
      <p>Привет, ${firstName}!</p>
      <p>Ваш отзыв о "${serviceName}" прошел модерацию и опубликован на платформе AutoHub.</p>
      <p>Спасибо за то, что помогаете другим пользователям делать правильный выбор!</p>
      <p>С уважением,<br>Команда AutoHub</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: 'Ваш отзыв опубликован - AutoHub',
    html,
  })
}

/**
 * Send owner response notification
 */
export async function sendOwnerResponseEmail(
  email: string,
  firstName: string,
  serviceName: string,
  response: string
) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #3b82f6;">Владелец ответил на ваш отзыв</h1>
      <p>Привет, ${firstName}!</p>
      <p>Владелец автосервиса "${serviceName}" ответил на ваш отзыв:</p>
      <div style="background: #f3f4f6; padding: 15px; border-left: 4px solid #3b82f6; margin: 20px 0;">
        ${response}
      </div>
      <p>Вы можете просмотреть ответ на сайте AutoHub.</p>
      <p>С уважением,<br>Команда AutoHub</p>
    </div>
  `

  return sendEmail({
    to: email,
    subject: `Ответ на ваш отзыв о ${serviceName} - AutoHub`,
    html,
  })
}

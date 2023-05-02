import TelegramBot from 'node-telegram-bot-api'
import { config } from 'dotenv'
config()
const bot = new TelegramBot(process.env.TELEGRAM_API as string, {
    polling: true
})

export { bot as telegramBot }
import express from 'express'
import { config } from 'dotenv'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { urlencoded } from 'body-parser'
import { telegramBot } from './config/telegram'
config()
const app = express()

app.use(express.json())
app.use(urlencoded({ extended: false }))
app.listen(process.env.PORT || 8080)

const WSS_ENDPOINT = process.env.WS_PROVIDER as string
const HTTP_ENDPOINT = process.env.HTTP_PROVIDER as string
const chatId = process.env.CHAT_ID as unknown as number

const solanaConnection = new Connection(HTTP_ENDPOINT, {
    wsEndpoint:WSS_ENDPOINT
})

const trackWallet = async () => {
    const wallet = new PublicKey(`FNhPWcjJ98ZVbadvGYktR4soc74pEXw4WhSAmy48tYu7`)
    const subscriptionId = await solanaConnection.onLogs(wallet, 
        async ({ signature, logs }) => {
            const sig = await solanaConnection.getParsedTransaction(signature)
            let balance = (sig?.meta?.preBalances[0]! - sig?.meta?.postBalances[0]!)
            let amount = balance
            let action = `sent`
            if(balance < 0) {
                amount = -1 * (balance)
                action = `received`
            }
            let asset = `SOL`
            const accountKeys = sig?.transaction.message.accountKeys 
            let message = `Successfully transferred ${amount/LAMPORTS_PER_SOL} ${asset} to ${accountKeys![1].pubkey.toString()}`
            telegramBot.sendMessage(chatId, message)
            console.log(message)
        }
    )
}

trackWallet()

telegramBot.on('message', (message) => {
    console.log(message.chat.id)
})
import express, { Request, Response, json, urlencoded } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

import exampleRouter from './routes/example'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 3000

const limiter = rateLimit({
   windowMs: 60 * 1000, // 1 minute
   max: 100, // Limit each IP to 100 requests per window
   standardHeaders: true, // Return rate limit info in the RateLimit-* headers
   legacyHeaders: false, // Disable the X-RateLimit-* headers
})
app.use(limiter)

// Essential middleware
app.use(cookieParser())
app.use(helmet())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))
app.use((_req, res, next) => {
   res.set('X-XSS-Protection', '1; mode=block')
   res.set('X-Frame-Options', 'deny')
   res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
   next()
})
app.use(express.json())
app.use('/api/example', exampleRouter)

app.get('/', (_req: Request, res: Response) => {
   res.send('Welcome to Express with TypeScript!')
})

app.listen(PORT, () => {
   console.log(`🚀 Server running at http://localhost:${PORT}`)
   console.log('Available APIs:')
   app._router.stack.forEach((middleware: any) => {
      if (middleware.route) {
         console.log(` - ${Object.keys(middleware.route.methods)[0].toUpperCase()} ${middleware.route.path}`)
      }
   })
})

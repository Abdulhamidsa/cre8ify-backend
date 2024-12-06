import { Router, Request, Response } from 'express'

const router: Router = Router()

router.get('/', (_req: Request, res: Response) => {
   res.send('This is an example API endpoint')
})

export default router

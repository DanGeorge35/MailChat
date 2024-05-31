/* eslint-disable @typescript-eslint/no-extraneous-class */
import { type Router } from 'express'

class RouteHelper {
  static initRoutes (routes: any[], router: Router): any {
    for (const route of routes) {
      const { method, path, handler } = route;
      (router as any)[method](`${path}`, handler)
    }

    router.get('/', (req: any, res: any) => {
      res.setHeader('content-type', 'application/json')
      const report = {
        message: 'Welcome to IRechargeTest',
        code: 200
      }
      res.status(200).send(report)
    })

    router.get('/health', (req: any, res: any) => {
      res.setHeader('content-type', 'application/json')
      const report = {
        message: 'Good Health',
        code: 200
      }
      res.status(200).send(report)
    })
  }
}

export default RouteHelper

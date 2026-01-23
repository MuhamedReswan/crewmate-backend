import { Router } from "express";
import v1ServiceBoyRouter  from "./serviceBoy.router"
import v1AdminRouter  from "./admin.router"
import v1VendorRouter  from "./vendor.router"
import v1CommonRouter  from "./common.router"


import v1ServiceBoyAuthRouter  from "./serviceBoyAuth.router"
import v1VendorAuthRouter  from "./vendorAuth.router"
import v1AdminAuthRouter  from "./adminAuth.router"

const router = Router() 

  router.use('/auth/service-boy', v1ServiceBoyAuthRouter);
  router.use('/auth/vendor', v1VendorAuthRouter);
  router.use('/auth/admin',v1AdminAuthRouter);
  
  router.use('/admin',v1AdminRouter);
  router.use('/service-boy', v1ServiceBoyRouter);
  router.use('/vendor', v1VendorRouter);
  router.use('/', v1CommonRouter);


export { router as V1Router}
import { authJS } from './auth'
import { handleStore } from './seller'
import { addProd } from './addProd'
import { updateProd } from './updateProd'
import { home } from './home'
import { shopSingle } from './shopSingle'
import { myAcc } from './myAcc'
import { cart } from './cart'

authJS()
handleStore()
addProd()
updateProd()
home()
shopSingle()
myAcc()
cart()
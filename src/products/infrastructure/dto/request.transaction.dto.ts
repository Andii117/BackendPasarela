export class RequestTransactionDTO {
  //product details
  productId:                string
  productName:              string
  productPrice:             number
  //card details
  cardNumber:               string  
  cardHolder:               string
  cardExpiry:               string
  cardCvv:                  string
  //transaction details
  deliveryName:             string
  deliveryAddress:          string
  deliveryCity:             string
  deliveryPhone:            string
  clientIp:                 string
  deliveryEmail:            string
}



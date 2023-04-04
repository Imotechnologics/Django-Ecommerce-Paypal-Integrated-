from django.shortcuts import render
from .models import *
from django.http import HttpResponse, JsonResponse
import json
import datetime
from .utils import *

def product_view(request, pk):
    data=cartData(request)
    cartItems=data['cartItems']
    order=data['order']
    items=data['items'] 

    product = Product.objects.get(id=pk)
    context = {'product': product, 'items':items, 'order':order, 'cartItems': cartItems}
    return render(request, 'description.html', context)

def store(request):

    data=cartData(request)
    cartItems=data['cartItems']

    products=Product.objects.all()
    context={'products':products, 'cartItems': cartItems}
    return render(request, 'store.html', context)

def cart(request):

    data=cartData(request)
    cartItems=data['cartItems']
    order=data['order']
    items=data['items'] 

    context={'items':items, 'order':order, 'cartItems': cartItems}
    return render(request, 'cart.html', context)

def checkout(request):
    data=cartData(request)
    cartItems=data['cartItems']
    order=data['order']
    items=data['items'] 

    context={'items':items, 'order':order, 'cartItems': cartItems}
    return render(request, 'checkout.html', context)


def updateItem(request):
    data=json.loads(request.body)
    productId=data['productId']
    action=data['action']

    print('Action:', action)
    print('Product:', productId)


    customer = request.user.customer
    product=Product.objects.get(id=productId)
    order, created = Order.objects.get_or_create(customer=customer, complete=False)

    orderItem, created = OrderItem.objects.get_or_create(order=order, product=product)

    if action == 'add':
        orderItem.quantity = (orderItem.quantity + 1)
    elif action == 'remove':
        orderItem.quantity = (orderItem.quantity - 1)

    orderItem.save()

    if orderItem.quantity <= 0:
        orderItem.delete()

    return JsonResponse('Item was added', safe=False)


def processOrder(request):
    transaction_id = datetime.datetime.now().timestamp()
    data = json.loads(request.body)

    if request.user.is_authenticated:
        customer=request.user.customer
        order, created = Order.objects.get_or_create(customer=customer, complete=False)

    else:
        customer, order = guestOrder(request, data)

    total=float(data['form']['total'])
    order.transaction_id=transaction_id

    #taking care from website builders
    if total == order.get_cart_total:
        order.complete=True
    order.save()

    if order.shipping==True:
        ShippingAddress.objects.create(
            customer=customer,
            order=order,
            address=data['shipping']['address'],
            city=data['shipping']['city'],
            state=data['shipping']['state'],
            zipcode=data['shipping']['zipcode'],
        )

    return JsonResponse('Payment complete!...', safe=False)
"""
def ubicacion(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        latitude = data['latitude']
        longitude = data['longitude']
        
        print(f"Latitude: {latitude}, Longitude: {longitude}")
        
        # Aquí puedes hacer cualquier otra operación que necesites con la información de ubicación
        
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=400)
"""
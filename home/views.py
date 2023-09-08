from django.shortcuts import render,redirect,HttpResponse
from django.contrib.auth import logout,authenticate,login
from django.contrib.auth.models import User
from django.contrib import messages
import json
import urllib
import os
import threading
lock = threading.Lock()
# Create your views here.
def log(request):
    if(request.method=="POST"):
        email=request.POST.get("email")
        password=request.POST.get("password")
        try:
            username = User.objects.get(email=email.lower()).username
            print(username)
            user=authenticate(username=username,password=password)
            if user is not None:
                login(request,user)
                return redirect("/")
        except User.DoesNotExist:
            messages.error(request,"username does not exists")
            print("username does not exists")
            return redirect("/login")
    return render(request,'login.html')

def register(request):
    if(request.method=="POST"):
       name=request.POST.get("name")
       email=request.POST.get("email")
       password=request.POST.get("password")
       Cpassword=request.POST.get("password2")
       if(password==Cpassword):
           try:
               u=User.objects.get(username=name.lower())
               messages.error(request,"username already exists")
               print("username already exists")
               return redirect("/register")
           except User.DoesNotExist:
               try:
                    p=User.objects.get(email=email.lower())
                    messages.error(request,"mail already exists")
                    print("mail already exists")
                    return redirect("/register")
                    
               except User.DoesNotExist:
                   user=User.objects.create_user(username=name,password=password,email=email)
                   login(request,user)
                   print("logged in")
                   return redirect("/")
               
       else:
           messages.error(request,"Not same password")
           print("Not same password")
           return redirect("/register")

    return render(request,"register.html")

def signup(request):
    logout(request)
    return redirect('/login')

def index(request):
    
    if request.user.is_anonymous:
        return redirect('/login')
    usernm=request.user.username
    usernames={}
    usernames["talked"]=[]
    usernames["Ntalked"]=[]
    un = User.objects.values_list('username', flat=True)
    if os.path.exists(os.path.join("static/profile/"+usernm+".json")):
        with open(os.path.join("static/profile/"+usernm+".json")) as f:
            fi=f.read()
        fi=json.loads(fi)
        for i in fi:
            usernames["talked"].append(i)
        for i in un:
            if i not in fi:
                usernames["Ntalked"].append(i)
    else:
         for i in un:
            usernames["Ntalked"].append(i)

    
    
    return render(request,"index.html",context={'user':request.user.username,'talked':usernames["talked"],'Ntalked':usernames["Ntalked"]})



def save_logs(request):
    
    lock.acquire()
    print("skhafkfdhlahlfhkl")
    data=request.POST.get("data")
    owner=request.POST.get("owner")
    receiver=request.POST.get("receiver")
    lt=[receiver,owner]
    lt=sorted(lt)
    if os.path.exists("static/logs/"+lt[0]+"-"+lt[1]+".json"):
        with open("static/logs/"+lt[0]+"-"+lt[1]+".json","r") as f:
            file=f.read()
        file=json.loads(file)
        file.append({"owner":owner,"receiver":receiver,"data":data})

        
    else:
        file=[{"owner":owner,"receiver":receiver,"data":data}]
    
    with open("static/logs/"+lt[0]+"-"+lt[1]+".json","w") as f:
        json.dump(file,f)
    lock.release()
    return HttpResponse("i received it")


def save_profile(request):
    data=request.POST.get("data")
    owner=request.POST.get("owner")
    print(os.path.join("static/profile/",owner+".json"))
    if os.path.exists(os.path.join("static/profile/",owner+".json")):
        with open(os.path.join("static/profile/",owner+".json"),"r") as f:
            file=f.read()
        file=json.loads(file)
        file.append(data)

    else:
        file=[data]
        
    with open(os.path.join("static/profile/",owner+".json"),"w") as f:
        json.dump(file,f)
    return HttpResponse("i received it")

def group(request,room_name):
    print("hello group")
    return render(request,"gp.html",context={'user':request.user.username,'room_name':room_name})
